
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyC-tLtFCl4UyOsImgMyb725V8Abw87cEAY",
    authDomain: "eventmgt-380ce.firebaseapp.com",
    projectId: "eventmgt-380ce",
    storageBucket: "eventmgt-380ce.firebasestorage.app",
    messagingSenderId: "1026572497014",
    appId: "1:1026572497014:web:e35a92ff40ea53f3dc6f57",
    measurementId: "G-H62V6DJKJY"
  };

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
export { auth };

const database = getDatabase(app);
export { database };
