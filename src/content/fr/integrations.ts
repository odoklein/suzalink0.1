import type { ClaimId } from "@/config/claims";

export type IntegrationCategory =
  | "messagerie"
  | "agenda"
  | "telephonie"
  | "crm"
  | "donnees"
  | "reunions"
  | "finance"
  | "fichiers";

export type Integration = {
  id: string;
  name: string;
  category: IntegrationCategory;
  line: string;
  claim?: ClaimId;
  /** Shown in the homepage grid of 12. */
  home?: boolean;
};

export const integrationCategories: Record<IntegrationCategory, string> = {
  messagerie: "Messagerie",
  agenda: "Agenda",
  telephonie: "Téléphonie",
  crm: "CRM",
  donnees: "Données et sourcing",
  reunions: "Enregistrement de réunions",
  finance: "Finance",
  fichiers: "Fichiers",
};

/*
 * Logos are shown as name tiles until official files are added under
 * public/logos/integrations/<id>.svg, following each brand's guidelines.
 */
export const integrations: Integration[] = [
  { id: "gmail", name: "Gmail", category: "messagerie", line: "Envoi, réception et séquences depuis vos boîtes Google Workspace.", home: true },
  { id: "outlook", name: "Outlook", category: "messagerie", line: "Vos boîtes Microsoft 365 et Outlook, en envoi comme en réception.", home: true },
  { id: "imap", name: "IMAP et SMTP", category: "messagerie", line: "N'importe quelle boîte mail professionnelle, chez l'hébergeur de votre choix." },
  { id: "calcom", name: "Cal.com", category: "agenda", line: "Votre page de réservation, ouverte dans l'écran d'appel.", home: true },
  { id: "calendly", name: "Calendly", category: "agenda", line: "Votre page Calendly, ouverte dans l'écran d'appel." },
  { id: "allo", name: "Allo", category: "telephonie", line: "Click-to-call, puis résumé, transcription et enregistrement sur l'appel." },
  { id: "onoff", name: "Onoff", category: "telephonie", line: "Click-to-call, puis résumé, transcription et enregistrement sur l'appel." },
  { id: "ringover", name: "Ringover", category: "telephonie", line: "Click-to-call depuis la fiche contact." },
  { id: "hubspot", name: "HubSpot", category: "crm", line: "Import de vos contacts et entreprises HubSpot.", claim: "crm-import-presets", home: true },
  { id: "salesforce", name: "Salesforce", category: "crm", line: "Import de vos contacts et comptes Salesforce.", claim: "crm-import-presets", home: true },
  { id: "apollo", name: "Apollo", category: "donnees", line: "Recherche et import de contacts, avec le suivi des crédits.", home: true },
  { id: "google-maps", name: "Google Maps", category: "donnees", line: "Sourcing d'entreprises locales : commerces, cabinets, agences." },
  { id: "pappers", name: "Pappers", category: "donnees", line: "Informations légales de vos clients pour la facturation.", home: true },
  { id: "leexi", name: "Leexi", category: "reunions", line: "Transcriptions de réunion pour les comptes rendus et les fiches RDV.", home: true },
  { id: "grain", name: "Grain", category: "reunions", line: "Comptes rendus depuis vos enregistrements Grain.", claim: "grain-fireflies", home: true },
  { id: "fireflies", name: "Fireflies", category: "reunions", line: "Comptes rendus depuis vos enregistrements Fireflies.", claim: "grain-fireflies", home: true },
  { id: "qonto", name: "Qonto", category: "finance", line: "Rapprochement des paiements de vos factures.", home: true },
  { id: "google-drive", name: "Google Drive", category: "fichiers", line: "Liez, importez et partagez vos fichiers de campagne.", home: true },
];
