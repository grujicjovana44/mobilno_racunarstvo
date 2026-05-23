import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { firebaseAuth } from '../core/firebase';
import { FirebaseService } from '../services/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<{ uid: string; name: string; email: string } | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router, private firebaseService: FirebaseService) {
    onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        const profile = await this.firebaseService.getUserProfile(user.uid) as any;
        this.currentUserSubject.next({
          uid: user.uid,
          name: profile?.name || user.displayName || '',
          email: user.email || ''
        });
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  get currentUser() {
    return this.currentUserSubject.getValue();
  }

  get currentUid(): string | null {
    return this.currentUserSubject.getValue()?.uid || null;
  }

  get currentUserName(): string {
    return this.currentUserSubject.getValue()?.name || '';
  }

  get isUserAuthenticated(): boolean {
    return this.currentUserSubject.getValue() !== null;
  }

  async logIn(email: string, password: string) {
    await signInWithEmailAndPassword(firebaseAuth, email, password);
    this.router.navigate(['/travel']);
  }

  async register(name: string, surname: string, email: string, password: string) {
    const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    const fullName = `${name} ${surname}`.trim();
    await updateProfile(cred.user, { displayName: fullName });
    await this.firebaseService.createUserProfile(cred.user.uid, fullName, email);
  }

  async logOut() {
    await signOut(firebaseAuth);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
