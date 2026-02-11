import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  QueryConstraint,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config';
import { Order, OrderStatus } from '../types';
import { authService } from './authService';

class OrderService {
  private collectionName = 'orders';

  private generateOrderNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 99999)
      .toString()
      .padStart(5, '0');
    return `JR-${year}-${random}`;
  }

  async createOrder(
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>
  ): Promise<Order> {
    try {
      const newOrder = {
        ...orderData,
        orderNumber: this.generateOrderNumber(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, this.collectionName), newOrder);
      const createdOrder = await this.getOrderById(docRef.id);

      if (!createdOrder) {
        throw new Error('Failed to retrieve created order');
      }

      return createdOrder;
    } catch (error: any) {
      console.error('Create order error:', error);
      throw new Error(error.message || 'Failed to create order');
    }
  }

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const orderDoc = await getDoc(doc(db, this.collectionName, id));
      if (orderDoc.exists()) {
        return { id: orderDoc.id, ...orderDoc.data() } as Order;
      }
      return null;
    } catch (error) {
      console.error('Get order by ID error:', error);
      return null;
    }
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('orderNumber', '==', orderNumber),
        limit(1)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Order;
      }
      return null;
    } catch (error) {
      console.error('Get order by number error:', error);
      return null;
    }
  }

  async getAllOrders(options?: {
    status?: OrderStatus;
    limit?: number;
    orderByField?: keyof Order;
    orderDirection?: 'asc' | 'desc';
  }): Promise<Order[]> {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can view all orders');
    }

    try {
      const constraints: QueryConstraint[] = [];

      if (options?.status) {
        constraints.push(where('status', '==', options.status));
      }

      const orderField = options?.orderByField || 'createdAt';
      const orderDirection = options?.orderDirection || 'desc';
      constraints.push(orderBy(orderField, orderDirection));

      if (options?.limit) {
        constraints.push(limit(options.limit));
      }

      const q = query(collection(db, this.collectionName), ...constraints);
      const querySnapshot = await getDocs(q);

      const orders: Order[] = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
      });

      return orders;
    } catch (error) {
      console.error('Get all orders error:', error);
      throw new Error('Failed to fetch orders');
    }
  }

  async getOrdersByCustomer(customerEmail: string): Promise<Order[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('customerEmail', '==', customerEmail),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const orders: Order[] = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
      });

      return orders;
    } catch (error) {
      console.error('Get orders by customer error:', error);
      throw new Error('Failed to fetch customer orders');
    }
  }

  async updateOrderStatus(id: string, status: OrderStatus, adminNote?: string): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can update order status');
    }

    try {
      const updateData: any = {
        status,
        updatedAt: serverTimestamp(),
      };

      if (status === 'completed') {
        updateData.completedAt = serverTimestamp();
      }

      if (adminNote) {
        updateData.adminNote = adminNote;
      }

      await updateDoc(doc(db, this.collectionName, id), updateData);
    } catch (error: any) {
      console.error('Update order status error:', error);
      throw new Error(error.message || 'Failed to update order status');
    }
  }

  async updateOrder(id: string, data: Partial<Order>): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can update orders');
    }

    try {
      const updateData = {
        ...data,
        updatedAt: serverTimestamp(),
      };

      delete (updateData as any).id;
      delete (updateData as any).createdAt;
      delete (updateData as any).orderNumber;

      await updateDoc(doc(db, this.collectionName, id), updateData);
    } catch (error: any) {
      console.error('Update order error:', error);
      throw new Error(error.message || 'Failed to update order');
    }
  }

  async addDownloadLinks(id: string, links: Record<string, string>): Promise<void> {
    try {
      await updateDoc(doc(db, this.collectionName, id), {
        downloadLinks: links,
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      console.error('Add download links error:', error);
      throw new Error(error.message || 'Failed to add download links');
    }
  }

  async addLicensePDFs(id: string, pdfs: Record<string, string>): Promise<void> {
    try {
      await updateDoc(doc(db, this.collectionName, id), {
        licensePDFs: pdfs,
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      console.error('Add license PDFs error:', error);
      throw new Error(error.message || 'Failed to add license PDFs');
    }
  }

  async getOrderStatistics(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
    averageOrderValue: number;
  }> {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can view statistics');
    }

    try {
      const querySnapshot = await getDocs(collection(db, this.collectionName));

      let totalOrders = 0;
      let totalRevenue = 0;
      let pendingOrders = 0;
      let completedOrders = 0;

      querySnapshot.forEach((doc) => {
        const order = doc.data() as Order;
        totalOrders++;
        if (order.status === 'completed') {
          totalRevenue += order.total;
          completedOrders++;
        }
        if (order.status === 'pending' || order.status === 'processing') {
          pendingOrders++;
        }
      });

      const averageOrderValue = totalOrders > 0 ? totalRevenue / completedOrders : 0;

      return {
        totalOrders,
        totalRevenue,
        pendingOrders,
        completedOrders,
        averageOrderValue,
      };
    } catch (error) {
      console.error('Get order statistics error:', error);
      throw new Error('Failed to fetch order statistics');
    }
  }

  async getRecentOrders(limitCount: number = 10): Promise<Order[]> {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can view recent orders');
    }

    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);

      const orders: Order[] = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
      });

      return orders;
    } catch (error) {
      console.error('Get recent orders error:', error);
      return [];
    }
  }

  subscribeToOrders(
    callback: (orders: Order[]) => void,
    filters?: {
      status?: OrderStatus;
      customerId?: string;
    }
  ): Unsubscribe {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can subscribe to orders');
    }

    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];

    if (filters?.status) {
      constraints.push(where('status', '==', filters.status));
    }

    if (filters?.customerId) {
      constraints.push(where('customerId', '==', filters.customerId));
    }

    const q = query(collection(db, this.collectionName), ...constraints);

    return onSnapshot(
      q,
      (querySnapshot) => {
        const orders: Order[] = [];
        querySnapshot.forEach((doc) => {
          orders.push({ id: doc.id, ...doc.data() } as Order);
        });
        callback(orders);
      },
      (error) => {
        console.error('Subscribe to orders error:', error);
      }
    );
  }

  subscribeToOrder(id: string, callback: (order: Order | null) => void): Unsubscribe {
    return onSnapshot(
      doc(db, this.collectionName, id),
      (doc) => {
        if (doc.exists()) {
          callback({ id: doc.id, ...doc.data() } as Order);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('Subscribe to order error:', error);
        callback(null);
      }
    );
  }
}

export const orderService = new OrderService();
