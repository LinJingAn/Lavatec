import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

// Define a type for database user
interface DbUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'staff' | 'user';
  is_active: boolean;
  branch_id?: string;
  email_verified?: boolean;
  created_at: string;
  updated_at: string;
}

// Define a type for user (simplified from Supabase User)
interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

// Define a type for session
interface Session {
  token: string;
  user: User;
  expiresAt?: number;
}

// Define the shape of our auth context
interface AuthContextType {
  // Authentication state
  session: Session | null;
  user: User | null;
  dbUser: DbUser | null;
  
  // Loading and error states
  isLoading: boolean;
  authError: Error | null;
  
  // Auth functions
  signUp: (email: string, password: string, name: string, role?: string) => Promise<{
    error: Error | null;
    user: User | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    user: User | null;
  }>;
  signOut: () => Promise<void>;
  
  // Password reset (placeholder for future implementation)
  resetPassword: (email: string) => Promise<{
    error: Error | null;
  }>;
  updatePassword: (password: string) => Promise<{
    error: Error | null;
  }>;
  
  // User data
  updateUserData: (data: Partial<DbUser>) => Promise<{
    error: Error | null;
    user: DbUser | null;
  }>;
  refreshUserData: () => Promise<void>;
  
  // Email verification
  emailVerified: boolean;
  resendVerificationEmail: (email: string) => Promise<{
    error: Error | null;
  }>;
  
  // Dev mode function
  setDevUser: () => void;
  
  // Role-based checks
  isAdmin: boolean;
  isManager: boolean;
  isStaff: boolean;
  isCustomer: boolean;
  hasRole: (role: DbUser['role']) => boolean;
  
  // Company and branch access
  companyId: string | null;
  branchId: string | null;
};

