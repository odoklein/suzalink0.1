import { claimed } from "../helpers";
import type { ModuleContent, ModuleSlug } from "../types";

/*
 * Every capability below was checked against the app code (suzalink-repo,
 * September 2026). Anything not built yet goes through `claimed()` or `soon`.
 */

const appels: ModuleContent = {
  slug: "appels",
  path: "/fonctionnalites/appels",
  icon: "phone",
  name: "Appels et téléphonie",
  navBlurb: "File d'appels, script et issues au clavier.",
  meta: {
    title: "Logiciel de phoning pour la prospection B2B",
    description:
      "Enchaînez les appels depuis une seule console : prochain contact à l'écran, script sur la fiche, issues au clavier, rappels planifiés et téléphonie illimitée en option.",
  },
  hero: {
    eyebrow: "Appels et téléphonie",
    title: "Enchaînez les appels, pas les clics.",
    sub: "Le prochain contact s'affiche avec son script. Vous appelez, vous notez l'issue au clavier, le suivant arrive. Les rappels et les rendez-vous manqués passent en premier.",
    cta: "trial",
    media: { screenshot: "S1" },
  },
  highlights: [
    {
      icon: "keyboard",
      title: "Les issues au clavier",
      body: "Près de 30 issues d'appel paramétrables. Les neuf plus utilisées se notent avec les touches 1 à 9, puis Entrée.",
    },
    {
      icon: "target",
      title: "Une file qui se trie seule",
      body: "Rappels et rendez-vous manqués d'abord, puis les contacts à suivre, puis les nouveaux. Un contact appelé ne revient pas avant 24 h.",
    },
    {
      icon: "file",
      title: "Le script sur la fiche",
      body: "Accroche, découverte, objections et conclusion, à côté des informations du contact.",
    },
    {
      icon: "clock",
      title: "Des rappels planifiés",
      body: "Choisissez une date, ou écrivez « rappeler jeudi 14 h » dans la note : Suzalink la reconnaît.",
    },
    {
      icon: "headset",
      title: "Enregistrement et transcription",
      body: "Avec Allo ou Onoff, le résumé, la transcription et l'enregistrement remontent sur l'appel.",
    },
    {
      icon: "sparkles",
      title: "Des notes remises au propre",
      body: "À l'enregistrement, l'IA reformule votre note pour que toute l'équipe la comprenne.",
    },
  ],
  sections: [
    {
      eyebrow: "La file d'appels",
      title: "Vous ne cherchez plus qui appeler.",
      body: "Suzalink construit la file à partir de vos campagnes. Chaque issue fixe la priorité du contact, et les fiches les plus complètes passent devant. Vous décrochez, le reste suit.",
      bullets: [
        "Rendez-vous manqués et rappels en tête de file",
        "Priorité par issue : rappel, à suivre, nouveau, à réessayer",
        "Les fiches les plus complètes d'abord",
      ],
      media: { screenshot: "S1" },
    },
    {
      eyebrow: "Les issues",
      title: "Des issues qui parlent votre métier.",
      body: "NRP, barrage standard, faux numéro, refus argumenté, rendez-vous : chaque issue se règle au niveau du client, de la mission ou de la campagne, avec sa couleur, sa note obligatoire et son rappel automatique.",
      bullets: [
        "Jeux d'issues prêts à l'emploi, courts ou complets",
        "Note obligatoire sur les issues qui le demandent",
        "Rappel créé dès que l'issue l'exige",
      ],
      media: { visual: "V4" },
    },
  ],
  addon: "voip",
  faq: [
    {
      q: "Faut-il changer d'opérateur ?",
      a: "Non. Suzalink fonctionne en click-to-call avec Ringover, Allo ou Onoff. L'option Téléphonie illimitée est facultative.",
    },
    {
      q: "Combien coûte la téléphonie illimitée ?",
      a: claimed(
        "{{voip.price}} HT par utilisateur et par mois : un numéro français, les appels illimités vers les fixes et mobiles de France et de l'UE, l'enregistrement et la transcription. L'option se débloque au premier paiement.",
        "voip-addon",
      ),
      claim: "voip-addon",
    },
    {
      q: "Les appels sont-ils enregistrés ?",
      a: "Avec Allo ou Onoff, l'enregistrement, la transcription et le résumé remontent sur l'appel. Pensez à prévenir votre interlocuteur.",
    },
    {
      q: "Puis-je appeler des particuliers ?",
      a: "Suzalink est conçu pour la prospection B2B. Vous restez responsable du respect des règles françaises de démarchage téléphonique.",
    },
  ],
  related: ["emails", "rendez-vous", "ia"],
};

