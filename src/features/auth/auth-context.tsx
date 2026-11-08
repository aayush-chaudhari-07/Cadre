import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import * as authApi from './api';
import type { SignUpParams } from './api';
import type { LoginInput } from './schemas';

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (params: SignUpParams) => ReturnType<typeof authApi.signUp>;
  signIn: (params: LoginInput) => ReturnType<typeof authApi.signIn>;
  signOut: () => Promise<void>;
  signInWithGoogle: (redirectPath?: string) => ReturnType<typeof authApi.signInWithGoogle>;
  requestPasswordReset: (email: string) => ReturnType<typeof authApi.requestPasswordReset>;
  updatePassword: (password: string) => ReturnType<typeof authApi.updatePassword>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data) {
        setProfile(data);
      }
    } catch {
      // Profile fetch failure is non-fatal; user info comes from user metadata fallback
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);

  useEffect(() => {
    let isMounted = true;

    // Initial session load
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (!isMounted) return;
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      if (initialSession?.user) {
        fetchProfile(initialSession.user.id);
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        await fetchProfile(newSession.user.id);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signUp = useCallback(async (params: SignUpParams) => {
    return authApi.signUp(params);
  }, []);

  const signIn = useCallback(async (params: LoginInput) => {
    return authApi.signIn(params);
  }, []);

  const signOut = useCallback(async () => {
    await authApi.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
  }, []);

  const signInWithGoogle = useCallback(async (redirectPath?: string) => {
    return authApi.signInWithGoogle(redirectPath);
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    return authApi.requestPasswordReset(email);
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    return authApi.updatePassword(password);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      signInWithGoogle,
      requestPasswordReset,
      updatePassword,
      refreshProfile,
    }),
    [
      user,
      session,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      signInWithGoogle,
      requestPasswordReset,
      updatePassword,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
