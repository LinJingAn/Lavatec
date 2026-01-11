import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

// Define a type for database user
interface DbUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'manager' | 'staff' | 'customer';
  is_active: boolean;
  company_id?: string;
  branch_id?: string;
  phone_number?: string;
  created_at: string;
  updated_at: string;
}

// Define the shape of our auth context
interface AuthContextType {
  // Authentication state
  session: Session | null;
  user: User | null;
  dbUser: DbUser | null;
  
  // Loading and error states
  isLoading: boolean;
  authError: AuthError | Error | null;
  
  // Auth functions
  signUp: (email: string, password: string, userData: Partial<DbUser>) => Promise<{
    error: AuthError | Error | null;
    user: User | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: AuthError | Error | null;
    user: User | null;
  }>;
  signOut: () => Promise<void>;
  
  // Password reset
  resetPassword: (email: string) => Promise<{
    error: AuthError | Error | null;
  }>;
  updatePassword: (password: string) => Promise<{
    error: AuthError | Error | null;
  }>;
  
  // User data
  updateUserData: (data: Partial<DbUser>) => Promise<{
    error: AuthError | Error | null;
    user: DbUser | null;
  }>;
  refreshUserData: () => Promise<void>;
  
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
  const [authError, setAuthError] = useState<AuthError | Error | null>(null);
  
  const navigate = useNavigate();
  
  // Fetch user profile data from our database
  const fetchUserProfile = async (userId: string, forceFresh = false) => {
    console.log('Fetching user profile for userId:', userId, 'forceFresh:', forceFresh);
    
    try {
      // Use cache control to force a fresh request if needed
      const headers: { [key: string]: string } = {};
      if (forceFresh) {
        headers['cache-control'] = 'no-cache';
      }
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        // Handle missing table by creating a mock user profile
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          console.warn('Users table does not exist yet. Using mock user profile.');
          // Create a mock user with admin role to allow access
          const mockUser: DbUser = {
            id: userId,
            email: user?.email || '',
            first_name: 'Admin',
            last_name: 'User',
            role: 'admin',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setDbUser(mockUser);
          return;
        }
        throw error;
      }
      
      if (data) {
        console.log('User profile fetched successfully:', data);
        setDbUser(data as DbUser);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setAuthError(error as Error);
    }
  };

  // Function to refresh user data - can be called after making changes in other components
  const refreshUserData = async () => {
    if (!user?.id) return;
    
    console.log('Manually refreshing user data for userId:', user.id);
    
    // Set headers to force a fresh request from the server
    const headers = { 'cache-control': 'no-cache' };
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single({ headers });
        
      if (error) {
        console.error('Error refreshing user data:', error);
        return;
      }
      
      if (data) {
        console.log('User profile refreshed successfully');
        // Update the user data in the context
        setDbUser(data as DbUser);
      }
    } catch (error) {
      console.error('Error during refresh:', error);
    }
  };

  // Initialize the auth state
  useEffect(() => {
    setIsLoading(true);
    
    // Get the current session
    const initializeAuth = async () => {
      try {
        // Check active session
        const { data: { session } } = await supabase.auth.getSession();
        
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
        
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            setSession(session);
            setUser(session?.user || null);
            
            if (session?.user) {
              await fetchUserProfile(session.user.id);
            } else {
              setDbUser(null);
            }
          }
        );
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
  }, []);
  
  // Sign up a new user
  const signUp = async (email: string, password: string, userData: Partial<DbUser>) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        try {
          // Try to create user profile in our database
          const { error: profileError } = await supabase.from('users').insert({
            id: data.user.id,
            email,
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            role: userData.role || 'customer',
            company_id: userData.company_id,
            branch_id: userData.branch_id,
            phone_number: userData.phone_number,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
          
          // If table doesn't exist, just log a warning but continue with signup
          if (profileError && (profileError.code === '42P01' || profileError.message?.includes('does not exist'))) {
            console.warn('Users table does not exist yet. User profile not created in database.');
          } else if (profileError) {
            throw profileError;
          }
        } catch (profileErr) {
          console.warn('Error creating user profile, but auth user was created:', profileErr);
          // Continue with the signup process even if profile creation fails
        }
        
        return { user: data.user, error: null };
      }
      
      return { user: null, error: new Error('Failed to create user') };
    } catch (error) {
      console.error('Sign up error:', error);
      setAuthError(error as AuthError);
      return { user: null, error: error as AuthError };
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Explicitly fetch user profile after successful login
      if (data.user) {
        console.log('Sign-in successful, fetching user profile:', data.user.id);
        
        // Wait a moment for Supabase to process the login
        setTimeout(async () => {
          await fetchUserProfile(data.user.id, true);
        }, 500);
      }
      
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthError(error as AuthError);
      return { user: null, error: error as AuthError };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign out the current user
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
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
      aud: 'authenticated',
      role: 'authenticated',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
      identities: [],
      factors: []
    };

    // Create a mock session
    const mockSession: Session = {
      access_token: 'dev-token',
      refresh_token: 'dev-refresh',
      expires_in: 3600,
      expires_at: Date.now() + 3600000,
      token_type: 'bearer',
      user: mockUser
    };

    // Create a mock database user
    const mockDbUser: DbUser = {
      id: 'dev-user-123',
      email: 'dev@lavatec.com',
      first_name: 'Dev',
      last_name: 'User',
      role: 'admin',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Set the mock state
    setUser(mockUser);
    setSession(mockSession);
    setDbUser(mockDbUser);
    setIsLoading(false);
    setAuthError(null);

    console.log('🎉 Dev mode user set successfully!');
  };
  
  // Send a password reset email
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error('Password reset error:', error);
      setAuthError(error as AuthError);
      return { error: error as AuthError };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update user's password
  const updatePassword = async (password: string) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error('Update password error:', error);
      setAuthError(error as AuthError);
      return { error: error as AuthError };
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
      // First try updating auth data if email is included
      if (data.email && data.email !== user.email) {
        const { error: authUpdateError } = await supabase.auth.updateUser({
          email: data.email,
        });
        
        if (authUpdateError) throw authUpdateError;
      }
      
      // Now update user profile in our database
      const updateData = {
        ...data,
        updated_at: new Date().toISOString(),
      };

      // Optimistically update the local state first for better UX
      if (dbUser) {
        setDbUser({
          ...dbUser,
          ...updateData
        });
      }
      
      // Then perform the actual database update
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state with updated user data from the server
      if (updatedUser) {
        setDbUser(updatedUser as DbUser);
      }
      
      return { error: null, user: updatedUser as DbUser };
    } catch (error) {
      console.error('Update user data error:', error);
      setAuthError(error as Error);
      return { error: error as Error, user: null };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Role checks
  const isAdmin = dbUser?.role === 'admin';
  const isManager = dbUser?.role === 'admin' || dbUser?.role === 'manager';
  const isStaff = dbUser?.role === 'admin' || dbUser?.role === 'manager' || dbUser?.role === 'staff';
  const isCustomer = dbUser?.role === 'customer';
  
  const hasRole = (role: DbUser['role']) => {
    if (!dbUser) return false;
    
    switch (role) {
      case 'admin':
        return dbUser.role === 'admin';
      case 'manager':
        return dbUser.role === 'admin' || dbUser.role === 'manager';
      case 'staff':
        return dbUser.role === 'admin' || dbUser.role === 'manager' || dbUser.role === 'staff';
      case 'customer':
        return true; // Everyone can access customer-level content
      default:
        return false;
    }
  };
  
  // Company and branch access
  const companyId = dbUser?.company_id || null;
  const branchId = dbUser?.branch_id || null;
  
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