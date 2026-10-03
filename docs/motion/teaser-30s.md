# Suzalink teaser, 30 s: « Le fil »

Creative brief and storyboard for a 30-second product teaser, built as code (Remotion) from the brand assets already in this repo. Section 8 is the prompt to give Claude Opus 5.5 in Claude Code, at the root of this repo.

## 1. The idea

The brand already has its motion device: **le fil**, one blue line that links everything and folds into the S of the logo. The film is that line.

It starts as five grey threads tangled between five tools. One blue line comes in and untangles them into a single console. Then it carries the viewer through a prospecting day: a call, a booked meeting, the AI's next action, the results. At the end it folds itself into the Suzalink S and stops on a dot.

- **No cuts.** Every transition is the line moving, so the edit itself says "one console instead of five tabs".
- **The product is the hero.** Real UI, ported from the site's coded mocks, with invented French demo data.
- **Silent-first.** LinkedIn autoplays muted, so the story has to read with the sound off. Sound adds to it but nothing depends on it.

## 2. Specs

| | |
| --- | --- |
| Duration | 30 s, 900 frames at 30 fps |
| Master | 1920 × 1080 (16:9), H.264 MP4, plus a poster PNG of the last frame |
| Later cuts | 1080 × 1350 (4:5, LinkedIn feed), 1080 × 1920 (9:16). The layout system must allow them; don't build them yet |
| Language | French on screen, no voice-over |
| Channels | LinkedIn (organic and ads), site hero, sales emails |
| Safe area | 96 px on every side |
| Music | 120 BPM: one beat = 15 frames, one bar = 60 frames. Key hits land on beats |

## 3. Brand kit (all in this repo)

| What | Where | Notes |
| --- | --- | --- |
| Colours | `src/app/globals.css` `@theme` | Blue `#3355FF`, ink `#0B1220`, surface `#F5F8FC`. Module hues: sun (contacts), coral (calls), azure (emails), mint (meetings, success), violet (AI). Dawn gradient `#3355ff → #6a5cff → #c46bd8 → #ff9f7a` |
| Type | `src/fonts/` | **Lastik** 400 for headlines (one weight only, never fake a bold). **Satoshi** Regular/Medium/Bold for everything else |
| Logo | `src/components/layout/logoPaths.ts`, `public/brand/` | Symbol = one stroke (width 8.4) from dot to dot, plus a round i-dot. Only blue and ink, no stretch, shadow, glow or outline. Clear space = end-dot height |
| Easing | `globals.css` | expo-out `cubic-bezier(0.16,1,0.3,1)`, expo-in-out `cubic-bezier(0.87,0,0.13,1)`, quint-out `cubic-bezier(0.22,1,0.36,1)`, soft spring |
| Scenes to reuse | `src/components/home/UntangleScene.tsx`, `src/components/mocks/*`, `src/components/home/DashboardMock.tsx`, `HeroCards.tsx`, `HeroSky.tsx`, `src/components/ui/KeyChip.tsx` | All copy-backed, all invented data |
| French typography | `src/lib/typo.ts` | Run every on-screen string through `typo()` |

## 4. Storyboard

Frames at 30 fps. "Super" means the screen-space headline. In S1 to S6 it sits in a left column (x = 96 px, about 640 px wide, vertically centred), with an eyebrow above it in the module's hue. The UI lives on a stage in the right ~58 % of the frame. In S7 and S8 everything is centred.

### S1 « Éparpillé »: 0:00–0:04, f0–119

- **Picture.** `#F6F7F9` ground with the hairline grid. The five tool cards from `UntangleScene` are scattered and tilted (−8° to +9°) at slightly different depths across the right of the frame: CRM · Contacts, Logiciel d'appel · Numéroteur, Emailing · Campagnes, Agenda · Semaine 41, Tableur · Reporting.xlsx. Grey threads (`#B6BFCC`, some dashed) tangle between them. Coral pill, top right: « 5 onglets · 5 abonnements ».
- **Super.** « Votre prospection est éparpillée. »
- **Motion.** The cards pop in one by one from f0 (spring, 4-frame stagger). The film never opens on an empty frame. Each card keeps a restless wobble (±1.2°, ±4 px, sine waves with different periods of 50–70 f). The tangles draw on from f8 to f40. The pill pops at f28. The super rises word by word from f30 to f56 (2-frame stagger, 20 f per word, blur 10 px → 0, y 0.55 em → 0), then holds.
- **Sound.** Five dry tab clicks on the card pops (f0, 4, 8, 12, 16) over a low, unresolved pad.

