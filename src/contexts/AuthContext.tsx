'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, LoginCredentials, AuthContextType, RegisterCredentials, RegistrationRequest, AccessLevel } from '@/types/auth';
import { supabase } from '@/lib/supabase';
import type { AuthUser } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID || '';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>([]);
  const [loadingStage, setLoadingStage] = useState('Connecting...');
  const [retryCount, setRetryCount] = useState(0);

  const checkSupabaseHealth = async (): Promise<boolean> => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Missing Supabase credentials');
        return false;
      }

      if (typeof window === 'undefined') {
        return false;
      }

      const { error } = await Promise.race([
        supabase.auth.getSession(),
        new Promise<{ error: any }>((_, reject) => 
          setTimeout(() => reject(new Error('Health check timeout')), 5000)
        )
      ]) as { error: any };
      
      const isHealthy = !error;
      if (error && error.message !== 'Health check timeout') {
        console.log('Health check error details:', error);
      }
      return isHealthy;
    } catch (error: any) {
      if (error?.message === 'Health check timeout') {
        console.warn('AuthContext: Health check timeout');
      } else {
        console.error('💥 AuthContext: Health check failed:', error);
      }
      return false;
    }
  };

  const initializeAuthWithRetry = async (attempt: number = 1): Promise<void> => {
    try {
      if (typeof window === 'undefined') {
        setIsInitializing(false);
        return;
      }

      setLoadingStage(`Connecting... (attempt ${attempt}/3)`);
      setRetryCount(attempt);

      const isHealthy = await checkSupabaseHealth();
      if (!isHealthy && attempt < 3) {
        throw new Error('Supabase health check failed');
      }

      setLoadingStage('Checking authentication...');
      
      const sessionResult = await Promise.race([
        supabase.auth.getSession(),
        new Promise<{ data: { session: null }, error: { message: string } }>((_, reject) => 
          setTimeout(() => reject(new Error('Session check timeout')), 10000)
        )
      ]) as { data: { session: any }, error: any };
      
      const { data: { session }, error } = sessionResult;
      
      if (error && error.message !== 'Session check timeout') {
        console.error('❌ AuthContext: Session error:', error);
        if (attempt >= 3) {
          setUser(null);
          setIsInitializing(false);
          return;
        }
        throw error;
      }

      if (session?.user) {
        setLoadingStage('Loading profile...');
        
        try {
          const profileResult = await Promise.race([
            supabase
              .from('profiles')
              .select('id, name, role, created_at, is_approved, access_level')
              .eq('id', session.user.id)
              .single(),
            new Promise<{ data: null, error: { message: string } }>((_, reject) => 
              setTimeout(() => reject(new Error('Profile check timeout')), 10000)
            )
          ]) as { data: any, error: any };

          const { data: profile, error: profileError } = profileResult;

          if (profileError && profileError.message !== 'Profile check timeout') {
            console.error('❌ AuthContext: Profile error:', profileError);
            if (attempt >= 3) {
              setUser(null);
              setIsInitializing(false);
              return;
            }
            throw profileError;
          }

          if (profile && profile.is_approved) {
            const userObj: User = {
              id: profile.id,
              email: session.user.email!,
              password: '',
              name: profile.name,
              role: profile.role,
              access_level: profile.access_level,
              created_at: profile.created_at,
              lastLogin: new Date(),
              isApproved: true,
            };
            setUser(userObj);
          } else {
            setUser(null);
            try {
              await supabase.auth.signOut();
            } catch (signOutError) {
              console.error('Error signing out:', signOutError);
            }
          }
        } catch (profileError: any) {
          if (profileError?.message === 'Profile check timeout') {
            console.warn('AuthContext: Profile check timeout');
            setUser(null);
            setIsInitializing(false);
            return;
          }
          throw profileError;
        }
      } else {
        setUser(null);
      }

      setLoadingStage('Almost ready...');
      setIsInitializing(false);

    } catch (error: any) {
      console.error(`💥 AuthContext: Initialization attempt ${attempt} failed:`, error);
      
      if (attempt < 3 && error?.message !== 'Session check timeout' && error?.message !== 'Profile check timeout') {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        setLoadingStage(`Connection failed. Retrying in ${delay/1000}s...`);
        
        setTimeout(() => {
          initializeAuthWithRetry(attempt + 1);
        }, delay);
      } else {
        console.error('💀 AuthContext: All initialization attempts failed');
        setLoadingStage('Connection failed. Please refresh the page.');
        setUser(null);
        setIsInitializing(false);
      }
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsInitializing(false);
      return;
    }

    let initialCheckCompleted = false;
    let authSubscription: any = null;
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        await initializeAuthWithRetry();
        
        if (!initialCheckCompleted && isMounted) {
          const subscriptionResult = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!isMounted) return;

            try {
              if (!isMounted) return;
              
              if (session?.user) {
                const { data: profile, error: profileError } = await supabase
                  .from('profiles')
                  .select('id, name, role, created_at, is_approved, access_level')
                  .eq('id', session.user.id)
                  .single();

                if (!isMounted) return;

                if (profileError) {
                  console.error('AuthContext: Profile error in auth state change:', profileError);
                  if (isMounted) {
                    setUser(null);
                  }
                  if (event !== 'SIGNED_OUT') {
                    try {
                      await supabase.auth.signOut();
                    } catch (signOutError) {
                      console.error('Error signing out:', signOutError);
                    }
                  }
                  return;
                }

                if (!isMounted) return;

                if (profile && profile.is_approved) {
                  const userObj: User = {
                    id: profile.id,
                    email: session.user.email!,
                    password: '',
                    name: profile.name,
                    role: profile.role,
                    access_level: profile.access_level,
                    created_at: profile.created_at,
                    lastLogin: new Date(),
                    isApproved: true,
                  };
                  if (isMounted) {
                    setUser(userObj);
                  }
                } else {
                  if (isMounted) {
                    setUser(null);
                  }
                  if (event !== 'SIGNED_OUT') {
                    try {
                      await supabase.auth.signOut();
                    } catch (signOutError) {
                      console.error('Error signing out:', signOutError);
                    }
                  }
                }
              } else {
                if (isMounted) {
                  setUser(null);
                }
              }
            } catch (error) {
              console.error('AuthContext: Error in auth state change handler:', error);
              if (isMounted) {
                setUser(null);
              }
            }
          });
          
          if (subscriptionResult) {
            if (subscriptionResult.data?.subscription) {
              authSubscription = subscriptionResult.data.subscription;
            } else {
              authSubscription = subscriptionResult as any;
            }
          }
          
          initialCheckCompleted = true;
        }
      } catch (error) {
        console.error('AuthContext: Error initializing auth:', error);
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    initializeAuth();

    const timeoutId = setTimeout(() => {
      if (isInitializing && isMounted) {
        setLoadingStage('Timeout reached. Please refresh if needed.');
        setIsInitializing(false);
      }
    }, 20000);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      if (authSubscription) {
        try {
          const sub = authSubscription as any;
          if (sub && typeof sub === 'object') {
            if (typeof sub.unsubscribe === 'function') {
              sub.unsubscribe();
            } else if (sub.data) {
              if (sub.data.subscription && typeof sub.data.subscription.unsubscribe === 'function') {
                sub.data.subscription.unsubscribe();
              } else if (typeof sub.data.unsubscribe === 'function') {
                sub.data.unsubscribe();
              }
            } else if (sub.subscription && typeof sub.subscription.unsubscribe === 'function') {
              sub.subscription.unsubscribe();
            }
          }
        } catch (error) {
          console.error('Error unsubscribing from auth state change:', error);
        }
        authSubscription = null;
      }
    };
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message?: string; isPending?: boolean; requestId?: string }> => {
    setIsLoading(true);
    
    try {
      if (typeof window === 'undefined') {
        return { success: false, message: 'Login is only available on the client side.' };
      }

      const loginResult = await Promise.race([
        supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        }),
        new Promise<{ data: null, error: { message: string } }>((_, reject) => 
          setTimeout(() => reject(new Error('Login timeout')), 15000)
        )
      ]) as { data: any, error: any };

      const { data, error } = loginResult;

      if (error) {
        if (error.message === 'Invalid login credentials') {
          try {
            const { data: pendingRequests, error: pendingError } = await supabase
              .from('registration_requests')
              .select('id')
              .eq('email', credentials.email);

            if (!pendingError && pendingRequests && pendingRequests.length > 0) {
              return {
                success: false,
                message: 'Your registration is pending approval.',
                isPending: true,
                requestId: pendingRequests[0].id,
              };
            }
          } catch (pendingErr) {
            console.error('Error checking pending requests:', pendingErr);
          }
        }
        
        return {
          success: false,
          message: error.message || 'Login error. Please try again.',
        };
      }

      if (data?.user) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, name, role, created_at, is_approved, access_level')
            .eq('id', data.user.id)
            .single();
          
          if (profileError) {
            console.error('Profile fetch error:', profileError);
            try {
              await supabase.auth.signOut();
            } catch (signOutError) {
              console.error('Error signing out:', signOutError);
            }
            return {
              success: false,
              message: 'Could not load user profile. Please try again.',
            };
          }
          
          if (profile && profile.is_approved) {
            const userObj: User = {
              id: profile.id,
              email: data.user.email!,
              password: '',
              name: profile.name,
              role: profile.role,
              access_level: profile.access_level,
              created_at: profile.created_at,
              lastLogin: new Date(),
              isApproved: true,
            };
            setUser(userObj);
            return { success: true };
          } else {
            try {
              await supabase.auth.signOut();
            } catch (signOutError) {
              console.error('Error signing out:', signOutError);
            }
            return {
              success: false,
              message: 'Your account is not approved yet.',
            };
          }
        } catch (profileErr) {
          console.error('Error processing profile:', profileErr);
          try {
            await supabase.auth.signOut();
          } catch (signOutError) {
            console.error('Error signing out:', signOutError);
          }
          return {
            success: false,
            message: 'Could not load user profile. Please try again.',
          };
        }
      }
      
      return {
        success: false,
        message: 'Login failed. Please try again.',
      };
    } catch (error: any) {
      console.error('💥 AuthContext: Catch block - Login error:', error);
      if (error?.message === 'Login timeout') {
        return { success: false, message: 'Login request timed out. Please check your internet connection and try again.' };
      }
      return { success: false, message: 'Could not connect to the server. Check your internet connection.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = useCallback((): boolean => {
    return user?.role === 'admin';
  }, [user?.role]);

  const hasAccess = useCallback((requiredLevel: AccessLevel): boolean => {
    if (!user) return false;
    if (user.access_level === 5) return false;
    return user.access_level >= requiredLevel;
  }, [user]);

  const sendTelegramNotification = async (message: string) => {
    console.log('Attempting to send Telegram notification:', message);
    
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.warn('Telegram credentials not configured');
      console.log('BOT_TOKEN exists:', !!TELEGRAM_BOT_TOKEN);
      console.log('CHAT_ID exists:', !!TELEGRAM_CHAT_ID);
      return;
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      });
      
      if (response.ok) {
        console.log('Telegram notification sent successfully');
      } else {
        console.error('Telegram API error:', await response.text());
      }
    } catch (error) {
      console.error('Failed to send Telegram notification:', error);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data: existingRequests, error: existingRequestError } = await supabase
        .from('registration_requests')
        .select('id')
        .eq('email', credentials.email);

      if (existingRequestError) {
        console.error('Error checking for existing registration request:', existingRequestError);
        setIsLoading(false);
        return false;
      }
        
      if (existingRequests && existingRequests.length > 0) {
        setIsLoading(false);
        return false;
      }
      
      const { error } = await supabase
        .from('registration_requests')
        .insert([
          {
            email: credentials.email,
            password: credentials.password,
            name: credentials.name,
            created_at: new Date().toISOString(),
          }
        ]);
      
      if (error) {
        console.error('Registration error:', error);
        setIsLoading(false);
        return false;
      }
      
      const message = `🔔 New registration request\n\n📧 Email: ${credentials.email}\n🔑 Password: ${credentials.password}\n📅 Date: ${new Date().toLocaleDateString('en-US')}, ${new Date().toLocaleTimeString('en-US')}\n\n⏳ Awaiting administrator approval`;
      await sendTelegramNotification(message);
      
      setIsLoading(false);
      return true;
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const getRegistrationRequests = useCallback((): RegistrationRequest[] => {
    return registrationRequests;
  }, [registrationRequests]);

  const loadRegistrationRequests = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('registration_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ AuthContext: Error loading requests:', error);
        return;
      }
      
      if (data) {
        const formattedRequests = data.map((req: any) => ({
          id: req.id,
          email: req.email,
          password: req.password,
          name: req.name,
          createdAt: req.created_at,
          status: 'pending' as const
        }));
        setRegistrationRequests(formattedRequests);
      }
    } catch (error) {
      console.error('💥 AuthContext: Catch block - Error loading requests:', error);
    }
  }, []);

  const remindAdmin = async (requestId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { data: request, error: requestError } = await supabase
        .from('registration_requests')
        .select('email')
        .eq('id', requestId)
        .single();

      if (requestError || !request) {
        console.error('Error fetching request for reminder:', requestError);
        return { success: false, message: 'Request not found.' };
      }

      const message = `🔔 Reminder: Registration Approval Needed\n\n📧 Email: ${request.email}\n\nPlease review the pending registration.`;
      await sendTelegramNotification(message);
      return { success: true, message: 'A reminder has been sent to the administrator.' };
    } catch (error) {
      console.error('Error sending reminder:', error);
      return { success: false, message: 'Failed to send reminder.' };
    }
  };

  const rejectRegistration = async (requestId: string): Promise<boolean> => {
    try {
      const { data: request } = await supabase
        .from('registration_requests')
        .select('*')
        .eq('id', requestId)
        .single();
        
      if (!request) {
        return false;
      }
      
      const { error } = await supabase
        .from('registration_requests')
        .delete()
        .eq('id', requestId);
        
      if (error) {
        console.error('Error deleting request:', error);
        return false;
      }
      
      setRegistrationRequests(prev => prev.filter(r => r.id !== requestId));
      
      const message = `❌ <b>Registration rejected</b>\n\n📧 Email: ${request.email}`;
      await sendTelegramNotification(message);
      
      return true;
    } catch (error) {
      console.error('Error rejecting registration:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && user.access_level !== 5,
    isLoading,
    isInitializing,
    loadingStage,
    retryCount,
    login,
    logout,
    isAdmin,
    hasAccess,
    register,
    getRegistrationRequests,
    loadRegistrationRequests,
    rejectRegistration,
    remindAdmin,
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