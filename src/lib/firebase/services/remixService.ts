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
import { Remix, PaginatedResponse } from '../types';
import { authService } from './authService';

class RemixService {
  private collectionName = 'remixes';

  async getPublishedRemixes(): Promise<Remix[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const remixes: Remix[] = [];
      querySnapshot.forEach((doc) => {
        remixes.push({ id: doc.id, ...doc.data() } as Remix);
      });
      return remixes;
    } catch (error) {
      console.error('Get published remixes error:', error);
      return [];
    }
  }

  async createRemix(remixData: Omit<Remix, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'lastUpdatedBy'>): Promise<Remix> {
    const user = authService.getCurrentUser();
    console.log('🔍 createRemix called - Current user:', user);

    if (!user || user.role !== 'admin') {
      console.error('❌ Unauthorized: user is null or not admin. Role:', user?.role);
      throw new Error('Unauthorized: Only admins can create remixes');
    }

    try {
      console.log('✅ User is admin, proceeding with remix creation');
      console.log('📝 Remix data:', remixData);

      const newRemix = {
        ...remixData,
        plays: 0,
        downloads: 0,
        likes: 0,
        createdBy: user.uid,
        lastUpdatedBy: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      console.log('🚀 Writing to Firestore collection:', this.collectionName);
      const docRef = await addDoc(collection(db, this.collectionName), newRemix);
      console.log('✨ Remix created with ID:', docRef.id);

      const createdRemix = await this.getRemixById(docRef.id);

      if (!createdRemix) {
        throw new Error('Failed to retrieve created remix');
      }

      console.log('📦 Remix retrieved successfully:', createdRemix);
      return createdRemix;
    } catch (error: any) {
      console.error('❌ CREATE REMIX ERROR - Code:', error.code);
      console.error('❌ CREATE REMIX ERROR - Message:', error.message);
      console.error('❌ CREATE REMIX ERROR - Full error:', error);
      throw new Error(error.message || 'Failed to create remix');
    }
  }

  async getRemixById(id: string): Promise<Remix | null> {
    try {
      const remixDoc = await getDoc(doc(db, this.collectionName, id));
      if (remixDoc.exists()) {
        return { id: remixDoc.id, ...remixDoc.data() } as Remix;
      }
      return null;
    } catch (error) {
      console.error('Get remix by ID error:', error);
      return null;
    }
  }

  async getAllRemixes(options?: {
    pageSize?: number;
    lastDoc?: DocumentSnapshot;
    status?: Remix['status'];
    genre?: string;
    featured?: boolean;
  }): Promise<PaginatedResponse<Remix>> {
    try {
      const constraints: QueryConstraint[] = [];

      if (options?.status) {
        constraints.push(where('status', '==', options.status));
      }

      if (options?.genre) {
        constraints.push(where('genre', '==', options.genre));
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

      const remixes: Remix[] = [];
      querySnapshot.forEach((doc) => {
        if (remixes.length < pageSize) {
          remixes.push({ id: doc.id, ...doc.data() } as Remix);
        }
      });

      const hasMore = querySnapshot.docs.length > pageSize;

      return {
        data: remixes,
        total: remixes.length,
        page: 0,
        pageSize,
        hasMore,
      };
    } catch (error) {
      console.error('Get all remixes error:', error);
      return {
        data: [],
        total: 0,
        page: 0,
        pageSize: options?.pageSize || 20,
        hasMore: false,
      };
    }
  }

  async updateRemix(id: string, updates: Partial<Remix>): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    try {
      await updateDoc(doc(db, this.collectionName, id), {
        ...updates,
        lastUpdatedBy: user.uid,
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      console.error('Update remix error:', error);
      throw new Error(error.message || 'Failed to update remix');
    }
  }

  async deleteRemix(id: string): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    try {
      await deleteDoc(doc(db, this.collectionName, id));
    } catch (error: any) {
      console.error('Delete remix error:', error);
      throw new Error(error.message || 'Failed to delete remix');
    }
  }

  async getFeaturedRemixes(): Promise<Remix[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('featured', '==', true),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        limit(6)
      );
      const querySnapshot = await getDocs(q);

      const remixes: Remix[] = [];
      querySnapshot.forEach((doc) => {
        remixes.push({ id: doc.id, ...doc.data() } as Remix);
      });

      return remixes;
    } catch (error) {
      console.error('Get featured remixes error:', error);
      return [];
    }
  }

  async getGenres(): Promise<string[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      const genres = new Set<string>();

      querySnapshot.forEach((doc) => {
        const remix = doc.data() as Remix;
        if (remix.genre) {
          genres.add(remix.genre);
        }
      });

      return Array.from(genres).sort();
    } catch (error) {
      console.error('Get genres error:', error);
      return [];
    }
  }

  subscribeToRemixes(
    callback: (remixes: Remix[]) => void,
    filters?: {
      status?: Remix['status'];
      featured?: boolean;
      genre?: string;
    }
  ): Unsubscribe {
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];

    if (filters?.status) {
      constraints.push(where('status', '==', filters.status));
    }

    if (filters?.featured !== undefined) {
      constraints.push(where('featured', '==', filters.featured));
    }

    if (filters?.genre) {
      constraints.push(where('genre', '==', filters.genre));
    }

    const q = query(collection(db, this.collectionName), ...constraints);

    return onSnapshot(
      q,
      (querySnapshot) => {
        const remixes: Remix[] = [];
        querySnapshot.forEach((doc) => {
          remixes.push({ id: doc.id, ...doc.data() } as Remix);
        });
        callback(remixes);
      },
      (error) => {
        console.error('Subscribe to remixes error:', error);
      }
    );
  }

  async incrementPlays(id: string): Promise<void> {
    try {
      await updateDoc(doc(db, this.collectionName, id), {
        plays: increment(1),
      });
    } catch (error) {
      console.error('Increment plays error:', error);
    }
  }

  async incrementDownloads(id: string): Promise<void> {
    try {
      await updateDoc(doc(db, this.collectionName, id), {
        downloads: increment(1),
      });
    } catch (error) {
      console.error('Increment downloads error:', error);
    }
  }
}

export const remixService = new RemixService();
