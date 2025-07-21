// Quick Firebase connection test
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB3wZTanCdGxG6jpo39CkqUcM9LhK17BME",
  authDomain: "ajnabicam.firebaseapp.com",
  projectId: "ajnabicam",
  storageBucket: "ajnabicam.appspot.com",
  messagingSenderId: "558188110620",
  appId: "1:558188110620:web:500cdf55801d5b00e9d0d9",
  measurementId: "G-XM2WK7W95Q",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

console.log('🔥 Testing Firebase connection...');
console.log('📦 Firebase app:', app.name);
console.log('🔐 Auth domain:', firebaseConfig.authDomain);
console.log('💾 Project ID:', firebaseConfig.projectId);

signInAnonymously(auth)
  .then((userCredential) => {
    console.log('✅ Firebase Auth working - Anonymous sign-in successful');
    console.log('👤 User ID:', userCredential.user.uid);
  })
  .catch((error) => {
    console.error('❌ Firebase Auth failed:', error.code, error.message);
  });
