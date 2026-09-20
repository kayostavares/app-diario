export const createEntry = ({ title, photoUri, coords, folderId = 'general' }) => ({
  id: Date.now().toString(),
  title: title.trim(),
  done: false,
  photoUri: photoUri || null,
  coords: coords,
  folderId: folderId || 'general',
  createdAt: new Date().toISOString(),
});

export const updateEntry = (entries, id, { title, photoUri, coords, folderId }) =>
  entries.map((entry) =>
    entry.id === id
      ? {
          ...entry,
          title: title.trim(),
          photoUri: photoUri !== undefined ? photoUri : entry.photoUri,
          coords: coords || entry.coords,
          folderId: folderId || entry.folderId || 'general',
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