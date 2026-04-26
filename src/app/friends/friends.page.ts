import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonButtons, IonMenuButton, IonButton, IonIcon, 
  IonSearchbar, IonList, IonItem, IonLabel, 
  IonListHeader, IonAvatar 
} from '@ionic/angular/standalone';

import { FriendService } from '../services/friend'; 

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, 
    IonButtons, IonMenuButton, IonButton, IonIcon, IonSearchbar, IonList, IonItem, IonLabel, 
    IonListHeader, IonAvatar]
})

export class FriendsPage implements OnInit {
  showSearch = false;
  searchResult: any = null;

  constructor(public friendService: FriendService) { }

  ngOnInit() {
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    this.searchResult = null; 
  }

  // PROBA PODACI prije nego se doda baza 

  searchFriends(event: any) {
    const query = event.target.value.toLowerCase();
    if (query === 'ana@gmail.com') { //tu ce ici poziv ka bazi
      this.searchResult = { id: '3', name: 'Ana Arsić', email: 'ana@gmail.com' };
    } else {
      this.searchResult = null;
    }
  }

  sendRequest(id: string) {
    console.log('Zahtev poslat korisniku sa ID:', id);
    this.showSearch = false;
  }

  viewFriendPlans(id: string) {
    // Navigacija na stranicu gde vidiš tuđa putovanja
  }
}