### S2 « Le fil »: 0:04–0:07, f120–209

- **Motion.**
  - f120: the **blue line** enters from the left edge at mid-height. A short bright "comet" segment rides its head, and it hits the first card in 18 f.
  - f120–134: the S1 super lifts out (y −0.3 em, blur 8 px, fade).
  - f126–146: the grey tangles retract (reverse draw) and the coral pill shrinks out.
  - f132–168: the cards fly into a tidy column (expo-in-out, 30 f each, 3-frame stagger, rotation → 0). Behind them the console frame scales in (0.94 → 1) with the logo and a mint « 1 console » chip in its header. As the cards land, the blue line weaves through the column.
  - f162–178: a mint check pops on each card (3-frame stagger).
- **Super.** Eyebrow « Console d'exécution commerciale » (blue), then « Une seule console. » (f166–190).
- **Exit, f196–214.** The console frame grows into the app window of S3: same rounded rectangle, with its bounds interpolated. The five cards collapse into the dark sidebar. If that morph isn't clean, cross-dissolve the content inside a frame that keeps moving. The frame and the line never cut.
- **Sound.** A zip on the line's entry (f120), the beat comes in at f150, five ticks on the checks.

### S3 « Appels »: 0:07–0:12, f210–359

- **Picture.** The calling workspace (`CallsMock`).
  - Queue: « File d'appels · Mission Logistique IDF · 48 ».
  - Contact card: **Claire Vasseur**, Directrice des achats · Transports Lemaire, Lyon · 120 salariés · Apollo · il y a 3 j. A pulsing rose « En appel » timer.
  - Script on the « Découverte » tab, with « Claire » and « Transports Lemaire » highlighted.
- **Motion.**
  - f210–236: the window settles.
  - f236–270: the camera pushes from 1.0 to 1.6 (expo-in-out) onto the contact card and the script.
  - f236–280: the call timer counts from 00:12 to 01:48.
  - f270–282: an oversized keycap « 1 » (KeyChip style, foreground, slight 3D) slides up into the lower right.
  - **f285: key press**, 4 f down by 3 px with the shadow collapsing, then 6 f back up.
  - f287: the chip « RDV décroché » springs onto Claire's queue row.
  - f290: the toast « RDV décroché · fiche RDV créée » slides up.
  - f305–335: the camera eases back to 1.3. Claire's row dims and is struck through, and **Julien Marchetti**'s card slides in.
- **Super.** Eyebrow « Appels » (coral), then « Enchaînez les appels, pas les clics. » (f244–270).
- **Line.** It runs along the active row's accent bar, under the keycap, and into the chip at f287.
- **Exit, f350–372.** The line pulls the chip to the right and the camera whips right (motion blur).
- **Sound.** **Keycap click at f285, the hero sound, on the beat.** A soft pop on the chip.

### S4 « Rendez-vous »: 0:12–0:16, f360–479

- **Picture.**
  - The booking week (`BookingMock`): Lun. 5 to Ven. 9.
  - The floating card (`BookedCard`): « RDV confirmé · Transports Lemaire · mar. 10:30 », three avatars and a « Client prévenu » chip.
  - On the right, the « Fiche RDV » panel with a violet sparkle and « rédigée par l'IA ». Its five parts: Contexte, Interlocuteurs, Besoin exprimé, Objections, Prochaine étape.
- **Motion.**
  - f364–384: the chip lands in Tuesday 10:30 and the slot fills mint, « Confirmé ».
  - f388–404: the booked card rises forward, then floats.
  - f400–450: the brief's parts appear one by one (8-frame stagger). Each line reveals from the left like text being written (14 f).
- **Super.** Eyebrow « Rendez-vous » (mint), then « Réservé, confirmé, fiche prête. » (f376–400).
- **Line.** Slot → booked card → « Prochaine étape », then out to the right.
- **Sound.** A chime at f384, light typing ticks under the brief.

### S5 « IA »: 0:16–0:20, f480–599

- **Picture.**
  - Behind, out of focus (blur 6 px, 60 % opacity): the Analyse IA Stratégique, with ranked cards such as « Appeler en priorité entre 10 h et 12 h · Priorité haute » and « Retravailler l'objection « prestataire » · Priorité moyenne ».
  - In front, large: the **« Prochaine action »** card (`NextActionCard`) with its violet-to-blue sparkle tile.
