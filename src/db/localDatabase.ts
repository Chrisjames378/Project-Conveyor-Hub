import { FundingLead, HardwareMilestone, BusinessTask, TelemetryBuoy, BOMItem, PitchSlide } from '../types';

export const INITIAL_FUNDING_LEADS: FundingLead[] = [
  {
    id: 'fund-1',
    category: 'Venture Capital',
    organization: 'Outset Ventures (Pukekohe, AKL)',
    focusArea: 'DeepTech / HardTech Physical Science',
    targetAmountNZD: 500000,
    status: 'In Application',
    probabilityPercent: 70,
    expectedDecisionMonth: 'Q4 2026',
    keyRequirement: 'Working Mark-II benchtop hydrodynamic prototype demo',
    nzRegion: 'Auckland'
  },
  {
    id: 'fund-2',
    category: 'Government Grant',
    organization: 'Callaghan Innovation (New Zealand)',
    focusArea: 'New Partnered R&D Grant (40% Co-Funding)',
    targetAmountNZD: 250000,
    status: 'Approved / Securing',
    probabilityPercent: 90,
    expectedDecisionMonth: 'Q3 2026',
    keyRequirement: 'NZBN registered, $50k eligible R&D expenditure history',
    nzRegion: 'National (NZ)'
  },
  {
    id: 'fund-3',
    category: 'Venture Capital',
    organization: 'Pacific Channel',
    focusArea: 'DeepTech, Agri/Ocean Venture Capital',
    targetAmountNZD: 750000,
    status: 'Due Diligence',
    probabilityPercent: 60,
    expectedDecisionMonth: 'Q1 2027',
    keyRequirement: 'IPONZ Provisional Patent filing & AMOC oceanographic validation model',
    nzRegion: 'Auckland / National'
  },
  {
    id: 'fund-4',
    category: 'Government Grant',
    organization: 'MBIE Endeavour Fund (Smart Ideas)',
    focusArea: 'Transformational Physical Science & Climate',
    targetAmountNZD: 1000000,
    status: 'Upcoming',
    probabilityPercent: 50,
    expectedDecisionMonth: 'Q2 2027',
    keyRequirement: 'Co-applicant partnership with NIWA or University of Auckland',
    nzRegion: 'Wellington / National'
  },
  {
    id: 'fund-5',
    category: 'Venture Capital',
    organization: 'Icehouse Ventures & Climate VC Fund',
    focusArea: 'Early Stage Climate Tech',
    targetAmountNZD: 400000,
    status: 'Targeted',
    probabilityPercent: 45,
    expectedDecisionMonth: 'Q1 2027',
    keyRequirement: 'Completed Hauraki Gulf 30-day ocean deployment test',
    nzRegion: 'Auckland'
  },
  {
    id: 'fund-6',
    category: 'Research Subsidy',
    organization: 'Sustainable Seas National Science Challenge',
    focusArea: 'Ocean Ecosystem & Hydrodynamic Impact',
    targetAmountNZD: 300000,
    status: 'In Application',
    probabilityPercent: 80,
    expectedDecisionMonth: 'Q4 2026',
    keyRequirement: 'Zero micro-pollutant discharge proof from salinity pumps',
    nzRegion: 'National'
  },
  {
    id: 'fund-7',
    category: 'Research Subsidy',
    organization: 'Antarctica New Zealand Southern Ocean Subsidy',
    focusArea: 'Polar Waters Climate Mitigation Testing',
    targetAmountNZD: 200000,
    status: 'Targeted',
    probabilityPercent: 65,
    expectedDecisionMonth: 'Q2 2027',
    keyRequirement: 'Scott Base / Campbell Island vessel berth space allocation',
    nzRegion: 'Christchurch / Southern Ocean'
  }
];

