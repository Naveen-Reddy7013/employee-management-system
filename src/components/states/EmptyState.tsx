/**
 * What to show when a list, table or screen has nothing in it yet. Every list needs
 * one, with a sentence that says what to do next and the button that does it.
 *
 *   <EmptyState icon={Users} title="No consultants yet"
 *     description="Add your first consultant to get started."
 *     action={<Button><Plus className="size-4" /> Add consultant</Button>} />
 */
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: LucideIcon | ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  // Determine if icon is a component reference (has $$typeof) or a React element
  const isLucideIcon = Icon && typeof Icon === 'function' && !('$$typeof' in Icon);

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-14 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
        {isLucideIcon ? (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (Icon as LucideIcon)({ className: "size-6 text-muted-foreground" } as any)
        ) : (
          // It's a React element (SVG component)
          <div className="flex size-12 items-center justify-center text-muted-foreground">
            {Icon as ReactNode}
          </div>
        )}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
