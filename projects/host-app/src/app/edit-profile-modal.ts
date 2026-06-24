import { Component, ElementRef, ViewChild, effect, inject, signal } from '@angular/core';
import { ProfileService, ToastService } from 'shared-utils';
import { EditProfilePanelService } from './edit-profile-panel.service';

@Component({
  selector: 'app-edit-profile-modal',
  imports: [],
  templateUrl: './edit-profile-modal.html',
  styleUrl: './edit-profile-modal.css',
})
export class EditProfileModal {
  @ViewChild('nameInput') private nameInputRef?: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput') private fileInputRef?: ElementRef<HTMLInputElement>;

  protected panel = inject(EditProfilePanelService);
  protected profile = inject(ProfileService);
  private toast = inject(ToastService);

  protected photoPreview = signal<string | null>(null);

  constructor() {
    // Re-sync the preview (discarding any unsaved edits) every time the modal opens.
    effect(() => {
      if (this.panel.isOpen()) {
        this.photoPreview.set(this.profile.photoUrl());
      }
    });
  }

  pickPhoto(): void {
    this.fileInputRef?.nativeElement.click();
  }

  onPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => this.photoPreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  removePhoto(): void {
    this.photoPreview.set(null);
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = '';
    }
  }

  save(): void {
    const name = this.nameInputRef?.nativeElement.value.trim();
    if (!name) return;

    this.profile.update(name, this.photoPreview());
    this.toast.alert('Profile updated.');
    this.panel.close();
  }

  close(): void {
    this.panel.close();
  }
}
