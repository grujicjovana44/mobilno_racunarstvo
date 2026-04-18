import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-travel',
  templateUrl: './add-travel.page.html',
  styleUrls: ['./add-travel.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddTravelPage implements OnInit, OnDestroy {

  novoPutovanje = {
    drzava: '',
    grad: '',
    datumOd: '',
    datumDo: '',
    vrstaPrevoza: '',
    cenaPrevoza: null,
    vrstaSmestaja: '',
    cenaSmestaja: null
  };

  constructor(private router: Router) { }

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
    console.log('ngOnDestroy');
  }

  sacuvajPutovanje() {
    console.log('Snimljeno:', this.novoPutovanje);
    this.router.navigate(['/travel']);
  }
}