export const INITIAL_HARDWARE_MILESTONES: HardwareMilestone[] = [
  {
    id: 'hw-1',
    phase: 'Phase 1',
    codename: 'Mark-I "Lab Hydro-Bench"',
    targetDate: 'Q1-Q2 2026',
    status: 'Completed',
    salinityOutputPsu: 38.5,
    depthRatingMeters: 50,
    powerSource: 'Direct 24V DC Shore Supply',
    keyObjective: 'Validate micro-salt diffusion dynamics & prevent plume dissipation at shallow pressure',
    progressPercent: 100,
    specifications: [
      'Polyethylene pressure vessel',
      'Ceramic micro-jet brine nozzle',
      'Lab-scale conductivity & temperature sensors',
      'Optical plume density tracker'
    ]
  },
  {
    id: 'hw-2',
    phase: 'Phase 2',
    codename: 'Mark-II "Subsurface Injector"',
    targetDate: 'Q3-Q4 2026',
    status: 'In Development',
    salinityOutputPsu: 42.0,
    depthRatingMeters: 200,
    powerSource: 'Solar-PV Top Float + Hybrid Battery',
    keyObjective: 'Autonomous 14-day continuous operation in Hauraki Gulf protected waters',
    progressPercent: 75,
    specifications: [
      'Marine Grade 316L Stainless & Anodized Al Hull',
      '120 L/min High-Efficiency Brine Dispersion Pump',
      'Cellular/Iridium Dual Channel Telemetry',
      'Self-Righting Hydrodynamic Wave Collar'
    ]
  },
  {
    id: 'hw-3',
    phase: 'Phase 3',
    codename: 'Mark-III "Deep Ocean Autonomous Sentinel"',
    targetDate: 'Q1-Q3 2027',
    status: 'Testing',
    salinityOutputPsu: 45.0,
    depthRatingMeters: 500,
    powerSource: 'Piezo-Wave Generator + Solar + Micro-Turbine',
    keyObjective: 'Deep-water downwelling pump activation off Cape Reinga & Southern Ocean boundary',
    progressPercent: 35,
    specifications: [
      'Titanium Grade 5 Pressure Enclosure',
      'Subsea Variable-Variable Density Diffusion System',
      'Iridium SBD Satellite Telemetry + Acoustic Doppler Profiler',
      'Autonomous Acoustic Release Anchoring Rig'
    ]
  },
  {
    id: 'hw-4',
    phase: 'Phase 4',
    codename: 'Mark-IV "AMOC Cryo-Fleet Array"',
    targetDate: '2027-2028',
    status: 'Planned',
    salinityOutputPsu: 48.0,
    depthRatingMeters: 1000,
    powerSource: 'Multi-Megawatt Ocean Thermal & Wave Harvesting Grid',
    keyObjective: 'Synchronized multi-buoy mesh array for large-scale North Atlantic / Southern Ocean salinity pumping',
    progressPercent: 10,
    specifications: [
      'Reinforced Composite Deep Hull',
      'AI Swarm Communication & Density Balancing',
      'Subsea Desalination Concentrator Core',
      'Autonomous Buoyancy Engine for Multi-Depth Diving'
    ]
  }
];

