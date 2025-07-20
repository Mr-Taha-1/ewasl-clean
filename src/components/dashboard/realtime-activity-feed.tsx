"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCcw,
  Eye
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: 'publish_success' | 'publish_failed' | 'connection_added' | 'connection_error' | 'job_scheduled' | 'job_cancelled' | 'system_event';
  title: string;
  description: string;
  platform?: 'facebook' | 'twitter' | 'linkedin' | 'instagram';
  status: 'success' | 'error' | 'warning' | 'info';
  timestamp: string;
}

interface RealtimeActivityFeedProps {
  language?: 'ar' | 'en';
  className?: string;
  maxItems?: number;
}

export function RealtimeActivityFeed({ 
  language = 'ar',
  className,
  maxItems = 10
}: RealtimeActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const translations = {
    ar: {
      title: 'النشاط المباشر',
      refresh: 'تحديث',
      viewAll: 'عرض الكل',
      noActivity: 'لا يوجد نشاط حديث',
      justNow: 'الآن',
      minutesAgo: 'منذ دقائق',
      hoursAgo: 'منذ ساعات'
    },
    en: {
      title: 'Live Activity',
      refresh: 'Refresh',
      viewAll: 'View All',
      noActivity: 'No recent activity',
      justNow: 'Just now',
      minutesAgo: 'minutes ago',
      hoursAgo: 'hours ago'
    }
  };

  const t = translations[language];

  // Generate demo activity data
  const generateDemoActivities = (): ActivityItem[] => {
    const demoActivities = [
      {
        id: '1',
        type: 'publish_success' as const,
        title: language === 'ar' ? 'تم نشر المنشور بنجاح' : 'Post published successfully',
        description: language === 'ar' ? 'تم نشر منشور على فيسبوك' : 'Post published to Facebook',
        platform: 'facebook' as const,
        status: 'success' as const,
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        type: 'connection_added' as const,
        title: language === 'ar' ? 'تم ربط حساب جديد' : 'New account connected',
        description: language === 'ar' ? 'تم ربط حساب إنستغرام بنجاح' : 'Instagram account connected successfully',
        platform: 'instagram' as const,
        status: 'success' as const,
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        type: 'job_scheduled' as const,
        title: language === 'ar' ? 'تم جدولة منشور' : 'Post scheduled',
        description: language === 'ar' ? 'منشور مجدول للنشر غداً' : 'Post scheduled for tomorrow',
        platform: 'twitter' as const,
        status: 'info' as const,
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        type: 'publish_failed' as const,
        title: language === 'ar' ? 'فشل في النشر' : 'Publishing failed',
        description: language === 'ar' ? 'فشل في نشر المنشور على لينكد إن' : 'Failed to publish post to LinkedIn',
        platform: 'linkedin' as const,
        status: 'error' as const,
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        type: 'system_event' as const,
        title: language === 'ar' ? 'تحديث النظام' : 'System update',
        description: language === 'ar' ? 'تم تحديث النظام بنجاح' : 'System updated successfully',
        status: 'info' as const,
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
      }
    ];

    return demoActivities.slice(0, maxItems);
  };

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setActivities(generateDemoActivities());
      setIsLoading(false);
    }, 1000);
  }, [maxItems, language]);

  const getActivityIcon = (type: ActivityItem['type'], status: ActivityItem['status']) => {
    if (status === 'success') return CheckCircle;
    if (status === 'error') return XCircle;
    if (status === 'warning') return Clock;
    return Activity;
  };

  const getStatusColor = (status: ActivityItem['status']) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getPlatformColor = (platform?: string) => {
    switch (platform) {
      case 'facebook': return 'text-blue-600';
      case 'instagram': return 'text-pink-600';
      case 'twitter': return 'text-sky-600';
      case 'linkedin': return 'text-blue-700';
      default: return 'text-gray-600';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return t.justNow;
    if (diffInMinutes < 60) return `${diffInMinutes} ${t.minutesAgo}`;
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} ${t.hoursAgo}`;
  };

  return (
    <Card className={cn("h-fit", className)}>
      <CardHeader>
        <div className={cn(
          "flex items-center justify-between",
          language === 'ar' ? "flex-row-reverse" : ""
        )}>
          <CardTitle className={cn(
            "flex items-center gap-2",
            language === 'ar' ? "flex-row-reverse" : ""
          )}>
            <Activity className="h-5 w-5" />
            {t.title}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                setActivities(generateDemoActivities());
                setIsLoading(false);
              }, 500);
            }}
            disabled={isLoading}
            className={cn(
              "flex items-center gap-2",
              language === 'ar' ? "flex-row-reverse" : ""
            )}
          >
            <RefreshCcw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            {t.refresh}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {t.noActivity}
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const IconComponent = getActivityIcon(activity.type, activity.status);
              return (
                <div
                  key={activity.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors",
                    language === 'ar' ? "flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-full",
                    getStatusColor(activity.status)
                  )}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className={cn(
                    "flex-1 min-w-0",
                    language === 'ar' ? "text-right" : "text-left"
                  )}>
                    <p className="font-medium text-gray-900 text-sm">
                      {activity.title}
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                      {activity.description}
                    </p>
                    <div className={cn(
                      "flex items-center gap-2 mt-2",
                      language === 'ar' ? "flex-row-reverse" : ""
                    )}>
                      {activity.platform && (
                        <Badge variant="outline" className={cn(
                          "text-xs",
                          getPlatformColor(activity.platform)
                        )}>
                          {activity.platform}
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
              >
                <Eye className="h-4 w-4 mr-2" />
                {t.viewAll}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}