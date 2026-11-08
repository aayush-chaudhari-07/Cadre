import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type { ErrorCode } from './http.ts';

export class HttpError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly status: number = 400,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export interface AuthContext {
  user: User;
  supabase: SupabaseClient;
}

/**
 * Creates a user-scoped Supabase client from the incoming Authorization header,
 * authenticates the user, and verifies active organization membership.
 */
export async function requireAuth(req: Request, orgId: string): Promise<AuthContext> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new HttpError('unauthorized', 'Missing or invalid Authorization header.', 401);
  }

  const deno = (globalThis as unknown as { Deno?: { env: { get(k: string): string | undefined } } }).Deno;
  const supabaseUrl = (deno ? deno.env.get('SUPABASE_URL') : process.env.SUPABASE_URL) || '';
  const supabaseAnonKey = (deno ? deno.env.get('SUPABASE_ANON_KEY') : process.env.SUPABASE_ANON_KEY) || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new HttpError('internal_error', 'Supabase environment configuration missing.', 500);
  }

  // Create user-scoped client passing the caller's JWT
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { Authorization: authHeader },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  // Verify caller's JWT
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new HttpError('unauthorized', 'Session expired or invalid user authentication.', 401);
  }

  // Verify workspace membership through RLS
  const { data: membership, error: memberError } = await supabase
    .from('memberships')
    .select('org_id')
    .eq('org_id', orgId)
    .maybeSingle();

  if (memberError || !membership) {
    throw new HttpError('forbidden', 'You do not have access to this workspace organization.', 403);
  }

  return { user, supabase };
}

/**
 * Creates a user-scoped Supabase client and verifies the caller's JWT,
 * without requiring a specific orgId (used for user-level actions like delete-account).
 */
export async function requireUserOnly(req: Request): Promise<AuthContext> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new HttpError('unauthorized', 'Missing or invalid Authorization header.', 401);
  }

  const deno = (globalThis as unknown as { Deno?: { env: { get(k: string): string | undefined } } }).Deno;
  const supabaseUrl = (deno ? deno.env.get('SUPABASE_URL') : process.env.SUPABASE_URL) || '';
  const supabaseAnonKey = (deno ? deno.env.get('SUPABASE_ANON_KEY') : process.env.SUPABASE_ANON_KEY) || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new HttpError('internal_error', 'Supabase environment configuration missing.', 500);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { Authorization: authHeader },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new HttpError('unauthorized', 'Session expired or invalid user authentication.', 401);
  }

  return { user, supabase };
}

