import { Injectable, signal } from '@angular/core';
import { confirmSignUp, getCurrentUser, signIn, signOut, signUp } from 'aws-amplify/auth';
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

  private async refresh(): Promise<void> {
    try {
      const user = await getCurrentUser();
      this.isAuthenticated.set(true);
      this.currentUserEmail.set(user.signInDetails?.loginId ?? user.username);
    } catch {
      this.isAuthenticated.set(false);
      this.currentUserEmail.set(null);
    } finally {
      this.markReady();
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    await signIn({ username: email, password });
    // The Hub 'signedIn' event also triggers a refresh, but asynchronously -
    // callers that navigate immediately after signIn() resolves need
    // isAuthenticated to already be correct, so await it directly here too.
    await this.refresh();
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
    await this.refresh();
  }

  /** Forces a fresh auth check (useful before guarded navigation decisions). */
  async syncWithSession(): Promise<void> {
    await this.refresh();
  }
}
