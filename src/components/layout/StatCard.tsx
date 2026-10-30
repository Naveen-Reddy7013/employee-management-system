/**
 * One headline number: a label, a big value, an optional note, an optional icon, and an optional trend.
 * Put them in a grid at the top of a dashboard.
 *
 *   <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
 *     <StatCard label="Active consultants" value="42" hint="+3 this week" icon={Users} />
 *   </div>
 */
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  trend?: { value: string; direction: 'up' | 'down' };
}) {
  return (
    <Card>
      <CardContent className="space-y-2 p-5">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{label}</span>
          {Icon ? <Icon className="size-4" /> : null}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-semibold tracking-tight">{value}</div>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium",
              trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
            )}>
              {trend.direction === 'up' ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {trend.value}
            </div>
          )}
        </div>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
