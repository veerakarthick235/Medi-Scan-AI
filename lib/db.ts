// Patient Assessment Database
// Uses IndexedDB for efficient client-side storage of assessments

export type Assessment = {
  id: string;
  patientName: string;
  date: string;
  symptoms: string;
  diagnosis: string;
  urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  confidenceScore: number;
  reasoning: string;
  recommendedActions: string[];
  processingTime: number;
  imageData?: string; // Base64 encoded
  audioData?: string; // Base64 encoded
};

const DB_NAME = 'MediScanDB';
const STORE_NAME = 'assessments';
const DB_VERSION = 1;

let db: IDBDatabase | null = null;

export const initDB = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('patientName', 'patientName', { unique: false });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('urgencyLevel', 'urgencyLevel', { unique: false });
      }
    };
  });
};

export const saveAssessment = async (assessment: Assessment): Promise<string> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(assessment);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as string);
  });
};

export const getAssessment = async (id: string): Promise<Assessment | null> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
};

export const getAllAssessments = async (): Promise<Assessment[]> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as Assessment[]);
  });
};

export const searchAssessments = async (
  query: string,
  field: 'patientName' | 'date' | 'urgencyLevel' = 'patientName'
): Promise<Assessment[]> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index(field);
    const request = index.getAll(query);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as Assessment[]);
  });
};

export const deleteAssessment = async (id: string): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const clearAllAssessments = async (): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};
