# Nuxt 4 Migration Plan

## Background

`npm audit fix` upgraded Nuxt from 3.21.2 to 3.21.7, which introduced a regression
in `@nuxt/vite-builder` where `resolveServerEntry` throws with `ssr: false` (SPA mode).
The fix was applied to Nuxt 4.4.6+ but **not backported to Nuxt 3.x** (issue #35114).
We pinned back to 3.21.2 as a stopgap; this migration moves us to Nuxt 4 where it is fixed.

References:
- https://github.com/nuxt/nuxt/issues/35072 — regression report
- https://github.com/nuxt/nuxt/issues/35114 — not backported to 3.x
- https://nuxt.com/docs/getting-started/upgrade — official migration guide

---

## Step 1 — Run the official codemod

```bash
npx codemod@0.18.7 nuxt/4/migration-recipe
```

Handles most mechanical renames automatically (dedupe values, data defaults, etc.).

---

## Step 2 — Bump packages

```bash
npm install nuxt@^4.0.0
```

Target `4.4.7`+ where the `ssr: false` regression is fixed. Also update:
- `@nuxtjs/tailwindcss` — verify Nuxt 4 compatible version
- `@nuxtjs/google-fonts` — verify Nuxt 4 compatible version

---

## Step 3 — New directory structure (`app/`)

Nuxt 4 moves source files into `app/`. These need to move:

| From | To |
|---|---|
| `components/` | `app/components/` |
| `layouts/` | `app/layouts/` |
| `pages/` | `app/pages/` |
| `plugins/` | `app/plugins/` |
| `assets/` | `app/assets/` |

`public/`, `nuxt.config.ts`, `tailwind.config.js`, `tsconfig.json`, `package.json`
all **stay at the project root**.

> **Alternative:** skip the move by adding `srcDir: '.'` to `nuxt.config.ts`.
> Easier but not idiomatic. Worth doing properly since the project is small.

---

## Step 4 — `nuxt.config.ts` cleanup

- `ssr: false` — keep it; the project needs SPA mode for vue-leaflet (reads `window.L`
  at module evaluation time). The regression is fixed in Nuxt 4, so it will work again.
- `build.transpile: ['leaflet', '@vue-leaflet/vue-leaflet']` — verify still needed in Nuxt 4.
- Remove the `// SPA mode` comment explaining the regression (no longer relevant).
- Optionally add `future: { compatibilityVersion: 4 }` to be explicit.

---

## Step 5 — Delete `app.html`

`app.html` at the project root is a dead Nuxt 2 template artifact — it is not used by
Nuxt 3 or 4. Delete it to avoid confusion.

---

## Step 6 — Verify Leaflet plugin

`plugins/leaflet.client.ts` sets `window.L = { ...Leaflet }` before any component
mounts. Confirm this still runs before vue-leaflet components are evaluated after the
directory move to `app/plugins/`.

---

## What does NOT apply to this project

| Breaking change | Reason it doesn't apply |
|---|---|
| `useAsyncData`/`useFetch` singleton data | Project uses `fetch()` and `axios` directly |
| `window.__NUXT__` removal | Not referenced anywhere in the codebase |
| `vmid`/`hid` head tag removal (unhead v2) | Not used in any `useHead()` calls |
| Component name normalization for `<KeepAlive>` | No `<KeepAlive>` usage |
| `generate` config removal | Not using static generation |

---

## Risk areas

1. **`@vue-leaflet/vue-leaflet`** — verify it works under Nuxt 4 / Vite 6 environment API.
2. **Module order** — `@nuxtjs/tailwindcss` and `@nuxtjs/google-fonts` may need ordering
   attention in `nuxt.config.ts` under Nuxt 4.
3. **`~` alias** — now points to `app/` by default. Any `~/assets/...` or `~/components/...`
   imports in CSS or config will resolve correctly after the move, but double-check
   `tailwind.config.js` content paths.
