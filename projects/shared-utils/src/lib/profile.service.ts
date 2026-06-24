import { Injectable, effect, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';

interface StoredProfile {
  displayName: string;
  photoUrl: string | null;
}

const STORAGE_PREFIX = 'statecast.profile.';

/**
 * Profile data (display name + photo) isn't backed by Cognito or S3 — the user pool client
 * only has write access to `email`, and there's no Storage category provisioned — so it's
 * kept client-side, scoped per signed-in user's email.
 */
@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly auth = inject(AuthService);

  readonly displayName = signal('');
  readonly photoUrl = signal<string | null>(null);

  constructor() {
    effect(() => {
      const email = this.auth.currentUserEmail();
      if (email) {
        this.load(email);
      } else {
        this.displayName.set('');
        this.photoUrl.set(null);
      }
    });
  }

  update(displayName: string, photoUrl: string | null): void {
    const email = this.auth.currentUserEmail();
    if (!email) return;

    this.displayName.set(displayName);
    this.photoUrl.set(photoUrl);
    localStorage.setItem(STORAGE_PREFIX + email, JSON.stringify({ displayName, photoUrl }));
  }

  private load(email: string): void {
    const raw = localStorage.getItem(STORAGE_PREFIX + email);
    const stored: StoredProfile | null = raw ? JSON.parse(raw) : null;
    this.displayName.set(stored?.displayName || email.split('@')[0]);
    this.photoUrl.set(stored?.photoUrl ?? null);
  }
}
