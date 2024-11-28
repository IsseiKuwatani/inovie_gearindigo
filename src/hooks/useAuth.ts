import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AuthState, LoginCredentials } from '../types/auth';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: session?.user ?? null,
        loading: false,
        error: null,
      });
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({
        user: session?.user ?? null,
        loading: false,
        error: null,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async ({ email, password }: LoginCredentials): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        setAuthState(prev => ({
          ...prev,
          error: error.message,
        }));
        return false;
      }

      if (!data.user) {
        setAuthState(prev => ({
          ...prev,
          error: 'ユーザー情報が見つかりません',
        }));
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error during login:', error);
      setAuthState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'ログイン中にエラーが発生しました',
      }));
      return false;
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'ログアウト中にエラーが発生しました',
      }));
    } finally {
      setAuthState(prev => ({ ...prev, loading: false, user: null }));
    }
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    logout,
  };
}