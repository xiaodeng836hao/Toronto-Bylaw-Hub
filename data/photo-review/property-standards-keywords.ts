// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — Chapter 629 Property Standards section keyword map (V6.5)
//
//  Section-level keyword groups for Chapter 629, derived from the source
//  Markdown (data/extracted-bylaws/1184_629 - Property Standards.md). They let
//  the Photo Review matcher pick the MOST SPECIFIC § 629 section for an image
//  issue (e.g. "ceiling water stain" → § 629-27) instead of returning a broad
//  "Chapter 629 — Property Standards". Section numbers + excerpts are sourced
//  from the MD only — never invented. Isomorphic (no server-only imports).
//
//  internalUrl values use the project's real routes (/tmc-chapters/<n>, /zoning,
//  /landscaping); the spec's /tmc/1184_<n> form is not a route in this app.
// ─────────────────────────────────────────────────────────────────────────────

export type PropertyStandardsPriority = "low" | "medium" | "high";

export interface PropertyStandardsKeywordGroup {
  id: string;
  /** Bare section code, e.g. "629-27". */
  section: string;
  sectionTitle: string;
  issueCategory: string;
  priority: PropertyStandardsPriority;
  visualKeywords: string[];
  residentKeywords: string[];
  technicalKeywords: string[];
  sectionTerms: string[];
  negativeKeywords?: string[];
  relatedInternalUrl?: string;
  sourceFile: string;
}

const SRC = "1184_629 - Property Standards.md";

