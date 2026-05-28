import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private authUrl(path: string, query: string = ''): string {
    const token = this.authService.getToken();
    const auth = token ? `auth=${token}` : '';
    const q = [auth, query].filter(Boolean).join('&');
    return `${environment.firebaseRDBUrl}${path}.json${q ? '?' + q : ''}`;
  }

  // ============ USER PROFILE ============

  getUserProfile(uid: string): Observable<any> {
    return this.http
      .get<any>(this.authUrl(`/users/${uid}`))
      .pipe(map((data) => (data ? { id: uid, ...data } : null)));
  }

  createUserProfile(uid: string, name: string, email: string): Observable<any> {
    return this.http.put(this.authUrl(`/users/${uid}`), {
      name,
      email,
      datumRodjenja: '',
      grad: '',
      friendIds: [],
      friendRequestIds: []
    });
  }

  updateUserProfile(
    uid: string,
    data: { datumRodjenja?: string; grad?: string }
  ): Observable<any> {
    return this.http.patch(this.authUrl(`/users/${uid}`), data);
  }

  getUserByEmail(email: string): Observable<any | null> {
    return this.http
      .get<{ [key: string]: any } | null>(this.authUrl('/users'))
      .pipe(
        map((data) => {
          if (!data) return null;
          const entry = Object.entries(data).find(
            ([, user]) =>
              (user as any).email?.toLowerCase() === email.toLowerCase()
          );
          if (!entry) return null;
          return { id: entry[0], ...(entry[1] as any) };
        })
      );
  }

  // ============ FRIEND REQUESTS ============

  sendFriendRequest(toUid: string, fromUid: string): Observable<any> {
    return this.getUserProfile(toUid).pipe(
      switchMap((profile: any) => {
        if (!profile) return of(null);
        const requestIds: string[] = profile.friendRequestIds || [];
        if (requestIds.includes(fromUid)) return of(null);
        return this.http.patch(this.authUrl(`/users/${toUid}`), {
          friendRequestIds: [...requestIds, fromUid]
        });
      })
    );
  }

  loadFriendRequests(myUid: string): Observable<any[]> {
    return this.getUserProfile(myUid).pipe(
      switchMap((profile: any) => {
        const requestIds: string[] = profile?.friendRequestIds || [];
        if (requestIds.length === 0) return of([]);
        return forkJoin(requestIds.map((uid) => this.getUserProfile(uid)));
      }),
      map((profiles: any[]) => profiles.filter((p) => p !== null))
    );
  }

  acceptFriendRequest(myUid: string, fromUid: string): Observable<any> {
    return this.getUserProfile(myUid).pipe(
      switchMap((myProfile: any) => {
        const friendIds = [...(myProfile?.friendIds || [])];
        const requestIds = (myProfile?.friendRequestIds || []).filter(
          (id: string) => id !== fromUid
        );
        if (!friendIds.includes(fromUid)) friendIds.push(fromUid);
        return this.http.patch(this.authUrl(`/users/${myUid}`), {
          friendIds,
          friendRequestIds: requestIds
        });
      }),
      switchMap(() => this.getUserProfile(fromUid)),
      switchMap((fromProfile: any) => {
        const friendIds = [...(fromProfile?.friendIds || [])];
        if (!friendIds.includes(myUid)) friendIds.push(myUid);
        return this.http.patch(this.authUrl(`/users/${fromUid}`), { friendIds });
      })
    );
  }

  rejectFriendRequest(myUid: string, fromUid: string): Observable<any> {
    return this.getUserProfile(myUid).pipe(
      switchMap((profile: any) => {
        const requestIds = (profile?.friendRequestIds || []).filter(
          (id: string) => id !== fromUid
        );
        return this.http.patch(this.authUrl(`/users/${myUid}`), {
          friendRequestIds: requestIds
        });
      })
    );
  }

  loadFriends(myUid: string): Observable<any[]> {
    return this.getUserProfile(myUid).pipe(
      switchMap((profile: any) => {
        const friendIds: string[] = profile?.friendIds || [];
        if (friendIds.length === 0) return of([]);
        return forkJoin(friendIds.map((uid) => this.getUserProfile(uid)));
      }),
      map((profiles: any[]) => profiles.filter((p) => p !== null))
    );
  }

  // ============ TRAVELS ============

  addTravel(data: any): Observable<{ name: string }> {
    return this.http.post<{ name: string }>(this.authUrl('/travels'), data);
  }

  updateTravel(id: string, data: any): Observable<any> {
    return this.http.patch(this.authUrl(`/travels/${id}`), data);
  }

  deleteTravel(id: string): Observable<any> {
    return this.http.delete(this.authUrl(`/travels/${id}`));
  }

  getTravel(id: string): Observable<any> {
    return this.http
      .get<any>(this.authUrl(`/travels/${id}`))
      .pipe(map((data) => (data ? { id, ...data } : null)));
  }

  private loadAllTravels(): Observable<any[]> {
    return this.http
      .get<{ [key: string]: any } | null>(this.authUrl('/travels'))
      .pipe(
        map((data) => {
          if (!data) return [];
          return Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        })
      );
  }

  loadMyTravels(uid: string): Observable<any[]> {
    return this.loadAllTravels().pipe(
      map((travels) => travels.filter((t) => t.ownerId === uid))
    );
  }

  loadSharedTravels(uid: string): Observable<any[]> {
    return this.loadAllTravels().pipe(
      map((travels) =>
        travels.filter((t) => (t.participants || []).includes(uid))
      )
    );
  }

  loadUserTravels(targetUid: string): Observable<any[]> {
    return this.loadAllTravels().pipe(
      map((travels) => travels.filter((t) => t.ownerId === targetUid))
    );
  }

  addParticipantToTravel(travelId: string, friendUid: string): Observable<any> {
    return this.getTravel(travelId).pipe(
      switchMap((travel: any) => {
        const participants = [...(travel?.participants || [])];
        if (!participants.includes(friendUid)) participants.push(friendUid);
        return this.http.patch(this.authUrl(`/travels/${travelId}`), {
          participants
        });
      })
    );
  }

  removeParticipantFromTravel(
    travelId: string,
    friendUid: string
  ): Observable<any> {
    return this.getTravel(travelId).pipe(
      switchMap((travel: any) => {
        const participants = (travel?.participants || []).filter(
          (uid: string) => uid !== friendUid
        );
        return this.http.patch(this.authUrl(`/travels/${travelId}`), {
          participants
        });
      })
    );
  }

  // ============ COMMENTS ============

  addComment(travelId: string, comment: any): Observable<any> {
    return this.http.post(this.authUrl(`/comments/${travelId}`), {
      ...comment,
      timestamp: new Date().getTime()
    });
  }

  loadComments(travelId: string): Observable<any[]> {
    return this.http
      .get<{ [key: string]: any } | null>(this.authUrl(`/comments/${travelId}`))
      .pipe(
        map((data) => {
          if (!data) return [];
          return Object.keys(data)
            .map((key) => ({ id: key, ...data[key] }))
            .sort((a, b) => a.timestamp - b.timestamp);
        })
      );
  }

  // ============ STATS (one-time fetches) ============

  getMyTravelsOnce(uid: string): Observable<any[]> {
    return this.loadMyTravels(uid);
  }

  getSharedTravelsOnce(uid: string): Observable<any[]> {
    return this.loadSharedTravels(uid);
  }
}