const emails: ModuleContent = {
  slug: "emails",
  path: "/fonctionnalites/emails",
  icon: "mail",
  name: "Emails et séquences",
  navBlurb: "Email Hub, séquences et boîte partagée.",
  meta: {
    title: "Séquences d'emails de prospection et boîte partagée",
    description:
      "Connectez Gmail, Outlook ou IMAP, lancez des séquences qui s'arrêtent à la réponse, respectez des plafonds d'envoi et partagez la boîte de réception avec l'équipe.",
  },
  hero: {
    eyebrow: "Emails et séquences",
    title: "Des séquences qui arrivent en boîte de réception.",
    sub: "Connectez vos boîtes Gmail, Outlook ou IMAP. Programmez des séquences qui respectent vos horaires et s'arrêtent dès qu'un prospect répond. Les réponses arrivent dans une boîte partagée.",
    cta: "trial",
    media: { screenshot: "S2" },
  },
  highlights: [
    {
      icon: "inbox",
      title: "Vos boîtes, pas les nôtres",
      body: "Gmail, Outlook ou n'importe quelle boîte IMAP. Vous gardez vos domaines et votre réputation d'envoi.",
    },
    {
      icon: "refresh",
      title: "Des séquences qui s'arrêtent seules",
      body: "Délais entre étapes, horaires d'envoi, jours ouvrés uniquement et arrêt dès la réponse.",
    },
    {
      icon: "shield",
      title: "Des plafonds d'envoi",
      body: "Un plafond quotidien par boîte et un rythme adapté à chaque fournisseur. Une boîte en erreur se met en pause.",
    },
    {
      icon: "users",
      title: "Une boîte partagée",
      body: "Boîtes partagées, par client ou par campagne. Attribuez un fil, commentez en interne, réglez les droits d'envoi.",
    },
    {
      icon: "chart",
      title: "Ouvertures et clics",
      body: "Suivi des ouvertures et des clics, avec votre propre domaine de suivi si vous le souhaitez.",
    },
    {
      icon: "sparkles",
      title: "Des brouillons par l'IA",
      body: "L'IA rédige un premier jet, résume un fil ou propose un modèle à partir de votre campagne.",
    },
  ],
  sections: [
    {
      eyebrow: "Les séquences",
      title: "Chaque relance part au bon moment.",
      body: "Une séquence suit le rythme de votre prospection : les étapes partent aux heures que vous avez choisies, depuis la bonne boîte, et s'arrêtent dès que le prospect répond.",
      bullets: [
        "Délais, horaires et jours d'envoi par séquence",
        "Arrêt automatique à la première réponse",
        claimed("Variantes A/B sur l'objet et le message", "email-ab"),
      ],
      media: { screenshot: "S2" },
    },
    {
      eyebrow: "La délivrabilité",
      title: "Protégez vos boîtes d'envoi.",
      body: "Une séquence ne vaut que si elle arrive en boîte de réception. Suzalink limite les envois de chaque boîte et adapte le rythme au fournisseur, pour que vos domaines restent fiables.",
      bullets: [
        "Plafond quotidien par boîte et rythme par fournisseur",
        claimed("Préchauffage automatique des nouvelles boîtes", "email-warmup"),
        claimed("Rotation des boîtes d'envoi dans une séquence", "mailbox-rotation"),
      ],
      media: { visual: "V5" },
    },
  ],
  addon: "mailboxes",
  soon: [
    {
      title: "Contacts de l'Email Hub",
      body: "Chaque correspondant de la boîte partagée relié à sa fiche contact et à vos listes.",
    },
  ],
  faq: [
    {
      q: "Suzalink vend-il des domaines ou des boîtes mail ?",
      a: "Non. Vous connectez vos propres boîtes et domaines. Suzalink pilote les envois : plafonds, rythme et séquences.",
    },
    {
      q: "Combien de boîtes d'envoi sont incluses ?",
      a: "{{solo.mailboxes}} par utilisateur en Solo, {{equipe.mailboxes}} en Équipe et {{agence.mailboxes}} en Agence. Au-delà, chaque boîte supplémentaire coûte {{mailbox.single}} HT par mois, ou {{mailbox.pack}} HT les {{mailbox.packSize}}.",
    },
    {
      q: "Les réponses arrivent-elles dans Suzalink ?",
      a: "Oui. Elles arrivent dans la boîte partagée, rattachées au contact et à la campagne, et arrêtent la séquence.",
    },
    {
      q: "Mes emails sont-ils suivis ?",
      a: "Les ouvertures et les clics sont suivis. Vous pouvez utiliser votre propre domaine de suivi.",
    },
  ],
  related: ["appels", "listes-et-leads", "ia"],
};

