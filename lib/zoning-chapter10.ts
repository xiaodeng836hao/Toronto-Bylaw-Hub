// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Hub — Zoning By-law 569-2013 Chapter 10 (Residential) provisions
//
//  REFERENCE INDEX (V3.2). The `bylawText` field contains the VERBATIM text of the
//  relevant provisions of Zoning By-law 569-2013, Chapter 10.5 (General Residential
//  regulations), transcribed from the official City source (CHAPTER_10_SOURCE_URL).
//  These Chapter 10.5 regulations apply across the Residential Zone category —
//  including the Residential Zone (R, Chapter 10.10) and Residential Detached Zone
//  (RD, Chapter 10.20). The zone-specific NUMERIC limits (exact maximum height,
//  floor space index, minimum lot frontage, required setbacks, etc.) are set by the
//  individual zone chapters (10.10 for R, 10.20 for RD).
//
//  `provisionSummary` is a concise plain-language paraphrase + interpretation.
//  This is a reference tool, NOT a legal interpretation or property-specific
//  determination. Always confirm in the official by-law and Zoning Map Viewer.
// ─────────────────────────────────────────────────────────────────────────────

import { CHAPTER_10_SOURCE_URL } from "./mock-data";

export { CHAPTER_10_SOURCE_URL };

export interface ChapterProvision {
  id: string;
  /** Which zones the provision applies to. */
  appliesTo: string;
  /** Display chapter, e.g. "Chapter 10.5". */
  chapter: string;
  /** Section reference(s), e.g. "10.5.40.60". */
  section: string;
  /** Section title. */
  title: string;
  /** Resident-friendly description of what the provision controls. */
  plainExplanation: string;
  /** Verbatim by-law text (exact wording, transcribed from the official source). */
  bylawText: string;
  /** Concise plain-language paraphrase + interpretation of the by-law text. */
  provisionSummary: string;
  /** Keywords this provision should match. */
  keywords: string[];
  /** Related Zoning topic id, if any. */
  relatedTopicId?: string;
  /** Official source URL. */
  sourceUrl: string;
}

const SRC = CHAPTER_10_SOURCE_URL;
const RES = "Residential Zone category — applies to R & RD";

