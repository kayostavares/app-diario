import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadFolders, saveFolders, loadEntries, saveEntries } from '../services/storageService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock('../services/firebaseConfig', () => ({
  auth: { currentUser: null },
  db: {},
}));

describe('Testes de Serviço - storageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve retornar a pasta Geral padrão quando não houver pastas salvas', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const folders = await loadFolders();

    expect(folders).toEqual([{ id: 'general', name: 'Geral' }]);
  });

  test('deve salvar a lista de pastas no AsyncStorage', async () => {
    const mockFolders = [
      { id: 'general', name: 'Geral' },
      { id: '2', name: 'Espanha' },
    ];

    await saveFolders(mockFolders);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@diario_app:folders',
      JSON.stringify(mockFolders)
    );
  });

  test('deve carregar lista vazia quando não existirem entradas salvas', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const entries = await loadEntries();

    expect(entries).toEqual([]);
  });

  test('deve salvar registros localmente', async () => {
    const mockEntries = [{ id: '10', title: 'Teste Jest' }];

    await saveEntries(mockEntries);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@diario_app:entries',
      JSON.stringify(mockEntries)
    );
  });
});