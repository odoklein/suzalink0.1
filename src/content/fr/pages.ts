import { claimed } from "../helpers";
import type { Faq, Meta, Text } from "../types";

export const featuresOverview = {
  meta: {
    title: "Fonctionnalités : appels, emails, listes, rendez-vous et IA",
    description:
      "Sept modules inclus dans chaque formule : appels, emails et séquences, rendez-vous, listes et leads, IA, pilotage d'équipe et portail client.",
  } satisfies Meta,
  hero: {
    eyebrow: "Fonctionnalités",
    title: "Tout ce qu'il faut pour prospecter, dans une seule console.",
    sub: "Sept modules qui partagent les mêmes contacts, les mêmes campagnes et les mêmes résultats. Tous inclus, dans chaque formule.",
  },
  chain: {
    title: "Chaque module alimente le suivant.",
    sub: "Une liste devient une file d'appels, un appel devient un rendez-vous, un rendez-vous devient un rapport que votre client consulte.",
    steps: ["Liste", "Appel", "Email", "Rendez-vous", "Rapport"],
  },
  included: "Inclus dans Solo, Équipe et Agence",
};

export const surMesure = {
  meta: {
    title: "Prospection externalisée sur Suzalink",
    description:
      "Pas le temps de prospecter ? L'équipe de Suzali Conseil mène vos campagnes d'appels sur Suzalink. Fixe mensuel et prix par rendez-vous, sur devis.",
  } satisfies Meta,
  hero: {
    eyebrow: "Sur-mesure",
    title: "Pas le temps de prospecter ? Notre équipe le fait pour vous, sur Suzalink.",
    sub: "L'équipe de Suzali Conseil, agence de prospection, mène vos campagnes d'appels sur Suzalink. Vous suivez chaque rendez-vous dans votre portail.",
  },
  steps: {
    title: "Comment ça se passe",
    items: [
      { title: "Un appel de 30 minutes", body: "Vous nous dites qui vous voulez rencontrer, combien de rendez-vous et pour quand." },
      { title: "Une proposition sous 48 h", body: "Un fixe mensuel et un prix par rendez-vous obtenu, selon votre cible et vos volumes." },
      { title: "Le contrat et votre portail", body: "Nous préparons les listes, le script et la campagne. Vous recevez l'accès à votre portail." },
      { title: "Les rendez-vous arrivent", body: "Chaque rendez-vous est validé avant de vous être envoyé, avec sa fiche." },
    ],
  },
  included: {
    title: "Ce que vous recevez",
    items: [
      { icon: "headset", title: "Une équipe qui appelle", body: "Des SDR expérimentés, formés sur votre offre et votre cible." },
      { icon: "portal", title: "Votre portail client", body: "Rendez-vous, activité, rapports et fichiers, visibles à tout moment." },
      { icon: "check", title: "Des rendez-vous validés", body: "Un manager relit chaque rendez-vous avant qu'il vous soit envoyé." },
      { icon: "user", title: "Un responsable de compte", body: "Un interlocuteur unique pour ajuster la campagne." },
    ] as { icon: "headset" | "portal" | "check" | "user"; title: string; body: string }[],
  },
  form: {
    title: "Parlez à un expert",
    sub: "Quatre questions pour préparer l'appel. Nous vous répondons avec une proposition sous 48 h.",
    fields: {
      meetings: "Rendez-vous souhaités par mois",
      meetingsOptions: ["Moins de 10", "10 à 30", "30 à 60", "Plus de 60"],
      sector: "Secteur visé",
      sectorPlaceholder: "Ex. : cabinets comptables, industrie, SaaS",
      companySize: "Taille des entreprises visées",
      companySizeOptions: ["TPE", "PME", "ETI", "Grands comptes"],
      region: "Zone géographique",
      regionPlaceholder: "Ex. : Île-de-France, France entière",
      deadline: "Échéance",
      deadlineOptions: ["Dès que possible", "Sous un mois", "Dans 1 à 3 mois", "Plus tard"],
      firstName: "Prénom",
      lastName: "Nom",
      email: "Email professionnel",
      company: "Entreprise",
      phone: "Téléphone",
    },
    submit: "Choisir un créneau",
    slotTitle: "Choisissez votre créneau",
    slotSub: "30 minutes avec un expert, heure de Paris.",
    doneTitle: "C'est noté.",
    doneBody: "Vous recevez une confirmation par email. Nous revenons vers vous avec une proposition sous 48 h après l'appel.",
  },
  faq: [
    { q: "Combien ça coûte ?", a: "C'est sur devis : un fixe mensuel et un prix par rendez-vous obtenu, selon votre cible et vos volumes." },
    { q: "Qui passe les appels ?", a: "L'équipe de Suzali Conseil, depuis Suzalink." },
    { q: "Comment suivre les résultats ?", a: "Dans votre portail client : rendez-vous, activité et rapports, à tout moment." },
    { q: "Faut-il un abonnement Suzalink ?", a: "Non. Votre portail client est inclus dans l'offre Sur-mesure." },
  ] satisfies Faq[],
};

