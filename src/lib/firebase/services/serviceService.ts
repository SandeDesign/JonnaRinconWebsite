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
import { Service, PaginatedResponse } from '../types';
import { authService } from './authService';
import { cleanFirestoreData } from '../utils/cleanFirestoreData';

class ServiceService {
  private collectionName = 'services';

  async getPublishedServices(): Promise<Service[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const services: Service[] = [];
      querySnapshot.forEach((doc) => {
        services.push({ id: doc.id, ...doc.data() } as Service);
      });
      return services;
    } catch (error) {
      console.error('Get published services error:', error);
      return [];
    }
  }

  async createService(
    serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'lastUpdatedBy'>
  ): Promise<Service> {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can create services');
    }

    try {
      const newService = cleanFirestoreData({
        ...serviceData,
        inquiries: 0,
        createdBy: user.uid,
        lastUpdatedBy: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const docRef = await addDoc(collection(db, this.collectionName), newService);
      const createdService = await this.getServiceById(docRef.id);

      if (!createdService) {
        throw new Error('Failed to retrieve created service');
      }

      return createdService;
    } catch (error: any) {
      console.error('Create service error:', error);
      throw new Error(error.message || 'Failed to create service');
    }
  }

  async getServiceById(id: string): Promise<Service | null> {
    try {
      const serviceDoc = await getDoc(doc(db, this.collectionName, id));
      if (serviceDoc.exists()) {
        return { id: serviceDoc.id, ...serviceDoc.data() } as Service;
      }
      return null;
    } catch (error) {
      console.error('Get service by ID error:', error);
      return null;
    }
  }

  async getAllServices(options?: {
    pageSize?: number;
    lastDoc?: DocumentSnapshot;
    status?: Service['status'];
    featured?: boolean;
  }): Promise<PaginatedResponse<Service>> {
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

      const services: Service[] = [];
      querySnapshot.forEach((doc) => {
        if (services.length < pageSize) {
          services.push({ id: doc.id, ...doc.data() } as Service);
        }
      });

      const hasMore = querySnapshot.docs.length > pageSize;

      return {
        data: services,
        total: services.length,
        page: 0,
        pageSize,
        hasMore,
      };
    } catch (error) {
      console.error('Get all services error:', error);
      return {
        data: [],
        total: 0,
        page: 0,
        pageSize: options?.pageSize || 20,
        hasMore: false,
      };
    }
  }

  async updateService(id: string, updates: Partial<Service>): Promise<void> {
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
      console.error('Update service error:', error);
      throw new Error(error.message || 'Failed to update service');
    }
  }

  async deleteService(id: string): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    try {
      await deleteDoc(doc(db, this.collectionName, id));
    } catch (error: any) {
      console.error('Delete service error:', error);
      throw new Error(error.message || 'Failed to delete service');
    }
  }

  async getFeaturedServices(): Promise<Service[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('featured', '==', true),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        limit(6)
      );
      const querySnapshot = await getDocs(q);

      const services: Service[] = [];
      querySnapshot.forEach((doc) => {
        services.push({ id: doc.id, ...doc.data() } as Service);
      });

      return services;
    } catch (error) {
      console.error('Get featured services error:', error);
      return [];
    }
  }

  subscribeToServices(
    callback: (services: Service[]) => void,
    filters?: {
      status?: Service['status'];
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
        const services: Service[] = [];
        querySnapshot.forEach((doc) => {
          services.push({ id: doc.id, ...doc.data() } as Service);
        });
        callback(services);
      },
      (error) => {
        console.error('Subscribe to services error:', error);
      }
    );
  }

  async incrementInquiries(id: string): Promise<void> {
    try {
      await updateDoc(doc(db, this.collectionName, id), {
        inquiries: increment(1),
      });
    } catch (error) {
      console.error('Increment inquiries error:', error);
    }
  }
}

export const serviceService = new ServiceService();
