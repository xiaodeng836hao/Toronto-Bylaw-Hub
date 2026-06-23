"use client";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Floating "back to top" button. Appears once the page is scrolled down and
 * smoothly returns the user to the top. Rendered once in the root layout, so it
 * is available on every page. Hidden when printing.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      setVisible(window.scrollY > 400);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      title="Back to top"
      className={`fixed bottom-[5.5rem] right-6 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-blue-600 shadow-lg ring-1 ring-gray-200 transition-all duration-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 print:hidden ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