export const integrationsPage = {
  meta: {
    title: "Intégrations : Gmail, Outlook, Cal.com, Apollo, Leexi et plus",
    description:
      "Suzalink se branche sur votre messagerie, votre agenda, votre téléphonie, vos sources de données, vos outils de réunion et votre banque.",
  } satisfies Meta,
  hero: {
    eyebrow: "Intégrations",
    title: "Branché sur vos outils.",
    sub: "Toutes les intégrations sont incluses dans chaque formule. Une ligne par outil, pour savoir exactement ce qu'elle fait.",
  },
  logoNote: "Les noms et marques cités appartiennent à leurs propriétaires respectifs.",
  missing: {
    title: "Il vous manque un outil ?",
    body: "Dites-nous lequel pendant la démo. Nous priorisons les intégrations demandées par nos clients.",
  },
};

export const security = {
  meta: {
    title: "Sécurité et RGPD",
    description:
      "Hébergement, sauvegardes, chiffrement, contrôle des accès, DPA et sous-traitants : comment Suzalink protège vos données et celles de vos prospects.",
  } satisfies Meta,
  hero: {
    eyebrow: "Sécurité et RGPD",
    title: "Vos données, et celles de vos prospects, entre de bonnes mains.",
    sub: "Voici comment Suzalink héberge, protège et traite vos données. Nous n'écrivons ici que ce qui est en place. Ce qui arrive est marqué « Bientôt ».",
  },
  hosting: {
    title: "Hébergement et sauvegardes",
    body: "Vos données sont hébergées en France. Les sauvegardes sont répliquées en Allemagne et en Espagne, pour qu'un incident sur un site n'emporte pas vos données.",
  },
  ai: {
    title: "Une IA française",
    body: "Les fonctions d'IA de Suzalink s'appuient sur Mistral AI, développé en France.",
  },
  controls: {
    title: "Protection et accès",
    items: [
      { icon: "lock", title: "Connexions chiffrées", body: "Toutes les connexions à Suzalink passent en HTTPS." },
      { icon: "shield", title: "Mots de passe hachés", body: "Les mots de passe ne sont jamais stockés en clair." },
      {
        icon: "lock",
        title: "Secrets chiffrés au repos",
        body: "Les jetons et mots de passe de vos boîtes mail sont chiffrés en AES-256.",
        claim: "tokens-encrypted",
      },
      { icon: "users", title: "Rôles et permissions", body: "Quatre rôles, et des permissions ajustables par utilisateur pour les Administrateurs." },
      { icon: "clock", title: "Connexions surveillées", body: "Les tentatives de connexion sont limitées et journalisées." },
      { icon: "shield", title: "Double authentification", body: "Une seconde vérification à la connexion.", soon: true },
    ] as { icon: "lock" | "shield" | "users" | "clock"; title: string; body: string; claim?: "tokens-encrypted"; soon?: boolean }[],
  },
  gdpr: {
    title: "RGPD",
    items: [
      "Vous restez responsable du traitement des données de vos prospects ; Suzalink agit comme sous-traitant.",
      "Un accord de traitement des données (DPA) est disponible pour chaque client.",
      "La liste de nos sous-traitants et de leurs régions est publiée ci-dessous.",
    ],
    dpa: "Lire le DPA",
    privacy: "Politique de confidentialité",
  },
  subprocessors: {
    title: "Sous-traitants",
    note: "Régions vérifiées avant le lancement public.",
    columns: { purpose: "Usage", provider: "Prestataire", region: "Région" },
    pending: "À confirmer",
    rows: [
      { purpose: "Base de données", provider: null, region: null },
      { purpose: "Cache et files d'attente", provider: null, region: null },
      { purpose: "Fonctions applicatives", provider: null, region: null },
      { purpose: "Stockage de fichiers", provider: null, region: null },
      { purpose: "Intelligence artificielle", provider: "Mistral AI", region: null },
      { purpose: "Emails transactionnels", provider: "Resend", region: null },
      { purpose: "Emails marketing", provider: "Brevo", region: null },
      { purpose: "Paiement", provider: "Stripe", region: null },
      { purpose: "Prise de rendez-vous", provider: "Cal.com", region: null },
      { purpose: "Mesure d'audience du site", provider: "PostHog (cloud UE)", region: null },
      { purpose: "Protection anti-spam des formulaires", provider: "Cloudflare Turnstile", region: null },
      { purpose: "Hébergement du site", provider: "Vercel", region: null },
    ] as { purpose: string; provider: string | null; region: string | null }[],
  },
  uptime: {
    title: "Disponibilité",
    body: "99 % de disponibilité de janvier à septembre 2026. L'historique est public.",
    link: "Voir la page de statut",
  },
};

