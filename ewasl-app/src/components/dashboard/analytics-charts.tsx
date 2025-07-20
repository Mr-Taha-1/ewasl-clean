"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Users, 
  Heart, 
  Eye,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ChartData {
  engagement_trends: Array<{
    date: string;
    engagement: number;
    reach: number;
    posts: number;
  }>;
  platform_stats: Array<{
    platform: string;
    engagement: number;
    posts: number;
    color: string;
  }>;
  hourly_performance: Array<{
    hour: number;
    engagement_rate: number;
  }>;
}

interface AnalyticsChartsProps {
  language?: 'ar' | 'en';
  className?: string;
  timeRange?: '7d' | '30d' | '90d';
}

export function AnalyticsCharts({
  language = 'ar',
  className,
  timeRange = '30d'
}: AnalyticsChartsProps) {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('trends');

  const translations = {
    ar: {
      title: 'الرسوم البيانية التفاعلية',
      trends: 'الاتجاهات',
      platforms: 'المنصات',
      timing: 'التوقيت',
      engagementTrends: 'اتجاهات التفاعل',
      platformPerformance: 'أداء المنصات',
      hourlyAnalysis: 'التحليل بالساعة',
      engagement: 'التفاعل',
      reach: 'الوصول',
      posts: 'المنشورات',
      refresh: 'تحديث البيانات',
      loading: 'جاري التحميل...',
      error: 'فشل في تحميل البيانات'
    },
    en: {
      title: 'Interactive Charts',
      trends: 'Trends',
      platforms: 'Platforms',
      timing: 'Timing',
      engagementTrends: 'Engagement Trends',
      platformPerformance: 'Platform Performance',
      hourlyAnalysis: 'Hourly Analysis',
      engagement: 'Engagement',
      reach: 'Reach',
      posts: 'Posts',
      refresh: 'Refresh Data',
      loading: 'Loading...',
      error: 'Failed to load data'
    }
  };

  const t = translations[language];

  // Generate demo data
  const generateDemoData = (): ChartData => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    
    return {
      engagement_trends: Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toLocaleDateString('en-CA'),
        engagement: Math.floor(Math.random() * 500) + 200 + (i * 10),
        reach: Math.floor(Math.random() * 2000) + 1000 + (i * 50),
        posts: Math.floor(Math.random() * 10) + 5
      })),
      platform_stats: [
        { platform: 'Facebook', engagement: 1250, posts: 45, color: '#1877F2' },
        { platform: 'Instagram', engagement: 980, posts: 38, color: '#E4405F' },
        { platform: 'Twitter', engagement: 720, posts: 52, color: '#1DA1F2' },
        { platform: 'LinkedIn', engagement: 410, posts: 23, color: '#0A66C2' }
      ],
      hourly_performance: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        engagement_rate: Math.random() * 8 + 2 + (i >= 9 && i <= 21 ? 2 : 0)
      }))
    };
  };

  const fetchChartData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analytics/charts?timeRange=${timeRange}`);
      
      if (response.ok) {
        const data = await response.json();
        setChartData(data.charts);
      } else {
        setChartData(generateDemoData());
      }
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
      setChartData(generateDemoData());
      toast.error(t.error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [timeRange]);

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-2 text-gray-600">{t.loading}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!chartData) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <div className="text-center text-gray-600">{t.error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className={cn(
          "flex items-center justify-between",
          language === 'ar' ? "flex-row-reverse" : ""
        )}>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t.title}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchChartData}
            disabled={isLoading}
            className={cn(
              "flex items-center gap-2",
              language === 'ar' ? "flex-row-reverse" : ""
            )}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            {t.refresh}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <Tabs value={activeChart} onValueChange={setActiveChart} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trends">{t.trends}</TabsTrigger>
            <TabsTrigger value="platforms">{t.platforms}</TabsTrigger>
            <TabsTrigger value="timing">{t.timing}</TabsTrigger>
          </TabsList>

          {/* Engagement Trends */}
          <TabsContent value="trends" className="space-y-4">
            <div className={language === 'ar' ? "text-right" : ""}>
              <h3 className="text-lg font-semibold mb-2">{t.engagementTrends}</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData.engagement_trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatDate}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={formatDate}
                  formatter={(value: number, name: string) => [
                    formatNumber(value),
                    name === 'engagement' ? t.engagement :
                    name === 'reach' ? t.reach : t.posts
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="engagement"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="reach"
                  stackId="1"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          {/* Platform Performance */}
          <TabsContent value="platforms" className="space-y-4">
            <div className={language === 'ar' ? "text-right" : ""}>
              <h3 className="text-lg font-semibold mb-2">{t.platformPerformance}</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.platform_stats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    formatNumber(value),
                    name === 'engagement' ? t.engagement : t.posts
                  ]}
                />
                <Bar dataKey="engagement" fill="#8884d8" />
                <Bar dataKey="posts" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          {/* Hourly Analysis */}
          <TabsContent value="timing" className="space-y-4">
            <div className={language === 'ar' ? "text-right" : ""}>
              <h3 className="text-lg font-semibold mb-2">{t.hourlyAnalysis}</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.hourly_performance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="hour" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(hour) => `${hour}:00`}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(hour) => `${hour}:00`}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, t.engagement]}
                />
                <Line
                  type="monotone"
                  dataKey="engagement_rate"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}