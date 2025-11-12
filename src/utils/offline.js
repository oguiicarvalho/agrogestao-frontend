import { openDB } from 'idb';

const DB_NAME = 'ruralgest-db';
const DB_VERSION = 1;

let db = null;

export const initDB = async () => {
  if (db) return db;
  
  db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(database) {
      // Stores
      if (!database.objectStoreNames.contains('produtos')) {
        database.createObjectStore('produtos', { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains('compras')) {
        database.createObjectStore('compras', { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains('consumo')) {
        database.createObjectStore('consumo', { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains('transacoes')) {
        database.createObjectStore('transacoes', { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains('mensagens')) {
        database.createObjectStore('mensagens', { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains('sync')) {
        database.createObjectStore('sync', { keyPath: 'key' });
      }
      if (!database.objectStoreNames.contains('pendingSync')) {
        database.createObjectStore('pendingSync', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
  
  return db;
};

// Save to IndexedDB
export const saveToIndexedDB = async (storeName, data) => {
  const database = await initDB();
  const tx = database.transaction(storeName, 'readwrite');
  
  if (Array.isArray(data)) {
    for (const item of data) {
      await tx.store.put(item);
    }
  } else {
    await tx.store.put(data);
  }
  
  await tx.done;
};

// Get from IndexedDB
export const getFromIndexedDB = async (storeName, key = null) => {
  const database = await initDB();
  
  if (key) {
    return await database.get(storeName, key);
  }
  
  return await database.getAll(storeName);
};

// Delete from IndexedDB
export const deleteFromIndexedDB = async (storeName, key) => {
  const database = await initDB();
  await database.delete(storeName, key);
};

// Clear store
export const clearIndexedDBStore = async (storeName) => {
  const database = await initDB();
  await database.clear(storeName);
};

// Save pending sync
export const savePendingSync = async (action, data) => {
  const database = await initDB();
  await database.add('pendingSync', {
    action,
    data,
    timestamp: new Date().toISOString()
  });
};

// Get pending syncs
export const getPendingSync = async () => {
  const database = await initDB();
  return await database.getAll('pendingSync');
};

// Clear pending sync
export const clearPendingSync = async () => {
  const database = await initDB();
  await database.clear('pendingSync');
};

// Check if online
export const isOnline = () => {
  return navigator.onLine;
};
