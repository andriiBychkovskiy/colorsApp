import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAIfSGigGPSc32E5mnL5HPqyQ3CW2yDbsA",
  authDomain: "colors-cc1eb.firebaseapp.com",
  projectId: "colors-cc1eb",
  storageBucket: "colors-cc1eb.firebasestorage.app",
  messagingSenderId: "851286418392",
  appId: "1:851286418392:web:a14d6ddbc97e6c9d4248ad",
  measurementId: "G-ESHRCWNG81",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set auth persistence to local storage
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting auth persistence:", error);
});

export { auth, app };
