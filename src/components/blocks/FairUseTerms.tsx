import { dict } from "@/content";

/** The telephony fair-use terms, from the same content as /tarifs (used inside the CGV). */
export async function FairUseTerms() {
  const { pricing } = await dict();
  return (
    <ul className="mt-4 list-disc space-y-2 pl-6 text-ink-soft marker:text-accent">
      {pricing.fairUse.items.map((item) => (
        <li key={item} className="pl-1">
          {item}
        </li>
      ))}
    </ul>
  );
}
