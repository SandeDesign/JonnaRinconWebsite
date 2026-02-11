import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBbTfR42ZW61pY4x2_3YYsqZyPv5I6tFoU",
  authDomain: "jonna-8cd90.firebaseapp.com",
  projectId: "jonna-8cd90",
  storageBucket: "jonna-8cd90.firebasestorage.app",
  messagingSenderId: "152710460832",
  appId: "1:152710460832:web:74928c608ca5c55b71e0c5"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

export { app, auth, db, storage };
export default app;
