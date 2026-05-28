import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../auth/auth';

@Component({
  selector: 'app-add-travel',
  templateUrl: './add-travel.page.html',
  styleUrls: ['./add-travel.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddTravelPage implements OnInit {
  private firebaseService = inject(FirebaseService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  novoPutovanje = {
    drzava: '',
    grad: '',
    datumOd: '',
    datumDo: '',
    vrstaPrevoza: '',
    cenaPrevoza: 0,
    vrstaSmestaja: '',
    cenaSmestaja: 0
  };

  id: string | null = null;

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    this.route.queryParams.subscribe((params) => {
      if (params['drzava']) {
        this.novoPutovanje = {
          drzava: params['drzava'],
          grad: params['grad'],
          datumOd: params['datumOd'],
          datumDo: params['datumDo'],
          vrstaPrevoza: params['vrstaPrevoza'],
          cenaPrevoza: +params['cenaPrevoza'],
          vrstaSmestaja: params['vrstaSmestaja'],
          cenaSmestaja: +params['cenaSmestaja']
        };
      }
    });
  }

  async sacuvajPutovanje() {
    const uid = this.authService.currentUid;
    const userName = this.authService.currentUserName;
    if (!uid) return;

    if (this.router.url.includes('edit') && this.id) {
      await firstValueFrom(
        this.firebaseService.updateTravel(this.id, this.novoPutovanje)
      );
    } else {
      await firstValueFrom(
        this.firebaseService.addTravel({
          ...this.novoPutovanje,
          ownerId: uid,
          ownerName: userName,
          poseceno: false,
          participants: []
        })
      );
    }

    this.router.navigate(['/travel']);
  }
}
