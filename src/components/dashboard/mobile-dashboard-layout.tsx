"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ChevronDown, 
  ChevronUp, 
  BarChart3, 
  Users, 
  MessageSquare,
  Calendar,
  Activity,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileDashboardLayoutProps {
  children: React.ReactNode;
  language?: 'ar' | 'en';
  className?: string;
}

interface CollapsibleSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  isOpen: boolean;
  priority: 'high' | 'medium' | 'low';
}

export function MobileDashboardLayout({
  children,
  language = 'ar',
  className
}: MobileDashboardLayoutProps) {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [sections, setSections] = useState<CollapsibleSection[]>([
    { id: 'stats', title: language === 'ar' ? 'الإحصائيات' : 'Statistics', icon: BarChart3, isOpen: true, priority: 'high' },
    { id: 'activity', title: language === 'ar' ? 'النشاط' : 'Activity', icon: Activity, isOpen: false, priority: 'high' },
    { id: 'social', title: language === 'ar' ? 'الحسابات الاجتماعية' : 'Social Accounts', icon: Users, isOpen: false, priority: 'medium' },
    { id: 'queue', title: language === 'ar' ? 'قائمة الانتظار' : 'Queue Status', icon: MessageSquare, isOpen: false, priority: 'medium' },
    { id: 'analytics', title: language === 'ar' ? 'التحليلات المتقدمة' : 'Advanced Analytics', icon: BarChart3, isOpen: false, priority: 'low' }
  ]);

  // Detect device type
  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  // Auto-collapse low priority sections on mobile
  useEffect(() => {
    if (deviceType === 'mobile') {
      setSections(prev => prev.map(section => ({
        ...section,
        isOpen: section.priority === 'high'
      })));
    } else if (deviceType === 'tablet') {
      setSections(prev => prev.map(section => ({
        ...section,
        isOpen: section.priority !== 'low'
      })));
    } else {
      setSections(prev => prev.map(section => ({
        ...section,
        isOpen: true
      })));
    }
  }, [deviceType]);

  const toggleSection = (sectionId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, isOpen: !section.isOpen }
        : section
    ));
  };

  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
      default: return Monitor;
    }
  };

  const DeviceIcon = getDeviceIcon();

  // Mobile-specific layout
  if (deviceType === 'mobile') {
    return (
      <div className={cn(
        "min-h-screen bg-gray-50 p-4 space-y-4",
        language === 'ar' ? "rtl" : "ltr",
        className
      )}>
        {/* Mobile Header */}
        <Card className="sticky top-4 z-10 bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className={cn(
              "flex items-center justify-between",
              language === 'ar' ? "flex-row-reverse" : ""
            )}>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <DeviceIcon className="h-5 w-5 text-blue-600" />
                {language === 'ar' ? 'لوحة التحكم المحمولة' : 'Mobile Dashboard'}
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {deviceType}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Collapsible Sections */}
        <div className="space-y-3">
          {sections.map((section) => (
            <Collapsible
              key={section.id}
              open={section.isOpen}
              onOpenChange={() => toggleSection(section.id)}
            >
              <CollapsibleTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className={cn(
                      "flex items-center justify-between",
                      language === 'ar' ? "flex-row-reverse" : ""
                    )}>
                      <div className={cn(
                        "flex items-center gap-3",
                        language === 'ar' ? "flex-row-reverse" : ""
                      )}>
                        <section.icon className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold">{section.title}</span>
                        <Badge 
                          variant={section.priority === 'high' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {section.priority}
                        </Badge>
                      </div>
                      {section.isOpen ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                  </CardHeader>
                </Card>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-2">
                <Card>
                  <CardContent className="p-4">
                    {/* Section content will be rendered here */}
                    <div className="text-center text-gray-500 py-8">
                      {language === 'ar' ? 'محتوى القسم' : 'Section Content'}
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        {/* Mobile-specific children rendering */}
        <div className="space-y-4">
          {children}
        </div>
      </div>
    );
  }

  // Tablet layout
  if (deviceType === 'tablet') {
    return (
      <div className={cn(
        "min-h-screen bg-gray-50 p-6",
        language === 'ar' ? "rtl" : "ltr",
        className
      )}>
        {/* Tablet Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className={cn(
              "flex items-center justify-between",
              language === 'ar' ? "flex-row-reverse" : ""
            )}>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <DeviceIcon className="h-6 w-6 text-blue-600" />
                {language === 'ar' ? 'لوحة التحكم للأجهزة اللوحية' : 'Tablet Dashboard'}
              </CardTitle>
              <Badge variant="outline">
                {deviceType}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Two-column layout for tablet */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* High priority sections */}
          <div className="space-y-6">
            {sections
              .filter(section => section.priority === 'high')
              .map((section) => (
                <Card key={section.id}>
                  <CardHeader>
                    <CardTitle className={cn(
                      "flex items-center gap-2",
                      language === 'ar' ? "flex-row-reverse" : ""
                    )}>
                      <section.icon className="h-5 w-5 text-blue-600" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center text-gray-500 py-4">
                      {language === 'ar' ? 'محتوى القسم' : 'Section Content'}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Medium priority sections */}
          <div className="space-y-6">
            {sections
              .filter(section => section.priority === 'medium')
              .map((section) => (
                <Card key={section.id}>
                  <CardHeader>
                    <CardTitle className={cn(
                      "flex items-center gap-2",
                      language === 'ar' ? "flex-row-reverse" : ""
                    )}>
                      <section.icon className="h-5 w-5 text-blue-600" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center text-gray-500 py-4">
                      {language === 'ar' ? 'محتوى القسم' : 'Section Content'}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Children for tablet */}
        <div className="mt-6">
          {children}
        </div>
      </div>
    );
  }

  // Desktop layout (default)
  return (
    <div className={cn(
      "min-h-screen bg-gray-50",
      language === 'ar' ? "rtl" : "ltr",
      className
    )}>
      {/* Desktop Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className={cn(
            "flex items-center justify-between",
            language === 'ar' ? "flex-row-reverse" : ""
          )}>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <DeviceIcon className="h-6 w-6 text-blue-600" />
              {language === 'ar' ? 'لوحة التحكم المكتبية' : 'Desktop Dashboard'}
            </CardTitle>
            <Badge variant="outline">
              {deviceType}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Full desktop layout */}
      {children}
    </div>
  );
}