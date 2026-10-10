import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { adminEmailList } from '@/lib/env';

export interface AuthSession {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  fullName?: string;
}

/**
 * Get current authenticated user session on the server.
 * Returns null if unauthenticated.
 */
export async function getServerSession(): Promise<AuthSession | null> {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    // For development testing or mock session if headers present
    return null;
  }

  const user = session.user;
  const email = user.email?.toLowerCase() || '';

  // Check admin role from profile or adminEmailList
  const isAdminByEmail = adminEmailList.includes(email);

  return {
    userId: user.id,
    email,
    role: isAdminByEmail ? 'admin' : 'user',
    fullName: user.user_metadata?.full_name || '',
  };
}

/**
 * Throw 401 Response if unauthenticated.
 */
export async function requireAuthSession(): Promise<AuthSession> {
  const session = await getServerSession();
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}

/**
 * Throw 403 Response if not an admin.
 */
export async function requireAdminSession(): Promise<AuthSession> {
  const session = await requireAuthSession();
  if (session.role !== 'admin') {
    throw new Error('FORBIDDEN');
  }
  return session;
}
