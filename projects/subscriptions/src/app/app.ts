import { Component, inject } from '@angular/core';
import { PodcastCard, SubscriptionsService } from 'shared-utils';

@Component({
  selector: 'app-root',
  imports: [PodcastCard],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected subscriptionsService = inject(SubscriptionsService);
}
