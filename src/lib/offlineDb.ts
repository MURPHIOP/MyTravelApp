export interface OfflineMutation {
  id: string;
  timestamp: number;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  table: 'expenses';
  payload: Record<string, unknown>;
  retryCount: number;
  status: 'PENDING' | 'SYNCING' | 'FAILED';
}

const DB_NAME = 'MyTravelApp_OfflineDB';
const DB_VERSION = 1;
const STORE_MUTATIONS = 'offline_mutations';
const STORE_CACHED_EXPENSES = 'cached_expenses';

function getIndexedDB(): IDBFactory | null {
  if (typeof window === 'undefined') return null;
  return window.indexedDB || (window as unknown as { mozIndexedDB?: IDBFactory; webkitIndexedDB?: IDBFactory }).mozIndexedDB || (window as unknown as { webkitIndexedDB?: IDBFactory }).webkitIndexedDB || null;
}

export function openOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const idb = getIndexedDB();
    if (!idb) {
      reject(new Error('IndexedDB is not supported in this runtime environment.'));
      return;
    }

    const request = idb.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_MUTATIONS)) {
        const mutationStore = db.createObjectStore(STORE_MUTATIONS, { keyPath: 'id' });
        mutationStore.createIndex('timestamp', 'timestamp', { unique: false });
        mutationStore.createIndex('status', 'status', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORE_CACHED_EXPENSES)) {
        db.createObjectStore(STORE_CACHED_EXPENSES, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Enqueue a mutation for offline background replay
 */
export async function enqueueMutation(
  type: 'CREATE' | 'UPDATE' | 'DELETE',
  table: 'expenses',
  payload: Record<string, unknown>
): Promise<OfflineMutation> {
  const db = await openOfflineDB();
  const mutation: OfflineMutation = {
    id: `mut-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    timestamp: Date.now(),
    type,
    table,
    payload,
    retryCount: 0,
    status: 'PENDING',
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_MUTATIONS], 'readwrite');
    const store = transaction.objectStore(STORE_MUTATIONS);
    const request = store.add(mutation);

    request.onsuccess = () => resolve(mutation);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get all pending mutations sorted chronologically (FIFO)
 */
export async function getPendingMutations(): Promise<OfflineMutation[]> {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_MUTATIONS], 'readonly');
      const store = transaction.objectStore(STORE_MUTATIONS);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = (request.result as OfflineMutation[]) || [];
        // Sort FIFO by timestamp
        results.sort((a, b) => a.timestamp - b.timestamp);
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    return [];
  }
}

/**
 * Remove a successfully synced mutation
 */
export async function removeMutation(id: string): Promise<void> {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_MUTATIONS], 'readwrite');
      const store = transaction.objectStore(STORE_MUTATIONS);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('Failed to remove mutation:', err);
  }
}

/**
 * Update mutation status or increment retry count
 */
export async function updateMutationStatus(
  id: string,
  status: 'PENDING' | 'SYNCING' | 'FAILED',
  retryCount?: number
): Promise<void> {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_MUTATIONS], 'readwrite');
      const store = transaction.objectStore(STORE_MUTATIONS);
      const getReq = store.get(id);

      getReq.onsuccess = () => {
        const record = getReq.result as OfflineMutation;
        if (!record) {
          resolve();
          return;
        }
        record.status = status;
        if (typeof retryCount === 'number') {
          record.retryCount = retryCount;
        }
        const updateReq = store.put(record);
        updateReq.onsuccess = () => resolve();
        updateReq.onerror = () => reject(updateReq.error);
      };
      getReq.onerror = () => reject(getReq.error);
    });
  } catch (err) {
    console.error('Failed to update mutation status:', err);
  }
}

/**
 * Cache expenses for offline read mirroring
 */
export async function saveCachedExpenses<T extends { id: string }>(expenses: T[]): Promise<void> {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_CACHED_EXPENSES], 'readwrite');
      const store = transaction.objectStore(STORE_CACHED_EXPENSES);
      
      // Clear store first to sync current state
      store.clear().onsuccess = () => {
        expenses.forEach((item) => store.put(item));
      };

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (err) {
    console.warn('Unable to persist cached expenses to IndexedDB:', err);
  }
}

/**
 * Retrieve cached expenses when offline
 */
export async function getCachedExpenses<T = unknown>(): Promise<T[]> {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_CACHED_EXPENSES], 'readonly');
      const store = transaction.objectStore(STORE_CACHED_EXPENSES);
      const request = store.getAll();

      request.onsuccess = () => resolve((request.result as T[]) || []);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return [];
  }
}
