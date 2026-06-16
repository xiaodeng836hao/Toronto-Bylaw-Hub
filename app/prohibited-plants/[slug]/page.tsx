import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  prohibitedPlants, getPlantBySlug, HAZARD_TAGS, LOCATION_TYPES,
  PROHIBITED_PLANTS_OFFICIAL_URL,
  type HazardTag, type LocationType,
} from "@/lib/prohibited-plants";
import { OFFICIAL_311_URL } from "@/lib/mock-data";
import { getPlantImages, getImageCredit, IMAGE_USAGE_NOTICE } from "@/lib/plant-images";
import {
  PlantImagePanel, STAGE_ICONS, TONE_CLASSES,
  HAZARD_LEVEL_CLASSES, HAZARD_TAG_CLASSES,
} from "@/components/plant-visuals";
import { EnlargeableImage, PlantGallery } from "@/components/plant-lightbox";
import {
  ArrowLeft, ArrowRight, Leaf, Calendar, MapPin, ShieldAlert, AlertTriangle, Info,
  CheckCircle2, XCircle, Trash2, Eye, HardHat, Phone, ExternalLink, Sparkles,
  ListChecks, GitCompareArrows, Stethoscope, Clock, ZoomIn, Camera,
} from "lucide-react";

const hazardTagLabel = (t: HazardTag) => HAZARD_TAGS.find((h) => h.value === t)?.label ?? t;
const locationLabel = (l: LocationType) => LOCATION_TYPES.find((x) => x.value === l)?.label ?? l;

export function generateStaticParams() {
  return prohibitedPlants.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const plant = getPlantBySlug(slug);
  if (!plant) return { title: "Plant Not Found" };
  return {
    title: `${plant.commonName} — Prohibited Plant`,
    description: `${plant.commonName} (${plant.scientificName}): ${plant.summary} How to identify it across the seasons and remove it safely in Toronto.`,
  };
}

