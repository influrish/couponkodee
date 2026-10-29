# Deploying CouponKodee (Node host + Cloudflare DNS)

**Why not Cloudflare Workers?** Payload CMS with MongoDB keeps one shared database connection open. Cloudflare Workers don't allow a connection opened by one visitor's request to be reused by the next, so after the first request every page and the admin fail with "Worker's code had hung" (error 1101). The same build runs correctly as a normal Node server, which is how Payload is designed to run. Keep Cloudflare for DNS, SSL and caching, and run the app on a Node host.

Verified: `next start` against the live Atlas database serves `/admin/login`, the storefront and the REST API repeatedly without errors.

## 1. Create the service on Render (Blueprint)

The repo root has a `render.yaml` that sets everything except the two secrets.

1. In Render: **New → Blueprint**, connect the GitHub repo `influrish/couponkodee`, branch `main`.
2. Render reads `render.yaml` and proposes a web service `couponkodee` (Starter plan, Singapore, 1 GB disk for media). When asked, enter:

| Variable | Value |
| --- | --- |
| `MONGODB_URI` | Atlas address, with the password URL-encoded (`@` → `%40`, `#` → `%23`) and `/couponkodee` before the `?` |
| `PAYLOAD_SECRET` | the same value the Worker used, or existing logins stop working. A new one is fine if everyone can log in again |

3. Click **Apply**. The first build takes about 5 to 10 minutes.
4. Open the service's URL shown at the top of its Render page (for example `https://couponkodee.onrender.com`) and check `/api/health` and `/admin`. Both must work before you move the domain.

Do **not** add `NODE_ENV=production` as a variable: it makes the install skip build tools and the build fails. The start command sets it.

## 2. Allow Render in MongoDB Atlas

Do this before clicking **Apply** in step 1 (it is probably already set, since the Worker connects from changing IPs). Atlas → **Network Access → Add IP Address → Allow access from anywhere** (`0.0.0.0/0`). Render's outbound IPs are listed under the service's **Connect → Outbound** tab if you prefer to restrict access.

## 3. Point the domain

In Cloudflare **DNS → Records**:

1. Remove the Worker's custom domains (Workers & Pages → couponkodee → Domains) so they don't conflict.
2. Add a `CNAME` for `couponkodee.com` (and `www`) pointing to the service's `.onrender.com` host, **Proxied** (orange cloud). Cloudflare flattens a root CNAME automatically.
3. In Render → the service → **Settings → Custom Domains**, add `couponkodee.com` and `www.couponkodee.com`, then in Cloudflare set SSL/TLS mode to **Full (strict)**.

## 4. Verify

- `https://couponkodee.com/api/health` shows `connected`
- `https://couponkodee.com/admin` shows the login form
- Create/edit a store in the admin and confirm it appears on the site (pages revalidate within 60 seconds)

## Notes

- **Media uploads** are kept on the Render disk mounted at `NextDeals/media`. On start, images committed to the repo are copied onto the disk if missing; existing uploads are never overwritten. A disk means one instance and a few seconds of downtime per deploy.
- The Cloudflare Worker deploy scripts (`pnpm cf:build`, `pnpm deploy`) remain in `package.json` but are not supported for production for the reason above. Disconnect the Worker's GitHub build once the Node host is live.
- Rotate the Atlas database password and `PAYLOAD_SECRET` if they were ever shared in chat or tickets.
