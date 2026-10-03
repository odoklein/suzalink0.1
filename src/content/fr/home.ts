import type { Audience } from "@/config/audiences";
import { claimed } from "../helpers";
import type { DeepDive, Faq, Meta, Text } from "../types";

export const home = {
  meta: {
    title: "Suzalink | Le CRM Outbound B2B Tout-en-Un (Appels, IA & RDV)",
    description: "Divisez par 4 le coût de votre prospection. Vos lignes Allo & OnOff natives, Call Vault audio S3 et fiches de RDV générées par Mistral AI en 10s. Essai 14j sans carte.",
  } satisfies Meta,

  hero: {
    eyebrow: "⚡ Machine de Guerre Outbound • Fin du Stack Morcelé",
    title: ["Moins d'onglets.", "Plus de rendez-vous."],
    sub: "Vos lignes Allo & OnOff connectées en 1 clic, vos appels enregistrés dans le Call Vault S3, et l'IA Mistral qui rédige la fiche de RDV en 10 secondes. Divisez votre facture logicielle par 4.",
    /** Swapped in when the visitor lands with ?utm_audience=… */
    subByAudience: {
      solo: "Vos appels Allo/OnOff et votre Call Vault S3 dans une seule console dédiée. Fini les 5 onglets pour les directeurs commerciaux solo.",
      equipes: "Cockpit manager en temps réel, cadences SDR, anti-collision et fiches Mistral AI prêtes pour le closer. Pour équipes de 3 à 7.",
      agences: "Espaces clients illimités, rôle client spectateur et marque blanche intégrée. Conçu par des agences de prospection, pour les agences.",
    } satisfies Record<Audience, string>,
    chip: { key: "1", label: "RDV décroché", sub: "Issue enregistrée, contact suivant" },
  },

  proof: {
    title: "Ils prospectent chaque jour avec Suzalink",
    logos: ["Suzali Conseil", "Captain Prospect", "PingLead Agency"],
    stats: [
      { value: 60000, format: "int", label: "appels passés depuis janvier 2026" },
      { value: 99, format: "percent", label: "de disponibilité", claim: "uptime-99", link: "status" },
    ] as { value: number; format: "int" | "percent"; label: string; claim?: "uptime-99"; link?: "status" }[],
  },

  problem: {
    title: "Le piège du stack morcelé à 350 € / mois / commercial.",
    body: "Un CRM lourd conçu pour les DAF, un logiciel d'appel tiers, un outil de transcription à 100 €, un séquenceur d'emails et des connecteurs Zapier fragiles. Cinq abonnements, cinq onglets, perte de contexte au handover et des factures qui explosent.",
    tools: ["HubSpot (120 €)", "Aircall (45 €)", "Modjo (100 €)", "Lemlist (60 €)", "Zapier (30 €)"],
    stackLink: "Simuler mes économies avec Suzalink",
  },

  how: {
    title: "Une journée de prospection, de la liste au rendez-vous.",
    steps: [
      {
        title: "Importez",
        body: claimed(
          "Vos listes Apollo, HubSpot, Salesforce ou CSV, enrichies et notées selon leur qualité.",
          "crm-import-presets",
          "Vos listes Apollo ou vos fichiers CSV, enrichis et notés selon leur qualité.",
        ),
        visual: "V3a",
      },
      {
        title: "Appelez et écrivez",
        body: "Le prochain contact s'affiche avec son script. Appel, email, relance : tout part du même écran.",
        visual: "V3b",
      },
      {
        title: "Décrochez le rendez-vous",
        body: "Réservation intégrée, confirmation par le manager, fiche RDV rédigée par l'IA.",
        visual: "V3c",
      },
      {
        title: "Prouvez les résultats",
        body: claimed(
          "Tableaux de bord, rapport IA quotidien et portail client partagé.",
          "daily-ai-report",
          "Tableaux de bord, rapports partagés et portail client.",
        ),
        visual: "V3d",
      },
    ] as { title: string; body: Text; visual: "V3a" | "V3b" | "V3c" | "V3d" }[],
  },

  features: [
    {
      eyebrow: "Appels",
      title: "Enchaînez les appels, pas les clics.",
      body: "Le prochain contact arrive avec son script. Vous notez l'issue au clavier et le suivant s'affiche.",
      bullets: [
        "File intelligente : rappels et rendez-vous manqués d'abord",
        "Près de 30 issues d'appel, les plus utilisées au clavier",
        claimed(
          "Rappels planifiés, enregistrements et transcriptions, téléphonie illimitée en option",
          "voip-addon",
          "Rappels planifiés, enregistrements et transcriptions avec Allo ou Onoff",
        ),
      ],
      media: { screenshot: "S1" },
      link: { label: "Découvrir les appels", href: "/fonctionnalites/appels" },
    },
    {
      eyebrow: "Emails",
      title: "Des séquences qui arrivent en boîte de réception.",
      body: "Vos boîtes Gmail, Outlook ou IMAP, des séquences qui respectent vos horaires et une boîte partagée pour les réponses.",
      bullets: [
        "Gmail, Outlook et IMAP",
        claimed("Séquences A/B, préchauffage et plafonds d'envoi", "email-ab", "Séquences qui s'arrêtent à la réponse, plafonds d'envoi"),
        "Boîte de réception partagée",
      ],
      media: { screenshot: "S2" },
      link: { label: "Découvrir les emails", href: "/fonctionnalites/emails" },
    },
    {
      eyebrow: "IA",
      title: "Une IA qui connaît vos campagnes.",
      body: "Elle répond sur vos campagnes, vos rendez-vous et votre activité, et vous dit quoi faire ensuite.",
      bullets: [
        "Un assistant qui répond sur vos campagnes, rendez-vous et activité",
        "Analyse IA Stratégique aux recommandations classées",
        claimed(
          "Comptes rendus depuis Leexi, Grain ou Fireflies, scripts et emails rédigés",
          "grain-fireflies",
          "Comptes rendus depuis Leexi, scripts et emails rédigés",
        ),
      ],
      media: { screenshot: "S5" },
      link: { label: "Découvrir l'IA", href: "/fonctionnalites/ia" },
    },
    {
      eyebrow: "Pilotage et portail client",
      title: "Vos résultats, visibles par ceux qui comptent.",
      body: "Vous suivez l'équipe en direct, vos clients suivent leurs rendez-vous dans leur portail.",
      bullets: [
        "Tableaux de bord, classements et planning d'équipe",
        claimed("Rapport IA quotidien", "daily-ai-report", "Rapports de campagne en PDF et synthèse mensuelle"),
        "Portail client et liens de partage",
      ],
      media: { screenshot: "S4" },
      link: { label: "Découvrir le portail client", href: "/fonctionnalites/portail-client" },
    },
  ] satisfies DeepDive[],

  audiences: {
    title: "Pour qui ?",
    sub: "Trois façons de prospecter, une seule console.",
    cards: [
      {
        audience: "solo",
        title: "Vous prospectez seul ? Récupérez vos heures.",
        body: "Tout sur un écran, le prochain contact en file, l'IA qui propose la suite.",
        plan: "Solo",
        href: "/solutions/directeur-commercial",
        visual: "V8a",
      },
      {
        audience: "equipes",
        title: "Vous managez une équipe ? Voyez tout, en temps réel.",
        body: "Tableaux de bord, classements, planning et une méthode commune.",
        plan: "Équipe",
        href: "/solutions/equipes-commerciales",
        visual: "V8b",
      },
      {
        audience: "agences",
        title: "Vous prospectez pour vos clients ? Prouvez chaque rendez-vous.",
        body: "Portail client, rapports partagés, un espace par client, facturation au rendez-vous.",
        plan: "Agence",
        href: "/solutions/agences",
        visual: "V8c",
      },
    ] as const,
  },

  sovereignty: {
    title: "Une IA française. Vos données hébergées en France.",
    facts: [
      { icon: "sparkles", title: "IA Mistral", body: "Les fonctions d'IA s'appuient sur Mistral AI, développé en France.", claim: "ai-mistral" },
      {
        icon: "server",
        title: "Hébergement en France",
        body: "Vos données sont hébergées en France, avec des sauvegardes en Allemagne et en Espagne.",
        claim: "hosting-fr",
      },
      { icon: "shield", title: "RGPD et DPA", body: "Un accord de traitement des données prêt à signer et la liste de nos sous-traitants." },
    ] as { icon: "sparkles" | "server" | "shield"; title: string; body: string; claim?: "ai-mistral" | "hosting-fr" }[],
    link: "Sécurité et RGPD",
    map: { france: "France", germany: "Allemagne", spain: "Espagne", primary: "Hébergement", backup: "Sauvegardes" },
  },

  integrations: {
    title: "Branché sur vos outils.",
    sub: "Messagerie, agenda, CRM, données, réunions, banque : Suzalink se connecte à ce que vous utilisez déjà.",
    link: "Toutes les intégrations",
  },

  built: {
    title: "Construit par des agences qui vivent de la prise de rendez-vous.",
    quote:
      "Nous avons d'abord construit Suzalink pour notre propre agence : trop d'outils, et trop de mal à prouver nos résultats, les rendez-vous obtenus chaque mois. Aujourd'hui, nous l'ouvrons aux commerciaux qui vivent la même chose.",
    people: [
      { name: "Hichem Hammouche", role: "CEO, Suzali Conseil" },
      { name: "Amine Hallab", role: "Finance et management" },
      { name: "Odo Klein", role: "Product Owner, Suzali Conseil" },
    ],
    link: "Notre histoire",
  },

  pricing: {
    title: "Un prix simple. Tous les modules inclus.",
    sub: "Choisissez selon la taille de votre équipe.",
  },

  surMesure: {
    title: "Pas le temps de prospecter ? Notre équipe le fait pour vous, sur Suzalink.",
    body: "L'équipe de Suzali Conseil mène vos campagnes d'appels sur Suzalink. Vous suivez chaque rendez-vous dans votre portail.",
  },

  faq: {
    title: "Questions fréquentes",
    more: {
      title: "Une autre question ?",
      body: "Posez-la en démo : 30 minutes, avec votre cas et vos chiffres.",
    },
    items: [
      {
        q: "On utilise déjà HubSpot ou Salesforce, pourquoi passer à Suzalink ?",
        a: "Gardez HubSpot pour votre marketing inbound si vous le souhaitez, mais donnez Suzalink à vos commerciaux en première ligne. HubSpot est une usine à gaz pour l'outbound où chaque commercial perd 30 secondes par appel à remplir des formulaires. Sur Suzalink, vos SDRs enchaînent les appels en 1 clic et vos rendez-vous qualifiés peuvent être synchronisés vers votre CRM central.",
      },
      {
        q: "Pourquoi êtes-vous 4 fois moins chers qu'un stack traditionnel ?",
        a: "Les géants comme Salesforce ou Aircall dépensent plus de 50 % de leur chiffre d'affaires en marketing et en commissions. Notre architecture moderne est optimisée sans intermédiaire. De plus, chaque client dispose d'une instance privée dédiée (Single-Tenant), là où leurs clients sont entassés sur des serveurs mutualisés.",
      },
      {
        q: "Puis-je conserver mes numéros Allo ou OnOff Business existants ?",
        a: "Absolument. Vous n'avez pas besoin de changer d'opérateur ni de payer un abonnement Aircall à 45 €/mois. Nous ingérons directement les flux audio et webhooks de vos comptes Allo ou OnOff existants, et chaque appel est horodaté et rattaché au prospect dans le Call Vault S3.",
      },
      {
        q: "Comment fonctionne la fiche de RDV générée par Mistral AI ?",
        a: "Dès qu'un prospect est booké, le modèle Mistral AI analyse l'enregistrement de l'appel ou les notes du SDR et produit instantanément en 10 secondes une fiche structurée complète (BANT, douleur principale, budget, décideurs et objections anticipées pour le closer).",
      },
      {
        q: "Mes données sont-elles protégées et étanches ?",
        a: "Oui à 100 %. Contrairement aux SaaS multi-tenant où vos prospects côtoient des millions d'entreprises étrangères, vous bénéficiez d'une instance dédiée avec votre propre base PostgreSQL isolée et votre coffre-fort audio S3 privé.",
      },
      { q: "Faut-il une carte bancaire pour démarrer l'essai ?", a: "Non. L'essai gratuit de {{trial.days}} jours démarre immédiatement sans carte bancaire, avec l'ensemble des modules inclus." },
    ] satisfies Faq[],
  },

  final: {
    title: "Votre prochain rendez-vous commence ici.",
    sub: "{{trial.days}} jours pour essayer, sans carte bancaire.",
  },
};

export type HomeContent = typeof home;
