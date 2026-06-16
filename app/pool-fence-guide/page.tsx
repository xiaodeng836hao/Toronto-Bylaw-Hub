"use client";
import { useState } from "react";
import Link from "next/link";
import { poolFenceChecklist, OFFICIAL_311_URL } from "@/lib/mock-data";
import {
  CheckCircle2, Circle, ExternalLink, Waves, ShieldCheck, ShieldX,
  AlertTriangle, Info, ChevronDown, ChevronUp, ClipboardList,
  HardHat, FileCheck, Printer, BookOpen, Phone,
} from "lucide-react";

const OFFICIAL_POOL_GUIDE_URL =
  "https://www.toronto.ca/services-payments/building-construction/building-permit/before-you-apply-for-a-building-permit/building-permit-application-guides/small-residential-project-guides/pool-fence-enclosures/";

function handlePrintChecklist() {
  if (typeof window !== "undefined") window.print();
}

const checklistCategories = ["All", "Permits", "Structure", "Gates"];

const FAQ = [
  {
    q: "Does my above-ground pool need an enclosure?",
    a: "Yes, if it is capable of holding water deeper than 60cm (approximately 2 feet) and the pool wall itself does not form a compliant barrier. In most cases, above-ground pools require a fence around them unless the pool wall height meets all enclosure requirements and has a lockable access ladder.",
  },
  {
    q: "Can my house wall count as part of the pool enclosure?",
    a: "Yes. The wall of your house or garage can serve as part of the enclosure, provided all other sides meet the fence height and gap requirements, and any doors leading directly to the pool area are self-closing and self-latching.",
  },
  {
    q: "What happens if my pool gate does not self-latch?",
    a: "A non-self-latching gate is a violation of Chapter 447. You may receive an Order to Comply requiring you to repair or replace the gate hardware. Non-compliant pool enclosures present a serious drowning risk and enforcement can be immediate.",
  },
  {
    q: "Do I need a permit to replace an existing pool fence?",
    a: "Yes. Replacing, altering, or constructing a new pool enclosure requires a building permit from Toronto Building, even if you are replacing a fence that already existed. The new fence must comply with current requirements.",
  },
  {
    q: "How long does it take to get a pool enclosure permit?",
    a: "Processing times vary. As of 2024, simple residential permits through the online portal may take 10–20 business days. Check the current timeline at toronto.ca/building or visit a Civic Centre for assistance.",
  },
  {
    q: "Can I use lattice or decorative fencing for a pool enclosure?",
    a: "Only if the openings do not allow passage of a sphere greater than 100mm (4 inches) in diameter. Many decorative lattice patterns have openings larger than this and would not comply. Solid board, chain-link, and certain aluminum styles are commonly used.",
  },
  {
    q: "What is the minimum height for a pool enclosure?",
    a: "The minimum height is 1.2 metres (approximately 4 feet) measured from finished grade on the outside of the fence. The height must be maintained on all sides of the enclosure.",
  },
];