const rendezVous: ModuleContent = {
  slug: "rendez-vous",
  path: "/fonctionnalites/rendez-vous",
  icon: "calendar",
  name: "Rendez-vous",
  navBlurb: "Réservation, confirmation et fiche RDV.",
  meta: {
    title: "Logiciel de prise de rendez-vous commercial",
    description:
      "Réservez le rendez-vous pendant l'appel, faites-le confirmer par un manager et transmettez une fiche RDV rédigée par l'IA.",
  },
  hero: {
    eyebrow: "Rendez-vous",
    title: "Du « oui » au rendez-vous confirmé, sans quitter l'appel.",
    sub: "Le calendrier s'ouvre dans l'écran d'appel. Le rendez-vous passe par la validation d'un manager, puis part au client avec une fiche RDV rédigée par l'IA.",
    cta: "trial",
    media: { screenshot: "S3" },
  },
  highlights: [
    {
      icon: "calendar",
      title: "Réservation dans l'appel",
      body: "Votre page Cal.com, cal.eu ou Calendly s'ouvre dans Suzalink. La réservation est détectée toute seule.",
    },
    {
      icon: "check",
      title: "Validation par un manager",
      body: "Chaque rendez-vous passe en attente, puis confirmé ou annulé. Le client n'est prévenu qu'après confirmation.",
    },
    {
      icon: "sparkles",
      title: "Fiche RDV par l'IA",
      body: "À partir de la transcription, l'IA rédige une fiche en cinq parties pour le commercial qui reçoit le rendez-vous.",
    },
    {
      icon: "refresh",
      title: "Rendez-vous manqués rattrapés",
      body: "Un rendez-vous manqué renvoie le contact en tête de file pour le recontacter.",
    },
    {
      icon: "flag",
      title: "Types et motifs",
      body: "Visio, présentiel ou téléphone, et un motif enregistré à chaque annulation.",
    },
    {
      icon: "portal",
      title: "Suivi côté client",
      body: "Dans son portail, le client peut déplacer, annuler ou noter un rendez-vous. Le manager est prévenu.",
    },
  ],
  sections: [
    {
      eyebrow: "La réservation",
      title: "Réservez pendant que le prospect dit oui.",
      body: "Pas de lien à envoyer, pas de va-et-vient par email. Le calendrier de votre client s'ouvre dans l'écran d'appel et le rendez-vous est enregistré dès qu'il est pris.",
      bullets: [
        "Le calendrier s'ouvre dans l'écran d'appel",
        "Le rendez-vous est détecté et enregistré tout seul",
        "Rattaché à la campagne, au contact et au commercial",
      ],
      media: { screenshot: "S3" },
    },
    {
      eyebrow: "La confirmation",
      title: "Un rendez-vous confirmé vaut plus qu'un rendez-vous pris.",
      body: "Le sas de validation évite d'envoyer au client un rendez-vous mal qualifié. Le manager relit, confirme, et le client reçoit un rendez-vous accompagné de sa fiche.",
      bullets: [
        "Statuts en attente, confirmé ou annulé",
        "Le client est prévenu une fois le rendez-vous confirmé",
        "Fiche RDV en cinq parties, rédigée à partir de la transcription",
      ],
      media: { visual: "V3c" },
    },
  ],
  faq: [
    {
      q: "Quel outil de calendrier faut-il ?",
      a: "Suzalink ouvre vos pages Cal.com, cal.eu ou Calendly dans l'écran d'appel.",
    },
    {
      q: "Qui confirme les rendez-vous ?",
      a: "Un Manager ou un Administrateur. Tant qu'il n'est pas confirmé, le rendez-vous reste en attente et le client n'est pas prévenu.",
    },
    {
      q: "D'où vient la fiche RDV ?",
      a: "L'IA la rédige à partir de la transcription de l'appel ou de la réunion, en cinq rubriques.",
    },
  ],
  related: ["appels", "portail-client", "pilotage"],
};

