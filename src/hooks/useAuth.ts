import { useState, useEffect } from 'react';
import { authService } from '../lib/firebase/services/authService';
import { User } from '../lib/firebase/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authService.onAuthStateChange((authUser) => {
      setUser(authUser);
      setIsAuthenticated(!!authUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, isLoading, isAuthenticated };
}
