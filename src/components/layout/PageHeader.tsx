/**
 * The top of every page: a title, an optional line under it, and the page's main
 * actions at the right.
 *
 *   <PageHeader title="Consultants" description="Everyone on the bench."
 *     actions={<Button><Plus className="size-4" /> Add consultant</Button>} />
 *
 * Exactly one per page, as the first thing inside <PageContainer>.
 */
import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
