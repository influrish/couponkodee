# CouponKodee

Coupons, deals and cashback storefront with a Payload CMS admin panel.

- **Stack:** Next.js 15 (App Router), React 19, Payload CMS 3.49, MongoDB, Tailwind CSS, pnpm
- **Production:** Cloudflare Workers via OpenNext (`@opennextjs/cloudflare`)
- **Local:** runs fully offline after the first install (local MongoDB, local media storage)

## Quick start (local)

Requirements: Node.js 20.9+ and pnpm 9 or 10 (`npm i -g pnpm`, or prefix commands with `npx pnpm@10`).

```bash
cd NextDeals
pnpm install
cp .env.example .env.local        # then set PAYLOAD_SECRET (openssl rand -base64 32)

pnpm db:local                     # terminal 1: local MongoDB on 127.0.0.1:27017 (keep open)
pnpm seed                         # terminal 2: stores, coupons, deals, cashback + admin user
pnpm dev                          # http://localhost:3000, admin at http://localhost:3000/admin
```

`pnpm db:local` downloads a MongoDB binary once (about 70 MB, cached in `node_modules/.cache`) and stores data in `.data/mongodb`, so data survives restarts. If you already run MongoDB (Homebrew, Docker or Atlas), skip it and point `MONGODB_URI` at your server.

`pnpm seed` is idempotent: re-running it only adds what is missing. It creates the admin account from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`. If no password is set, it generates one and prints it once.

The storefront also works **without a database**: every page falls back to the static catalogue in `lib/stores-data.ts`. The admin panel then shows a setup screen instead of the login.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Yes, for CMS | MongoDB connection string. Local: `mongodb://127.0.0.1:27017/couponkodee` |
| `PAYLOAD_SECRET` | Yes, for CMS | Random string (32+ chars) used to sign auth tokens |
| `NEXT_PUBLIC_SITE_URL` | No | Public base URL; defaults to `http://localhost:3000` |
| `SEED_ADMIN_EMAIL` | No | Admin account for `pnpm seed` / `pnpm admin:reset-password` |
| `SEED_ADMIN_PASSWORD` | No | Its password (12+ chars). Generated and printed if empty |
| `OUTBOUND_ALLOWED_HOSTS` | No | Extra comma-separated hosts `/out` may redirect to (e.g. affiliate networks) |
| `LOCAL_MONGO_PORT`, `LOCAL_MONGO_DATA_DIR` | No | Overrides for `pnpm db:local` |

Never commit `.env.local`. In production, store `MONGODB_URI` and `PAYLOAD_SECRET` as encrypted Cloudflare secrets.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Development server on port 3000 |
| `pnpm build` / `pnpm start` | Production build and server |
| `pnpm db:local` | Local persistent MongoDB (no system install needed) |
| `pnpm seed` | Idempotent seed of categories, stores, offers and admin user |
| `pnpm admin:reset-password` | Set or rotate the admin password from env (or generate one) |
| `pnpm typecheck` | TypeScript check (`next build` skips type errors, so run this) |
| `pnpm test:unit` | Unit tests, no database needed |
| `pnpm test:int` | Integration tests against `MONGODB_URI` (skipped if not configured) |
| `pnpm test:e2e:install` / `pnpm test:e2e` | Install Chromium once, then run Playwright tests on port 3100 |
| `pnpm generate:types` | Regenerate `src/payload-types.ts` after changing collections |
| `pnpm preview` / `pnpm deploy` | Cloudflare Workers preview and deploy (OpenNext) |

## Project layout

```
app/(frontend)/      Storefront pages (own root layout, header, footer, 404/error pages)
app/(payload)/       Payload admin panel and REST API (/admin, /api/*)
app/out/route.ts     Affiliate click tracking redirect (see below)
app/api/             Custom endpoints: auth/register, newsletter, contact, cashback-visibility
components/          UI components and client contexts (auth, country, cashback)
lib/                 Data access with static fallbacks, helpers (outbound links, rate limit)
src/collections/     Payload collections; src/access/roles.ts holds access rules
src/lib/             Payload client, DB config and health check
scripts/             Seeding, local MongoDB, admin password reset, maintenance scripts
tests/               unit/, int/ (Payload + MongoDB), e2e/ (Playwright)
```

## How things work

### Data access and resilience

Storefront data goes through `lib/db-stores.ts` and `lib/cms-settings.ts`. Each call tries Payload first and falls back to static data on any error. `src/lib/payload.ts` and `src/lib/db-health.ts` keep that fallback fast:

- Payload's MongoDB adapter calls `process.exit(1)` if its **first** connection fails. Every entry point that can initialise Payload (data helpers, `/admin`, `/api/*`) pings MongoDB first, with results cached for 15 to 30 s. An unreachable database therefore degrades the site instead of killing the server.
- If an established connection drops, queries fail fast until Mongoose reconnects, so pages don't wait out timeouts.

### Region URLs (`/in`, `/us`, ...)

Every storefront page is served under a region prefix: `/in/stores`, `/us/store/amazon`, `/uk/deals?q=nike`. Regions come from `lib/countries-data.ts`: add a country there and its URLs work everywhere.