export const about = {
  meta: {
    title: "À propos : construit par des agences de prospection",
    description:
      "Suzalink a d'abord été construit pour une agence de prospection. Découvrez son histoire et les personnes qui le font.",
  } satisfies Meta,
  hero: {
    eyebrow: "À propos",
    title: "Construit par des agences qui vivent de la prise de rendez-vous.",
  },
  story: [
    "Nous avons d'abord construit Suzalink pour notre propre agence : trop d'outils, et trop de mal à prouver nos résultats, les rendez-vous obtenus chaque mois.",
    "Aujourd'hui, nous l'ouvrons aux commerciaux qui vivent la même chose.",
  ],
  stat: { value: "60 000", label: "appels passés sur Suzalink de janvier à septembre 2026" },
  peopleTitle: "Les visages de Suzalink",
  people: [
    { name: "Hichem Hammouche", role: "CEO, Suzali Conseil", org: "Agence de prospection" },
    { name: "Jean-François Manier", role: "CEO, Captain Prospect", org: "Agence commerciale" },
    { name: "Odo Klein", role: "Product Owner, Suzali Conseil", org: "Produit" },
  ],
  values: {
    title: "Ce qui nous guide",
    items: [
      { title: "Moins d'outils, plus de terrain", body: "Chaque onglet en moins, c'est du temps rendu à la vente." },
      {
        title: "Prouver, pas promettre",
        body: "Nous ne publions que ce que le produit fait aujourd'hui. Ce qui arrive est marqué « Bientôt ».",
      },
      { title: "Construit à l'usage", body: "Chaque fonction a d'abord servi dans nos propres campagnes, avant d'arriver chez vous." },
    ],
  },
  users: { title: "Ils prospectent chaque jour avec Suzalink" },
};

export const demo = {
  meta: {
    title: "Réserver une démo",
    description: "30 minutes avec un expert pour voir Suzalink sur votre cas : vos listes, votre équipe, vos objectifs.",
  } satisfies Meta,
  hero: {
    eyebrow: "Démo",
    title: "Voyez Suzalink sur votre cas, en 30 minutes.",
    sub: "Un expert vous montre la console avec vos listes, votre équipe et vos objectifs. Pour Équipe et Agence, la démo ouvre votre essai accompagné de {{trial.days}} jours.",
  },
  agenda: {
    title: "Au programme",
    items: [
      "Votre journée de prospection dans Suzalink, de la liste au rendez-vous",
      "Le paramétrage de vos issues, campagnes et accès",
      "La bonne formule pour votre équipe",
    ],
  },
  form: {
    title: "Vos informations",
    fields: {
      email: "Email professionnel",
      firstName: "Prénom",
      lastName: "Nom",
      company: "Entreprise",
      teamSize: "Taille de l'équipe commerciale",
      phone: "Téléphone",
      tools: "Outils utilisés aujourd'hui",
      toolsPlaceholder: "Ex. : HubSpot, Aircall, lemlist, tableur",
    },
    submit: "Choisir un créneau",
    already: "Vous préférez essayer seul ?",
    trial: "Essai gratuit de {{trial.days}} jours",
  },
  slot: {
    title: "Choisissez votre créneau",
    sub: "30 minutes, heure de Paris.",
  },
  done: {
    title: "Votre démo est réservée.",
    body: "Vous recevez une invitation par email, puis un rappel la veille et une heure avant. Un empêchement ? Le lien dans l'invitation permet de déplacer le créneau.",
    prepareTitle: "Pour en tirer le meilleur",
    prepare: [
      "Une liste de prospects, en CSV ou en recherche Apollo",
      "Les outils que vous utilisez aujourd'hui, et ce qu'ils vous coûtent",
      "Votre objectif de rendez-vous par mois",
      "Les personnes qui utiliseront Suzalink",
    ],
  },
};

