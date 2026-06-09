# Map Update Process

When a new Illustrator file arrives every few months, follow these steps.

## Illustrator Export Settings

**File → Export → Export As → SVG**

| Setting | Value |
|---------|-------|
| CSS Properties | Presentation Attributes |
| Fonts | N/A (already outlined) |
| Images | Embed |
| Object IDs | Minimal |
| Decimal Places | 2 |
| Minify | Yes |
| Responsive | No (viewBox must be preserved) |

## Automated Update (planned)

The plan is to build `scripts/update-map.sh` + `npm run update-map` that:

1. Accepts the exported SVG path
2. Runs `svgo` to strip Illustrator metadata and minify
3. Renames it `ptYYYYMMDD_en.svg` (date-stamped)
4. Copies it to `public/`
5. Updates the two hardcoded filename references (`app/pages/index.vue` and `nuxt.config.ts`)
6. Deletes the old SVG from `public/`

## Manual Steps (current)

1. Export SVG from Illustrator with settings above
2. Run `npx svgo input.svg -o public/ptYYYYMMDD_en.svg`
3. Update filename in `app/pages/index.vue` (`LImageOverlay url`)
4. Update filename in `nuxt.config.ts` (preload `<link>` href)
5. Delete old SVG from `public/`
6. `npm run build` to verify
7. Deploy

## Bounds

The bounds in `app/pages/index.vue` only need changing if the Illustrator **artboard dimensions** change. If it's the same canvas with updated route content, leave them as-is:

```js
const bounds = ref([
  [83.287664, -159.522857],
  [-44.391598, 149.762878]
])
```
