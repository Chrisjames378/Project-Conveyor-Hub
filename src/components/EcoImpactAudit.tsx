import React, { useState, useMemo } from 'react';
import { EcoComplianceCheck } from '../types';
import {
  ShieldCheck,
  Volume2,
  Droplets,
  Scale,
  Download,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Leaf,
  Sliders,
  Waves,
  Compass,
  Fish,
  Anchor,
  Flame,
  Pickaxe,
  Ship,
  Snowflake,
  Activity
} from 'lucide-react';
import { downloadFile } from '../utils/exportUtils';

const ECO_AUDIT_CHECKS: EcoComplianceCheck[] = [
  {
    id: 'eco-01',
    category: 'Acoustic Mammal Protection',
    parameterName: 'Subsea Turbine Acoustic Output (10Hz - 20kHz)',
    thresholdLimit: '< 120 dB re 1 µPa @ 1m (IMO/DOC Standard)',
    measuredSaliBuoyVal: '84.2 dB re 1 µPa @ 1m (Non-cavitating magnetic drive)',
    status: 'Compliant - Certified',
    governingBody: 'NZ Department of Conservation (DOC) & IMO',
    mitigationStrategy: 'Sub-harmonic ceramic damping ring prevents high-frequency clicks, protecting Hector dolphins and sperm whale echolocation.'
  },
  {
    id: 'eco-02',
    category: 'Zero Chemical Guarantee',
    parameterName: 'Synthetic Chemical & Additive Discharge',
    thresholdLimit: '0.00 ppm Synthetic Additives',
    measuredSaliBuoyVal: '0.00 ppm (100% Concentrated Pure Natural Seawater Brine)',
    status: 'Exceeds Standard',
    governingBody: 'NZ Environmental Protection Authority (EPA EEZ Act)',
    mitigationStrategy: 'No polymers, flocculants, or anti-scalants used. Membrane-less ceramic evaporation loop utilizes ambient thermal gradients.'
  },
  {
    id: 'eco-03',
    category: 'Localized Salinity Delta',
    parameterName: 'Max Surface & Mid-water Ambient Salinity Variance',
    thresholdLimit: 'ΔPSU < 1.5 PSU outside 25m mixing radius',
    measuredSaliBuoyVal: 'ΔPSU = 0.38 PSU @ 10m radius (High turbulent mixing)',
    status: 'Compliant - Certified',
    governingBody: 'NIWA (National Institute of Water and Atmospheric Research)',
    mitigationStrategy: 'Multi-nozzle diffuser array disperses brine downward into high-shear current streams, eliminating localized hypersaline pooling.'
  },
  {
    id: 'eco-04',
    category: 'EPA EEZ Permitting',
    parameterName: 'Exclusive Economic Zone Deployment Permit',
    thresholdLimit: 'EEZ Act 2012 Marine Consent Classification',
    measuredSaliBuoyVal: 'Permitted Activity (Non-polluting scientific research structure)',
    status: 'Compliant - Certified',
    governingBody: 'EPA New Zealand',
    mitigationStrategy: 'Fulfills Section 20 of EEZ Act as non-extractive climate intervention research structure with continuous GPS telemetry.'
  },
  {
    id: 'eco-05',
    category: 'Benthic Anchor Footprint',
    parameterName: 'Seabed Habitat Disturbance Area per Buoy',
    thresholdLimit: '< 5.0 m² Seabed Contact Area',
    measuredSaliBuoyVal: '1.2 m² (Compact high-density cast iron clump anchor)',
    status: 'Compliant - Certified',
    governingBody: 'Maritime New Zealand & DOC Marine Reserve Unit',
    mitigationStrategy: 'Acoustic release mooring allows 100% seabed anchor recovery upon mission completion with zero abandoned subsea plastic debris.'
  }
];

type ShearLevel = 'Low' | 'Moderate' | 'High';

interface EcologicalScenario {
  id: 'baseline' | 'hypersaline' | 'trophic';
  code: string;
  title: string;
  riskTier: 'Low Risk' | 'Elevated Risk' | 'Moderate-High Risk';
  summary: string;
  preset: {
    fleetScale: number;
    brineDeltaPsu: number;
    injectionDepthM: number;
    currentShear: ShearLevel;
  };
  climateOutcomes: string[];
  localBiodiversityImpacts: string[];
  mitigationStrategies: string[];
}