export const changelog = {
  meta: {
    title: "Nouveautés",
    description: "Ce qui vient de sortir sur Suzalink, et ce qui arrive bientôt.",
  } satisfies Meta,
  hero: {
    eyebrow: "Nouveautés",
    title: "Ce qui sort, et ce qui arrive.",
    sub: "Suzalink évolue chaque semaine. Ce qui est annoncé ici comme « Bientôt » n'est pas encore disponible.",
  },
  releasesTitle: "Dernières sorties",
  /** Add entries as { date: "2026-10-01", title, body, module? }. Newest first. */
  releases: [] as { date: string; title: string; body: string }[],
  releasesEmpty: "Le journal des versions démarre avec l'ouverture publique de Suzalink.",
  soonTitle: "Bientôt",
  soon: [
    { title: "Double authentification", body: "Une seconde vérification à la connexion, pour chaque utilisateur." },
    { title: "Contacts de l'Email Hub", body: "Chaque correspondant de la boîte partagée relié à sa fiche contact et à vos listes." },
    {
      title: "Moteur de prospects complet",
      body: "Enrichissement et routage automatiques des prospects entrants : formulaire, API ou flux partenaire.",
    },
    { title: "Explorium", body: "Taille de marché et recherche d'entreprises dans l'assistant de mission." },
  ],
  claimSoon: {
    "voip-addon": { title: "Téléphonie illimitée", body: "Un numéro français par utilisateur et les appels illimités vers la France et l'UE." },
    "lead-credits": { title: "Crédits de sourcing", body: "Des packs de crédits pour Apollo, Google Maps et les numéros d'entreprise." },
    "grain-fireflies": { title: "Grain et Fireflies", body: "Des comptes rendus de réunion depuis vos enregistrements Grain et Fireflies." },
    "email-ab": { title: "Variantes A/B", body: "Testez deux versions d'un email dans une séquence." },
    "email-warmup": { title: "Préchauffage des boîtes", body: "Les nouvelles boîtes d'envoi montent en volume progressivement." },
    "mailbox-rotation": { title: "Rotation des boîtes", body: "Une séquence répartit ses envois entre plusieurs boîtes." },
    "daily-ai-report": { title: "Rapport IA quotidien", body: "Chaque matin, un résumé de l'activité de la veille pour le manager." },
  } as Record<string, { title: string; body: string }>,
};

export const legalCommon = {
  draft: "Projet à valider par un juriste avant publication.",
  updated: "Dernière mise à jour",
};

export const legalMeta: Record<"mentions-legales" | "cgv" | "confidentialite" | "cookies" | "dpa", Meta> = {
  "mentions-legales": { title: "Mentions légales", description: "Éditeur, hébergeur et contact du site suzalink.com." },
  cgv: {
    title: "Conditions générales de vente et d'utilisation",
    description: "Les conditions B2B d'abonnement et d'utilisation de Suzalink, y compris l'usage raisonnable de la téléphonie.",
  },
  confidentialite: {
    title: "Politique de confidentialité",
    description: "Comment Suzalink collecte, utilise et protège vos données personnelles.",
  },
  cookies: { title: "Politique cookies", description: "Les cookies utilisés sur suzalink.com et comment gérer votre choix." },
  dpa: {
    title: "Accord de traitement des données (DPA)",
    description: "L'accord de sous-traitance RGPD entre Suzalink et ses clients.",
  },
};

export const trustTexts = {
  hosted: claimed("Hébergé en France", "hosting-fr", "Conçu en France") as Text,
};
