import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, setDoc, getDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';

const STORAGE_KEY = '@diario_app:entries';
const FOLDERS_KEY = '@diario_app:folders';
const PROFILE_KEY = '@diario_app:user_profile';

export const loadEntries = async () => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  let localEntries = raw ? JSON.parse(raw) : [];

  if (auth.currentUser) {
    try {
      const q = query(collection(db, 'entries'), where('userId', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const remoteEntries = [];
      querySnapshot.forEach((docSnap) => {
        remoteEntries.push(docSnap.data());
      });

      localEntries = remoteEntries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(localEntries));
    } catch (e) {
      console.log('Modo offline ativo:', e);
    }
  }

  return localEntries;
};

export const saveEntries = async (entries) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));

  if (auth.currentUser && Array.isArray(entries)) {
    try {
      for (const entry of entries) {
        const docRef = doc(db, 'entries', entry.id);
        await setDoc(docRef, { ...entry, userId: auth.currentUser.uid }, { merge: true });
      }
    } catch (e) {
      console.log('Erro no Firestore:', e);
    }
  }
};

export const deleteEntryFromFirestore = async (id) => {
  if (auth.currentUser) {
    try {
      await deleteDoc(doc(db, 'entries', id));
    } catch (e) {
      console.log('Erro ao deletar no Firestore:', e);
    }
  }
};

export const loadFolders = async () => {
  const raw = await AsyncStorage.getItem(FOLDERS_KEY);
  let localFolders = raw ? JSON.parse(raw) : [{ id: 'general', name: 'Geral' }];

  if (auth.currentUser) {
    try {
      const docRef = doc(db, 'user_folders', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && Array.isArray(docSnap.data().folders)) {
        localFolders = docSnap.data().folders;
        await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(localFolders));
      }
    } catch (e) {
      console.log('Erro ao carregar pastas do Firestore:', e);
    }
  }

  return localFolders;
};

export const saveFolders = async (folders) => {
  await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
  if (auth.currentUser) {
    try {
      const docRef = doc(db, 'user_folders', auth.currentUser.uid);
      await setDoc(docRef, { folders }, { merge: true });
    } catch (e) {
      console.log('Erro ao salvar pastas no Firestore:', e);
    }
  }
};

export const loadUserProfile = async () => {
  const raw = await AsyncStorage.getItem(PROFILE_KEY);
  let localProfile = raw ? JSON.parse(raw) : null;

  if (auth.currentUser) {
    try {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        localProfile = docSnap.data();
        await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(localProfile));
      } else if (!localProfile) {
        localProfile = {
          name: auth.currentUser.displayName || 'Pesquisador de Campo',
          email: auth.currentUser.email || '',
          role: '',
          avatarUri: null,
        };
      }
    } catch (e) {
      console.log('Erro ao buscar perfil no Firestore:', e);
    }
  }

  return localProfile;
};

export const saveUserProfile = async (profileData) => {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
  if (auth.currentUser) {
    try {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(docRef, { ...profileData, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (e) {
      console.log('Erro ao salvar perfil no Firestore:', e);
    }
  }
};