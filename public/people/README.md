# Portraits

Portraits of the people named on the site: Hichem Hammouche, Amine Hallab and
Odo Klein. They are shown square, next to each name, on the homepage
(« Construit par des agences ») and on /a-propos.

## Current files: generated stand-ins

| File | Person | Source |
| --- | --- | --- |
| hichem-hammouche.webp | Hichem Hammouche | AI-generated stand-in, 2026-09-30 |
| amine-hallab.webp | Amine Hallab | AI-generated stand-in, 2026-09-30 |
| odo-klein.webp | Odo Klein | AI-generated stand-in, 2026-09-30 |

These are not photos of these people. Replace each one with the person's real
photo before launch: visitors and anyone who knows them will take the picture
next to a name and title as that person.

## Replacing a stand-in with a real photo

1. Take or find the person's own photo (sharp, face well lit, shoulders up).
2. Retouch it to match the set with the prompt below, in Krea or ChatGPT image
   edit, with the photo attached as the source image.
3. Export square (1:1, at least 640×640) into this folder under the same file
   name. The path in `PEOPLE` (`src/config/visuals.ts`) stays the same.
4. Update the table above.

## Retouch prompt (attach the person's own photo)

> Retouch this portrait photo. Keep the person's face, skin, hair, expression
> and proportions exactly as in the source: do not reshape, smooth away
> features, slim, age or beautify anything. Change only: the background to a
> clean, even light grey (#ECEEF2) with a very soft falloff; the light to soft
> diffused daylight from the upper left, gentle and natural, no harsh shadows;
> exposure and white balance to a neutral, slightly warm look. Crop to a square,
> head and shoulders, eyes at about 40% from the top, a little space above the
> head. Keep their own clothes, cleaned of creases and lint only. No text, no
> logo, no watermark, no added accessories.

Run one person at a time and compare to the source. If the face drifts from the
original, reject the result and run it again.
