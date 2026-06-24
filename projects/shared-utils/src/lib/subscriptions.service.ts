import { Injectable, signal } from '@angular/core';
import { IPodcast } from './models';

const STORAGE_KEY = 'rss-subs';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionsService {
  readonly subscriptions = signal<IPodcast[]>(this.load());

  isSubscribed(podcast: IPodcast | null | undefined): boolean {
    if (!podcast) return false;
    return this.subscriptions().some((sub) => sub.feedUrl === podcast.feedUrl);
  }

  toggle(podcast: IPodcast): 'subscribed' | 'unsubscribed' {
    const current = this.subscriptions();
    const existingIndex = current.findIndex((sub) => sub.feedUrl === podcast.feedUrl);

    const next =
      existingIndex >= 0
        ? current.filter((_, index) => index !== existingIndex)
        : [...current, podcast];

    this.subscriptions.set(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

    return existingIndex >= 0 ? 'unsubscribed' : 'subscribed';
  }

  private load(): IPodcast[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) || [] : [];
    } catch {
      return [];
    }
  }
}
