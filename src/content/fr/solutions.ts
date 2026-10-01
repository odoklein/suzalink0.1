import type { SolutionContent, SolutionSlug } from "../types";

const directeur: SolutionContent = {
  slug: "directeur-commercial",
  path: "/solutions/directeur-commercial",
  icon: "user",
  name: "Directeur commercial",
  navBlurb: "Vous prospectez seul ? Récupérez vos heures.",
  plan: "solo",
  visual: "H1",
  meta: {
    title: "Logiciel de prospection pour directeur commercial",
    description:
      "Appels, emails, listes et rendez-vous dans une seule console, avec une IA qui vous indique la prochaine action. Essai gratuit de 14 jours, sans carte bancaire.",
  },
  hero: {
    eyebrow: "Directeur commercial solo",
    title: "Vous prospectez seul ? Récupérez vos heures.",
    sub: "Un CRM, un logiciel d'appel, un outil d'emailing, un agenda : vous payez quatre ou cinq outils et vous passez la journée à changer d'onglet. Suzalink les réunit dans une seule console, avec le prochain contact déjà à l'écran.",
    cta: "trial",
  },
  pains: [
    {
      title: "Trop d'outils",
      body: "Chaque abonnement fait une chose. Aucun ne parle aux autres, et c'est vous qui recopiez.",
    },
    {
      title: "Pas assez de temps pour vendre",
      body: "Préparer une liste, retrouver un numéro, relancer par email : la prospection mange le temps de la vente.",
    },
    {
      title: "Plusieurs entreprises à suivre",
      body: "En temps partagé, vous jonglez entre deux ou trois entreprises qui veulent chacune leurs chiffres.",
    },
  ],
  day: {
    title: "Une matinée avec Suzalink",
    sub: "De la liste au rendez-vous, sans quitter l'écran.",
    steps: [
      { time: "9:00", title: "Vous ouvrez la file", body: "Rappels du jour et rendez-vous manqués en tête. Le script est déjà sur la fiche." },
      { time: "9:40", title: "Vous enchaînez les appels", body: "Une touche pour l'issue, Entrée, contact suivant." },
      { time: "10:15", title: "Le prospect dit oui", body: "Vous réservez le rendez-vous dans l'appel. L'IA prépare la fiche RDV." },
      { time: "11:30", title: "Vous relancez par email", body: "Les injoignables reçoivent une séquence qui s'arrête dès qu'ils répondent." },
      { time: "12:00", title: "Vous faites le point", body: "L'assistant vous dit où en est la campagne et qui rappeler cet après-midi." },
    ],
  },
  features: [
    { module: "appels", title: "Le prochain contact à l'écran", body: "Une file triée pour vous, le script sur la fiche, les issues au clavier." },
    { module: "emails", title: "Des relances qui partent seules", body: "Vos boîtes Gmail, Outlook ou IMAP, des séquences qui s'arrêtent à la réponse." },
    { module: "rendez-vous", title: "Le rendez-vous pris dans l'appel", body: "Votre calendrier s'ouvre dans l'écran d'appel, la fiche RDV s'écrit toute seule." },
    { module: "ia", title: "Une IA qui suit vos campagnes", body: "Demandez où vous en êtes, elle propose la prochaine action." },
  ],
  plan_pitch: {
    title: "Solo : {{solo.monthly}} HT par mois, tous les modules inclus.",
    body: "Un utilisateur, {{solo.contacts}} contacts et {{solo.ai}} crédits IA par mois. Essayez {{trial.days}} jours, sans carte bancaire.",
    bullets: [
      "Tous les modules, sans option cachée",
      "{{solo.contacts}} contacts et {{solo.mailboxes}} boîte d'envoi",
      "Aide en ligne et chat, réponse sous 48 h",
      "Sans engagement, ou {{annual.discount}} à l'année",
    ],
  },
  faq: [
    {
      q: "Puis-je passer à Équipe plus tard ?",
      a: "Oui. Le changement est immédiat, au prorata, et vos données vous suivent.",
    },
    {
      q: "Que se passe-t-il à la fin de l'essai ?",
      a: "Vous choisissez une formule et payez par carte. Sans paiement au {{trial.days}}e jour, votre espace passe en lecture seule pendant {{trial.readOnlyDays}} jours, puis un avis de suppression vous est envoyé.",
    },
    {
      q: "Je travaille pour plusieurs entreprises. Quelle formule choisir ?",
      a: "Solo inclut un espace client. Si vous prospectez pour plusieurs clients, la formule Agence vous donne des espaces clients illimités.",
    },
  ],
};