const ECOLOGICAL_SCENARIOS: EcologicalScenario[] = [
  {
    id: 'baseline',
    code: 'SCENARIO 01',
    title: 'Calibrated Thermohaline Convection (Optimal Baseline)',
    riskTier: 'Low Risk',
    summary:
      'High-shear Southern Ocean & sub-polar spacing disperses concentrated seawater brine rapidly below the photic zone, driving deep-water convection without breaching osmotic thresholds.',
    preset: {
      fleetScale: 450,
      brineDeltaPsu: 0.75,
      injectionDepthM: 110,
      currentShear: 'High'
    },
    climateOutcomes: [
      'Sustains +1.4 to +2.8 Sv of overturning buoyancy flux across sub-polar downwelling corridors, slowing AMOC weakening.',
      'Enhances winter mixed-layer overturning and deep ocean heat/CO2 ventilation without releasing synthetic chemicals or carbon aerosols.',
      'Stabilizes regional polar sea-surface temperature gradients, reducing abrupt ice-shelf basal melt pulses.'
    ],
    localBiodiversityImpacts: [
      'Salinity variance decays to +0.34 PSU within 25 m of diffuser nozzles, staying well within natural storm-surge halocline variability.',
      'Transient copepod and larval fish advection past the plume (<90 s residence time) causes negligible osmotic stress.',
      'Zero benthic hypoxia: dissolved oxygen remains >6.4 mg/L across abyssal slopes.'
    ],
    mitigationStrategies: [
      'Enforce 12 km minimum array spacing and high-shear current siting (>0.45 m/s) verified by real-time ADCP Doppler sensors.',
      'Operate multi-port swirl diffusers below 90 m to clear surface phytoplankton bloom layers.',
      'Maintain 84.2 dB re 1 µPa magnetic drive ceiling with passive hydrophone whale-proximity feathering.'
    ]
  },
  {
    id: 'hypersaline',
    code: 'SCENARIO 02',
    title: 'Hyper-Saline Stratification & Benthic Hypoxia',
    riskTier: 'Moderate-High Risk',
    summary:
      'Over-concentrated brine discharge in stagnant eddies or shallow continental shelves sinks directly onto the seafloor as a dense hypersaline blanket, isolating bottom waters from oxygen renewal.',
    preset: {
      fleetScale: 1800,
      brineDeltaPsu: 2.2,
      injectionDepthM: 45,
      currentShear: 'Low'
    },
    climateOutcomes: [
      'Short-term localized dense water formation, but premature seafloor ponding stalls intermediate-depth convection efficiency.',
      'Risk of trapping remineralized nutrients at the sediment-water interface rather than exporting heat and carbon cleanly into deep abyssal basins.'
    ],
    localBiodiversityImpacts: [
      'Osmotic shock and gill-ion dysregulation for sessile benthic invertebrates (sponges, cold-water bryozoans, polychaetes) within 150 m.',
      'Density barrier suppresses vertical oxygen mixing, dropping benthic dissolved oxygen below 3.8 mg/L and risking localized dead-zone pockets.',
      'Microbial community shift favoring halotolerant bacteria over calcifying benthic fauna.'
    ],
    mitigationStrategies: [
      'Hard automated conductivity & DO cutoff: throttle brine valves immediately if 25 m perimeter ΔPSU exceeds +1.2 PSU or DO drops below 5.2 mg/L.',
      'Prohibit deployment over shallow shelves (<1,500 m water depth) or low-shear gyre centers; restrict injection to deep canyon conduits.',
      'Install upward/lateral turbulent jet eductors that pre-dilute brine 18:1 with ambient water prior to exit.'
    ]
  },
  {
    id: 'trophic',
    code: 'SCENARIO 03',
    title: 'Sub-Polar Trophic Shift & Basin-Scale Mixing Interference',
    riskTier: 'Elevated Risk',
    summary:
      'Ultra-large fleet density (3,000+ buoys) alters regional upwelling nutrient ratios and seasonal mixed-layer depth, reshaping spring diatom blooms and foraging corridors.',
    preset: {
      fleetScale: 3400,
      brineDeltaPsu: 1.35,
      injectionDepthM: 75,
      currentShear: 'Moderate'
    },
    climateOutcomes: [
      'Substantial AMOC stabilization (+5.5+ Sv potential flux) that counters meltwater-induced conveyor slowdown under high-emission pathways.',
      'Risk of unintended regional precipitation shifts if surface cooling exceeds natural pre-industrial heat-transport equilibria.'
    ],
    localBiodiversityImpacts: [
      'Premature downward advection of silicate and nitrate out of the euphotic zone can dampen spring diatom productivity and shift plankton toward smaller flagellates.',
      'Downstream reduction in Antarctic krill grazing patches could force baleen whales, penguins, and seabirds to travel further to forage.',
      'Cumulative low-frequency acoustic clutter if thousands of units operate concurrently in narrow migration bottlenecks.'
    ],
    mitigationStrategies: [
      'Dynamic seasonal throttling linked to Sentinel-3 ocean-color chlorophyll telemetry: pause pumping during peak austral spring phytoplankton blooms.',
      'Geo-fenced acoustic & operational exclusion buffers around marine mammal calving grounds, krill hotspots, and seamount MPAs.',
      'Independent NIWA/CCAMLR adaptive basin quota capping regional array density based on real-time Argo float vertical nutrient profiles.'
    ]
  }
];

interface PolarExtractiveThreat {
  id: string;
  actorCategory: string;
  title: string;
  region: string;
  statusTag: string;
  mechanism: string;
  ecologicalConsequences: string[];
  regulatoryGap: string;
}

