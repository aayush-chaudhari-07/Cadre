import { createClient } from '@supabase/supabase-js';
import { handleCors } from '../_shared/cors.ts';
import { json, error } from '../_shared/http.ts';
import { requireUserOnly, HttpError } from '../_shared/auth.ts';

const deno = (globalThis as unknown as { Deno?: { serve(handler: (req: Request) => Promise<Response>): void; env: { get(k: string): string | undefined } } }).Deno;

if (deno && typeof deno.serve === 'function') {
  deno.serve(handler);
}

export async function handler(req: Request): Promise<Response> {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'POST') {
    return error('invalid_input', 'Method not allowed. Only POST is accepted.', 405, req);
  }

  try {
    // 1. Authenticate caller using their personal JWT
    const { user } = await requireUserOnly(req);

    // 2. Validate confirmation payload
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return error('invalid_input', 'Invalid JSON body. Expected confirmation payload.', 400, req);
    }

    const payload = rawBody as { confirmation?: string; confirm?: string };
    const confirmWord = payload?.confirmation || payload?.confirm;

    if (confirmWord !== 'DELETE') {
      return error(
        'invalid_input',
        'Confirmation mismatch. You must explicitly type "DELETE" to permanently remove your account.',
        400,
        req,
      );
    }

    // 3. Obtain server-side service role key (Strictly isolated to this edge function per docs/SECURITY.md)
    const supabaseUrl = (deno ? deno.env.get('SUPABASE_URL') : process.env.SUPABASE_URL) || '';
    const serviceRoleKey =
      (deno ? deno.env.get('SUPABASE_SERVICE_ROLE_KEY') : process.env.SUPABASE_SERVICE_ROLE_KEY) ||
      (deno ? deno.env.get('SERVICE_ROLE_KEY') : process.env.SERVICE_ROLE_KEY) ||
      '';

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('[delete-account] Admin service role key is not configured.');
      return error(
        'internal_error',
        'Server configuration error: Administrative deletion credentials are unavailable.',
        500,
        req,
      );
    }

    // 4. Create admin client with service role key
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // 5. Delete the user from auth.users (cascades via foreign keys to owned organizations, memberships, and data)
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error('[delete-account] Admin deleteUser failed:', deleteError.message);
      return error('internal_error', `Failed to delete account: ${deleteError.message}`, 500, req);
    }

    return json(
      {
        success: true,
        message: 'Your account and associated workspace data have been permanently removed.',
      },
      200,
      req,
    );
  } catch (err) {
    if (err instanceof HttpError) {
      return error(err.code, err.message, err.status, req);
    }
    console.error('[delete-account] Unhandled exception:', err);
    return error('internal_error', 'An unexpected error occurred while deleting your account.', 500, req);
  }
}
