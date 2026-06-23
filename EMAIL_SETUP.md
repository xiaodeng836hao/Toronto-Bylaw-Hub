# Email Setup (V6.6) — Feedback notifications

When a visitor submits the **Feedback** form, BylawGuide can send a notification
email to **info@bylawguide.ca**. Email is **optional**: without a provider
configured, feedback is still received (and stored if a database is configured),
and the user sees a graceful "notification could not be sent" note.

> All email is sent **server-side** from the API route
> (`app/api/feedback/route.ts` → `lib/email/send-feedback-email.ts`). Credentials
> are read from the server environment only and are **never** exposed to the
> browser. Do **not** prefix any email variable with `NEXT_PUBLIC`, and never send
> email directly from the client.

## How it works

1. The form posts to `POST /api/feedback`.
2. The route checks the honeypot, rate-limits, validates, saves to the DB (if
   `DATABASE_URL` is set), then calls `sendFeedbackEmail(...)`.
3. `sendFeedbackEmail` picks a provider:
   - **Resend** if `RESEND_API_KEY` is set (preferred — verified-domain
     deliverability), or
   - **SMTP** if `SMTP_HOST` + `SMTP_USER` + `SMTP_PASS` are set (nodemailer).
4. The email goes to `FEEDBACK_TO_EMAIL` (default `info@bylawguide.ca`). If the
   user supplied an email, it is set as **`replyTo`** — never as the `From`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `FEEDBACK_TO_EMAIL` | Where notifications are sent. Default `info@bylawguide.ca`. |
| `SMTP_HOST` | SMTP server hostname (Option A). |
| `SMTP_PORT` | SMTP port. `465` = implicit TLS; `587` = STARTTLS (default 587). |
| `SMTP_USER` | SMTP username (usually the full mailbox address). |
| `SMTP_PASS` | SMTP password / app password. |
| `SMTP_FROM` | From header, e.g. `BylawGuide Feedback <info@bylawguide.ca>`. |
| `RESEND_API_KEY` | Resend API key (Option B). Takes precedence over SMTP. |
| `RESEND_FROM_EMAIL` | Verified Resend sender, e.g. `BylawGuide Feedback <noreply@bylawguide.ca>`. |

Set these in `.env.local` (dev) and in your host's environment (production).
Never commit real values.

## Option A — SMTP (domain mailbox, e.g. Hostinger)

Use the SMTP credentials for the `info@bylawguide.ca` mailbox from your host.

```bash
SMTP_HOST=smtp.hostinger.com      # your host's SMTP server
SMTP_PORT=465                     # 465 (SSL) or 587 (STARTTLS)
SMTP_USER=info@bylawguide.ca
SMTP_PASS=your-mailbox-password
SMTP_FROM=BylawGuide Feedback <info@bylawguide.ca>
FEEDBACK_TO_EMAIL=info@bylawguide.ca
```

The `From` address should be a real mailbox on a domain you control. Sending
"from" an address you don't control (e.g. a visitor's Gmail) breaks SPF/DKIM and
gets the mail rejected — which is why the visitor's email is used only as
`replyTo`.

## Option B — Resend (recommended for deliverability)

1. Create an account at [resend.com](https://resend.com) and verify the
   `bylawguide.ca` domain (adds the required DNS records for you).
2. Create an API key.

```bash
RESEND_API_KEY=re_xxxxxxxx
RESEND_FROM_EMAIL=BylawGuide Feedback <noreply@bylawguide.ca>
FEEDBACK_TO_EMAIL=info@bylawguide.ca
```

`noreply@bylawguide.ca` must be on the verified domain. Notifications still land
in `info@bylawguide.ca`.

## Production deployment notes

- Add the variables in your host's environment settings, then redeploy.
  (On Hostinger, set them under **Deployments → Environment Variables** — the
  same place the AI keys live — and "Save and redeploy".)
- Confirm the chosen provider's variables are all present; partial config (e.g.
  `SMTP_HOST` without `SMTP_PASS`) is treated as **not configured**.
- The route runs on the Node.js runtime (`export const runtime = "nodejs"`),
  required by nodemailer.

## Deliverability — SPF / DKIM / DMARC

For mail to reach inboxes (not spam), configure these DNS records for
`bylawguide.ca` through your email provider:

- **SPF** — a TXT record authorizing your sender (your host's SMTP servers, or
  Resend's).
- **DKIM** — the signing keys your provider gives you (Resend adds these during
  domain verification).
- **DMARC** — a policy record, e.g.
  `v=DMARC1; p=none; rua=mailto:info@bylawguide.ca`.

If using `info@bylawguide.ca` as the SMTP sender:

- make sure the mailbox actually exists,
- make sure the SMTP credentials are correct,
- make sure SPF/DKIM are configured for the domain,
- avoid sending from an unverified address.

If SMTP is unreliable, switch to Resend and send from a verified domain address
like `noreply@bylawguide.ca`, while still delivering notifications to
`info@bylawguide.ca`.

## Why these choices

- **Server-side only:** email credentials must never reach the browser, and SMTP
  cannot be spoken from a browser anyway. The browser only POSTs form JSON.
- **User email as `replyTo`, not `From`:** lets you reply directly to the
  submitter while keeping a domain-authenticated `From` so SPF/DKIM/DMARC pass.
- **Graceful failure:** if email is unconfigured or delivery fails, the user
  still gets a success acknowledgement and the error is logged server-side only —
  raw transport errors are never shown to users.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| No email arrives | Is a provider configured? Check server logs for `[Feedback email]`. |
| `Resend 401/403` | API key wrong, or `RESEND_FROM_EMAIL` domain not verified. |
| `SMTP ... EAUTH` | Wrong `SMTP_USER`/`SMTP_PASS`; some hosts need an app password. |
| `SMTP ... ETIMEDOUT` | Wrong host/port, or the host blocks outbound SMTP. |
| Mail goes to spam | SPF/DKIM/DMARC not set for the sending domain. |
| User sees "could not be sent" | Provider unconfigured or send failed — feedback was still received. |

## Manual test checklist

1. Submit with name + email + category + message → success; email arrives;
   `replyTo` is the user's email.
2. Submit without email → success; email arrives; no `replyTo`.
3. Empty message → validation error (client and server).
4. Invalid email → validation error.
5. Unset SMTP/Resend → no crash; user sees the graceful "received but not sent"
   message; DB save (if configured) still works.
6. Honeypot (`website`) filled → request returns generic success, no email sent.
