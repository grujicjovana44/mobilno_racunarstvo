import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonList, IonItem, IonAvatar, IonIcon, 
  IonLabel, IonButtons, IonButton, IonBackButton 
} from '@ionic/angular/standalone'

import { FriendService } from '../services/friend';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, 
    IonList, IonItem, IonAvatar, IonIcon, 
    IonLabel, IonButtons, IonButton, IonBackButton,
    CommonModule, FormsModule
  ]
  })
export class RequestsPage implements OnInit {

 constructor(public friendService: FriendService) { }

  ngOnInit() {
  }

  //PROBA PODACI
  zahtevi = [
    { id: '101', name: 'Milan Milenković', email: 'milan@gmail.com' },
    { id: '102', name: 'Sara Sarić', email: 'sara@gmail.com' }
  ];
  prijatelji: any[]=[];

  prihvatiZahtev(osoba: any) {
    //prebaci u prijatelje pa obrise
    this.friendService.dodajPrijatelja(osoba);
    this.zahtevi = this.zahtevi.filter(z => z.id !== osoba.id);
    console.log('Prihvaćen:', osoba.name);
  }
  odbijZahtev(osoba: any) {
    //samo obrise i tjt
    this.zahtevi = this.zahtevi.filter(z => z.id !== osoba.id);
    console.log('Odbijen:', osoba.name);
  }


}
