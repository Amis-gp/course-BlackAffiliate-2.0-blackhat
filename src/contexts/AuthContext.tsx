'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, AuthContextType, RegisterCredentials } from '@/types/auth';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, name, role, created_at')
            .eq('id', session.user.id)
            .single();
            
          if (profile) {
            const userObj: User = {
              id: profile.id,
              email: session.user.email!,
              password: '',
              name: profile.name,
              role: profile.role,
              created_at: profile.created_at,
              lastLogin: new Date(),
            };
            setUser(userObj);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    
    initAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, name, role, created_at')
          .eq('id', session.user.id)
          .single();
          
        if (profile) {
          const userObj: User = {
            id: profile.id,
            email: session.user.email!,
            password: '',
            name: profile.name,
            role: profile.role,
            created_at: profile.created_at,
            lastLogin: new Date(),
          };
          setUser(userObj);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, name, role, created_at')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          const userObj: User = {
            id: profile.id,
            email: data.user.email!,
            password: '',
            name: profile.name,
            role: profile.role,
            created_at: profile.created_at,
            lastLogin: new Date(),
          };
          setUser(userObj);
          return { success: true };
        } else {
          await supabase.auth.signOut();
          return { success: false, message: 'Could not find user profile.' };
        }
      }
      return { success: false, message: 'Login failed. Please try again.' };
    } catch (error) {
      return { success: false, message: 'Could not connect to the server.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
          }
        }
      });

      if (authError) {
        return { success: false, message: authError.message };
      }

      if (!authData.user) {
        return { success: false, message: 'Registration failed. Please try again.' };
      }

      const userObj: User = {
        id: authData.user.id,
        email: authData.user.email!,
        password: '',
        name: credentials.name || '',
        role: 'user',
        created_at: new Date().toISOString(),
        lastLogin: new Date(),
      };
      setUser(userObj);

      return { success: true };

    } catch (error) {
      return { success: false, message: 'An unexpected error occurred.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isInitializing,
    login,
    logout,
    isAdmin,
    register,
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