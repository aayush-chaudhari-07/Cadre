import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Missing environment variable: VITE_SUPABASE_URL. Please set this in your .env file.',
  );
}

if (!supabasePublishableKey) {
  throw new Error(
    'Missing environment variable: VITE_SUPABASE_PUBLISHABLE_KEY. Please set this in your .env file.',
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
