"use client";

import { useId, useState } from "react";
import { ArrowRight, Check, Sparkles, TrendingDown, Users, Zap } from "lucide-react";
import { CtaLink } from "../ui/CtaLink";
import { H2, Lead, Section, SectionHeader } from "../ui/Section";

export function StackSavingsComparator() {
  const [reps, setReps] = useState(3);
  const sliderId = useId();

  // Stack Morcelé breakdown per rep / mo
  const hubspot = 120;
  const aircall = 45;
  const modjo = 100;
  const lemlist = 60;
  const zapier = 30; // flat
  const stackPerRepMonthly = hubspot + aircall + modjo + lemlist;
  const stackTotalMonthly = reps * stackPerRepMonthly + zapier;
  const stackTotalAnnual = stackTotalMonthly * 12;

  // Suzalink calculation (based on new pricing strategy)
  // 1 rep: Indépendant = 59€/mo (annuel)
  // 2-7 reps: Small Business = 189€ (includes 3) + extra 49€/rep
  // 8+ reps: Medium Business = 419€ (includes 8) + extra 39€/rep
  let suzalinkMonthly = 0;
  let planName = "";
  if (reps === 1) {
    suzalinkMonthly = 59;
    planName = "Pack Indépendant";
  } else if (reps <= 7) {
    const extraSeats = Math.max(0, reps - 3);
    suzalinkMonthly = 189 + extraSeats * 49;
    planName = "Pack Small Business";
  } else {
    const extraSeats = Math.max(0, reps - 8);
    suzalinkMonthly = 419 + extraSeats * 39;
    planName = "Pack Medium Business";
  }

  const suzalinkAnnual = suzalinkMonthly * 12;
  const monthlySavings = stackTotalMonthly - suzalinkMonthly;
  const annualSavings = stackTotalAnnual - suzalinkAnnual;
  const percentageSaved = Math.round((monthlySavings / stackTotalMonthly) * 100);

  return (
    <Section tone="default" aria-labelledby="savings-comparator-title" className="relative overflow-hidden py-16 md:py-24">
      {/* Subtle background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/2 -z-10 size-[500px] -translate-y-1/2 rounded-full bg-accent/5 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/3 -z-10 size-[500px] rounded-full bg-coral/5 blur-[120px]"
      />

      <div className="mx-auto max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-semibold text-accent md:text-sm">
          <Sparkles className="size-3.5" />
          <span>Simulateur d&apos;Économies Outbound</span>
        </div>
        <H2 id="savings-comparator-title" className="mt-4">
          Le Choc des Modèles : <span className="text-dawn">Divisez votre facture par 4</span>
        </H2>
        <Lead className="mx-auto mt-4 max-w-2xl text-muted">
          Comparez en direct le coût d&apos;un stack morcelé (HubSpot + Aircall + Modjo + Lemlist) avec l&apos;architecture tout-en-un Suzalink.
        </Lead>

        {/* Interactive Slider */}
        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-line bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor={sliderId} className="flex items-center gap-2 text-sm font-semibold text-ink md:text-base">
              <Users className="size-5 text-accent" />
              <span>Taille de votre équipe commerciale :</span>
            </label>
            <span className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-1.5 font-display text-lg font-bold text-white shadow-sm">
              {reps} {reps > 1 ? "commerciaux" : "commercial"}
            </span>
          </div>

          <div className="mt-6">
            <input
              id={sliderId}
              type="range"
              min={1}
              max={15}
              step={1}
              value={reps}
              onChange={(e) => setReps(Number(e.target.value))}
              className="h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-surface-sunken accent-accent outline-none ring-1 ring-line transition-all"
            />
            <div className="mt-2 flex justify-between text-xs text-muted">
              <span>1 commercial (Solo)</span>
              <span>7 commerciaux (PME)</span>
              <span>15+ commerciaux (Agence)</span>
            </div>
          </div>
        </div>

        {/* Comparison Cards Grid */}
        <div className="mt-10 grid gap-8 text-left md:grid-cols-2">
          {/* Traditional Stack */}
          <div className="relative flex flex-col justify-between rounded-3xl border border-line bg-white p-7 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-coral-soft px-3 py-1 text-xs font-semibold text-coral-ink">
                  Stack Morcelé Traditionnel
                </span>
                <span className="text-xs font-medium text-muted">5 abonnements séparés</span>
              </div>

              <div className="mt-6">
                <div className="font-display text-4xl font-bold tracking-tight text-ink">
                  {stackTotalMonthly.toLocaleString("fr-FR")} €{" "}
                  <span className="text-sm font-normal text-muted">/ mois HT</span>
                </div>
                <div className="mt-1 text-xs text-muted">
                  soit {stackTotalAnnual.toLocaleString("fr-FR")} € HT par an
                </div>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-ink-soft">
                <li className="flex items-center justify-between border-b border-line pb-2">
                  <span>CRM classique (HubSpot / Salesforce)</span>
                  <span className="font-medium text-ink">{(reps * hubspot).toLocaleString("fr-FR")} €</span>
                </li>
                <li className="flex items-center justify-between border-b border-line pb-2">
                  <span>VoIP & Téléphonie (Aircall / Ringover)</span>
                  <span className="font-medium text-ink">{(reps * aircall).toLocaleString("fr-FR")} €</span>
                </li>
                <li className="flex items-center justify-between border-b border-line pb-2">
                  <span>Analyse & Transcription (Modjo / Gong)</span>
                  <span className="font-medium text-ink">{(reps * modjo).toLocaleString("fr-FR")} €</span>
                </li>
                <li className="flex items-center justify-between border-b border-line pb-2">
                  <span>Séquençage email (Lemlist / Instantly)</span>
                  <span className="font-medium text-ink">{(reps * lemlist).toLocaleString("fr-FR")} €</span>
                </li>
                <li className="flex items-center justify-between pt-1">
                  <span>Connecteurs & Webhooks (Zapier / Make)</span>
                  <span className="font-medium text-ink">{zapier} €</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 rounded-xl bg-surface-sunken p-4 text-xs leading-relaxed text-muted">
              ⚠️ Synchronisations fragiles, commerciaux qui jonglent entre 5 onglets et perte d&apos;informations critique au handover.
            </div>
          </div>

          {/* Suzalink All-In-One */}
          <div className="relative flex flex-col justify-between rounded-3xl border-2 border-accent bg-[linear-gradient(175deg,#fcfdff_0%,#f0f4ff_100%)] p-7 shadow-lg">
            <div className="absolute -top-3.5 right-6 rounded-full bg-accent px-4 py-1 text-xs font-bold text-white shadow-sm">
              ÉCONOMISEZ {percentageSaved} %
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-mint-soft px-3 py-1 text-xs font-semibold text-mint-ink">
                  Suzalink Tout-en-Un ({planName})
                </span>
                <span className="text-xs font-bold text-accent">1 seule console unifiée</span>
              </div>

              <div className="mt-6">
                <div className="font-display text-4xl font-bold tracking-tight text-accent">
                  {suzalinkMonthly.toLocaleString("fr-FR")} €{" "}
                  <span className="text-sm font-normal text-muted">/ mois HT</span>
                </div>
                <div className="mt-1 text-xs font-medium text-mint-ink">
                  soit {suzalinkAnnual.toLocaleString("fr-FR")} € HT par an (facturé à l&apos;année)
                </div>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-ink-soft">
                <li className="flex items-center gap-2 border-b border-accent/15 pb-2">
                  <Check className="size-4 shrink-0 text-mint" strokeWidth={3} />
                  <span>CRM Outbound & File d&apos;appels 1-clic native</span>
                </li>
                <li className="flex items-center gap-2 border-b border-accent/15 pb-2">
                  <Check className="size-4 shrink-0 text-mint" strokeWidth={3} />
                  <span>Lignes Allo &amp; OnOff connectées (0 € de surcoût)</span>
                </li>
                <li className="flex items-center gap-2 border-b border-accent/15 pb-2">
                  <Check className="size-4 shrink-0 text-mint" strokeWidth={3} />
                  <span>Call Vault : Stockage audio S3 privé inclus</span>
                </li>
                <li className="flex items-center gap-2 border-b border-accent/15 pb-2">
                  <Check className="size-4 shrink-0 text-mint" strokeWidth={3} />
                  <span>Fiches de RDV générées par Mistral AI (10 secondes)</span>
                </li>
                <li className="flex items-center gap-2 pt-1">
                  <Check className="size-4 shrink-0 text-mint" strokeWidth={3} />
                  <span>Instance Single-Tenant &amp; PostgreSQL privé</span>
                </li>
              </ul>
            </div>

            {/* Savings Banner */}
            <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-accent/20">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">Économie nette réalisée :</span>
                  <div className="font-display text-2xl font-bold text-mint-ink">
                    +{annualSavings.toLocaleString("fr-FR")} € <span className="text-sm font-normal text-muted">/ an</span>
                  </div>
                </div>
                <div className="rounded-full bg-mint-soft p-3 text-mint-ink">
                  <TrendingDown className="size-6" />
                </div>
              </div>

              <div className="mt-4">
                <CtaLink
                  cta={{ kind: "trial" }}
                  label="Arrêter de surpayer : Essai gratuit 14j"
                  section="stack_comparator"
                  size="md"
                  className="w-full text-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
