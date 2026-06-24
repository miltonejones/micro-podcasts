import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, ToastService } from 'shared-utils';

@Component({
  selector: 'app-auth-widget',
  imports: [],
  templateUrl: './auth-widget.html',
})
export class AuthWidget {
  protected auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  async signOut(): Promise<void> {
    await this.auth.signOut();
    this.toast.alert('Signed out.');
    this.router.navigateByUrl('/login');
  }
}