export const chapter10Provisions: ChapterProvision[] = [
  {
    id: "front-yard-parking",
    appliesTo: RES,
    chapter: "Chapter 10.5",
    section: "10.5.80.10",
    title: "Parking — Front Yard, Rear Yard & Commercial Vehicles",
    plainExplanation:
      "Controls where vehicles may be parked on a residential lot — whether parking is allowed in the front yard or a side yard facing a street, and what restrictions apply to commercial vehicles.",
    bylawText: `10.5.80.10 Location
(3) Street Yard Parking Space
In the Residential Zone category, a parking space may not be in a front yard or a side yard abutting a street. This regulation does not apply if a parking space in the front yard is permitted by the City of Toronto under the authority of the City of Toronto Act, 2006, or its predecessor.
(4) Parking in the Front Yard
In the Residential Zone category, for a detached house, a semi-detached house, or a duplex, and for an individual townhouse dwelling unit where a private driveway leads directly to the dwelling unit, vehicles may be parked on the private portion of the driveway leading to a parking space.
(7) Rear Yard Parking Spaces
In the Residential Zone category, on a lot with a detached house, a semi-detached house or a duplex, a maximum of 2 parking spaces may be located outside in the rear yard.
(9) Commercial Vehicle Parking Restriction
A parking space in the Residential Zone category may be used for a commercial vehicle, if:
(A) an owner or tenant of a dwelling unit on the lot is the owner or operator of the vehicle; and
(B) it is within a wholly enclosed building.
(10) Commercial Vehicle Parking Not Permitted in Yards
A parking space located outside of a building in the Residential Zone category may not be used for:
(A) commercially licensed vehicles;
(B) construction vehicles;
(C) dump trucks;
(D) agricultural vehicles;
(E) repair or towing vehicles;
(F) tracked vehicles;
(G) vehicles with a traction engine;
(H) vehicles designed to run only on rails; and
(I) vehicles equipped with more than six wheels, excluding spare wheels.`,
    provisionSummary:
      "As a rule, you may not park in the front yard or a street-facing side yard. The exception: for a detached house, semi-detached, or duplex (and certain townhouses), vehicles may be parked on the private driveway that leads to a parking space. Up to 2 outdoor parking spaces are allowed in the rear yard, and parking on the lawn or an unpaved front yard is not permitted. Commercial vehicles may only be parked on the lot if an owner or tenant of a dwelling unit owns/operates the vehicle AND it is inside a wholly enclosed building — an outdoor parking space may NOT be used for commercially-licensed vehicles, construction vehicles, dump trucks, agricultural vehicles, repair/tow vehicles, tracked vehicles, or vehicles with more than six wheels.",
    keywords: ["front yard parking", "parking", "driveway", "parking pad", "parking space", "street yard parking", "rear yard parking", "boulevard parking", "lawn parking", "dwelling unit", "commercial vehicle", "commercial", "truck", "dump truck", "construction vehicle"],
    relatedTopicId: "front-yard-parking",
    sourceUrl: SRC,
  },
  {
    id: "lot-coverage",
    appliesTo: RES,
    chapter: "Chapter 10.5",
    section: "10.5.30.40 · 10.5.60.70",
    title: "Lot Coverage",
    plainExplanation:
      "Lot coverage is the share of the lot covered by buildings. This sets what is included or excluded from the calculation; the maximum percentage is set by your specific zone.",
    bylawText: `10.5.30.40 Lot Coverage
(1) Lot Coverage Exclusion for Permitted Encroachments
In the Residential Zone category, any part of a building or structure that is permitted to encroach into a required minimum building setback in Clause 10.5.40.60, is not included in the calculation of lot coverage.
(2) Parts of Platforms that are Not Permitted Encroachments
In the Residential Zone category, any part of a platform without main walls, such as a deck, porch, balcony or similar structure that does not encroach into a required minimum building setback, and any roof, canopy, awning or similar structure above the platform, is not included in the calculation of lot coverage, if:
(A) it is attached to or less than 0.3 metres from a building; and
(B) the lot area covered by these structures is no more than 5% of the lot area.

10.5.60.70 Lot Coverage (Ancillary Buildings and Structures)
(1) Lot Coverage Requirement for Ancillary Buildings and Structures
An ancillary building or structure on a lot in the Residential Zone category ... (B) the area of the lot covered by all ancillary buildings and structures may not exceed 10% of the lot area.`,
    provisionSummary:
      "The maximum percentage of your lot that buildings may cover is set by your specific zone (Chapter 10.10 for R, 10.20 for RD). Permitted encroachments and certain open decks/platforms (up to 5% of the lot) are excluded from the lot-coverage calculation, and all ancillary buildings (sheds, detached garages) together may not cover more than 10% of the lot.",
    keywords: ["lot coverage", "coverage", "building footprint", "maximum coverage", "footprint"],
    relatedTopicId: "landscaping",
    sourceUrl: SRC,
  },
  {
    id: "building-height",
    appliesTo: RES,
    chapter: "Chapter 10.5",
    section: "10.5.40.10",
    title: "Height of a Building",
    plainExplanation:
      "Sets how building height is measured and which rooftop features may exceed the height limit. The maximum height itself is set by your specific zone.",
    bylawText: `10.5.40.10 Height
(1) Determining the Height of a Building
In the Residential Zone category, the height of a building is the distance between the established grade and the elevation of the highest point of the building.
(2) Height of Specific Structures on a Building
In the Residential Zone category, the following structures on the roof of a building may exceed the permitted maximum height for that building by 1.5 metres:
(A) antennae;
(B) flagpoles;
(C) parapets for a green roof;
(D) satellite dishes; and
(E) weather vanes.
(3) Height of Elements for Functional Operation of a Building
In the Residential Zone category, the following equipment and structures on the roof of a building may exceed the permitted maximum height for that building by 5.0 metres, subject to regulation 10.5.40.10(4): (A) equipment used for the functional operation of the building, such as electrical, utility, mechanical and ventilation equipment (skylights may only exceed the height by 1.0 metres); (B) structures such as enclosed stairwells, roof access, elevator shafts, chimneys, vents, and water supply facilities; and (C) structures that screen the above, if the building is greater than 15.0 metres.`,
    provisionSummary:
      "Building height is measured from established grade to the highest point of the building. The maximum height for your house is set by your specific zone (Chapter 10.10 R / 10.20 RD). Certain rooftop features — antennae, flagpoles, green-roof parapets, satellite dishes, weather vanes — may exceed that limit by up to 1.5 m, and functional/mechanical equipment by up to 5.0 m subject to area limits.",
    keywords: ["building height", "height", "storeys", "maximum height", "roof height", "tall"],
    relatedTopicId: "setbacks",
    sourceUrl: SRC,
  },
  {
    id: "building-length-depth",
    appliesTo: RES,
    chapter: "Chapter 10.5",
    section: "10.5.40.20 · 10.5.40.30",
    title: "Building Length & Building Depth",
    plainExplanation:
      "Building length and depth limit how long and deep the house can be, measured along the main walls. The exact maximums are set by your specific zone.",
    bylawText: `10.5.40.20 Building Length
(1) Portion of Building to which Building Length Applies
In the Residential Zone category, building length regulations apply to all main walls of a building above and below-ground, excluding the footings for the building.
(2) Exclusion from Building Length
In the Residential Zone category, any part of a building or structure permitted to encroach into a required minimum building setback in Clause 10.5.40.60 is excluded from the calculation of building length.

10.5.40.30 Building Depth
(1) Portion of Building to which Building Depth Applies
In the Residential Zone category, building depth regulations apply to all main walls of a building above and below-ground, excluding the footings for the building.
(2) Exclusion from Building Depth
In the Residential Zone category, any part of a building or structure permitted to encroach into a required minimum building setback in Clause 10.5.40.60 is excluded from the calculation of building depth.`,
    provisionSummary:
      "Building length and building depth limit how long and how deep the house can be, measured along the main walls (above and below ground, excluding footings). The exact maximums are set by your specific zone. Parts permitted to encroach into a required setback (e.g. eaves, certain platforms) are not counted in these measurements.",
    keywords: ["building length", "building depth", "length", "depth", "main wall"],
    relatedTopicId: "setbacks",
    sourceUrl: SRC,
  },
  {
    id: "floor-area-fsi",
    appliesTo: RES,
    chapter: "Chapter 10.5",
    section: "10.5.40.40",
    title: "Floor Area & Floor Space Index (FSI)",
    plainExplanation:
      "Floor Space Index (FSI) measures total building floor area relative to lot area. This sets how it is calculated; the maximum FSI is set by your specific zone.",
    bylawText: `10.5.40.40 Floor Area
(3) Gross Floor Area Calculations for a Residential Building Other Than an Apartment Building
In the Residential Zone category, the gross floor area of a residential building, other than an apartment building, may be reduced by:
(A) the floor area of the basement;
(B) the area of a void in a floor if there is a vertical clearance of more than 4.5 metres ... to a maximum of 10% of the permitted maximum gross floor area;
(C) the area for a maximum of one parking space per dwelling unit in the building; and
(D) in addition to (C), the area used for one additional parking space in a detached house on a lot with a lot frontage of more than 12.0 metres.
(5) Floor Space Index Calculation
In the Residential Zone category, the floor space index:
(A) for a non-residential building, is the result of the gross floor area of a building divided by the area of the lot;
(B) for a residential building, other than an apartment building, is the result of the gross floor area, plus the area of an attic described in regulation 10.5.40.40(1) ... minus the areas listed in regulation 10.5.40.40(3), divided by the area of the lot; and
(C) for an apartment building, is the result of the gross floor area, minus the areas listed in regulation 10.5.40.40(4), divided by the area of the lot.`,
    provisionSummary:
      "Floor Space Index (FSI) is the total gross floor area of the building divided by the lot area. The maximum FSI is set by your specific zone (Chapter 10.10 R / 10.20 RD). For a house (not an apartment), the basement, one parking space per dwelling unit, and certain floor voids can be deducted from gross floor area when calculating FSI; attic space with over 1.4 m clearance can be included.",
    keywords: ["floor space index", "fsi", "floor area", "gross floor area", "density"],
    relatedTopicId: "setbacks",
    sourceUrl: SRC,
  },
  {
    id: "setbacks",
    appliesTo: RES,
    chapter: "Chapter 10.5",
    section: "10.5.40.70",
    title: "Building Setbacks (Front, Side & Rear Yards)",
    plainExplanation:
      "Setbacks are the minimum distances between the building's main walls and the lot lines. The exact required distances are set by your specific zone; this adds front-yard averaging and lane rules.",
    bylawText: `10.5.40.70 Setbacks
(1) Front Yard Setback - Averaging
In the Residential Zone category, if a lot is:
(A) beside one lot in the Residential Zone category, and that abutting lot has a building fronting on the same street and that building is, in whole or in part, 15.0 metres or less from the subject lot, the required minimum front yard setback is the front yard setback of that building on the abutting lot; and
(B) between two abutting lots in the Residential Zone category, each with a building fronting on the same street and those buildings are both, in whole or in part, 15.0 metres or less from the subject lot, the required minimum front yard setback is the average of the front yard setbacks of those buildings on the abutting lots.
(2) Building or Structure to be Set Back from a Lane
A building or structure in the Residential Zone category may be no closer than 2.5 metres from the original centreline of a lane.`,
    provisionSummary:
      "Setbacks are the minimum distances from your building's main walls to the front, side, and rear lot lines. The exact required distances are set by your specific zone (Chapter 10.10 R / 10.20 RD). Where neighbouring buildings are within 15 m, the required front-yard setback may instead be taken (or averaged) from those adjacent buildings, and buildings must stay at least 2.5 m from a lane centreline.",
    keywords: ["setback", "front yard setback", "side yard setback", "rear yard setback", "main wall", "property line", "lot line"],
    relatedTopicId: "setbacks",
    sourceUrl: SRC,
  },
  {
    id: "decks-platforms",
    appliesTo: RES,
    chapter: "Chapter 10.5",
    section: "10.5.40.50 · 10.5.40.60(1)",
    title: "Decks, Platforms, Porches & Balconies",
    plainExplanation:
      "A deck, porch, or balcony attached to the house is a 'platform.' This sets when it counts as a main wall, how high it can be, and how far it may project into a required yard.",
    bylawText: `10.5.40.50 Decks, Platforms and Amenities
(1) Interpretation of Platform Walls
In the Residential Zone category, the exterior sides of a platform, such as a deck, porch, balcony or similar structure, attached to or within 0.3 metres of a building, are not main walls if at least 50% of the exterior sides above the floor are open to the outside.
(2) Platforms in Relation to Building Setbacks
In the Residential Zone category, a platform without main walls, such as a deck, porch, balcony or similar structure, attached to or within 0.3 metres of a building, must comply with the required minimum building setbacks for the zone.

10.5.40.60 Permitted Encroachments
(1) Platforms
Despite regulation 10.5.40.50(2), in the Residential Zone category, a platform without main walls, such as a deck, porch, balcony or similar structure, attached to or less than 0.3 metres from a building, are subject to the following:
(A) in a front yard, a platform with a floor no higher than the first storey above established grade may encroach into the required front yard setback the lesser of 2.5 metres or 50% of the required front yard setback, if it is no closer to a side lot line than the required side yard setback;
(C) in a rear yard, a platform with a floor no higher than the first storey above established grade may encroach into the required rear yard setback the lesser of 2.5 metres or 50% of the required rear yard setback ...;
(E) in a side yard, a platform with a floor no higher than the first storey above established grade may encroach into the required minimum side yard setback a maximum of 1.5 metres, if it is no closer to the side lot line than 0.3 metres.`,
    provisionSummary:
      "An attached deck, porch, or balcony (within 0.3 m of the house) is a 'platform.' If at least 50% of its sides are open, it isn't treated as a main wall. Platforms must meet the zone's setbacks, but may project into a required yard by set amounts — e.g. into a front or rear yard, a ground-level platform may encroach the lesser of 2.5 m or 50% of the setback; into a side yard, up to 1.5 m (no closer than 0.3 m to the side lot line). Higher (second-storey) platforms have smaller limits.",
    keywords: ["deck", "platform", "porch", "balcony", "patio", "permitted encroachment", "encroachment"],
    relatedTopicId: "accessory-structures",
    sourceUrl: SRC,
  },
  {
    id: "air-conditioner",
    appliesTo: RES,
    chapter: "Chapter 10.5",
    section: "10.5.40.60(8) · 10.5.60.20(10) · 10.5.60.30(2)",
    title: "Air Conditioners, Heat Pumps & HVAC Devices",
    plainExplanation:
      "Sets where heating/air-conditioning equipment may be placed — both wall-mounted units (as permitted encroachments) and ground-mounted units (front, side, and rear yard rules).",
    bylawText: `10.5.40.60 Permitted Encroachments
(8) Equipment
In the Residential Zone category, the following wall mounted equipment on a building may encroach into required minimum building setbacks as follows, if the equipment is no closer to a lot line than 0.3 metres:
(A) vents, pipes, or utility equipment, a maximum of 0.6 metres into a required minimum rear yard setback or minimum side yard setback;
(B) satellite dish, a maximum of 0.9 metres into any required minimum building setback;
(C) antenna, or a pole used to hold an antenna, a maximum of 0.9 metres into any required minimum rear yard setback or minimum side yard setback; and
(D) air conditioner, a maximum of 0.9 metres:
    (i) into a required minimum rear yard setback; and
    (ii) into a required minimum side yard setback if it is not located above the first storey.

10.5.60.20 Setbacks
(10) Ground Mounted Heating or Air-Conditioning Devices - Front Yard Setbacks and Side Yard Setbacks
In the Residential Zone category, for a heating or air-conditioning device that is mounted on the ground:
(A) despite regulation 10.5.60.10(1), the device may be located in a front yard, if it is at least 6.0 metres from the front lot line; and
(B) despite regulation 10.5.60.20(3)(A), the device may be in a side yard, if it is no closer to the side lot line than the lesser of:
    (i) 0.9 metres; or
    (ii) the required minimum side yard setback for the residential building on the lot.

10.5.60.30 Separation
(2) Maximum Separation Between Residential Buildings and Ground Mounted Heating or Air-Conditioning Devices in a Rear Yard
A heating or air-conditioning device that is mounted on the ground in the rear yard of a lot in the Residential Zone category may be no more than 2.0 metres from the rear main wall of the residential building.`,
    provisionSummary:
      "Placement depends on whether the A/C or heat pump is wall-mounted or ground-mounted. A wall-mounted air conditioner may project up to 0.9 m into a required rear-yard setback (and into a side-yard setback if not above the first storey), but must stay at least 0.3 m from a lot line. A ground-mounted unit may go in the front yard only if at least 6.0 m from the front lot line, and in a side yard no closer than the lesser of 0.9 m or the building's required side-yard setback. A ground-mounted unit in the rear yard may be no more than 2.0 m from the rear main wall.",
    keywords: ["air conditioner", "hvac", "heat pump", "ac unit", "air-conditioning", "condenser", "ground mounted", "mechanical equipment", "equipment", "encroachment"],
    relatedTopicId: "hvac-ac-location",
    sourceUrl: SRC,
  },
  {
    id: "permitted-encroachments",
    appliesTo: RES,
    chapter: "Chapter 10.5",
    section: "10.5.40.60",
    title: "Permitted Encroachments — Stairs, Eaves, Bay Windows, Features",
    plainExplanation:
      "Lists features that may project into a required minimum building setback, such as exterior stairs, eaves, bay windows, chimneys, and architectural details.",
    bylawText: `10.5.40.60 Permitted Encroachments
(3) Exterior Stairs, Access Ramp and Elevating Device
... exterior stairs, if the stairs are: (i) no longer than 1.5 horizontal units for each 1.0 vertical unit ...; (ii) no wider than 2.0 metres; and (iii) no closer to a lot line than 0.6 metres.
(5) Architectural Features
(A) a pilaster, decorative column, cornice, sill, belt course or other similar architectural feature may encroach a maximum of 0.6 metres, if it is no closer to a lot line than 0.3 metres; and
(B) a chimney breast may encroach a maximum of 0.6 metres, if it is no wider than 2.0 metres and no closer to a lot line than 0.3 metres.
(6) Window Projections
A bay window, box window, or other window projection ... may encroach: (A) into a required minimum front or rear yard setback a maximum of 0.75 metres ...; and (B) into a required minimum side yard setback a maximum of 0.6 metres ...
(7) Roof Projections
(B) the eaves of a roof may encroach into a required minimum building setback a maximum of 0.9 metres, if they are no closer to a lot line than 0.3 metres.`,
    provisionSummary:
      "Certain features may project into a required yard setback within set limits: exterior stairs (no wider than 2.0 m, no closer than 0.6 m to a lot line); architectural features like cornices and chimney breasts (up to 0.6 m); bay/box windows (up to 0.75 m front/rear, 0.6 m side); and roof eaves (up to 0.9 m, no closer than 0.3 m to a lot line). Decks/platforms and A/C equipment have their own encroachment rules.",
    keywords: ["permitted encroachment", "encroachment", "eaves", "stairs", "ramp", "bay window", "window projection", "architectural feature", "chimney", "cladding", "cornice"],
    relatedTopicId: "setbacks",
    sourceUrl: SRC,
  },
  {
    id: "landscaping",
    appliesTo: RES,
    chapter: "Chapter 10.5",
    section: "10.5.50.10",
    title: "Front, Side & Rear Yard Landscaping (Soft Landscaping)",
    plainExplanation:
      "Requires a minimum portion of the yards to be landscaping — and most of that to be soft landscaping (grass, plants) rather than paving.",
    bylawText: `10.5.50.10 Landscaping
(1) Front Yard Landscaping for Certain Types of Residential Buildings
In the Residential Zone category, on a lot with a detached house, semi-detached house, duplex, triplex, fourplex or townhouse, the following front yard landscaping regulations apply:
(A) for lots with a lot frontage less than 6.0 metres ... the front yard, excluding a permitted driveway or permitted parking pad must be landscaping;
(B) for lots with a lot frontage of 6.0 metres to less than 15.0 metres ... a minimum of 50% of the front yard must be landscaping;
(C) for lots with a lot frontage of 15.0 metres or greater, a minimum of 60% of the front yard must be landscaping; and
(D) a minimum of 75% of the front yard landscaping required in (A), (B), and (C) above, must be soft landscaping, and if a lot does not have a permitted driveway in the front yard, a minimum of 75% of the front yard must be soft landscaping.
(3) Rear Yard Soft Landscaping for Residential Buildings Other Than an Apartment Building
... (A) a minimum of 50% of the rear yard for soft landscaping, if the lot frontage is greater than 6.0 metres; and (B) a minimum of 25% of the rear yard for soft landscaping, if the lot frontage is 6.0 metres or less.`,
    provisionSummary:
      "A minimum share of each yard must be landscaping, and most of that must be 'soft' landscaping (grass, plants — not paving). For a house: lots under 6 m frontage must keep the whole front yard (minus a permitted driveway) as landscaping; 6–15 m need ≥50%; 15 m+ need ≥60% — and at least 75% of the required front-yard landscaping must be soft. Rear yards need ≥50% soft landscaping (≥25% on very narrow lots). So you cannot pave the whole front yard.",
    keywords: ["landscaping", "soft landscaping", "front yard landscaping", "green space", "paving", "hard surface", "grass"],
    relatedTopicId: "landscaping",
    sourceUrl: SRC,
  },
  {
    id: "ancillary-buildings",
    appliesTo: RES,
    chapter: "Chapter 10.5",
    section: "10.5.60.10 · .40 · .50",
    title: "Ancillary Buildings & Structures (Sheds, Detached Garages, Gazebos)",
    plainExplanation:
      "Rules for detached accessory structures — where they can go, how tall and large they may be, and how many storeys.",
    bylawText: `10.5.60.10 Location
(1) Ancillary Buildings or Structures Not Permitted in Front Yard
An ancillary building or structure in the Residential Zone category may not be located in a front yard.

10.5.60.40 Height
(2) Maximum Height of Ancillary Buildings or Structures
The permitted maximum height of an ancillary building or structure in the Residential Zone category is:
(A) 2.5 metres, if the ancillary building or structure is located less than 1.8 metres from the residential building on the lot; and
(B) 4.0 metres in all other cases.
(3) Maximum Storeys for Ancillary Buildings or Structures
An ancillary building or structure in the Residential Zone category may not have more than one storey.

10.5.60.50 Floor Area
(2) Maximum Floor Area of Ancillary Buildings or Structures
The total floor area of all ancillary buildings or structures on a lot ... must not be greater than:
(A) 60.0 square metres for a lot with a lot frontage of 12.0 metres or more; and
(B) 40.0 square metres in all other cases.`,
    provisionSummary:
      "Detached accessory structures (sheds, detached garages, gazebos) may not be located in the front yard. Maximum height is 4.0 m, or 2.5 m if within 1.8 m of the house, and they may have only one storey. Together, all ancillary buildings may total no more than 60 m² (40 m² on lots under 12 m frontage) and may not cover more than 10% of the lot.",
    keywords: ["ancillary building", "accessory structure", "accessory building", "detached garage", "garage", "shed", "gazebo", "outbuilding", "pergola"],
    relatedTopicId: "accessory-structures",
    sourceUrl: SRC,
  },
  {
    id: "ancillary-setbacks",
    appliesTo: RES,
    chapter: "Chapter 10.5",
    section: "10.5.60.20 · 10.5.60.30",
    title: "Ancillary Building Setbacks & Detached Garage Setbacks",
    plainExplanation:
      "How far a shed, detached garage, or other ancillary structure must sit from the rear and side lot lines, including lane-access garages.",
    bylawText: `10.5.60.20 Setbacks
(2) Ancillary Buildings or Structures - Rear Yard Setback
... (C) in cases other than those set out in (A) or (B), the required minimum rear yard setback for ancillary buildings or structures is 0.3 metres.
(3) Ancillary Buildings or Structures - Side Yard Setback
... (C)(iii) in cases other than those set out in (i) and (ii), the required minimum side yard setback is 0.3 metres.
(5) Detached Private Garages - Rear Yard Setback
... (A) if the rear lot line abuts a lane and vehicle access to the parking space is from the lane, the required minimum rear yard setback is 1.0 metres ...

10.5.60.30 Separation
(1) Minimum Separation Between Residential Buildings and Ancillary Buildings or Structures of a Certain Size
In the Residential Zone category, an ancillary building or structure with a height greater than 2.5 metres, or a gross floor area greater than 10 square metres, must be at least 1.8 metres from a residential building on the same lot.`,
    provisionSummary:
      "A shed or detached structure generally needs a minimum 0.3 m setback from the rear and side lot lines (larger setbacks apply on big or special lots). A detached garage accessed from a rear lane needs about a 1.0 m rear setback. Any ancillary structure over 2.5 m tall or 10 m² must be at least 1.8 m from the house.",
    keywords: ["ancillary setback", "garage setback", "shed setback", "detached garage", "accessory structure", "rear yard", "side yard", "lane"],
    relatedTopicId: "accessory-structures",
    sourceUrl: SRC,
  },
  {
    id: "lot-frontage",
    appliesTo: RES,
    chapter: "Chapter 10.5",
    section: "10.5.30.20",
    title: "Lot Frontage",
    plainExplanation:
      "Lot frontage is the width of the lot along the street. This sets the general minimum to build; the zone-specific minimum is in your zone chapter.",
    bylawText: `10.5.30.20 Lot Frontage
(2) Minimum Front Lot Line for a Residential Building
In the Residential Zone category, a residential building may not be erected on a lot that does not have a front lot line of at least 3.5 metres, unless the lot:
(A) abuts a lane with a minimum width of 6.0 metres; and
(B) has a minimum of 3.5 metres of the rear lot line abutting the lane.

10.5.30.21 Lot Frontage Exemptions
(1) ... if the lawful lot frontage of a lawfully existing lot is less than the minimum lot frontage required by this By-law, that lawful lot frontage is the minimum lot frontage for that lawfully existing lot.`,
    provisionSummary:
      "Lot frontage is the width of your lot along the street. A residential building generally can't be built on a lot with a front lot line under 3.5 m (with a rear-lane exception). The minimum required frontage for new construction is set by your specific zone (Chapter 10.10 R / 10.20 RD); a lawfully existing narrower lot keeps its existing frontage as its minimum.",
    keywords: ["lot frontage", "frontage", "lot width", "minimum lot frontage"],
    relatedTopicId: "setbacks",
    sourceUrl: SRC,
  },
  {
    id: "dwelling-units",
    appliesTo: RES,
    chapter: "Chapter 10.5",
    section: "10.5.20.40",
    title: "Dwelling Units & Converting a House (Duplex / Triplex / Fourplex)",
    plainExplanation:
      "Covers permitted dwelling units, including the conversion of a detached house into a duplex, triplex, or fourplex.",
    bylawText: `10.5.20.40 Conversion of Lawfully Existing Buildings
(1) Conversion of Detached House to a Duplex, Triplex or Fourplex
In the Residential Zone category, a detached house may be converted to a duplex, triplex or fourplex through the construction of additional dwelling units, and:
(A) if the original building was constructed prior to May 15, 2023, it may continue to be considered as a lawfully existing building provided the additional dwelling units are contained entirely within the lawfully existing building, subject to regulations 10.5.20.40(4) and (5).`,
    provisionSummary:
      "A 'dwelling unit' is a self-contained residence. In residential zones, a detached house may be converted into a duplex, triplex, or fourplex by adding dwelling units. If the original house was built before May 15, 2023 and the new units are entirely within the existing building, it can keep its lawfully-existing status. The permitted building types for each zone are set in the zone chapter (10.10 R / 10.20 RD).",
    keywords: ["dwelling unit", "residential detached", "detached house", "duplex", "triplex", "fourplex", "multiplex", "conversion", "permitted use"],
    relatedTopicId: "home-occupation",
    sourceUrl: SRC,
  },
];

