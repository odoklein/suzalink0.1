# Visual prompt pack (V1–V14)

18 generated images, all in one style: soft white 3D objects joined by the Suzalink accent line. No people, no text, no fake UI. Product UI comes from real screenshots (S1–S6, in `public/screenshots/`) and faces from real photos (`public/people/`). V9 (the hosting map) is drawn in code: `npm run build:map` writes `v9-europe-map.svg`.

Until a file lands, the site renders a labelled placeholder (see `src/config/visuals.ts`).

## How to generate

1. Use one ChatGPT conversation for the whole set. Paste the style base once, then each subject prompt.
2. Generate V1 first. Once it is approved, attach it to every later prompt with « Match the style of the attached image exactly ».
3. Swap `#3355FF` for the brand's primary colour before starting (and in `src/app/globals.css`).
4. Export at the largest size. Put the file here (AVIF, WebP or PNG; `next/image` serves AVIF/WebP at every width), then set `src` and the real width/height for that id in `src/config/visuals.ts`.
5. Reject any image with letters, logos, extra lines, a second accent colour or a readable screen.
6. Log the final file name next to its prompt in the table at the bottom.

## Style base (paste first)

> Style for every image in this series (Suzalink brand): clean, light, premium B2B software illustration. Soft matte 3D objects with rounded edges, made of white ceramic and frosted glass, on a pure white to very light cool-grey background (#F6F7F9). One accent colour only: #3355FF, used on at most 10% of the image. Green #16A34A only when a prompt asks for it. Soft diffused studio light from the top left, gentle contact shadows, no harsh reflections, no background gradient. Generous negative space. Slightly elevated three-quarter view. A single thin continuous accent-blue line links the objects together; this line is the brand motif and appears in every image. No text, no letters, no numbers, no logos, no screens with readable content, no people, no watermark. Crisp, calm, precise, high detail.

## Subjects

| Id | Use | Ratio | Prompt |
| --- | --- | --- | --- |
| V1 | Home hero, behind S1 | 3:2 (1536×1024) | Wide hero composition. The centre-right area stays empty and softly lit, because a product screenshot will be placed there later. Around that empty area, floating at different depths: a desk phone handset, a closed envelope, a small calendar block with one day filled in accent blue, a short stack of contact cards, and a small bar-chart block. The accent-blue line starts at the handset, loops through each object and ends at the empty area. The left third is almost empty for the headline. |
| V2 | Home problem section | 3:2 | Before and after in one image. Left half: five mismatched app tiles scattered and tilted at odd angles, in muted greys and beiges (the only exception to the single-accent rule), with tangled thin grey threads between them. Right half: the same five tiles in white, aligned neatly inside one white panel and joined by the single accent-blue line. The right side feels calm and ordered. |
| V3a–V3d | Home how-it-works | 1:1 (1024×1024), transparent | One object icon, centred, on a transparent background. A short stub of the accent-blue line enters from the left edge and leaves from the right edge, so the four icons join up in a row. Object: [a] a stack of contact cards with a small upward arrow / [b] a phone handset beside an envelope / [c] a calendar block with one day filled in accent blue and a small green #16A34A check mark / [d] a clipboard with a rising bar chart. |
| V4 | Home, /fonctionnalites/appels | 1:1 | A modern headset resting on a soft round pedestal, a thin sound-wave ring around it. In front, a single blank keyboard key cap whose top face is accent blue. The accent line runs from the headset to the key cap. |
| V5 | Home, /fonctionnalites/emails | 1:1 | Three white envelopes rising in a gentle arc, the top one slightly open. Beside the stack, a small thermometer-shaped gauge filled in accent blue, suggesting mailbox warm-up. The accent line traces the arc of the envelopes. |
| V6 | Home, /fonctionnalites/ia | 1:1 | A frosted-glass compass lying flat, its needle in accent blue, pointing at one of three small white cards placed around it. The chosen card is slightly raised. The accent line runs from the needle to that card. Feeling: the next best action. |
| V7 | Home, /fonctionnalites/portail-client | 1:1 | A white slab showing only abstract bars and a donut shape in accent blue, with no numbers. A second, smaller slab faces away from it, as if the report is being shared. The accent line links the two slabs. |
| V8a | Audience card, /solutions/directeur-commercial | 3:2 | One tidy desk at three-quarter view: a laptop with its screen turned away, a headset, a coffee cup and a single calendar block. The accent line runs from the headset to the calendar. Feeling: focused, alone, in control. |
| V8b | Audience card, /solutions/equipes-commerciales | 3:2 | Four identical small desks in a gentle arc, each with a headset. The accent line connects all four desks to a slightly larger central slab showing abstract bars. Feeling: a coordinated team. |
| V8c | Audience card, /solutions/agences | 3:2 | One central white hub block with the accent line branching out to five small building-shaped blocks of different heights. Each building has a tiny calendar tile on top with one day in accent blue. Feeling: one agency serving many clients. |
| V9 | Home AI/hosting band, /securite | — | Drawn in code (`scripts/build-europe-map.ts`). Not generated: image models misplace countries. |
| V10 | Home band, /sur-mesure | 3:2 | A neat row of five headsets on identical stands, like an orderly call floor. The accent line runs along the row and ends at a calendar block with three days filled in accent blue. Feeling: a professional team working for you. |
| V11 | Social share (OG), cropped to 1200×630 | 3:2 | Minimal background for a social share card. The accent-blue line crosses from left to right in one elegant loop, with a small handset at its start and a calendar block at its end, both on the right third. The left two thirds stay empty for a title added later. |
| V12 | 404 page | 1:1 | A phone handset resting off its base, with the accent line gently tangled into a loose knot beside it. Light, friendly, slightly humorous. |
| V13 | Guide cover (cold-call script template, P1) | 2:3 (1024×1536) | A stack of white paper sheets with a headset lying on top. The accent line loops across the pages like a bookmark ribbon. The upper third stays empty for the title. |
| V14 | /nouveautes and « Bientôt » badges | 1:1, transparent | A small white parcel box, lid slightly open, with a soft accent-blue glow inside and the accent line tied around it like a ribbon. |

## Real screenshots to capture (not generated)

Captured from a demo workspace filled with realistic fake French data (never real prospects), at 2x, cropped to one feature, placed in `public/screenshots/`. Callouts are drawn in code on top, never baked in. Re-capture after each UI release.

| Id | Screen |
| --- | --- |
| S1 | Calling workspace with the queue and script |
| S2 | Email Hub sequence editor |
| S3 | Meeting booking and meeting brief |
| S4 | Team dashboard and leaderboard |
| S5 | Analyse IA Stratégique |
| S6 | Client portal report |

## Delivered files

| Id | File | Date | Notes |
| --- | --- | --- | --- |
| V9 | v9-europe-map.svg | 2026-09-30 | Generated from Natural Earth by `npm run build:map` |
| V1 | v1-hero.webp | 2026-09-30 | 1536×1024. To fix: the line after the calendar dangles; join it to the bar chart to close the loop. Upscale 2x for retina |
| V3a–V3d | v3a-importez.webp, v3b-appelez.webp, v3c-rendez-vous.webp, v3d-resultats.webp | 2026-09-30 | 340×340 crops of one transparent 1536×1024 row. Flatter style than the set; regenerate one icon at a time when possible |
| V4 | v4-appels.webp | 2026-09-30 | 1254×1254 |
| V5 | v5-emails.webp | 2026-09-30 | 1254×1254 |
| V6 | v6-ia.webp | 2026-09-30 | 1536×1024 (3:2, not 1:1): cropped to a square in the home feature tiles |
| V7 | v7-reporting.webp | 2026-09-30 | 1536×1024 (3:2, not 1:1). Weak: the second slab does not read as a shared report; regenerate |
| V8a | v8a-solo.webp | 2026-09-30 | 1536×1024. To fix: the line runs into the coffee cup |
| V8b | v8b-equipe.webp | 2026-09-30 | 1536×1024 |
| V8c | v8c-agence.webp | 2026-09-30 | 1536×1024. Small stray mark on the hub's top-left face |
| V2 | v2-outils.webp | 2026-09-30 | 1536×1024 |
| V10 | v10-sur-mesure.webp | 2026-09-30 | Cropped to 1437×1024 around the headset row, so the Sur-mesure band keeps the calendar in frame |
| V12 | v12-404.webp | 2026-09-30 | 1536×1024 (3:2, not 1:1) |
| V14 | v14-bientot.webp | 2026-09-30 | Transparent. Trimmed to an 844×844 square around the box (source 1254×1254) |
