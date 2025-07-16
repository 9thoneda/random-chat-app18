// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB3wZTanCdGxG6jpo39CkqUcM9LhK17BME",
  authDomain: "ajnabicam.firebaseapp.com",
  projectId: "ajnabicam",
  storageBucket: "ajnabicam.appspot.com",
  messagingSenderId: "558188110620",
  appId: "1:558188110620:web:500cdf55801d5b00e9d0d9",
  measurementId: "G-XM2WK7W95Q"
};

export const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(firebaseApp);

// Analytics only works in HTTPS / production
export const analytics = await isSupported().catch(() => false) 
  ? getAnalytics(firebaseApp) 
  : null;