import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITrack, ITrackMemory } from './models';

const TRACK_MEMORY_KEY = 'trackMemory';
const FINISHED_THRESHOLD = 98;

@Injectable({
  providedIn: 'root',
})
export class AudioPlayerCommandService {
  private queue: ITrack[] = [];

  readonly currentTrack$ = new BehaviorSubject<ITrack | null>(null);
  readonly queue$ = new BehaviorSubject<ITrack[]>([]);

  readonly trackMemory = signal<Record<string, ITrackMemory>>(this.loadTrackMemory());

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
    const next = { ...this.trackMemory(), [guid]: { progress, podcastFeedUrl } };
    this.trackMemory.set(next);
    localStorage.setItem(TRACK_MEMORY_KEY, JSON.stringify(next));
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
}
