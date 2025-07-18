'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, AuthContextType, RegisterCredentials, RegistrationRequest } from '@/types/auth';
import { initializeDatabase, db } from '@/lib/db';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID || '';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>([]);

  useEffect(() => {
    const initAuth = async () => {
      console.log('🔄 AuthContext: Starting initialization after page reload');
      try {
        console.log('🗄️ AuthContext: Initializing database');
        await initializeDatabase();
        
        const savedUserId = localStorage.getItem('currentUserId');
        console.log('💾 AuthContext: Checking localStorage for savedUserId:', savedUserId);
        
        if (savedUserId) {
          console.log('🔍 AuthContext: Fetching user from API with ID:', savedUserId);
        try {
          const response = await fetch(`/api/users/${savedUserId}`);
          if (response.ok) {
            const user = await response.json();
            console.log('👤 AuthContext: API user found:', !!user);
            if (user && user.isApproved) {
              console.log('✅ AuthContext: User is approved, setting user state');
              setUser(user);
            } else {
              console.log('❌ AuthContext: User not found or not approved, removing from localStorage');
              localStorage.removeItem('userId');
              setUser(null);
            }
          } else {
            console.log('❌ AuthContext: User not found via API, removing from localStorage');
            localStorage.removeItem('userId');
            setUser(null);
          }
        } catch (error) {
          console.error('❌ AuthContext: Error fetching user:', error);
          localStorage.removeItem('userId');
          setUser(null);
        }
        } else {
          console.log('📭 AuthContext: No savedUserId found in localStorage');
        }
        
        console.log('📋 AuthContext: Loading registration requests');
        await loadRegistrationRequests();
        
      } catch (error) {
        console.error('💥 AuthContext: Initialization error:', error);
      } finally {
        console.log('🏁 AuthContext: Setting isLoading to false');
        setIsInitializing(false);
      }
    };
    
    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message?: string; isPending?: boolean; requestId?: string }> => {
    console.log('🔐 AuthContext: Starting login process', { email: credentials.email });
    setIsLoading(true);
    
    try {
      console.log('🌐 AuthContext: Sending fetch request to /api/auth/login');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      console.log('📡 AuthContext: Response received', { 
        status: response.status, 
        statusText: response.statusText,
        ok: response.ok 
      });

      if (!response.ok) {
        console.log('❌ AuthContext: Response not OK, parsing error response');
        let data;
        try {
          data = await response.json();
          console.log('📄 AuthContext: Error response data:', data);
        } catch (parseError) {
          console.error('💥 AuthContext: Error parsing error response:', parseError);
          return {
            success: false,
            message: 'Помилка сервера. Спробуйте ще раз.',
          };
        }
        
        const result = {
          success: false,
          message: data.message || 'Помилка входу. Спробуйте ще раз.',
          isPending: data.isPending,
          requestId: data.requestId,
        };
        console.log('🔄 AuthContext: Returning error result:', result);
        return result;
      }

      console.log('✅ AuthContext: Response OK, parsing success response');
      let data;
      try {
        data = await response.json();
        console.log('📄 AuthContext: Success response data:', data);
      } catch (parseError) {
        console.error('💥 AuthContext: Error parsing success response:', parseError);
        return {
          success: false,
          message: 'Помилка обробки відповіді сервера.',
        };
      }

      console.log('👤 AuthContext: Creating user object');
      const userObj: User = {
        id: data.user.id,
        email: data.user.email,
        password: data.user.password,
        name: data.user.name,
        role: data.user.role,
        createdAt: data.user.createdAt,
        lastLogin: new Date(),
        isApproved: true,
      };

      console.log('💾 AuthContext: Setting user and localStorage');
      setUser(userObj);
      localStorage.setItem('currentUserId', data.user.id);
      console.log('🎉 AuthContext: Login successful');
      return { success: true };
    } catch (error) {
      console.error('💥 AuthContext: Catch block - Login error:', error);
      return { success: false, message: 'Не вдалося з\'єднатися з сервером. Перевірте інтернет-з\'єднання.' };
    } finally {
      console.log('🏁 AuthContext: Setting isLoading to false');
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUserId');
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

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
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Відправляємо повідомлення в Telegram якщо створено новий запит
        if (data.request) {
          const message = `🔔 Новий запит на реєстрацію\n\n📧 Email: ${data.request.email}\n📅 Дата: ${new Date(data.request.createdAt).toLocaleDateString('uk-UA')}, ${new Date(data.request.createdAt).toLocaleTimeString('uk-UA')}\n\n⏳ Очікує підтвердження адміністратора`;
          await sendTelegramNotification(message);
        }
        
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Помилка реєстрації:', error);
      setIsLoading(false);
      return false;
    }
  };

  const getRegistrationRequests = (): RegistrationRequest[] => {
    return registrationRequests;
  };

  const loadRegistrationRequests = async () => {
    try {
      const response = await fetch('/api/admin/requests');
      const data = await response.json();
      
      if (data.success) {
        const formattedRequests = data.requests.map((req: any) => ({
          id: req.id,
          email: req.email,
          password: req.password,
          name: req.name,
          createdAt: req.createdAt,
          status: 'pending' as const
        }));
        setRegistrationRequests(formattedRequests);
      }
    } catch (error) {
      console.error('Помилка завантаження запитів:', error);
    }
  };

  const approveRegistration = async (requestId: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setRegistrationRequests(prev => prev.filter(r => r.id !== requestId));
        
        if (data.request) {
          const message = `✅ <b>Реєстрацію підтверджено</b>\n\n📧 Email: ${data.request.email}\n👤 Користувач тепер має доступ до курсу`;
          await sendTelegramNotification(message);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Помилка підтвердження реєстрації:', error);
      return false;
    }
  };

  const rejectRegistration = async (requestId: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setRegistrationRequests(prev => prev.filter(r => r.id !== requestId));
        
        if (data.request) {
          const message = `❌ <b>Реєстрацію відхилено</b>\n\n📧 Email: ${data.request.email}`;
          await sendTelegramNotification(message);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Помилка відхилення реєстрації:', error);
      return false;
    }
  };

  const remindAdmin = async (requestId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/auth/remind', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId }),
      });
      
      const data = await response.json();
      
      return {
        success: data.success,
        message: data.message || (data.success ? 'Нагадування відправлено' : 'Помилка відправки')
      };
    } catch (error) {
      console.error('Помилка нагадування:', error);
      return {
        success: false,
        message: 'Помилка відправки нагадування'
      };
    }
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
    getRegistrationRequests,
    approveRegistration,
    rejectRegistration,
    remindAdmin
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