import { Link } from "@/i18n/navigation";
import type { Dictionary } from "@/content/fr";
import type { FlowLabels } from "./LeadFlow";

/** Builds the (serializable) labels for LeadFlow from the dictionary. */
export function flowLabels(d: Dictionary, kind: "demo" | "expert"): FlowLabels {
  const { ui, demo, surMesure } = d;
  const phrase = "politique de confidentialité";
  const at = ui.forms.consent.indexOf(phrase);
  const before = at >= 0 ? ui.forms.consent.slice(0, at) : ui.forms.consent;
  const after = at >= 0 ? ui.forms.consent.slice(at + phrase.length) : "";
  const consentNode = (
    <>
      {before}
      <Link href="/confidentialite" className="underline underline-offset-2 hover:text-ink">
        {phrase}
      </Link>
      {after}
    </>
  );

  const common = {
    teamSizes: ui.forms.teamSizes,
    sending: ui.forms.sending,
    optional: ui.forms.optional,
    choose: ui.forms.choose,
    consent: consentNode,
    personalEmail: ui.forms.personalEmail,
    errors: ui.forms.errors,
    calLoading: ui.cal.loading,
    calMissing: ui.cal.missing,
  };

  if (kind === "demo") {
    return {
      ...common,
      fields: demo.form.fields,
      placeholders: { tools: demo.form.fields.toolsPlaceholder },
      options: {},
      submit: demo.form.submit,
      slotTitle: demo.slot.title,
      slotSub: demo.slot.sub,
      doneTitle: demo.done.title,
      doneBody: demo.done.body,
      prepareTitle: demo.done.prepareTitle,
      prepare: demo.done.prepare,
    };
  }

  const f = surMesure.form.fields;
  return {
    ...common,
    fields: Object.fromEntries(Object.entries(f).filter(([, v]) => typeof v === "string")) as Record<string, string>,
    placeholders: { sector: f.sectorPlaceholder, region: f.regionPlaceholder },
    options: { meetings: f.meetingsOptions, companySize: f.companySizeOptions, deadline: f.deadlineOptions },
    submit: surMesure.form.submit,
    slotTitle: surMesure.form.slotTitle,
    slotSub: surMesure.form.slotSub,
    doneTitle: surMesure.form.doneTitle,
    doneBody: surMesure.form.doneBody,
  };
}
