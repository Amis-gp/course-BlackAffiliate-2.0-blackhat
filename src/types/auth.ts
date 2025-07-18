export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
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

export interface AuthContextType extends AuthState {
  isInitializing: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string; isPending?: boolean; requestId?: string }>;
  logout: () => void;
  isAdmin: () => boolean;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  getRegistrationRequests: () => RegistrationRequest[];
  approveRegistration: (requestId: string) => Promise<boolean>;
  rejectRegistration: (requestId: string) => Promise<boolean>;
  remindAdmin: (requestId: string) => Promise<{ success: boolean; message: string }>;
}