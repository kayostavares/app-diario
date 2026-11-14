import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import * as LocalAuthentication from 'expo-local-authentication';
import { auth } from './firebaseConfig';

export const authenticateUser = async () => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (!hasHardware || !isEnrolled) {
    return true;
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Desbloqueie o Diário de Campo',
    fallbackLabel: 'Usar senha do aparelho',
    cancelLabel: 'Cancelar',
  });

  return result.success;
};

export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const loginWithFirebase = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const registerWithFirebase = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(userCredential.user, { displayName });
  }
  return userCredential.user;
};

export const resetPasswordWithFirebase = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

export const changePasswordWithFirebase = async (newPassword) => {
  if (!auth.currentUser) throw new Error('NO_USER');
  await updatePassword(auth.currentUser, newPassword);
};

export const logoutWithFirebase = async () => {
  await signOut(auth);
};