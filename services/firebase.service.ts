import { db } from '@/config/FirebaseConfig';
import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where,
  DocumentData,
  QueryConstraint,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';

export class FirebaseService {
  private static instance: FirebaseService;
  
  private constructor() {}
  
  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  async getAll<T>(collectionName: string): Promise<T[]> {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }

  async getById<T>(collectionName: string, id: string): Promise<T | null> {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as T;
    }
    return null;
  }

  async add<T>(collectionName: string, data: DocumentData): Promise<string> {
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  }

  async update(collectionName: string, id: string, data: DocumentData): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  }

  async delete(collectionName: string, id: string): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  }

  async query<T>(collectionName: string, constraints: QueryConstraint[]): Promise<T[]> {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }
}

export const firebaseService = FirebaseService.getInstance(); 