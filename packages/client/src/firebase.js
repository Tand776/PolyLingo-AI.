import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-polylingo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-polylingo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-polylingo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:demopolylingo",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const usingEmulator = import.meta.env.VITE_USE_FIREBASE_EMULATOR === "true";

if (usingEmulator) {
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "localhost", 8080);
}
