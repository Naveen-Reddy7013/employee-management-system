/**
 * One headline number: a label, a big value, an optional note, an optional icon.
 * Put them in a grid at the top of a dashboard.
 *
 *   <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
 *     <StatCard label="Active consultants" value="42" hint="+3 this week" icon={Users} />
 *   </div>
 */
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
}) {
  return (
    <Card>
      <CardContent className="space-y-2 p-5">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{label}</span>
          {Icon ? <Icon className="size-4" /> : null}
        </div>
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
