"use client";

import { useState } from "react";
import {
  matchFenceHeightRule,
  type FenceHelperAnswers,
  type YesNo,
  FENCE_HELPER_DISCLAIMER,
} from "@/lib/fence-447";
import { Compass, Info, RotateCcw, Ruler, ArrowRight } from "lucide-react";

type Field = keyof FenceHelperAnswers;

const PROPERTY_OPTIONS = [
  { value: "residential", label: "Single / multiple residential" },
  { value: "non-residential", label: "Non-residential" },
] as const;

function YesNoRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: YesNo | undefined;
  onChange: (v: YesNo) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex gap-1.5 flex-shrink-0" role="group" aria-label={label}>
        {(["yes", "no"] as const).map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              aria-pressed={active}
              className={`px-3 py-1 text-xs font-medium rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                active
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:border-blue-300"
              }`}
            >
              {opt === "yes" ? "Yes" : "No"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function FenceHeightHelper() {
  const [a, setA] = useState<FenceHelperAnswers>({});
  const set = (field: Field) => (v: string) => setA((prev) => ({ ...prev, [field]: v as never }));
  const reset = () => setA({});

  const match = matchFenceHeightRule(a);

  return (
    <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
      <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-1">
        <Compass className="w-5 h-5 text-blue-500" aria-hidden="true" />
        Find the Relevant Fence Height Rule
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Answer a few questions to see the Table 1 row that likely applies. This is a reference tool, not a legal
        determination.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Questions */}
        <div className="rounded-xl border border-gray-100 p-4">
          {/* Property type */}
          <div className="pb-3 border-b border-gray-100">
            <p className="text-sm text-gray-700 mb-2">Property type</p>
            <div className="flex flex-wrap gap-1.5">
              {PROPERTY_OPTIONS.map((opt) => {
                const active = a.propertyType === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set("propertyType")(opt.value)}
                    aria-pressed={active}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                      active
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-gray-200 text-gray-600 hover:border-blue-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <YesNoRow
            label="Is it a hedge, shrub, or vegetation acting as a fence?"
            value={a.vegetation}
            onChange={set("vegetation")}
          />
          <YesNoRow
            label="Is it a fence for a tennis court, baseball diamond, or other recreational facility?"
            value={a.recreational}
            onChange={set("recreational")}
          />
          <YesNoRow
            label="Does it abut a rapid transit right-of-way?"
            value={a.rapidTransit}
            onChange={set("rapidTransit")}
          />

          {a.recreational !== "yes" && a.rapidTransit !== "yes" && (
            <>
              <YesNoRow label="Is the fence in a front yard?" value={a.frontYard} onChange={set("frontYard")} />

              {a.frontYard === "yes" && (
                <YesNoRow
                  label="Is it within 2.4 m of a lot line abutting a public highway (not a lane)?"
                  value={a.withinHighwayLotLine}
                  onChange={set("withinHighwayLotLine")}
                />
              )}

              {a.frontYard === "no" && (
                <>
                  <YesNoRow label="Is it on an unroofed deck?" value={a.onDeck} onChange={set("onDeck")} />
                  {a.onDeck === "no" && (
                    <>
                      <YesNoRow
                        label="Is it within 2.4 m of a driveway?"
                        value={a.nearDriveway}
                        onChange={set("nearDriveway")}
                      />
                      {a.nearDriveway === "yes" && (
                        <YesNoRow
                          label="Is it within 2.4 m of a side lot line abutting a public highway?"
                          value={a.nearSideHighway}
                          onChange={set("nearSideHighway")}
                        />
                      )}
                      {a.nearDriveway === "no" && (
                        <YesNoRow
                          label="Does it abut a multi-residential / non-residential property, a public highway, or a public walkway?"
                          value={a.abutsMajor}
                          onChange={set("abutsMajor")}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}

          <button
            type="button"
            onClick={reset}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" /> Reset answers
          </button>
        </div>

        {/* Result */}
        <div className="rounded-xl border border-gray-100 p-4 bg-gray-50/60 flex flex-col">
          {match ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex-shrink-0">
                  {match.row.item}
                </span>
                <p className="text-sm font-semibold text-gray-900">Likely Table 1 — Item {match.row.item}</p>
              </div>
              <p className="text-xs text-gray-600 mb-3">{match.row.description}</p>

              <div className="rounded-lg bg-white border border-blue-100 p-3 mb-3">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-700 uppercase tracking-wide mb-1">
                  <Ruler className="w-3.5 h-3.5" aria-hidden="true" /> Applicable maximum height
                </p>
                <p className="text-lg font-bold text-gray-900">{match.appliedHeight}</p>
                <p className="text-xs text-gray-500 mt-0.5">Column read: {match.column}</p>
              </div>

              <p className="text-xs text-gray-600 mb-3">{match.row.plain}</p>

              <ul className="flex flex-col gap-1.5">
                {match.notes.map((n) => (
                  <li key={n} className="flex items-start gap-1.5 text-[11px] text-gray-500">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                    {n}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-full py-6">
              <Compass className="w-8 h-8 text-gray-300 mb-2" aria-hidden="true" />
              <p className="text-sm text-gray-500">
                Answer the questions on the left to see the likely Table 1 row and maximum height.
              </p>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-gray-200 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <p className="text-[11px] text-amber-800">{FENCE_HELPER_DISCLAIMER}</p>
          </div>
        </div>
      </div>

      <a
        href="https://www.toronto.ca/legdocs/municode/1184_447.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        Verify against Chapter 447 Table 1 <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
      </a>
    </section>
  );
}
