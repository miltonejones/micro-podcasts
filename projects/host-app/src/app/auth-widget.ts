import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, ProfileService, ToastService } from 'shared-utils';
import { EditProfilePanelService } from './edit-profile-panel.service';

@Component({
  selector: 'app-auth-widget',
  imports: [],
  templateUrl: './auth-widget.html',
})
export class AuthWidget {
  protected auth = inject(AuthService);
  protected profile = inject(ProfileService);
  protected editProfilePanel = inject(EditProfilePanelService);
  private toast = inject(ToastService);
  private router = inject(Router);

  editProfile(): void {
    this.editProfilePanel.open();
  }

  async signOut(): Promise<void> {
    await this.auth.signOut();
    this.toast.alert('Signed out.');
    this.router.navigateByUrl('/login');
  }
}
