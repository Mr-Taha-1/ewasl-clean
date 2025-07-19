import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

/**
 * Metrics Collection Endpoint
 * Provides system performance and usage metrics
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const supabaseService = createServiceClient();
    
    // Get authenticated user (optional for system metrics)
    const { data: { user } } = await supabase.auth.getUser();
    
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '24h';
    
    // Calculate time range
    const now = new Date();
    const hoursBack = period === '7d' ? 168 : period === '30d' ? 720 : 24;
    const startTime = new Date(now.getTime() - (hoursBack * 60 * 60 * 1000));

    // Get basic metrics
    const [postsResult, accountsResult, scheduledResult] = await Promise.all([
      // Total posts
      supabaseService
        .from('posts')
        .select('count')
        .gte('created_at', startTime.toISOString()),
      
      // Social accounts
      supabaseService
        .from('social_accounts')
        .select('platform, is_active'),
      
      // Scheduled posts
      supabaseService
        .from('scheduled_posts_queue')
        .select('status')
        .gte('created_at', startTime.toISOString())
    ]);

    // Process results
    const posts = postsResult.data || [];
    const accounts = accountsResult.data || [];
    const scheduled = scheduledResult.data || [];

    const metrics = {
      timestamp: now.toISOString(),
      period,
      timeRange: {
        start: startTime.toISOString(),
        end: now.toISOString()
      },
      system: {
        totalPosts: posts.length,
        totalAccounts: accounts.length,
        activeAccounts: accounts.filter(acc => acc.is_active).length,
        scheduledPosts: scheduled.length,
        completedPosts: scheduled.filter(s => s.status === 'completed').length,
        failedPosts: scheduled.filter(s => s.status === 'failed').length
      },
      platforms: {
        facebook: accounts.filter(acc => acc.platform === 'facebook').length,
        instagram: accounts.filter(acc => acc.platform === 'instagram').length,
        twitter: accounts.filter(acc => acc.platform === 'twitter').length,
        linkedin: accounts.filter(acc => acc.platform === 'linkedin').length
      },
      health: {
        database: !postsResult.error && !accountsResult.error && !scheduledResult.error,
        errors: [postsResult.error, accountsResult.error, scheduledResult.error].filter(Boolean)
      }
    };

    return NextResponse.json({
      success: true,
      message: 'Metrics collected successfully',
      messageAr: 'تم جمع المقاييس بنجاح',
      data: metrics
    });

  } catch (error) {
    console.error('Metrics collection error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to collect metrics',
      message: 'فشل في جمع المقاييس',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}