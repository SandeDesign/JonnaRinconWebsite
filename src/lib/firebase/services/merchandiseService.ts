import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  increment,
  QueryConstraint,
  DocumentSnapshot,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config';
import { Merchandise, PaginatedResponse } from '../types';
import { authService } from './authService';
import { cleanFirestoreData } from '../utils/cleanFirestoreData';

class MerchandiseService {
  private collectionName = 'merchandise';

  async getPublishedMerchandise(): Promise<Merchandise[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const merchandise: Merchandise[] = [];
      querySnapshot.forEach((doc) => {
        merchandise.push({ id: doc.id, ...doc.data() } as Merchandise);
      });
      return merchandise;
    } catch (error) {
      console.error('Get published merchandise error:', error);
      return [];
    }
  }

  async createMerchandise(
    merchandiseData: Omit<Merchandise, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'lastUpdatedBy'>
  ): Promise<Merchandise> {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can create merchandise');
    }

    try {
      const newMerchandise = cleanFirestoreData({
        ...merchandiseData,
        views: 0,
        sold: 0,
        createdBy: user.uid,
        lastUpdatedBy: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const docRef = await addDoc(collection(db, this.collectionName), newMerchandise);
      const createdMerchandise = await this.getMerchandiseById(docRef.id);

      if (!createdMerchandise) {
        throw new Error('Failed to retrieve created merchandise');
      }

      return createdMerchandise;
    } catch (error: any) {
      console.error('Create merchandise error:', error);
      throw new Error(error.message || 'Failed to create merchandise');
    }
  }

  async getMerchandiseById(id: string): Promise<Merchandise | null> {
    try {
      const merchandiseDoc = await getDoc(doc(db, this.collectionName, id));
      if (merchandiseDoc.exists()) {
        return { id: merchandiseDoc.id, ...merchandiseDoc.data() } as Merchandise;
      }
      return null;
    } catch (error) {
      console.error('Get merchandise by ID error:', error);
      return null;
    }
  }

  async getAllMerchandise(options?: {
    pageSize?: number;
    lastDoc?: DocumentSnapshot;
    status?: Merchandise['status'];
    featured?: boolean;
  }): Promise<PaginatedResponse<Merchandise>> {
    try {
      const constraints: QueryConstraint[] = [];

      if (options?.status) {
        constraints.push(where('status', '==', options.status));
      }

      if (options?.featured !== undefined) {
        constraints.push(where('featured', '==', options.featured));
      }

      constraints.push(orderBy('createdAt', 'desc'));

      const pageSize = options?.pageSize || 20;
      constraints.push(limit(pageSize + 1));

      if (options?.lastDoc) {
        constraints.push(startAfter(options.lastDoc));
      }

      const q = query(collection(db, this.collectionName), ...constraints);
      const querySnapshot = await getDocs(q);

      const merchandise: Merchandise[] = [];
      querySnapshot.forEach((doc) => {
        if (merchandise.length < pageSize) {
          merchandise.push({ id: doc.id, ...doc.data() } as Merchandise);
        }
      });

      const hasMore = querySnapshot.docs.length > pageSize;

      return {
        data: merchandise,
        total: merchandise.length,
        page: 0,
        pageSize,
        hasMore,
      };
    } catch (error) {
      console.error('Get all merchandise error:', error);
      return {
        data: [],
        total: 0,
        page: 0,
        pageSize: options?.pageSize || 20,
        hasMore: false,
      };
    }
  }

  async updateMerchandise(id: string, updates: Partial<Merchandise>): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    try {
      const updateData = cleanFirestoreData({
        ...updates,
        lastUpdatedBy: user.uid,
        updatedAt: serverTimestamp(),
      });
      await updateDoc(doc(db, this.collectionName, id), updateData);
    } catch (error: any) {
      console.error('Update merchandise error:', error);
      throw new Error(error.message || 'Failed to update merchandise');
    }
  }

  async deleteMerchandise(id: string): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    try {
      await deleteDoc(doc(db, this.collectionName, id));
    } catch (error: any) {
      console.error('Delete merchandise error:', error);
      throw new Error(error.message || 'Failed to delete merchandise');
    }
  }

  async getFeaturedMerchandise(): Promise<Merchandise[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('featured', '==', true),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        limit(6)
      );
      const querySnapshot = await getDocs(q);

      const merchandise: Merchandise[] = [];
      querySnapshot.forEach((doc) => {
        merchandise.push({ id: doc.id, ...doc.data() } as Merchandise);
      });

      return merchandise;
    } catch (error) {
      console.error('Get featured merchandise error:', error);
      return [];
    }
  }

  subscribeToMerchandise(
    callback: (merchandise: Merchandise[]) => void,
    filters?: {
      status?: Merchandise['status'];
      featured?: boolean;
    }
  ): Unsubscribe {
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];

    if (filters?.status) {
      constraints.push(where('status', '==', filters.status));
    }

    if (filters?.featured !== undefined) {
      constraints.push(where('featured', '==', filters.featured));
    }

    const q = query(collection(db, this.collectionName), ...constraints);

    return onSnapshot(
      q,
      (querySnapshot) => {
        const merchandise: Merchandise[] = [];
        querySnapshot.forEach((doc) => {
          merchandise.push({ id: doc.id, ...doc.data() } as Merchandise);
        });
        callback(merchandise);
      },
      (error) => {
        console.error('Subscribe to merchandise error:', error);
      }
    );
  }

  async incrementViews(id: string): Promise<void> {
    try {
      await updateDoc(doc(db, this.collectionName, id), {
        views: increment(1),
      });
    } catch (error) {
      console.error('Increment views error:', error);
    }
  }

  async incrementSold(id: string): Promise<void> {
    try {
      await updateDoc(doc(db, this.collectionName, id), {
        sold: increment(1),
      });
    } catch (error) {
      console.error('Increment sold error:', error);
    }
  }
}

export const merchandiseService = new MerchandiseService();
