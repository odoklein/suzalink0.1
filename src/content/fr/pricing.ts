import type { PlanId } from "@/config/pricing.config";
import { claimed } from "../helpers";
import type { Faq, Meta, Text } from "../types";

/** Labels only. Every figure on /tarifs is read from pricing.config.ts. */
export const pricing = {
  meta: {
    title: "Tarifs : des formules simples, tous les modules inclus",
    description:
      "Solo {{solo.monthly}}, Équipe {{equipe.monthly}}, Agence {{agence.monthly}} HT par mois. Tous les modules dans chaque formule, sans engagement ou {{annual.discount}} à l'année. Essai gratuit de {{trial.days}} jours.",
  } satisfies Meta,

  header: {
    title: "Des tarifs simples. Tous les modules inclus.",
    sub: "Choisissez selon la taille de votre équipe. Changez de formule quand vous voulez.",
    monthly: "Mensuel",
    annual: "Annuel",
    toggleLabel: "Période de facturation",
  },

  plans: {
    solo: {
      for: "Pour les directeurs commerciaux solo",
      support: "Centre d'aide et chat, réponse sous 48 h",
      start: "Essai de {{trial.days}} jours, sans carte",
      extraSeat: "non disponible, passez en Équipe",
      maxUsers: "1",
    },
    equipe: {
      for: "Pour les équipes de 2 à 10",
      support: "Onboarding guidé de 45 min, support prioritaire sous 24 h",
      start: "Démo à l'inscription, puis essai accompagné de {{trial.days}} jours",
      extraSeat: "+{{equipe.extraSeat}} par mois",
      maxUsers: "{{equipe.max}}, puis Agence",
    },
    agence: {
      for: "Pour les agences et SDR freelances",
      support: "Responsable du succès client dédié, migration assistée, support sous 4 h ouvrées",
      start: "Démo à l'inscription, puis essai accompagné de {{trial.days}} jours",
      extraSeat: "+{{agence.extraSeat}} par mois",
      maxUsers: "{{agence.max}}, puis contactez-nous",
    },
  } satisfies Record<PlanId, { for: string; support: string; start: string; extraSeat: string; maxUsers: string }>,

  card: {
    perMonth: "/mois HT",
    billedAnnually: "soit {amount} HT facturés par an",
    billedMonthly: "facturé chaque mois, sans engagement",
    usersIncluded: { one: "1 utilisateur inclus", other: "{n} utilisateurs inclus" },
    extraSeat: "Utilisateur supplémentaire",
    extraSeatAnnual: "+{amount} par mois, payé à l'année",
    limits: {
      workspaces: "Espaces clients",
      contacts: "Contacts",
      mailboxes: "Boîtes d'envoi par utilisateur",
      ai: "Crédits IA par mois",
    },
    unlimited: "Illimités",
    support: "Support",
    start: "Pour démarrer",
  },

  surMesure: {
    name: "Sur-mesure",
    for: "Pas le temps de prospecter ?",
    price: "Sur devis",
    priceSub: "Fixe mensuel + prix par rendez-vous",
    bullets: ["Notre équipe mène vos campagnes sur Suzalink", "Votre propre portail client", "Un responsable de compte dédié"],
    start: "Appel avec un expert",
  },

  calculator: {
    title: "Estimez votre budget",
    sub: "Réglez votre équipe et vos options : le total se calcule en direct.",
    users: "Nombre d'utilisateurs",
    usersUnit: { one: "utilisateur", other: "utilisateurs" },
    multiClient: "Je travaille pour plusieurs clients",
    multiClientHint: "La formule Agence inclut des espaces clients illimités.",
    voip: "Téléphonie illimitée",
    voipUnit: "utilisateurs couverts",
    sourcing: "Crédits de sourcing",
    sourcingNone: "Aucun",
    sourcingOption: "{count} crédits",
    mailboxes: "Boîtes d'envoi supplémentaires",
    billing: "Facturation",
    recommended: "Formule recommandée",
    lines: {
      plan: "Formule {name}",
      seats: "Utilisateurs supplémentaires",
      voip: "Téléphonie illimitée",
      sourcing: "Crédits de sourcing",
      "mailbox-pack": "Boîtes d'envoi, pack de {size}",
      "mailbox-single": "Boîtes d'envoi à l'unité",
    },
    perMonth: "/mois",
    perYear: "/an",
    monthlyTotal: "Total mensuel HT",
    annualTotal: "Total annuel HT",
    averagePerMonth: "en moyenne par mois",
    firstInvoice: "Premier paiement HT",
    vat: "TVA de {{vat}} ajoutée au paiement.",
    annualNote: "Formule et utilisateurs payés à l'année, options facturées chaque mois.",
    soon: "Option bientôt disponible",
  },

  included: {
    title: "Tout est inclus, dans chaque formule",
    sub: "Les formules changent par le nombre d'utilisateurs, les quotas et le support. Jamais par les fonctionnalités.",
    extra: [
      { title: "Opportunités", body: "Besoin, urgence et valeur de chaque opportunité, et passage de relais au commercial." },
      { title: "Toutes les intégrations", body: "Messagerie, agenda, données, réunions et banque, sans supplément." },
    ],
  },

  addons: {
    title: "Des options à la carte",
    sub: "Elles s'ajoutent à n'importe quelle formule, se facturent au mois et s'arrêtent quand vous voulez.",
    voip: {
      name: "Téléphonie illimitée",
      price: "{{voip.price}}",
      unit: "par utilisateur et par mois",
      body: "Un numéro français par utilisateur, les appels illimités vers la France et l'UE, l'enregistrement et la transcription rattachés à l'issue.",
      link: "Conditions d'usage raisonnable",
    },
    sourcing: {
      name: "Crédits de sourcing",
      price: "dès {{credits.500}}",
      unit: "par mois",
      body: "Recherche Apollo, extraction Google Maps et numéros d'entreprise. {{credits.500.count}} crédits à {{credits.500}}, {{credits.2000.count}} à {{credits.2000}}, {{credits.5000.count}} à {{credits.5000}}.",
    },
    mailboxes: {
      name: "Boîtes d'envoi supplémentaires",
      price: "{{mailbox.single}}",
      unit: "par boîte et par mois",
      body: claimed(
        "Une boîte Gmail, Outlook ou IMAP de plus, avec préchauffage automatique, plafonds et rotation dans les séquences. {{mailbox.pack}} les {{mailbox.packSize}}.",
        "email-warmup",
        "Une boîte Gmail, Outlook ou IMAP de plus, avec son plafond d'envoi et un rythme adapté au fournisseur. {{mailbox.pack}} les {{mailbox.packSize}}.",
      ) as Text,
    },
  },

  table: {
    title: "Comparer les formules en détail",
    rows: {
      for: "Pour",
      monthly: "Prix mensuel HT",
      annual: "Prix annuel HT ({{annual.discount}})",
      users: "Utilisateurs inclus",
      extraSeat: "Utilisateur supplémentaire",
      maxUsers: "Maximum d'utilisateurs",
      workspaces: "Espaces clients",
      guests: "Clients invités",
      contacts: "Contacts dans la base",
      mailboxes: "Boîtes d'envoi incluses",
      ai: "Crédits IA par mois",
      credits: "Crédits de sourcing par mois",
      support: "Support",
      start: "Pour démarrer",
    },
    guests: "Illimités et gratuits",
    perUser: "par utilisateur",
    perYear: "{amount}/an",
    perMonthEq: "soit {amount}/mois",
    unlimited: "Illimités",
    surMesureRuns: "Notre équipe mène les campagnes",
    surMesurePortal: "Votre propre portail",
    surMesureSupport: "Responsable de compte dédié",
    included: "Inclus",
  },

  fairUse: {
    title: "Téléphonie illimitée : usage raisonnable",
    // Wording to validate with counsel before launch (Bloctel, consumer consent, Arcep numbering rules).
    items: [
      "Jusqu'à {{voip.minutes}} minutes sortantes par utilisateur et par mois.",
      "Destinations : fixes et mobiles de France métropolitaine et de l'Union européenne. Les numéros spéciaux et surtaxés sont exclus.",
      "Un appel en cours par utilisateur. La numérotation automatique ou robotisée n'est pas autorisée.",
      "Au-delà du plafond, nous vous contactons d'abord. Le mois suivant passe à la facturation à la minute ou à un palier supérieur. Les appels ne sont jamais coupés en cours de mois sans prévenir.",
      "Usage B2B uniquement. Vous restez responsable du respect des règles françaises de démarchage téléphonique.",
      "Non disponible pendant l'essai : l'option se débloque au premier paiement.",
    ],
  },

  faq: {
    title: "Questions sur les tarifs",
    items: [
      { q: "Les prix sont-ils HT ?", a: "Oui. Tous nos prix sont hors taxes. La TVA française de {{vat}} s'ajoute au paiement." },
      {
        q: "Y a-t-il un engagement ?",
        a: "Non pour les formules mensuelles : la résiliation prend effet à la fin de la période payée. Les formules annuelles sont payées d'avance, avec {{annual.discount}}.",
      },
      {
        q: "Puis-je changer de formule ?",
        a: "Oui. Une montée en gamme s'applique immédiatement, au prorata. Une baisse prend effet au prochain renouvellement.",
      },
      {
        q: "Qui compte comme utilisateur ?",
        a: "Les Administrateurs, les Managers et les Commerciaux. Les clients invités ne comptent pas.",
      },
      {
        q: "Les clients invités sont-ils vraiment gratuits ?",
        a: "Oui, et illimités. Ils accèdent au portail en lecture : rendez-vous, rapports, activité, fichiers et playbook, avec la possibilité de commenter.",
      },
      {
        q: "Que couvre l'usage raisonnable de la téléphonie ?",
        a: claimed(
          "Jusqu'à {{voip.minutes}} minutes sortantes par utilisateur et par mois, vers les fixes et mobiles de France métropolitaine et de l'UE. Au-delà, nous vous contactons avant toute chose. Le détail figure plus haut sur cette page.",
          "voip-addon",
        ),
        claim: "voip-addon",
      },
      {
        q: "Que deviennent les crédits non utilisés ?",
        a: "Les crédits inclus et les packs se renouvellent chaque mois, sans report. Les crédits inclus dans votre formule sont utilisés en premier.",
      },
      {
        q: "Comment puis-je payer ?",
        a: "Par carte bancaire pour toutes les formules, et par prélèvement SEPA pour les formules annuelles.",
      },
      {
        q: "Puis-je récupérer mes données si je résilie ?",
        a: "Oui. Vous restez propriétaire de vos données et pouvez les exporter avant la fin de votre abonnement.",
      },
      {
        q: "Les factures sont-elles conformes ?",
        a: claimed(
          "Oui. Vos factures Suzalink sont émises au format Factur-X, avec la TVA et vos informations légales.",
          "billing-facturx",
          "Oui. Chaque facture mentionne la TVA et vos informations légales, et reste téléchargeable depuis votre espace.",
        ),
      },
    ] satisfies Faq[],
  },

  trust: [
    claimed("Hébergé en France", "hosting-fr", "Conçu en France"),
    "Sans engagement",
    "Paiement sécurisé",
    "Support en français",
  ] as Text[],

  finalCta: {
    title: "Une question sur la bonne formule ?",
    sub: "Un expert vous répond en 30 minutes, démo comprise.",
  },
};

export type PricingContent = typeof pricing;
