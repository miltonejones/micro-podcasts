import { Injectable, effect, inject, signal } from '@angular/core';
import { generateClient } from 'aws-amplify/api';
import './amplify-config';
import { AuthService } from './auth.service';
import { IPodcast } from './models';
import {
  PodcastSubscriptionRecord,
  createPodcastSubscription,
  deletePodcastSubscription,
  listPodcastSubscriptions,
  toCreateInput,
  toIPodcast,
} from './subscriptions.graphql';
import { ToastService } from './toast.service';

const client = generateClient();

@Injectable({
  providedIn: 'root',
})
export class SubscriptionsService {
  private readonly toast = inject(ToastService);
  private readonly auth = inject(AuthService);

  readonly subscriptions = signal<IPodcast[]>([]);

  /** feedUrl -> record id, needed to delete a subscription. */
  private readonly recordIds = new Map<string, string>();

  constructor() {
    effect(() => {
      if (this.auth.isAuthenticated()) {
        this.load();
      } else {
        this.subscriptions.set([]);
        this.recordIds.clear();
      }
    });
  }

  isSubscribed(podcast: IPodcast | null | undefined): boolean {
    if (!podcast) return false;
    return this.subscriptions().some((sub) => sub.feedUrl === podcast.feedUrl);
  }

  toggle(podcast: IPodcast): 'subscribed' | 'unsubscribed' {
    if (!this.auth.isAuthenticated()) {
      this.toast.alert('Sign in to subscribe to podcasts.');
      return 'unsubscribed';
    }

    const current = this.subscriptions();
    const existingIndex = current.findIndex((sub) => sub.feedUrl === podcast.feedUrl);
    const wasSubscribed = existingIndex >= 0;

    if (wasSubscribed) {
      this.subscriptions.set(current.filter((_, index) => index !== existingIndex));
      this.persistDelete(podcast.feedUrl!, podcast);
    } else {
      this.subscriptions.set([...current, podcast]);
      this.persistCreate(podcast);
    }

    return wasSubscribed ? 'unsubscribed' : 'subscribed';
  }

  private async load(): Promise<void> {
    try {
      const response = await client.graphql({ query: listPodcastSubscriptions });
      const result = response as {
        data: { listPodcastSubscriptions: { items: PodcastSubscriptionRecord[] } };
      };
      const items = result.data.listPodcastSubscriptions.items;
      this.recordIds.clear();
      for (const item of items) {
        this.recordIds.set(item.feedUrl, item.id);
      }
      this.subscriptions.set(items.map(toIPodcast));
    } catch (err) {
      console.error('Failed to load subscriptions', err);
    }
  }

  private async persistCreate(podcast: IPodcast): Promise<void> {
    try {
      const response = await client.graphql({
        query: createPodcastSubscription,
        variables: { input: toCreateInput(podcast) },
      });
      const result = response as { data: { createPodcastSubscription: PodcastSubscriptionRecord } };
      this.recordIds.set(podcast.feedUrl!, result.data.createPodcastSubscription.id);
    } catch (err) {
      console.error('Failed to save subscription', err);
      this.subscriptions.set(this.subscriptions().filter((sub) => sub.feedUrl !== podcast.feedUrl));
      this.toast.alert('Could not save subscription. Please try again.');
    }
  }

  private async persistDelete(feedUrl: string, podcast: IPodcast): Promise<void> {
    const id = this.recordIds.get(feedUrl);
    if (!id) return;

    try {
      await client.graphql({
        query: deletePodcastSubscription,
        variables: { input: { id } },
      });
      this.recordIds.delete(feedUrl);
    } catch (err) {
      console.error('Failed to remove subscription', err);
      this.subscriptions.set([...this.subscriptions(), podcast]);
      this.toast.alert('Could not remove subscription. Please try again.');
    }
  }
}
