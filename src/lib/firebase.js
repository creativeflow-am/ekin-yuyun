import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyADd8J5K3LU-I-xK48pifyJzOn9SNR_sJI",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "jurnal-yuyun-2c5ff.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "jurnal-yuyun-2c5ff",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "jurnal-yuyun-2c5ff.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "314567640772",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:314567640772:web:55b216e97bd8bbd26fab91",
};

// Prevent duplicate initialization (important for Next.js hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { db };
