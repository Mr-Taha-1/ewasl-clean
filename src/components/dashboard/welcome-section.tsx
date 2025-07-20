"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface WelcomeSectionProps {
  userName?: string;
  language?: 'ar' | 'en';
}

export function WelcomeSection({
  userName = "المستخدم",
  language = 'ar'
}: WelcomeSectionProps) {
  const welcomeText = {
    ar: {
      greeting: `مرحباً يا ${userName}!`,
      subtitle: 'إليك نظرة سريعة على أداء حساباتك اليوم',
      buttonText: 'إنشاء منشور جديد'
    },
    en: {
      greeting: `Welcome ${userName}!`,
      subtitle: 'Here\'s a quick overview of your accounts performance today',
      buttonText: 'Create New Post'
    }
  };

  const text = welcomeText[language];

  return (
    <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
      <CardContent className="p-8">
        <div className={cn(
          "flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6",
          language === 'ar' ? "lg:flex-row-reverse" : ""
        )}>
          <div className={cn(
            "flex items-center gap-4",
            language === 'ar' ? "flex-row-reverse" : ""
          )}>
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">👋</span>
            </div>
            <div className={cn(
              language === 'ar' ? "text-right" : "text-left"
            )}>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {text.greeting}
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                {text.subtitle}
              </p>
            </div>
          </div>

          <Link href="/posts/new">
            <Button
              size="lg"
              className={cn(
                "shadow-lg hover:shadow-xl transition-all duration-200",
                language === 'ar' ? "flex-row-reverse" : ""
              )}
            >
              <PlusCircle className={cn(
                "h-5 w-5",
                language === 'ar' ? "mr-2" : "ml-2"
              )} />
              {text.buttonText}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}