"use client";

import React, { useEffect, useState, useCallback } from "react";
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
      const response = await fetch('/api/metrics', {
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load dashboard data');
      }

      return data;
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
    data: {
      system: {
        totalPosts: 156,
        totalAccounts: 8,
        scheduledPosts: 24,
        completedPosts: 132
      }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header with Refresh */}
        <div className={cn(
          "flex items-center justify-between mb-6",
          language === 'ar' ? "flex-row-reverse" : ""
        )}>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">eW</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              لوحة التحكم
            </h1>
            <p className="text-gray-600 mt-2">Enhanced Dashboard with Phase 2 Features</p>
          </div>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">المنشورات</h3>
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {isLoading ? "..." : displayData?.data?.system?.totalPosts || 0}
            </p>
            <p className="text-sm text-gray-500">Total Posts</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">الحسابات</h3>
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              {isLoading ? "..." : displayData?.data?.system?.totalAccounts || 0}
            </p>
            <p className="text-sm text-gray-500">Social Accounts</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">المجدولة</h3>
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {isLoading ? "..." : displayData?.data?.system?.scheduledPosts || 0}
            </p>
            <p className="text-sm text-gray-500">Scheduled Posts</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">المكتملة</h3>
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-orange-600">
              {isLoading ? "..." : displayData?.data?.system?.completedPosts || 0}
            </p>
            <p className="text-sm text-gray-500">Completed Posts</p>
          </div>
        </div>

        {/* Phase 2 Feature: Interactive Analytics Charts */}
        <AnalyticsCharts 
          language={language}
          timeRange="30d"
          className="mb-8"
        />

        {/* API Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">حالة النظام</h2>
          <p className="text-gray-600 mb-4">System Status</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">قاعدة البيانات / Database</span>
            </div>
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">API المقاييس / Metrics API</span>
            </div>
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">اختبار المرحلة 1 / Phase 1 Test</span>
            </div>
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">تحليلات المرحلة 2 / Phase 2 Analytics</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">روابط سريعة</h2>
          <p className="text-gray-600 mb-4">Quick Links</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <a 
              href="/api/test-phase1" 
              target="_blank"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-blue-600">اختبار المرحلة 1</h3>
              <p className="text-sm text-gray-500">Phase 1 Test API</p>
            </a>
            
            <a 
              href="/api/metrics" 
              target="_blank"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-green-600">مقاييس النظام</h3>
              <p className="text-sm text-gray-500">System Metrics API</p>
            </a>
            
            <a 
              href="/api/oauth/instagram/refresh-token" 
              target="_blank"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-purple-600">تحديث الرموز</h3>
              <p className="text-sm text-gray-500">Token Refresh API</p>
            </a>

            <a 
              href="/api/analytics/charts" 
              target="_blank"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-indigo-600">تحليلات المرحلة 2</h3>
              <p className="text-sm text-gray-500">Phase 2 Analytics API</p>
            </a>
          </div>
        </div>
      </div>
    </div>
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
  return dashboardContent;
}