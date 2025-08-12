// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyDorgEMS377QYGtOI37IxFEeUvyshThiVI",
  authDomain: "recanto-davet.firebaseapp.com",
  databaseURL: "https://recanto-davet-default-rtdb.firebaseio.com",
  projectId: "recanto-davet",
  storageBucket: "recanto-davet.firebasestorage.app",
  messagingSenderId: "235509008499",
  appId: "1:235509008499:web:a6bb458cf251be9adc0206"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
