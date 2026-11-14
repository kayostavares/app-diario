import { createEntry, updateEntry, toggleEntry, removeEntry } from '../utils/entryUtils';

describe('Testes Unitários - entryUtils', () => {
  const sampleCoords = {
    latitude: -23.5505,
    longitude: -46.6333,
    address: 'Praça da Sé, São Paulo',
  };

  test('deve criar um novo registro corretamente com pasta padrão', () => {
    const entry = createEntry({
      title: '  Inspeção da Área Norte  ',
      photoUri: 'file://foto.jpg',
      coords: sampleCoords,
    });

    expect(entry.title).toBe('Inspeção da Área Norte');
    expect(entry.done).toBe(false);
    expect(entry.folderId).toBe('general');
    expect(entry.coords).toEqual(sampleCoords);
    expect(entry.photoUri).toBe('file://foto.jpg');
    expect(entry.id).toBeDefined();
    expect(entry.createdAt).toBeDefined();
  });

  test('deve criar um registro vinculado a uma pasta específica', () => {
    const entry = createEntry({
      title: 'Registro Espanha',
      photoUri: null,
      coords: sampleCoords,
      folderId: 'pasta_espanha_123',
    });

    expect(entry.folderId).toBe('pasta_espanha_123');
    expect(entry.photoUri).toBeNull();
  });

  test('deve alternar o status (done) de um registro específico', () => {
    const initialEntries = [
      { id: '1', title: 'Tarefa 1', done: false },
      { id: '2', title: 'Tarefa 2', done: false },
    ];

    const updated = toggleEntry(initialEntries, '1');

    expect(updated[0].done).toBe(true);
    expect(updated[1].done).toBe(false);
  });

  test('deve editar o título e pasta de um registro existente', () => {
    const initialEntries = [
      {
        id: '1',
        title: 'Título Antigo',
        done: false,
        folderId: 'general',
        coords: sampleCoords,
      },
    ];

    const updated = updateEntry(initialEntries, '1', {
      title: 'Título Atualizado',
      folderId: 'espanha',
    });

    expect(updated[0].title).toBe('Título Atualizado');
    expect(updated[0].folderId).toBe('espanha');
    expect(updated[0].updatedAt).toBeDefined();
  });

  test('deve remover um registro pelo ID sem afetar os outros', () => {
    const initialEntries = [
      { id: '1', title: 'Manter' },
      { id: '2', title: 'Remover' },
    ];

    const updated = removeEntry(initialEntries, '2');

    expect(updated).toHaveLength(1);
    expect(updated[0].id).toBe('1');
  });
});