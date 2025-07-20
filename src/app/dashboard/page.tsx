"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { WelcomeSection } from "@/components/dashboard/welcome-section";
import { StatsCard } from "@/components/dashboard/stats-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RealtimeActivityFeed } from "@/components/dashboard/realtime-activity-feed";
import { SocialConnectionsWidget } from "@/components/dashboard/social-connections-widget";
import { QueueStatusWidget } from "@/components/dashboard/queue-status-widget";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { MobileDashboardLayout } from "@/components/dashboard/mobile-dashboard-layout";
import { MessageSquare, Calendar, BarChart3, Users, TrendingUp, Heart, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDataCache, usePerformanceMonitor } from "@/hooks/usePerformanceOptimization";

interface DashboardData {
  overview: {
    total_posts: number;
    scheduled_posts: number;
    published_today: number;
    engagement_rate: number;
    followers_growth: number;
    reach: number;
  };
  recent_activity: Array<{
    type: string;
    platform: string;
    content: string;
    timestamp: string;
    engagement?: { likes: number; shares: number; comments: number };
    scheduled_for?: string;
  }>;
  performance: {
    best_performing_post: {
      content: string;
      platform: string;
      engagement_rate: number;
      reach: number;
    };
    top_platforms: Array<{
      name: string;
      posts: number;
      engagement: number;
    }>;
  };
  upcoming: {
    posts_this_week: number;
    posts_next_week: number;
    scheduled_campaigns: number;
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [language] = useState<'ar' | 'en'>('ar');
  const [isMobile, setIsMobile] = useState(false);
  
  // Performance monitoring
  const performanceMetrics = usePerformanceMonitor('DashboardPage');

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cached data fetching
  const {
    data: dashboardData,
    isLoading,
    error,
    isStale,
    refetch
  } = useDataCache(
    'dashboard-data',
    async () => {
      const response = await fetch('/api/analytics/dashboard', {
        headers: { 'Cache-Control': 'no-cache' },
      });
      
      if (!response.ok) {
        // If API fails, return fallback data
        throw new Error('API not available, using fallback data');
      }
      
      const data = await response.json();
      return data.dashboard_metrics;
    },
    {
      cacheTime: 5 * 60 * 1000, // 5 minutes
      staleTime: 2 * 60 * 1000, // 2 minutes
      refetchOnWindowFocus: true,
      refetchInterval: 5 * 60 * 1000 // Refetch every 5 minutes
    }
  );

  // Fallback data for when API fails
  const fallbackData = {
    overview: {
      total_posts: 156,
      scheduled_posts: 24,
      published_today: 8,
      engagement_rate: 4.2,
      followers_growth: 156,
      reach: 12450
    },
    recent_activity: [],
    performance: {
      best_performing_post: {
        content: 'Tips for better engagement',
        platform: 'instagram',
        engagement_rate: 8.5,
        reach: 5670
      },
      top_platforms: [
        { name: 'Instagram', posts: 45, engagement: 6.2 },
        { name: 'Twitter', posts: 38, engagement: 4.8 },
        { name: 'Facebook', posts: 32, engagement: 3.9 }
      ]
    },
    upcoming: {
      posts_this_week: 12,
      posts_next_week: 8,
      scheduled_campaigns: 3
    }
  };

  const handleRetry = () => {
    refetch().catch(() => {
      console.error('Failed to refresh dashboard data');
    });
  };

  useEffect(() => {
    console.log('DashboardPage: Component mounted');
    console.log('Performance metrics:', performanceMetrics);
  }, [performanceMetrics]);

  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'المستخدم';
  };

  if (isLoading && !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  // Use fallback data if there's an error and no cached data
  const displayData = dashboardData || (error ? fallbackData : null);

  if (error && !displayData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900">فشل في تحميل البيانات</h2>
          <p className="text-gray-600">{error.message}</p>
          <button
            onClick={handleRetry}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (!displayData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">لا توجد بيانات متاحة</p>
        </div>
      </div>
    );
  }

  const dashboardContent = (
    <>
      {/* Dashboard Header with Refresh */}
      <div className={cn(
        "flex items-center justify-between mb-6",
        language === 'ar' ? "flex-row-reverse" : ""
      )}>
        <div></div> {/* Spacer */}
        <button
          onClick={handleRetry}
          disabled={isLoading}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors",
            language === 'ar' ? "flex-row-reverse" : "",
            isLoading ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
            isStale && "text-orange-600 bg-orange-50"
          )}
        >
          <RefreshCw className={cn(
            "h-4 w-4",
            isLoading && "animate-spin"
          )} />
          <span>
            {isStale ? (language === 'ar' ? 'البيانات قديمة - تحديث' : 'Stale Data - Refresh') : 
             (language === 'ar' ? 'تحديث البيانات' : 'Refresh Data')}
          </span>
        </button>
      </div>

      {/* Welcome Section */}
      <WelcomeSection 
        userName={getUserName()}
        language={language}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="إجمالي المنشورات"
          value={displayData.overview.total_posts}
          icon={MessageSquare}
          change="+8.2%"
          changeType="positive"
          color="blue"
          language={language}
        />
        <StatsCard
          title="المنشورات المجدولة"
          value={displayData.overview.scheduled_posts}
          icon={Calendar}
          change="هذا الأسبوع"
          changeType="neutral"
          color="purple"
          language={language}
        />
        <StatsCard
          title="التفاعل المتوقع"
          value={displayData.overview.published_today}
          icon={Heart}
          change="24 جديد"
          changeType="positive"
          color="green"
          language={language}
        />
        <StatsCard
          title="إجمالي التفاعل"
          value={displayData.overview.reach.toLocaleString()}
          icon={TrendingUp}
          change="+15.3%"
          changeType="positive"
          color="orange"
          language={language}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions language={language} />

      {/* Dashboard Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Activity Feed */}
        <RealtimeActivityFeed 
          language={language}
          maxItems={8}
        />

        {/* Social Connections */}
        <SocialConnectionsWidget 
          language={language}
        />
      </div>

      {/* Queue Status */}
      <QueueStatusWidget 
        language={language}
        className="mb-8"
      />

      {/* Advanced Analytics Charts */}
      <AnalyticsCharts 
        language={language}
        timeRange="30d"
        className="mt-8"
      />
    </>
  );

  // Use mobile layout for small screens
  if (isMobile) {
    return (
      <MobileDashboardLayout language={language}>
        {dashboardContent}
      </MobileDashboardLayout>
    );
  }

  // Desktop layout
  return (
    <div className={cn(
      "space-y-8",
      language === 'ar' ? "rtl" : "ltr"
    )}>
      {dashboardContent}
    </div>
  );
}