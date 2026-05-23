import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../auth/auth';
import { TravelDoc } from '../models/travel.model';

@Component({
  selector: 'app-travel',
  templateUrl: './travel.page.html',
  styleUrls: ['./travel.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TravelPage implements OnInit, OnDestroy {
  private firebaseService = inject(FirebaseService);
  private authService = inject(AuthService);
  public router = inject(Router);

  mojaputovanja: TravelDoc[] = [];
  prijateljevaPutovanja: TravelDoc[] = [];

  private unsub1: (() => void) | null = null;
  private unsub2: (() => void) | null = null;

  constructor() {}

  ngOnInit() {}

  ionViewWillEnter() {
    const uid = this.authService.currentUid;
    if (!uid) return;

    this.unsub1 = this.firebaseService.subscribeToMyTravels(uid, (travels) => {
      this.mojaputovanja = travels as TravelDoc[];
    });

    this.unsub2 = this.firebaseService.subscribeToSharedTravels(uid, (travels) => {
      this.prijateljevaPutovanja = travels as TravelDoc[];
    });
  }

  ionViewWillLeave() {
    this.unsub1?.();
    this.unsub2?.();
    this.unsub1 = null;
    this.unsub2 = null;
  }

  ngOnDestroy() {
    this.unsub1?.();
    this.unsub2?.();
  }

  idiNaDodavanje() {
    this.router.navigate(['/add-travel']);
  }

  async onDelete(id: string) {
    await this.firebaseService.deleteTravel(id);
  }

  onEdit(p: TravelDoc) {
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
      }
    });
  }

  async togglePoseceno(p: TravelDoc) {
    await this.firebaseService.updateTravel(p.id, { poseceno: !p.poseceno });
  }

  idiNaUcesnike(travelId: string) {
    this.router.navigate(['/travel-participants', travelId]);
  }
}