export const INITIAL_BUSINESS_TASKS: BusinessTask[] = [
  {
    id: 'biz-1',
    category: 'Legal Structure',
    title: 'Register NZBN & Sole Trader Trading Name',
    description: 'Establish SaliBuoy Systems under a New Zealand Business Number (NZBN) as a Sole Trader. Protect trading name and establish official business identity.',
    status: 'Completed',
    nzEntityName: 'SaliBuoy Systems (Sole Trader)',
    estimatedCostNZD: 0,
    authorityOrPortal: 'NZBN Register (nzbn.govt.nz) & Companies Office',
    keySteps: [
      'Log into myIR or RealMe on nzbn.govt.nz',
      'Apply for free NZBN for Sole Trader',
      'Register trading name "SaliBuoy Systems"',
      'Link primary business location (Auckland, NZ)'
    ]
  },
  {
    id: 'biz-2',
    category: 'Tax & IRD',
    title: 'IRD Sole Trader Registration & GST Setup',
    description: 'Register business IRD tax details, select accounting basis (Invoice or Payments), and register for GST if annual gross income or grants exceed NZD $60,000.',
    status: 'In Progress',
    nzEntityName: 'Inland Revenue Dept (myIR)',
    estimatedCostNZD: 0,
    authorityOrPortal: 'Inland Revenue NZ (ird.govt.nz)',
    keySteps: [
      'Add business activity BIC code (M691010 - Physical & Scientific Research)',
      'Set up GST accounting in myIR (Bi-monthly / Cash basis recommended)',
      'Establish separate business bank account for sole trader tracking',
      'Set aside 25-30% of grant income for provisional tax'
    ]
  },
  {
    id: 'biz-3',
    category: 'IP & Patents',
    title: 'Provisional Patent Application with IPONZ',
    description: 'File New Zealand Provisional Patent covering the Variable-Density Salinity Diffusion Nozzle and Subsurface Downwelling Pump Architecture.',
    status: 'In Progress',
    nzEntityName: 'IPONZ (Intellectual Property Office NZ)',
    estimatedCostNZD: 350,
    authorityOrPortal: 'iponz.govt.nz',
    keySteps: [
      'Prepare patent specification & CAD schematics for diffusion pump',
      'Submit Provisional Patent Application ($160 NZD IPONZ fee)',
      '12-month international protection window under PCT (Patent Cooperation Treaty)',
      'Assign IP rights clean to SaliBuoy entity prior to VC investment'
    ]
  },
  {
    id: 'biz-4',
    category: 'DeepTech Incubation',
    title: 'Outset Ventures & Callaghan R&D Portal Setup',
    description: 'Apply for Pukekohe-based Outset Ventures incubator access (lab space, wet-testing tanks) and create Callaghan Innovation portal profile for 40% R&D rebate.',
    status: 'Pending',
    nzEntityName: 'Outset Ventures / Callaghan Innovation',
    estimatedCostNZD: 0,
    authorityOrPortal: 'outsetventures.co & callaghaninnovation.govt.nz',
    keySteps: [
      'Submit lab access application at Pukekohe DeepTech facility',
      'Register SaliBuoy R&D expenditure log',
      'Engage Callaghan Innovation DeepTech Advisor in Auckland',
      'Prepare technical progress report for 40% R&D co-funding claim'
    ]
  },
  {
    id: 'biz-5',
    category: 'Ocean Maritime Consents',
    title: 'Maritime NZ & EPA Coastal Discharge Consents',
    description: 'Consult with Environmental Protection Authority (EPA) for EEZ marine discharge exemption for natural brine/salinity injection testing in NZ coastal waters.',
    status: 'Pending',
    nzEntityName: 'EPA NZ & Maritime NZ',
    estimatedCostNZD: 1200,
    authorityOrPortal: 'epa.govt.nz & maritimenz.govt.nz',
    keySteps: [
      'Draft Environmental Impact Assessment (EIA) for localized brine diffusion',
      'Submit EEZ Permitted Activity Notification to EPA NZ',
      'Notify Maritime NZ of moored buoy GPS coordinates & navigation hazard light',
      'Consult Local Iwi / Mana Whenua regarding Hauraki Gulf ocean testing'
    ]
  }
];

export const INITIAL_TELEMETRY_BUOYS: TelemetryBuoy[] = [
  {
    id: 'buoy-101',
    name: 'SaliBuoy-Alpha (Mark-II)',
    location: 'Hauraki Gulf Outer Reach (Auckland, NZ)',
    coordinates: { lat: -36.421, lng: 175.102 },
    salinityPsu: 36.8,
    ambientTempC: 16.4,
    pumpRateLpM: 85.0,
    batteryPct: 94,
    solarWatts: 240,
    wavePowerWatts: 180,
    status: 'Operational',
    lastPing: '2 mins ago'
  },
  {
    id: 'buoy-102',
    name: 'SaliBuoy-Beta (Mark-II)',
    location: 'Campbell Plateau (Sub-Antarctic NZ Waters)',
    coordinates: { lat: -52.115, lng: 169.304 },
    salinityPsu: 38.2,
    ambientTempC: 7.1,
    pumpRateLpM: 110.0,
    batteryPct: 88,
    solarWatts: 120,
    wavePowerWatts: 410,
    status: 'Operational',
    lastPing: '5 mins ago'
  },
  {
    id: 'buoy-103',
    name: 'SaliBuoy-Gamma (Mark-III Prototype)',
    location: 'Cape Reinga Deep Trench (Northland, NZ)',
    coordinates: { lat: -34.201, lng: 172.580 },
    salinityPsu: 41.5,
    ambientTempC: 14.8,
    pumpRateLpM: 145.0,
    batteryPct: 99,
    solarWatts: 310,
    wavePowerWatts: 290,
    status: 'Operational',
    lastPing: '1 min ago'
  },
  {
    id: 'buoy-104',
    name: 'SaliBuoy-NorthAtlantic-01 (Simulated)',
    location: 'Icelandic Basin (Sub-Polar Gyre Injection Zone)',
    coordinates: { lat: 62.450, lng: -20.180 },
    salinityPsu: 43.1,
    ambientTempC: 4.2,
    pumpRateLpM: 180.0,
    batteryPct: 82,
    solarWatts: 40,
    wavePowerWatts: 580,
    status: 'Deploying',
    lastPing: '12 mins ago'
  }
];

