export type ActiveTab = 
  | 'landing'
  | 'overview' 
  | 'ocean-boys-fleet'
  | 'mesh-ai'
  | 'wind-turbine-3d'
  | 'weather-pollution-3d'
  | 'oceania-observatory'
  | 'global-climate'
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

export interface WeatherPattern3DData {
  temperatureC: number;
  temperatureF: number;
  feelsLikeC: number;
  pressureHpa: number;
  pressureTendency: 'Rising' | 'Steady' | 'Falling';
  windSpeedKnots: number;
  windSpeedMs: number;
  windDirectionDeg: number;
  windDirectionCompass: string;
  windGustKnots: number;
  cloudCoverPct: number;
  cloudCeilingM: number;
  cloudType: string;
  humidityPct: number;
  dewPointC: number;
  precipRateMmH: number;
  precipType: 'None' | 'Light Rain' | 'Heavy Rain' | 'Squall' | 'Sleet';
  frontalSystem: 'Subtropical Ridge' | 'Polar Low' | 'Cold Front' | 'Warm Sector' | 'Cyclonic Trough' | 'Marine Boundary Layer';
  jetStreamSpeedKnots: number;
  uvIndex: number;
  forecastSummary: string;
}

export interface PollutionReportData {
  co2: {
    ppm: number;
    baselinePpm: number;
    deltaPpm: number;
    status: 'Baseline Clean' | 'Mild Elevation' | 'High Plume' | 'Marine Sink Active';
    oceanAtmosphereFluxMmolM2Day: number;
    salibuoySinkOffsetTonnesDay: number;
    attribution: {
      fossilFuelPct: number;
      transportPct: number;
      marineDegassingPct: number;
      naturalVegetationPct: number;
    };
    trend24h: number;
    keelingDiscrepancy: string;
  };
  methane: {
    ppb: number;
    baselinePpb: number;
    deltaPpb: number;
    status: 'Normal Baseline' | 'Elevated Seep' | 'Plume Warning' | 'Agricultural Hotspot';
    subseaHydrateStabilityPct: number;
    gwp20ImpactFactor: number;
    attribution: {
      subseaClathratePct: number;
      agriculturalEntericPct: number;
      wetlandBiogenicPct: number;
      fugitiveFossilPct: number;
    };
    acousticBubbleFlareDetected: boolean;
    marineOHOxidationRatePpbDay: number;
    plumeRiskDescription: string;
  };
  aqi: number;
  aqiCategory: 'Good (Pristine Marine)' | 'Moderate' | 'Unhealthy for Sensitive' | 'Hazardous';
  pm25: number;
  pm10: number;
  troposphericOzonePpb: number;
  nitrousOxidePpb: number;
  overallAirQualitySummary: string;
}

export interface LocationIntel {
  id: string;
  name: string;
  subtitle: string;
  category: 'Atmospheric Baseline' | 'SaliBuoy Engineering' | 'Subsea Methane Hydrate' | 'Marine Observatory' | 'Polar Station' | 'Custom / GPS';
  lat: number;
  lng: number;
  elevationM: number;
  nearestBasin: string;
  isUserGps?: boolean;
  weather: WeatherPattern3DData;
  pollution: PollutionReportData;
}

export interface SatelliteFrame {
  frameId: string;
  timestamp: string;
  label: string;
  imageUrl: string;
  cloudCoverPct: number;
  sensorMode: string;
  solarZenithAngleDeg: number;
  dataQualityPct: number;
}

export interface SatellitePassInfo {
  satellite: string;
  elevationAngle: string;
  nextPassMinutes: number;
  liveImageAvailable: boolean;
  multispectralChannel: string;
  imageUrl: string;
  recentFrames?: SatelliteFrame[];
  currentFrameIndex?: number;
  lastScannedAt?: string;
  cloudCoverPct?: number;
  opticalResolutionM?: number;
  downlinkLatencyMs?: number;
}

export interface CurrentVelocity {
  speedKnots: number;
  speedMs: number;
  directionDeg: number;
  directionCompass: string;
  currentSystem: string;
  uVelocityMs: number;
  vVelocityMs: number;
}

export interface PredictedTrajectoryPoint {
  hoursAhead: number; // +6, +12, +24, +48
  coordinates: { lat: number; lng: number };
  driftDistanceKm: number;
  timestamp: string;
  confidencePct: number;
}

export interface OceanBoy {
  id: string;
  name: string;
  nickname: string;
  category: 'SaliBuoy Pumping Fleet' | 'Argo Profiling Float' | 'NOAA DART Tsunami Buoy' | 'BOM & Tasman Marine Buoy' | 'Southern Ocean Mooring';
  coordinates: { lat: number; lng: number };
  status: 'Operational' | 'Active Downwelling' | 'Deep Dive Profile' | 'Tsunami Watch' | 'Standby' | 'Deploying';
  salinityPsu: number;
  ambientTempC: number;
  depthM: number;
  waveHeightM: number;
  wavePowerWatts: number;
  batteryPct: number;
  solarWatts: number;
  pumpRateLpM: number;
  satelliteUplink: 'Himawari-9 DCS' | 'Iridium SBD' | 'Argos-4 PTT' | 'GOES-DCS' | 'Starlink Maritime';
  lastPing: string;
  satellitePass: SatellitePassInfo;
  description: string;
  region: string;
  currentVelocity?: CurrentVelocity;
  predictedTrajectory?: PredictedTrajectoryPoint[];
  driftHeadingDeg?: number;
  driftSpeedKnots?: number;
}

