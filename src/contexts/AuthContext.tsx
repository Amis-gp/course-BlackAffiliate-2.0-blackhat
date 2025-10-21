'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, LoginCredentials, AuthContextType, RegisterCredentials, RegistrationRequest, AccessLevel } from '@/types/auth';
import { supabase } from '@/lib/supabase';
import type { AuthUser } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID || '';

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log('🏗️ AuthProvider: Component is rendering');
  console.log('🌍 AuthProvider: Running on:', typeof window !== 'undefined' ? 'CLIENT' : 'SERVER');
  
  if (typeof window !== 'undefined') {
    console.log('✅ AuthProvider: Client-side rendering detected');
  } else {
    console.log('🔴 AuthProvider: Server-side rendering detected');
  }
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>([]);
  const [loadingStage, setLoadingStage] = useState('Connecting...');
  const [retryCount, setRetryCount] = useState(0);
  
  useEffect(() => {
    console.log('🧪 TEST: Simple useEffect is working!');
  }, []);

  const checkSupabaseHealth = async (): Promise<boolean> => {
    try {
      console.log('🏥 AuthContext: Checking Supabase health...');
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('❌ AuthContext: Missing Supabase credentials');
        return false;
      }

      // Use auth.getSession() instead of table queries to avoid CORS issues
      // This is the most reliable way to check Supabase connectivity
      const { error } = await supabase.auth.getSession();
      
      const isHealthy = !error;
      console.log(`${isHealthy ? '✅' : '❌'} AuthContext: Supabase health check ${isHealthy ? 'passed' : 'failed'}`);
      if (error) {
        console.log('Health check error details:', error);
      }
      return isHealthy;
    } catch (error) {
      console.error('💥 AuthContext: Health check failed:', error);
      return false;
    }
  };

  const initializeAuthWithRetry = async (attempt: number = 1): Promise<void> => {
    try {
      console.log(`🚀 AuthContext: Initialization attempt ${attempt}/3`);
      setLoadingStage(`Connecting... (attempt ${attempt}/3)`);
      setRetryCount(attempt);

      const isHealthy = await checkSupabaseHealth();
      if (!isHealthy && attempt < 3) {
        throw new Error('Supabase health check failed');
      }

      setLoadingStage('Checking authentication...');
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ AuthContext: Session error:', error);
        throw error;
      }

      if (session?.user) {
        setLoadingStage('Loading profile...');
        console.log('👤 AuthContext: Session found, loading profile...');
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, name, role, created_at, is_approved, access_level')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('❌ AuthContext: Profile error:', profileError);
          throw profileError;
        }

        if (profile && profile.is_approved) {
          console.log('✅ AuthContext: User is approved, setting user state');
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
          console.log('❌ AuthContext: User not approved or no profile. Signing out.');
          setUser(null);
          await supabase.auth.signOut();
        }
      } else {
        console.log('📭 AuthContext: No session found');
        setUser(null);
      }

      setLoadingStage('Almost ready...');
      console.log('🏁 AuthContext: Initialization complete');
      setIsInitializing(false);

    } catch (error) {
      console.error(`💥 AuthContext: Initialization attempt ${attempt} failed:`, error);
      
      if (attempt < 3) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`⏳ AuthContext: Retrying in ${delay}ms...`);
        setLoadingStage(`Connection failed. Retrying in ${delay/1000}s...`);
        
        setTimeout(() => {
          initializeAuthWithRetry(attempt + 1);
        }, delay);
      } else {
        console.error('💀 AuthContext: All initialization attempts failed');
        setLoadingStage('Connection failed. Please refresh the page.');
        setIsInitializing(false);
      }
    }
  };

  useEffect(() => {
    console.log('🚀 AuthContext: useEffect started');
    let initialCheckCompleted = false;
    let authSubscription: any = null;

    const initializeAuth = async () => {
      await initializeAuthWithRetry();
      
      if (!initialCheckCompleted) {
        authSubscription = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('🔄 AuthContext: Auth state changed:', event);

          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('id, name, role, created_at, is_approved, access_level')
              .eq('id', session.user.id)
              .single();

            if (profile && profile.is_approved) {
              console.log('✅ AuthContext: User is approved, setting user state');
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
              console.log('❌ AuthContext: User not approved or no profile. Signing out.');
              setUser(null);
              if (event !== 'SIGNED_OUT') {
                await supabase.auth.signOut();
              }
            }
          } else {
            console.log('📭 AuthContext: No session. User is signed out.');
            setUser(null);
          }
        });
        
        initialCheckCompleted = true;
      }
    };

    initializeAuth();

    const timeoutId = setTimeout(() => {
      if (isInitializing) {
        console.log('⏰ AuthContext: Initialization timeout (15s), forcing completion');
        setLoadingStage('Timeout reached. Please refresh if needed.');
        setIsInitializing(false);
      }
    }, 15000);

    return () => {
      clearTimeout(timeoutId);
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message?: string; isPending?: boolean; requestId?: string }> => {
    console.log('🔐 AuthContext: Starting login process with Supabase', { email: credentials.email });
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        console.log('❌ AuthContext: Supabase auth error:', error.message);
        
        if (error.message === 'Invalid login credentials') {
          const { data: pendingRequests } = await supabase
            .from('registration_requests')
            .select('id')
            .eq('email', credentials.email);

          if (pendingRequests && pendingRequests.length > 0) {
            return {
              success: false,
              message: 'Your registration is pending approval.',
              isPending: true,
              requestId: pendingRequests[0].id,
            };
          }
        }
        
        return {
          success: false,
          message: error.message || 'Login error. Please try again.',
        };
      }

      if (data.user) {
        console.log('👤 AuthContext: Supabase login successful');
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, name, role, created_at, is_approved, access_level')
          .eq('id', data.user.id)
          .single();
          
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
          console.log('🎉 AuthContext: Login successful');
          return { success: true };
        } else {
          await supabase.auth.signOut();
          return {
            success: false,
            message: 'Your account is not approved yet.',
          };
        }
      }
      
      return {
        success: false,
        message: 'Login failed. Please try again.',
      };
    } catch (error) {
      console.error('💥 AuthContext: Catch block - Login error:', error);
      return { success: false, message: 'Could not connect to the server. Check your internet connection.' };
    } finally {
      console.log('🏁 AuthContext: Setting isLoading to false');
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const isAdmin = useCallback((): boolean => {
    return user?.role === 'admin';
  }, [user?.role]);

  const hasAccess = useCallback((requiredLevel: AccessLevel): boolean => {
    if (!user) return false;
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

  const getRegistrationRequests = (): RegistrationRequest[] => {
    return registrationRequests;
  };

  const loadRegistrationRequests = async () => {
    console.log('📋 AuthContext: Starting loadRegistrationRequests');
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
        console.log('✅ AuthContext: Successfully loaded registration requests:', data.length);
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
    console.log('🏁 AuthContext: Finished loadRegistrationRequests');
  };

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
    isAuthenticated: !!user,
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