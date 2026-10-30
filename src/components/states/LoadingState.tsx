/**
 * What to show while data loads. Pick the shape that matches what will appear:
 *
 *   <LoadingState variant="cards" />   a grid of cards
 *   <LoadingState variant="list" />    rows with an avatar and two lines
 *   <LoadingState variant="table" />   a table's rows
 */
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState({
  variant = "list",
  count = 4,
}: {
  variant?: "list" | "cards" | "table";
  count?: number;
}) {
  const rows = Array.from({ length: count }, (_, i) => i);
  return (
    <div role="status" aria-busy="true" aria-label="Loading">
      {variant === "cards" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((i) => (
            <div key={i} className="space-y-3 rounded-lg border p-5">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ))}
        </div>
      ) : variant === "table" ? (
        <div className="space-y-2 rounded-lg border p-4">
          <Skeleton className="h-8 w-full" />
          {rows.map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-lg border p-4"
            >
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
