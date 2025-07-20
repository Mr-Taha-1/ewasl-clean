import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  className?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "purple" | "orange" | "red";
  language?: 'ar' | 'en';
  iconColor?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  className,
  trend,
  color = "blue",
  language = 'ar',
  iconColor,
  change,
  changeType,
}: StatsCardProps) {
  const colorClasses = {
    blue: {
      card: "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50 hover:shadow-blue-100/50",
      icon: "bg-blue-100 text-blue-600",
      trend: trend?.isPositive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
    },
    green: {
      card: "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200/50 hover:shadow-emerald-100/50",
      icon: "bg-emerald-100 text-emerald-600",
      trend: trend?.isPositive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
    },
    purple: {
      card: "bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/50 hover:shadow-purple-100/50",
      icon: "bg-purple-100 text-purple-600",
      trend: trend?.isPositive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
    },
    orange: {
      card: "bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200/50 hover:shadow-orange-100/50",
      icon: "bg-orange-100 text-orange-600",
      trend: trend?.isPositive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
    },
    red: {
      card: "bg-gradient-to-br from-red-50 to-red-100/50 border-red-200/50 hover:shadow-red-100/50",
      icon: "bg-red-100 text-red-600",
      trend: trend?.isPositive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
    },
  };

  const styles = colorClasses[color];

  return (
    <Card className={cn(
      "relative overflow-hidden border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
      styles.card,
      className
    )}>
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
      <CardHeader className={cn(
        "relative flex items-center justify-between pb-2",
        language === 'ar' ? "flex-row-reverse" : "flex-row"
      )}>
        <CardTitle className={cn(
          "text-sm font-semibold text-gray-700",
          language === 'ar' ? "text-right" : "text-left"
        )}>
          {title}
        </CardTitle>
        <div className={cn(
          "p-3 rounded-xl shadow-sm",
          iconColor || styles.icon
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="relative pt-0">
        <div className={cn(
          "flex items-baseline justify-between",
          language === 'ar' ? "flex-row-reverse" : ""
        )}>
          <div className={cn(
            "text-3xl font-bold text-gray-900 tracking-tight",
            language === 'ar' ? "text-right" : "text-left"
          )}>
            {value}
          </div>
          {(trend || change) && (
            <div className={cn(
              "flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full",
              trend ? styles.trend : (
                changeType === 'positive' ? "bg-emerald-100 text-emerald-700" :
                changeType === 'negative' ? "bg-red-100 text-red-700" :
                "bg-gray-100 text-gray-700"
              )
            )}>
              {trend ? (
                trend.isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )
              ) : (
                changeType === 'positive' ? '↗' :
                changeType === 'negative' ? '↘' : ''
              )}
              {trend ? `${trend.value}%` : change}
            </div>
          )}
        </div>
        {description && (
          <p className={cn(
            "text-sm text-gray-600 mt-2 leading-relaxed",
            language === 'ar' ? "text-right" : "text-left"
          )}>
            {description}
          </p>
        )}

        {/* Progress bar for visual enhancement */}
        {changeType && (
          <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
            <div
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                changeType === 'positive' ? "bg-emerald-500" :
                changeType === 'negative' ? "bg-red-500" : "bg-gray-400"
              )}
              style={{
                width: changeType === 'positive' ? '75%' :
                       changeType === 'negative' ? '45%' : '60%'
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}