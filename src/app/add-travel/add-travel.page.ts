import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { TravelService } from '../services/travel.service';
import { Travel } from '../models/travel.model';

@Component({
  selector: 'app-add-travel',
  templateUrl: './add-travel.page.html',
  styleUrls: ['./add-travel.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddTravelPage implements OnInit {
  private travelService = inject(TravelService);
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

  constructor() { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    this.route.queryParams.subscribe(params => {
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

  sacuvajPutovanje() {
    if (this.router.url.includes('edit') && this.id) {
      // izmena
      const p = new Travel(
        this.id,
        this.novoPutovanje.drzava,
        this.novoPutovanje.grad,
        this.novoPutovanje.datumOd,
        this.novoPutovanje.datumDo,
        this.novoPutovanje.vrstaPrevoza,
        this.novoPutovanje.cenaPrevoza,
        this.novoPutovanje.vrstaSmestaja,
        this.novoPutovanje.cenaSmestaja
      );
      this.travelService.editPutovanje(p);
    } else {
      // dodavanje
      const noviId = Math.random().toString(36).substring(2, 9);
      const p = new Travel(
        noviId,
        this.novoPutovanje.drzava,
        this.novoPutovanje.grad,
        this.novoPutovanje.datumOd,
        this.novoPutovanje.datumDo,
        this.novoPutovanje.vrstaPrevoza,
        this.novoPutovanje.cenaPrevoza,
        this.novoPutovanje.vrstaSmestaja,
        this.novoPutovanje.cenaSmestaja
      );
      this.travelService.addPutovanje(p);
    }

    this.router.navigate(['/travel']);
  }
}