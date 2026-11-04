import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!isMounted) return;
      setUser(currentUser);
      setLoading(false);
    });

    const fallbackTimer = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 3000);

    return () => {
      isMounted = false;
      unsubscribe();
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};