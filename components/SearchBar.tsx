"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar({
  defaultValue = "",
  placeholder = "Search bylaws — try 'garbage', 'pool fence', 'long grass', 'heating'…",
  autoFocus = false,
}: {
  defaultValue?: string;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="flex gap-2 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <label htmlFor="site-search" className="sr-only">Search Toronto bylaws</label>
        <input
          id="site-search"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-sm shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-400 transition-colors"
        />
      </div>
      <button
        type="submit"
        className="px-5 sm:px-6 py-3.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        Search
      </button>
    </form>
  );
}