- **Motion.**
  - f480–500: the card arrives along the line.
  - f500–540: « Rappeler les 3 leads chauds avant midi : ils ont ouvert votre email ce matin. » streams in, one word every 2 f (fade, 3 px rise).
  - f545–566: the cursor glides to « Lancer la file ».
  - **f570: click.** The button scales to 0.95 with a 4 px blue ring.
  - f574: the button turns mint with a check.
- **Super.** Eyebrow « IA » (violet), then « L'IA vous dit quoi faire ensuite. » (f494–520).
- **Sound.** A soft shimmer at f500, the click at f570.

### S6 « Pilotage »: 0:20–0:24, f600–719

- **Picture.** The team dashboard (`DashboardMock` / `TeamMock`):
  - KPI tiles: « Appels 1 284 · +12 % », « Taux de décroché 27 % · +3 pts », « RDV pris 46 / 50 » with a ring filling to 92 %.
  - A week bar chart and a leaderboard.
  - A small « Portail client » pill with a link icon.
- **Motion.**
  - f600–620: the dashboard stands up (rotateX 14° → 0, perspective 1600 px), the same move as the site hero.
  - f616–656: the KPIs count up (expo-out, French number formatting, tabular figures), the ring fills and the bars rise (2-frame stagger).
  - f650–670: leaderboard rows slide into rank.
  - f672: the « Portail client » pill pops, and the line carries it to the corner: the results get shared.
- **Super.** Eyebrow « Pilotage » (azure), then « Vos résultats, visibles par ceux qui comptent. » (f614–640).
- **Sound.** Rising soft ticks under the counters, ending at f656. A pop at f672.

### S7 « Promesse »: 0:24–0:26.5, f720–794

- **Motion.**
  - f720–746: the line loops around the dashboard. The dashboard shrinks to 0.6 and fades into the **dawn sky** (`HeroSky`: white to `#e9f0ff`, four slow aurora lights in blue, violet, peach and azure, faint twinkling sparkles).
  - f736–766: the headline, centred, in Lastik 132 px ink: « Moins d'onglets. / Plus de rendez-vous. ». It rises word by word, and « rendez-vous. » is in the dawn gradient.
  - f760–787: the hero squiggle draws under « rendez-vous ». The line has become the underline.
- **Sound.** The music lifts, with a whoosh on the squiggle.

### S8 « Signature »: 0:26.5–0:30, f795–899

- **Motion.**
  - f795–810: the headline lifts out and the sky calms towards white. The squiggle unspools to the centre.
  - **f810:** the first dot of the symbol pops.
  - f810–840: the line draws the S from that dot (expo-in-out along `SYMBOL.d`).
  - **f840:** the second dot pops. The line ends the way it started, on a dot.
  - f838–856: the « suzalink » wordmark wipes in from the left.
  - **f855:** the i-dot pops, the full stop of the film.
  - f850–868: below the logo, the blue pill « Essayer 14 jours gratuitement », then « Sans carte bancaire · Sans engagement » (muted) and « suzalink.com ».
  - f868–899: hold. Nothing moves except the faintest sky drift. This frame is the poster and the loop thumbnail.
- **Sound.** A resolved chord on f840, a tiny tick on the i-dot (f855), then a clean tail.

## 5. Motion language

- **Nothing appears without motion, and nothing moves without a reason.** Each shot has one focal point, the line included.
- **Durations.**
  - Entrances: expo-out, 14–24 f.
  - Camera moves: expo-in-out, 24–40 f.
  - Pops: spring, settling within 12 f with no more than 4 % overshoot and no visible wobble.
- **Stagger** siblings by 2–3 f. Never more than three things move independently at once, plus the line.
- **Readability.** Every super holds still for at least 36 f (1.2 s) after it lands. Any UI text the viewer must read is at least 22 px on screen at 1080p; push the camera until it is.
- **Camera.** One virtual camera per scene: scale and translate on the stage, never more than 2.0×. No rotation except the 2.5D stand-up. The stage may bleed off the right, top and bottom of the frame. Its left edge fades over 120 px so UI never runs under the super.
- **Screen space.**
  - Supers never scale with the camera.
  - The line is drawn in screen space at 4 px, blue, with round caps. Wherever it stops on something, it ends in a 7 px dot, like the logo.
  - The comet is a short, lighter segment (`#8EA2FF`) travelling along the line while it moves.
- **Blur.** Only for entrances (rise) and the one camera whip (motion blur). Everything else stays crisp.
- **Depth.** Shadows come from the tokens (`--shadow-float`, `--shadow-window`): white surfaces on `#F5F8FC`, with no extra glows.
- **Colour.**
  - S1 is muted, with only the coral warning.
  - S2 brings in the blue as the one colour.
  - S3–S6 each add the hue of their module.
  - S7–S8 resolve into the dawn gradient and the blue.
