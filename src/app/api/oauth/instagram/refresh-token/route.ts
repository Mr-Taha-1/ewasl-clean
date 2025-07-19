import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

/**
 * Instagram Token Refresh Endpoint
 * Refreshes expired Instagram access tokens
 */
export async function GET(request: NextRequest) {
  return handleTokenRefresh(request);
}

export async function POST(request: NextRequest) {
  return handleTokenRefresh(request);
}

async function handleTokenRefresh(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
        message: 'مطلوب تسجيل الدخول'
      }, { status: 401 });
    }

    // Get account ID from query params or request body
    let accountId: string | null = null;
    
    if (request.method === 'GET') {
      const { searchParams } = new URL(request.url);
      accountId = searchParams.get('accountId');
    } else {
      try {
        const body = await request.json();
        accountId = body.accountId;
      } catch (error) {
        // Continue without accountId to refresh all accounts
      }
    }

    // Get Instagram accounts to refresh
    const query = supabase
      .from('social_accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('platform', 'instagram')
      .eq('is_active', true);

    if (accountId) {
      query.eq('id', accountId);
    }

    const { data: accounts, error: fetchError } = await query;

    if (fetchError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch Instagram accounts',
        message: 'فشل في جلب حسابات إنستغرام',
        details: fetchError.message
      }, { status: 500 });
    }

    if (!accounts || accounts.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No Instagram accounts found',
        message: 'لم يتم العثور على حسابات إنستغرام'
      }, { status: 404 });
    }

    const refreshResults = [];

    // Process each account
    for (const account of accounts) {
      try {
        // Check if token needs refresh (expires within 7 days)
        const expiresAt = new Date(account.token_expires_at);
        const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        
        if (expiresAt > sevenDaysFromNow) {
          refreshResults.push({
            accountId: account.id,
            platform: account.platform,
            status: 'skipped',
            message: 'Token still valid',
            messageAr: 'الرمز المميز لا يزال صالحاً',
            expiresAt: account.token_expires_at
          });
          continue;
        }

        // Refresh the token
        const refreshResponse = await fetch(
          `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${account.access_token}`,
          { method: 'GET' }
        );

        if (!refreshResponse.ok) {
          const errorData = await refreshResponse.json().catch(() => ({}));
          refreshResults.push({
            accountId: account.id,
            platform: account.platform,
            status: 'failed',
            error: errorData.error?.message || 'Token refresh failed',
            message: 'فشل في تحديث الرمز المميز'
          });
          continue;
        }

        const tokenData = await refreshResponse.json();
        
        // Calculate new expiration (60 days from now)
        const newExpiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

        // Update the account with new token
        const { error: updateError } = await supabase
          .from('social_accounts')
          .update({
            access_token: tokenData.access_token,
            token_expires_at: newExpiresAt.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', account.id);

        if (updateError) {
          refreshResults.push({
            accountId: account.id,
            platform: account.platform,
            status: 'failed',
            error: 'Database update failed',
            message: 'فشل في تحديث قاعدة البيانات',
            details: updateError.message
          });
        } else {
          refreshResults.push({
            accountId: account.id,
            platform: account.platform,
            status: 'success',
            message: 'Token refreshed successfully',
            messageAr: 'تم تحديث الرمز المميز بنجاح',
            expiresAt: newExpiresAt.toISOString()
          });
        }

      } catch (error) {
        refreshResults.push({
          accountId: account.id,
          platform: account.platform,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          message: 'حدث خطأ غير متوقع'
        });
      }
    }

    const successCount = refreshResults.filter(r => r.status === 'success').length;
    const failedCount = refreshResults.filter(r => r.status === 'failed').length;

    return NextResponse.json({
      success: successCount > 0,
      message: `Processed ${accounts.length} accounts: ${successCount} successful, ${failedCount} failed`,
      messageAr: `تم معالجة ${accounts.length} حسابات: ${successCount} نجح، ${failedCount} فشل`,
      data: {
        totalAccounts: accounts.length,
        successCount,
        failedCount,
        results: refreshResults
      }
    });

  } catch (error) {
    console.error('Instagram token refresh error:', error);
    return NextResponse.json({
      success: false,
      error: 'Token refresh failed',
      message: 'فشل في تحديث الرمز المميز',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}