const equipes: SolutionContent = {
  slug: "equipes-commerciales",
  path: "/solutions/equipes-commerciales",
  icon: "users",
  name: "Équipes commerciales",
  navBlurb: "Vous managez une équipe ? Voyez tout, en temps réel.",
  plan: "equipe",
  visual: "V8b",
  meta: {
    title: "Logiciel de prospection pour équipe commerciale",
    description:
      "Tableaux de bord en direct, classements, planning d'équipe et un seul outil pour vos SDR et vos commerciaux. Démo de 30 minutes, puis essai accompagné.",
  },
  hero: {
    eyebrow: "Équipes de 2 à 10",
    title: "Vous managez une équipe ? Voyez tout, en temps réel.",
    sub: "Vos commerciaux travaillent dans la même console, avec les mêmes issues, les mêmes scripts et les mêmes séquences. Vous suivez l'activité en direct, sans attendre le reporting du vendredi.",
    cta: "demo",
  },
  pains: [
    {
      title: "Aucune vue en direct",
      body: "Vous découvrez les chiffres de la semaine quand il est trop tard pour corriger.",
    },
    {
      title: "Le reporting mange le vendredi",
      body: "Exports, tableurs, copier-coller : l'après-midi y passe.",
    },
    {
      title: "Chacun ses outils",
      body: "Un commercial sur un logiciel d'appel, un autre sur son portable, un troisième sur un tableur. Impossible de comparer.",
    },
  ],
  day: {
    title: "Une semaine d'équipe avec Suzalink",
    sub: "Le manager pilote, l'équipe appelle.",
    steps: [
      { time: "Lundi", title: "Vous répartissez les campagnes", body: "Le planning tient compte des absences et signale les surcharges." },
      { time: "Chaque jour", title: "L'équipe appelle depuis la même file", body: "Mêmes issues, même script, même rythme." },
      { time: "En direct", title: "Vous suivez le tableau de bord", body: "Appels, rendez-vous et classements, par commercial et par campagne." },
      { time: "Au fil de l'eau", title: "Vous confirmez les rendez-vous", body: "Chaque rendez-vous passe par votre validation avant d'arriver au client." },
      { time: "Vendredi", title: "Vous partagez les résultats", body: "Un lien de rapport au lieu d'un tableur." },
    ],
  },
  features: [
    { module: "pilotage", title: "L'activité en direct", body: "Tableau de bord, classements et planning d'équipe." },
    { module: "appels", title: "Une méthode commune", body: "La même file, les mêmes issues et le même script pour tous." },
    { module: "rendez-vous", title: "Des rendez-vous validés", body: "Le sas de confirmation avant chaque envoi au client." },
    { module: "ia", title: "Un assistant pour le manager", body: "Qui est en retard, qui a le plus de rappels, où en est la campagne." },
  ],
  plan_pitch: {
    title: "Équipe : {{equipe.monthly}} HT par mois pour {{equipe.seats}} utilisateurs.",
    body: "Tous les modules, {{equipe.contacts}} contacts et {{equipe.ai}} crédits IA par mois. Jusqu'à {{equipe.max}} utilisateurs, à {{equipe.extraSeat}} HT par utilisateur supplémentaire.",
    bullets: [
      "Appel d'onboarding guidé de 45 minutes",
      "Support prioritaire sous 24 h",
      "{{equipe.mailboxes}} boîtes d'envoi par utilisateur",
      "{{equipe.workspaces}} espaces clients",
    ],
  },
  faq: [
    {
      q: "Pourquoi une démo avant l'essai ?",
      a: "Parce qu'une équipe démarre mieux avec un bon paramétrage. En 30 minutes, un expert règle avec vous les issues, les campagnes et les accès. Votre essai accompagné de {{trial.days}} jours commence ensuite.",
    },
    {
      q: "Qui compte comme utilisateur ?",
      a: "Les Administrateurs, les Managers et les Commerciaux. Les clients invités sont gratuits et illimités.",
    },
    {
      q: "Peut-on garder notre téléphonie ?",
      a: "Oui. Suzalink fonctionne en click-to-call avec Ringover, Allo ou Onoff.",
    },
  ],
};

