# Product screenshot pack (S1–S16)

Where real Suzalink UI goes on the site, and one capture brief per slot. Companion to `public/visuals/README.md` (generated art). Slots live in `SCREENSHOTS` (`src/config/visuals.ts`) and render through `ScreenshotFrame` (`src/components/ui/Media.tsx`). Until a file lands, a wireframe from `ScreenshotSkeleton.tsx` shows with a « Capture à venir » tag.

Revision 2: briefs rewritten from five real captures of the app (Appeler, contact panel + script, Planning équipe, Portefeuille Clients, Command Center Manager).

## What the real app looks like (design facts every capture must respect)

- **Shell**: near-black left sidebar (~258 px at 2000 px wide) with logo, search (`⌘K`), grouped nav, user chip at the bottom. Light content area, breadcrumb top-left (`Sales / Appeler`, `Manager / Planning`), top-right buttons « Donner mon avis », refresh, « ✦ Assistant », « Signaler », bell with badge.
- **SDR nav**: MON TRAVAIL (Appeler, Rappels) · RÉSULTATS (Mes RDV, Historique, Calendrier) · COMMUNICATION (Messagerie, Email) · ORGANISATION (Planning).
- **Manager nav**: « Analyse IA » (amber button) · PILOTAGE COMMERCIAL (Cockpit, Clients, Missions, Listes, Performance) · OPÉRATIONS SDR (Planning équipe, Collaborateurs, Rendez-vous) · ASSISTANCE & IA (Tickets support, Usage assistant IA) · COMMUNICATION (Messagerie, Email).
- **Language of the product**: mission, liste, campagne, « Contact Qualifié », « Relance », « En retard », « Haute Intention », « Priorités Commerciales ». Use these words in copy near the screenshots, not generic CRM terms.
- **Pattern**: KPI cards on top, then a work table or chart, with **slide-over panels** from the right (contact, client) or left (script). Panels are the product's signature; prefer captures with one panel open.
- **Colours**: black/white base, brand blue for primary actions, green for success, amber/yellow for overdue rows and urgency, dark navy KPI cards on the manager dashboard.

## Blocking issues to fix before any capture goes on the site

1. **Real prospect data is visible** in the screenshots you sent (named contacts, direct phone numbers, emails at real organisations, real client names). None of that can be published. Capture from a demo workspace seeded with invented data (`Atelier Roussel`, `+33 1 XX XX XX XX`, `exemple` domains), or blur is **not** acceptable: edit the data, not the pixels. Rule applies to client names (« Family Studio », « Wemo ») and to team names.
2. **Branding**: the app shows the « Ping » logo, the domain `crm.ping-leadagency.fr`, and a Chrome window with other tabs. Replace the sidebar logo with Suzalink's (`public/brand/suzalink-logo-white.svg`), capture the **viewport only** (DevTools → device toolbar → 1600×1000, zoom 100 %), no tab bar, no URL, no taskbar, no Windows clock.
3. **User chip**: « Super Administra… / MANAGER » must become a demo name (« Camille R. · Manager »). Sidebar badge counts should be believable (not `9` on the bell with `0` elsewhere).
4. **Dates** must be coherent with today's date and the « En retard » logic (a queue where every row is overdue looks like a neglected workspace; show a mix).
5. **Claims**: only show what `src/config/claims.ts` allows. Confirm each « ✦ » AI control and « Sync appels » (telephony) before showing them.

## Global capture rules

- 1600×1000 (16:10) viewport, captured at 2x (3200×2000), exported WebP to `public/screenshots/sN-name.webp`. Set `src`, `width`, `height` in `SCREENSHOTS`.
- Light content area, no cursor, no tooltips, no toasts, no scrollbars, no browser UI.
- UI in French, `jj/mm/aaaa`, 24h.
- No baked annotations. Callouts are drawn in code over the image; leave the zones noted in each brief free of key content.
- Legibility: shown at 600–960 px wide on desktop and ~340 px on mobile. Zoom the app to 110–125 % before capturing rather than shrinking text, and show fewer rows (3–5) rather than 10.
- Re-capture after each UI release. Log file, date and app version at the bottom.

