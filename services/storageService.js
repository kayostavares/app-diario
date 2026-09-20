import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@diario_app:entries';
const FOLDERS_KEY = '@diario_app:folders';

// Entradas / Registros
export const loadEntries = async () => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const saveEntries = async (entries) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

// Pastas / Coleções
export const loadFolders = async () => {
  const raw = await AsyncStorage.getItem(FOLDERS_KEY);
  if (!raw) {
    const defaultFolders = [{ id: 'general', name: 'Geral' }];
    await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(defaultFolders));
    return defaultFolders;
  }
  return JSON.parse(raw);
};

export const saveFolders = async (folders) => {
  await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
};