export const propertyStandardsKeywordGroups: PropertyStandardsKeywordGroup[] = [
  {
    id: "ps-pest-control", section: "629-9", sectionTitle: "Pest control",
    issueCategory: "Pest Control", priority: "high",
    visualKeywords: ["mouse", "mice", "rat", "rats", "cockroach", "cockroaches", "bedbug", "bedbugs", "ants", "silverfish", "fleas", "bat", "bats", "insects", "droppings", "rodent droppings", "pest droppings", "infestation", "nest", "pest activity"],
    residentKeywords: ["pests", "rodents", "bugs", "insects in unit", "cockroaches in kitchen", "mice in apartment", "rat problem", "bed bug issue", "pest infestation", "droppings found", "bugs in bathroom", "bugs in basement"],
    technicalKeywords: ["pest control", "conditions encouraging infestation", "free of pests", "infestation", "injurious to humans or property"],
    sectionTerms: ["kept free of pests", "conditions which may encourage infestation"],
    negativeKeywords: ["wild animal outside only", "bird nest outside", "squirrel in tree"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
  {
    id: "ps-yard-junk-debris", section: "629-10", sectionTitle: "Maintenance of yards and property",
    issueCategory: "Yard Maintenance / Junk / Debris", priority: "high",
    visualKeywords: ["junk", "rubbish", "brush", "refuse", "litter", "garbage", "debris", "scrap", "discarded items", "pile of junk", "yard debris", "broken furniture", "mattress", "appliance outside", "scrap metal", "wood pile", "collapsed structure", "unfinished structure", "dilapidated structure", "wrecked vehicle", "discarded vehicle", "dismantled vehicle", "inoperative vehicle", "boat in yard", "trailer in yard"],
    residentKeywords: ["messy yard", "junk in yard", "garbage in backyard", "debris around property", "old furniture outside", "abandoned vehicle", "broken car in yard", "scrap stored outside", "unsafe yard", "fire hazard in yard"],
    technicalKeywords: ["accumulations of junk", "rubbish", "brush", "refuse", "litter", "garbage and other debris", "health hazard", "fire hazard", "dilapidated collapsed or unfinished structures", "wrecked discarded dismantled or inoperative condition"],
    sectionTerms: ["yards shall be kept clean", "free from accumulations", "free from dilapidated, collapsed or unfinished structures"],
    negativeKeywords: ["scheduled garbage collection only", "temporary renovation materials neatly stored", "lawful non-residential storage"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
  {
    id: "ps-landscaping-drainage-grading", section: "629-11", sectionTitle: "Landscaping, drainage and grading",
    issueCategory: "Drainage / Grading / Yard Landscaping", priority: "high",
    visualKeywords: ["standing water", "ponding water", "pooling water", "water pooling", "recurrent ponding", "muddy yard", "erosion", "unstable soil", "bare soil", "washed out soil", "poor grading", "water against foundation", "water near wall", "drainage issue", "blocked catch basin", "blocked storm drain", "blocked ditch", "blocked swale", "overgrown hedge", "overgrown shrubs", "dead tree limb", "dead branch", "dangerous branch", "vegetation blocking sidewalk", "vegetation blocking hydrant", "vegetation blocking view", "hedge obstructing view"],
    residentKeywords: ["water pooling in yard", "yard does not drain", "water runs toward house", "standing water after rain", "front yard used for parking", "overgrown shrubs", "dead tree branch", "tree limb hanging", "blocked swale", "blocked drain", "hedge blocks sidewalk", "plants blocking view"],
    technicalKeywords: ["graded", "suitable ground cover", "recurrent ponding", "unstable soil conditions", "erosion", "surface water away from walls", "front yard parking", "living condition", "grass height", "heavy undergrowth", "weeds", "dead diseased decayed or damaged tree", "obstruction of view", "catch basins", "storm drains", "ditches", "swales"],
    sectionTerms: ["prevent recurrent ponding of water", "direct the flow of surface water away from the walls", "lawns shrubs and hedges shall be kept trimmed", "catch basins storm drains ditches and swales shall be maintained free from defects and obstructions"],
    negativeKeywords: ["soft landscaping zoning percentage", "minor variance landscaping percentage", "front yard soft landscaping calculation"],
    relatedInternalUrl: "/landscaping", sourceFile: SRC,
  },
  {
    id: "ps-accessory-building-maintenance", section: "629-12", sectionTitle: "Accessory buildings",
    issueCategory: "Accessory Building Maintenance", priority: "medium",
    visualKeywords: ["shed", "detached garage", "accessory building", "outbuilding", "damaged shed", "rotting shed", "leaning shed", "shed roof damaged", "peeling shed", "rusted shed", "unsafe shed", "collapsed shed", "weathered outbuilding", "missing siding", "shed wall broken"],
    residentKeywords: ["old shed is falling apart", "damaged garage", "unsafe outbuilding", "shed not maintained", "rotting detached garage"],
    technicalKeywords: ["accessory building", "suitable and uniform materials", "good repair", "free from hazards", "weather-resistant material", "paint", "preservatives"],
    sectionTerms: ["constructed and maintained with suitable and uniform materials", "kept in good repair", "free from hazards", "protected by paint preservatives or other weather-resistant material"],
    negativeKeywords: ["zoning setback", "shed height", "accessory structure size", "permit requirement"],
    relatedInternalUrl: "/zoning", sourceFile: SRC,
  },
  {
    id: "ps-enclosures-maintenance", section: "629-13", sectionTitle: "Enclosures",
    issueCategory: "Fence / Screen / Enclosure Maintenance", priority: "medium",
    visualKeywords: ["damaged fence", "broken fence", "leaning fence", "fence not plumb", "missing fence boards", "loose fence panel", "collapsed fence", "unsafe fence", "damaged screen", "broken enclosure", "leaning screen", "fence hazard"],
    residentKeywords: ["fence is falling over", "fence is broken", "fence is unsafe", "enclosure is damaged", "screen is not maintained"],
    technicalKeywords: ["fences screens and other enclosures", "structurally sound", "plumb", "uniform construction", "good repair", "free from hazards"],
    sectionTerms: ["maintained in a structurally sound condition", "plumb", "uniform construction", "in good repair and free from hazards"],
    negativeKeywords: ["fence height", "front yard fence height", "pool fence", "pool enclosure", "barbed wire", "open fence construction", "driveway visibility"],
    relatedInternalUrl: "/tmc-chapters/447", sourceFile: SRC,
  },
  {
    id: "ps-retaining-wall", section: "629-14", sectionTitle: "Retaining walls",
    issueCategory: "Retaining Wall Maintenance", priority: "high",
    visualKeywords: ["retaining wall", "leaning retaining wall", "cracked retaining wall", "bulging retaining wall", "collapsed retaining wall", "wall holding soil", "loose retaining wall blocks", "retaining wall hazard", "soil wall failure"],
    residentKeywords: ["retaining wall is leaning", "retaining wall is collapsing", "retaining wall cracked", "wall holding dirt is unsafe"],
    technicalKeywords: ["retaining wall", "structurally sound", "plumb", "good repair", "free from hazard"],
    sectionTerms: ["retaining walls shall be structurally sound", "maintained in good repair and free from hazard"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
  {
    id: "ps-signs-maintenance", section: "629-15", sectionTitle: "Signs",
    issueCategory: "Sign Maintenance", priority: "medium",
    visualKeywords: ["damaged sign", "broken sign", "weathered sign", "faded sign", "peeling sign", "cracked sign", "loose sign", "discarded sign", "illegible sign", "sign falling", "sign support broken"],
    residentKeywords: ["sign is damaged", "old sign falling apart", "sign is faded", "sign cannot be read", "loose sign on building"],
    technicalKeywords: ["fastening members", "supporting members", "damaged broken excessively weathered", "worn peeled or cracked finish", "clearly legible"],
    sectionTerms: ["signs and supporting members damaged broken or excessively weathered", "free from defects or faded lettering", "information conveyed by the sign shall be clearly legible"],
    negativeKeywords: ["illegal sign placement", "temporary sign permit", "billboard permit"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
  {
    id: "ps-structural-adequacy", section: "629-16", sectionTitle: "Structural adequacy",
    issueCategory: "Structural Adequacy", priority: "high",
    visualKeywords: ["structural damage", "foundation crack", "foundation wall crack", "basement wall crack", "crawl space damage", "sagging structure", "leaning structure", "structural movement", "settlement crack", "load bearing damage", "support beam damaged", "column damaged", "rotted beam", "moisture damage", "decay", "deterioration", "building movement", "unsafe structure"],
    residentKeywords: ["building looks unsafe", "foundation is cracked", "wall is bowing", "support beam is damaged", "structure is deteriorating", "basement wall is leaking and damaged"],
    technicalKeywords: ["structurally sound", "safely sustaining its own weight", "normal structural movements", "damage decay deterioration", "entry of moisture", "foundation walls", "supporting members"],
    sectionTerms: ["maintained in good repair and in a structurally sound condition", "prevent the entry of moisture that would contribute to damage decay or deterioration", "foundation walls basements cellars and crawl spaces"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
  {
    id: "ps-exterior-walls-columns-beams", section: "629-18", sectionTitle: "Exterior walls, columns and beams",
    issueCategory: "Exterior Wall / Exterior Surface Maintenance", priority: "high",
    visualKeywords: ["exterior wall damage", "damaged brick", "loose brick", "spalling brick", "cracked brick", "missing brick", "damaged siding", "loose siding", "peeling paint", "flaking paint", "weathered wall", "wall stain", "smoke damage", "exterior defacement", "loose object on wall", "unsecured material", "rusted exterior equipment", "loose awning", "damaged canopy", "damaged marquee", "damaged exterior pipe", "damaged exterior duct", "rusted air conditioner support"],
    residentKeywords: ["outside wall is damaged", "bricks are falling", "siding is loose", "paint is peeling", "wall is stained", "exterior surface is deteriorated", "awning is loose", "exterior pipe is broken"],
    technicalKeywords: ["exterior columns walls components", "weather-tight", "loose or unsecured objects", "protective or decorative finishes", "markings stains graffiti smoke damage defacement", "canopies marquees awnings screens grilles stairways pipes ducts standpipes air conditioners"],
    sectionTerms: ["maintained in good repair", "weather-tight", "free from loose or unsecured objects and materials", "protective or decorative finishes maintained in good repair", "supporting members maintained in good repair properly anchored"],
    negativeKeywords: ["graffiti only", "tag only", "spray paint only"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
  {
    id: "ps-stairs-guards-handrails", section: "629-19", sectionTitle: "Stairs, guards, handrails and other structures",
    issueCategory: "Stairs / Guards / Handrails / Decks / Balconies", priority: "high",
    visualKeywords: ["stairs", "steps", "staircase", "porch stairs", "broken stairs", "missing handrail", "loose handrail", "damaged handrail", "missing guard", "loose guard", "guardrail", "railing", "balcony railing", "deck railing", "porch railing", "unsafe balcony", "damaged balcony", "damaged deck", "unsafe deck", "broken tread", "broken riser", "uneven stairs", "rotted stairs", "fire escape", "loading dock", "ramp", "veranda", "porch", "deck", "balcony", "landing", "open side", "fall hazard"],
    residentKeywords: ["stairs are unsafe", "handrail missing", "railing is loose", "guard is too low", "balcony railing damaged", "deck is unsafe", "porch is rotten", "steps are broken", "fall hazard"],
    technicalKeywords: ["stairs verandas porches decks loading docks ramps balconies fire escapes", "treads risers guards handrails supporting structural members", "free from defects and hazards", "capable of supporting loads", "required guards", "height of guards", "openings in guards", "climbing prevention", "handrail height", "continuity of handrails"],
    sectionTerms: ["maintained free from defects and hazards", "capable of supporting all loads", "safe clean sanitary condition and in good repair", "guard required where difference in elevation is more than 600 millimetres", "handrail shall be provided"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
  {
    id: "ps-roofs-roof-structures", section: "629-20", sectionTitle: "Roofs and roof structures",
    issueCategory: "Roof / Eavestrough / Downspout / Chimney", priority: "high",
    visualKeywords: ["roof leak", "leaking roof", "damaged roof", "missing shingles", "loose shingles", "unsafe roof material", "ice accumulation", "snow accumulation", "roof hazard", "damaged roof deck", "damaged catwalk", "broken gutter", "eavestrough", "roof gutter", "downspout", "downpipe", "flashing", "leaking gutter", "blocked gutter", "loose downspout", "water discharging to neighbour", "water onto walkway", "chimney damage", "cracked chimney", "loose chimney", "vent stack damage", "satellite dish loose", "solar panel support damaged"],
    residentKeywords: ["roof is leaking", "gutter is broken", "downspout drains to neighbour", "water from roof causing damage", "chimney is cracked", "roof has loose material", "ice falling from roof"],
    technicalKeywords: ["weather-tight", "free from leaks", "loose unsecured or unsafe objects", "dangerous accumulation of ice and snow", "eavestrough", "roof gutter", "downpipe", "above-ground discharge", "flashing", "chimneys", "smoke or vent stacks"],
    sectionTerms: ["roof shall be weather-tight and free from leaks", "drainage from roof surfaces shall discharge into eavestrough or roof gutter", "above-ground discharge shall be contained on the property", "eavestrough roof gutter flashing and downpipe maintained free from leaks defects obstructions and hazards"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
  {
    id: "ps-exterior-openings-windows-doors", section: "629-21", sectionTitle: "Exterior openings, doors, windows and skylights",
    issueCategory: "Exterior Doors / Windows / Screens / Openings", priority: "high",
    visualKeywords: ["broken window", "cracked window", "missing window", "boarded window", "window gap", "window draft", "leaking window", "damaged skylight", "missing screen", "torn screen", "damaged screen", "broken door", "exterior door damaged", "door does not lock", "defective lock", "missing hardware", "basement hatch damaged", "storm door damaged", "open hole in wall", "unprotected exterior opening", "pest entry opening"],
    residentKeywords: ["window is broken", "window does not lock", "screen is missing", "door cannot lock", "door has gap", "draft from window", "water leaking through window", "hole in exterior wall"],
    technicalKeywords: ["exterior openings", "weather-tight", "prevent drafts or leakage", "prevent entry of pests", "exterior doors windows skylights basement hatchways", "storm and screen doors", "storm windows", "defective hardware", "capable of being locked or otherwise secured"],
    sectionTerms: ["maintained in a weather-tight condition", "protected by suitable materials to prevent the entry of pests", "maintained in good repair and free from defects and missing components", "capable of being locked or otherwise secured"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
  {
    id: "ps-garbage-storage-disposal", section: "629-22", sectionTitle: "Garbage and debris storage and disposal",
    issueCategory: "Garbage Storage / Receptacles / Chute / Bulk Container", priority: "high",
    visualKeywords: ["garbage bags outside", "uncovered garbage", "open garbage bin", "overflowing garbage", "garbage receptacle", "garbage container", "bulk container", "roll-off container", "dumpster open", "garbage chute", "garbage room", "garbage storage area", "odour", "dirty garbage area", "litter around bins", "pest attracting garbage", "garbage blocking walkway", "garbage blocking driveway", "garbage blocking emergency route", "unscreened garbage area"],
    residentKeywords: ["garbage bags left outside", "bins are overflowing", "garbage room smells", "garbage chute not working", "dumpster lid left open", "garbage area attracts pests", "garbage blocks driveway"],
    technicalKeywords: ["garbage and refuse", "receptacles", "covered garbage receptacle", "garbage storage facility", "water-tight", "tight-fitting cover", "pest-proof", "clean state", "garbage chute system", "washed and disinfected", "litter-free and odour-free", "not attract pests", "obstruct emergency route", "visual screen or fence", "bulk or roll-off container"],
    sectionTerms: ["garbage bags containing garbage shall be stored within an enclosed garage or covered garbage receptacle", "receptacles shall be water-tight equipped with a tight-fitting cover pest-proof", "garbage storage area shall be litter-free and odour-free", "bulk or roll-off container shall not be left open except when being loaded"],
    negativeKeywords: ["illegal dumping on public property", "collection schedule issue", "missed garbage pickup"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
  {
    id: "ps-steps-walks-driveways-parking-areas", section: "629-23", sectionTitle: "Steps, walks, driveways, parking and loading areas",
    issueCategory: "Walkway / Driveway / Parking Surface Maintenance", priority: "high",
    visualKeywords: ["broken walkway", "cracked walkway", "uneven walkway", "trip hazard", "unsafe walkway", "damaged driveway", "cracked driveway", "pothole", "broken asphalt", "damaged parking area", "loading area damage", "ramp damage", "unsafe steps outside", "dirty parking area", "dusty parking surface", "unpaved parking surface", "surface dust", "refuse on driveway", "impervious surface with dirt"],
    residentKeywords: ["walkway is unsafe", "driveway is broken", "parking area has potholes", "steps are uneven", "trip hazard on walkway", "parking area is dusty"],
    technicalKeywords: ["steps landings walks driveways parking spaces ramps", "safe passage", "motorized vehicular traffic", "parking or storage", "asphalt concrete interlocking stone", "dust-free equivalent surface", "kept free from dirt surface dust and refuse"],
    sectionTerms: ["maintained in good repair so as to afford safe passage", "areas used for motorized vehicular traffic or parking shall be paved", "kept free from dirt surface dust and refuse"],
    negativeKeywords: ["front yard parking zoning", "driveway width zoning", "parking permit"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
  {
    id: "ps-vacant-building-property", section: "629-24", sectionTitle: "Vacant buildings and property",
    issueCategory: "Vacant / Unsecured Building", priority: "high",
    visualKeywords: ["vacant building", "abandoned building", "unsecured building", "open door", "open window", "broken entry", "boarded building", "missing board", "loose plywood", "unauthorized entry", "squatters", "dangerous vacant property", "fire risk vacant", "broken window vacant", "unsecured opening", "entry point"],
    residentKeywords: ["vacant house is open", "people can get inside", "abandoned property unsecured", "door is open on vacant building", "window is broken on vacant house"],
    technicalKeywords: ["unoccupied building", "vacant property", "risk of fire accident or other danger", "preventing entrance of unauthorized persons", "covering windows doors and openings", "plywood", "securely fastened", "tight fitting"],
    sectionTerms: ["protect the building or property against the risk of fire accident or other danger", "effectively preventing the entrance of unauthorized persons", "covering all windows doors and other openings"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
  {
    id: "ps-occupancy-standards", section: "629-25", sectionTitle: "Occupancy standards",
    issueCategory: "Occupancy / Overcrowding / Basement Habitable Room", priority: "medium",
    visualKeywords: ["basement bedroom", "cellar bedroom", "low ceiling", "overcrowded room", "room used for sleeping", "mattress in utility room", "sleeping in storage room", "non-habitable room used as bedroom"],
    residentKeywords: ["too many people living in room", "basement used as bedroom", "cellar apartment", "sleeping in storage room", "low ceiling bedroom"],
    technicalKeywords: ["non-habitable area", "habitable area", "basement or cellar", "dwelling unit", "habitable room", "maximum number of persons", "minimum floor area", "minimum ceiling height"],
    sectionTerms: ["non-habitable area shall not be used as habitable area", "basement or cellar space shall not be used as dwelling unit unless permitted", "one person for each nine square metres", "minimum height of a habitable room"],
    negativeKeywords: ["rental licensing", "rooming house licensing"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
  {
    id: "ps-floors-stairs-landings-interior", section: "629-26", sectionTitle: "Floors, stairs and landings",
    issueCategory: "Interior Floors / Stairs / Landings", priority: "high",
    visualKeywords: ["damaged floor", "broken floor", "uneven floor", "floor hole", "floor stain", "trip hazard", "loose flooring", "missing flooring", "damaged tile", "cracked tile", "buckled floor", "rotted floor", "water damaged floor", "dirty floor", "rubbish on floor", "damaged interior stairs", "damaged landing", "slippery floor"],
    residentKeywords: ["floor is damaged", "floor has hole", "floor is uneven", "flooring is coming up", "tiles are cracked", "stairs inside are unsafe", "landing is damaged"],
    technicalKeywords: ["floor stair landing", "surface covering", "finish", "properly perform intended function", "reasonably smooth and level", "trip or hazardous condition", "clean and sanitary condition", "free from holes stains rubbish and debris", "impervious to water"],
    sectionTerms: ["properly perform its intended function", "reasonably smooth and level", "free from any trip or other hazardous condition", "free from holes stains rubbish and debris"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
  {
    id: "ps-walls-ceilings-interior", section: "629-27", sectionTitle: "Walls and ceilings",
    issueCategory: "Interior Walls / Ceilings", priority: "high",
    visualKeywords: ["ceiling damage", "wall damage", "hole in wall", "hole in ceiling", "cracked wall", "cracked ceiling", "peeling ceiling", "peeling paint", "deteriorated drywall", "damaged plaster", "water stain ceiling", "water marks", "mould-like staining", "smoke damage", "graffiti inside", "painted slogans", "damaged surface material", "unfinished repair", "patch does not match", "ceiling leak stain"],
    residentKeywords: ["ceiling has water marks", "wall has hole", "ceiling is cracked", "paint is peeling", "wall repair unfinished", "ceiling damaged by leak", "interior wall is stained"],
    technicalKeywords: ["walls and ceilings", "clean", "free of holes cracks damaged and deteriorated surface material", "repair finished to reasonably match", "public areas", "marks stains graffiti smoke damage", "noxious fumes odours gases", "gas-tight construction"],
    sectionTerms: ["maintained clean and free of holes cracks and damaged and deteriorated surface material", "repair shall be finished to reasonably match existing walls or ceilings", "marks stains graffiti smoke damage or similar defacements shall be removed"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
  {
    id: "ps-doors-passageways-exits", section: "629-28", sectionTitle: "Doors, passageways and exits",
    issueCategory: "Interior Doors / Passageways / Exits", priority: "high",
    visualKeywords: ["blocked exit", "blocked hallway", "obstructed passageway", "blocked door", "exit obstruction", "damaged interior door", "door frame damaged", "door hardware missing", "broken hinge", "door does not close", "door does not latch", "roof hatch unlocked", "door closure broken", "smoke seal damaged", "latching device damaged"],
    residentKeywords: ["exit is blocked", "hallway blocked", "door is broken", "door does not close properly", "door frame damaged", "exit door hardware broken"],
    technicalKeywords: ["doors passageways and exits", "hazardous conditions", "obstructions and impediments", "door closures", "smoke seals", "latching devices", "hinges", "hardware", "good fit in frames", "roof hatches locked"],
    sectionTerms: ["maintained free from hazardous conditions obstructions and impediments", "safety equipment relative to exits and means of egress maintained in good working order", "interior doors frames glass panels and hardware maintained in good repair"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
  {
    id: "ps-multiple-dwelling-entrances-exits", section: "629-29", sectionTitle: "Multiple-dwellings entrances and exits",
    issueCategory: "Apartment Entrance / Intercom / Security Door", priority: "high",
    visualKeywords: ["apartment entrance door", "building entrance", "door propped open", "broken intercom", "intercom panel", "security release broken", "self-closing door broken", "self-locking door broken", "lobby entrance unlocked", "shared entrance not locking", "exit door held open", "apartment exit door"],
    residentKeywords: ["front entrance door does not lock", "intercom broken", "building door left open", "security release not working", "apartment entrance not self closing"],
    technicalKeywords: ["shared entrance", "kept closed and locked", "self-closing and self-locking mechanisms", "two-way voice communication system", "security locking release mechanism", "operative condition"],
    sectionTerms: ["every door used as an entrance to or exit from the building shall be kept closed and locked", "equipped with self-closing and self-locking mechanisms", "communication systems and security locking device maintained in good repair and operative condition"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
  {
    id: "ps-ancillary-rooms", section: "629-30", sectionTitle: "Ancillary rooms",
    issueCategory: "Laundry / Recreation / Ancillary Room", priority: "medium",
    visualKeywords: ["laundry room", "dirty laundry room", "damaged laundry sink", "laundry room drain", "floor drain", "recreation room damage", "common room damaged", "amenity room unsafe", "broken laundry equipment", "laundry sink no water", "blocked floor drain"],
    residentKeywords: ["laundry room is dirty", "laundry sink broken", "laundry room drain blocked", "common room damaged", "amenity room unsafe"],
    technicalKeywords: ["laundry recreation and ancillary rooms", "facilities amenities and associated equipment", "clean", "safe condition", "good repair", "hot and cold running water", "trapped floor drain", "drainage system"],
    sectionTerms: ["kept clean and maintained in a safe condition and in good repair", "laundry rooms maintained in a clean and sanitary condition", "trapped floor drain connected to the drainage system"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
  {
    id: "ps-elevators", section: "629-31", sectionTitle: "Elevators",
    issueCategory: "Elevator Maintenance", priority: "medium",
    visualKeywords: ["elevator", "dirty elevator", "elevator button broken", "floor indicator broken", "elevator light out", "elevator fan not working", "elevator panel damaged", "elevator not working"],
    residentKeywords: ["elevator out of service", "elevator button broken", "elevator light not working", "elevator dirty", "elevator fan broken"],
    technicalKeywords: ["elevators", "clean condition", "certified good working order", "elevator parts", "lighting fixtures", "lamps", "buttons", "floor indicators", "ventilation fans", "operational"],
    sectionTerms: ["elevators shall be maintained in a clean condition", "certified to be in good working order", "elevator parts and appendages kept in good repair and operational"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
  {
    id: "ps-services-utilities", section: "629-32", sectionTitle: "Services and utilities",
    issueCategory: "Service / Utility Disconnection", priority: "high",
    visualKeywords: ["utility disconnected", "gas shut off", "water shut off", "electricity shut off", "hydro disconnected", "no light", "no water", "no heat", "meter locked", "utility notice", "disconnected service", "shut off tag"],
    residentKeywords: ["landlord shut off utilities", "no electricity", "no water", "gas has been disconnected", "utilities disconnected", "service was shut off"],
    technicalKeywords: ["disconnect service or utility", "light", "heat", "air conditioning", "refrigeration", "water", "cooking facilities", "tenant or lessee", "reasonable period for repair"],
    sectionTerms: ["no owner shall disconnect or cause to be disconnected any service or utility", "except for reasonable period of time required for repair replacing or altering"],
    negativeKeywords: ["City-wide outage", "utility company outage", "planned outage by provider"],
    relatedInternalUrl: "/tmc-chapters/835", sourceFile: SRC,
  },
  {
    id: "ps-mail", section: "629-33", sectionTitle: "Mail",
    issueCategory: "Mailbox / Mail Room Security", priority: "medium",
    visualKeywords: ["mailbox", "mail box", "mail receptacle", "broken mailbox", "damaged mail room", "mail slot", "mail room door", "unsecured mailbox", "mailbox lock broken"],
    residentKeywords: ["mailbox broken", "mail room not secure", "mail slot unsafe", "mail lock broken", "missing mailbox"],
    technicalKeywords: ["separate and secure mailbox", "mail receptacle", "mail slot", "prevent access to unlock doorknob", "mail room security"],
    sectionTerms: ["every dwelling unit shall have a separate and secure mail box or mail receptacle", "access to mail rooms maintained in good repair to ensure security"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
  {
    id: "ps-kitchen-facilities", section: "629-34", sectionTitle: "Kitchen facilities",
    issueCategory: "Kitchen Facilities / Sink / Cupboards / Appliances", priority: "high",
    visualKeywords: ["kitchen sink", "damaged sink", "missing sink", "sink leak", "no hot water kitchen", "no cold water kitchen", "backsplash missing", "damaged counter", "damaged cupboard", "broken cabinet", "cupboard door broken", "drawer broken", "supplied appliance broken", "stove not working", "refrigerator not working", "kitchen fixture damaged", "drain board", "water damaged cabinet"],
    residentKeywords: ["kitchen cupboard broken", "sink does not work", "kitchen faucet broken", "no hot water in kitchen", "stove not working", "fridge not working", "kitchen counter damaged"],
    technicalKeywords: ["room in which meals are prepared", "sink", "counter", "backsplash", "drain board", "impervious to water", "potable running hot and cold water", "drainage system", "gas or electrical supply for cooking and refrigeration", "cupboard kitchen fixture fitting supplied appliance", "good repair and good working order"],
    sectionTerms: ["sink installed in a counter having a backsplash and drain board", "connected to potable running hot and cold water", "approved connected and operating gas or electrical supply", "cupboard kitchen fixture fitting and supplied appliance maintained in good repair and good working order"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
  {
    id: "ps-electrical-service-outlets", section: "629-35", sectionTitle: "Electrical service and outlets",
    issueCategory: "Electrical / Outlet / Switch / Fixture", priority: "high",
    visualKeywords: ["electrical outlet", "receptacle", "missing cover plate", "broken outlet", "loose outlet", "exposed wire", "damaged wire", "electrical connection", "broken switch", "light switch missing", "electrical fixture damaged", "extension cord permanent", "overloaded extension cord", "open junction box", "sparking outlet", "unsafe electrical"],
    residentKeywords: ["outlet is broken", "switch plate missing", "wires exposed", "electrical is unsafe", "extension cord used permanently", "receptacle is loose", "light switch broken"],
    technicalKeywords: ["wired for electricity", "operating electric supply system", "capacity of circuits", "electrical outlets", "extension cords", "permanent wiring system", "electrical fixtures switches receptacles and connections", "safe and complete condition", "good working order"],
    sectionTerms: ["building and dwelling unit shall be wired for electricity", "adequate electrical outlets installed to prevent extension cords being used as permanent wiring", "electrical fixtures switches receptacles and connections maintained in safe and complete condition and good working order"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
  {
    id: "ps-lighting", section: "629-36", sectionTitle: "Lighting",
    issueCategory: "Lighting / Emergency Lighting", priority: "medium",
    visualKeywords: ["light fixture", "broken light", "light out", "dark hallway", "dark stairwell", "poor lighting", "missing bulb", "damaged lamp", "emergency light", "exit lighting", "parking lot lighting", "porch light", "walkway light", "broken fixture cover"],
    residentKeywords: ["hallway too dark", "stairs not lit", "parking lot light out", "emergency light not working", "light fixture broken", "common area lighting not working"],
    technicalKeywords: ["adequate artificial light", "illumination", "emergency lighting", "exits", "corridors", "underground walkways", "parking lots", "walkways stairs porches verandas loading docks ramps", "lighting fixtures and lamps", "safe and clean condition"],
    sectionTerms: ["adequate artificial light required to maintain level of illumination", "minimum level of illumination", "lighting fixtures and lamps maintained in good working order"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
  {
    id: "ps-plumbing-water-sanitary", section: "629-37", sectionTitle: "Plumbing; water and sanitary facilities",
    issueCategory: "Plumbing / Water / Bathroom / Sanitary Facilities", priority: "high",
    visualKeywords: ["plumbing leak", "leaking pipe", "leaking toilet", "toilet not flushing", "clogged toilet", "blocked drain", "sink clogged", "bathtub clogged", "shower leak", "no hot water", "no cold water", "low water", "water damage under sink", "broken toilet", "broken sink", "damaged bathtub", "damaged shower", "bathroom fixture broken", "sewage backup", "drain leak", "frozen pipe", "dirty bathroom", "mould-like bathroom stains"],
    residentKeywords: ["toilet cannot flush", "sink is clogged", "pipe leaking", "no hot water", "bathroom sink broken", "shower not working", "sewage smell", "water leak under sink"],
    technicalKeywords: ["plumbing systems", "drain waste and vent piping", "plumbing fixtures", "sanitary sewage system", "water piping", "municipal water service system", "good working order", "free from leaks or defects", "protected from freezing", "potable and running hot and cold water", "hot water temperature", "sanitary facilities"],
    sectionTerms: ["plumbing system kept in good working order free from leaks or defects", "adequate supply of potable and running hot and cold water", "service hot water with temperature range from 45 degrees Celsius to 60 degrees Celsius"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
  {
    id: "ps-heating-air-conditioning", section: "629-38", sectionTitle: "Heating and air conditioning",
    issueCategory: "Heating / Air Conditioning", priority: "high",
    visualKeywords: ["furnace", "boiler", "radiator", "thermostat", "heater", "space heater", "portable heater", "auxiliary heater", "no heat", "low temperature", "air conditioner", "AC unit", "broken AC", "hot unit", "too hot", "temperature reading", "thermometer", "furnace room", "boiler room", "fireplace", "chimney flue"],
    residentKeywords: ["no heat", "unit is too cold", "heat not working", "thermostat broken", "furnace not working", "AC not working", "unit too hot", "portable heater only", "landlord provided space heater"],
    technicalKeywords: ["heating and air-conditioning system", "good repair", "good working condition", "room temperature of 21 degrees Celsius", "1.5 metres above floor level", "habitable rooms bathrooms and toilet rooms", "combustion air", "auxiliary heaters", "permanent source of heat", "air-conditioning systems", "June 1 to September 30", "26 degrees Celsius"],
    sectionTerms: ["heating system capable of maintaining room temperature of 21 degrees Celsius", "auxiliary heaters shall not be used as a permanent source of heat", "air-conditioning systems operated from June 1 to September 30 to maintain indoor temperature of not more than 26 degrees Celsius"],
    relatedInternalUrl: "/tmc-chapters/497", sourceFile: SRC,
  },
  {
    id: "ps-ventilation", section: "629-39", sectionTitle: "Ventilation",
    issueCategory: "Ventilation / Exhaust / Bathroom Fan", priority: "high",
    visualKeywords: ["bathroom fan", "exhaust fan", "ventilation fan", "fan not working", "detached fan", "blocked vent", "dirty vent", "no ventilation", "condensation", "mould-like growth", "stale air", "odour", "noxious fumes", "gas smell", "dust exhaust", "sawdust exhaust", "vent discharge near window"],
    residentKeywords: ["bathroom fan not working", "no ventilation in bathroom", "fan is loud", "fan detached", "vent blocked", "condensation in bathroom", "bad smell from vent"],
    technicalKeywords: ["adequate ventilation", "ventilation system or unit", "regularly cleaned", "good repair", "good working condition", "mechanical ventilation", "air change once per hour", "sanitary convenience room", "natural ventilation", "noxious fumes gases dust or sawdust"],
    sectionTerms: ["adequate ventilation shall be provided", "ventilation system regularly cleaned kept in good repair and maintained in good working condition", "sanitary convenience room ventilation", "mechanical ventilation capable of completely changing air"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
  {
    id: "ps-parking-storage-garage", section: "629-40", sectionTitle: "Parking or storage garages",
    issueCategory: "Parking Garage Maintenance", priority: "medium",
    visualKeywords: ["parking garage", "storage garage", "garage wall crack", "garage floor crack", "garage ceiling damage", "garage column damage", "garage water leak", "garage hole", "garage paint damaged", "abandoned vehicle in garage", "junk in garage", "garage rubbish", "garage unsafe"],
    residentKeywords: ["parking garage damaged", "garage ceiling leaking", "garage column cracked", "abandoned car in garage", "garage full of junk"],
    technicalKeywords: ["parking or storage garage", "walls floors ceilings and columns", "free of holes breaks or cracks", "impervious to water", "painted surfaces", "wrecked discarded dismantled inoperative or abandoned", "junk or rubbish"],
    sectionTerms: ["walls floors ceilings and columns maintained free of holes breaks or cracks", "impervious to water", "no wrecked discarded dismantled inoperative or abandoned vehicles or junk"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
  {
    id: "ps-garage-doors-exit-doors", section: "629-41", sectionTitle: "Garage doors; exit doors",
    issueCategory: "Garage Door / Garage Exit Door Safety", priority: "medium",
    visualKeywords: ["garage door", "automatic garage door", "garage door sensor", "garage exit door", "pedestrian exit door", "garage door closing", "self-closing mechanism", "exit door propped open", "garage exit blocked", "garage exit door locked"],
    residentKeywords: ["garage door sensor not working", "garage exit door broken", "parking garage exit blocked", "garage door closes on objects"],
    technicalKeywords: ["automatic closing mechanism", "sensing device", "pedestrian exit doors", "direction of exit travel", "self-closing mechanism", "secured in open position"],
    sectionTerms: ["garage door shall be equipped with a sensing device", "parking or storage garage served by pedestrian exit doors", "pedestrian exit door shall have reliable self-closing mechanism"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
  {
    id: "ps-garage-exit-door-signs", section: "629-42", sectionTitle: "Garage exit door signs",
    issueCategory: "Garage Exit Signage", priority: "low",
    visualKeywords: ["garage exit sign", "safe exit sign", "exit arrow", "alert sign", "parking garage signage", "missing exit sign", "damaged exit sign", "illegible garage sign"],
    residentKeywords: ["parking garage exit sign missing", "garage exit arrow missing", "garage signage damaged"],
    technicalKeywords: ["alert sign", "large safe-exit arrow", "small safe-exit arrow", "safe-exit door", "safe-exit route", "decision point"],
    sectionTerms: ["alert signs", "safe-exit arrow", "safe-exit route"],
    relatedInternalUrl: "/tmc-chapters/629", sourceFile: SRC,
  },
];

/**
 * Cross-chapter guardrails: Property Standards (Chapter 629) must not override a
 * more specific chapter when that chapter clearly applies. Used by the matcher to
 * keep § 629 results to genuine MAINTENANCE conditions. Reference data + notes.
 */
export const propertyStandardsGuardrails = {
  preferOtherChapterWhen: [
    {
      condition: "fence height, fence location, pool fence, barbed wire, open fence construction",
      prefer: "Chapter 447 – Fences",
      note: "Use Chapter 629 only for fence/enclosure maintenance, such as damaged, leaning, unsafe, or not in good repair.",
    },
    {
      condition: "pure graffiti complaint",
      prefer: "Chapter 485 – Graffiti",
      note: "Use § 629-18 or § 629-27 only when matching exterior/interior surface maintenance or restoration issues.",
    },
    {
      condition: "long grass, prohibited weeds, prohibited plants",
      prefer: "Chapter 489 – Turfgrass and Prohibited Plants",
      note: "Use § 629-11 only for landscaping, grading, drainage, dead/diseased plants, obstruction, or yard maintenance context.",
    },
    {
      condition: "illegal dumping, littering, waste placed on public property",
      prefer: "Chapter 548 / Chapter 841 / Chapter 846",
      note: "Use § 629-22 for garbage storage, receptacles, chutes, garbage rooms, dumpsters, odour, pests, or obstruction.",
    },
    {
      condition: "zoning parking pad, front yard parking, soft landscaping percentage, setback",
      prefer: "Zoning By-law / Landscaping page",
      note: "Use Chapter 629 only for maintenance, drainage, surface condition, yard cleanliness, or safety.",
    },
  ],
} as const;