const agences: SolutionContent = {
  slug: "agences",
  path: "/solutions/agences",
  icon: "building",
  name: "Agences de prospection",
  navBlurb: "Vous prospectez pour vos clients ? Prouvez chaque rendez-vous.",
  plan: "agence",
  visual: "V8c",
  meta: {
    title: "Logiciel pour agences de prospection et SDR freelances",
    description:
      "Un espace par client, un portail client, des rapports partagés et la facturation au rendez-vous. Construit par des agences de prise de rendez-vous.",
  },
  hero: {
    eyebrow: "Agences et SDR freelances",
    title: "Vous prospectez pour vos clients ? Prouvez chaque rendez-vous.",
    sub: "Un espace par client, un portail où il suit ses rendez-vous, des rapports prêts à partager et la facturation au rendez-vous. Suzalink a été construit dans une agence, pour les agences.",
    cta: "demo",
  },
  pains: [
    {
      title: "Prouver les résultats, client par client",
      body: "Chaque client veut savoir combien d'appels, combien de rendez-vous, et pourquoi.",
    },
    {
      title: "Des rapports faits à la main",
      body: "Captures d'écran, tableurs, emails : le reporting coûte des heures que personne ne paie.",
    },
    {
      title: "Facturer au rendez-vous",
      body: "Compter les rendez-vous de chaque client, appliquer son offre, éditer la facture : tout se fait à côté.",
    },
  ],
  day: {
    title: "Un mois d'agence avec Suzalink",
    sub: "De la mission au rapport, puis à la facture.",
    steps: [
      { time: "Démarrage", title: "Un espace par client", body: "Campagnes, listes, scripts et issues propres à chaque client." },
      { time: "Chaque jour", title: "Vos SDR appellent", body: "Une file par mission, des rendez-vous validés avant l'envoi." },
      { time: "En continu", title: "Le client suit son portail", body: "Il voit ses rendez-vous, les note et commente." },
      { time: "Fin de mois", title: "Vous partagez le rapport", body: "En PDF, en synthèse mensuelle ou par lien." },
      { time: "Facturation", title: "Vous facturez au rendez-vous", body: "Comptage selon l'offre du client, facture Factur-X, rapprochement Qonto." },
    ],
  },
  features: [
    { module: "portail-client", title: "Un portail par client", body: "Rendez-vous, activité, rapports, fichiers et playbook." },
    { module: "pilotage", title: "Vos SDR pilotés", body: "Planning par mission, tableaux de bord et classements." },
    { module: "rendez-vous", title: "Des rendez-vous qui tiennent", body: "Validation par un manager et fiche RDV rédigée par l'IA." },
    { module: "listes-et-leads", title: "Des listes par mission", body: "Import, notation de la qualité et sourcing au crédit." },
  ],
  plan_pitch: {
    title: "Agence : {{agence.monthly}} HT par mois pour {{agence.seats}} utilisateurs.",
    body: "Tous les modules, des espaces clients illimités, {{agence.contacts}} contacts et {{agence.ai}} crédits IA par mois. Jusqu'à {{agence.max}} utilisateurs, à {{agence.extraSeat}} HT par utilisateur supplémentaire.",
    bullets: [
      "Espaces clients illimités",
      "Clients invités gratuits et illimités",
      "Un responsable du succès client dédié",
      "Migration de vos données accompagnée",
      "Support sous 4 heures ouvrées",
    ],
  },
  faq: [
    {
      q: "Mes clients paient-ils pour accéder au portail ?",
      a: "Non. Les clients invités sont gratuits et illimités.",
    },
    {
      q: "Les données de chaque client sont-elles séparées ?",
      a: "Oui. Chaque client a son espace, avec ses campagnes, ses listes et ses rapports.",
    },
    {
      q: "Vous reprenez nos données existantes ?",
      a: "Oui. En formule Agence, notre équipe vous accompagne dans la migration de vos données.",
    },
  ],
};

export const solutions: Record<SolutionSlug, SolutionContent> = {
  "directeur-commercial": directeur,
  "equipes-commerciales": equipes,
  agences,
};

export const SOLUTION_ORDER: SolutionSlug[] = ["directeur-commercial", "equipes-commerciales", "agences"];
