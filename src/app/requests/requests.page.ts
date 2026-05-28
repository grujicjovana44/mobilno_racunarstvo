import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

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
export class RequestsPage implements OnInit {
  private firebaseService = inject(FirebaseService);
  private authService = inject(AuthService);

  zahtevi: any[] = [];

  async ngOnInit() {
    await this.loadRequests();
  }

  async loadRequests() {
    const uid = this.authService.currentUid;
    if (!uid) return;
    this.zahtevi = await firstValueFrom(
      this.firebaseService.loadFriendRequests(uid)
    );
  }

  async prihvatiZahtev(osoba: any) {
    const myUid = this.authService.currentUid;
    if (!myUid) return;
    await firstValueFrom(
      this.firebaseService.acceptFriendRequest(myUid, osoba.id)
    );
    await this.loadRequests();
  }

  async odbijZahtev(osoba: any) {
    const myUid = this.authService.currentUid;
    if (!myUid) return;
    await firstValueFrom(
      this.firebaseService.rejectFriendRequest(myUid, osoba.id)
    );
    await this.loadRequests();
  }
}
