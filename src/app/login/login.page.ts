import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../auth/auth';
import { FirebaseService } from '../services/firebase.service';

import { addIcons } from 'ionicons';
import { personCircleOutline, mapOutline, barChartOutline, peopleOutline, logOutOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class LoginPage implements OnInit {
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private firebaseService: FirebaseService
  ) {
    addIcons({ personCircleOutline, mapOutline, barChartOutline, peopleOutline, logOutOutline });
  }

  ngOnInit() {}

  idiNaRegistraciju() {
    this.router.navigate(['/register']);
  }

  async prijaviSe(form: NgForm) {
    if (form.invalid) return;

    const { email, password } = form.value;
    this.errorMessage = '';

    try {
      const userData = await firstValueFrom(
        this.authService.logIn(email, password)
      );
      const profile = (await firstValueFrom(
        this.firebaseService.getUserProfile(userData.localId)
      )) as any;
      if (!profile) {
        await firstValueFrom(
          this.firebaseService.createUserProfile(
            userData.localId,
            userData.email.split('@')[0],
            userData.email.toLowerCase()
          )
        );
        this.authService.setCurrentUserName(userData.email.split('@')[0]);
      } else {
        this.authService.setCurrentUserName(profile.name || '');
      }
      this.router.navigate(['/travel']);
    } catch (error: any) {
      this.errorMessage = 'Pogrešan email ili lozinka. Pokušaj ponovo.';
      console.error('Greška pri prijavi:', error);
    }
  }
}