- **Type.**
  - Supers: Lastik 76 px, line-height 1.0, tracking −0.02 em.
  - Eyebrows: Satoshi Medium 22 px, uppercase, tracking 0.12 em.
  - End headline: Lastik 132 px.

## 6. Guardrails

The video can't claim more than the site does. `src/config/claims.ts` gates these because the product doesn't do them yet, so they never appear on screen:

- Mistral or « IA française »
- « Hébergé en France » or any hosting location
- 99 % uptime
- A daily AI report
- A/B tests, warm-up or mailbox rotation
- HubSpot or Salesforce imports: lead sources in the UI are Apollo or CSV only
- Grain or Fireflies

Demo data is invented: use the names from the mocks. No real customer, person or logo appears other than Suzalink's own.

## 7. Check frames

The frames to render as stills and review before the full render:

| Frame | What to check |
| --- | --- |
| 60 | The chaos and the headline |
| 150 | Mid-untangle |
| 200 | The console and its super |
| 285 | The key press |
| 320 | The chip, the toast and the next contact |
| 420 | « RDV confirmé » and the brief |
| 570 | The click on « Lancer la file » |
| 690 | The dashboard, fully counted |
| 780 | The headline and the squiggle |
| 899 | The end card (poster) |

## 8. Prompt for Claude Opus 5.5

Run it in Claude Code at the root of this repo, so it can read this file and the assets.

````text
You are a senior motion designer who is also a Remotion engineer. Build a 30-second product teaser for Suzalink, as code, in this repository. Work autonomously: make reasonable calls, don't stop to ask, and list your decisions at the end.

<context>
Suzalink is a French B2B "console d'exécution commerciale": calls, emails, lists and meeting booking in one workspace, with an AI that suggests the next action. The audience is sales directors, SDR teams and prospecting agencies in France. The film runs on LinkedIn (autoplay, muted) and in the site hero.
This repo is the Suzalink marketing site (Next.js 16, Tailwind 4). It already holds the brand: design tokens, fonts, logo geometry, and coded product mocks with invented French demo data. The film should look like the site come to life.
</context>

<brief>
docs/motion/teaser-30s.md is the source of truth: the concept, specs, scene-by-scene storyboard with frame numbers at 30 fps, copy, motion language, guardrails and check frames. Read all of it before writing any code. If a beat turns out to be impossible, or looks wrong once you see it rendered, keep its intent, make the smallest change that works, and report it.
The one idea that must survive every decision is « le fil »: a single blue line runs through the whole film, carries every transition, and at the end folds into the Suzalink S. If a shot breaks the line, fix the shot.
</brief>

<read_first>
- docs/motion/teaser-30s.md
- src/app/globals.css: the @theme tokens, easings, bg-grid, text-dawn, bg-dawn
- src/components/layout/logoPaths.ts and public/brand/README.md: logo geometry and usage rules
- src/components/home/UntangleScene.tsx: scenes 1–2 are this scene, played in time instead of on scroll
- src/components/mocks/kit.tsx, CallsMock.tsx, BookingMock.tsx, AiMock.tsx, TeamMock.tsx
- src/components/home/DashboardMock.tsx, HeroCards.tsx, HeroSky.tsx, HomeHero.tsx (the squiggle path), src/components/ui/KeyChip.tsx
- src/lib/typo.ts and src/config/claims.ts
- The Remotion docs for the version you install. Check API names there rather than relying on memory.
</read_first>

