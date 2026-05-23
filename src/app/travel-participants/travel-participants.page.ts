import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../auth/auth';

@Component({
  selector: 'app-travel-participants',
  templateUrl: './travel-participants.page.html',
  styleUrls: ['./travel-participants.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TravelParticipantsPage implements OnInit, OnDestroy {
  private firebaseService = inject(FirebaseService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  travelId = '';
  travel: any = null;
  mojiPrijatelji: any[] = [];

  private unsub: (() => void) | null = null;

  async ngOnInit() {
    this.travelId = this.route.snapshot.params['id'];
    await this.loadTravel();

    const uid = this.authService.currentUid;
    if (!uid) return;

    this.unsub = this.firebaseService.subscribeToFriends(uid, (friends) => {
      this.mojiPrijatelji = friends;
    });
  }

  async loadTravel() {
    this.travel = await this.firebaseService.getTravel(this.travelId);
  }

  isParticipant(friendId: string): boolean {
    return (this.travel?.participants || []).includes(friendId);
  }

  async toggleParticipant(friend: any) {
    if (this.isParticipant(friend.id)) {
      await this.firebaseService.removeParticipantFromTravel(this.travelId, friend.id);
    } else {
      await this.firebaseService.addParticipantToTravel(this.travelId, friend.id);
    }
    await this.loadTravel();
  }

  nazad() {
    this.router.navigate(['/travel']);
  }

  ngOnDestroy() {
    this.unsub?.();
  }
}
