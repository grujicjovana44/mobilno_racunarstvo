import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../auth/auth';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule]
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private toastCtrl: ToastController
  ) {
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      surname: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  ngOnInit() {}

  async onRegister() {
    if (!this.registerForm.valid) return;

    const { name, surname, email, password } = this.registerForm.value;
    const fullName = `${name} ${surname}`.trim();
    this.errorMessage = '';

    try {
      const userData = await firstValueFrom(
        this.authService.register(email, password)
      );
      await firstValueFrom(
        this.firebaseService.createUserProfile(userData.localId, fullName, email.toLowerCase())
      );
      this.authService.setCurrentUserName(fullName);

      const toast = await this.toastCtrl.create({
        message: `Dobrodošla, ${name}! Registracija je uspešna. ✓`,
        duration: 2000,
        color: 'success',
        position: 'top'
      });
      await toast.present();

      setTimeout(() => this.router.navigate(['/travel']), 2000);
    } catch (error: any) {
      if (error.error?.error?.message === 'EMAIL_EXISTS') {
        this.errorMessage = 'Email adresa je već u upotrebi.';
      } else {
        this.errorMessage = 'Greška pri registraciji. Pokušaj ponovo.';
      }
      console.error('Greška pri registraciji:', error);
    }
  }
}
