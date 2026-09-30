"use client";

import { CalendarCheck, Check } from "lucide-react";
import { useCallback, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { submitDemoLead, submitExpertLead } from "@/app/actions/leads";
import { track } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";
import { isPersonalEmail, TEAM_SIZES, type LeadResult } from "@/lib/leads";
import { buttonClass } from "../ui/Button";
import { CalEmbed } from "./CalEmbed";
import { FormError, SelectField, TextField } from "./Fields";
import { Turnstile } from "./Turnstile";

export type FlowLabels = {
  fields: Record<string, string>;
  placeholders: Record<string, string>;
  teamSizes: { value: string; label: string }[];
  options: Record<string, string[]>;
  submit: string;
  sending: string;
  optional: string;
  choose: string;
  consent: ReactNode;
  personalEmail: string;
  errors: { generic: string; rateLimited: string; captcha: string; email: string; required: string; phone: string };
  slotTitle: string;
  slotSub: string;
  calLoading: string;
  calMissing: string;
  doneTitle: string;
  doneBody: string;
  prepareTitle?: string;
  prepare?: string[];
};

type Step = { name: "form" } | { name: "slot"; leadId: string; fullName: string; email: string } | { name: "done"; booked: boolean };

/**
 * Form, then the Cal.com slot, then a confirmation. `kind` picks the fields:
 * the demo form (/demo) or the Sur-mesure brief (/sur-mesure).
 */
export function LeadFlow({ kind, labels, calLink }: { kind: "demo" | "expert"; labels: FlowLabels; calLink: string }) {
  const [step, setStep] = useState<Step>({ name: "form" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [emailWarning, setEmailWarning] = useState(false);
  const [token, setToken] = useState<string>();
  const [pending, startTransition] = useTransition();
  const onToken = useCallback((t: string) => setToken(t), []);

  const errorText = (code: string) =>
    code === "email" ? labels.errors.email : code === "phone" ? labels.errors.phone : labels.errors.required;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const payload = { ...data, attribution: getAttribution(), turnstileToken: token, sourcePage: location.pathname };
    setFormError(null);
    startTransition(async () => {
      let result: LeadResult;
      try {
        result = kind === "demo" ? await submitDemoLead(payload) : await submitExpertLead(payload);
      } catch {
        result = { ok: false, error: "server" };
      }
      if (!result.ok) {
        if (result.error === "validation") {
          setErrors(Object.fromEntries(Object.entries(result.fields ?? {}).map(([k, v]) => [k, errorText(v)])));
        } else {
          setFormError(
            result.error === "rate_limited" ? labels.errors.rateLimited : result.error === "captcha" ? labels.errors.captcha : labels.errors.generic,
          );
        }
        return;
      }
      setErrors({});
      track(kind === "demo" ? "demo_form_submitted" : "expert_form_submitted", { team_size: data.teamSize, source_page: location.pathname });
      if (!calLink) {
        setStep({ name: "done", booked: false });
        return;
      }
      setStep({ name: "slot", leadId: result.leadId, fullName: `${data.firstName} ${data.lastName}`.trim(), email: data.email });
    });
  };

  if (step.name === "slot") {
    return (
      <div>
        <p className="flex items-center gap-2 font-display text-xl font-normal text-ink">
          <CalendarCheck aria-hidden className="size-5 text-accent" />
          {labels.slotTitle}
        </p>
        <p className="mt-1 text-sm text-muted">{labels.slotSub}</p>
        <div className="mt-6">
          <CalEmbed
            calLink={calLink}
            name={step.fullName}
            email={step.email}
            leadId={step.leadId}
            loadingLabel={labels.calLoading}
            onBooked={() => {
              track(kind === "demo" ? "demo_booked" : "expert_booked", { source_page: location.pathname });
              setStep({ name: "done", booked: true });
            }}
          />
        </div>
      </div>
    );
  }

  if (step.name === "done") {
    return (
      <div role="status" className="rounded-[20px] bg-success-tint p-8 ring-1 ring-success/20">
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-success text-white">
          <Check aria-hidden className="size-5" strokeWidth={3} />
        </span>
        <p className="mt-5 font-display text-2xl font-normal text-ink">{labels.doneTitle}</p>
        <p className="mt-2 text-ink-soft">{step.booked ? labels.doneBody : labels.calMissing}</p>
        {labels.prepare?.length ? (
          <div className="mt-8 rounded-[16px] bg-white p-6 ring-1 ring-line">
            <p className="font-semibold text-ink">{labels.prepareTitle}</p>
            <ul className="mt-3 space-y-2">
              {labels.prepare.map((item) => (
                <li key={item} className="flex gap-2.5 text-ink-soft">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    );
  }

  const f = labels.fields;
  const common = (name: string) => ({ name, error: errors[name], required: true });
  const choice = (name: string) => ({ ...common(name), placeholder: labels.choose });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {kind === "expert" ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField label={f.meetings} {...choice("meetingsPerMonth")} options={labels.options.meetings.map((o) => ({ value: o, label: o }))} />
          <SelectField label={f.companySize} {...choice("companySize")} options={labels.options.companySize.map((o) => ({ value: o, label: o }))} />
          <TextField label={f.sector} {...common("sector")} placeholder={labels.placeholders.sector} className="sm:col-span-2" />
          <TextField label={f.region} {...common("region")} placeholder={labels.placeholders.region} />
          <SelectField label={f.deadline} {...choice("deadline")} options={labels.options.deadline.map((o) => ({ value: o, label: o }))} />
        </div>
      ) : null}

      <TextField
        label={f.email}
        {...common("email")}
        type="email"
        autoComplete="email"
        inputMode="email"
        hint={emailWarning ? labels.personalEmail : undefined}
        onBlur={(e) => setEmailWarning(isPersonalEmail(e.currentTarget.value))}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label={f.firstName} {...common("firstName")} autoComplete="given-name" />
        <TextField label={f.lastName} {...common("lastName")} autoComplete="family-name" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label={f.company} {...common("company")} autoComplete="organization" />
        <TextField label={f.phone} {...common("phone")} type="tel" autoComplete="tel" inputMode="tel" />
      </div>
      {kind === "demo" ? (
        <>
          <SelectField
            label={f.teamSize}
            {...choice("teamSize")}
            options={labels.teamSizes.filter((t) => (TEAM_SIZES as readonly string[]).includes(t.value))}
          />
          <TextField label={f.tools} name="tools" error={errors.tools} optionalLabel={labels.optional} placeholder={labels.placeholders.tools} />
        </>
      ) : null}

      <Turnstile onToken={onToken} />
      {formError ? <FormError>{formError}</FormError> : null}

      <button type="submit" disabled={pending} className={buttonClass("primary", "lg", "w-full")}>
        {pending ? labels.sending : labels.submit}
      </button>
      <p className="text-xs leading-5 text-muted">{labels.consent}</p>
    </form>
  );
}
