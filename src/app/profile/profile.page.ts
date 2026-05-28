import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../auth/auth';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProfilePage implements OnInit {
  editMode = false;

  datumRodjenja = '';
  grad = '';

  editDatumRodjenja = '';
  editGrad = '';

  constructor(
    public authService: AuthService,
    private firebaseService: FirebaseService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await this.loadProfile();
  }

  private async loadProfile() {
    const uid = this.authService.currentUid;
    if (!uid) return;
    const profile = (await firstValueFrom(
      this.firebaseService.getUserProfile(uid)
    )) as any;
    this.datumRodjenja = profile?.datumRodjenja || '';
    this.grad = profile?.grad || '';
  }

  startEdit() {
    this.editDatumRodjenja = this.datumRodjenja;
    this.editGrad = this.grad;
    this.editMode = true;
  }

  cancelEdit() {
    this.editMode = false;
  }

  async saveProfile() {
    const uid = this.authService.currentUid;
    if (!uid) return;

    await firstValueFrom(
      this.firebaseService.updateUserProfile(uid, {
        datumRodjenja: this.editDatumRodjenja.trim(),
        grad: this.editGrad.trim()
      })
    );

    this.datumRodjenja = this.editDatumRodjenja.trim();
    this.grad = this.editGrad.trim();
    this.editMode = false;

    const toast = await this.toastCtrl.create({
      message: 'Profil je uspešno sačuvan! ✓',
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    await toast.present();
  }

  logOut() {
    this.authService.logOut();
  }
}
