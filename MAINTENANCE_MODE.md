# Maintenance Mode / Admin Preview (V7.0)

Temporarily close the public site while keeping a private admin path to log in and
browse/test the full website. Nothing is deleted — pages and features stay in
place and return the moment you reopen.

## How it works

- A Next.js **middleware** (`middleware.ts`) runs on every request. When
  `PUBLIC_SITE_CLOSED=true`, it redirects public visitors to `/maintenance` and
  returns `503` for protected API routes — **unless** the request carries a valid,
  signed admin-preview cookie.
- `/admin-login` accepts a password, which is checked **server-side only** against
  `ADMIN_PREVIEW_PASSWORD`. On success the server sets a signed, `httpOnly` cookie
  (`bylawguide_admin_preview`) — the raw password is never stored in the cookie.
- While logged in and closed, a small **“Admin Preview Mode”** banner appears with
  an **Exit preview** button.
- When `PUBLIC_SITE_CLOSED` is unset or `false`, the middleware is a no-op and the
  site behaves exactly as before.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `PUBLIC_SITE_CLOSED` | `true` closes the public site; anything else keeps it open. |
| `ADMIN_PREVIEW_USERNAME` | Username entered at `/admin-login`. Optional — defaults to `admin`. |
| `ADMIN_PREVIEW_PASSWORD` | The password entered at `/admin-login`. Server-side only. |
| `ADMIN_PREVIEW_COOKIE_SECRET` | Long random string used to sign the preview cookie. |

> ⚠️ None of these use the `NEXT_PUBLIC_` prefix, so they are **never** exposed to
> the browser. Keep them only in `.env.local` (local) or your host's encrypted env
> settings (production). `.env*` is gitignored.

## Close the public site

In your environment (e.g. `.env.local` or your host's dashboard):

```env
PUBLIC_SITE_CLOSED=true
ADMIN_PREVIEW_USERNAME=admin
ADMIN_PREVIEW_PASSWORD=your-secure-password
ADMIN_PREVIEW_COOKIE_SECRET=replace-with-a-long-random-secret
```

Generate a strong secret:

```bash
openssl rand -hex 32
```

Then **redeploy** (Vercel) or **restart** (`next build && next start`) so the new
env values take effect. (`next dev` picks up `.env.local` on restart.)

## Reopen the public site

```env
PUBLIC_SITE_CLOSED=false
```

Redeploy/restart. SEO returns to normal automatically (the maintenance `noindex`
and the closed-site `robots.txt` only apply while closed).

## Log in (admin)

1. Visit `/admin-login` (also linked from the maintenance page).
2. Enter the username (default `admin`, or `ADMIN_PREVIEW_USERNAME`) and
   `ADMIN_PREVIEW_PASSWORD`.
3. On success you're redirected to `/` and can browse the whole site. The preview
   cookie lasts **7 days**.

## Log out

- Click **Exit preview** in the banner, or visit `/api/admin-logout` directly.
- This clears the preview cookies and returns you to `/maintenance`.

## Rotate the password

1. Change `ADMIN_PREVIEW_PASSWORD` (and ideally `ADMIN_PREVIEW_COOKIE_SECRET`).
2. Redeploy/restart. Rotating the secret immediately invalidates every existing
   preview cookie, forcing a fresh login.

## Security notes

- Password is verified **only server-side**, with a constant-time comparison.
- No password is hardcoded; nothing is committed (`.env*` is gitignored).
- The cookie is **signed (HMAC-SHA256)**, `httpOnly`, `sameSite=lax`, `path=/`, and
  `secure` in production.
- Login errors are generic (`Invalid password.`) and never reveal whether the env
  vars are configured.
- **Rate limiting:** `/api/admin-login` blocks an IP after **5 failed attempts per
  10 minutes**. This limiter is **in-memory / per-instance** — fine for a single
  instance or `next start`. For multi-instance / serverless production, back it
  with a shared store (Redis / Vercel KV).
- Access control is enforced by the middleware (server-side), not by hiding nav
  links. Protected pages **and** API routes (AI, RAG, feedback, content) are
  blocked while closed.

## Platform-level alternative (optional)

If you only need a quick, temporary lock and you host on Vercel, Vercel's built-in
**Deployment Protection / Password Protection** can gate the whole deployment
without code. The custom Maintenance Mode here is the in-app option that also gives
you a branded maintenance page and a dedicated admin preview path.

## Troubleshooting

- **Everyone (including me) is redirected to `/maintenance`.** You're not logged
  in, the password is wrong, or `ADMIN_PREVIEW_COOKIE_SECRET` changed after you
  logged in (which invalidates the cookie). Log in again at `/admin-login`.
- **Login always says “Invalid password”.** Confirm `ADMIN_PREVIEW_PASSWORD` and
  `ADMIN_PREVIEW_COOKIE_SECRET` are both set in the **running** environment, then
  redeploy/restart. If neither is set, login intentionally fails (no leakage).
- **Closing/opening didn't take effect.** Env changes require a redeploy (Vercel)
  or a restart; static pages bake env at build, so prefer a rebuild when toggling.
- **Banner doesn't show.** It only appears while logged in **and** closed; it
  confirms state via `/api/admin-preview/status`.

## Files

- `middleware.ts` — gate / redirect logic.
- `lib/admin-preview/auth.ts` — token signing/verification + flags (Edge-safe).
- `app/api/admin-login/route.ts` — password check + set cookie (rate-limited).
- `app/api/admin-logout/route.ts` — clear cookie.
- `app/api/admin-preview/status/route.ts` — banner state.
- `app/maintenance/page.tsx` — public maintenance page (`noindex`).
- `app/admin-login/page.tsx` + `AdminLoginForm.tsx` — login UI.
- `components/admin/AdminPreviewBanner.tsx` — preview banner.
- `components/layout/HideOnRoutes.tsx` — hides site chrome on bare routes.
