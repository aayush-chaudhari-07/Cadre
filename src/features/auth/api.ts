import { supabase } from '@/lib/supabase';
import type { LoginInput, SignupInput } from './schemas';

export interface SignUpParams extends Omit<SignupInput, 'terms'> {
  emailRedirectTo?: string;
}

/**
 * Sign up a new user with email, password, and display name metadata.
 */
export async function signUp({ email, password, displayName, emailRedirectTo }: SignUpParams) {
  const siteUrl = window.location.origin;
  const redirectTo = emailRedirectTo || `${siteUrl}/app`;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
      emailRedirectTo: redirectTo,
    },
  });

  if (error) throw error;
  return data;
}

/**
 * Sign in with email and password.
 */
export async function signIn({ email, password }: LoginInput) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Sign out the currently authenticated user.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Sign in with Google via Supabase OAuth.
 */
export async function signInWithGoogle(redirectPath: string = '/app') {
  const siteUrl = window.location.origin;
  const redirectTo = `${siteUrl}${redirectPath.startsWith('/') ? redirectPath : `/${redirectPath}`}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
    },
  });

  if (error) throw error;
  return data;
}

/**
 * Send password reset email.
 */
export async function requestPasswordReset(email: string) {
  const siteUrl = window.location.origin;
  const redirectTo = `${siteUrl}/reset-password`;

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) throw error;
  return data;
}

/**
 * Update the user password (used from /reset-password once user lands with token).
 */
export async function updatePassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Resend email confirmation link.
 */
export async function resendConfirmationEmail(email: string) {
  const siteUrl = window.location.origin;
  const redirectTo = `${siteUrl}/app`;

  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: redirectTo,
    },
  });

  if (error) throw error;
  return data;
}
