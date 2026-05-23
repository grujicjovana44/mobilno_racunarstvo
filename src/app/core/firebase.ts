import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { environment } from '../../environments/environment';

const app = getApps().length === 0
  ? initializeApp(environment.firebaseConfig)
  : getApps()[0];

export const db = getFirestore(app);
export const firebaseAuth = getAuth(app);
