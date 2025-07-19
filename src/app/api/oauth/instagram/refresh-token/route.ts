import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

    const { data: accounts, error: accountsError } = await query;

    if (accountsError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch Instagram accounts',
        message: 'فشل في استرجاع حسابات إنستغرام',
        details: accountsError.message
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

    // Refresh tokens for each account
    for (const account of accounts) {
      try {
        // Instagram Basic Display API token refresh
        const refreshResponse = await fetch(
          `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${account.access_token}`,
          { method: 'GET' }
        );

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          
          // Update token in database
          const expiresAt = new Date(Date.now() + (refreshData.expires_in * 1000));
          
          const { error: updateError } = await supabase
            .from('social_accounts')
            .update({
              access_token: refreshData.access_token,
              token_expires_at: expiresAt.toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', account.id);

          refreshResults.push({
            accountId: account.id,
            accountName: account.account_name,
            success: !updateError,
            expiresAt: expiresAt.toISOString(),
            error: updateError?.message
          });
        } else {
          const errorData = await refreshResponse.json();
          refreshResults.push({
            accountId: account.id,
            accountName: account.account_name,
            success: false,
            error: errorData.error?.message || 'Token refresh failed'
          });
        }
      } catch (error) {
        refreshResults.push({
          accountId: account.id,
          accountName: account.account_name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const successCount = refreshResults.filter(r => r.success).length;
    const totalCount = refreshResults.length;

    return NextResponse.json({
      success: successCount > 0,
      message: `Refreshed ${successCount}/${totalCount} Instagram tokens`,
      messageAr: `تم تحديث ${successCount}/${totalCount} رموز إنستغرام`,
      data: {
        totalAccounts: totalCount,
        successfulRefreshes: successCount,
        failedRefreshes: totalCount - successCount,
        results: refreshResults,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Instagram token refresh error:', error);
    return NextResponse.json({
      success: false,
      error: 'Token refresh failed',
      message: 'فشل في تحديث الرموز المميزة',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}