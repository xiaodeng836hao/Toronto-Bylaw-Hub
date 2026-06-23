"use client";
import { useState } from "react";
import { MessageSquare, CheckCircle2, Loader2, AlertCircle, ChevronDown } from "lucide-react";

const userTypes = ["Resident", "Bylaw Officer", "Other"];
const feedbackTypes = ["Bug Report", "Suggestion", "Missing Bylaw", "Content Correction", "Other"];
const featureOptions = [
  "Home", "TMC Chapters", "Fences", "Pool Fence Guide", "Zoning",
  "Prohibited Plants", "Photo Review", "Search", "Feedback", "Other",
];
const MAX_MESSAGE = 3000;
const MAX_NAME = 100;
const MAX_SUBJECT = 150;

type FormState = {
  name: string;
  email: string;
  userType: string;
  feedbackType: string;
  feature: string;
  subject: string;
  message: string;
  canContact: boolean;
  /** Honeypot — must stay empty; bots tend to fill every field. */
  website: string;
};

const EMPTY: FormState = { name: "", email: "", userType: "", feedbackType: "", feature: "", subject: "", message: "", canContact: false, website: "" };

export default function FeedbackPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [emailSent, setEmailSent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const emailValid = !form.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const messageTooLong = form.message.length > MAX_MESSAGE;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.userType || !form.feedbackType || !form.message.trim()) {
      setError("Please fill in all required fields (marked with *).");
      return;
    }
    if (!emailValid) {
      setError("Please enter a valid email address, or leave it blank.");
      return;
    }
    if (messageTooLong) {
      setError(`Your message is too long. Please keep it under ${MAX_MESSAGE} characters.`);
      return;
    }
    // Honeypot: a real user never fills this. Pretend success without sending.
    if (form.website.trim()) {
      setSubmitted(true);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          userType: form.userType,
          feedbackType: form.feedbackType,
          category: form.feedbackType,
          feature: form.feature,
          subject: form.subject,
          message: form.message,
          canContact: form.canContact && !!form.email,
          pageUrl: typeof document !== "undefined" ? document.referrer || window.location.href : "",
          website: form.website,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Submission failed");
      setEmailSent(data?.emailSent !== false);
      setSubmitted(true);
    } catch {
      setError("We could not submit your feedback right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-600" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Thank you for your feedback.</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          {emailSent
            ? "Your message has been sent. Your input helps improve this public bylaw reference tool."
            : "Your feedback was received, but the email notification could not be sent at this time. Your input still helps improve this public bylaw reference tool."}
        </p>
        <button
          onClick={() => { setSubmitted(false); setEmailSent(true); setForm(EMPTY); }}
          className="btn-primary mt-6 px-5 py-2.5 font-medium rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 text-amber-700 ring-1 ring-inset ring-amber-600/10 mb-4">
          <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="kicker">Community Input</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Submit Feedback</h1>
        <p className="text-gray-500">
          Help us improve this bylaw reference tool. Report bugs, suggest missing bylaws, correct content, or share ideas.
        </p>
      </div>

      {/* Privacy note */}
      <div className="mb-5 p-3.5 rounded-xl border border-amber-200 bg-amber-50 flex gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-xs text-amber-800">
          Do not submit confidential, personal, or emergency information through this form. For urgent issues or to report a bylaw concern, use Toronto 311.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6 flex flex-col gap-5">
        {/* Honeypot — visually hidden, ignored by humans, often filled by bots */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden" >
          <label htmlFor="website">Leave this field empty</label>
          <input
            id="website"
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
          />
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
            Name <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={form.name}
            maxLength={MAX_NAME}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-400 transition-colors"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email Address <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="your@email.com"
            aria-invalid={!emailValid}
            className={`w-full px-4 py-2.5 border rounded-xl text-sm bg-white focus:outline-none focus-visible:ring-2 transition-colors ${
              emailValid ? "border-gray-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-400" : "border-red-300 focus-visible:ring-red-500/20"
            }`}
          />
          {!emailValid && <p className="text-xs text-red-500 mt-1">Please enter a valid email address.</p>}
          <label className="mt-2.5 flex items-center gap-2 text-sm text-gray-600 select-none cursor-pointer">
            <input
              type="checkbox"
              checked={form.canContact}
              onChange={(e) => update("canContact", e.target.checked)}
              disabled={!form.email}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
            />
            Can we contact you about this feedback?
            {!form.email && <span className="text-xs text-gray-400">(add an email first)</span>}
          </label>
        </div>

        {/* User Type */}
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700 mb-1.5">
            I am a <span className="text-red-500">*</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {userTypes.map((ut) => (
              <button
                key={ut}
                type="button"
                onClick={() => update("userType", ut)}
                aria-pressed={form.userType === ut}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  form.userType === ut
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                {ut}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Feedback Type */}
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700 mb-1.5">
            Feedback Type <span className="text-red-500">*</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {feedbackTypes.map((ft) => (
              <button
                key={ft}
                type="button"
                onClick={() => update("feedbackType", ft)}
                aria-pressed={form.feedbackType === ft}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors ${
                  form.feedbackType === ft
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                {ft}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Feature / Page */}
        <div>
          <label htmlFor="feature" className="block text-sm font-medium text-gray-700 mb-1.5">
            Which part of the site? <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <select
              id="feature"
              name="feature"
              value={form.feature}
              onChange={(e) => update("feature", e.target.value)}
              className="w-full appearance-none px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-400 transition-colors pr-9"
            >
              <option value="">Select a page or feature…</option>
              {featureOptions.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" aria-hidden="true" />
          </div>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">
            Subject <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="subject"
            type="text"
            name="subject"
            value={form.subject}
            maxLength={MAX_SUBJECT}
            onChange={(e) => update("subject", e.target.value)}
            placeholder="A short summary"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-400 transition-colors"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            rows={5}
            maxLength={MAX_MESSAGE}
            aria-invalid={messageTooLong}
            placeholder="Describe your feedback, suggestion, or report in as much detail as possible..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-400 transition-colors resize-none"
          />
          <p className={`text-xs mt-1 ${form.message.length > MAX_MESSAGE - 100 ? "text-amber-600" : "text-gray-400"}`}>
            {form.message.length}/{MAX_MESSAGE} characters
          </p>
        </div>

        {error && (
          <div role="alert" className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-xl disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              Submitting…
            </>
          ) : (
            "Submit Feedback"
          )}
        </button>

        <p className="text-xs text-gray-400">
          Your feedback is anonymous unless you provide your email. We do not use your contact information for marketing purposes.
        </p>
      </form>
    </div>
  );
}
