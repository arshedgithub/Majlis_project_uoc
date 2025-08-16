import { db, auth } from '@/config/FirebaseConfig';
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
  doc,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  writeBatch,
  runTransaction
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  UserCredential
} from 'firebase/auth';

export interface PaginationOptions {
  limit?: number;
  startAfter?: QueryDocumentSnapshot;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface QueryOptions {
  field: string;
  operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in';
  value: any;
}

export class FirebaseService {
  private static instance: FirebaseService;
  
  private constructor() {}
  
  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  // Authentication Methods
  async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  async signUp(email: string, password: string, displayName?: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      return userCredential;
    } catch (error: any) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(`Sign out failed: ${error.message}`);
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(`Password reset failed: ${error.message}`);
    }
  }

  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  onAuthStateChange(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  // Firestore CRUD Methods
  async getAll<T>(collectionName: string, options?: PaginationOptions): Promise<T[]> {
    try {
      const collectionRef = collection(db, collectionName);
      let q = query(collectionRef);

      if (options?.orderBy) {
        q = query(q, orderBy(options.orderBy, options.orderDirection || 'desc'));
      }

      if (options?.limit) {
        q = query(q, limit(options.limit));
      }

      if (options?.startAfter) {
        q = query(q, startAfter(options.startAfter));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error: any) {
      throw new Error(`Failed to fetch ${collectionName}: ${error.message}`);
    }
  }

  async getById<T>(collectionName: string, id: string): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as T;
      }
      return null;
    } catch (error: any) {
      throw new Error(`Failed to fetch ${collectionName} with id ${id}: ${error.message}`);
    }
  }

  async add<T>(collectionName: string, data: DocumentData): Promise<string> {
    try {
      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error: any) {
      throw new Error(`Failed to add document to ${collectionName}: ${error.message}`);
    }
  }

  async update(collectionName: string, id: string, data: DocumentData): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (error: any) {
      throw new Error(`Failed to update ${collectionName} with id ${id}: ${error.message}`);
    }
  }

  async delete(collectionName: string, id: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error: any) {
      throw new Error(`Failed to delete ${collectionName} with id ${id}: ${error.message}`);
    }
  }

  async query<T>(collectionName: string, constraints: QueryConstraint[]): Promise<T[]> {
    try {
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, ...constraints);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error: any) {
      throw new Error(`Failed to query ${collectionName}: ${error.message}`);
    }
  }

  async queryWithOptions<T>(collectionName: string, options: QueryOptions[], pagination?: PaginationOptions): Promise<T[]> {
    try {
      const collectionRef = collection(db, collectionName);
      let q = query(collectionRef);

      // Add where clauses
      for (const option of options) {
        q = query(q, where(option.field, option.operator, option.value));
      }

      // Add pagination
      if (pagination?.orderBy) {
        q = query(q, orderBy(pagination.orderBy, pagination.orderDirection || 'desc'));
      }

      if (pagination?.limit) {
        q = query(q, limit(pagination.limit));
      }

      if (pagination?.startAfter) {
        q = query(q, startAfter(pagination.startAfter));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error: any) {
      throw new Error(`Failed to query ${collectionName} with options: ${error.message}`);
    }
  }

  // Batch operations for better performance
  async batchAdd<T>(collectionName: string, dataArray: DocumentData[]): Promise<string[]> {
    try {
      const batch = writeBatch(db);
      const ids: string[] = [];

      for (const data of dataArray) {
        const docRef = doc(collection(db, collectionName));
        batch.set(docRef, {
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        ids.push(docRef.id);
      }

      await batch.commit();
      return ids;
    } catch (error: any) {
      throw new Error(`Failed to batch add to ${collectionName}: ${error.message}`);
    }
  }

  async batchUpdate(collectionName: string, updates: { id: string; data: DocumentData }[]): Promise<void> {
    try {
      const batch = writeBatch(db);

      for (const update of updates) {
        const docRef = doc(db, collectionName, update.id);
        batch.update(docRef, {
          ...update.data,
          updatedAt: new Date().toISOString()
        });
      }

      await batch.commit();
    } catch (error: any) {
      throw new Error(`Failed to batch update ${collectionName}: ${error.message}`);
    }
  }

  async batchDelete(collectionName: string, ids: string[]): Promise<void> {
    try {
      const batch = writeBatch(db);

      for (const id of ids) {
        const docRef = doc(db, collectionName, id);
        batch.delete(docRef);
      }

      await batch.commit();
    } catch (error: any) {
      throw new Error(`Failed to batch delete from ${collectionName}: ${error.message}`);
    }
  }

  // Transaction support
  async runTransaction<T>(updateFunction: (transaction: any) => Promise<T>): Promise<T> {
    try {
      return await runTransaction(db, updateFunction);
    } catch (error: any) {
      throw new Error(`Transaction failed: ${error.message}`);
    }
  }
}

export const firebaseService = FirebaseService.getInstance(); 