
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  getAllUsers: () => Promise<User[]>;
}

// Use environment variables with fallbacks for admin credentials
const ADMIN_EMAIL = 'admin@veggiemarket.com';
const ADMIN_PASSWORD = 'admin123456';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change event:', event);
        setSession(session);
        
        if (session?.user) {
          // Get user profile from profiles table
          // Use setTimeout to avoid recursive RLS policy evaluation
          setTimeout(async () => {
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (error && error.code !== 'PGRST116') {
                console.error('Error fetching user profile:', error);
              }
              
              // Set user state with combined auth and profile data
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: profile?.name || session.user.email?.split('@')[0] || 'User',
                isAdmin: session.user.email === ADMIN_EMAIL, // Admin check
              });
              
              setLoading(false);
            } catch (err) {
              console.error('Error in auth state change handler:', err);
              setLoading(false);
            }
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get user profile data
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching user profile:', error);
          }

          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.name || session.user.email?.split('@')[0] || 'User',
            isAdmin: session.user.email === ADMIN_EMAIL, // Admin check
          });
          
          setSession(session);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      console.log(`Attempting to log in with email: ${email}`);
      
      // Check if this is an admin login attempt
      const isAdminAttempt = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      
      // First try standard login for all users
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // If login succeeds, we're done
      if (!error) {
        console.log("Login successful:", data);
        return;
      }
      
      // If login fails and it's admin, we may need to create the admin account
      if (isAdminAttempt && error.message.includes('Invalid login credentials')) {
        console.log("Admin login failed, checking if admin exists");
        
        // Check for existing admin users using email instead of name
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          options: {
            data: { name: "Admin" }
          }
        });
        
        if (signUpError) {
          console.error("Error creating admin account:", signUpError);
          throw signUpError;
        }
        
        // Try logging in with admin credentials after creating the account
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
        });
        
        if (loginError) {
          throw loginError;
        }
        
        toast.success('Welcome, Admin!');
        return;
      }
      
      // Handle other error cases
      if (error.message.includes('Email not confirmed')) {
        // If email not confirmed, send another confirmation email
        await supabase.auth.resend({
          type: 'signup',
          email,
        });
        
        throw new Error('Please check your email to confirm your account. We\'ve sent a new confirmation link.');
      }
      
      // For any other errors, just throw the original error
      throw error;
      
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    
    try {
      // Check if user is trying to register with admin email
      if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        // First check if admin already exists
        const { data, error } = await supabase.auth.signInWithPassword({
          email: ADMIN_EMAIL,
          password,
        });
        
        if (data.user) {
          toast.error('Admin account already exists. Please login instead.');
          throw new Error('Admin account already exists');
        }
        
        // If admin doesn't exist, create and auto-login
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name: "Admin" },
          },
        });
        
        if (signUpError) {
          throw signUpError;
        }
        
        // For admin account, log them in immediately
        await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        toast.success('Admin account created and logged in successfully!');
        return;
      }
      
      // Regular user registration with email confirmation
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Registration successful! Please check your email to confirm your account.');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!user) return;
    
    try {
      // Update profile in the database
      const { error } = await supabase
        .from('profiles')
        .update({ name: userData.name })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setUser({ ...user, ...userData });
      
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Clear all cart data for the current user 
      if (user) {
        localStorage.removeItem(`cart_${user.id}`);
      }
      
      // Also clear guest cart data if any exists
      localStorage.removeItem('cart_guest');
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      toast.success('You have been logged out.');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getAllUsers = async (): Promise<User[]> => {
    try {
      // Get all users from the profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      
      return data.map(profile => ({
        id: profile.id,
        name: profile.name || 'Unknown',
        email: '', // We don't have access to emails through the profiles table
        isAdmin: false, // Default to false, admin status needs to be managed differently
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUserProfile,
        getAllUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
