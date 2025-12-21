import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    // /api/v1/auth/me
    (async ()=>{
      try{
        let result = await axios.get('/api/v1/auth/me');
        const { user } = result.data;
        if (user) {
          setUser(user);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        return;
      }

    })()
  }, []);


  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      
      // api/v1/auth/login
      let response = await axios.post('/api/v1/auth/login', { email, password });
      const { user } = response.data;
      setUser(user);
      setIsLoading(false);

    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // api/v1/auth/register
      let response = await axios.post('/api/v1/auth/register', { email, password });
      const { user } = response.data;
      setUser(user);

    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };



  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}