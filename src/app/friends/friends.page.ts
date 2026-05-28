import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

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
export class FriendsPage implements OnInit {
  private firebaseService = inject(FirebaseService);
  private authService = inject(AuthService);
  private router = inject(Router);

  showSearch = false;
  searchResult: any = null;
  noResults = false;
  mojiPrijatelji: any[] = [];
  requestSent = false;

  async ngOnInit() {
    await this.loadFriends();
  }

  async loadFriends() {
    const uid = this.authService.currentUid;
    if (!uid) return;
    this.mojiPrijatelji = await firstValueFrom(
      this.firebaseService.loadFriends(uid)
    );
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    this.searchResult = null;
    this.noResults = false;
    this.requestSent = false;
  }

  async searchFriends(event: any) {
    const email = event.target.value?.toLowerCase().trim();
    if (!email || email.length < 5) {
      this.searchResult = null;
      this.noResults = false;
      return;
    }

    try {
      const result = (await firstValueFrom(
        this.firebaseService.getUserByEmail(email)
      )) as any;
      if (result && result.id !== this.authService.currentUid) {
        this.searchResult = result;
        this.noResults = false;
      } else {
        this.searchResult = null;
        this.noResults = true;
      }
    } catch (e) {
      this.searchResult = null;
      this.noResults = true;
      console.error('Greška pri pretrazi:', e);
    }
    this.requestSent = false;
  }

  async sendRequest(targetId: string) {
    const myUid = this.authService.currentUid;
    if (!myUid) return;
    await firstValueFrom(
      this.firebaseService.sendFriendRequest(targetId, myUid)
    );
    this.requestSent = true;
  }

  viewFriendDetails(friend: any) {
    this.router.navigate(['/friend-details', friend.id]);
  }

  get currentUserName(): string {
    return this.authService.currentUserName;
  }
}
