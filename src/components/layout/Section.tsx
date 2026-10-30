/**
 * A titled part of a page, such as "Recent activity". Use one per group of related
 * content, inside <PageContainer>.
 *
 *   <Section title="Recent activity" description="The last 7 days.">...</Section>
 */
import type { ReactNode } from "react";

export function Section({
  title,
  description,
  actions,
  children,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      {title || actions ? (
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            {title ? (
              <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
            ) : null}
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex items-center gap-2">{actions}</div>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
