export const createEntry = ({ title, photoUri, coords }) => ({
  id: Date.now().toString(),
  title: title.trim(),
  done: false,
  photoUri: photoUri || null,
  coords: coords, // Coordenadas obrigatórias
  createdAt: new Date().toISOString(),
});

export const updateEntry = (entries, id, { title, photoUri, coords }) =>
  entries.map((entry) =>
    entry.id === id
      ? {
          ...entry,
          title: title.trim(),
          photoUri: photoUri || null,
          coords: coords || entry.coords,
          updatedAt: new Date().toISOString(),
        }
      : entry
  );

export const toggleEntry = (entries, id) =>
  entries.map((entry) =>
    entry.id === id ? { ...entry, done: !entry.done } : entry
  );

export const removeEntry = (entries, id) =>
  entries.filter((entry) => entry.id !== id);