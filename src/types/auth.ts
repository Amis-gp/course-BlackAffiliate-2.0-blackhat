export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  access_level: 1 | 2 | 3;
  created_at: string;
  lastLogin?: Date;
  isApproved: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}

export interface RegistrationRequest {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type AccessLevel = 1 | 2 | 3;

export interface AccessLevelInfo {
  level: AccessLevel;
  name: string;
  description: string;
  features: string[];
}

export const ACCESS_LEVELS: Record<AccessLevel, AccessLevelInfo> = {
  1: {
    level: 1,
    name: 'Пакет 1',
    description: 'Базовий доступ до курсу',
    features: ['Основні уроки курсу', 'Базові інструменти', 'Обмежений доступ до спільноти']
  },
  2: {
    level: 2,
    name: 'Пакет 2',
    description: 'Преміум доступ з сервісами',
    features: ['Всі уроки курсу', 'Розширені інструменти', 'Доступ до сервісів', 'Пріоритетна підтримка']
  },
  3: {
    level: 3,
    name: 'Пакет 3',
    description: 'VIP доступ з Road map',
    features: ['Все з попередніх пакетів', 'Road map (ексклюзивно)', 'Персональний ментор', 'Ексклюзивні матеріали']
  }
};

export interface AuthContextType extends AuthState {
  isInitializing: boolean;
  loadingStage: string;
  retryCount: number;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string; isPending?: boolean; requestId?: string }>;
  logout: () => void;
  isAdmin: () => boolean;
  hasAccess: (requiredLevel: AccessLevel) => boolean;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  getRegistrationRequests: () => RegistrationRequest[];
  loadRegistrationRequests: () => Promise<void>;
  rejectRegistration: (requestId: string) => Promise<boolean>;
  remindAdmin: (requestId: string) => Promise<{ success: boolean; message: string }>;
}