import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { TravelService } from '../services/travel.service';
import { Travel } from '../models/travel.model';

@Component({
  selector: 'app-travel',
  templateUrl: './travel.page.html',
  styleUrls: ['./travel.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class TravelPage implements OnInit,OnDestroy {
  public travelService = inject(TravelService);
  public router = inject(Router);


  constructor() {}

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

  idiNaDodavanje() {
    this.router.navigate(['/add-travel']);
  }

  onDelete(id: string) {
    this.travelService.deletePutovanje(id);
  }

  onEdit(p: any) {
  this.router.navigate(['travel', p.id, 'edit'], {
    queryParams: { 
      drzava: p.drzava, 
      grad: p.grad, 
      datumOd: p.datumOd, 
      datumDo: p.datumDo,
      vrstaPrevoza: p.vrstaPrevoza,
      cenaPrevoza: p.cenaPrevoza,
      vrstaSmestaja: p.vrstaSmestaja,
      cenaSmestaja: p.cenaSmestaja
    },
  });
  }

  togglePoseceno(p: Travel) {
  p.poseceno = !p.poseceno;
}
}