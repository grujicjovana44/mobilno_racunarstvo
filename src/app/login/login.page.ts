import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth';
import { NgForm } from '@angular/forms';

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

  constructor(private router: Router, private authService: AuthService) {
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
      await this.authService.logIn(email, password);
    } catch (error: any) {
      this.errorMessage = 'Pogrešan email ili lozinka. Pokušaj ponovo.';
      console.error('Greška pri prijavi:', error);
    }
  }
}
