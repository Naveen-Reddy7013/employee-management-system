import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase, DEMO_USERS, type DemoUser } from '@/lib/supabase';
import type { UserRole, Profile } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  user: Profile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (full_name: string, email: string, password: string, role?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Pick<Profile, 'full_name' | 'phone' | 'address'>>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const convertSupabaseProfile = useCallback((p: Profile): Profile => p, []);

  const loadUser = useCallback(async () => {
    try {
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase!.from('profiles').select('*').eq('id', session.user.id).single();
          if (profile) setUser(convertSupabaseProfile(profile as Profile));
        }
      } else {
        // Demo mode: check localStorage
        const storedUser = localStorage.getItem('ems_demo_user');
        if (storedUser) {
          const demoUser = JSON.parse(storedUser) as DemoUser;
          setUser({
            id: demoUser.profile.id,
            full_name: demoUser.profile.full_name,
            role: demoUser.profile.role,
            phone: '',
            address: '',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      }
    } catch {
      // Silent error
    } finally {
      setIsLoading(false);
    }
  }, [convertSupabaseProfile]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (supabase) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          toast.error(error.message);
          return false;
        }
        toast.success('Welcome back!');
        return true;
      }

      // Demo mode
      const demoUser = DEMO_USERS.find((u) => u.email === email && u.password === password);
      if (!demoUser) {
        toast.error('Invalid email or password');
        return false;
      }

      localStorage.setItem('ems_demo_user', JSON.stringify(demoUser));
      setUser({
        id: demoUser.profile.id,
        full_name: demoUser.profile.full_name,
        role: demoUser.profile.role,
        phone: '',
        address: '',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      toast.success(`Welcome back, ${demoUser.profile.full_name}!`);
      return true;
    } catch (error) {
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (full_name: string, email: string, _password: string, role: UserRole = 'employee'): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (supabase) {
        const { error } = await supabase.auth.signUp({ email, password: _password, options: { data: { full_name, role } } });
        if (error) {
          toast.error(error.message);
          return false;
        }
        toast.success('Account created! Please log in.');
        return true;
      }

      // Demo mode - just show success
      toast.success('Account created! Please log in.');
      return true;
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
      localStorage.removeItem('ems_demo_user');
      setUser(null);
      toast.success('Logged out successfully');
    } catch {
      toast.error('Logout failed');
    }
  };

  const updateProfile = async (data: Partial<Pick<Profile, 'full_name' | 'phone' | 'address'>>): Promise<void> => {
    try {
      if (supabase && user) {
        const { error } = await supabase.from('profiles').update(data).eq('id', user.id);
        if (error) throw error;
        setUser((prev) => prev ? { ...prev, ...data } : prev);
        toast.success('Profile updated successfully');
      } else {
        setUser((prev) => prev ? { ...prev, ...data } : prev);
        // Update demo user
        const storedUser = localStorage.getItem('ems_demo_user');
        if (storedUser) {
          const demoUser = JSON.parse(storedUser) as DemoUser;
          demoUser.profile.full_name = data.full_name || demoUser.profile.full_name;
          localStorage.setItem('ems_demo_user', JSON.stringify(demoUser));
        }
        toast.success('Profile updated successfully');
      }
    } catch {
      toast.error('Failed to update profile');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile, isAuthenticated: !!user }}>
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
