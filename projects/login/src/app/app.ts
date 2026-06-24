import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, ToastService } from 'shared-utils';

type AuthMode = 'signin' | 'signup' | 'confirm';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  mode = signal<AuthMode>('signin');
  busy = signal(false);
  error = signal<string | null>(null);
  pendingEmail = signal('');

  switchMode(mode: AuthMode): void {
    this.mode.set(mode);
    this.error.set(null);
  }

  onSignInSubmit(event: Event, email: string, password: string): void {
    event.preventDefault();
    this.signIn(email, password);
  }

  onSignUpSubmit(event: Event, email: string, password: string): void {
    event.preventDefault();
    this.signUp(email, password);
  }

  onConfirmSubmit(event: Event, code: string): void {
    event.preventDefault();
    this.confirm(code);
  }

  private async signIn(email: string, password: string): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    try {
      await this.auth.signIn(email, password);
      this.toast.alert(`Welcome back, ${email}`);
      this.router.navigateByUrl('/');
    } catch (err) {
      this.error.set(this.messageFor(err));
    } finally {
      this.busy.set(false);
    }
  }

  private async signUp(email: string, password: string): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    try {
      const needsConfirmation = await this.auth.signUp(email, password);
      this.pendingEmail.set(email);
      if (needsConfirmation) {
        this.mode.set('confirm');
      } else {
        this.toast.alert('Account created. You can sign in now.');
        this.mode.set('signin');
      }
    } catch (err) {
      this.error.set(this.messageFor(err));
    } finally {
      this.busy.set(false);
    }
  }

  private async confirm(code: string): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    try {
      await this.auth.confirmSignUp(this.pendingEmail(), code);
      this.toast.alert('Account verified. You can sign in now.');
      this.mode.set('signin');
    } catch (err) {
      this.error.set(this.messageFor(err));
    } finally {
      this.busy.set(false);
    }
  }

  private messageFor(err: unknown): string {
    if (err instanceof Error) return err.message;
    return 'Something went wrong. Please try again.';
  }
}
