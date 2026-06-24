import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SubscriptionsService } from 'shared-utils';
import { AudioPlayer } from './audio-player';
import { EpisodeQueue } from './episode-queue';
import { ToastHost } from './toast-host';

type NavSection = 'home' | 'categories' | 'subscriptions' | null;

function resolveNavSection(url: string): NavSection {
  const segment = url.split('?')[0].split('/').filter(Boolean)[0];

  if (!segment) return 'home';
  if (segment === 'categories') return 'categories';
  if (segment === 'subscriptions') return 'subscriptions';
  return null;
}

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, AudioPlayer, EpisodeQueue, ToastHost],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('host-app');

  private router = inject(Router);
  protected subscriptions = inject(SubscriptionsService);
  activeSection = signal<NavSection>(resolveNavSection(this.router.url));

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      this.activeSection.set(resolveNavSection((event as NavigationEnd).urlAfterRedirects));
    });
  }

  onSearch(event: Event, query: string): void {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      this.router.navigate(['/search', encodeURIComponent(trimmed)]);
    }
  }
}
