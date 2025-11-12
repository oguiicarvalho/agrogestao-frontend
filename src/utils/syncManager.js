import axios from 'axios';
import { saveToIndexedDB, getFromIndexedDB, getPendingSync, clearPendingSync, isOnline } from './offline';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

export const syncData = async () => {
  if (!isOnline()) {
    console.log('Offline - sync adiado');
    return { success: false, message: 'Offline' };
  }

  try {
    // Get last sync timestamp
    const lastSync = await getFromIndexedDB('sync', 'lastSync');
    const lastSyncTime = lastSync?.timestamp || null;

    // Pull data from server
    const response = await axios.post(`${API}/sync/pull`, { last_sync: lastSyncTime });
    const serverData = response.data;

    // Save to IndexedDB
    if (serverData.produtos?.length) {
      await saveToIndexedDB('produtos', serverData.produtos);
    }
    if (serverData.compras?.length) {
      await saveToIndexedDB('compras', serverData.compras);
    }
    if (serverData.consumos?.length) {
      await saveToIndexedDB('consumo', serverData.consumos);
    }
    if (serverData.transacoes?.length) {
      await saveToIndexedDB('transacoes', serverData.transacoes);
    }
    if (serverData.mensagens?.length) {
      await saveToIndexedDB('mensagens', serverData.mensagens);
    }

    // Push pending changes
    const pending = await getPendingSync();
    if (pending.length > 0) {
      for (const item of pending) {
        try {
          // Execute pending action
          await axios.post(item.data.endpoint, item.data.payload);
        } catch (error) {
          console.error('Erro ao sincronizar item pendente:', error);
        }
      }
      await clearPendingSync();
    }

    // Update last sync timestamp
    await saveToIndexedDB('sync', {
      key: 'lastSync',
      timestamp: serverData.timestamp || new Date().toISOString()
    });

    return { success: true, message: 'Sincronização concluída' };
  } catch (error) {
    console.error('Erro na sincronização:', error);
    return { success: false, message: 'Erro na sincronização' };
  }
};

// Auto sync every 5 minutes when online
let syncInterval = null;

export const startAutoSync = () => {
  if (syncInterval) return;
  
  syncInterval = setInterval(() => {
    if (isOnline()) {
      syncData();
    }
  }, 5 * 60 * 1000); // 5 minutes
};

export const stopAutoSync = () => {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
};