## Placement map

| Id | Screen (real app) | Seen in your captures | Where it goes |
| --- | --- | --- | --- |
| S1 | Appeler: action queue + contact panel open | Yes (screens 1–2) | Home hero (priority, 960 px) · Home feature 1 · `/fonctionnalites` hero · `/fonctionnalites/appels` hero + block 1 |
| S2 | Email Hub: séquence editor | **Need capture** | Home feature 2 · `/fonctionnalites/emails` hero + block 1 |
| S3 | Rendez-vous: booking + fiche RDV | **Need capture** | `/fonctionnalites/rendez-vous` hero + block 1 · `/demo` |
| S4 | Command Center Manager (tableau de bord) | Yes (screen 5) | Home feature 4 · `/fonctionnalites/pilotage` hero + block 1 · `/solutions/equipes-commerciales` |
| S5 | Analyse IA Stratégique | **Need capture** (sidebar button « Analyse IA ») | Home feature 3 · `/fonctionnalites/ia` hero |
| S6 | Client portal, client-facing report | **Need capture** (what the client sees, not the manager's Clients page) | Home feature 4 overlay (320 px) · `/fonctionnalites/portail-client` hero + block 1 · `/solutions/agences` |
| S7 | Listes: CSV import and column mapping | **Need capture** (Listes) | `/fonctionnalites/listes-et-leads` hero + block 1 (replaces wrong S1) |
| S8 | Listes: sourcing (Apollo, Maps) | **Need capture** | `/fonctionnalites/listes-et-leads` block 2 |
| S9 | Email: mailbox settings, warm-up, caps | **Need capture** | `/fonctionnalites/emails` block 2 |
| S10 | Contact panel: « Enregistrer une action » with Résultat list open | Partly (screen 1 cuts it off) | `/fonctionnalites/appels` block 2 (replaces V4) |
| S11 | Rendez-vous (manager): validation + manqués | **Need capture** | `/fonctionnalites/rendez-vous` block 2 |
| S12 | « ✦ Assistant » conversation | **Need capture** | `/fonctionnalites/ia` block 1 |
| S13 | Planning équipe (week grid) | Yes (screen 3) | `/fonctionnalites/pilotage` block 2 (replaces V8b) |
| S14 | Facturation au rendez-vous | **Need capture** | `/fonctionnalites/portail-client` block 2 |
| S15 | Script de campagne drawer (Script de base / Additionnel / Amélioré par IA) | Yes (screen 1, left) | `/fonctionnalites/appels` extra overlay on block 1 · `/solutions/directeur-commercial` proof strip |
| S16 | Portefeuille Clients: fiche client with « Portail actif », « Gérer les accès » | Yes (screen 4) | `/fonctionnalites/portail-client` extra on block 1 · `/solutions/agences` hero proof |

No UI on: `/tarifs`, `/securite`, legal pages, `/integrations` (logos), `/a-propos`, `/sur-mesure`.

## Implementation checklist (per new slot)

1. Add the id to `ScreenshotId` and a `SCREENSHOTS` entry (label, French alt, 1600×1000, `src: null`).
2. Add a scene to `ScreenshotSkeleton.tsx` (`SCENES` is typed on `ScreenshotId`). **Update the wireframe style to match the real shell**: dark sidebar (`#0b0f1a`) instead of the current light one, so placeholders and real captures swap without a visual jump.
3. Point `media: { screenshot: "S10" }` at the slot in `src/content/fr/modules.ts`.
4. Drop the file, set `src`, and keep the skeleton until all slots are delivered.
5. Home stacked blocks crop to `max-h-[520px]` with a bottom fade: keep the key content in the **top 60%** of S1, S2, S5.
6. `npm run build`, then check `/`, `/fonctionnalites` and each module at 375, 768 and 1280 px.
7. Callouts to draw in code (never baked): S1 on the « Appeler » button and the « En retard » chip; S4 on the « RDV cette semaine » card; S13 on the charge ring; S16 on « Portail actif ».

---

## Briefs

Each brief is self-contained. « Demo workspace » means invented data and the Suzalink logo, per the blocking issues above.

### S1 · Appeler: action queue with the contact panel open

> Capture the **Appeler** page (breadcrumb « Sales / Appeler », page title « Actions », subtitle « Gérez vos actions commerciales ») with the **contact slide-over open on the right** (about 40 % of the width).
> Behind the panel, keep visible: the four KPI cards (Actions réalisées **18**, Actions restantes **123**, Rappels urgents **14**, Jamais contactés **6**: use non-zero values so the screen looks in use), the filter row (Mission, Liste, Rechercher) and the first three table rows. Rows are a mix: first two with the amber highlight and the red « En retard » chip, third normal.
> In the panel: avatar initials, name « Camille Roussel », green chip « Contact Qualifié », company « Atelier Roussel », the two buttons **Appeler** (dark) and **Envoyer un email**, then the four cells Dernière action (Relance), Rappel (jj mois), Qualification, Canal (Appel), and the start of « Informations » with Contact/Société tabs and the phone `+33 1 XX XX XX XX`.
> Dark sidebar with Suzalink logo, Appeler active. No tab bar or URL. Keep the top-right of the table free for a callout. Top 60 % must hold the KPI cards, the first rows and the panel header.

### S2 · Email Hub: séquence editor *(needs capture)*

> Capture the sequence editor in the Email sidebar section: sequence list, a vertical timeline of 5 steps alternating email cards and wait pills (« Attendre 3 jours »), and the editor on the right with subject, a short body in French and merge-field chips. Same dark sidebar, same breadcrumb pattern (`Sales / Email`). Mailbox chip with a green « Prête » dot. Only show A/B if that claim is confirmed.

### S3 · Rendez-vous: booking and fiche RDV *(needs capture)*

> Capture booking from a call (the contact panel's calendar action) or the Calendrier view with one booked slot, next to the AI-written fiche RDV: status badge, contact, company, and 4–5 short sections (Contexte, Besoin, Objections, Prochaine étape). Demo data only.

### S4 · Command Center Manager (tableau de bord)

> Capture **Manager / Tableau de bord**, titled « Command Center Manager » with the green « En direct » pill and the 7j / **30j** / Mois selector, « Toutes les missions » filter and blue **Nouvelle mission** button.
> Keep as in the real app: the four KPI cards (two dark navy, two light tinted): **Appels & actions** (1 377, progress bar), **RDV cette semaine** (12 / 10 visés, « 100 % Objectif »), **Leads chauds & rappels** (96 contacts qualifiés, amber bar), **Taux de conversion** (2,3 %). Below left, the **Performance & Trajectoire RDV** chart with the solid black « Réalisé » line over the dashed blue « Objectif » line (Lu → Di); below right, **Priorités Commerciales** with its three rows (Rappels planifiés « Urgent », Prospects intéressés « Chaud », RDV à préparer & briefer « Gagné »).
> Numbers must be internally coherent (RDV confirmés ≤ RDV pris, conversion = RDV ÷ actions). Replace the real user chip. Do not crop the dark KPI cards; they are the strongest visual. The bottom summary strip (Total actions / RDV confirmés / Taux de succès) can be cut.
> Note: the leaderboard promised by the current copy is not on this screen. Capture the **Performance** page too, or change the « classements » copy.

### S5 · Analyse IA Stratégique *(needs capture)*

> Click « Analyse IA » (amber button, top of the manager sidebar) and capture the result: ranked recommendations with priority chips plus one chart. Keep the sidebar visible. Top 60 % holds recommendations 1–3.

### S6 · Client portal report *(needs capture)*

> Capture what an **invited client** sees: their name, three KPIs (rendez-vous pris, confirmés, taux), a trend line and a list of recent meetings. A client has no manager sidebar, so use the portal's own header. Also export a tight KPI + chart crop for the 320 px home overlay.

### S7 · Listes: CSV import and column mapping *(needs capture)*

> Open **Listes** (Pilotage commercial) → import. Capture the mapping step: file columns on the left, Suzalink fields as dropdowns, green « reconnu » checks, one orange row, a preview of 5 rows and the quality score. Primary button « Importer N contacts ». Invented data only.

### S8 · Listes: sourcing *(needs capture, optional until the Apollo claim is confirmed)*

> Capture the sourcing form and results table (checkboxes, 3 ticked, « Ajouter à la liste »). Show only source tabs backed by claims.

### S9 · Email: mailboxes, warm-up and send caps *(needs capture)*

> Capture the mailbox settings for three connected mailboxes: warm-up gauge, daily cap and sending window each. Large type, three cards.

### S10 · Contact panel: « Enregistrer une action » with the Résultat list open

> Using the same contact panel as S1, **scroll down** to the black « Enregistrer une action » card and **open the RÉSULTAT dropdown** so the list of outcomes is visible (French labels, « RDV pris » among them). Show the required-field asterisk and the note field below. Crop to the panel only (about 640×1000) centred on a light grey `#F6F7F9` background, since this sits next to text on the Appels page. Check how many outcomes exist and whether keyboard shortcuts exist before reusing the « 30 issues au clavier » claim.

### S11 · Rendez-vous: validation and manqués *(needs capture)*

> Capture **Manager / Rendez-vous**: table with status chips (À valider, Confirmé, Manqué, Reprogrammé), one row expanded with Valider / Refuser, and a banner for missed meetings to recover.

### S12 · « ✦ Assistant » conversation *(needs capture)*

> Click « Assistant » (top right) and capture a conversation: a question about campaigns, an answer with a ranked list, one suggested next action. Numbers consistent with S4.

### S13 · Planning équipe

> Capture **Manager / Planning équipe** for the week of the capture. Keep: title « Planning équipe », date range selector, « Vue par collaborateur », « Nouvelle tâche » (green), the five KPI cards (Collaborateurs **6**, Charge moyenne, Disponibilités, Retards, Tâches urgentes), the « Charge de l'équipe » bars Lun → Ven, and the grid with **three agent rows** (orange mission blocks, purple mission blocks, one row with « Libre » cells) and the « Résumé semaine » ring column (100 %, 50 %, 20 %).
> Invent mission names (« Mission Atelier », « Mission Conseil ») in place of client names, and agent first names only. Make the loads varied and plausible (avoid every ring at 100 % or 20 %). Crop after the third row.

### S14 · Facturation au rendez-vous *(needs capture)*

> Capture the billing view by confirmed meeting: monthly summary, table of 6 confirmed meetings with amounts, validated-by-client tick, export button.

### S15 · Script de campagne (drawer)

> Capture the **left slide-over** « Script de campagne » (subtitle « Mission : … ») with the three tabs **Script de base / Additionnel / Amélioré par IA** (Additionnel selected), the « Campagne : … » pill, and 14–16 lines of a French call script in the text area (numbered sections « 1. PASSAGE DU STANDARD », « 2. OUVERTURE AVEC LE RESPONSABLE », with SDR: / lines), the « Brouillon à jour » indicator and the two buttons « Sauvegarder le brouillon » and blue **Partager avec l'équipe**. Write an invented script for a fictitious company; do not reuse the real client script. Crop to the drawer on `#F6F7F9` (about 500×1000).

### S16 · Portefeuille Clients: fiche client

> Capture **Manager / Clients** with the client slide-over open: avatar monogram, name, chips « Portail actif » (green), « Client depuis sept. 2026 », four mini KPIs (Missions, Actives, Portail, Contacts), buttons **Nouvelle mission**, **Gérer les accès**, **Page détaillée**, then the tabs Aperçu / Missions / Accès / Interlocuteurs / Activité / Avis SDR, and the « Informations de base » card. Invent the client (« Atelier Conseil », `contact@exemple-conseil.fr`, `+33 1 XX XX XX XX`) and fill the fields that are currently « Non défini » / « Non renseigné » so the screen looks complete. Callout target: « Portail actif ».

---

## Delivered files

| Id | File | Date | App version | Notes |
| --- | --- | --- | --- | --- |
