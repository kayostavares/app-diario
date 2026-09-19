import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@diario_app:entries';

export const loadEntries = async () => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const saveEntries = async (entries) => {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(entries)
  );
};