export default function PoolFenceGuidePage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [filterCat, setFilterCat] = useState("All");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const filteredChecklist = poolFenceChecklist.filter(
    (item) => filterCat === "All" || item.category === filterCat
  );

  const totalRequired = poolFenceChecklist.filter((i) => i.isRequired).length;
  const checkedRequired = poolFenceChecklist.filter((i) => i.isRequired && checked[i.id]).length;
  const progress = totalRequired > 0 ? Math.round((checkedRequired / totalRequired) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-600 text-xs font-medium mb-4">
          <Waves className="w-3.5 h-3.5" />
          Chapter 447 – Fences
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Swimming Pool Permit &amp; Pool Fence Guide</h1>
        <p className="text-gray-500 max-w-2xl">
          Everything Toronto residents need to know about pool enclosure permits, safety requirements, gate rules, and inspection checklists. Based on Toronto Municipal Code Chapter 447.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* When You Need a Permit */}
          <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-cyan-500" />
              When Do You Need a Pool Enclosure Permit?
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              In Toronto, <strong>any pool capable of holding water deeper than 60cm (approximately 2 feet)</strong> must be fully enclosed by a fence or barrier that meets requirements in the Toronto Municipal Code. This applies to:
            </p>
            <ul className="flex flex-col gap-2 mb-4">
              {[
                "In-ground pools",
                "Above-ground pools (if the pool wall itself is not the enclosure)",
                "Hot tubs and spas deeper than 60cm with unsecured lids",
                "Existing pools where the enclosure is being replaced or modified",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-sm text-amber-800">
                <strong>Important:</strong> A building permit is required from Toronto Building before constructing, altering, or replacing a pool enclosure. Construction without a permit may result in orders to remove and rebuild the enclosure.
              </p>
            </div>
          </div>

          {/* Homeowner Preparation List */}
          <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <HardHat className="w-5 h-5 text-amber-500" />
              Homeowner Preparation List
            </h2>
            <p className="text-sm text-gray-500 mb-4">Before applying for your permit, gather and prepare the following:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { item: "Site plan (to scale)", detail: "Showing property boundaries, pool location, and fence placement" },
                { item: "Pool dimensions", detail: "Length, width, depth, and distance from property lines" },
                { item: "Fence specifications", detail: "Height, material, post spacing, and gap sizes" },
                { item: "Gate details", detail: "Hardware type, location, swing direction, and latch mechanism" },
                { item: "Photo ID", detail: "Government-issued ID for permit applicant" },
                { item: "Property ownership proof", detail: "Tax bill, deed, or mortgage statement" },
                { item: "Contractor info (if applicable)", detail: "Name, licence number, and contact details" },
                { item: "Grading plan", detail: "If the pool will affect drainage or grade of the lot" },
              ].map(({ item, detail }) => (
                <div key={item} className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Requirements */}
          <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Enclosure Requirements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Minimum Height", req: "1.2 metres (≈ 4 feet) on all sides", note: "Measured from finished grade on the outside of the enclosure" },
                { title: "Maximum Gap Size", req: "No opening greater than 100mm (4 inches)", note: "Applies to fence panels, gates, and the gap at ground level" },
                { title: "Full Enclosure", req: "Pool must be completely enclosed", note: "No direct access from outside without passing through a latched gate" },
                { title: "Horizontal Members", req: "On pool side only", note: "Horizontal rails must face inward to prevent climbing" },
                { title: "Climbable Objects", req: "None within 1.2m of enclosure", note: "Includes furniture, equipment, trees, and structures" },
                { title: "House Wall Allowed", req: "Can form part of enclosure", note: "Doors opening to pool must be self-closing and self-latching" },
              ].map((req) => (
                <div key={req.title} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="font-semibold text-gray-900 text-sm mb-1">{req.title}</p>
                  <p className="text-sm text-gray-700 mb-1">{req.req}</p>
                  <p className="text-xs text-gray-400">{req.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Gate Requirements */}
          <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              Gate Requirements
            </h2>
            <div className="flex flex-col gap-3">
              {[
                { title: "Self-Closing", desc: "All gates must return to the closed position automatically without manual assistance. Spring-loaded hinges or a closing mechanism are required." },
                { title: "Self-Latching", desc: "All gates must engage the latch automatically when the gate closes. Gates that require manual latching do not comply." },
                { title: "Latch Position", desc: "The latch must be on the pool side and at least 1.2m above finished grade — OR on the outside but fully enclosed so it cannot be reached through the fence." },
                { title: "Gate Swing Direction", desc: "Gates should swing away from the pool (outward) to discourage children from pushing through. Recommended, but check your specific permit conditions." },
                { title: "Gate Height", desc: "Gates must be the same height as the rest of the enclosure — at least 1.2m — and have no openings larger than 100mm." },
              ].map(({ title, desc }) => (
                <div key={title} className="flex gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliant vs Non-Compliant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-green-100 subtle-shadow overflow-hidden">
              <div className="bg-green-50 px-5 py-3 flex items-center gap-2 border-b border-green-100">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800 text-sm">Compliant Examples</span>
              </div>
              <ul className="p-5 flex flex-col gap-2">
                {[
                  "Solid board fence, 1.35m high, posts every 2.4m",
                  "Chain-link fence with maximum 50mm mesh opening",
                  "Gate with spring-loaded hinges, auto-latch on pool side at 1.3m",
                  "No patio furniture within 1.2m of fence",
                  "Permit obtained and inspection passed",
                ].map((pt) => (
                  <li key={pt} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-red-100 subtle-shadow overflow-hidden">
              <div className="bg-red-50 px-5 py-3 flex items-center gap-2 border-b border-red-100">
                <ShieldX className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-red-800 text-sm">Common Non-Compliance</span>
              </div>
              <ul className="p-5 flex flex-col gap-2">
                {[
                  "Gate prop left open — gate must self-close",
                  "Latch on the outside and reachable through fence gap",
                  "Lattice panels with gaps larger than 100mm",
                  "Adirondack chair leaning against fence inside 1.2m zone",
                  "No permit obtained before construction",
                ].map((pt) => (
                  <li key={pt} className="flex items-start gap-2 text-sm text-gray-700">
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Application Process */}
          <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-blue-500" />
              Permit Application Process
            </h2>
            <div className="flex flex-col gap-4">
              {[
                { step: "1", title: "Prepare Your Documents", desc: "Site plan showing pool location, property boundaries, fence placement, and gate locations. Include pool dimensions and distance from property lines." },
                { step: "2", title: "Submit Permit Application", desc: "Apply through Toronto Building online at toronto.ca/building or in person at a Civic Centre. Select 'Pool Enclosure' as the project type." },
                { step: "3", title: "Permit Review", desc: "Toronto Building reviews your application against zoning and building code requirements. Check current processing timelines at toronto.ca/building." },
                { step: "4", title: "Construct the Enclosure", desc: "Once permit is issued, construct the pool enclosure to exactly match the approved plans. Do not deviate from the approved design." },
                { step: "5", title: "Book Inspection", desc: "Contact Toronto Building to schedule a mandatory inspection before filling the pool or allowing access to it." },
                { step: "6", title: "Pass Inspection & Close Permit", desc: "Upon passing inspection, your permit is closed out. Keep records of the permit and inspection approval." },
              ].map((s) => (
                <div key={s.step} className="flex gap-4">
                  <div className="w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {s.step}
                  </div>
                  <div className="pt-0.5">
                    <p className="font-semibold text-gray-900 text-sm">{s.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <a
              href="https://www.toronto.ca/services-payments/building-construction/building-permit/before-you-apply-for-a-building-permit/building-permit-application-guides/small-residential-project-guides/pool-fence-enclosures/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-600 text-white text-sm font-medium rounded-xl hover:bg-cyan-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Official City of Toronto Pool Enclosure Guide
            </a>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Frequently Asked Questions</h2>
            <div className="flex flex-col divide-y divide-gray-100">
              {FAQ.map((item, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left py-4 flex items-start justify-between gap-4 group"
                  >
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-cyan-700 transition-colors pr-2">{item.q}</span>
                    {openFaq === i
                      ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    }
                  </button>
                  {openFaq === i && (
                    <p className="text-sm text-gray-600 leading-relaxed pb-4">{item.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Checklist */}
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Compliance Checklist</h2>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                progress === 100 ? "text-green-700 bg-green-50" : "text-cyan-700 bg-cyan-50"
              }`}>
                {checkedRequired}/{totalRequired} required
              </span>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-2 mb-5">
              <div
                className={`h-2 rounded-full transition-all ${progress === 100 ? "bg-green-500" : "bg-cyan-500"}`}
                style={{ width: `${progress}%` }}
              />
            </div>

            {progress === 100 && (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-100 mb-4">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                <p className="text-xs font-semibold text-green-700">All required items checked!</p>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5 mb-4">
              {checklistCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCat(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    filterCat === cat ? "bg-cyan-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto pr-1">
              {filteredChecklist.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left w-full group"
                >
                  {checked[item.id] ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 group-hover:text-gray-400 flex-shrink-0 mt-0.5 transition-colors" />
                  )}
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className={`text-sm font-medium ${checked[item.id] ? "line-through text-gray-400" : "text-gray-800"}`}>
                        {item.title}
                      </p>
                      {item.isRequired && (
                        <span className="text-xs text-red-500 font-medium">Required</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handlePrintChecklist}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 text-white text-sm font-medium rounded-xl hover:bg-cyan-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
              Print Checklist
            </button>

            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => setChecked({})}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Reset
              </button>
              <a
                href={OFFICIAL_POOL_GUIDE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-cyan-600 hover:text-cyan-700 font-medium"
              >
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
                Official Guide
              </a>
            </div>
          </div>

          {/* Reference to Chapter 447 */}
          <Link
            href="/tmc-chapters/447"
            className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5 flex items-start gap-3 hover:border-cyan-200 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
          >
            <div className="w-9 h-9 bg-cyan-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-cyan-600" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 group-hover:text-cyan-700 transition-colors">Chapter 447 — Fences</p>
              <p className="text-xs text-gray-500 mt-0.5">Read the full bylaw chapter covering fences and pool enclosures.</p>
            </div>
          </Link>

          {/* Quick contact + 311 */}
          <div className="bg-cyan-600 rounded-2xl p-5 text-white">
            <p className="font-bold mb-1 text-sm">Questions about permits?</p>
            <p className="text-cyan-100 text-xs mb-3">Contact Toronto Building for permit inquiries.</p>
            <div className="flex flex-col gap-1.5 text-xs text-cyan-100 mb-4">
              <span>📞 416-338-0338</span>
              <span>🌐 toronto.ca/building</span>
            </div>
            <a
              href={OFFICIAL_311_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-cyan-700 text-sm font-medium rounded-lg hover:bg-cyan-50 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" aria-hidden="true" />
              Report through Toronto 311
            </a>
          </div>
        </div>
      </div>

      {/* Print-only checklist (hidden on screen, shown when printing) */}
      <div className="print-area hidden print:block">
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
          Toronto Pool Fence &amp; Enclosure — Compliance Checklist
        </h2>
        <p style={{ fontSize: 12, color: "#444", marginBottom: 4 }}>
          Based on Toronto Municipal Code Chapter 447 (Fences). For general reference only — confirm requirements with Toronto Building.
        </p>
        <p style={{ fontSize: 12, color: "#444", marginBottom: 16 }}>
          Property / address: ______________________________   Date: ______________
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {poolFenceChecklist.map((item) => (
            <li key={item.id} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid #e5e7eb", breakInside: "avoid" }}>
              <span style={{ display: "inline-block", width: 16, height: 16, border: "1.5px solid #555", borderRadius: 3, flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontSize: 13 }}>
                <strong>{item.title}</strong>{item.isRequired ? " (Required)" : " (Recommended)"}<br />
                <span style={{ color: "#555" }}>{item.description}</span>
              </span>
            </li>
          ))}
        </ul>
        <p style={{ fontSize: 11, color: "#666", marginTop: 16 }}>
          Official guide: toronto.ca pool fence enclosures · Toronto Building: 416-338-0338
        </p>
      </div>

      <div className="mt-8 p-5 rounded-xl border border-amber-200 bg-amber-50 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          This guide is for general reference only. Requirements may vary based on your property, zone, and permit conditions. Always confirm specific requirements with Toronto Building before starting construction.
        </p>
      </div>
    </div>
  );
}