export function getProvisionById(id: string): ChapterProvision | undefined {
  return chapter10Provisions.find((p) => p.id === id);
}

// ─── Search ──────────────────────────────────────────────────────────────────

/**
 * Generic zoning / grammar words that are too common to be meaningful on their
 * own. They are ignored when splitting a query into significant terms, so that
 * "front yard parking" keys on "parking" (not on "front" or "yard", which also
 * appear in unrelated provisions like setbacks and landscaping).
 */
const STOP_WORDS = new Set([
  "front", "rear", "side", "yard", "lot", "zone", "building", "minimum", "maximum",
  "space", "detached", "the", "a", "an", "of", "in", "on", "to", "for", "by",
  "is", "are", "and", "or", "my", "i", "can", "with", "at", "&", "-",
]);

/**
 * Keyword search over the Chapter 10 reference provisions.
 *
 * Precision rule: a provision is only returned if a SIGNIFICANT query term (or
 * the full query phrase) actually matches one of its keywords — title-only or
 * stop-word matches are not enough. This keeps results tightly relevant
 * (e.g. "front yard parking" returns parking provisions, not setbacks).
 */
export function searchChapter10(query: string, limit = 8): ChapterProvision[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const allTerms = q.split(/\s+/).filter(Boolean);
  const significant = allTerms.filter((t) => t.length >= 3 && !STOP_WORDS.has(t));
  const terms = significant.length ? significant : allTerms;

  return chapter10Provisions
    .map((p) => {
      const kws = p.keywords.map((k) => k.toLowerCase());
      const title = p.title.toLowerCase();
      let score = 0;
      let keywordHit = false;

      if (kws.some((k) => k === q)) {
        score += 100;
        keywordHit = true;
      } else if (kws.some((k) => k.includes(q) || (q.includes(k) && k.length >= 4 && !STOP_WORDS.has(k)))) {
        score += 40;
        keywordHit = true;
      }

      for (const term of terms) {
        if (kws.some((k) => k === term)) {
          score += 10;
          keywordHit = true;
        } else if (kws.some((k) => k.includes(term))) {
          score += 6;
          keywordHit = true;
        }
        if (title.includes(term)) score += 2;
      }

      return { p, score, keywordHit };
    })
    .filter((r) => r.keywordHit && r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.p);
}