<build>
1. Project. Create a standalone Remotion 4 project in video/ with its own package.json (TypeScript, React 19, @remotion/tailwind-v4, @remotion/paths, @remotion/fonts, @remotion/motion-blur, lucide-react). Leave the site untouched: add "video" to the exclude list in the root tsconfig.json and to .dockerignore, and add video/node_modules and video/out to .gitignore.
2. Copy, don't import. Copy the @theme tokens into video/src/style.css (tokens only, not the keyframes or animate-* utilities). Copy the four fonts from src/fonts into video/public/fonts and load them with @remotion/fonts. Copy logoPaths.ts and typo.ts. Pass every on-screen string through typo().
3. Port the mocks. Copy the markup and classes of the mocks each scene needs. Then replace every time-based behaviour with values computed from useCurrentFrame(): useTicker, useInView, timers, and CSS animation or transition classes such as animate-rise, animate-pop and transition-colors. Remotion renders frames in parallel and out of order, so anything not derived from the frame will flicker or freeze in the render.
4. Structure.
   - src/timeline.ts: FPS = 30, plus every scene's start and duration and every keyed event from the storyboard, as named constants. Components contain no magic frame numbers.
   - src/motion.ts: expoOut = Easing.bezier(0.16, 1, 0.3, 1), expoInOut = Easing.bezier(0.87, 0, 0.13, 1), quintOut = Easing.bezier(0.22, 1, 0.36, 1), and helpers: rise() (blur + y + fade), pop() (spring that settles in 12 frames with at most 4 % overshoot), drawPath() (evolvePath), countUp() (French formatting, tabular figures).
   - src/layout.ts: frame size, the 96 px safe margin, the super column, the UI stage and its faded left edge. Keep layout in one place so a 4:5 cut can be added later without rewriting scenes.
   - src/Thread.tsx: the blue line as a screen-space top layer. Give each scene its own path, and make each path start exactly where the previous one ended, in screen coordinates. Draw the moving comet highlight, and put an end dot wherever the line stops on something.
   - src/scenes/S1Eparpille.tsx … S8Signature.tsx. src/Teaser.tsx assembles them with <Sequence>s, using the overlaps from the storyboard. src/Root.tsx registers the composition "Teaser30": 1920×1080, 30 fps, 900 frames.
5. Audio. If video/public/audio/ contains a music file, add it with a 12-frame fade-out at the end. Otherwise render silent. Either way, write video/AUDIO-CUES.md listing every music and SFX hit from the storyboard with its frame and timecode, for a sound designer.
</build>

<quality_bar>
This should look like an Apple- or Linear-grade product film, not a slideshow of screenshots.
- Follow section 5 of the brief exactly: durations, easing families, stagger, the 36-frame minimum hold for supers, 22 px minimum readable UI text, one focal point per shot.
- Supers and the line stay in screen space. Only the UI stage moves with the camera.
- No hard cuts and no full-frame crossfades. Every transition is carried by the line or by a frame that keeps moving.
- Spacing, radii, shadows and colours come from the tokens. Never invent a colour. The logo uses only #3355FF and #0B1220 and is never stretched, shadowed, outlined or glowing. Its draw-on is the one allowed treatment.
- Lastik is used at weight 400 only. Never let it be faux-bolded.
</quality_bar>

<guardrails>
On-screen copy comes from the brief only. Add no claim of your own. Never show any of these, which src/config/claims.ts gates because the product doesn't do them yet: Mistral or « IA française », « hébergé en France » or any hosting location, 99 % uptime, a daily AI report, A/B tests, warm-up, mailbox rotation, HubSpot or Salesforce imports (lead sources are Apollo or CSV only), Grain or Fireflies. Demo data is invented and taken from the mocks. No real customer, person or logo appears other than Suzalink's own.
</guardrails>

<verify>
Work in passes, and don't render the full MP4 until the stills pass.
1. Run `npx tsc --noEmit` in video/ and get it clean.
2. Render stills at the check frames in section 7 of the brief with `npx remotion still`, and open every PNG. For each one, check:
   - Is every text inside the 96 px safe area and unclipped?
   - Is it still readable if the frame is shown 360 px wide, as on a phone?
   - Is there exactly one focal point?
   - Does the line connect to the previous and the next shot?
   Fix what fails, then re-render those stills.
3. Render a 3-second clip around each scene boundary. Watch each one frame by frame for pops, flicker, font swaps, or a frame where the line breaks.
4. Render video/out/suzalink-teaser-30s.mp4 (H.264, yuv420p, CRF 18) and video/out/poster.png (frame 899).
5. Report:
   - what you built and how to open Remotion Studio
   - every deviation from the brief and why
   - the three frames you're least sure about, for a human to review
</verify>
````

## 9. Before you run it

- **Remotion licence.** Remotion is free for individuals and for companies of up to 3 people. Above that, commercial use needs a company licence (remotion.pro). Check this before publishing.
- **Music.** Drop a licensed 120 BPM track into `video/public/audio/` before the run, or add it later from `AUDIO-CUES.md`. Brief for the track: minimal and warm, with muted plucks or marimba, a soft kick from 0:05, no vocals and no riser clichés, resolving on a chord at 0:28.
- **English version.** Every string lives in one place in the scenes, so `/en` is a copy swap. Keep the same frame timings, and allow about 15 % longer for the English supers.
