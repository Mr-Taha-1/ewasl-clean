"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users,
  Plus,
  CheckCircle,
  AlertCircle,
  XCircle,
  Settings
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SocialConnection {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin';
  account_name: string;
  account_id: string;
  status: 'connected' | 'error' | 'expired';
  followers_count?: number;
  last_sync: string;
  avatar_url?: string;
}

interface SocialConnectionsWidgetProps {
  language?: 'ar' | 'en';
  className?: string;
}

export function SocialConnectionsWidget({ 
  language = 'ar',
  className
}: SocialConnectionsWidgetProps) {
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const translations = {
    ar: {
      title: 'الحسابات المتصلة',
      addAccount: 'إضافة حساب',
      manage: 'إدارة',
      connected: 'متصل',
      error: 'خطأ',
      expired: 'منتهي الصلاحية',
      followers: 'متابع',
      lastSync: 'آخر مزامنة',
      noConnections: 'لا توجد حسابات متصلة',
      connectFirst: 'قم بربط حساباتك الاجتماعية للبدء'
    },
    en: {
      title: 'Connected Accounts',
      addAccount: 'Add Account',
      manage: 'Manage',
      connected: 'Connected',
      error: 'Error',
      expired: 'Expired',
      followers: 'followers',
      lastSync: 'Last sync',
      noConnections: 'No connected accounts',
      connectFirst: 'Connect your social accounts to get started'
    }
  };

  const t = translations[language];

  // Generate demo connections data
  const generateDemoConnections = (): SocialConnection[] => {
    return [
      {
        id: '1',
        platform: 'facebook',
        account_name: 'eWasl Official',
        account_id: 'ewasl_official',
        status: 'connected',
        followers_count: 12450,
        last_sync: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        avatar_url: '/api/placeholder/40/40'
      },
      {
        id: '2',
        platform: 'instagram',
        account_name: '@ewasl_app',
        account_id: 'ewasl_app',
        status: 'connected',
        followers_count: 8920,
        last_sync: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        avatar_url: '/api/placeholder/40/40'
      },
      {
        id: '3',
        platform: 'twitter',
        account_name: '@ewasl',
        account_id: 'ewasl',
        status: 'error',
        followers_count: 5670,
        last_sync: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        avatar_url: '/api/placeholder/40/40'
      },
      {
        id: '4',
        platform: 'linkedin',
        account_name: 'eWasl Company',
        account_id: 'ewasl-company',
        status: 'expired',
        followers_count: 2340,
        last_sync: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        avatar_url: '/api/placeholder/40/40'
      }
    ];
  };

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setConnections(generateDemoConnections());
      setIsLoading(false);
    }, 800);
  }, []);

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'facebook': return 'bg-blue-500';
      case 'instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'twitter': return 'bg-sky-500';
      case 'linkedin': return 'bg-blue-700';
      default: return 'bg-gray-500';
    }
  };

  const getPlatformIcon = (platform: string) => {
    // Using first letter as icon since we don't have platform-specific icons
    switch (platform) {
      case 'facebook': return 'F';
      case 'instagram': return 'I';
      case 'twitter': return 'T';
      case 'linkedin': return 'L';
      default: return '?';
    }
  };

  const getStatusIcon = (status: SocialConnection['status']) => {
    switch (status) {
      case 'connected': return CheckCircle;
      case 'error': return XCircle;
      case 'expired': return AlertCircle;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: SocialConnection['status']) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'expired': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: SocialConnection['status']) => {
    switch (status) {
      case 'connected': return t.connected;
      case 'error': return t.error;
      case 'expired': return t.expired;
      default: return status;
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return language === 'ar' ? 'الآن' : 'now';
    if (diffInMinutes < 60) return language === 'ar' ? `منذ ${diffInMinutes} دقيقة` : `${diffInMinutes}m ago`;
    const hours = Math.floor(diffInMinutes / 60);
    if (hours < 24) return language === 'ar' ? `منذ ${hours} ساعة` : `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return language === 'ar' ? `منذ ${days} يوم` : `${days}d ago`;
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
            <Users className="h-5 w-5" />
            {t.title}
          </CardTitle>
          <Link href="/social">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center gap-2",
                language === 'ar' ? "flex-row-reverse" : ""
              )}
            >
              <Settings className="h-4 w-4" />
              {t.manage}
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : connections.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">{t.noConnections}</p>
            <p className="text-sm text-gray-400 mb-4">{t.connectFirst}</p>
            <Link href="/social">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {t.addAccount}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {connections.map((connection) => {
              const StatusIcon = getStatusIcon(connection.status);
              return (
                <div
                  key={connection.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors",
                    language === 'ar' ? "flex-row-reverse" : ""
                  )}
                >
                  <div className="relative">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold",
                      getPlatformColor(connection.platform)
                    )}>
                      {getPlatformIcon(connection.platform)}
                    </div>
                    <div className={cn(
                      "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center",
                      getStatusColor(connection.status)
                    )}>
                      <StatusIcon className="h-3 w-3" />
                    </div>
                  </div>
                  <div className={cn(
                    "flex-1 min-w-0",
                    language === 'ar' ? "text-right" : "text-left"
                  )}>
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {connection.account_name}
                    </p>
                    <div className={cn(
                      "flex items-center gap-2 mt-1",
                      language === 'ar' ? "flex-row-reverse" : ""
                    )}>
                      <Badge variant="outline" className={cn(
                        "text-xs",
                        getStatusColor(connection.status)
                      )}>
                        {getStatusText(connection.status)}
                      </Badge>
                      {connection.followers_count && (
                        <span className="text-xs text-gray-500">
                          {formatFollowers(connection.followers_count)} {t.followers}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {t.lastSync}: {formatTimeAgo(connection.last_sync)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div className="pt-4 border-t">
              <Link href="/social">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t.addAccount}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}