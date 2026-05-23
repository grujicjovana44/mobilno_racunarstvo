import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonAvatar, IonIcon,
  IonLabel, IonButtons, IonButton, IonBackButton
} from '@ionic/angular/standalone';

import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../auth/auth';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonAvatar, IonIcon,
    IonLabel, IonButtons, IonButton, IonBackButton,
    CommonModule, FormsModule
  ]
})
export class RequestsPage implements OnInit, OnDestroy {
  private firebaseService = inject(FirebaseService);
  private authService = inject(AuthService);

  zahtevi: any[] = [];

  private unsub: (() => void) | null = null;

  ngOnInit() {
    const uid = this.authService.currentUid;
    if (!uid) return;
    this.unsub = this.firebaseService.subscribeToFriendRequests(uid, (requests) => {
      this.zahtevi = requests;
    });
  }

  async prihvatiZahtev(osoba: any) {
    const myUid = this.authService.currentUid;
    if (!myUid) return;
    await this.firebaseService.acceptFriendRequest(myUid, osoba.id);
  }

  async odbijZahtev(osoba: any) {
    const myUid = this.authService.currentUid;
    if (!myUid) return;
    await this.firebaseService.rejectFriendRequest(myUid, osoba.id);
  }

  ngOnDestroy() {
    this.unsub?.();
  }
}