const listes: ModuleContent = {
  slug: "listes-et-leads",
  path: "/fonctionnalites/listes-et-leads",
  icon: "list",
  name: "Listes et leads",
  navBlurb: "Import, enrichissement et crédits de sourcing.",
  meta: {
    title: "Import et enrichissement de listes de prospection B2B",
    description:
      "Importez vos fichiers CSV ou vos recherches Apollo, retrouvez les numéros d'entreprise, sourcez depuis Google Maps et repérez les fiches incomplètes avant d'appeler.",
  },
  hero: {
    eyebrow: "Listes et leads",
    title: "Des listes prêtes à appeler, pas à nettoyer.",
    sub: "Importez un CSV ou une recherche Apollo, complétez les numéros manquants et sourcez de nouvelles entreprises. Chaque fiche reçoit une note de qualité avant d'arriver dans la file d'appels.",
    cta: "trial",
    media: { visual: "V3a" },
  },
  highlights: [
    {
      icon: "file",
      title: "Import CSV guidé",
      body: "Associez vos colonnes et importez de gros fichiers par lots, sans les retoucher avant.",
    },
    {
      icon: "target",
      title: "Recherche Apollo",
      body: "Cherchez et importez des contacts Apollo depuis Suzalink, avec le compteur de crédits sous les yeux.",
    },
    {
      icon: "compass",
      title: "Google Maps",
      body: "Sourcez des entreprises locales depuis Google Maps : commerces, cabinets, agences.",
    },
    {
      icon: "phone",
      title: "Numéros d'entreprise",
      body: "Retrouvez le standard d'une entreprise quand la fiche n'a pas de numéro.",
    },
    {
      icon: "chart",
      title: "Une note de qualité",
      body: "Chaque fiche est classée incomplète, partielle ou exploitable, avec un score de 0 à 100.",
    },
    {
      icon: "check",
      title: "La santé des listes",
      body: "Mesurez la qualité d'une liste et comparez-la aux autres avant de lancer la campagne.",
    },
  ],
  sections: [
    {
      eyebrow: "L'import",
      title: "Importez sans retoucher vos fichiers.",
      body: "Vos fichiers arrivent comme ils sont. Vous associez les colonnes une fois, Suzalink importe par lots et note chaque fiche pour que les plus exploitables passent en premier.",
      bullets: [
        "Association des colonnes à l'import",
        claimed(
          "Modèles prêts pour les exports Apollo, HubSpot et Salesforce",
          "crm-import-presets",
          "Recherche et import Apollo intégrés",
        ),
        "Import par lots, même pour les gros fichiers",
      ],
      media: { screenshot: "S1" },
    },
    {
      eyebrow: "Le sourcing",
      title: "Sourcez ce qui manque.",
      body: "Les crédits de sourcing couvrent la recherche Apollo, l'extraction Google Maps et la recherche du numéro d'une entreprise. Les crédits inclus dans votre formule partent en premier.",
      bullets: [
        "{{credits.perRecord}} crédit par entreprise ou contact trouvé",
        "{{credits.perPhone}} crédits par numéro de téléphone trouvé",
        claimed("Vous ne payez que les données trouvées", "pay-only-found"),
      ],
      media: { visual: "V3a" },
    },
  ],
  addon: "sourcing",
  soon: [
    { title: "Explorium", body: "Taille de marché et recherche d'entreprises dans l'assistant de mission." },
    {
      title: "Moteur de prospects complet",
      body: "Enrichissement et routage automatiques des prospects entrants : formulaire, API ou flux partenaire.",
    },
  ],
  faq: [
    {
      q: "Quels formats puis-je importer ?",
      a: "Des fichiers CSV, y compris les exports de votre CRM, et des recherches Apollo.",
    },
    {
      q: "Que se passe-t-il quand mes crédits sont épuisés ?",
      a: "Suzalink vous propose un pack de crédits. Vos listes et vos données restent accessibles : rien n'est bloqué.",
    },
    {
      q: "Les crédits non utilisés sont-ils reportés ?",
      a: "Non. Les crédits inclus et les packs se renouvellent chaque mois, sans report.",
    },
    {
      q: "Combien de contacts puis-je stocker ?",
      a: "{{solo.contacts}} contacts en Solo, {{equipe.contacts}} en Équipe et {{agence.contacts}} en Agence.",
    },
  ],
  related: ["appels", "emails", "ia"],
};