const POLAR_DEEPSEA_THREATS: PolarExtractiveThreat[] = [
  {
    id: 'big-oil-south-pole',
    actorCategory: 'BIG OIL & FOSSIL MAJORS',
    title: 'Antarctic Seismic Surveying, Sub-Antarctic Drilling & 2048 Treaty Pressure',
    region: 'Ross Sea, Weddell Sea, Prydz Bay & 50°S–55°S Sub-Antarctic Margins',
    statusTag: '230+ dB Airguns • 2048 Review Window',
    mechanism:
      'While Article 7 of the 1991 Madrid Protocol bans commercial mining and drilling inside the Antarctic Treaty area (south of 60°S), state-backed and commercial surveys continue mapping deep continental-shelf hydrocarbon basins under "scientific" geophysical exemptions using 230–255 dB seismic airgun arrays, alongside active offshore oil & gas licensing just north of the treaty boundary (Falklands/Malvinas basin, Magallanes, and New Zealand Great South Basin).',
    ecologicalConsequences: [
      '230+ dB seismic blasts every 10 seconds cause temporary/permanent hearing threshold shifts in blue, fin, and sperm whales and kill zooplankton/krill larvae up to 1.2 km from the array.',
      'Heavy Fuel Oil (HFO) and marine gasoil spills in sub-zero waters fail to biodegrade for decades, coating emperor penguins, Weddell seals, and under-ice algae.',
      'Black carbon soot from polar tanker and supply-vessel exhaust settles on snow and sea ice, cutting surface albedo and accelerating glacial melt.'
    ],
    regulatoryGap:
      'The Madrid Protocol has no expiration date, but starting in 2048 any Treaty Consultative Party can call a formal review conference—driving pre-positioning geophysical surveys today.'
  },
  {
    id: 'seabed-strip-mining',
    actorCategory: 'DEEP-SEA MINING CORPORATIONS',
    title: 'Abyssal Nodule Crawlers & Seafloor Massive Sulfide Strip Mining',
    region: 'Clarion-Clipperton Zone (CCZ), Kermadec Arc & Southern Ocean Seamounts',
    statusTag: '10–15 cm Topsoil Stripping • Toxic Plumes',
    mechanism:
      'Deep-sea mining firms (such as The Metals Company, Impossible Metals, and state contractors in Norway, China, and Japan) are pushing the International Seabed Authority (ISA) and domestic EEZs via the "two-year rule" to greenlight 30-ton tracked hydraulic harvesters that vacuum polymetallic nodules and grind hydrothermal vent crusts at 3,000–5,500 m depth.',
    ecologicalConsequences: [
      'Physically strips the top 10–15 cm of ancient abyssal ooze and nodules that took 1–10 million years to form—over 50% of local benthic megafauna live attached directly to the nodules.',
      'Dewatering discharge plumes from surface support ships inject heavy metals (cadmium, copper, arsenic, lead) and ultra-fine sediment clouds hundreds of kilometers across mid-water food webs.',
      'Disturbs deep-sea "dark oxygen" electrochemical processes and destabilizes vast benthic organic carbon stores locked in abyssal sediments.'
    ],
    regulatoryGap:
      'ISA exploitation regulations remain incomplete without binding environmental thresholds, yet contractors are seeking provisional mining approvals regardless.'
  },
  {
    id: 'krill-iuu-plastics',
    actorCategory: 'INDUSTRIAL EXTRACTION & VESSEL PRESSURES',
    title: 'Krill Super-Trawlers, IUU Toothfish Trawling & Polar Microplastics',
    region: 'Antarctic Peninsula, South Georgia, Macquarie & Ross Sea Shelf',
    statusTag: 'Trophic Collapse Risk • Persistent Pollutants',
    mechanism:
      'Factory krill super-trawlers concentrate catches inside coastal foraging zones using continuous-pump nets, while Illegal, Unreported, and Unregulated (IUU) fleets deploy deep bottom longlines/trawls on seamounts and growing expedition/logistics traffic sheds microplastics, hull-fouling invasives, and PFAS.',
    ecologicalConsequences: [
      'Localized krill depletion starves baleen whales, chinstrap/Adelie penguins, and crabeater seals while crippling the "krill fecal carbon pump" that sequesters ~20–23 Mt C/yr to the deep ocean.',
      'Bottom-contact fishing gear destroys century-old cold-water stylasterid and gorgonian coral reefs on Antarctic seamounts.',
      'Microplastics and forever chemicals (PFAS) detected in Antarctic snow, sea ice, and krill bioaccumulate up to apex predators.'
    ],
    regulatoryGap:
      'CCAMLR marine protected area proposals in East Antarctica, the Weddell Sea, and the Antarctic Peninsula remain repeatedly blocked by geopolitical vetoes.'
  }
];

