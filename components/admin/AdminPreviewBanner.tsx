"use client";
import { useEffect, useState } from "react";
import { ShieldAlert, LogOut } from "lucide-react";
import { ADMIN_PREVIEW_UI_COOKIE } from "@/lib/admin-preview/auth";

/**
 * Thin bar shown on every page while an admin is logged in and the public site
 * is closed. It first checks the non-sensitive UI hint cookie (so ordinary
 * visitors do no work), then confirms the real state server-side via
 * /api/admin-preview/status (which reads the signed httpOnly cookie).
 */
export default function AdminPreviewBanner() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const hasHint = document.cookie
      .split("; ")
      .some((c) => c.startsWith(`${ADMIN_PREVIEW_UI_COOKIE}=`));
    if (!hasHint) return;

    let cancelled = false;
    fetch("/api/admin-preview/status", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { active: false }))
      .then((d) => { if (!cancelled) setActive(Boolean(d?.active)); })
      .catch(() => { /* ignore — banner simply stays hidden */ });
    return () => { cancelled = true; };
  }, []);

  if (!active) return null;

  return (
    <div className="sticky top-0 z-[60] w-full border-b border-amber-300/70 bg-amber-50 print:hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 px-4 py-1.5 sm:px-6 lg:px-8">
        <p className="flex items-center gap-1.5 text-xs font-medium text-amber-900">
          <ShieldAlert className="h-3.5 w-3.5 flex-shrink-0 text-amber-600" aria-hidden="true" />
          <span>
            Admin Preview Mode — <span className="font-normal text-amber-800">public access is currently closed.</span>
          </span>
        </p>
        <a
          href="/api/admin-logout"
          className="inline-flex flex-shrink-0 items-center gap-1 rounded-md border border-amber-300 bg-white/70 px-2 py-1 text-[11px] font-medium text-amber-800 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <LogOut className="h-3 w-3" aria-hidden="true" /> Exit preview
        </a>
      </div>
    </div>
  );
}