const ia: ModuleContent = {
  slug: "ia",
  path: "/fonctionnalites/ia",
  icon: "sparkles",
  name: "Intelligence artificielle",
  navBlurb: "Assistant, Analyse IA Stratégique, comptes rendus.",
  meta: {
    title: "IA pour la prospection commerciale",
    description:
      "Un assistant qui connaît vos campagnes, une Analyse IA Stratégique aux recommandations classées, des fiches RDV, des scripts et des emails rédigés pour vous.",
  },
  hero: {
    eyebrow: "Intelligence artificielle",
    title: "Une IA qui connaît vos campagnes.",
    sub: "Demandez où en est une campagne, quels contacts rappeler ou qui est en retard sur son planning. L'assistant répond à partir de vos appels, emails et rendez-vous, et propose la prochaine action.",
    cta: "trial",
    media: { screenshot: "S5" },
  },
  highlights: [
    {
      icon: "sparkles",
      title: "Un assistant branché sur vos données",
      body: "Il répond sur vos campagnes, vos rendez-vous et l'activité de l'équipe : planning, volumes d'appels, rappels du jour.",
    },
    {
      icon: "compass",
      title: "Analyse IA Stratégique",
      body: "Une lecture complète d'une mission, avec des recommandations classées par priorité.",
    },
    {
      icon: "file",
      title: "Fiches et comptes rendus",
      body: "Une fiche RDV en cinq parties et un compte rendu de réunion, à partir de la transcription.",
    },
    {
      icon: "mail",
      title: "Scripts et emails rédigés",
      body: "Un script d'appel, un email ou un modèle de séquence, rédigés à partir du contexte de la campagne.",
    },
    {
      icon: "keyboard",
      title: "Des notes remises au propre",
      body: "Chaque note d'appel est reformulée à l'enregistrement.",
    },
    {
      icon: "users",
      title: "Un playbook commercial",
      body: "Un playbook par client, partagé dans son portail.",
    },
  ],
  sections: [
    {
      eyebrow: "L'assistant",
      title: "Posez la question, obtenez la prochaine action.",
      body: "L'assistant lit ce qui se passe dans votre espace : appels, rappels, rendez-vous, planning. Vous lui parlez comme à un collègue qui a tout suivi.",
      bullets: [
        "« Quels rappels dois-je passer aujourd'hui ? »",
        "« Combien de rendez-vous cette semaine sur la campagne Retail ? »",
        "« Qui est en retard sur son planning ? »",
      ],
      media: { screenshot: "S5" },
    },
    {
      eyebrow: "L'analyse",
      title: "L'Analyse IA Stratégique, pour décider vite.",
      body: "Elle lit une mission de bout en bout et en tire des recommandations classées par priorité. Vous savez quoi changer lundi matin.",
      bullets: [
        "Recommandations classées par priorité",
        claimed("Rapport IA quotidien pour chaque manager", "daily-ai-report"),
        claimed(
          "Comptes rendus de réunion depuis Leexi, Grain ou Fireflies",
          "grain-fireflies",
          "Comptes rendus de réunion depuis Leexi",
        ),
      ],
      media: { visual: "V6" },
    },
  ],
  faq: [
    {
      q: "Quel modèle d'IA utilise Suzalink ?",
      a: claimed("Suzalink s'appuie sur Mistral AI, un modèle développé en France.", "ai-mistral"),
      claim: "ai-mistral",
    },
    {
      q: "Combien de crédits IA sont inclus ?",
      a: "{{solo.ai}} crédits par mois en Solo, {{equipe.ai}} en Équipe et {{agence.ai}} en Agence. Ils se renouvellent chaque mois.",
    },
    {
      q: "L'IA agit-elle à ma place ?",
      a: "Elle rédige, résume et recommande. Les envois aux prospects et aux clients restent entre vos mains.",
    },
    {
      q: "Quels outils d'enregistrement de réunion sont compatibles ?",
      a: claimed("Leexi, Grain et Fireflies.", "grain-fireflies", "Leexi aujourd'hui. Grain et Fireflies arrivent."),
    },
  ],
  related: ["pilotage", "rendez-vous", "appels"],
};

