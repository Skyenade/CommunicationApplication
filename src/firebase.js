
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getDatabase } from "firebase/database";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBquVuJgdRjNmZYkHdGK0KYHjKMjQ_VoCU",
  authDomain: "communityapplication-14c16.firebaseapp.com",
  databaseURL: "https://communityapplication-14c16-default-rtdb.firebaseio.com",
  projectId: "communityapplication-14c16",
  storageBucket: "communityapplication-14c16.firebasestorage.app",
  messagingSenderId: "751780854595",
  appId: "1:751780854595:web:621837e442859a1aa80df6",
  measurementId: "G-182XGDZS6W"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
