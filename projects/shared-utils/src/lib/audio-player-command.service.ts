import { Injectable, effect, inject, signal } from '@angular/core';
import { generateClient } from 'aws-amplify/api';
import { BehaviorSubject } from 'rxjs';
import './amplify-config';
import { AuthService } from './auth.service';
import { ITrack, ITrackMemory } from './models';
import {
  TrackProgressRecord,
  createTrackProgress,
  listTrackProgress,
  updateTrackProgress,
} from './track-progress.graphql';

const TRACK_MEMORY_KEY = 'trackMemory';
const FINISHED_THRESHOLD = 98;
const REMOTE_SYNC_DEBOUNCE_MS = 5000;

const client = generateClient();

@Injectable({
  providedIn: 'root',
})
export class AudioPlayerCommandService {
  private readonly auth = inject(AuthService);

  private queue: ITrack[] = [];

  readonly currentTrack$ = new BehaviorSubject<ITrack | null>(null);
  readonly queue$ = new BehaviorSubject<ITrack[]>([]);

  readonly trackMemory = signal<Record<string, ITrackMemory>>(this.loadTrackMemory());

  /** Guids already confirmed to exist as a remote TrackProgress record (create vs. update). */
  private readonly remoteGuids = new Set<string>();
  private pendingGuid: string | null = null;
  private pendingTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    effect(() => {
      if (this.auth.isAuthenticated()) {
        this.loadRemote();
      } else {
        this.remoteGuids.clear();
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flushPending();
      }
    });
  }

  /** Starts playing a track, optionally alongside sibling tracks for next/previous. */
  openTrack(track: ITrack, queue: ITrack[] = [track]): void {
    this.queue = queue;
    this.queue$.next(queue);
    this.currentTrack$.next(track);
  }

  /** Jumps directly to a track already in the current queue. */
  selectTrack(track: ITrack): void {
    this.currentTrack$.next(track);
  }

  /** Moves to the next (1) or previous (-1) track in the queue. Returns false if there isn't one. */
  advance(offset: number): boolean {
    const current = this.currentTrack$.value;
    const index = this.queue.findIndex((track) => track.guid === current?.guid);
    const nextTrack = index === -1 ? undefined : this.queue[index + offset];

    if (!nextTrack) {
      return false;
    }

    this.currentTrack$.next(nextTrack);
    return true;
  }

  clearQueue(): void {
    this.queue = [];
    this.queue$.next([]);
    this.currentTrack$.next(null);
  }

  getProgress(guid: string): number {
    return this.trackMemory()[guid]?.progress ?? 0;
  }

  isFinished(guid: string): boolean {
    return this.getProgress(guid) > FINISHED_THRESHOLD;
  }

  setProgress(guid: string, progress: number, podcastFeedUrl: string): void {
    const next = {
      ...this.trackMemory(),
      [guid]: { progress, podcastFeedUrl, updatedAt: Date.now() },
    };
    this.trackMemory.set(next);
    localStorage.setItem(TRACK_MEMORY_KEY, JSON.stringify(next));
    this.scheduleRemoteSync(guid);
  }

  /** Progress of the most recent unfinished episode belonging to a podcast, for its card's progress bar. */
  getPodcastProgress(podcastFeedUrl: string): number {
    const memory = this.trackMemory();
    const entry = Object.values(memory).find(
      (m) => m.podcastFeedUrl === podcastFeedUrl && m.progress < FINISHED_THRESHOLD + 1,
    );
    return entry?.progress ?? 0;
  }

  private loadTrackMemory(): Record<string, ITrackMemory> {
    try {
      return JSON.parse(localStorage.getItem(TRACK_MEMORY_KEY) || '{}');
    } catch {
      return {};
    }
  }

  /** Pulls remote progress on sign-in, reconciles with local state (most recently updated wins), and pushes up any local-only history. */
  private async loadRemote(): Promise<void> {
    try {
      const response = await client.graphql({ query: listTrackProgress });
      const result = response as { data: { listTrackProgress: { items: TrackProgressRecord[] } } };
      const items = result.data.listTrackProgress.items;

      const merged = { ...this.trackMemory() };
      this.remoteGuids.clear();

      for (const item of items) {
        this.remoteGuids.add(item.id);
        const localEntry = merged[item.id];
        const remoteUpdatedAt = new Date(item.updatedAt).getTime();
        if (!localEntry || (localEntry.updatedAt ?? 0) <= remoteUpdatedAt) {
          merged[item.id] = {
            progress: item.progress,
            podcastFeedUrl: item.podcastFeedUrl,
            updatedAt: remoteUpdatedAt,
          };
        }
      }

      this.trackMemory.set(merged);
      localStorage.setItem(TRACK_MEMORY_KEY, JSON.stringify(merged));

      for (const [guid, entry] of Object.entries(merged)) {
        if (!this.remoteGuids.has(guid)) {
          this.pushRemote(guid, entry.progress, entry.podcastFeedUrl);
        }
      }
    } catch (err) {
      console.error('Failed to load playback progress', err);
    }
  }

  private scheduleRemoteSync(guid: string): void {
    if (!this.auth.isAuthenticated()) {
      return;
    }

    if (this.pendingGuid && this.pendingGuid !== guid) {
      this.flushPending();
    }

    this.pendingGuid = guid;
    clearTimeout(this.pendingTimer);
    this.pendingTimer = setTimeout(() => this.flushPending(), REMOTE_SYNC_DEBOUNCE_MS);
  }

  private flushPending(): void {
    const guid = this.pendingGuid;
    this.pendingGuid = null;
    clearTimeout(this.pendingTimer);
    this.pendingTimer = undefined;

    if (!guid || !this.auth.isAuthenticated()) {
      return;
    }

    const entry = this.trackMemory()[guid];
    if (entry) {
      this.pushRemote(guid, entry.progress, entry.podcastFeedUrl);
    }
  }

  private async pushRemote(guid: string, progress: number, podcastFeedUrl: string): Promise<void> {
    try {
      if (this.remoteGuids.has(guid)) {
        await client.graphql({
          query: updateTrackProgress,
          variables: { input: { id: guid, progress } },
        });
      } else {
        await client.graphql({
          query: createTrackProgress,
          variables: { input: { id: guid, progress, podcastFeedUrl } },
        });
        this.remoteGuids.add(guid);
      }
    } catch (err) {
      console.error('Failed to sync playback progress', err);
    }
  }
}
