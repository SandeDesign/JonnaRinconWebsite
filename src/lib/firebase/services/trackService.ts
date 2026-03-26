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
import { Track, PaginatedResponse } from '../types';
import { authService } from './authService';

class TrackService {
  private collectionName = 'tracks';

  async getPublishedTracks(): Promise<Track[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const tracks: Track[] = [];
      querySnapshot.forEach((doc) => {
        tracks.push({ id: doc.id, ...doc.data() } as Track);
      });
      return tracks;
    } catch (error) {
      console.error('Get published tracks error:', error);
      return [];
    }
  }

  async createTrack(trackData: Omit<Track, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'lastUpdatedBy'>): Promise<Track> {
    const user = authService.getCurrentUser();
    console.log('🔍 createTrack called - Current user:', user);

    if (!user || user.role !== 'admin') {
      console.error('❌ Unauthorized: user is null or not admin. Role:', user?.role);
      throw new Error('Unauthorized: Only admins can create tracks');
    }

    try {
      console.log('✅ User is admin, proceeding with track creation');
      console.log('📝 Track data:', trackData);

      const newTrack = {
        ...trackData,
        plays: 0,
        downloads: 0,
        likes: 0,
        createdBy: user.uid,
        lastUpdatedBy: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      console.log('🚀 Writing to Firestore collection:', this.collectionName);
      const docRef = await addDoc(collection(db, this.collectionName), newTrack);
      console.log('✨ Track created with ID:', docRef.id);

      const createdTrack = await this.getTrackById(docRef.id);

      if (!createdTrack) {
        throw new Error('Failed to retrieve created track');
      }

      console.log('📦 Track retrieved successfully:', createdTrack);
      return createdTrack;
    } catch (error: any) {
      console.error('❌ CREATE TRACK ERROR - Code:', error.code);
      console.error('❌ CREATE TRACK ERROR - Message:', error.message);
      console.error('❌ CREATE TRACK ERROR - Full error:', error);
      throw new Error(error.message || 'Failed to create track');
    }
  }

  async getTrackById(id: string): Promise<Track | null> {
    try {
      const trackDoc = await getDoc(doc(db, this.collectionName, id));
      if (trackDoc.exists()) {
        return { id: trackDoc.id, ...trackDoc.data() } as Track;
      }
      return null;
    } catch (error) {
      console.error('Get track by ID error:', error);
      return null;
    }
  }

  async getAllTracks(options?: {
    pageSize?: number;
    lastDoc?: DocumentSnapshot;
    status?: Track['status'];
    genre?: string;
    featured?: boolean;
  }): Promise<PaginatedResponse<Track>> {
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

      const tracks: Track[] = [];
      querySnapshot.forEach((doc) => {
        if (tracks.length < pageSize) {
          tracks.push({ id: doc.id, ...doc.data() } as Track);
        }
      });

      const hasMore = querySnapshot.docs.length > pageSize;

      return {
        data: tracks,
        total: tracks.length,
        page: 0,
        pageSize,
        hasMore,
      };
    } catch (error) {
      console.error('Get all tracks error:', error);
      return {
        data: [],
        total: 0,
        page: 0,
        pageSize: options?.pageSize || 20,
        hasMore: false,
      };
    }
  }

  async updateTrack(id: string, updates: Partial<Track>): Promise<void> {
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
      console.error('Update track error:', error);
      throw new Error(error.message || 'Failed to update track');
    }
  }

  async deleteTrack(id: string): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    try {
      await deleteDoc(doc(db, this.collectionName, id));
    } catch (error: any) {
      console.error('Delete track error:', error);
      throw new Error(error.message || 'Failed to delete track');
    }
  }

  async getFeaturedTracks(): Promise<Track[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('featured', '==', true),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        limit(6)
      );
      const querySnapshot = await getDocs(q);

      const tracks: Track[] = [];
      querySnapshot.forEach((doc) => {
        tracks.push({ id: doc.id, ...doc.data() } as Track);
      });

      return tracks;
    } catch (error) {
      console.error('Get featured tracks error:', error);
      return [];
    }
  }

  async getGenres(): Promise<string[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      const genres = new Set<string>();

      querySnapshot.forEach((doc) => {
        const track = doc.data() as Track;
        if (track.genre) {
          genres.add(track.genre);
        }
      });

      return Array.from(genres).sort();
    } catch (error) {
      console.error('Get genres error:', error);
      return [];
    }
  }

  subscribeToTracks(
    callback: (tracks: Track[]) => void,
    filters?: {
      status?: Track['status'];
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
        const tracks: Track[] = [];
        querySnapshot.forEach((doc) => {
          tracks.push({ id: doc.id, ...doc.data() } as Track);
        });
        callback(tracks);
      },
      (error) => {
        console.error('Subscribe to tracks error:', error);
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

export const trackService = new TrackService();