export const INITIAL_BOM_ITEMS: BOMItem[] = [
  {
    id: 'bom-1',
    category: 'Pressure Hull & Subframe',
    partName: 'Marine Grade 5 Titanium Pressure Cylinder',
    specification: '500m Depth Rated, Hard Anodized Nitride Coating',
    supplier: 'Callaghan Fabrication / NZ Marine Tech',
    unitCostNZD: 8500,
    qtyPerBuoy: 1,
    leadTimeWeeks: 4
  },
  {
    id: 'bom-2',
    category: 'Salinity Pump & Diffusion',
    partName: 'Ceramic Dual-Chamber Brine Injector Pump',
    specification: '200 L/min flow rate, zero-corrosion ceramic impellers',
    supplier: 'HydroPump Solutions (Auckland)',
    unitCostNZD: 4200,
    qtyPerBuoy: 2,
    leadTimeWeeks: 3
  },
  {
    id: 'bom-3',
    category: 'Power & Energy Storage',
    partName: 'LiFePO4 Marine Battery Pack (2.4 kWh 24V)',
    specification: 'Subsea IP68 potted enclosure, BMS with thermal protection',
    supplier: 'EnerSys NZ / Outset Labs',
    unitCostNZD: 3100,
    qtyPerBuoy: 1,
    leadTimeWeeks: 2
  },
  {
    id: 'bom-4',
    category: 'Power & Energy Storage',
    partName: 'Vertical Axis Wind Turbine Top Float',
    specification: 'Wind-driven aerodynamic kinetic rotor (680W peak)',
    supplier: 'SaliBuoy In-House / Outset WetLab',
    unitCostNZD: 5400,
    qtyPerBuoy: 1,
    leadTimeWeeks: 6
  },
  {
    id: 'bom-5',
    category: 'Telemetry & Autonomy',
    partName: 'Iridium SBD Satellite + GPS + ADCP Transceiver Module',
    specification: 'Global ocean coverage, sub-surface acoustic telemetry modem',
    supplier: 'Ocean Instruments NZ',
    unitCostNZD: 2900,
    qtyPerBuoy: 1,
    leadTimeWeeks: 2
  },
  {
    id: 'bom-6',
    category: 'Mooring & Anchoring',
    partName: 'Kevlar Reinforced Mooring Cable & Acoustic Release',
    specification: '1,000m length, 5-ton breaking strain, ultrasonic trigger',
    supplier: 'NIWA Marine Gear / Pacific Ropes',
    unitCostNZD: 3800,
    qtyPerBuoy: 1,
    leadTimeWeeks: 3
  }
];

