"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  changeType?: "increase" | "decrease" | "neutral";
  icon?: LucideIcon;
  iconColor?: string;
  description?: string;
  trend?: number[];
  className?: string;
  isLoading?: boolean;
}

export function MetricsCard({
  title,
  value,
  unit,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-ocean-600",
  description,
  className,
  isLoading = false,
}: MetricsCardProps) {
  const getTrendIcon = () => {
    switch (changeType) {
      case "increase":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "decrease":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case "increase":
        return "text-green-500";
      case "decrease":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <Card className={cn("relative overflow-hidden", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-8 w-8 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-20 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-3 w-32 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <div className={cn("rounded-md bg-muted p-2", iconColor)}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        {(change !== undefined || description) && (
          <div className="mt-1 flex items-center gap-1 text-xs">
            {change !== undefined && (
              <>
                {getTrendIcon()}
                <span className={getChangeColor()}>
                  {change > 0 ? "+" : ""}
                  {change.toFixed(1)}%
                </span>
              </>
            )}
            {description && (
              <span className="text-muted-foreground">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
