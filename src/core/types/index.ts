import { type User as SupabaseUser } from '@supabase/supabase-js';

export type Role = 'Super Admin' | 'Editor' | 'Support' | 'Customer';

export interface User extends SupabaseUser {
  role?: Role;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
}
