import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

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
export class TravelPage implements OnInit {
  private firebaseService = inject(FirebaseService);
  private authService = inject(AuthService);
  public router = inject(Router);

  mojaputovanja: TravelDoc[] = [];
  prijateljevaPutovanja: TravelDoc[] = [];

  constructor() {}
  ngOnInit() {}

  async ionViewWillEnter() {
    const uid = this.authService.currentUid;
    if (!uid) return;

    this.mojaputovanja = await firstValueFrom(
      this.firebaseService.loadMyTravels(uid)
    );
    this.prijateljevaPutovanja = await firstValueFrom(
      this.firebaseService.loadSharedTravels(uid)
    );
  }

  idiNaDodavanje() {
    this.router.navigate(['/add-travel']);
  }

  async onDelete(id: string) {
    await firstValueFrom(this.firebaseService.deleteTravel(id));
    this.mojaputovanja = this.mojaputovanja.filter((t) => t.id !== id);
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
    await firstValueFrom(
      this.firebaseService.updateTravel(p.id, { poseceno: !p.poseceno })
    );
    const idx = this.mojaputovanja.findIndex((t) => t.id === p.id);
    if (idx !== -1) {
      this.mojaputovanja[idx] = { ...p, poseceno: !p.poseceno };
    }
  }

  idiNaUcesnike(travelId: string) {
    this.router.navigate(['/travel-participants', travelId]);
  }
}
