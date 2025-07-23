// Server-side only database operations
let fs: any;
let path: any;

// Check if we're in Netlify Functions environment
const isNetlify = process.env.NETLIFY === 'true';

if (typeof window === 'undefined' && !isNetlify) {
  fs = require('fs');
  path = require('path');
}

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  isApproved: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

interface RegistrationRequest {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

// In-memory storage for Netlify Functions
let memoryUsers: User[] = [];
let memoryRequests: RegistrationRequest[] = [];
let isInitialized = false;

function ensureDataDir() {
  if (typeof window !== 'undefined' || isNetlify) return;
  
  const DATA_DIR = path.join(process.cwd(), 'data');
  const USERS_FILE = path.join(DATA_DIR, 'users.json');
  const REQUESTS_FILE = path.join(DATA_DIR, 'requests.json');
  
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
  }
  
  if (!fs.existsSync(REQUESTS_FILE)) {
    fs.writeFileSync(REQUESTS_FILE, JSON.stringify([]));
  }
}

function initializeMemoryData() {
  if (isInitialized) return;
  
  // Initialize with default data for Netlify
  memoryUsers = [
    {
      id: 'admin001',
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin',
      role: 'admin',
      isApproved: true,
      createdAt: new Date('2024-01-01')
    },
    {
      id: 'stepan001',
      email: 'stepan@example.com',
      password: 'stepan123',
      name: 'Stepan',
      role: 'user',
      isApproved: true,
      createdAt: new Date('2024-01-02')
    }
  ];
  
  memoryRequests = [];
  isInitialized = true;
}

function readUsers(): User[] {
  if (typeof window !== 'undefined') return [];
  
  if (isNetlify) {
    initializeMemoryData();
    return memoryUsers;
  }
  
  try {
    const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    const users = JSON.parse(data);
    return users;
  } catch (error) {
    console.error('❌ db.ts: Error reading users file:', error);
    return [];
  }
}

function writeUsers(users: User[]): void {
  if (typeof window !== 'undefined') return;
  
  if (isNetlify) {
    memoryUsers = users;
    return;
  }
  
  const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function readRequests(): RegistrationRequest[] {
  if (typeof window !== 'undefined') return [];
  
  if (isNetlify) {
    initializeMemoryData();
    return memoryRequests;
  }
  
  try {
    const REQUESTS_FILE = path.join(process.cwd(), 'data', 'requests.json');
    const data = fs.readFileSync(REQUESTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeRequests(requests: RegistrationRequest[]): void {
  if (typeof window !== 'undefined') return;
  
  if (isNetlify) {
    memoryRequests = requests;
    return;
  }
  
  const REQUESTS_FILE = path.join(process.cwd(), 'data', 'requests.json');
  fs.writeFileSync(REQUESTS_FILE, JSON.stringify(requests, null, 2));
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export async function initializeDatabase() {
  if (typeof window !== 'undefined') return;
  
  if (isNetlify) {
    initializeMemoryData();
    return;
  }
  
  ensureDataDir();
  
  const users = readUsers();
  if (users.length === 0) {
    // Create default admin user
    await db.user.create({
      data: {
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin',
        role: 'admin',
        isApproved: true
      }
    });
    
    // Create test user
    await db.user.create({
      data: {
        email: 'user@example.com',
        password: 'user123',
        name: 'Test User',
        role: 'user',
        isApproved: true
      }
    });
  }
}

export const db = {
  user: {
    findUnique: async (options: { where: { email: string } }) => {
      const users = readUsers();
      return users.find(user => user.email === options.where.email) || null;
    },

    findFirst: async (options: { where: Partial<User> }) => {
      const users = readUsers();
      const { where } = options;
      
      console.log('🔍 db.ts: findFirst called with where:', where);
      console.log('👥 db.ts: Available users:', users.length);
      
      const foundUser = users.find(user => {
        const matches = Object.entries(where).every(([key, value]) => {
          if (key === 'id' && value) {
            const match = user.id === value;
            console.log(`🔎 db.ts: Comparing user.id '${user.id}' with '${value}': ${match}`);
            return match;
          }
          return user[key as keyof User] === value;
        });
        return matches;
      });
      
      console.log('✅ db.ts: findFirst result:', foundUser ? 'User found' : 'User not found');
      return foundUser || null;
    },
    
    findMany: async (options?: { select?: any; orderBy?: any }) => {
      let users = readUsers();
      
      if (options?.orderBy?.createdAt === 'desc') {
        users = users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      
      if (options?.select) {
        return users.map(user => {
          const selected: any = {};
          Object.keys(options.select).forEach(key => {
            if (options.select[key] && user.hasOwnProperty(key)) {
              selected[key] = user[key as keyof User];
            }
          });
          return selected;
        });
      }
      
      return users;
    },
    
    create: async (options: { data: Omit<User, 'id' | 'createdAt'> }) => {
      const users = readUsers();
      const newUser: User = {
        id: generateId(),
        ...options.data,
        createdAt: new Date()
      };
      
      users.push(newUser);
      writeUsers(users);
      
      return newUser;
    },
    
    delete: async (options: { where: { id: string } }) => {
      const users = readUsers();
      const filteredUsers = users.filter(user => user.id !== options.where.id);
      writeUsers(filteredUsers);
      
      return { id: options.where.id };
    }
  },
  
  registrationRequest: {
    findFirst: async (options: { where: Partial<RegistrationRequest> }) => {
      const requests = readRequests();
      const { where } = options;
      
      return requests.find(request => {
        return Object.entries(where).every(([key, value]) => {
          if (key === 'id' && value) {
            return request.id === value;
          }
          return request[key as keyof RegistrationRequest] === value;
        });
      }) || null;
    },
    
    findUnique: async (options: { where: { id: string } }) => {
      const requests = readRequests();
      return requests.find(req => req.id === options.where.id) || null;
    },
    
    findMany: async () => {
      return readRequests();
    },
    
    create: async (options: { data: Omit<RegistrationRequest, 'id' | 'createdAt'> }) => {
      const requests = readRequests();
      const newRequest: RegistrationRequest = {
        id: generateId(),
        ...options.data,
        createdAt: new Date()
      };
      
      requests.push(newRequest);
      writeRequests(requests);
      
      return newRequest;
    },
    
    delete: async (options: { where: { id: string } }) => {
      const requests = readRequests();
      const filteredRequests = requests.filter(req => req.id !== options.where.id);
      writeRequests(filteredRequests);
      
      return { id: options.where.id };
    }
  }
};