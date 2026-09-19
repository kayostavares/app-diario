export const createEntry = ({ title, photoUri, coords }) => ({
  id: Date.now().toString(),
  title: title.trim(),
  done: false,
  photoUri: photoUri || null,
  coords: coords || null,
  createdAt: new Date().toISOString(),
});

export const toggleEntry = (entries, id) =>
  entries.map((entry) =>
    entry.id === id ? { ...entry, done: !entry.done } : entry
  );

export const removeEntry = (entries, id) =>
  entries.filter((entry) => entry.id !== id);