import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user: User | null = null;
  private _currentUserName = '';

  private http = inject(HttpClient);
  private router = inject(Router);

  get isUserAuthenticated(): boolean {
    return this.user !== null && this.user.token !== null;
  }

  get currentUid(): string | null {
    return this.user?.id ?? null;
  }

  get currentUserName(): string {
    return this._currentUserName;
  }

  setCurrentUserName(name: string) {
    this._currentUserName = name;
    const raw = localStorage.getItem('userData');
    if (raw) {
      const data = JSON.parse(raw);
      data.name = name;
      localStorage.setItem('userData', JSON.stringify(data));
    }
  }

  getToken(): string | null {
    return this.user?.token ?? null;
  }

  getUserId(): string | null {
    return this.user?.id ?? null;
  }

  private handleAuthentication(userData: AuthResponseData) {
    const expiration = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );
    this.user = new User(
      userData.localId,
      userData.email,
      userData.idToken,
      expiration
    );
    localStorage.setItem(
      'userData',
      JSON.stringify({
        id: userData.localId,
        email: userData.email,
        token: userData.idToken,
        expiration: expiration.toISOString(),
        name: this._currentUserName
      })
    );
  }

  autoLogin() {
    const raw = localStorage.getItem('userData');
    if (!raw) return;
    const data: {
      id: string;
      email: string;
      token: string;
      expiration: string;
      name: string;
    } = JSON.parse(raw);
    const loadedUser = new User(
      data.id,
      data.email,
      data.token,
      new Date(data.expiration)
    );
    if (loadedUser.token) {
      this.user = loadedUser;
      this._currentUserName = data.name || '';
    }
  }

  register(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
        { email, password, returnSecureToken: true }
      )
      .pipe(tap((userData) => this.handleAuthentication(userData)));
  }

  logIn(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
        { email, password, returnSecureToken: true }
      )
      .pipe(tap((userData) => this.handleAuthentication(userData)));
  }

  logOut() {
    this.user = null;
    this._currentUserName = '';
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
  }
}
