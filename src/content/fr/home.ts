import type { Audience } from "@/config/audiences";
import { claimed } from "../helpers";
import type { DeepDive, Faq, Meta, Text } from "../types";

export const home = {
  meta: {
    title: "Suzalink : CRM de prospection B2B (appels, emails, RDV)",
    description: "Vos listes, vos appels, vos emails et vos rendez-vous dans un seul CRM de prospection, avec une IA qui indique qui rappeler. Essai gratuit de 14 jours, hébergé en France.",
  } satisfies Meta,

  hero: {
    eyebrow: "CRM de prospection B2B",
    title: ["Moins d'onglets.", "Plus de rendez-vous."],
    sub: "Vos listes, vos appels, vos emails et vos rendez-vous dans un seul outil. Le prochain contact s'affiche avec son script, et l'IA vous dit qui rappeler en priorité. Conçu par une agence de prospection qui s'en sert tous les jours.",
    /** Swapped in when the visitor lands with ?utm_audience=… */
    subByAudience: {
      solo: "Appels, emails, listes et rendez-vous dans une seule console, avec le prochain contact déjà à l'écran. Pour les directeurs commerciaux qui prospectent eux-mêmes.",
      equipes: "Toute votre équipe appelle, écrit et réserve depuis la même console, et vous suivez l'activité en direct. Pour les équipes commerciales de 2 à 10 personnes.",
      agences: "Un espace par client, un portail où il suit ses rendez-vous et des rapports prêts à partager. Conçu par des agences de prospection, pour les agences.",
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
    title: "Votre prospection est éparpillée.",
    body: "Un CRM pour les contacts, un logiciel d'appel, un outil d'emailing, un agenda et un tableur pour le reporting. Vous payez cinq abonnements et recopiez les mêmes contacts d'un outil à l'autre.",
    tools: ["CRM", "Logiciel d'appel", "Emailing", "Agenda", "Tableur"],
    stackLink: "Calculez le coût de votre stack",
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
      title: "Vous raccrochez, le contact suivant s'affiche.",
      body: "Il arrive avec son script. Vous notez le résultat de l'appel d'une touche et passez au suivant.",
      bullets: [
        "Les rappels et les rendez-vous manqués passent en tête de file",
        "Une trentaine de résultats d'appel, les plus courants au clavier",
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
      title: "Des séquences envoyées depuis vos propres boîtes.",
      body: "Connectez Gmail, Outlook ou IMAP. Les relances partent à vos horaires, s'arrêtent quand le prospect répond, et les réponses arrivent dans une boîte partagée.",
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
      title: "Une IA qui a lu vos appels, vos emails et vos rendez-vous.",
      body: "Demandez quelle mission convertit le mieux ou qui rappeler cette semaine. Elle répond avec vos chiffres et propose l'action suivante.",
      bullets: [
        "Un assistant qui répond avec les chiffres de vos campagnes",
        "Une analyse de la semaine, avec les actions classées par priorité",
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
      title: "Votre équipe en direct, vos clients dans leur portail.",
      body: "Les appels, rendez-vous et rappels de chaque commercial sur un tableau de bord. Vos clients consultent leurs rendez-vous et leurs rapports quand ils veulent.",
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
    sub: "Choisissez ce qui vous ressemble.",
    cards: [
      {
        audience: "solo",
        title: "Je prospecte moi-même",
        body: "Pour le directeur commercial qui appelle lui-même : listes, appels, emails et agenda sur un seul écran.",
        plan: "Solo",
        href: "/solutions/directeur-commercial",
        visual: "V8a",
      },
      {
        audience: "equipes",
        title: "Je manage une équipe",
        body: "Pour les équipes de 2 à 10 : l'activité de chacun en direct, les mêmes scripts et un planning partagé.",
        plan: "Équipe",
        href: "/solutions/equipes-commerciales",
        visual: "V8b",
      },
      {
        audience: "agences",
        title: "Je prospecte pour mes clients",
        body: "Pour les agences et SDR freelances : un espace et un portail par client, des rapports partagés, la facturation au rendez-vous.",
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
      "Nous avons construit Suzalink pour notre propre agence. Nos commerciaux passaient d'un outil à l'autre toute la journée, et nos clients nous demandaient chaque mois la preuve des rendez-vous obtenus. Nous l'ouvrons aujourd'hui aux équipes qui vivent la même chose.",
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
    title: "Notre équipe peut aussi prospecter pour vous.",
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
        q: "Suzalink remplace-t-il mon CRM ?",
        a: "Pour la prospection et le suivi des opportunités, oui. Vos contacts s'importent depuis un fichier CSV, y compris l'export de votre CRM actuel.",
      },
      { q: "Faut-il une carte bancaire pour l'essai ?", a: "Non. L'essai de {{trial.days}} jours se lance sans carte bancaire." },
      {
        q: "Puis-je garder ma téléphonie actuelle ?",
        a: claimed(
          "Oui : Ringover, Allo ou Onoff fonctionnent en click-to-call. Vous pouvez aussi prendre l'option Téléphonie illimitée.",
          "voip-addon",
          "Oui : Ringover, Allo ou Onoff fonctionnent en click-to-call.",
        ),
      },
      {
        q: "Où sont hébergées mes données ?",
        a: claimed("En France, avec des sauvegardes en Allemagne et en Espagne.", "hosting-fr"),
        claim: "hosting-fr",
      },
      {
        q: "Comment démarrer ?",
        a: "L'essai vous guide pas à pas : connectez une boîte mail, importez une liste, passez votre premier appel.",
      },
      { q: "Puis-je résilier à tout moment ?", a: "Oui, sur les formules mensuelles. La résiliation prend effet à la fin de la période payée." },
    ] satisfies Faq[],
  },

  final: {
    title: "Importez une liste et passez vos premiers appels aujourd'hui.",
    sub: "{{trial.days}} jours pour tester Suzalink sur vos propres listes.",
  },
};

export type HomeContent = typeof home;
