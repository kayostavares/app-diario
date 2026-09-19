import * as ImagePicker from 'expo-image-picker';

// Tirar foto com a câmera
export const takePhoto = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('PERMISSION_DENIED');
  }

  const result = await ImagePicker.launchCameraAsync({
    quality: 0.7,
    allowsEditing: true,
    aspect: [4, 3],
  });

  if (result.canceled) return null;
  return result.assets[0].uri;
};

// Escolher foto da galeria
export const pickImageFromGallery = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('PERMISSION_DENIED');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    quality: 0.7,
    allowsEditing: true,
    aspect: [4, 3],
  });

  if (result.canceled) return null;
  return result.assets[0].uri;
};