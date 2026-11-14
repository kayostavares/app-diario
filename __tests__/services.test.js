import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { getCurrentLocation } from '../services/locationService';
import { takePhoto, pickImageFromGallery } from '../services/cameraService';

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  reverseGeocodeAsync: jest.fn(),
  Accuracy: { Balanced: 3 },
}));

jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

describe('Testes de Serviços Nativos (GPS e Câmera)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('locationService: deve lançar erro PERMISSION_DENIED se permissão de GPS for negada', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: 'denied' });

    await expect(getCurrentLocation()).rejects.toThrow('PERMISSION_DENIED');
  });

  test('locationService: deve retornar coordenadas e endereço quando permitido', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValueOnce({
      coords: { latitude: -23.55, longitude: -46.63 },
    });
    Location.reverseGeocodeAsync.mockResolvedValueOnce([
      { street: 'Av. Paulista', district: 'Bela Vista', city: 'São Paulo' },
    ]);

    const result = await getCurrentLocation();

    expect(result).toEqual({
      latitude: -23.55,
      longitude: -46.63,
      address: 'Av. Paulista, Bela Vista, São Paulo',
    });
  });

  test('cameraService: deve lançar erro se permissão da câmera for negada', async () => {
    ImagePicker.requestCameraPermissionsAsync.mockResolvedValueOnce({ status: 'denied' });

    await expect(takePhoto()).rejects.toThrow('PERMISSION_DENIED');
  });

  test('cameraService: deve retornar o URI da foto ao capturar pela câmera', async () => {
    ImagePicker.requestCameraPermissionsAsync.mockResolvedValueOnce({ status: 'granted' });
    ImagePicker.launchCameraAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'file://foto.jpg' }],
    });

    const photo = await takePhoto();

    expect(photo).toBe('file://foto.jpg');
  });

  test('cameraService: deve retornar null se o usuário cancelar a galeria', async () => {
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({ status: 'granted' });
    ImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({ canceled: true });

    const photo = await pickImageFromGallery();

    expect(photo).toBeNull();
  });
});