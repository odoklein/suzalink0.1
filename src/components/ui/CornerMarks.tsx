import { cn } from "@/lib/cn";

/**
 * Hairline « + » marks pinned to the corners of a band, a draughtsman's
 * detail that frames proof and specs. Decorative; the parent must be relative.
 */
export function CornerMarks({ className }: { className?: string }) {
  const mark = "absolute size-3 before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:-translate-x-1/2 before:bg-ink/25 after:absolute after:left-0 after:top-1/2 after:h-px after:w-full after:-translate-y-1/2 after:bg-ink/25";
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 hidden md:block", className)}>
      <div className="container-site h-full">
        <div className="relative h-full">
          <span className={cn(mark, "-left-1.5 -top-1.5")} />
          <span className={cn(mark, "-right-1.5 -top-1.5")} />
          <span className={cn(mark, "-bottom-1.5 -left-1.5")} />
          <span className={cn(mark, "-bottom-1.5 -right-1.5")} />
        </div>
      </div>
    </div>
  );
}
