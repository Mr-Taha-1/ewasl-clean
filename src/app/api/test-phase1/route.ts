import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

/**
 * Phase 1 Testing Endpoint
 * Comprehensive testing for all Phase 1 functionality
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const supabaseService = createServiceClient();
    
    // Test 1: Authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    const authStatus = user ? 'authenticated' : 'anonymous';
    
    // Test 2: Database connectivity
    const { data: dbTest, error: dbError } = await supabaseService
      .from('social_accounts')
      .select('count')
      .limit(1);
    
    // Test 3: Social accounts status
    const { data: socialAccounts, error: socialError } = user 
      ? await supabase
          .from('social_accounts')
          .select('platform, is_active, token_expires_at')
          .eq('user_id', user.id)
      : { data: null, error: null };

    // Test 4: System health
    const systemHealth = {
      database: dbError ? 'error' : 'healthy',
      authentication: authError ? 'error' : 'healthy',
      socialAccounts: socialError ? 'error' : 'healthy'
    };

    // Test 5: Token status analysis
    const tokenAnalysis = socialAccounts ? {
      total: socialAccounts.length,
      active: socialAccounts.filter(acc => acc.is_active).length,
      expired: socialAccounts.filter(acc => 
        acc.token_expires_at && new Date(acc.token_expires_at) < new Date()
      ).length
    } : null;

    return NextResponse.json({
      success: true,
      message: 'Phase 1 testing completed successfully',
      messageAr: 'تم اختبار المرحلة الأولى بنجاح',
      data: {
        phase: 'Phase 1',
        timestamp: new Date().toISOString(),
        authStatus,
        systemHealth,
        socialAccounts: socialAccounts || [],
        tokenAnalysis,
        tests: {
          authentication: !authError,
          database: !dbError,
          socialAccounts: !socialError
        }
      }
    });

  } catch (error) {
    console.error('Phase 1 test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Phase 1 testing failed',
      message: 'فشل في اختبار المرحلة الأولى',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}