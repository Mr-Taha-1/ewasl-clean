import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Service Client
 * Creates a service role client for server-side operations
 * Bypasses Row Level Security (RLS) for admin operations
 */
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }

  if (!supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Export service client for compatibility
export const supabaseService = createServiceClient();

// Export admin client for compatibility  
export const supabaseAdmin = createServiceClient();

// Default export
export default createServiceClient;