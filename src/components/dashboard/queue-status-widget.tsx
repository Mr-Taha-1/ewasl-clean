"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Calendar,
  BarChart3
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface QueueItem {
  id: string;
  post_content: string;
  platforms: string[];
  scheduled_for: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  retry_count?: number;
}

interface QueueStats {
  total_pending: number;
  total_processing: number;
  total_completed_today: number;
  total_failed: number;
  next_execution: string | null;
}

interface QueueStatusWidgetProps {
  language?: 'ar' | 'en';
  className?: string;
}

export function QueueStatusWidget({ 
  language = 'ar',
  className
}: QueueStatusWidgetProps) {
  const [queueStats, setQueueStats] = useState<QueueStats | null>(null);
  const [recentItems, setRecentItems] = useState<QueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const translations = {
    ar: {
      title: 'حالة قائمة الانتظار',
      pending: 'في الانتظار',
      processing: 'قيد المعالجة',
      completed: 'مكتمل اليوم',
      failed: 'فشل',
      nextExecution: 'التنفيذ التالي',
      viewQueue: 'عرض القائمة',
      noItems: 'لا توجد عناصر في القائمة',
      schedulePost: 'جدولة منشور',
      justNow: 'الآن',
      inMinutes: 'خلال دقائق',
      inHours: 'خلال ساعات',
      minutesAgo: 'منذ دقائق',
      hoursAgo: 'منذ ساعات'
    },
    en: {
      title: 'Queue Status',
      pending: 'Pending',
      processing: 'Processing',
      completed: 'Completed Today',
      failed: 'Failed',
      nextExecution: 'Next Execution',
      viewQueue: 'View Queue',
      noItems: 'No items in queue',
      schedulePost: 'Schedule Post',
      justNow: 'now',
      inMinutes: 'in minutes',
      inHours: 'in hours',
      minutesAgo: 'minutes ago',
      hoursAgo: 'hours ago'
    }
  };

  const t = translations[language];

  // Generate demo queue data
  const generateDemoData = () => {
    const stats: QueueStats = {
      total_pending: 12,
      total_processing: 2,
      total_completed_today: 8,
      total_failed: 1,
      next_execution: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    };

    const items: QueueItem[] = [
      {
        id: '1',
        post_content: language === 'ar' ? 'منشور تسويقي جديد للمنتج' : 'New marketing post for product',
        platforms: ['facebook', 'instagram'],
        scheduled_for: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        status: 'pending'
      },
      {
        id: '2',
        post_content: language === 'ar' ? 'تحديث أسبوعي للشركة' : 'Weekly company update',
        platforms: ['linkedin', 'twitter'],
        scheduled_for: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        status: 'pending'
      },
      {
        id: '3',
        post_content: language === 'ar' ? 'منشور ترويجي للعرض الخاص' : 'Promotional post for special offer',
        platforms: ['facebook'],
        scheduled_for: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        status: 'processing'
      },
      {
        id: '4',
        post_content: language === 'ar' ? 'منشور تعليمي حول المنتج' : 'Educational post about product',
        platforms: ['instagram', 'twitter'],
        scheduled_for: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        status: 'completed'
      },
      {
        id: '5',
        post_content: language === 'ar' ? 'منشور فشل في النشر' : 'Failed to publish post',
        platforms: ['linkedin'],
        scheduled_for: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        status: 'failed',
        retry_count: 2
      }
    ];

    return { stats, items };
  };

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const { stats, items } = generateDemoData();
      setQueueStats(stats);
      setRecentItems(items);
      setIsLoading(false);
    }, 600);
  }, [language]);

  const getStatusIcon = (status: QueueItem['status']) => {
    switch (status) {
      case 'pending': return Clock;
      case 'processing': return Play;
      case 'completed': return CheckCircle;
      case 'failed': return XCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: QueueItem['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: QueueItem['status']) => {
    switch (status) {
      case 'pending': return t.pending;
      case 'processing': return t.processing;
      case 'completed': return t.completed;
      case 'failed': return t.failed;
      default: return status;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'facebook': return 'bg-blue-500 text-white';
      case 'instagram': return 'bg-pink-500 text-white';
      case 'twitter': return 'bg-sky-500 text-white';
      case 'linkedin': return 'bg-blue-700 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatTimeRelative = (timestamp: string, isPast: boolean = false) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.abs(Math.floor((time.getTime() - now.getTime()) / (1000 * 60)));

    if (diffInMinutes < 1) return t.justNow;
    if (diffInMinutes < 60) {
      if (isPast) return `${diffInMinutes} ${t.minutesAgo}`;
      return `${diffInMinutes} ${t.inMinutes}`;
    }
    const hours = Math.floor(diffInMinutes / 60);
    if (isPast) return `${hours} ${t.hoursAgo}`;
    return `${hours} ${t.inHours}`;
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className={cn(
          "flex items-center justify-between",
          language === 'ar' ? "flex-row-reverse" : ""
        )}>
          <CardTitle className={cn(
            "flex items-center gap-2",
            language === 'ar' ? "flex-row-reverse" : ""
          )}>
            <Clock className="h-5 w-5" />
            {t.title}
          </CardTitle>
          <Link href="/schedule">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center gap-2",
                language === 'ar' ? "flex-row-reverse" : ""
              )}
            >
              <BarChart3 className="h-4 w-4" />
              {t.viewQueue}
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Queue Stats */}
            {queueStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{queueStats.total_pending}</div>
                  <div className="text-sm text-yellow-700">{t.pending}</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{queueStats.total_processing}</div>
                  <div className="text-sm text-blue-700">{t.processing}</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{queueStats.total_completed_today}</div>
                  <div className="text-sm text-green-700">{t.completed}</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{queueStats.total_failed}</div>
                  <div className="text-sm text-red-700">{t.failed}</div>
                </div>
              </div>
            )}

            {/* Next Execution */}
            {queueStats?.next_execution && (
              <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                <div className={cn(
                  "flex items-center gap-2 text-blue-700",
                  language === 'ar' ? "flex-row-reverse" : ""
                )}>
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">{t.nextExecution}:</span>
                  <span>{formatTimeRelative(queueStats.next_execution)}</span>
                </div>
              </div>
            )}

            {/* Recent Items */}
            {recentItems.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-2">{t.noItems}</p>
                <Link href="/posts/new">
                  <Button size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    {t.schedulePost}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentItems.slice(0, 5).map((item) => {
                  const StatusIcon = getStatusIcon(item.status);
                  const isPast = new Date(item.scheduled_for) < new Date();
                  
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors",
                        language === 'ar' ? "flex-row-reverse" : ""
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-full",
                        getStatusColor(item.status)
                      )}>
                        <StatusIcon className="h-4 w-4" />
                      </div>
                      <div className={cn(
                        "flex-1 min-w-0",
                        language === 'ar' ? "text-right" : "text-left"
                      )}>
                        <p className="font-medium text-gray-900 text-sm">
                          {truncateText(item.post_content)}
                        </p>
                        <div className={cn(
                          "flex items-center gap-2 mt-1",
                          language === 'ar' ? "flex-row-reverse" : ""
                        )}>
                          <div className="flex gap-1">
                            {item.platforms.map((platform) => (
                              <Badge
                                key={platform}
                                variant="outline"
                                className={cn(
                                  "text-xs px-1 py-0",
                                  getPlatformColor(platform)
                                )}
                              >
                                {platform.charAt(0).toUpperCase()}
                              </Badge>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatTimeRelative(item.scheduled_for, isPast)}
                          </span>
                          {item.retry_count && (
                            <Badge variant="outline" className="text-xs text-orange-600">
                              Retry {item.retry_count}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}