import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class FriendService {
  public mojiPrijatelji = [
    { id: '1', name: 'Ana Arsić', email: 'ana@gmail.com' },
    { id: '2', name: 'Marko Marković', email: 'marko@gmail.com' }
  ];

  dodajPrijatelja(osoba: any) {
    this.mojiPrijatelji.push(osoba);
  }

  constructor() { }
}