- `middleware.ts` serves `/<region>/<path>` from the normal `app/(frontend)` routes, so no page folders are duplicated. URLs without a region redirect to the saved region (cookie), then the visitor's country (Cloudflare `cf-ipcountry`), then India. Unsupported countries go to `/global`.
- Choosing a region anywhere (header or page filters) calls `setCountry`, which swaps the prefix on the current page.
- Use `Link` from `@/components/localized-link` (a drop-in for `next/link`) and `localizeHref()` from `lib/regions.ts` for hand-built URLs. `/admin`, `/api`, `/out`, `/media` and static files are never prefixed.
- Each page outputs a canonical URL and `hreflang` alternates for every region (`x-default` → `/global`).

### Access control

Rules live in `src/access/roles.ts`:

- **Public:** read stores, offers, products, categories, pages and globals; subscribe to the newsletter.
- **Shoppers** (`role: user`): read and update only their own account. They can't change `role`, can't edit content, and can't open `/admin`.
- **Staff** (`admin`, `editor`): manage content, subscribers and contact messages. Only admins manage users and roles.

Public sign-up goes through `/api/auth/register`, which always creates `role: user`.

### Outbound affiliate links (`/out`)

```
/out?url=<merchantUrl>&merchant=<slug>&code=<couponCode>&subid=<optional>
```

The route adds `utm_source=couponkodee`, `utm_medium=affiliate`, `utm_campaign=<merchant>_deal`, `subid` and `coupon`, then returns a 307 redirect. `subid` is taken from the query, then from the logged-in user's id, then defaults to `couponkodee`.

Only http(s) URLs on hosts of known stores or offers (plus `OUTBOUND_ALLOWED_HOSTS`) are allowed. Anything else falls back to the store page, so `/out` can't be abused as an open redirect.

### Rate limiting

`/api/auth/register`, `/api/newsletter` and `/api/contact` are rate-limited per IP in memory (`lib/rate-limit.ts`). That state is per process, or per isolate on Cloudflare. Use Cloudflare Rate Limiting rules for stricter guarantees in production.

## Design system

Typography, colour, spacing and layout come from one set of tokens on `:root` in `app/globals.css`. `tailwind.config.ts` maps Tailwind's utilities onto those tokens, so `text-sm`, `font-bold`, `tracking-wide` and `container` all resolve there. To restyle the site, change a token, not individual pages.

| Token group | Where it applies | Notes |
| --- | --- | --- |
| Font | `--font-sans` | One family, Plus Jakarta Sans, self-hosted from `@fontsource-variable` (no Google request; works offline) |
| Type scale | `text-2xs` to `text-6xl` | `2xs` 11px (micro badges only), `xs` 13, `sm` 14 (buttons, secondary), `md` 15 (card titles), `base` 16 (body). `2xl` and up are fluid with `clamp()`: section headings 24–30px, hero up to 52px |
| Weights | `font-medium` to `font-black` | `bold` = 650, `extrabold` = 700, `black` = 750 (display headings only) |
| Colour | `--foreground`, `--muted-foreground` and others | Body text slate-900, secondary text slate-600 (WCAG AA on white) |
| Layout | `container`, `--section-space`, `--card-padding` | Container max 1360px with 16/24/32px gutters (keep `screens["2xl"]` in sync with `--container-max`) |

Conventions:

- Use scale utilities (`text-sm`, `text-3xl`), never arbitrary sizes like `text-[15px]`. Larger headings need one class: the fluid tokens replace `text-2xl sm:text-3xl md:text-4xl` chains.
- Use plain `container` for page width. Don't add `mx-auto` or `px-*` to it.
- Shared building blocks: `BrandLogo` (header, footer, auth pages), `Breadcrumb` (`variant="bar"` under the header), `StoreTile` / `VerifiedName`, `PageSkeleton`, and the `section-*` classes for homepage sections.
- The storefront is light-only (`forcedTheme="light"`). Dark mode would need dark variants throughout the components first.
- `cn()` (`lib/utils.ts`) knows the custom `text-2xs` / `text-md` sizes. Register any new size token there too.

## Production

**Deploy on a Node host, not Cloudflare Workers.** See [DEPLOY.md](DEPLOY.md). Payload with MongoDB fails on Workers after the first request (shared database connections aren't allowed across requests). Cloudflare is still used for DNS and caching.

### Legacy: Cloudflare Workers (not supported for the admin)

Pushing to `main` on `influrish/couponkodee` triggers the Cloudflare build (`pnpm deploy` runs `opennextjs-cloudflare build && deploy`). Required secrets: `MONGODB_URI` (Atlas, with the IP access list allowing Cloudflare egress) and `PAYLOAD_SECRET`. Set `NEXT_PUBLIC_SITE_URL` as a plain variable.

Known production limitations:

- Media uploads use the local `media/` folder, which Workers can't write to. Production uploads need an object-storage adapter (for example R2/S3 via `@payloadcms/storage-s3`).
- `sharp` (image resizing) isn't available on Workers, so uploaded images aren't resized there.
