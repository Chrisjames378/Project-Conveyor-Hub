export type ActiveTab = 
  | 'landing'
  | 'overview' 
  | 'system-dynamics'
  | 'funding' 
  | 'hardware' 
  | '3d-control'
  | 'satellite-weather'
  | 'nz-business' 
  | 'pitch-deck' 
  | 'telemetry' 
  | 'bom' 
  | 'regulatory'
  | 'outreach'
  | 'trials-logistics'
  | 'eco-impact'
  | 'financial-model';

export interface FundingLead {
  id: string;
  category: 'Venture Capital' | 'Government Grant' | 'Research Subsidy';
  organization: string;
  focusArea: string;
  targetAmountNZD: number;
  status: 'Targeted' | 'In Application' | 'Due Diligence' | 'Approved / Securing' | 'Upcoming';
  probabilityPercent: number;
  expectedDecisionMonth: string;
  keyRequirement: string;
  nzRegion: string;
}

export interface HardwareMilestone {
  id: string;
  phase: string;
  codename: string;
  targetDate: string;
  status: 'Completed' | 'In Development' | 'Testing' | 'Planned';
  salinityOutputPsu: number;
  depthRatingMeters: number;
  powerSource: string;
  keyObjective: string;
  progressPercent: number;
  specifications: string[];
}

export interface BusinessTask {
  id: string;
  category: 'Legal Structure' | 'Tax & IRD' | 'IP & Patents' | 'DeepTech Incubation' | 'Ocean Maritime Consents';
  title: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  nzEntityName: string;
  estimatedCostNZD: number;
  authorityOrPortal: string;
  keySteps: string[];
}

export interface TelemetryBuoy {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  salinityPsu: number;
  ambientTempC: number;
  pumpRateLpM: number;
  batteryPct: number;
  solarWatts: number;
  wavePowerWatts: number;
  status: 'Operational' | 'Standby' | 'Maintenance' | 'Deploying';
  lastPing: string;
}

export interface BOMItem {
  id: string;
  category: 'Pressure Hull & Subframe' | 'Salinity Pump & Diffusion' | 'Power & Energy Storage' | 'Telemetry & Autonomy' | 'Mooring & Anchoring';
  partName: string;
  specification: string;
  supplier: string;
  unitCostNZD: number;
  qtyPerBuoy: number;
  leadTimeWeeks: number;
}

export interface PitchSlide {
  id: number;
  title: string;
  subtitle: string;
  bulletPoints: string[];
  highlightMetric: { value: string; label: string };
  calloutNote: string;
}

export interface ThreeDSubsystem {
  id: string;
  name: string;
  partNo: string;
  layerDepthMeters: number;
  materialSpec: string;
  status: 'Nominal' | 'Active Pumping' | 'Standby' | 'Calibration';
  telemetryMetric: string;
  pressureBar: number;
  cadFileRef: string;
  lastInspectionDate: string;
  description?: string;
  rpm?: number;
  plumeVelocityMs?: number;
  iceYieldTonsPerDay?: number;
  physicsFormula?: string;
  subsystemCategory?: 'Wind Turbine & Surface Rotor' | 'Subsea Impeller Turbine' | 'Titanium Hull' | 'Energy Core' | 'Plume Diffuser' | 'Mooring Anchor';
}

export interface EcoComplianceCheck {
  id: string;
  category: 'Acoustic Mammal Protection' | 'Zero Chemical Guarantee' | 'Localized Salinity Delta' | 'EPA EEZ Permitting' | 'Benthic Anchor Footprint';
  parameterName: string;
  thresholdLimit: string;
  measuredSaliBuoyVal: string;
  status: 'Compliant - Certified' | 'Exceeds Standard' | 'Under Audit';
  governingBody: string;
  mitigationStrategy: string;
}

export interface FleetUnitEconomics {
  buoyUnitCapexNZD: number;
  annualOpexPerBuoyNZD: number;
  deployCount: number;
  carbonCreditsPerBuoyTons: number;
  carbonPricePerTonUSD: number;
  usefulLifeYears: number;
}
