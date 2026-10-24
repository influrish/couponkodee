# Deploying CouponKodee (Node host + Cloudflare DNS)

**Why not Cloudflare Workers?** Payload CMS with MongoDB keeps one shared database connection open. Cloudflare Workers don't allow a connection opened by one visitor's request to be reused by the next, so after the first request every page and the admin fail with "Worker's code had hung" (error 1101). The same build runs correctly as a normal Node server, which is how Payload is designed to run. Keep Cloudflare for DNS, SSL and caching, and run the app on a Node host.

Verified: `next start` against the live Atlas database serves `/admin/login`, the storefront and the REST API repeatedly without errors.

## 1. Pick a host

Any host that runs a Node 20.9+ web service with at least **2 GB of RAM during the build** works (Next.js and Payload are memory-hungry to build): Railway, Render (paid plan), Fly.io, DigitalOcean App Platform, or a VPS. Vercel also works but its free plan forbids commercial use.

## 2. Create the service (Railway example)

1. Create a project from the GitHub repo `influrish/couponkodee`.
2. Settings: **Root directory** `NextDeals`.
3. **Build command:** `pnpm install --frozen-lockfile && pnpm build`
4. **Start command:** `pnpm start` (Next.js listens on the `PORT` the host provides).
5. **Variables** (all runtime, and `NEXT_PUBLIC_SITE_URL` also at build time):

| Variable | Value |
| --- | --- |
| `MONGODB_URI` | Atlas address, with the password URL-encoded (`@` → `%40`, `#` → `%23`) and `/couponkodee` before the `?` |
| `PAYLOAD_SECRET` | random 32+ character string |
| `NEXT_PUBLIC_SITE_URL` | `https://couponkodee.com` |
| `NODE_ENV` | `production` |

6. Health check path: `/api/health` (returns `{"ok":true,"database":"connected"}`).
7. In MongoDB Atlas, the IP Access List must allow the host. `0.0.0.0/0` is simplest; a host with a static IP lets you restrict it.

## 3. Point the domain

In Cloudflare **DNS → Records**:

1. Remove the Worker's custom domains (Workers & Pages → couponkodee → Domains) so they don't conflict.
2. Add a `CNAME` for `couponkodee.com` (and `www`) pointing to the host's domain, **Proxied** (orange cloud). Cloudflare flattens a root CNAME automatically.
3. Add the same domain in the host's dashboard, and set SSL/TLS mode to **Full (strict)**.

## 4. Verify

- `https://couponkodee.com/api/health` shows `connected`
- `https://couponkodee.com/admin` shows the login form
- Create/edit a store in the admin and confirm it appears on the site (pages revalidate within 60 seconds)

## Notes

- **Media uploads** are written to the `media/` folder. Most hosts reset the disk on every deploy, so attach a persistent volume mounted at `NextDeals/media`, or add an object-storage adapter (S3 or R2).
- The Cloudflare Worker deploy scripts (`pnpm cf:build`, `pnpm deploy`) remain in `package.json` but are not supported for production for the reason above. Disconnect the Worker's GitHub build once the Node host is live.
- Rotate the Atlas database password and `PAYLOAD_SECRET` if they were ever shared in chat or tickets.