export const INITIAL_PITCH_SLIDES: PitchSlide[] = [
  {
    id: 1,
    title: 'The Tipping Point: AMOC Slowdown',
    subtitle: 'The Atlantic Meridional Overturning Circulation is at imminent risk of collapse.',
    bulletPoints: [
      'Freshwater glacial melt in Greenland is diluting North Atlantic surface salinity.',
      'Without dense saline downwelling, the oceanic thermal conveyor belt stalls.',
      'A collapse causes catastrophic climate shifts, severe European freezing, and tropical monsoonal failure.'
    ],
    highlightMetric: { value: '1.2 Sv', label: 'Observed AMOC Flow Reduction' },
    calloutNote: 'SaliBuoy provides a targeted, hardware-driven mechanical intervention to restore surface salinity density.'
  },
  {
    id: 2,
    title: 'The Solution: SaliBuoy Systems',
    subtitle: 'Autonomous Deep-Ocean Salinity Pumping & Cryo-Restoration Arrays.',
    bulletPoints: [
      'Hardware-first autonomous buoy networks that extract and inject high-density brine into deep downwelling channels.',
      'Powered 100% by surface wind kinetic harvesting rotors and solar micro-grids.',
      'Triggers localized ocean water column sinking, accelerating natural AMOC convection currents.'
    ],
    highlightMetric: { value: '45.0 PSU', label: 'Target Downwelling Salinity Injection' },
    calloutNote: 'Engineered in New Zealand to harness Southern Ocean and North Atlantic wind dynamics.'
  },
  {
    id: 3,
    title: 'Hardware Evolution Roadmap',
    subtitle: 'From Benchtop Hydrodynamics to Deep Ocean Swarm Arrays.',
    bulletPoints: [
      'Mark-I (Completed): Verified micro-salt diffusion and plume dynamics.',
      'Mark-II (In Progress): 200m depth rated subsurface injector with wind turbine float.',
      'Mark-III (Next Phase): 500m titanium sentinel tested off Cape Reinga & Campbell Plateau.',
      'Mark-IV (Scale Target): 1,000m autonomous cryo-fleet deploying AI density balancing.'
    ],
    highlightMetric: { value: '500m', label: 'Mark-III Operational Rating' },
    calloutNote: 'Rapid iteration leveraging Auckland DeepTech ecosystem and marine engineering infrastructure.'
  },
  {
    id: 4,
    title: 'New Zealand: The Ideal Testbed & Base',
    subtitle: 'Unrivaled access to extreme Southern Ocean conditions and DeepTech capital.',
    bulletPoints: [
      'Auckland DeepTech cluster (Outset Ventures Pukekohe, Callaghan Innovation).',
      'Immediate access to extreme sub-Antarctic waters for rigorous ocean proving grounds.',
      'Strong NZ Government climate backing (MBIE Endeavour, 40% R&D Grant Rebates).'
    ],
    highlightMetric: { value: '40%', label: 'NZ Callaghan R&D Grant Rebate' },
    calloutNote: 'Sole Trader structure transitioning into clean NZ Limited Company with full IP assignment.'
  },
  {
    id: 5,
    title: 'Regulatory & Environmental Guardrails',
    subtitle: 'Proactive compliance under Maritime NZ, EPA, and Law of the Sea (UNCLOS).',
    bulletPoints: [
      'Zero synthetic chemicals: uses natural concentrated ocean brine from desalination or ambient salinity loops.',
      'Continuous acoustic monitoring prevents disruption to marine mammal sonar.',
      'Full compliance with Maritime NZ navigation aids and EPA Permitted Activity Framework.'
    ],
    highlightMetric: { value: '0 Chemical', label: '100% Ocean-Native Brine System' },
    calloutNote: 'Partnering with oceanographic bodies to establish international AMOC intervention protocols.'
  },
  {
    id: 6,
    title: 'Business Model & Monetization',
    subtitle: 'Ocean-Carbon/Cryo Credits & Sovereign Climate Resilience Contracts.',
    bulletPoints: [
      'Sovereign Wealth & UN Climate Adaptation Fund deployment contracts.',
      'Cryo-Stabilization Credits: Carbon-equivalent metrics for preventing catastrophic polar thawing.',
      'Oceanographic Data Subscriptions: High-resolution deep ocean telemetry sold to NOAA, NIWA, and climate modeling institutes.'
    ],
    highlightMetric: { value: '$12.5B+', label: 'Global Ocean Geo-Engineering TAM' },
    calloutNote: 'Initial revenue generated via deep-ocean data sensing prior to full array scaling.'
  },
  {
    id: 7,
    title: '12-Month Seed Funding Ask',
    subtitle: 'Raising $1.5M NZD to execute offshore deployments and Mark-III fabrication.',
    bulletPoints: [
      '$500k NZD: Lead VC (Outset Ventures / Pacific Channel).',
      '$400k NZD: Co-Investment (Icehouse Climate VC).',
      '$600k NZD: Non-dilutive NZ Govt Grants (Callaghan 40% R&D + MBIE).',
      'Key Milestone: 90-day continuous Southern Ocean deployment & AMOC downwelling validation.'
    ],
    highlightMetric: { value: '$1.5M NZD', label: 'Seed Round Total ($600k Non-Dilutive)' },
    calloutNote: '12-month runway to reach Mark-III sea trials and series A readiness.'
  }
];