// Create the auth context with default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps the app and makes auth available to children
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<Error | null>(null);
  
  const navigate = useNavigate();
  
  // Fetch user profile data from our backend API
  const fetchUserProfile = async (token: string) => {
    // Skip API call if it's a dev token
    if (token === 'dev-token') {
      console.log('🔧 Dev token detected - skipping API call');
      return;
    }
    
    try {
      // Token is automatically included by api interceptor
      const response = await api.get('/auth/profile');
      
      if (response.data?.user) {
        const userData = response.data.user;
        const dbUserData: DbUser = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role || 'user',
          is_active: userData.is_active !== false,
          branch_id: userData.branch_id,
          email_verified: userData.email_verified || false,
          created_at: userData.created_at,
          updated_at: userData.updated_at,
        };
        setDbUser(dbUserData);
        
        const userObj: User = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
        };
        setUser(userObj);
        
        // Update session
        const sessionObj: Session = {
          token,
          user: userObj,
        };
        setSession(sessionObj);
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      // If token is invalid, clear session (but not for dev token)
      if (error.response?.status === 401 && token !== 'dev-token') {
        localStorage.removeItem('token');
        setSession(null);
        setUser(null);
        setDbUser(null);
      } else if (token !== 'dev-token') {
        setAuthError(error as Error);
      }
    }
  };

  // Function to refresh user data
  const refreshUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    // Skip API call for dev token
    if (token === 'dev-token') {
      console.log('🔧 Dev token - skipping refresh');
      return;
    }
    
    await fetchUserProfile(token);
  };

  // Initialize the auth state
  useEffect(() => {
    setIsLoading(true);
    
    // Get the current session from localStorage
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Skip API call for dev token - user is already set by setDevUser
          if (token === 'dev-token') {
            console.log('🔧 Dev token found - skipping profile fetch');
            // Always set dev user state (in case component remounted or state was cleared)
            const devUser: User = {
              id: 'dev-user-123',
              email: 'dev@lavatec.com',
              name: 'Dev User',
              role: 'admin',
            };
            const devDbUser: DbUser = {
              id: 'dev-user-123',
              email: 'dev@lavatec.com',
              name: 'Dev User',
              role: 'admin',
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            setUser(devUser);
            setDbUser(devDbUser);
            setSession({
              token,
              user: devUser,
            });
            setIsLoading(false);
            return;
          }
          
          // Verify token and fetch user profile
          await fetchUserProfile(token);
          
          // Create session object
          const sessionObj: Session = {
            token,
            user: user || { id: '', email: '' },
          };
          setSession(sessionObj);
        } else {
          setSession(null);
          setUser(null);
          setDbUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        const token = localStorage.getItem('token');
        // Only clear token and state if it's not a dev token
        if (token !== 'dev-token') {
          setAuthError(error as Error);
          localStorage.removeItem('token');
          setSession(null);
          setUser(null);
          setDbUser(null);
        } else {
          // For dev token, just log the error but don't clear state
          console.warn('🔧 Dev mode: Error during auth init, but keeping dev user');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
  }, []);
  
  // Sign up a new user
  const signUp = async (email: string, password: string, name: string, role: string = 'user') => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        name,
        role,
      });
      
      if (response.data?.token && response.data?.user) {
        // Store token
        localStorage.setItem('token', response.data.token);
        
        // Set user and session
        const userObj: User = {
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role,
        };
        setUser(userObj);
        
        const sessionObj: Session = {
          token: response.data.token,
          user: userObj,
        };
        setSession(sessionObj);
        
        // Fetch full user profile
        await fetchUserProfile(response.data.token);
        
        return { user: userObj, error: null };
      }
      
      return { user: null, error: new Error('Failed to create user') };
    } catch (error: any) {
      console.error('Sign up error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to register';
      setAuthError(new Error(errorMessage));
      return { user: null, error: new Error(errorMessage) };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign in an existing user
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      console.log('Signing in user with email:', email);
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      
      if (response.data?.token && response.data?.user) {
        // Store token
        localStorage.setItem('token', response.data.token);
        
        // Set user and session
        const userObj: User = {
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role,
        };
        setUser(userObj);
        
        const sessionObj: Session = {
          token: response.data.token,
          user: userObj,
        };
        setSession(sessionObj);
        
        // Fetch full user profile
        await fetchUserProfile(response.data.token);
        
        return { user: userObj, error: null };
      }
      
      return { user: null, error: new Error('Invalid response from server') };
    } catch (error: any) {
      console.error('Sign in error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Invalid credentials';
      setAuthError(new Error(errorMessage));
      return { user: null, error: new Error(errorMessage) };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign out the current user
  const signOut = async () => {
    try {
      // Clear token from localStorage
      localStorage.removeItem('token');
      
      // Clear state
      setSession(null);
      setUser(null);
      setDbUser(null);
      setAuthError(null);
      
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
      setAuthError(error as Error);
    }
  };
  
  // Dev mode function to set a mock user
  const setDevUser = () => {
    console.log('🔧 Setting dev mode user...');
    
    // Create a mock user for development
    const mockUser: User = {
      id: 'dev-user-123',
      email: 'dev@lavatec.com',
      name: 'Dev User',
      role: 'admin',
    };

    // Create a mock session
    const mockSession: Session = {
      token: 'dev-token',
      user: mockUser,
      expiresAt: Date.now() + 3600000,
    };

    // Create a mock database user
    const mockDbUser: DbUser = {
      id: 'dev-user-123',
      email: 'dev@lavatec.com',
      name: 'Dev User',
      role: 'admin',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Set the mock state
    setUser(mockUser);
    setSession(mockSession);
    setDbUser(mockDbUser);
    setIsLoading(false);
    setAuthError(null);
    
    // Store dev token
    localStorage.setItem('token', 'dev-token');

    console.log('🎉 Dev mode user set successfully!');
  };
  
  // Send a password reset email (placeholder - to be implemented in backend)
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      // TODO: Implement password reset endpoint in backend
      console.warn('Password reset not yet implemented in backend');
      return { error: new Error('Password reset not yet implemented') };
    } catch (error) {
      console.error('Password reset error:', error);
      setAuthError(error as Error);
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update user's password (placeholder - to be implemented in backend)
  const updatePassword = async (password: string) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      // TODO: Implement password update endpoint in backend
      console.warn('Password update not yet implemented in backend');
      return { error: new Error('Password update not yet implemented') };
    } catch (error) {
      console.error('Update password error:', error);
      setAuthError(error as Error);
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Resend verification email
  const resendVerificationEmail = async (email: string) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const response = await api.post('/auth/resend-verification', {
        email,
      });
      
      return { error: null };
    } catch (error: any) {
      console.error('Resend verification error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to resend verification email';
      setAuthError(new Error(errorMessage));
      return { error: new Error(errorMessage) };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update user profile data
  const updateUserData = async (data: Partial<DbUser>) => {
    setIsLoading(true);
    setAuthError(null);
    
    if (!user?.id) {
      setIsLoading(false);
      return { 
        error: new Error('User not authenticated'), 
        user: null 
      };
    }
    
    try {
      // Update user profile via backend API
      const response = await api.put(`/users/${user.id}`, data);
      
      if (response.data?.user) {
        const updatedUser = response.data.user;
        const dbUserData: DbUser = {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role || 'user',
          is_active: updatedUser.is_active !== false,
          branch_id: updatedUser.branch_id,
          email_verified: updatedUser.email_verified || false,
          created_at: updatedUser.created_at,
          updated_at: updatedUser.updated_at,
        };
        
        setDbUser(dbUserData);
        
        // Update user object
        const userObj: User = {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
        };
        setUser(userObj);
        
        return { error: null, user: dbUserData };
      }
      
      return { error: new Error('Failed to update user'), user: null };
    } catch (error: any) {
      console.error('Update user data error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update user';
      setAuthError(new Error(errorMessage));
      return { error: new Error(errorMessage), user: null };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Role checks
  const isAdmin = dbUser?.role === 'admin';
  const isManager = dbUser?.role === 'admin' || dbUser?.role === 'manager';
  const isStaff = dbUser?.role === 'admin' || dbUser?.role === 'manager' || dbUser?.role === 'staff';
  const isCustomer = dbUser?.role === 'user';
  
  const hasRole = (role: DbUser['role']) => {
    if (!dbUser) return false;
    
    switch (role) {
      case 'admin':
        return dbUser.role === 'admin';
      case 'manager':
        return dbUser.role === 'admin' || dbUser.role === 'manager';
      case 'staff':
        return dbUser.role === 'admin' || dbUser.role === 'manager' || dbUser.role === 'staff';
      case 'user':
        return true; // Everyone can access user-level content
      default:
        return false;
    }
  };
  
  // Company and branch access
  const companyId = null; // Not used in current backend schema
  const branchId = dbUser?.branch_id || null;
  
  // Email verification status
  const emailVerified = dbUser?.email_verified || false;
  
  // Provide the auth context value
  const value = {
    session,
    user,
    dbUser,
    isLoading,
    authError,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateUserData,
    refreshUserData,
    emailVerified,
    resendVerificationEmail,
    isAdmin,
    isManager,
    isStaff,
    isCustomer,
    hasRole,
    companyId,
    branchId,
    setDevUser,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Hook to require authentication for a component
export function useRequireAuth(requiredRole?: DbUser['role']) {
  const auth = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!auth.isLoading) {
      if (!auth.user) {
        navigate('/login');
      } else if (requiredRole && auth.dbUser && !auth.hasRole(requiredRole)) {
        navigate('/unauthorized');
      }
    }
  }, [auth, requiredRole, navigate]);
  
  return auth;
} 