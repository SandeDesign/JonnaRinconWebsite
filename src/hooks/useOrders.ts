import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../lib/firebase/types';
import { orderService } from '../lib/firebase/services';

export const useOrders = (filters?: {
  status?: OrderStatus;
  customerId?: string;
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = orderService.subscribeToOrders(
        (ordersData) => {
          setOrders(ordersData);
          setLoading(false);
        },
        filters
      );

      return () => unsubscribe();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }, [filters?.status, filters?.customerId]);

  return { orders, loading, error };
};

export const useOrder = (id: string) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = orderService.subscribeToOrder(id, (orderData) => {
        setOrder(orderData);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }, [id]);

  return { order, loading, error };
};

export const useOrderStatistics = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    averageOrderValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statistics = await orderService.getOrderStatistics();
        setStats(statistics);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error, refetch: async () => {
    setLoading(true);
    const statistics = await orderService.getOrderStatistics();
    setStats(statistics);
    setLoading(false);
  }};
};
