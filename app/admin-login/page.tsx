import type { Metadata } from "next";
import Image from "next/image";
import AdminLoginForm from "./AdminLoginForm";

export const metadata: Metadata = {
  title: { absolute: "Admin Preview Access" },
  description: "Private admin preview access.",
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: "/admin-login" },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-[calc(100dvh-1px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mx-auto mb-6 flex items-center justify-center gap-2.5">
          <Image src="/logo.svg" alt="BylawGuide logo" width={40} height={40} className="object-contain" priority />
          <span className="text-base font-semibold tracking-tight text-gray-900">Toronto Bylaw Guide</span>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white subtle-shadow p-6 sm:p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Admin Preview Access</h1>
          <p className="text-sm text-gray-500 mb-6">
            Enter the admin credentials to view the site.
          </p>
          <AdminLoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Private preview access only. Not an official City of Toronto website.
        </p>
      </div>
    </div>
  );
}
