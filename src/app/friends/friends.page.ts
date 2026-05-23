import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonMenuButton, IonButton, IonIcon,
  IonSearchbar, IonList, IonItem, IonLabel,
  IonListHeader, IonAvatar
} from '@ionic/angular/standalone';

import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../auth/auth';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonMenuButton, IonButton, IonIcon,
    IonSearchbar, IonList, IonItem, IonLabel,
    IonListHeader, IonAvatar
  ]
})
export class FriendsPage implements OnInit, OnDestroy {
  private firebaseService = inject(FirebaseService);
  private authService = inject(AuthService);
  private router = inject(Router);

  showSearch = false;
  searchResult: any = null;
  mojiPrijatelji: any[] = [];
  requestSent = false;

  private unsub: (() => void) | null = null;

  ngOnInit() {
    const uid = this.authService.currentUid;
    if (!uid) return;
    this.unsub = this.firebaseService.subscribeToFriends(uid, (friends) => {
      this.mojiPrijatelji = friends;
    });
  }

  ngOnDestroy() {
    this.unsub?.();
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    this.searchResult = null;
    this.requestSent = false;
  }

  async searchFriends(event: any) {
    const email = event.target.value?.toLowerCase().trim();
    if (!email || email.length < 3) { this.searchResult = null; return; }

    const result = await this.firebaseService.getUserByEmail(email) as any;
    if (result && result.id !== this.authService.currentUid) {
      this.searchResult = result;
    } else {
      this.searchResult = null;
    }
    this.requestSent = false;
  }

  async sendRequest(targetId: string) {
    const myUid = this.authService.currentUid;
    if (!myUid) return;
    await this.firebaseService.sendFriendRequest(targetId, myUid);
    this.requestSent = true;
  }

  viewFriendDetails(friend: any) {
    this.router.navigate(['/friend-details', friend.id]);
  }

  get currentUserName(): string {
    return this.authService.currentUserName;
  }
}
