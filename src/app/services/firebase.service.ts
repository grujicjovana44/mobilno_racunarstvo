import { Injectable } from '@angular/core';
import {
  getFirestore, Firestore, collection, addDoc, getDocs, doc,
  updateDoc, deleteDoc, arrayUnion, arrayRemove, query, where,
  onSnapshot, getDoc, orderBy, setDoc
} from 'firebase/firestore';
import { db } from '../core/firebase';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private db: Firestore = db;

  // ============ USER PROFILE ============

  async createUserProfile(uid: string, name: string, email: string) {
    return await setDoc(doc(this.db, 'users', uid), {
      name,
      email,
      friendIds: [],
      friendRequestIds: []
    });
  }

  async getUserProfile(uid: string) {
    const snapshot = await getDoc(doc(this.db, 'users', uid));
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  }

  async getUserByEmail(email: string) {
    const q = query(collection(this.db, 'users'), where('email', '==', email));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const d = snapshot.docs[0];
    return { id: d.id, ...d.data() };
  }

  // ============ FRIEND REQUESTS ============

  async sendFriendRequest(toUid: string, fromUid: string) {
    return await updateDoc(doc(this.db, 'users', toUid), {
      friendRequestIds: arrayUnion(fromUid)
    });
  }

  subscribeToFriendRequests(myUid: string, callback: (requests: any[]) => void) {
    return onSnapshot(doc(this.db, 'users', myUid), async (snapshot) => {
      if (!snapshot.exists()) { callback([]); return; }
      const requestIds: string[] = snapshot.data()['friendRequestIds'] || [];
      if (requestIds.length === 0) { callback([]); return; }
      const requests = await Promise.all(
        requestIds.map(async (uid) => {
          const s = await getDoc(doc(this.db, 'users', uid));
          return s.exists() ? { id: uid, ...s.data() } : { id: uid, name: 'Nepoznat', email: '' };
        })
      );
      callback(requests);
    });
  }

  async acceptFriendRequest(myUid: string, fromUid: string) {
    await updateDoc(doc(this.db, 'users', myUid), {
      friendIds: arrayUnion(fromUid),
      friendRequestIds: arrayRemove(fromUid)
    });
    await updateDoc(doc(this.db, 'users', fromUid), {
      friendIds: arrayUnion(myUid)
    });
  }

  async rejectFriendRequest(myUid: string, fromUid: string) {
    return await updateDoc(doc(this.db, 'users', myUid), {
      friendRequestIds: arrayRemove(fromUid)
    });
  }

  subscribeToFriends(myUid: string, callback: (friends: any[]) => void) {
    return onSnapshot(doc(this.db, 'users', myUid), async (snapshot) => {
      if (!snapshot.exists()) { callback([]); return; }
      const friendIds: string[] = snapshot.data()['friendIds'] || [];
      if (friendIds.length === 0) { callback([]); return; }
      const friends = await Promise.all(
        friendIds.map(async (uid) => {
          const s = await getDoc(doc(this.db, 'users', uid));
          return s.exists() ? { id: uid, ...s.data() } : { id: uid, name: 'Nepoznat', email: '' };
        })
      );
      callback(friends);
    });
  }

  // ============ TRAVELS ============

  async addTravel(travelData: any) {
    return await addDoc(collection(this.db, 'travels'), travelData);
  }

  async updateTravel(travelId: string, data: any) {
    return await updateDoc(doc(this.db, 'travels', travelId), data);
  }

  async deleteTravel(travelId: string) {
    return await deleteDoc(doc(this.db, 'travels', travelId));
  }

  async getTravel(travelId: string) {
    const snapshot = await getDoc(doc(this.db, 'travels', travelId));
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  }

  subscribeToMyTravels(myUid: string, callback: (travels: any[]) => void) {
    const q = query(collection(this.db, 'travels'), where('ownerId', '==', myUid));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }

  subscribeToSharedTravels(myUid: string, callback: (travels: any[]) => void) {
    const q = query(collection(this.db, 'travels'), where('participants', 'array-contains', myUid));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }

  subscribeToUserTravels(targetUid: string, callback: (travels: any[]) => void) {
    const q = query(collection(this.db, 'travels'), where('ownerId', '==', targetUid));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }

  async addParticipantToTravel(travelId: string, friendUid: string) {
    return await updateDoc(doc(this.db, 'travels', travelId), {
      participants: arrayUnion(friendUid)
    });
  }

  async removeParticipantFromTravel(travelId: string, friendUid: string) {
    return await updateDoc(doc(this.db, 'travels', travelId), {
      participants: arrayRemove(friendUid)
    });
  }

  // ============ COMMENTS ============

  async addComment(travelId: string, comment: any) {
    return await addDoc(collection(this.db, 'travels', travelId, 'comments'), {
      ...comment,
      timestamp: new Date().getTime()
    });
  }

  subscribeToComments(travelId: string, callback: (comments: any[]) => void) {
    const q = query(
      collection(this.db, 'travels', travelId, 'comments'),
      orderBy('timestamp', 'asc')
    );
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }
}
