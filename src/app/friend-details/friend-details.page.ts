import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../auth/auth';

@Component({
  selector: 'app-friend-details',
  templateUrl: './friend-details.page.html',
  styleUrls: ['./friend-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FriendDetailsPage implements OnInit {
  private firebaseService = inject(FirebaseService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  friend: any = null;
  travels: any[] = [];
  expandedTravelId: string | null = null;
  currentComments: any[] = [];
  newComment = '';

  async ngOnInit() {
    const friendId = this.route.snapshot.params['id'];
    this.friend = await firstValueFrom(
      this.firebaseService.getUserProfile(friendId)
    );
    this.travels = await firstValueFrom(
      this.firebaseService.loadUserTravels(friendId)
    );
  }

  async toggleComments(travelId: string) {
    if (this.expandedTravelId === travelId) {
      this.expandedTravelId = null;
      this.currentComments = [];
    } else {
      this.expandedTravelId = travelId;
      this.currentComments = [];
      this.currentComments = await firstValueFrom(
        this.firebaseService.loadComments(travelId)
      );
    }
  }

  async addComment(travelId: string) {
    if (!this.newComment.trim()) return;
    await firstValueFrom(
      this.firebaseService.addComment(travelId, {
        authorId: this.authService.currentUid,
        authorName: this.authService.currentUserName,
        text: this.newComment.trim()
      })
    );
    this.newComment = '';
    this.currentComments = await firstValueFrom(
      this.firebaseService.loadComments(travelId)
    );
  }
}