export interface OppoA6xDeviceState {
  model: 'Oppo A6x (CPH2579 / Android 14)';
  screenResolution: '1612 x 720 (20:9 HD+ 90Hz Sunlight Display)';
  os: 'ColorOS 14 (Android 14 Base)';
  batteryLevel: number;
  isBatterySaverActive: boolean;
  networkType: '5G / 4G LTE (NZ Spark / One NZ / 2degrees)' | 'WiFi 6' | 'Offshore Satellite Direct';
  cachedTelemetryPackets: number;
  syncLatencyMs: number;
  isFieldTerminalLinked: boolean;
  fieldGps: { lat: number; lng: number; accuracyM: number };
  refreshRateHz: 90;
}

export type OppoA5xDeviceState = OppoA6xDeviceState;

export interface SmsAlertConfig {
  phoneNumber: string;
  isAlertsEnabled: boolean;
  alertOnAnonymousInfo: boolean;
  alertOnDriftDeviation: boolean;
  alertOnTsunamiWatch: boolean;
  alertOnSalinitySpike: boolean;
  alertOnDownwellingActive: boolean;
  lastDispatchedAt?: string;
}

export interface AnonymousSmsAlert {
  id: string;
  timestamp: string;
  sender: 'ANONYMOUS_REPORT' | 'FIELD_AGENT' | 'MARITIME_OBSERVER' | 'SUBSEA_SENSOR';
  sourceLocation?: string;
  message: string;
  severity: 'URGENT' | 'HIGH' | 'INFO';
  buoyId?: string;
  smsDispatchStatus: 'DELIVERED_TO_PHONE' | 'QUEUED' | 'SIMULATED';
  recipientPhone: string;
}

export interface NoaaCrwMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  changeRate: string;
  anomalyStatus: 'Critical Cold' | 'Normal' | 'Elevated' | 'Extreme Heat' | 'Destabilized';
  description: string;
  satelliteSensor: string;
  sourceAuthority: string;
}

export interface OceanRegionData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  sstAnomaly: number; // in °C
  surfaceTemp: number; // in °C
  salinityPsu: number; // PSU
  oceanHeatContentZJ: number; // Zettajoules anomaly
  amocRole: string;
  convectiveStatus: 'Active Downwelling' | 'Impaired Convection' | 'Severe Freshening Cap' | 'Stagnant Warm Pool';
  densitySigma: number; // kg/m3
  salibuoyInterventionFeasible: boolean;
  notes: string;
}

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

// ==========================================
// MESH AI - 3D APP FOR MODELING & 3D PRINTING
// ==========================================

export type MeshAIPrimitiveType = 
  | 'box' 
  | 'sphere' 
  | 'cylinder' 
  | 'cone' 
  | 'torus' 
  | 'capsule' 
  | 'wedge' 
  | 'buoy-casing' 
  | 'impeller' 
  | 'drone-chassis'
  | 'calibration-cube'
  | 'low-poly-character'
  | 'custom-ai';

export type SculptBrushType = 
  | 'clay' 
  | 'smooth' 
  | 'inflate' 
  | 'deflate' 
  | 'flatten' 
  | 'pinch' 
  | 'grab' 
  | 'paint';

export type MaterialPresetType = 
  | 'matte-pla' 
  | 'glossy-resin' 
  | 'metallic-titanium' 
  | 'cyber-lowpoly' 
  | 'clay-matcap' 
  | 'marine-protective'
  | 'neon-wire';

export interface MeshAIObject {
  id: string;
  name: string;
  type: MeshAIPrimitiveType;
  dimensions: { x: number; y: number; z: number }; // Dimensions in mm
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number }; // In radians
  scale: { x: number; y: number; z: number };
  color: string;
  materialPreset: MaterialPresetType;
  roughness: number;
  metalness: number;
  visible: boolean;
  locked: boolean;
  wireframe: boolean;
  vertexCount: number;
  faceCount: number;
  aiPrompt?: string;
  isBase64Mesh?: boolean;
}

export interface Print3DSliceMetrics {
  bedDimensionsMm: { x: number; y: number; z: number };
  modelDimensionsMm: { x: number; y: number; z: number };
  volumeCm3: number;
  estimatedWeightGrams: number;
  filamentType: 'PLA' | 'PETG' | 'ABS' | 'Resin';
  infillPct: number;
  layerHeightMm: number;
  estimatedPrintTimeMinutes: number;
  isWithinBuildVolume: boolean;
  overhangRiskCount: number;
  isWatertightManifold: boolean;
}

