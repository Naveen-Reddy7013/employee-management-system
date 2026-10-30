/**
 * The width and spacing of a page's content. Wrap each page in it:
 *
 *   <PageContainer>
 *     <PageHeader title="..." />
 *     <Section title="...">...</Section>
 *   </PageContainer>
 *
 * It centres the content, limits its width, and puts even space between its parts.
 */
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-6xl space-y-8 px-4 py-6 sm:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
