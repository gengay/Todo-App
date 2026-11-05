import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const env = (typeof process !== 'undefined' ? process.env : {}) as Record<string, string | undefined>;

const fallbackFirebaseConfig = {
  apiKey: 'AIzaSyCq2jZletKyBXUY4eclu73ZVyOXprBF6WQ',
  authDomain: 'todo-app-854fe.firebaseapp.com',
  projectId: 'todo-app-854fe',
  storageBucket: 'todo-app-854fe.appspot.com',
  messagingSenderId: '1062819427425',
  appId: '1:1062819427425:web:cbd621ed9111fe7c39e620',
  measurementId: 'G-XT100THYSQ',
} as const;

export const firebaseConfig = {
  apiKey: env.EXPO_PUBLIC_FIREBASE_API_KEY ?? fallbackFirebaseConfig.apiKey,
  authDomain: env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? fallbackFirebaseConfig.authDomain,
  projectId: env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? fallbackFirebaseConfig.projectId,
  storageBucket: env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? fallbackFirebaseConfig.storageBucket,
  messagingSenderId:
    env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? fallbackFirebaseConfig.messagingSenderId,
  appId: env.EXPO_PUBLIC_FIREBASE_APP_ID ?? fallbackFirebaseConfig.appId,
  measurementId:
    env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ?? fallbackFirebaseConfig.measurementId,
};

const hasRequiredFirebaseConfig = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId &&
    firebaseConfig.storageBucket,
);

if (!hasRequiredFirebaseConfig) {
  console.warn(
    'Firebase config is incomplete. Check EXPO_PUBLIC_FIREBASE_* values in your .env or Vercel environment variables.',
  );
}

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

export const firebaseReady = hasRequiredFirebaseConfig;