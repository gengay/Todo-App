import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCq2jZletKyBXUY4eclu73ZVyOXprBF6WQ',
  authDomain: 'todo-app-854fe.firebaseapp.com',
  projectId: 'todo-app-854fe',
  storageBucket: 'todo-app-854fe.firebasestorage.app',
  messagingSenderId: '1062819427425',
  appId: '1:1062819427425:web:cbd621ed9111fe7c39e620',
  measurementId: 'G-XT100THYSQ',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export let analytics: ReturnType<typeof getAnalytics> | null = null;

if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}