"use client";
import { useState } from "react";
import { MessageSquare, CheckCircle2, Loader2, AlertCircle, ChevronDown } from "lucide-react";

const userTypes = ["Resident", "Other"];
const feedbackTypes = ["Bug Report", "Suggestion", "Missing Bylaw", "Content Correction", "Other"];
const featureOptions = ["TMC Chapters", "Photo Review", "Pool Fence Guide", "Zoning", "Search", "Other"];
const MAX_MESSAGE = 1000;

type FormState = {
  email: string;
  userType: string;
  feedbackType: string;
  feature: string;
  message: string;
};

const EMPTY: FormState = { email: "", userType: "", feedbackType: "", feature: "", message: "" };

export default function FeedbackPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
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
    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong submitting your feedback. Please try again.");
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
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Thank you!</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Your feedback has been received. Your input helps improve this public bylaw reference tool.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm(EMPTY); }}
          className="mt-6 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-medium mb-4">
          <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
          Community Input
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Submit Feedback</h1>
        <p className="text-gray-500">
          Help us improve this bylaw reference tool. Report bugs, suggest missing bylaws, correct content, or share ideas.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6 flex flex-col gap-5">
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
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
