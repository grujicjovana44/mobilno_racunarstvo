import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../auth/auth';

@Component({
  selector: 'app-friend-details',
  templateUrl: './friend-details.page.html',
  styleUrls: ['./friend-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FriendDetailsPage implements OnInit, OnDestroy {
  private firebaseService = inject(FirebaseService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  friend: any = null;
  travels: any[] = [];
  expandedTravelId: string | null = null;
  currentComments: any[] = [];
  newComment = '';

  private unsub1: (() => void) | null = null;
  private unsub2: (() => void) | null = null;

  async ngOnInit() {
    const friendId = this.route.snapshot.params['id'];
    this.friend = await this.firebaseService.getUserProfile(friendId);

    this.unsub1 = this.firebaseService.subscribeToUserTravels(friendId, (travels) => {
      this.travels = travels;
    });
  }

  toggleComments(travelId: string) {
    if (this.expandedTravelId === travelId) {
      this.expandedTravelId = null;
      this.currentComments = [];
      this.unsub2?.();
      this.unsub2 = null;
    } else {
      this.unsub2?.();
      this.expandedTravelId = travelId;
      this.currentComments = [];
      this.unsub2 = this.firebaseService.subscribeToComments(travelId, (comments) => {
        this.currentComments = comments;
      });
    }
  }

  async addComment(travelId: string) {
    if (!this.newComment.trim()) return;
    await this.firebaseService.addComment(travelId, {
      authorId: this.authService.currentUid,
      authorName: this.authService.currentUserName,
      text: this.newComment.trim()
    });
    this.newComment = '';
  }

  ngOnDestroy() {
    this.unsub1?.();
    this.unsub2?.();
  }
}
