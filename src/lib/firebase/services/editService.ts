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
import { Edit, PaginatedResponse } from '../types';
import { authService } from './authService';

class EditService {
  private collectionName = 'edits';

  async getPublishedEdits(): Promise<Edit[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const edits: Edit[] = [];
      querySnapshot.forEach((doc) => {
        edits.push({ id: doc.id, ...doc.data() } as Edit);
      });
      return edits;
    } catch (error) {
      console.error('Get published edits error:', error);
      return [];
    }
  }

  async createEdit(editData: Omit<Edit, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'lastUpdatedBy'>): Promise<Edit> {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can create edits');
    }

    try {
      const newEdit = {
        ...editData,
        plays: 0,
        downloads: 0,
        likes: 0,
        createdBy: user.uid,
        lastUpdatedBy: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, this.collectionName), newEdit);
      const createdEdit = await this.getEditById(docRef.id);

      if (!createdEdit) {
        throw new Error('Failed to retrieve created edit');
      }

      return createdEdit;
    } catch (error: any) {
      console.error('Create edit error:', error);
      throw new Error(error.message || 'Failed to create edit');
    }
  }

  async getEditById(id: string): Promise<Edit | null> {
    try {
      const editDoc = await getDoc(doc(db, this.collectionName, id));
      if (editDoc.exists()) {
        return { id: editDoc.id, ...editDoc.data() } as Edit;
      }
      return null;
    } catch (error) {
      console.error('Get edit by ID error:', error);
      return null;
    }
  }

  async getAllEdits(options?: {
    pageSize?: number;
    lastDoc?: DocumentSnapshot;
    status?: Edit['status'];
    genre?: string;
    featured?: boolean;
  }): Promise<PaginatedResponse<Edit>> {
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

      const edits: Edit[] = [];
      querySnapshot.forEach((doc) => {
        if (edits.length < pageSize) {
          edits.push({ id: doc.id, ...doc.data() } as Edit);
        }
      });

      const hasMore = querySnapshot.docs.length > pageSize;

      return {
        data: edits,
        total: edits.length,
        page: 0,
        pageSize,
        hasMore,
      };
    } catch (error) {
      console.error('Get all edits error:', error);
      return {
        data: [],
        total: 0,
        page: 0,
        pageSize: options?.pageSize || 20,
        hasMore: false,
      };
    }
  }

  async updateEdit(id: string, updates: Partial<Edit>): Promise<void> {
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
      console.error('Update edit error:', error);
      throw new Error(error.message || 'Failed to update edit');
    }
  }

  async deleteEdit(id: string): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    try {
      await deleteDoc(doc(db, this.collectionName, id));
    } catch (error: any) {
      console.error('Delete edit error:', error);
      throw new Error(error.message || 'Failed to delete edit');
    }
  }

  async getFeaturedEdits(): Promise<Edit[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('featured', '==', true),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        limit(6)
      );
      const querySnapshot = await getDocs(q);

      const edits: Edit[] = [];
      querySnapshot.forEach((doc) => {
        edits.push({ id: doc.id, ...doc.data() } as Edit);
      });

      return edits;
    } catch (error) {
      console.error('Get featured edits error:', error);
      return [];
    }
  }

  async getGenres(): Promise<string[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      const genres = new Set<string>();

      querySnapshot.forEach((doc) => {
        const edit = doc.data() as Edit;
        if (edit.genre) {
          genres.add(edit.genre);
        }
      });

      return Array.from(genres).sort();
    } catch (error) {
      console.error('Get genres error:', error);
      return [];
    }
  }

  subscribeToEdits(
    callback: (edits: Edit[]) => void,
    filters?: {
      status?: Edit['status'];
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
        const edits: Edit[] = [];
        querySnapshot.forEach((doc) => {
          edits.push({ id: doc.id, ...doc.data() } as Edit);
        });
        callback(edits);
      },
      (error) => {
        console.error('Subscribe to edits error:', error);
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

export const editService = new EditService();
