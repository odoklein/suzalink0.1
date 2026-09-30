import { cn } from "@/lib/cn";

/**
 * Customer logos. Written approval to show them is still pending (PRD open
 * question), so names are set as neutral wordmarks until the files and the OK
 * arrive: then drop them in public/logos/customers and render <Image>s here.
 */
export function LogoBar({ names, className }: { names: string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-10 gap-y-4", className)}>
      {names.map((name) => (
        <li key={name} className="font-sans text-xl font-bold tracking-[-0.02em] text-ink/45">
          {name}
        </li>
      ))}
    </ul>
  );
}
