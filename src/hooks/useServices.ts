import { useState, useEffect } from 'react';
import { Service } from '../lib/firebase/types';
import { serviceService } from '../lib/firebase/services';

export const useServices = (filters?: {
  status?: Service['status'];
  featured?: boolean;
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = serviceService.subscribeToServices(
      (servicesData) => {
        setServices(servicesData);
        setLoading(false);
      },
      filters
    );

    return () => unsubscribe();
  }, [filters?.status, filters?.featured]);

  return { services, loading, error, setError };
};

export const useService = (id: string) => {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchService = async () => {
      try {
        const serviceData = await serviceService.getServiceById(id);
        setService(serviceData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  return { service, loading, error, setError };
};

export const useFeaturedServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const featuredServices = await serviceService.getFeaturedServices();
        setServices(featuredServices);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { services, loading, error };
};
