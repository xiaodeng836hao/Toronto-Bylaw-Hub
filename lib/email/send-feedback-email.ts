// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — feedback email notification (V6.6) — SERVER ONLY
//
//  Sends a notification to FEEDBACK_TO_EMAIL (default info@bylawguide.ca) when a
//  user submits the Feedback form. Supports two providers, chosen by env:
//   • Resend (RESEND_API_KEY) via a plain fetch call — no SDK dependency.
//   • SMTP (SMTP_HOST/USER/PASS) via nodemailer (dynamically imported).
//  Resend is preferred when its key is present (better deliverability from a
//  verified domain); otherwise SMTP is used.
//
//  IMPORTANT: import this module ONLY from server code (API route handlers).
//  It reads credentials from the server env and must never reach the client.
//  Email is never sent from the browser and credentials are never NEXT_PUBLIC.
// ─────────────────────────────────────────────────────────────────────────────

const TO_EMAIL = process.env.FEEDBACK_TO_EMAIL || "info@bylawguide.ca";
const SMTP_FROM = process.env.SMTP_FROM || `BylawGuide Feedback <${TO_EMAIL}>`;
const RESEND_FROM = process.env.RESEND_FROM_EMAIL || "BylawGuide Feedback <noreply@bylawguide.ca>";

export interface FeedbackEmailPayload {
  name?: string;
  email?: string;
  subject?: string;
  message: string;
  pageUrl?: string;
  category?: string;
  userType?: string;
  userAgent?: string;
  submittedAt: string;
}

export type EmailResult =
  | { ok: true; provider: "resend" | "smtp" }
  | { ok: false; reason: "not-configured" | "send-failed"; error?: string };

/** True when at least one email provider is configured server-side. */
export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY) ||
    Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

/** A loose RFC-ish email check used only to decide whether to set replyTo. */
function isValidEmail(v?: string): v is string {
  return !!v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

/** Escape user-provided text for safe inclusion in HTML. */
function esc(v: string | undefined): string {
  return (v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function dash(v?: string): string {
  return v && v.trim() ? v.trim() : "—";
}

function buildSubject(p: FeedbackEmailPayload): string {
  const label = p.category?.trim() || p.subject?.trim() || "General feedback";
  return `New BylawGuide Feedback: ${label}`;
}

/** Plain-text body — always sent (some clients prefer it, and it's robust). */
function buildText(p: FeedbackEmailPayload): string {
  return [
    "New BylawGuide Feedback",
    "",
    `Category:    ${dash(p.category)}`,
    `Subject:     ${dash(p.subject)}`,
    `Name:        ${dash(p.name)}`,
    `Email:       ${dash(p.email)}`,
    `User type:   ${dash(p.userType)}`,
    "",
    "Message:",
    p.message.trim(),
    "",
    `Page:        ${dash(p.pageUrl)}`,
    `Submitted:   ${p.submittedAt}`,
    `User agent:  ${dash(p.userAgent)}`,
    "",
    "This message was submitted from the BylawGuide feedback page (independent, not the City of Toronto).",
  ].join("\n");
}

/** Simple, readable HTML body with all user content escaped. */
function buildHtml(p: FeedbackEmailPayload): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:4px 0;color:#111827;font-size:14px">${value}</td></tr>`;
  return `<!doctype html><html><body style="margin:0;background:#f5f6f8;padding:24px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
    <div style="background:#2563eb;color:#ffffff;padding:16px 20px;font-size:15px;font-weight:600">New BylawGuide Feedback</div>
    <div style="padding:20px">
      <table style="border-collapse:collapse;width:100%">
        ${row("Category", esc(dash(p.category)))}
        ${row("Subject", esc(dash(p.subject)))}
        ${row("Name", esc(dash(p.name)))}
        ${row("Email", esc(dash(p.email)))}
        ${row("User type", esc(dash(p.userType)))}
        ${row("Page", esc(dash(p.pageUrl)))}
        ${row("Submitted", esc(p.submittedAt))}
        ${row("User agent", esc(dash(p.userAgent)))}
      </table>
      <div style="margin-top:16px;padding-top:16px;border-top:1px solid #e5e7eb">
        <div style="color:#6b7280;font-size:13px;margin-bottom:6px">Message</div>
        <div style="color:#111827;font-size:14px;line-height:1.6;white-space:pre-wrap">${esc(p.message.trim())}</div>
      </div>
    </div>
    <div style="background:#f9fafb;color:#9ca3af;font-size:12px;padding:12px 20px;border-top:1px solid #e5e7eb">
      Submitted from the BylawGuide feedback page — an independent reference tool, not the City of Toronto.
    </div>
  </div>
</body></html>`;
}

async function sendViaResend(p: FeedbackEmailPayload): Promise<EmailResult> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [TO_EMAIL],
        subject: buildSubject(p),
        text: buildText(p),
        html: buildHtml(p),
        // The user's address is only a reply-to, never the From (avoids SPF/DMARC issues).
        ...(isValidEmail(p.email) ? { reply_to: p.email } : {}),
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return { ok: false, reason: "send-failed", error: `Resend ${res.status}: ${detail.slice(0, 200)}` };
    }
    return { ok: true, provider: "resend" };
  } catch (e) {
    return { ok: false, reason: "send-failed", error: e instanceof Error ? e.message : "Resend request failed" };
  }
}

async function sendViaSmtp(p: FeedbackEmailPayload): Promise<EmailResult> {
  try {
    // Dynamic import keeps nodemailer out of any client bundle and lets the app
    // build/run even if the package is absent in environments without SMTP.
    const nodemailer = (await import("nodemailer")).default;
    const port = Number(process.env.SMTP_PORT || 587);
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465, // implicit TLS on 465; STARTTLS otherwise
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transport.sendMail({
      from: SMTP_FROM,
      to: TO_EMAIL,
      subject: buildSubject(p),
      text: buildText(p),
      html: buildHtml(p),
      ...(isValidEmail(p.email) ? { replyTo: p.email } : {}),
    });
    return { ok: true, provider: "smtp" };
  } catch (e) {
    return { ok: false, reason: "send-failed", error: e instanceof Error ? e.message : "SMTP send failed" };
  }
}

/**
 * Send the feedback notification email. Never throws — returns a structured
 * result so the API route can save to the DB and respond gracefully even when
 * email is not configured or delivery fails.
 */
export async function sendFeedbackEmail(p: FeedbackEmailPayload): Promise<EmailResult> {
  if (process.env.RESEND_API_KEY) return sendViaResend(p);
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) return sendViaSmtp(p);
  return { ok: false, reason: "not-configured" };
}
