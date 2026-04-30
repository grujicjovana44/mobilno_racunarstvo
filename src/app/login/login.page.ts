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
  constructor(private router: Router, private authService: AuthService) { 
    addIcons({ personCircleOutline, mapOutline, barChartOutline, peopleOutline, logOutOutline });
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave');
  }

  ngOnDestroy() {
    console.log(' ngOnDestroy');
  }

  idiNaRegistraciju() {
    this.router.navigate(['/register']);
  }

  prijaviSe(form: NgForm) {
  if (form.invalid) {
    console.log('Forma nije validna');
    return;
  }

  const { email, password } = form.value;

  if (!email || !password) {
    console.log('Nedostaju podaci');
    return;
  }

  this.authService.logIn(email, password);
  this.router.navigateByUrl('/travel');
}
}