export default async function PlantDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plant = getPlantBySlug(slug);
  if (!plant) notFound();

  const heroImage = plant.images.find((i) => i.icon === "flower") ?? plant.images[0];
  const photos = getPlantImages(plant.slug);
  const credit = getImageCredit(plant.slug);
  const heroPhoto = photos
    ? { src: photos.main, stage: plant.commonName, alt: photos.mainAlt, description: photos.mainCaption }
    : null;
  const isHazardous = plant.hazardLevel === "High" || plant.hazardLevel === "Extreme";
  const others = prohibitedPlants.filter((p) => p.slug !== plant.slug).slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link href="/prohibited-plants" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          All Prohibited Plants
        </Link>
      </nav>

      {/* Hazard alert for high-risk species */}
      {isHazardous && (
        <div className="mb-6 p-4 rounded-xl border border-rose-300 bg-rose-50 flex gap-3">
          <ShieldAlert className="w-6 h-6 text-rose-600 flex-shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold text-rose-800 text-sm mb-0.5">Safety warning — {plant.hazardLevel.toLowerCase()} hazard</p>
            <p className="text-sm text-rose-700">{plant.safetyCautions[0]}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${HAZARD_LEVEL_CLASSES[plant.hazardLevel]}`}>
            <Leaf className="w-3.5 h-3.5" aria-hidden="true" /> {plant.hazardLevel} hazard
          </span>
          {plant.hazardTags.map((t) => (
            <span key={t} className={`text-xs font-medium px-2.5 py-1 rounded-full ${HAZARD_TAG_CLASSES[t]}`}>{hazardTagLabel(t)}</span>
          ))}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{plant.commonName}</h1>
        <p className="text-lg italic text-gray-400 mt-1">{plant.scientificName}</p>
        <p className="text-gray-600 leading-relaxed max-w-3xl mt-4">{plant.summary}</p>
      </header>

      {/* Overview: image + at-a-glance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {photos && heroPhoto ? (
          <EnlargeableImage
            photo={heroPhoto}
            credit={credit}
            caption={photos.mainCaption}
            className="aspect-[4/3]"
            sizes="(max-width: 768px) 100vw, 560px"
            priority
          />
        ) : (
          <PlantImagePanel image={heroImage} showSource />
        )}
        <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-green-600" aria-hidden="true" /> At a glance
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex gap-3">
              <dt className="w-32 flex-shrink-0 text-gray-400 flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" aria-hidden="true" /> Key clue</dt>
              <dd className="text-gray-700 font-medium">{plant.keyVisualClue}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-32 flex-shrink-0 text-gray-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" aria-hidden="true" /> Best months</dt>
              <dd className="text-gray-700">{plant.bestMonthsToIdentify}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-32 flex-shrink-0 text-gray-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" aria-hidden="true" /> Often found</dt>
              <dd className="text-gray-700">{plant.commonLocations.map(locationLabel).join(", ")}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-32 flex-shrink-0 text-gray-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" aria-hidden="true" /> Easiest to remove</dt>
              <dd className="text-gray-700">{plant.easiestToRemove}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Why prohibited */}
      <Section icon={Info} title="Why it's prohibited" tone="amber">
        <p className="text-gray-600 leading-relaxed">{plant.whyProhibited}</p>
      </Section>

      {/* Identification features */}
      <Section icon={ListChecks} title="Main identification features" tone="green">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {plant.identificationFeatures.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>
      </Section>

      {/* Look-alikes */}
      {plant.lookAlikes.length > 0 && (
        <Section icon={GitCompareArrows} title="Similar plants & look-alikes" tone="violet">
          <ul className="space-y-3">
            {plant.lookAlikes.map((la) => (
              <li key={la.name} className="text-sm">
                <span className="font-medium text-gray-900">{la.name}</span>
                <span className="text-gray-600"> — {la.howToTell}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Month-by-month timeline */}
      <Section icon={Calendar} title="Month-by-month identification timeline" tone="teal">
        <p className="text-sm text-gray-500 mb-5">{plant.bestMonthsToIdentify}.</p>
        <ol className="relative border-l-2 border-gray-100 ml-3 space-y-6">
          {plant.monthlyStages.map((stage, i) => {
            const Icon = STAGE_ICONS[stage.icon];
            const tone = TONE_CLASSES[stage.tone];
            return (
              <li key={i} className="ml-6">
                <span className={`absolute -left-[18px] flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br ${tone.panel} ring-4 ring-white`}>
                  <Icon className={`w-4 h-4 ${tone.icon}`} aria-hidden="true" />
                </span>
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="font-semibold text-gray-900 text-sm">{stage.period}</h3>
                    {stage.height && <span className="text-xs text-gray-400">· {stage.height}</span>}
                  </div>
                  <p className="text-sm text-gray-600 mb-1.5">{stage.appearance}</p>
                  <p className={`text-sm font-medium ${tone.icon}`}>{stage.keyFeature}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </Section>

      {/* Visual gallery */}
      <Section icon={Leaf} title="Growth-stage photo gallery" tone="green">
        <p className="text-sm text-gray-500 mb-4">
          Photos of {plant.commonName.toLowerCase()} at different growth stages — note the visual features described under each one to identify it confidently.
        </p>
        {photos ? (
          <>
            <PlantGallery photos={photos.gallery} credit={credit} />
            <p className="mt-3 text-xs text-gray-400 flex items-center gap-1.5">
              <ZoomIn className="w-3.5 h-3.5" aria-hidden="true" /> Click any photo to enlarge.
              {credit ? ` Image source: ${credit.source}.` : ""}
            </p>
          </>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {plant.images.map((img) => (
              <PlantImagePanel key={img.stage} image={img} size="sm" showSource />
            ))}
          </div>
        )}
      </Section>

      {/* Safe removal */}
      <section aria-labelledby="removal-heading" className="mb-8 bg-white rounded-2xl border border-green-100 subtle-shadow overflow-hidden">
        <div className="bg-green-50/60 px-6 py-4 border-b border-green-100 flex items-center gap-2">
          <HardHat className="w-5 h-5 text-green-600" aria-hidden="true" />
          <h2 id="removal-heading" className="font-bold text-gray-900">How to remove it safely</h2>
        </div>
        <div className="p-6 space-y-6">
          {isHazardous && (
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-rose-800"><strong>Safety first.</strong> {plant.professionalHelpAdvice}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Safest resident-friendly approach</p>
            <p className="text-gray-600 leading-relaxed">{plant.removal.method}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5"><HardHat className="w-3.5 h-3.5" aria-hidden="true" /> Tools & protection</p>
              <ul className="space-y-1.5">
                {plant.removal.tools.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0 mt-1.5" aria-hidden="true" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" aria-hidden="true" /> Best time of year</p>
                <p className="text-sm text-gray-600">{plant.removal.bestTime}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" aria-hidden="true" /> Monitoring</p>
                <p className="text-sm text-gray-600">{plant.removal.monitoring}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Prevent regrowth</p>
            <p className="text-sm text-gray-600">{plant.removal.preventRegrowth}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100">
              <p className="text-xs font-semibold text-rose-700 uppercase tracking-wide mb-2 flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" aria-hidden="true" /> What not to do</p>
              <ul className="space-y-1.5">
                {plant.removal.whatNotToDo.map((w) => (
                  <li key={w} className="flex items-start gap-2 text-sm text-rose-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0 mt-1.5" aria-hidden="true" /> {w}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2 flex items-center gap-1.5"><Trash2 className="w-3.5 h-3.5" aria-hidden="true" /> Disposal</p>
              <p className="text-sm text-blue-900">{plant.removal.disposal}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety cautions */}
      <Section icon={ShieldAlert} title="Safety cautions" tone="rose">
        <ul className="space-y-2">
          {plant.safetyCautions.map((c) => (
            <li key={c} className="flex items-start gap-2 text-sm text-gray-700">
              <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" aria-hidden="true" /> {c}
            </li>
          ))}
        </ul>
      </Section>

      {/* When to get professional help */}
      <Section icon={Stethoscope} title="When to get professional help" tone="amber">
        <p className="text-gray-600 leading-relaxed">{plant.professionalHelpAdvice}</p>
        <p className="text-sm text-gray-500 mt-2">{plant.disposalGuidance}</p>
      </Section>

      {/* Sources + 311 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Sources</h2>
          <ul className="space-y-2">
            {plant.officialSources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 font-medium">
                  <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" /> {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-green-600 rounded-2xl p-5 text-white flex flex-col">
          <h2 className="font-bold mb-1">Report a prohibited plant</h2>
          <p className="text-green-50 text-sm mb-4 flex-1">Found this plant growing on a property? Report it to the City through official Toronto 311.</p>
          <a
            href={OFFICIAL_311_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-green-700 text-sm font-semibold rounded-xl hover:bg-green-50 transition-colors"
          >
            <Phone className="w-4 h-4" aria-hidden="true" /> Report through Toronto 311
          </a>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 mb-6">
        <p className="text-xs text-gray-500 leading-relaxed">
          This page is provided for general educational and reference purposes only. Plant identification results are not a legal determination. Always confirm prohibited plant information using{" "}
          <a href={PROHIBITED_PLANTS_OFFICIAL_URL} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 font-medium">official City of Toronto resources</a>. For hazardous species or large infestations, consider seeking professional advice.
        </p>
      </div>

      {/* Image credits & usage */}
      <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 mb-10">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5" aria-hidden="true" /> Image credits &amp; usage
        </p>
        <p className="text-xs text-gray-500 leading-relaxed">
          {IMAGE_USAGE_NOTICE}
          {credit ? ` Photos on this page: ${credit.source}.` : ""}{" "}
          <Link href="/feedback" className="text-green-600 hover:text-green-700 font-medium">Contact us</Link>.
        </p>
      </div>

      {/* More plants */}
      <section aria-labelledby="more-heading">
        <h2 id="more-heading" className="text-lg font-bold text-gray-900 mb-4">More prohibited plants</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {others.map((p) => (
            <Link
              key={p.id}
              href={`/prohibited-plants/${p.slug}`}
              className="group flex items-center justify-between gap-2 bg-white rounded-xl border border-gray-100 subtle-shadow p-4 hover:border-green-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
            >
              <div className="min-w-0">
                <p className="font-medium text-gray-900 text-sm group-hover:text-green-700 transition-colors truncate">{p.commonName}</p>
                <p className="text-xs text-gray-400 truncate">{p.keyVisualClue}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-green-500 flex-shrink-0 transition-colors" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  tone,
  children,
}: {
  icon: React.ElementType;
  title: string;
  tone: "green" | "amber" | "rose" | "violet" | "teal";
  children: React.ReactNode;
}) {
  const toneMap: Record<string, string> = {
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    violet: "bg-violet-50 text-violet-600",
    teal: "bg-teal-50 text-teal-600",
  };
  return (
    <section className="mb-8">
      <h2 className="flex items-center gap-2.5 text-lg font-bold text-gray-900 mb-4">
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${toneMap[tone]}`}>
          <Icon className="w-4 h-4" aria-hidden="true" />
        </span>
        {title}
      </h2>
      <div className="pl-0 sm:pl-[2.625rem]">{children}</div>
    </section>
  );
}