const pilotage: ModuleContent = {
  slug: "pilotage",
  path: "/fonctionnalites/pilotage",
  icon: "chart",
  name: "Pilotage d'équipe",
  navBlurb: "Tableaux de bord, classements, planning.",
  meta: {
    title: "Pilotage d'équipe commerciale : tableaux de bord et planning",
    description:
      "Suivez l'activité de vos commerciaux en temps réel, animez l'équipe avec des classements et planifiez les semaines sans tableur.",
  },
  hero: {
    eyebrow: "Pilotage d'équipe",
    title: "Voyez tout, en temps réel.",
    sub: "Les appels, rendez-vous et rappels de chaque commercial, sur un seul tableau de bord. Le planning répartit les campagnes, gère les absences et signale les conflits avant qu'ils ne coûtent un rendez-vous.",
    cta: "demo",
    media: { screenshot: "S4" },
  },
  highlights: [
    {
      icon: "chart",
      title: "Tableau de bord manager",
      body: "Appels, rendez-vous et taux de chaque commercial, par campagne et par client.",
    },
    {
      icon: "flag",
      title: "Des classements",
      body: "Un classement des appels et un classement des rendez-vous pour animer l'équipe.",
    },
    {
      icon: "calendar",
      title: "Le planning d'équipe",
      body: "Répartition au mois ou à la semaine, capacité, absences et jours fériés.",
    },
    {
      icon: "refresh",
      title: "Conflits et rééquilibrage",
      body: "Les surcharges sont signalées et le planning se rééquilibre. Une semaine se copie en un clic.",
    },
    {
      icon: "file",
      title: "Le retour quotidien",
      body: "Chaque commercial remplit son retour de fin de journée. Vous le retrouvez dans son rapport.",
    },
    {
      icon: "sparkles",
      title: "Un assistant pour le manager",
      body: "Demandez qui est en retard, qui a le plus de rappels ou où en est une campagne.",
    },
  ],
  sections: [
    {
      eyebrow: "L'activité",
      title: "Le reporting ne mange plus votre vendredi.",
      body: "L'activité de l'équipe se lit en direct, sans export ni tableur. Vous voyez qui appelle, qui décroche des rendez-vous et où une campagne cale.",
      bullets: [
        "Tableau de bord par commercial, campagne et client",
        "Classements des appels et des rendez-vous",
        claimed("Rapport IA quotidien envoyé au manager", "daily-ai-report"),
      ],
      media: { screenshot: "S4" },
    },
    {
      eyebrow: "Le planning",
      title: "Un planning qui tient compte de la réalité.",
      body: "Répartissez les campagnes entre les commerciaux, au mois ou à la semaine. Absences, congés et jours fériés sont pris en compte, et les conflits sautent aux yeux.",
      bullets: [
        "Répartition par campagne et par semaine",
        "Absences, congés et jours fériés intégrés",
        "Conflits détectés et planning rééquilibré",
      ],
      media: { visual: "V8b" },
    },
  ],
  faq: [
    {
      q: "Qui a accès aux tableaux de bord ?",
      a: "Les Managers et les Administrateurs voient l'activité de toute l'équipe.",
    },
    {
      q: "Faut-il un outil de planning à part ?",
      a: "Non. Le planning est inclus dans chaque formule, avec les absences, les jours fériés et la détection des conflits.",
    },
    {
      q: "Combien d'utilisateurs puis-je ajouter ?",
      a: "Équipe inclut {{equipe.seats}} utilisateurs et monte jusqu'à {{equipe.max}}, à {{equipe.extraSeat}} HT par utilisateur supplémentaire. Au-delà, la formule Agence va jusqu'à {{agence.max}} utilisateurs.",
    },
  ],
  related: ["ia", "portail-client", "appels"],
};

