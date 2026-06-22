"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import Image from "next/image";

type NavChild = { href: string; label: string };
type NavItem = { href: string; label: string } | { label: string; children: NavChild[] };

const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/ask", label: "Ask" },
  { href: "/tmc-chapters", label: "Bylaw Chapters" },
  { href: "/photo-review", label: "Photo Review" },
  { href: "/pool-fence-guide", label: "Pool Fence Guide" },
  {
    label: "Zoning",
    children: [
      { href: "/zoning", label: "Zoning Overview" },
      { href: "/landscaping", label: "Landscaping" },
      { href: "/zoning/former-north-york", label: "Former North York Zoning" },
    ],
  },
  { href: "/prohibited-plants", label: "Prohibited Plants" },
  { href: "/about", label: "About" },
  { href: "/feedback", label: "Feedback" },
];

function isLink(item: NavItem): item is { href: string; label: string } {
  return "href" in item;
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const groupActive = (children: NavChild[]) => children.some((c) => isActive(c.href));

  // Close the open desktop dropdown on Escape or click outside.
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!openDropdown) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenDropdown(null); };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenDropdown(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [openDropdown]);

  const closeAll = () => { setMenuOpen(false); setMobileExpanded(null); setOpenDropdown(null); };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/[0.06] bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      {/* Skip link for keyboard/screen-reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[60] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to main content
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          aria-label="Toronto Bylaw Guide — home"
        >
          <Image src="/logo.svg" alt="Toronto Bylaw Guide logo" width={40} height={40} className="object-contain" priority />
          <span className="text-base font-semibold tracking-tight text-gray-900 hidden sm:block">Toronto Bylaw Guide</span>
        </Link>

        <nav ref={navRef} className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {navItems.map((item) => {
            if (isLink(item)) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
                    isActive(item.href)
                      ? "bg-blue-600/10 text-blue-700 ring-1 ring-inset ring-blue-600/15"
                      : "text-gray-600 hover:text-gray-900 hover:bg-slate-100/80"
                  }`}
                >
                  {item.label}
                </Link>
              );
            }
            const open = openDropdown === item.label;
            const active = groupActive(item.children);
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={open}
                  onClick={() => setOpenDropdown(open ? null : item.label)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
                    active || open
                      ? "bg-blue-600/10 text-blue-700 ring-1 ring-inset ring-blue-600/15"
                      : "text-gray-600 hover:text-gray-900 hover:bg-slate-100/80"
                  }`}
                >
                  {item.label}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
                </button>
                {open && (
                  <div className="absolute left-0 top-full pt-1.5 w-60 z-50">
                    <ul className="rounded-xl border border-gray-100 bg-white subtle-shadow p-1.5" role="menu">
                      {item.children.map((c) => (
                        <li key={c.href} role="none">
                          <Link
                            href={c.href}
                            role="menuitem"
                            onClick={() => setOpenDropdown(null)}
                            aria-current={isActive(c.href) ? "page" : undefined}
                            className={`block rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                              isActive(c.href) ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-slate-100 hover:text-gray-900"
                            }`}
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
          <Link
            href="/search"
            aria-label="Search the site"
            className="ml-1 p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
          >
            <Search className="w-5 h-5" />
          </Link>
        </nav>

        <button
          className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
          {navItems.map((item) => {
            if (isLink(item)) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeAll}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href) ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            }
            const expanded = mobileExpanded === item.label;
            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => setMobileExpanded(expanded ? null : item.label)}
                  aria-expanded={expanded}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    groupActive(item.children) ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                  <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />
                </button>
                {expanded && (
                  <div className="ml-3 mt-1 flex flex-col gap-1 border-l border-gray-100 pl-3">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        onClick={closeAll}
                        aria-current={isActive(c.href) ? "page" : undefined}
                        className={`px-3 py-2 rounded-md text-sm transition-colors ${
                          isActive(c.href) ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <Link
            href="/search"
            onClick={closeAll}
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </Link>
        </div>
      )}
    </header>
  );
}
