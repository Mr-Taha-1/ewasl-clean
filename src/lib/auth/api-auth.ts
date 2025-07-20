import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function getAuthenticatedUser(request: NextRequest) {
  try {
    // Create Supabase client with service role for API routes
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // For now, return a mock user for development
    // In production, you would extract and verify the JWT token from the request
    const mockUser = {
      id: 'mock-user-id',
      email: 'user@example.com',
      created_at: new Date().toISOString(),
    };

    return Promise.resolve({
      user: mockUser,
      supabase
    });
  } catch (error) {
    console.error('Authentication error:', error);
    throw new Error('Authentication failed');
  }
}

export async function requireAuth(request: NextRequest) {
  try {
    const { user, supabase } = await getAuthenticatedUser(request);
    return { user, supabase };
  } catch (error) {
    throw new Error('Authentication required');
  }
}