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
import { Content, ContentType, ContentStatus } from '../types';
import { authService } from './authService';

class ContentService {
  private collectionName = 'content';

  async createContent(
    contentData: Omit<Content, 'id' | 'createdAt' | 'updatedAt' | 'author' | 'authorName' | 'views' | 'likes' | 'shares'>
  ): Promise<Content> {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can create content');
    }

    try {
      const newContent = {
        ...contentData,
        author: user.uid,
        authorName: user.displayName || user.email,
        views: 0,
        likes: 0,
        shares: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, this.collectionName), newContent);
      const createdContent = await this.getContentById(docRef.id);

      if (!createdContent) {
        throw new Error('Failed to retrieve created content');
      }

      return createdContent;
    } catch (error: any) {
      console.error('Create content error:', error);
      throw new Error(error.message || 'Failed to create content');
    }
  }

  async getContentById(id: string): Promise<Content | null> {
    try {
      const contentDoc = await getDoc(doc(db, this.collectionName, id));
      if (contentDoc.exists()) {
        return { id: contentDoc.id, ...contentDoc.data() } as Content;
      }
      return null;
    } catch (error) {
      console.error('Get content by ID error:', error);
      return null;
    }
  }

  async getContentBySlug(slug: string): Promise<Content | null> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('slug', '==', slug),
        limit(1)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Content;
      }
      return null;
    } catch (error) {
      console.error('Get content by slug error:', error);
      return null;
    }
  }

  async getAllContent(options?: {
    type?: ContentType;
    status?: ContentStatus;
    featured?: boolean;
    category?: string;
    limitCount?: number;
  }): Promise<Content[]> {
    try {
      const constraints: QueryConstraint[] = [];

      if (options?.type) {
        constraints.push(where('type', '==', options.type));
      }

      if (options?.status) {
        constraints.push(where('status', '==', options.status));
      }

      if (options?.featured !== undefined) {
        constraints.push(where('featured', '==', options.featured));
      }

      if (options?.category) {
        constraints.push(where('category', '==', options.category));
      }

      constraints.push(orderBy('createdAt', 'desc'));

      if (options?.limitCount) {
        constraints.push(limit(options.limitCount));
      }

      const q = query(collection(db, this.collectionName), ...constraints);
      const querySnapshot = await getDocs(q);

      const content: Content[] = [];
      querySnapshot.forEach((doc) => {
        content.push({ id: doc.id, ...doc.data() } as Content);
      });

      return content;
    } catch (error) {
      console.error('Get all content error:', error);
      throw new Error('Failed to fetch content');
    }
  }

  async getPublishedContent(type?: ContentType, limitCount?: number): Promise<Content[]> {
    try {
      const constraints: QueryConstraint[] = [
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc'),
      ];

      if (type) {
        constraints.push(where('type', '==', type));
      }

      if (limitCount) {
        constraints.push(limit(limitCount));
      }

      const q = query(collection(db, this.collectionName), ...constraints);
      const querySnapshot = await getDocs(q);

      const content: Content[] = [];
      querySnapshot.forEach((doc) => {
        content.push({ id: doc.id, ...doc.data() } as Content);
      });

      return content;
    } catch (error) {
      console.error('Get published content error:', error);
      return [];
    }
  }

  async getFeaturedContent(type?: ContentType): Promise<Content[]> {
    try {
      const constraints: QueryConstraint[] = [
        where('featured', '==', true),
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc'),
      ];

      if (type) {
        constraints.push(where('type', '==', type));
      }

      const q = query(collection(db, this.collectionName), ...constraints);
      const querySnapshot = await getDocs(q);

      const content: Content[] = [];
      querySnapshot.forEach((doc) => {
        content.push({ id: doc.id, ...doc.data() } as Content);
      });

      return content;
    } catch (error) {
      console.error('Get featured content error:', error);
      return [];
    }
  }

  async updateContent(id: string, data: Partial<Content>): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can update content');
    }

    try {
      const updateData = {
        ...data,
        updatedAt: serverTimestamp(),
      };

      if (data.status === 'published' && !data.publishedAt) {
        updateData.publishedAt = serverTimestamp() as any;
      }

      delete (updateData as any).id;
      delete (updateData as any).createdAt;
      delete (updateData as any).author;

      await updateDoc(doc(db, this.collectionName, id), updateData);
    } catch (error: any) {
      console.error('Update content error:', error);
      throw new Error(error.message || 'Failed to update content');
    }
  }

  async deleteContent(id: string): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can delete content');
    }

    try {
      await deleteDoc(doc(db, this.collectionName, id));
    } catch (error: any) {
      console.error('Delete content error:', error);
      throw new Error(error.message || 'Failed to delete content');
    }
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

  async incrementLikes(id: string): Promise<void> {
    try {
      await updateDoc(doc(db, this.collectionName, id), {
        likes: increment(1),
      });
    } catch (error) {
      console.error('Increment likes error:', error);
    }
  }

  async incrementShares(id: string): Promise<void> {
    try {
      await updateDoc(doc(db, this.collectionName, id), {
        shares: increment(1),
      });
    } catch (error) {
      console.error('Increment shares error:', error);
    }
  }

  subscribeToContent(
    callback: (content: Content[]) => void,
    filters?: {
      type?: ContentType;
      status?: ContentStatus;
      featured?: boolean;
    }
  ): Unsubscribe {
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];

    if (filters?.type) {
      constraints.push(where('type', '==', filters.type));
    }

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
        const content: Content[] = [];
        querySnapshot.forEach((doc) => {
          content.push({ id: doc.id, ...doc.data() } as Content);
        });
        callback(content);
      },
      (error) => {
        console.error('Subscribe to content error:', error);
      }
    );
  }
}

export const contentService = new ContentService();
