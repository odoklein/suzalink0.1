"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { CONSENT_OPEN_EVENT, readConsent, writeConsent } from "@/lib/consent";
import { buttonClass } from "../ui/Button";

type Labels = {
  title: string;
  body: string;
  accept: string;
  refuse: string;
  customize: string;
  save: string;
  policy: string;
  categories: Record<"necessary" | "analytics" | "marketing", { title: string; body: string }>;
};

export function ConsentBanner({ labels }: { labels: Labels }) {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const show = () => {
      const current = readConsent();
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      setOpen(true);
    };
    const onOpen = () => {
      show();
      setDetails(true);
    };
    // Reading a cookie is a browser-only side effect, so the check waits for mount.
    if (!readConsent()) show();
    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-consent-open", open);
  }, [open]);

  if (!open) return null;

  const decide = (choice: { analytics: boolean; marketing: boolean }) => {
    writeConsent(choice);
    setOpen(false);
    setDetails(false);
  };

  // Accept and refuse carry the same visual weight.
  const choiceCls = buttonClass("secondary", "md", "flex-1 sm:flex-none");

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-[20px] bg-white p-5 shadow-[var(--shadow-lift)] ring-1 ring-line sm:inset-x-auto sm:left-6 sm:right-auto sm:max-w-md"
    >
      <p id="consent-title" className="font-sans text-lg font-bold text-ink">
        {labels.title}
      </p>
      <p className="mt-2 text-sm text-muted">
        {labels.body}{" "}
        <Link href="/cookies" className="font-medium text-ink underline underline-offset-2">
          {labels.policy}
        </Link>
      </p>

      {details ? (
        <fieldset className="mt-4 space-y-3 border-t border-line pt-4">
          <legend className="sr-only">{labels.customize}</legend>
          <Toggle title={labels.categories.necessary.title} body={labels.categories.necessary.body} checked disabled />
          <Toggle title={labels.categories.analytics.title} body={labels.categories.analytics.body} checked={analytics} onChange={setAnalytics} />
          <Toggle title={labels.categories.marketing.title} body={labels.categories.marketing.body} checked={marketing} onChange={setMarketing} />
        </fieldset>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button type="button" className={choiceCls} onClick={() => decide({ analytics: false, marketing: false })}>
          {labels.refuse}
        </button>
        <button type="button" className={choiceCls} onClick={() => decide({ analytics: true, marketing: true })}>
          {labels.accept}
        </button>
        {details ? (
          <button type="button" className={buttonClass("ghost", "md", "w-full sm:w-auto")} onClick={() => decide({ analytics, marketing })}>
            {labels.save}
          </button>
        ) : (
          <button type="button" className="ml-auto text-sm font-medium text-muted underline underline-offset-2 hover:text-ink" onClick={() => setDetails(true)}>
            {labels.customize}
          </button>
        )}
      </div>
    </div>
  );
}

function Toggle({
  title,
  body,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  body: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label className={cn("flex items-start justify-between gap-4", disabled ? "cursor-default" : "cursor-pointer")}>
      <span>
        <span className="block text-sm font-semibold text-ink">{title}</span>
        <span className="block text-xs text-muted">{body}</span>
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "relative mt-0.5 inline-flex h-6 w-10 shrink-0 rounded-full transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
          checked ? "bg-accent" : "bg-line-strong",
          disabled && "opacity-60",
        )}
      >
        <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform duration-200", checked ? "translate-x-[18px]" : "translate-x-0.5")} />
      </span>
    </label>
  );
}
