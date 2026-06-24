import { Injectable, signal } from '@angular/core';
import {
  confirmSignUp,
  getCurrentUser,
  signIn,
  signOut,
  signUp,
} from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import './amplify-config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly isAuthenticated = signal(false);
  readonly currentUserEmail = signal<string | null>(null);

  /** Resolves once the initial session check (on app load) has completed. */
  readonly ready: Promise<void>;
  private markReady!: () => void;

  constructor() {
    this.ready = new Promise((resolve) => (this.markReady = resolve));

    Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signedIn' || payload.event === 'signedOut') {
        this.refresh();
      }
    });
    this.refresh();
  }

  private refresh(): void {
    getCurrentUser()
      .then((user) => {
        this.isAuthenticated.set(true);
        this.currentUserEmail.set(user.signInDetails?.loginId ?? user.username);
      })
      .catch(() => {
        this.isAuthenticated.set(false);
        this.currentUserEmail.set(null);
      })
      .finally(() => this.markReady());
  }

  async signIn(email: string, password: string): Promise<void> {
    await signIn({ username: email, password });
  }

  /** Returns true if the account needs an email confirmation code before it can sign in. */
  async signUp(email: string, password: string): Promise<boolean> {
    const result = await signUp({
      username: email,
      password,
      options: { userAttributes: { email } },
    });
    return result.nextStep.signUpStep === 'CONFIRM_SIGN_UP';
  }

  async confirmSignUp(email: string, code: string): Promise<void> {
    await confirmSignUp({ username: email, confirmationCode: code });
  }

  async signOut(): Promise<void> {
    await signOut();
  }
}
