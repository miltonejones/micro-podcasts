import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { AudioPlayerCommandService } from './audio-player-command.service';
import { IPodcast } from './models';
import { PodcastSelectionService } from './podcast-selection.service';
import { SubscriptionsService } from './subscriptions.service';
import { ToastService } from './toast.service';

@Component({
  selector: 'lib-podcast-card',
  imports: [],
  templateUrl: './podcast-card.html',
  styleUrl: './podcast-card.css',
})
export class PodcastCard {
  podcast = input.required<IPodcast>();

  private router = inject(Router);
  private podcastSelection = inject(PodcastSelectionService);
  private subscriptions = inject(SubscriptionsService);
  private audioPlayerCommand = inject(AudioPlayerCommandService);
  private toast = inject(ToastService);

  get subscribed(): boolean {
    return this.subscriptions.isSubscribed(this.podcast());
  }

  get progress(): number {
    return this.audioPlayerCommand.getPodcastProgress(this.podcast().feedUrl || '');
  }

  open(): void {
    const podcast = this.podcast();
    this.podcastSelection.select(podcast);
    this.router.navigate(['/detail', encodeURIComponent(podcast.feedUrl || '')]);
  }

  toggleSubscribe(event: Event): void {
    event.stopPropagation();
    const podcast = this.podcast();
    const result = this.subscriptions.toggle(podcast);
    this.toast.alert(`${result === 'subscribed' ? 'Subscribed to' : 'Unsubscribed from'} "${podcast.collectionName}"`);
  }
}
