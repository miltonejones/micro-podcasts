import { Injectable, signal } from '@angular/core';
import { IPodcast } from './models';

const STORAGE_KEY = 'currentPodcast';

/**
 * Holds the podcast a user just clicked into, so the `detail` remote (which only
 * receives a `feedUrl` route param) has artwork/title/artist for its header without
 * re-fetching. Persisted so a hard refresh on `/detail/:feedUrl` still works, mirroring
 * the old app persisting its whole state object (including `currentPodcast`) to localStorage.
 */
@Injectable({
  providedIn: 'root',
})
export class PodcastSelectionService {
  readonly current = signal<IPodcast | null>(this.load());

  select(podcast: IPodcast): void {
    this.current.set(podcast);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podcast));
  }

  private load(): IPodcast | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
