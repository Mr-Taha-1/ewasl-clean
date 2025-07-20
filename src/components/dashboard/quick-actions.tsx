"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Calendar, BarChart3 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  gradient: string;
}

interface QuickActionsProps {
  language?: 'ar' | 'en';
}

export function QuickActions({ language = 'ar' }: QuickActionsProps) {
  const actionsData = {
    ar: [
      {
        title: "إنشاء منشور",
        description: "منشور جديد لجميع المنصات",
        icon: PlusCircle,
        href: "/posts/new",
        gradient: "from-indigo-500 to-purple-500"
      },
      {
        title: "جدولة منشور",
        description: "جدولة منشور جديد",
        icon: Calendar,
        href: "/schedule",
        gradient: "from-emerald-500 to-teal-500"
      },
      {
        title: "عرض التحليلات",
        description: "إحصائيات مفصلة",
        icon: BarChart3,
        href: "/analytics",
        gradient: "from-amber-500 to-orange-500"
      }
    ],
    en: [
      {
        title: "Create Post",
        description: "New post for all platforms",
        icon: PlusCircle,
        href: "/posts/new",
        gradient: "from-indigo-500 to-purple-500"
      },
      {
        title: "Schedule Post",
        description: "Schedule a new post",
        icon: Calendar,
        href: "/schedule",
        gradient: "from-emerald-500 to-teal-500"
      },
      {
        title: "View Analytics",
        description: "Detailed statistics",
        icon: BarChart3,
        href: "/analytics",
        gradient: "from-amber-500 to-orange-500"
      }
    ]
  };

  const actions = actionsData[language];
  const sectionTitle = language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions';

  return (
    <div className="mb-8">
      <h3 className={cn(
        "text-2xl font-bold text-gray-900 mb-6",
        language === 'ar' ? "text-right" : "text-left"
      )}>
        {sectionTitle}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <Link key={index} href={action.href}>
            <Card className={cn(
              "group cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50",
              "hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className={cn(
                  "flex items-start gap-4",
                  language === 'ar' ? "flex-row-reverse" : ""
                )}>
                  <div className={cn(
                    "p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-200 bg-gradient-to-r",
                    action.gradient
                  )}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className={cn(
                    "flex-1",
                    language === 'ar' ? "text-right" : "text-left"
                  )}>
                    <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors text-lg">
                      {action.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}