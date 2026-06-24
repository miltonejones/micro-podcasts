import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  title: string;
  caption: string;
  body: string;
}

const DISPLAY_MS = 4999;

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  readonly messages$ = new Subject<ToastMessage>();

  alert(body: string, title: string = 'STATECAST', caption: string = ''): void {
    this.messages$.next({ title, caption, body });
  }

  readonly displayMs = DISPLAY_MS;
}
