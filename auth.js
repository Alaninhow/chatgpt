// auth.js
import { auth } from './firebaseConfig';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

export function watchAuth(setter) {
  // observa login/logout
  const unsub = onAuthStateChanged(auth, (u) => setter(u));
  return unsub;
}

export async function login(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function register(email, password) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  return await signOut(auth);
}