export const EcoImpactAudit: React.FC = () => {
  const [checks] = useState<EcoComplianceCheck[]>(ECO_AUDIT_CHECKS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSection, setActiveSection] = useState<'all' | 'risk-sim' | 'polar-threats' | 'compliance'>('all');

  // Interactive Risk Assessment Simulation State
  const [activeScenarioId, setActiveScenarioId] = useState<EcologicalScenario['id']>('baseline');
  const [fleetScale, setFleetScale] = useState<number>(450);
  const [brineDeltaPsu, setBrineDeltaPsu] = useState<number>(0.75);
  const [injectionDepthM, setInjectionDepthM] = useState<number>(110);
  const [currentShear, setCurrentShear] = useState<ShearLevel>('High');

  const applyScenarioPreset = (scenario: EcologicalScenario) => {
    setActiveScenarioId(scenario.id);
    setFleetScale(scenario.preset.fleetScale);
    setBrineDeltaPsu(scenario.preset.brineDeltaPsu);
    setInjectionDepthM(scenario.preset.injectionDepthM);
    setCurrentShear(scenario.preset.currentShear);
  };

  // Dynamic Ecological & Climate Risk Calculations
  const simMetrics = useMemo(() => {
    const shearFactor = currentShear === 'High' ? 1.0 : currentShear === 'Moderate' ? 0.62 : 0.34;
    const depthProtectionFactor = Math.min(1.25, Math.max(0.4, injectionDepthM / 100));

    // AMOC Buoyancy Flux (Sv): scales with fleetScale and brineDeltaPsu, penalized if low shear causes ponding
    const rawBuoyancySv = (fleetScale / 300) * (brineDeltaPsu / 0.8) * (0.55 + 0.45 * shearFactor);
    const amocBuoyancySv = Number(Math.min(9.5, rawBuoyancySv).toFixed(2));

    // Mixing-Zone Salinity Variance @ 25m radius (ΔPSU)
    const densityOverlap = 1 + (fleetScale / 3000) * 0.45;
    const mixingDelta25m = Number(
      ((brineDeltaPsu * 0.46 * densityOverlap) / (shearFactor * Math.sqrt(depthProtectionFactor))).toFixed(2)
    );

    // Projected Benthic Dissolved Oxygen (mg/L)
    const oxygenPenalty = Math.max(0, (mixingDelta25m - 0.4) * 1.45 + (currentShear === 'Low' ? 1.3 : 0.15) + (injectionDepthM < 60 ? 0.55 : 0));
    const benthicDoMgL = Number(Math.max(2.1, 6.8 - oxygenPenalty).toFixed(2));

    // Acoustic Output (dB re 1 uPa @ 1m aggregate corridor estimate)
    const acousticDb = Number((84.2 + Math.log10(Math.max(1, fleetScale / 25)) * 4.2).toFixed(1));

    // Composite Biodiversity Risk Score (0 - 100)
    const rawRisk =
      mixingDelta25m * 26 +
      Math.max(0, 6.2 - benthicDoMgL) * 16 +
      (fleetScale > 2000 ? (fleetScale - 2000) / 140 : 0) +
      (injectionDepthM < 65 ? 14 : 0);
    const riskScore = Math.round(Math.min(98, Math.max(8, rawRisk)));

    let riskRating: 'Low Risk' | 'Elevated Risk' | 'High Stratification Risk' = 'Low Risk';
    if (riskScore >= 60 || benthicDoMgL < 4.5 || mixingDelta25m > 1.4) {
      riskRating = 'High Stratification Risk';
    } else if (riskScore >= 32 || fleetScale >= 1800) {
      riskRating = 'Elevated Risk';
    }

    return {
      amocBuoyancySv,
      mixingDelta25m,
      benthicDoMgL,
      acousticDb,
      riskScore,
      riskRating
    };
  }, [fleetScale, brineDeltaPsu, injectionDepthM, currentShear]);

  const activeScenario =
    ECOLOGICAL_SCENARIOS.find((s) => s.id === activeScenarioId) || ECOLOGICAL_SCENARIOS[0];

  const filteredChecks =
    selectedCategory === 'All'
      ? checks
      : checks.filter((c) => c.category === selectedCategory);

  const exportEcoAuditReport = () => {
    const reportText = `
SALIBUOY SYSTEMS - ECOLOGICAL RISK ASSESSMENT & COMPLIANCE REPORT
===================================================================
Date: ${new Date().toISOString().split('T')[0]}
Location: Outset Ventures Pukekohe / NIWA Subsea Testing Unit
Governing Bodies: NZ EPA, DOC, NIWA, IMO, CCAMLR, Antarctic Treaty System

1. LIVE SIMULATION PARAMETERS & OUTPUTS:
----------------------------------------
- Active Scenario Preset: ${activeScenario.code} - ${activeScenario.title}
- Simulated Fleet Scale: ${fleetScale} buoys
- Brine Injection Delta: +${brineDeltaPsu} PSU
- Diffuser Depth: ${injectionDepthM} m | Current Shear: ${currentShear}
- Estimated AMOC Buoyancy Flux: +${simMetrics.amocBuoyancySv} Sv
- Mixing-Zone Variance @ 25m: +${simMetrics.mixingDelta25m} PSU (Limit < 1.50 PSU)
- Projected Benthic Dissolved Oxygen: ${simMetrics.benthicDoMgL} mg/L
- Corridor Acoustic Level: ${simMetrics.acousticDb} dB re 1 uPa (Limit < 120 dB)
- Composite Biodiversity Risk Rating: ${simMetrics.riskRating} (Score: ${simMetrics.riskScore}/100)

2. THREE ECOLOGICAL SCENARIOS & MITIGATION MATRIX:
--------------------------------------------------
${ECOLOGICAL_SCENARIOS.map(
  (s) => `
[${s.code}] ${s.title} (${s.riskTier})
Summary: ${s.summary}
Positive Climate Outcomes:
${s.climateOutcomes.map((o) => `  + ${o}`).join('\n')}
Local Marine Biodiversity Risks:
${s.localBiodiversityImpacts.map((b) => `  - ${b}`).join('\n')}
Mitigation Strategies:
${s.mitigationStrategies.map((m) => `  * ${m}`).join('\n')}
`
).join('\n')}

3. POLAR & DEEP-SEA EXTRACTIVE THREATS CONTEXT:
-----------------------------------------------
${POLAR_DEEPSEA_THREATS.map(
  (t) => `
- ${t.actorCategory}: ${t.title} (${t.region})
  Mechanism: ${t.mechanism}
  Consequences: ${t.ecologicalConsequences.join(' | ')}
  Regulatory Gap: ${t.regulatoryGap}
`
).join('\n')}

4. NZ & INTERNATIONAL COMPLIANCE AUDIT SUMMARY:
-----------------------------------------------
${checks
  .map(
    (c) => `
- Category: ${c.category}
  Parameter: ${c.parameterName}
  Regulatory Limit: ${c.thresholdLimit}
  Measured SaliBuoy Value: ${c.measuredSaliBuoyVal}
  Status: ${c.status}
  Mitigation: ${c.mitigationStrategy}
`
  )
  .join('\n')}
`;
    downloadFile(reportText, 'SaliBuoy_Ecological_Risk_Assessment_Audit.txt', 'text/plain');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>Ecological Risk Simulation • Polar Extractive Intelligence • EPA EEZ Act</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Sali-Buoy Risk Assessment, Marine Scenarios &amp; Polar Threats
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed mt-1">
              Interactive ecological simulation modeling AMOC climate stabilization vs. near-nozzle salinity and benthic dissolved-oxygen impacts across three scenarios—benchmarked against offshore South Pole fossil exploration and deep-sea seabed strip mining.
            </p>
          </div>

          <button
            onClick={exportEcoAuditReport}
            className="inline-flex items-center space-x-2 px-3.5 py-2 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/80 rounded-xl text-xs font-mono cursor-pointer transition-colors self-start sm:self-auto shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Full Risk Report</span>
          </button>
        </div>

        {/* Section Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/80 font-mono text-xs">
          {[
            { id: 'all', label: 'All Briefings (Full Report)' },
            { id: 'risk-sim', label: 'Risk Sim & 3 Scenarios' },
            { id: 'polar-threats', label: 'South Pole Oil & Seabed Strip Mining' },
            { id: 'compliance', label: 'NZ & IMO Compliance Matrix' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id as typeof activeSection)}
              className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                activeSection === tab.id
                  ? 'bg-emerald-600 text-white border-emerald-500 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* =================================================================== */}
      {/* SECTION 1: INTERACTIVE RISK SIMULATION & THREE ECOLOGICAL SCENARIOS */}
      {/* =================================================================== */}
      {(activeSection === 'all' || activeSection === 'risk-sim') && (
        <div className="space-y-6">
          {/* Interactive Simulation Workbench */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5 font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs text-cyan-400 font-bold uppercase">
                  <Sliders className="w-4 h-4" />
                  <span>Interactive Dispersion &amp; Climate Risk Simulation</span>
                </div>
                <p className="text-xs font-sans text-slate-400">
                  Adjust array scale, brine concentration, injection depth, and current mixing shear—or load one of the three ecological scenarios below.
                </p>
              </div>

              <div
                className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-bold shrink-0 ${
                  simMetrics.riskRating === 'High Stratification Risk'
                    ? 'bg-rose-950/90 text-rose-300 border-rose-700'
                    : simMetrics.riskRating === 'Elevated Risk'
                      ? 'bg-amber-950/90 text-amber-300 border-amber-700'
                      : 'bg-emerald-950/90 text-emerald-300 border-emerald-700'
                }`}
              >
                {simMetrics.riskRating === 'High Stratification Risk' ? (
                  <ShieldAlert className="w-4 h-4" />
                ) : simMetrics.riskRating === 'Elevated Risk' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                <span className="tabular-nums">
                  {simMetrics.riskRating} ({simMetrics.riskScore}/100)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Telemetry Sliders */}
              <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4 text-xs">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fleet Array Scale</span>
                    <span className="text-white font-bold tabular-nums">{fleetScale} buoys</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={5000}
                    step={10}
                    value={fleetScale}
                    onChange={(e) => setFleetScale(Number(e.target.value))}
                    className="w-full accent-teal-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 tabular-nums">
                    <span>10 (Pilot)</span>
                    <span>1,500</span>
                    <span>5,000 (Basin)</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nozzle Brine Salinity Delta</span>
                    <span className="text-cyan-300 font-bold tabular-nums">+{brineDeltaPsu.toFixed(2)} PSU</span>
                  </div>
                  <input
                    type="range"
                    min={0.2}
                    max={2.5}
                    step={0.05}
                    value={brineDeltaPsu}
                    onChange={(e) => setBrineDeltaPsu(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 tabular-nums">
                    <span>+0.20 PSU</span>
                    <span>+1.20 PSU</span>
                    <span>+2.50 PSU</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subsea Diffuser Depth</span>
                    <span className="text-sky-300 font-bold tabular-nums">{injectionDepthM} m</span>
                  </div>
                  <input
                    type="range"
                    min={30}
                    max={150}
                    step={5}
                    value={injectionDepthM}
                    onChange={(e) => setInjectionDepthM(Number(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 tabular-nums">
                    <span>30 m (Photic)</span>
                    <span>90 m</span>
                    <span>150 m (Deep Shear)</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-slate-400 block">Ambient Current Mixing Shear</span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Low', 'Moderate', 'High'] as ShearLevel[]).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setCurrentShear(level)}
                        className={`py-1.5 rounded-lg border text-[11px] font-bold transition-colors cursor-pointer ${
                          currentShear === level
                            ? 'bg-teal-600 text-white border-teal-500'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Live Simulation Output Readouts */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold">
                    <span className="flex items-center space-x-1.5">
                      <Compass className="w-4 h-4" />
                      <span>AMOC BUOYANCY FLUX</span>
                    </span>
                    <span className="text-[10px] text-slate-400">CLIMATE GAIN</span>
                  </div>
                  <div className="text-2xl font-extrabold text-white tabular-nums">
                    +{simMetrics.amocBuoyancySv} Sv
                  </div>
                  <p className="text-[11px] font-sans text-slate-400 leading-relaxed">
                    Estimated deep-water overturning reinforcement driven by dense brine plume convection.
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-cyan-400 font-bold">
                    <span className="flex items-center space-x-1.5">
                      <Waves className="w-4 h-4" />
                      <span>MIXING ZONE ΔPSU @ 25M</span>
                    </span>
                    <span className="text-[10px] text-slate-400 tabular-nums">LIMIT &lt;1.50</span>
                  </div>
                  <div
                    className={`text-2xl font-extrabold tabular-nums ${
                      simMetrics.mixingDelta25m > 1.5
                        ? 'text-rose-400'
                        : simMetrics.mixingDelta25m > 1.0
                          ? 'text-amber-300'
                          : 'text-emerald-300'
                    }`}
                  >
                    +{simMetrics.mixingDelta25m} PSU
                  </div>
                  <p className="text-[11px] font-sans text-slate-400 leading-relaxed">
                    {simMetrics.mixingDelta25m > 1.5
                      ? 'Exceeds EPA EEZ mixing perimeter threshold—osmotic stress on plankton & benthos.'
                      : 'Disperses within natural halocline variance outside the 25 m diffuser zone.'}
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-sky-400 font-bold">
                    <span className="flex items-center space-x-1.5">
                      <Fish className="w-4 h-4" />
                      <span>BENTHIC DISSOLVED O2</span>
                    </span>
                    <span className="text-[10px] text-slate-400 tabular-nums">SAFE &gt;5.2 mg/L</span>
                  </div>
                  <div
                    className={`text-2xl font-extrabold tabular-nums ${
                      simMetrics.benthicDoMgL < 4.5
                        ? 'text-rose-400'
                        : simMetrics.benthicDoMgL < 5.4
                          ? 'text-amber-300'
                          : 'text-emerald-300'
                    }`}
                  >
                    {simMetrics.benthicDoMgL} mg/L
                  </div>
                  <p className="text-[11px] font-sans text-slate-400 leading-relaxed">
                    {simMetrics.benthicDoMgL < 4.5
                      ? 'Hypoxia warning: low current shear allows dense brine to pool and block seafloor O2 exchange.'
                      : 'Adequate vertical oxygenation maintained across benthic habitats.'}
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold">
                    <span className="flex items-center space-x-1.5">
                      <Volume2 className="w-4 h-4" />
                      <span>CORRIDOR ACOUSTIC LEVEL</span>
                    </span>
                    <span className="text-[10px] text-slate-400 tabular-nums">IMO &lt;120 dB</span>
                  </div>
                  <div className="text-2xl font-extrabold text-white tabular-nums">
                    {simMetrics.acousticDb} dB
                  </div>
                  <p className="text-[11px] font-sans text-slate-400 leading-relaxed">
                    Non-cavitating magnetic drive signature (re 1 µPa @ 1 m) vs. 230+ dB seismic airguns.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Three Ecological Scenarios Grid */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              <div>
                <h3 className="text-lg font-extrabold text-white tracking-tight">
                  Three Potential Ecological Scenarios &amp; Mitigation Playbooks
                </h3>
                <p className="text-xs text-slate-400">
                  Select any scenario to load its telemetry profile into the dispersion simulator above and inspect climate outcomes, biodiversity risks, and engineered mitigations.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {ECOLOGICAL_SCENARIOS.map((scenario) => {
                const isSelected = activeScenarioId === scenario.id;
                return (
                  <div
                    key={scenario.id}
                    className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-teal-500 ring-1 ring-teal-500/40 shadow-xl'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 font-mono text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-slate-950 text-teal-300 border border-slate-800 font-bold">
                          {scenario.code}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded font-bold border ${
                            scenario.riskTier === 'Low Risk'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : scenario.riskTier === 'Elevated Risk'
                                ? 'bg-amber-950 text-amber-300 border-amber-800'
                                : 'bg-rose-950 text-rose-300 border-rose-800'
                          }`}
                        >
                          {scenario.riskTier}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white leading-snug">
                        {scenario.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {scenario.summary}
                      </p>

                      {/* Climate Stabilization Outcomes */}
                      <div className="bg-slate-950/90 border border-emerald-900/50 rounded-xl p-3 space-y-1.5">
                        <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Climate Stabilization Outcomes</span>
                        </div>
                        <ul className="space-y-1 text-[11px] text-slate-300 list-disc pl-4">
                          {scenario.climateOutcomes.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Negative Biodiversity Impacts */}
                      <div className="bg-slate-950/90 border border-rose-900/50 rounded-xl p-3 space-y-1.5">
                        <div className="text-[10px] font-mono font-bold text-rose-400 uppercase flex items-center space-x-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Injection-Zone Biodiversity Risks</span>
                        </div>
                        <ul className="space-y-1 text-[11px] text-slate-300 list-disc pl-4">
                          {scenario.localBiodiversityImpacts.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Proposed Mitigation Strategies */}
                      <div className="bg-slate-950/90 border border-sky-900/50 rounded-xl p-3 space-y-1.5">
                        <div className="text-[10px] font-mono font-bold text-sky-400 uppercase flex items-center space-x-1.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Proposed Mitigation Strategies</span>
                        </div>
                        <ul className="space-y-1 text-[11px] text-slate-300 list-disc pl-4">
                          {scenario.mitigationStrategies.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => applyScenarioPreset(scenario)}
                      className={`w-full py-2 rounded-xl font-mono text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1.5 ${
                        isSelected
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-950 hover:bg-slate-800 text-teal-300 border border-slate-700'
                      }`}
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>{isSelected ? 'Loaded in Simulator' : 'Load Scenario into Simulator'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* SECTION 2: BIG OIL AT THE SOUTH POLE & DEEP-SEA STRIP MINING        */}
      {/* =================================================================== */}
      {(activeSection === 'all' || activeSection === 'polar-threats') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 font-bold uppercase">
              <Snowflake className="w-4 h-4" />
              <span>Global Marine Baseline • Extractive Pressures Briefing</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              What Big Oil, Deep-Sea Strip Mining &amp; Industrial Fleets Are Doing in Polar &amp; Abyssal Waters
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-4xl leading-relaxed">
              Evaluating Sali-Buoy&apos;s non-extractive, zero-chemical ocean stabilization footprint requires understanding the competing industrial pressures currently hitting the Southern Ocean, Antarctic continental margins, and deep-sea basins.
            </p>
          </div>

          {/* 3 Detailed Threat Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {POLAR_DEEPSEA_THREATS.map((threat, index) => (
              <div
                key={threat.id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 font-mono text-[10px]">
                    <span className="text-amber-400 font-bold flex items-center space-x-1.5">
                      {index === 0 ? (
                        <Flame className="w-3.5 h-3.5 text-rose-400" />
                      ) : index === 1 ? (
                        <Pickaxe className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Ship className="w-3.5 h-3.5 text-sky-400" />
                      )}
                      <span>{threat.actorCategory}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {threat.statusTag}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white leading-snug">
                      {threat.title}
                    </h4>
                    <div className="text-[11px] font-mono text-teal-400 mt-1">
                      Zone: {threat.region}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {threat.mechanism}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-900">
                    <div className="text-[10px] font-mono font-bold text-rose-400 uppercase">
                      Documented Ecological Impacts
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-slate-300 list-disc pl-4">
                      {threat.ecologicalConsequences.map((consequence, cIdx) => (
                        <li key={cIdx}>{consequence}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                  <span className="font-mono font-bold text-amber-300 uppercase text-[10px] block mb-0.5">
                    Governance &amp; Legal Flashpoint
                  </span>
                  {threat.regulatoryGap}
                </div>
              </div>
            ))}
          </div>

          {/* Comparative Ecological Impact Matrix */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white uppercase">
                Comparative Ecological Footprint Matrix
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Sali-Buoy vs. Polar Fossil Exploration vs. Seabed Strip Mining
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 font-mono text-[10px] text-slate-400 uppercase">
                    <th className="py-3 px-4">Impact Dimension</th>
                    <th className="py-3 px-4 text-emerald-400">Sali-Buoy Operations</th>
                    <th className="py-3 px-4 text-rose-400">Big Oil / Polar Seismic</th>
                    <th className="py-3 px-4 text-amber-400">Deep-Sea Strip Mining</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  <tr>
                    <td className="py-3 px-4 font-bold text-white">Chemical / Toxic Discharge</td>
                    <td className="py-3 px-4 font-mono text-emerald-300">0.00 ppm synthetic additives (pure seawater brine)</td>
                    <td className="py-3 px-4">Drilling muds, polycyclic hydrocarbons, HFO &amp; black-carbon soot</td>
                    <td className="py-3 px-4">Heavy-metal dewatering plumes (Cd, Cu, As, Pb) across mid-water</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-white">Acoustic Footprint</td>
                    <td className="py-3 px-4 font-mono text-emerald-300 tabular-nums">84.2 dB re 1 µPa (non-cavitating)</td>
                    <td className="py-3 px-4 font-mono text-rose-300 tabular-nums">230–255 dB seismic airgun blasts</td>
                    <td className="py-3 px-4 font-mono text-amber-300 tabular-nums">160–190 dB crawler grinders &amp; riser pumps</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-white">Seabed Footprint</td>
                    <td className="py-3 px-4 font-mono text-emerald-300 tabular-nums">1.2 m² recoverable clump anchor</td>
                    <td className="py-3 px-4">Wellheads, seafloor pipelines &amp; toxic cuttings piles</td>
                    <td className="py-3 px-4">100% stripping of top 10–15 cm abyssal crust over 100s of km²/yr</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-white">Climate &amp; Carbon Effect</td>
                    <td className="py-3 px-4 text-emerald-300">Reinforces AMOC overturning &amp; deep heat/CO2 sink</td>
                    <td className="py-3 px-4 text-rose-300">Unlocks new fossil reserves &amp; darkens polar ice albedo</td>
                    <td className="py-3 px-4 text-amber-300">Resuspends ancient benthic carbon &amp; disrupts dark O2 cycling</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-white">Recovery Timeframe</td>
                    <td className="py-3 px-4 font-mono text-emerald-300">Minutes (plume dilution) / 100% mooring retrieval</td>
                    <td className="py-3 px-4">Decades to centuries (sub-zero oil persistence)</td>
                    <td className="py-3 px-4">Millennia (1–10 million years for nodule regrowth)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* SECTION 3: EXISTING NZ & INTERNATIONAL COMPLIANCE AUDIT MATRIX      */}
      {/* =================================================================== */}
      {(activeSection === 'all' || activeSection === 'compliance') && (
        <div className="space-y-6">
          {/* High-Level Safety Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="bg-slate-900 p-5 rounded-2xl border border-emerald-900/60 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400">
                <Droplets className="w-5 h-5" />
                <h4 className="font-bold text-sm text-white">0.00 ppm Synthetic Chemicals</h4>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                100% natural concentrated seawater brine. Zero anti-scalants, zero polymers, and zero synthetic chemical additives released into the marine column.
              </p>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-sky-900/60 space-y-2">
              <div className="flex items-center space-x-2 text-sky-400">
                <Volume2 className="w-5 h-5" />
                <h4 className="font-bold text-sm text-white">Subsea Mammal Shield (&lt;85 dB)</h4>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Operates at 84.2 dB re 1 µPa @ 1m—well below DOC/IMO 120 dB acoustic distress thresholds, ensuring zero echolocation interference for whales &amp; dolphins.
              </p>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-teal-900/60 space-y-2">
              <div className="flex items-center space-x-2 text-teal-400">
                <Scale className="w-5 h-5" />
                <h4 className="font-bold text-sm text-white">NZ EPA EEZ Act Permitted</h4>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Classified as a non-polluting oceanographic research structure with 100% recoverable seabed anchors via acoustic release shackles.
              </p>
            </div>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar font-mono text-xs">
            {['All', 'Acoustic Mammal Protection', 'Zero Chemical Guarantee', 'Localized Salinity Delta', 'EPA EEZ Permitting', 'Benthic Anchor Footprint'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Compliance Matrix Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4 p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>NZ &amp; International Marine Compliance Audit Table</span>
              </div>

              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800 tabular-nums">
                5 / 5 Parameters Certified
              </span>
            </div>

            <div className="space-y-4">
              {filteredChecks.map((item) => (
                <div key={item.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="font-bold text-white text-sm">{item.parameterName}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-bold">
                        {item.status}
                      </span>
                      <span className="text-[10px] text-slate-400">Body: {item.governingBody}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div className="bg-slate-900 p-2.5 rounded border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] block uppercase">Regulatory Threshold Limit</span>
                      <span className="text-slate-300 font-bold">{item.thresholdLimit}</span>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded border border-emerald-900/60 space-y-1">
                      <span className="text-emerald-400 text-[10px] block uppercase font-bold">SaliBuoy Tested Level</span>
                      <span className="text-emerald-300 font-bold">{item.measuredSaliBuoyVal}</span>
                    </div>
                  </div>

                  <div className="text-slate-300 bg-slate-900/60 p-2.5 rounded border border-slate-800 text-[11px] leading-relaxed">
                    <strong className="text-slate-400">Engineering Mitigation Strategy:</strong> {item.mitigationStrategy}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
