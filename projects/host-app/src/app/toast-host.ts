import { Component, inject, signal } from '@angular/core';
import { ToastMessage, ToastService } from 'shared-utils';

@Component({
  selector: 'app-toast-host',
  imports: [],
  templateUrl: './toast-host.html',
  styleUrl: './toast-host.css',
})
export class ToastHost {
  private toast = inject(ToastService);

  message = signal<ToastMessage | null>(null);
  visible = signal(false);

  private hideTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.toast.messages$.subscribe((message) => {
      this.message.set(message);
      this.visible.set(true);

      clearTimeout(this.hideTimer);
      this.hideTimer = setTimeout(() => this.visible.set(false), this.toast.displayMs);
    });
  }

  close(): void {
    this.visible.set(false);
  }
}