const portail: ModuleContent = {
  slug: "portail-client",
  path: "/fonctionnalites/portail-client",
  icon: "portal",
  name: "Portail client",
  navBlurb: "Espace client, rapports partagés, facturation au RDV.",
  meta: {
    title: "Portail client et reporting pour agences de prospection",
    description:
      "Offrez à chaque client un espace pour suivre ses rendez-vous, son activité et ses rapports, et facturez au rendez-vous avec des factures Factur-X.",
  },
  hero: {
    eyebrow: "Portail client",
    title: "Vos résultats, visibles par ceux qui comptent.",
    sub: "Chaque client a son espace : rendez-vous, activité, rapports, fichiers et playbook commercial. Vous n'envoyez plus de reporting à la main, vous partagez un lien.",
    cta: "demo",
    media: { screenshot: "S6" },
  },
  highlights: [
    {
      icon: "calendar",
      title: "Les rendez-vous en direct",
      body: "Le client voit ses rendez-vous, peut les déplacer, les annuler ou les noter. Vous êtes prévenu.",
    },
    {
      icon: "chart",
      title: "Des rapports prêts à partager",
      body: "Un rapport de campagne en PDF et une synthèse mensuelle, sans copier-coller.",
    },
    {
      icon: "share",
      title: "Des liens de partage",
      body: "Un lien public pour partager un rapport, valable 30 jours.",
    },
    {
      icon: "file",
      title: "Fichiers et playbook",
      body: "Fichiers de campagne, emails envoyés et playbook commercial au même endroit.",
    },
    {
      icon: "euro",
      title: "Facturation au rendez-vous",
      body: "Offres et engagements par client, comptage des rendez-vous, factures Factur-X et avoirs.",
    },
    {
      icon: "users",
      title: "Des clients invités gratuits",
      body: "Invitez autant de personnes que nécessaire côté client : elles ne comptent pas comme utilisateurs.",
    },
  ],
  sections: [
    {
      eyebrow: "L'espace client",
      title: "Un espace par client, sans reporting à la main.",
      body: "Vos clients suivent leur campagne quand ils le veulent. Ils voient les rendez-vous obtenus, l'activité et les rapports, et peuvent commenter. Vous choisissez ce qui est visible.",
      bullets: [
        "Rendez-vous, activité, rapports, fichiers et playbook",
        "Historique d'appels et base de contacts, si vous les partagez",
        "Messagerie avec votre équipe",
      ],
      media: { screenshot: "S6" },
    },
    {
      eyebrow: "La facturation",
      title: "Facturez ce que vous prouvez.",
      body: "Pour les agences payées au rendez-vous, Suzalink compte les rendez-vous de chaque client selon son offre et prépare la facture.",
      bullets: [
        "Factures Factur-X et avoirs",
        "Rapprochement des paiements avec Qonto",
        "Informations légales des clients via Pappers",
      ],
      media: { visual: "V7" },
    },
  ],
  faq: [
    {
      q: "Les clients invités sont-ils payants ?",
      a: "Non. Les clients invités sont gratuits et illimités dans toutes les formules.",
    },
    {
      q: "Combien d'espaces clients puis-je créer ?",
      a: "{{solo.workspaces}} en Solo, {{equipe.workspaces}} en Équipe et un nombre illimité en Agence.",
    },
    {
      q: "Que voit exactement le client ?",
      a: "Ses rendez-vous, l'activité de campagne, les rapports, les fichiers et le playbook, avec la possibilité de commenter. Vous décidez s'il voit aussi l'historique d'appels et la base de contacts.",
    },
    {
      q: "Les factures sont-elles conformes ?",
      a: "Suzalink génère des factures au format Factur-X, avec leur numérotation et leurs avoirs.",
    },
  ],
  related: ["pilotage", "rendez-vous", "ia"],
};

export const modules: Record<ModuleSlug, ModuleContent> = {
  appels,
  emails,
  "rendez-vous": rendezVous,
  "listes-et-leads": listes,
  ia,
  pilotage,
  "portail-client": portail,
};

export const MODULE_ORDER: ModuleSlug[] = [
  "appels",
  "emails",
  "rendez-vous",
  "listes-et-leads",
  "ia",
  "pilotage",
  "portail-client",
];
