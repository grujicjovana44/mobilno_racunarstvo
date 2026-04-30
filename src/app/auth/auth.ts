import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isUserAuthenticated = false;

  constructor(private router: Router) { }

  get isUserAuthenticated(): boolean {
    return this._isUserAuthenticated;
  }

  logIn(email: string, password: string) {
    this._isUserAuthenticated = true;
    this.router.navigate(['/travel']);
  }

  logOut() {
    this._isUserAuthenticated = false;
  }

}

