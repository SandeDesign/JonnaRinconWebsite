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
  serverTimestamp,
  increment,
  QueryConstraint,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config';
import { Album, PaginatedResponse } from '../types';
import { authService } from './authService';

class AlbumService {
  private collectionName = 'albums';

  async createAlbum(
    albumData: Omit<
      Album,
      'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'lastUpdatedBy'
    >
  ): Promise<Album> {
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can create albums');
    }

    try {
      const newAlbum = {
        ...albumData,
        plays: 0,
        downloads: 0,
        likes: 0,
        createdBy: user.uid,
        lastUpdatedBy: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, this.collectionName), newAlbum);
      const createdAlbum = await this.getAlbumById(docRef.id);

      if (!createdAlbum) {
        throw new Error('Failed to retrieve created album');
      }

      return createdAlbum;
    } catch (error: any) {
      console.error('Create album error:', error);
      throw new Error(error.message || 'Failed to create album');
    }
  }

  async getAlbumById(id: string): Promise<Album | null> {
    try {
      const albumDoc = await getDoc(doc(db, this.collectionName, id));
      if (albumDoc.exists()) {
        return { id: albumDoc.id, ...albumDoc.data() } as Album;
      }
      return null;
    } catch (error) {
      console.error('Get album by ID error:', error);
      return null;
    }
  }

  async getAllAlbums(options?: {
    pageSize?: number;
    status?: Album['status'];
    featured?: boolean;
  }): Promise<PaginatedResponse<Album>> {
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
      constraints.push(limit(pageSize));

      const q = query(collection(db, this.collectionName), ...constraints);
      const querySnapshot = await getDocs(q);

      const albums: Album[] = [];
      querySnapshot.forEach((doc) => {
        albums.push({ id: doc.id, ...doc.data() } as Album);
      });

      return {
        data: albums,
        total: albums.length,
        page: 0,
        pageSize,
        hasMore: false,
      };
    } catch (error) {
      console.error('Get all albums error:', error);
      return {
        data: [],
        total: 0,
        page: 0,
        pageSize: options?.pageSize || 20,
        hasMore: false,
      };
    }
  }

  async getPublishedAlbums(): Promise<Album[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const albums: Album[] = [];
      querySnapshot.forEach((doc) => {
        albums.push({ id: doc.id, ...doc.data() } as Album);
      });
      return albums;
    } catch (error) {
      console.error('Get published albums error:', error);
      return [];
    }
  }

  async updateAlbum(id: string, updates: Partial<Album>): Promise<void> {
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
      console.error('Update album error:', error);
      throw new Error(error.message || 'Failed to update album');
    }
  }

  async deleteAlbum(id: string): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    try {
      await deleteDoc(doc(db, this.collectionName, id));
    } catch (error: any) {
      console.error('Delete album error:', error);
      throw new Error(error.message || 'Failed to delete album');
    }
  }

  async getFeaturedAlbums(): Promise<Album[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('featured', '==', true),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        limit(6)
      );
      const querySnapshot = await getDocs(q);
      const albums: Album[] = [];
      querySnapshot.forEach((doc) => {
        albums.push({ id: doc.id, ...doc.data() } as Album);
      });
      return albums;
    } catch (error) {
      console.error('Get featured albums error:', error);
      return [];
    }
  }

  async getAlbumsByArtist(artist: string): Promise<Album[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('artist', '==', artist),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const albums: Album[] = [];
      querySnapshot.forEach((doc) => {
        albums.push({ id: doc.id, ...doc.data() } as Album);
      });
      return albums;
    } catch (error) {
      console.error('Get albums by artist error:', error);
      return [];
    }
  }

  subscribeToAlbums(
    callback: (albums: Album[]) => void,
    filters?: {
      status?: Album['status'];
      featured?: boolean;
    },
    onError?: (error: Error) => void
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
        const albums: Album[] = [];
        querySnapshot.forEach((doc) => {
          albums.push({ id: doc.id, ...doc.data() } as Album);
        });
        callback(albums);
      },
      (error) => {
        console.error('Subscribe to albums error:', error);
        if (onError) {
          onError(error as Error);
        }
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

  async addTrackToAlbum(albumId: string, trackId: string, trackNumber: number): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    try {
      const album = await this.getAlbumById(albumId);
      if (!album) {
        throw new Error('Album not found');
      }

      const trackIds = album.trackIds || [];
      if (!trackIds.includes(trackId)) {
        trackIds.push(trackId);
      }

      await this.updateAlbum(albumId, {
        trackIds,
        trackCount: trackIds.length,
      });
    } catch (error: any) {
      console.error('Add track to album error:', error);
      throw new Error(error.message || 'Failed to add track to album');
    }
  }

  async removeTrackFromAlbum(albumId: string, trackId: string): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    try {
      const album = await this.getAlbumById(albumId);
      if (!album) {
        throw new Error('Album not found');
      }

      const trackIds = (album.trackIds || []).filter((id) => id !== trackId);

      await this.updateAlbum(albumId, {
        trackIds,
        trackCount: trackIds.length,
      });
    } catch (error: any) {
      console.error('Remove track from album error:', error);
      throw new Error(error.message || 'Failed to remove track from album');
    }
  }
}

export const albumService = new AlbumService();
