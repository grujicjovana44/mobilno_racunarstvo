import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonAvatar, IonIcon, IonList, IonItem,
  IonLabel, IonButton
} from '@ionic/angular/standalone';

import { AuthService } from '../auth/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonAvatar, IonIcon, IonList, IonItem,
    IonLabel, IonButton, CommonModule
  ]
})
export class ProfilePage implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit() {}

  async logout() {
    await this.authService.logOut();
  }
}
