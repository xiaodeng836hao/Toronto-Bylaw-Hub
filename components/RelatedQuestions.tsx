import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

/**
 * "Related questions" block for content pages. Each question links to the Ask
 * page with a prefilled query (/ask?q=...), giving a source-based answer.
 */
export default function RelatedQuestions({
  questions,
  title = "Related questions",
  className = "",
}: {
  questions: string[];
  title?: string;
  className?: string;
}) {
  if (questions.length === 0) return null;
  return (
    <section aria-label={title} className={`bg-white rounded-2xl border border-gray-100 subtle-shadow p-6 ${className}`}>
      <h2 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-blue-500" aria-hidden="true" /> {title}
      </h2>
      <p className="text-sm text-gray-500 mb-4">Get a simple, source-based reference answer on the Ask page.</p>
      <ul className="flex flex-col gap-2">
        {questions.map((q) => (
          <li key={q}>
            <Link
              href={`/ask?q=${encodeURIComponent(q)}`}
              className="group flex items-center justify-between gap-3 rounded-xl border border-gray-100 px-3.5 py-2.5 hover:border-blue-200 hover:bg-blue-50/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <span className="text-sm text-gray-700 group-hover:text-blue-700 transition-colors">{q}</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-400 flex-shrink-0 group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
