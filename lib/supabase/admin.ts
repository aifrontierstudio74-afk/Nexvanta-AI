import { createClient } from '@supabase/supabase-js';
import { env, isSupabaseConfigured } from '@/lib/env';

export function createAdminClient() {
  if (!isSupabaseConfigured) {
    // When Supabase is not configured yet (e.g. initial dev or test without credentials)
    return null;
  }

  return createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
