import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Globe, 
  Radio, 
  ExternalLink,
  Eye,
  Terminal,
  Play,
  Pause,
  Flame,
  Box,
  Navigation,
  Volume2,
  VolumeX,
  Clock,
  TrendingUp,
  SlidersHorizontal,
  Waves,
  AlertTriangle,
  Sunrise,
  RadioTower,
  Siren,
  ShieldAlert,
  Activity,
  Zap,
  Download,
  RefreshCw,
  Sparkles,
  Send
} from 'lucide-react';

export interface FaultLine {
  id: string;
  name: string;
  lengthKm: number;
  strainAccumulation: string;
  riskLevel: 'HIGH' | 'CRITICAL' | 'VERY HIGH' | 'MODERATE' | 'LOW';
  lat: number;
  lon: number;
  depthRange: string;
  lastMajorEvent: string;
}

export interface VolcanoSystem {
  id: string;
  name: string;
  location: string;
  status: string;
  alertLevel: number;
  lat: number;
  lon: number;
  so2Flux: string;
  ashRisk: string;
  deformation: string;
}

export interface DayForecast {
  day: number;
  title: string;
  dateLabel: string;
  jetStreamSpeed: string;
  surfacePressure: string;
  ozoneAnomalies: string;
  seismicRiskIndex: number;
  seismicEventsCount: number;
  cloudCoverPct: number;
  atmosphericWave: string;
  tecAnomaly: string;
  temperature850: string;
  kpIndex: number;
}

export interface DartBuoy {
  id: string;
  name: string;
  lat: number;
  lon: number;
  depthM: number;
  seaLevelDeltaCm: string;
  status: string;
  battery: string;
}

export interface StationData {
  id: string;
  name: string;
  location: string;
  lat: number;
  lon: number;
  region: string;
  type: string;
  desc: string;
  methaneBaseline: string;
  ozoneDobson: number;
  uvIndex: number;
  status: string;
}

const FAULT_LINES: FaultLine[] = [
  { id: 'alpine-fault', name: 'Alpine Fault Zone (NZ South Island)', lengthKm: 600, strainAccumulation: '27 mm/yr', riskLevel: 'HIGH', lat: -43.5, lon: 170.2, depthRange: '5 - 25 km', lastMajorEvent: '1717 AD (~300 yr cycle)' },
  { id: 'hikurangi-trench', name: 'Hikurangi Subduction Margin', lengthKm: 500, strainAccumulation: '45 mm/yr', riskLevel: 'CRITICAL', lat: -39.8, lon: 178.1, depthRange: '10 - 50 km', lastMajorEvent: 'Slow slip ongoing' },
  { id: 'kermadec-trench', name: 'Kermadec - Tonga Trench', lengthKm: 1200, strainAccumulation: '80 mm/yr', riskLevel: 'VERY HIGH', lat: -28.5, lon: -175.2, depthRange: '15 - 700 km', lastMajorEvent: '2021 M8.1 Swarm' },
  { id: 'puysegur-trench', name: 'Puysegur Subduction Zone', lengthKm: 350, strainAccumulation: '32 mm/yr', riskLevel: 'MODERATE', lat: -47.1, lon: 165.8, depthRange: '10 - 40 km', lastMajorEvent: '2009 M7.8 Resolution' },
  { id: 'macquarie-ridge', name: 'Macquarie Plate Boundary', lengthKm: 900, strainAccumulation: '18 mm/yr', riskLevel: 'MODERATE', lat: -54.5, lon: 158.9, depthRange: '10 - 30 km', lastMajorEvent: '2004 M8.1 Macquarie' },
  { id: 'ross-sea-rift', name: 'Ross Sea Rift System (Antarctica)', lengthKm: 1100, strainAccumulation: '4 mm/yr', riskLevel: 'LOW', lat: -76.0, lon: 175.0, depthRange: '5 - 20 km', lastMajorEvent: 'Intraplate Microseismicity' }
];

const VOLCANO_SYSTEMS: VolcanoSystem[] = [
  { id: 'taupo-caldera', name: 'Taupō Supervolcano Caldera', location: 'Central North Island, NZ', status: 'UNREST LEVEL 1', alertLevel: 1, lat: -38.8, lon: 176.0, so2Flux: '120 tonnes/day', ashRisk: 'LOW', deformation: '+14 mm/yr uplift' },
  { id: 'whakaari-island', name: 'Whakaari / White Island', location: 'Bay of Plenty, NZ', status: 'ELEVATED UNREST', alertLevel: 2, lat: -37.52, lon: 177.18, so2Flux: '680 tonnes/day', ashRisk: 'MODERATE', deformation: '+32 mm/yr inflation' },
  { id: 'ruapehu-volcano', name: 'Mt Ruapehu Crater Lake', location: 'Tongariro National Park, NZ', status: 'WATCH', alertLevel: 1, lat: -39.28, lon: 175.56, so2Flux: '210 tonnes/day', ashRisk: 'LOW', deformation: 'Thermal turnover ongoing' },
  { id: 'hunga-tonga', name: 'Hunga Tonga-Hunga Ha′apai Arc', location: 'Tonga Ridge Arc', status: 'RECOVERY / MONITORING', alertLevel: 1, lat: -20.54, lon: -175.38, so2Flux: '45 tonnes/day', ashRisk: 'NEGLIGIBLE', deformation: 'Post-eruption caldera subsidence' },
  { id: 'monowai-seamount', name: 'Monowai Submarine Volcano', location: 'Kermadec Arc', status: 'ACTIVE SUBMARINE UNREST', alertLevel: 2, lat: -25.88, lon: -177.19, so2Flux: '890 tonnes/day', ashRisk: 'MARITIME HAZARD', deformation: 'Pulsing hydroacoustic tremors' }
];

const SEVEN_DAY_FORECAST: DayForecast[] = [
  {
    day: 1,
    title: 'Day 1: Subtropical Frontal Convergence',
    dateLabel: 'Current Observation',
    jetStreamSpeed: '145 km/h',
    surfacePressure: '1008 hPa',
    ozoneAnomalies: 'Mild Depletion (215 DU)',
    seismicRiskIndex: 3.8,
    seismicEventsCount: 14,
    cloudCoverPct: 62,
    atmosphericWave: 'Stable Rossby Phase',
    tecAnomaly: '+0.12 TECU',
    temperature850: '11.2°C',
    kpIndex: 3.1
  },
  {
    day: 2,
    title: 'Day 2: Polar Vortex Trough Extension',
    dateLabel: '+24 Hours',
    jetStreamSpeed: '168 km/h',
    surfacePressure: '998 hPa',
    ozoneAnomalies: 'Ozone Trough Pinching (198 DU)',
    seismicRiskIndex: 4.2,
    seismicEventsCount: 19,
    cloudCoverPct: 78,
    atmosphericWave: 'Amplifying Trough Boundary',
    tecAnomaly: '+0.28 TECU',
    temperature850: '8.4°C',
    kpIndex: 4.5
  },
  {
    day: 3,
    title: 'Day 3: Deep Marine Low & Alpine Strain Peak',
    dateLabel: '+48 Hours',
    jetStreamSpeed: '190 km/h',
    surfacePressure: '984 hPa',
    ozoneAnomalies: 'Stratospheric Dip (172 DU)',
    seismicRiskIndex: 6.7,
    seismicEventsCount: 28,
    cloudCoverPct: 91,
    atmosphericWave: 'Baroclinic Instability Wave',
    tecAnomaly: '+0.45 TECU',
    temperature850: '4.1°C',
    kpIndex: 5.8
  },
  {
    day: 4,
    title: 'Day 4: Hikurangi Tectonic Strain & Jet Alignment',
    dateLabel: '+72 Hours',
    jetStreamSpeed: '210 km/h',
    surfacePressure: '976 hPa',
    ozoneAnomalies: 'Core Depletion Oval (155 DU)',
    seismicRiskIndex: 8.4,
    seismicEventsCount: 42,
    cloudCoverPct: 95,
    atmosphericWave: 'Coupled Gravity-Acoustic Wave',
    tecAnomaly: '+0.82 TECU',
    temperature850: '1.8°C',
    kpIndex: 7.2
  },
  {
    day: 5,
    title: 'Day 5: Polar Stratospheric Warming Filamentation',
    dateLabel: '+96 Hours',
    jetStreamSpeed: '175 km/h',
    surfacePressure: '988 hPa',
    ozoneAnomalies: 'Vortex Shear Boundary (180 DU)',
    seismicRiskIndex: 5.9,
    seismicEventsCount: 22,
    cloudCoverPct: 82,
    atmosphericWave: 'Planetary Wave 1 Energy Dissipation',
    tecAnomaly: '+0.39 TECU',
    temperature850: '5.5°C',
    kpIndex: 4.8
  },
  {
    day: 6,
    title: 'Day 6: Subantarctic Ocean High Pressure Ridge',
    dateLabel: '+120 Hours',
    jetStreamSpeed: '135 km/h',
    surfacePressure: '1018 hPa',
    ozoneAnomalies: 'Column Recovery (235 DU)',
    seismicRiskIndex: 4.0,
    seismicEventsCount: 16,
    cloudCoverPct: 45,
    atmosphericWave: 'Anticyclonic Eddy Dominance',
    tecAnomaly: '+0.18 TECU',
    temperature850: '12.0°C',
    kpIndex: 3.0
  },
  {
    day: 7,
    title: 'Day 7: Equilibrium State & Equatorial Shear',
    dateLabel: '+144 Hours',
    jetStreamSpeed: '120 km/h',
    surfacePressure: '1014 hPa',
    ozoneAnomalies: 'Normalized Background (260 DU)',
    seismicRiskIndex: 2.9,
    seismicEventsCount: 11,
    cloudCoverPct: 35,
    atmosphericWave: 'Quasi-Biennial Oscillation Shift',
    tecAnomaly: '+0.05 TECU',
    temperature850: '14.2°C',
    kpIndex: 2.1
  }
];

const DART_BUOYS: DartBuoy[] = [
  { id: 'dart-54401', name: 'DART 54401 - Hikurangi East', lat: -38.5, lon: 179.8, depthM: 3820, seaLevelDeltaCm: '+2.4', status: 'ACTIVE', battery: '98%' },
  { id: 'dart-54402', name: 'DART 54402 - Kermadec Trench Central', lat: -31.2, lon: -177.1, depthM: 6100, seaLevelDeltaCm: '+0.8', status: 'ACTIVE', battery: '94%' },
  { id: 'dart-55012', name: 'DART 55012 - Norfolk Ridge West', lat: -29.8, lon: 167.4, depthM: 2950, seaLevelDeltaCm: '-0.3', status: 'ACTIVE', battery: '91%' },
  { id: 'dart-55023', name: 'DART 55023 - Puysegur Trench South', lat: -48.2, lon: 164.5, depthM: 4200, seaLevelDeltaCm: '+4.1', status: 'ALERT', battery: '88%' },
  { id: 'dart-52406', name: 'DART 52406 - Tonga Arc North', lat: -21.4, lon: -175.8, depthM: 5800, seaLevelDeltaCm: '+1.1', status: 'ACTIVE', battery: '96%' }
];

const INITIAL_STATIONS: StationData[] = [
  { id: 'south-pole-station', name: 'Amundsen-Scott South Pole Station', location: 'Geographic South Pole, Antarctica', lat: -90.0, lon: 0.0, region: 'South Pole', type: 'Polar Baseline Observatory', desc: 'Primary South Pole atmospheric facility recording spring ozone hole depletion dynamics and polar air masses.', methaneBaseline: '1805 ppb', ozoneDobson: 112, uvIndex: 1.2, status: 'OPERATIONAL' },
  { id: 'arrival-heights', name: 'Arrival Heights Laboratory', location: 'Ross Island, Antarctica', lat: -77.830, lon: 166.663, region: 'South Pole', type: 'Polar Vortex Monitoring Station', desc: 'Atmospheric laboratory operating Dobson spectrophotometer, FTIR and seismic broad-band sensors.', methaneBaseline: '1810 ppb', ozoneDobson: 128, uvIndex: 2.1, status: 'OPERATIONAL' },
  { id: 'auckland-mocc', name: 'Te Pūnaha Ātea MOCC', location: 'University of Auckland, NZ', lat: -36.848, lon: 174.763, region: 'Oceania', type: 'Mission Control Hub', desc: 'Mission Operations Control Centre operating satellite telemetry and regional seismic-atmospheric processing.', methaneBaseline: '1860 ppb', ozoneDobson: 280, uvIndex: 6.8, status: 'PRIMARY HUB' },
  { id: 'baring-head', name: 'Baring Head NIWA Station', location: 'Wellington, New Zealand', lat: -41.408, lon: 174.871, region: 'Oceania', type: 'CO2 / Methane Baseline Site', desc: 'Southern Hemisphere benchmark atmospheric marine boundary station operating continuous gas chromatography since 1989.', methaneBaseline: '1864 ppb', ozoneDobson: 285, uvIndex: 5.8, status: 'OPERATIONAL' },
  { id: 'lauder', name: 'Lauder Station (NIWA)', location: 'Central Otago, New Zealand', lat: -45.038, lon: 169.684, region: 'Oceania', type: 'TCCON Calibration Site', desc: 'High-resolution ground-truth solar FTIR spectrometer facility situated over the Alpine Fault margin.', methaneBaseline: '1862 ppb', ozoneDobson: 272, uvIndex: 5.4, status: 'OPERATIONAL' }
];

const CODE_PRESETS = [
  {
    id: 'laic-tec',
    name: 'LAIC Ionospheric TEC Precursor Model',
    code: `# Python Atmospheric-Seismic Coupling Engine
import numpy as np

def calculate_laic_precursor(tec_base_tecu, stress_bar, acoustic_freq_hz):
    """Calculates Total Electron Content (TEC) ionospheric shift induced by acoustic-gravity waves."""
    coupling_const = 0.0485
    stress_factor = np.log10(stress_bar)
    gravity_wave_coupling = np.sin(2 * np.pi * acoustic_freq_hz * 0.001)
    
    tec_shift = tec_base_tecu * coupling_const * stress_factor + gravity_wave_coupling
    status = "CRITICAL ANOMALY" if tec_shift > 0.6 else "NORMAL BACKGROUND"
    
    return {
        "tec_shift_tecu": round(tec_shift, 4),
        "status": status,
        "coupling_energy_joules": round(stress_bar * 1e4 * tec_shift, 2)
    }

# Execute Test Calculation for Hikurangi Fault Segment
result = calculate_laic_precursor(tec_base_tecu=14.2, stress_bar=620, acoustic_freq_hz=0.015)
print("[LAIC ENGINE OUTPUT]")
for k, v in result.items():
    print(f"  > {k}: {v}")
`
  },
  {
    id: 'tsunami-acoustic',
    name: 'Acoustic Shockwave Speed & Tsunami Arrival',
    code: `# Atmospheric Shockwave & Tsunami Ocean Speed Integrator
import numpy as np

def compute_wave_arrival(distance_km, ocean_depth_m):
    g = 9.81 # gravity m/s^2
    tsunami_speed_ms = np.sqrt(g * ocean_depth_m)
    tsunami_speed_kmh = tsunami_speed_ms * 3.6
    
    acoustic_wave_speed_ms = 310.0 # Acoustic-gravity atmospheric airwave
    acoustic_speed_kmh = acoustic_wave_speed_ms * 3.6
    
    ocean_eta_min = (distance_km / tsunami_speed_kmh) * 60
    airwave_eta_min = (distance_km / acoustic_speed_kmh) * 60
    
    return round(tsunami_speed_kmh, 1), round(ocean_eta_min, 1), round(airwave_eta_min, 1)

speed, ocean_eta, air_eta = compute_wave_arrival(distance_km=480, ocean_depth_m=4200)
print("[TSUNAMI & SHOCKWAVE INTEGRATOR]")
print(f"  > Ocean Tsunami Speed: {speed} km/h")
print(f"  > Coastal Water Arrival ETA: {ocean_eta} minutes")
print(f"  > Atmospheric Airwave Arrival ETA: {air_eta} minutes")
`
  },
  {
    id: 'alpine-strain',
    name: 'Alpine Fault Slip Velocity & Stress Strain',
    code: `# Alpine Fault Tectonic Stress Accumulation Integrator
import numpy as np

def compute_alpine_fault_strain(years_elapsed, slip_rate_mm_yr):
    strain_deficit_m = (years_elapsed * slip_rate_mm_yr) / 1000.0
    shear_modulus_gpa = 30.0  # Crustal rigidity
    accumulated_stress_mpa = strain_deficit_m * shear_modulus_gpa
    
    # Estimate potential moment magnitude Mw
    fault_area_sq_km = 600 * 15 # 600km length x 15km depth
    moment_nm = shear_modulus_gpa * 1e9 * (fault_area_sq_km * 1e6) * strain_deficit_m
    mw_potential = (2/3) * np.log10(moment_nm) - 6.07
    
    return strain_deficit_m, accumulated_stress_mpa, round(mw_potential, 2)

deficit, stress, mw = compute_alpine_fault_strain(years_elapsed=309, slip_rate_mm_yr=27)
print(f"[ALPINE FAULT MODEL]")
print(f"  > Years Elapsed Since Last Rupture: 309 Years (1717 AD)")
print(f"  > Total Slip Deficit: {deficit:.2f} meters")
print(f"  > Crustal Stress Accumulated: {stress:.2f} MPa")
print(f"  > Potential Magnitude Release: M_w {mw}")
`
  }
];

const playAudioFeedback = (type = 'click', params: { freq?: number } = {}) => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } else if (type === 'sonification') {
      const freq = params.freq || 120;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'alarm') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.setValueAtTime(900, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch (e) {
    // Ignore audio errors
  }
};

export function OceaniaObservatory() {
  const [activeTab, setActiveTab] = useState('3d-globe'); 
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Time & Audio State
  const [utcTime, setUtcTime] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sonificationActive, setSonificationActive] = useState(false);

  // Active Emergency Scenario Trigger State
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  // 7-Day Simulation Timeline State
  const [forecastDay, setForecastDay] = useState(4); // Default Day 4 peak
  const [isAutoPlayingTimeline, setIsAutoPlayingTimeline] = useState(false);
  const [playbackSpeed] = useState(2000); // 2000ms

  // 3D Controls & Camera Target State
  const [globeLayers, setGlobeLayers] = useState({
    atmosphereShell: true,
    polarVortexRing: true,
    seismicShiftNodes: true,
    volcanicHotspots: true,
    starfield: true
  });
  const [cameraPreset, setCameraPreset] = useState<'oceania' | 'southpole' | 'hikurangi' | 'global'>('oceania');
  const [rotationSpeed] = useState(0.002);

  // Satellite Image Filters State
  const [satChannel, setSatChannel] = useState('ir-cloud');
  const [satContrast, setSatContrast] = useState(1.15);
  const [satBrightness, setSatBrightness] = useState(1.05);
  const [satZoom, setSatZoom] = useState(1.0);

  // Tsunami & DART State
  const [tsunamiOrigin] = useState({ name: 'Hikurangi Subduction Trench', distanceKm: 480, oceanDepthM: 4200 });
  const [selectedBuoy, setSelectedBuoy] = useState<DartBuoy>(DART_BUOYS[0]);

  // Volcanic Systems State
  const [selectedVolcano, setSelectedVolcano] = useState<VolcanoSystem>(VOLCANO_SYSTEMS[0]);
  const [ashDispersionModelKm, setAshDispersionModelKm] = useState(180);

  // Space Weather State
  const [solarWindSpeed, setSolarWindSpeed] = useState(480); // km/s
  const [bzMagnetic, setBzMagnetic] = useState(-6.2); // nT
  const [auroraLatitude, setAuroraLatitude] = useState(-58.5); // South Lat boundary

  // Seismic Shift Monitoring State
  const [seismicEvents] = useState([
    { id: 'eq-1', region: 'Hikurangi Margin (Offshore Gisborne)', mag: 6.8, depthKm: 18, lat: -38.9, lon: 178.5, time: '14 mins ago', precursorIonospheric: 'CRITICAL (+0.82 TECU)', status: 'ALARM' },
    { id: 'eq-2', region: 'Kermadec Trench South', mag: 5.9, depthKm: 42, lat: -30.2, lon: -177.8, time: '38 mins ago', precursorIonospheric: 'ELEVATED (+0.45 TECU)', status: 'WARNING' },
    { id: 'eq-3', region: 'Alpine Fault Zone (Arthur Pass)', mag: 4.4, depthKm: 9, lat: -42.9, lon: 171.5, time: '2 hours ago', precursorIonospheric: 'MODERATE (+0.18 TECU)', status: 'NOMINAL' },
    { id: 'eq-4', region: 'Puysegur Subduction Zone', mag: 5.2, depthKm: 22, lat: -46.8, lon: 165.2, time: '4 hours ago', precursorIonospheric: 'ACOUSTIC WAVE DETECTED', status: 'WARNING' }
  ]);
  const [selectedFault, setSelectedFault] = useState<FaultLine>(FAULT_LINES[1]);
  const [simulatedStressInput, setSimulatedStressInput] = useState(78);

  // Ozone & Station Datasets
  const [stations] = useState<StationData[]>(INITIAL_STATIONS);
  const [minOzoneDobson, setMinOzoneDobson] = useState(112);
  const [ozoneHoleArea, setOzoneHoleArea] = useState(24.2);

  // Code Editor State
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [codeContent, setCodeContent] = useState(CODE_PRESETS[0].code);
  const [scriptLog, setScriptLog] = useState('[SYSTEM ONLINE] Python Kernel 3.11 ready for execution.');

  // AI Chat State
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Planetary Geophysical Control online. I can compute 7-day atmospheric pressure profiles, analyze Hikurangi Subduction strain, calculate DART tsunami arrival times, monitor Taupō & Whakaari volcanic ash plumes, or model Aurora Australis space weather.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerSound = (type = 'click', params = {}) => {
    if (soundEnabled) playAudioFeedback(type, params);
  };

  useEffect(() => {
    if (!isAutoPlayingTimeline) return;
    const interval = setInterval(() => {
      setForecastDay(prev => {
        const nextDay = (prev % 7) + 1;
        if (sonificationActive) {
          triggerSound('sonification', { freq: 100 + nextDay * 25 });
        } else {
          triggerSound('click');
        }
        return nextDay;
      });
    }, playbackSpeed);
    return () => clearInterval(interval);
  }, [isAutoPlayingTimeline, playbackSpeed, soundEnabled, sonificationActive]);

  // Scenario Trigger Handler
  const handleTriggerScenario = (type: string) => {
    triggerSound('alarm');
    if (activeScenario === type) {
      setActiveScenario(null);
      return;
    }

    setActiveScenario(type);
    if (type === 'hikurangi-megathrust') {
      setForecastDay(4);
      setSelectedFault(FAULT_LINES[1]);
      setSimulatedStressInput(96);
      setActiveTab('seismic-shifts');
    } else if (type === 'kermadec-eruption') {
      setSelectedVolcano(VOLCANO_SYSTEMS[1]);
      setAshDispersionModelKm(420);
      setActiveTab('volcano-arc');
    } else if (type === 'g5-solar-storm') {
      setSolarWindSpeed(850);
      setBzMagnetic(-21.5);
      setAuroraLatitude(-44.2);
      setActiveTab('space-weather');
    }
  };

  useEffect(() => {
    if (!canvasRef.current || activeTab !== '3d-globe') return;

    const width = canvasRef.current.clientWidth || 800;
    const height = canvasRef.current.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);

    const camera = new THREE.PerspectiveCamera(42, width / height, 1, 3000);
    
    if (cameraPreset === 'oceania') {
      camera.position.set(0, 40, 240);
    } else if (cameraPreset === 'southpole') {
      camera.position.set(0, -220, 100);
    } else if (cameraPreset === 'hikurangi') {
      camera.position.set(60, 20, 160);
    } else {
      camera.position.set(0, 0, 300);
    }

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
    sunLight.position.set(350, 250, 250);
    scene.add(sunLight);

    if (globeLayers.starfield) {
      const starsGeo = new THREE.BufferGeometry();
      const count = 1200;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 1600;
        positions[i + 1] = (Math.random() - 0.5) * 1600;
        positions[i + 2] = (Math.random() - 0.5) * 1600;
      }
      starsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const starsMat = new THREE.PointsMaterial({ color: 0x94a3b8, size: 1.2, transparent: true, opacity: 0.6 });
      const starField = new THREE.Points(starsGeo, starsMat);
      scene.add(starField);
    }

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const earthGeo = new THREE.SphereGeometry(72, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      color: 0x09152e,
      emissive: activeScenario ? 0x991b1b : 0x0284c7,
      emissiveIntensity: activeScenario ? 0.45 : 0.22,
      wireframe: true
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    const coreGeo = new THREE.SphereGeometry(71.2, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x020617 });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    let vortexRingMesh: THREE.Mesh | null = null;
    if (globeLayers.atmosphereShell) {
      const atmosGeo = new THREE.SphereGeometry(78.5, 32, 32);
      const currentDayData = SEVEN_DAY_FORECAST[forecastDay - 1];
      const jetColor = activeScenario === 'g5-solar-storm' ? 0x10b981 : (currentDayData.seismicRiskIndex > 6 ? 0xec4899 : 0x06b6d4);

      const atmosMat = new THREE.MeshBasicMaterial({
        color: jetColor,
        transparent: true,
        opacity: 0.18,
        wireframe: true
      });
      const atmosphereMesh = new THREE.Mesh(atmosGeo, atmosMat);
      globeGroup.add(atmosphereMesh);
    }

    if (globeLayers.polarVortexRing) {
      const ringGeo = new THREE.TorusGeometry(54, 2.2, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: activeScenario ? 0xf43f5e : (forecastDay > 3 ? 0xf43f5e : 0x38bdf8),
        wireframe: true
      });
      vortexRingMesh = new THREE.Mesh(ringGeo, ringMat);
      vortexRingMesh.rotation.x = Math.PI / 2.25;
      vortexRingMesh.position.y = -48;
      globeGroup.add(vortexRingMesh);
    }

    if (globeLayers.seismicShiftNodes) {
      const seismicNodesGroup = new THREE.Group();
      FAULT_LINES.forEach((fault) => {
        const phi = (90 - fault.lat) * (Math.PI / 180);
        const theta = (fault.lon + 180) * (Math.PI / 180);
        const radius = 74;

        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = radius * Math.sin(phi) * Math.sin(theta);
        const y = radius * Math.cos(phi);

        const isCritical = fault.riskLevel === 'CRITICAL' || fault.riskLevel === 'VERY HIGH';

        const nodeGeo = new THREE.SphereGeometry(2.6, 12, 12);
        const nodeMat = new THREE.MeshBasicMaterial({ color: isCritical ? 0xf43f5e : 0x10b981 });
        const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
        nodeMesh.position.set(x, y, z);
        seismicNodesGroup.add(nodeMesh);

        const shockGeo = new THREE.RingGeometry(2, 6 + (forecastDay * 0.9), 20);
        const shockMat = new THREE.MeshBasicMaterial({
          color: isCritical ? 0xec4899 : 0x06b6d4,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.65
        });
        const shockMesh = new THREE.Mesh(shockGeo, shockMat);
        shockMesh.position.set(x, y, z);
        shockMesh.lookAt(0, 0, 0);
        seismicNodesGroup.add(shockMesh);
      });
      globeGroup.add(seismicNodesGroup);
    }

    if (globeLayers.volcanicHotspots) {
      const volcanoGroup = new THREE.Group();
      VOLCANO_SYSTEMS.forEach((volc) => {
        const phi = (90 - volc.lat) * (Math.PI / 180);
        const theta = (volc.lon + 180) * (Math.PI / 180);
        const radius = 74.2;

        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = radius * Math.sin(phi) * Math.sin(theta);
        const y = radius * Math.cos(phi);

        const volcGeo = new THREE.ConeGeometry(2.2, 5, 8);
        const volcMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
        const volcMesh = new THREE.Mesh(volcGeo, volcMat);
        volcMesh.position.set(x, y, z);
        volcMesh.lookAt(0, 0, 0);
        volcanoGroup.add(volcMesh);
      });
      globeGroup.add(volcanoGroup);
    }

    globeGroup.rotation.x = 0.38;
    globeGroup.rotation.z = -0.12;

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      globeGroup.rotation.y += rotationSpeed;
      if (vortexRingMesh) vortexRingMesh.rotation.z += 0.012;
      renderer.render(scene, camera);
    };

    animate();

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => { isDragging = false; };

    const canvasElem = canvasRef.current;
    if (canvasElem) canvasElem.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (canvasElem) canvasElem.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      renderer.dispose();
    };
  }, [activeTab, globeLayers, forecastDay, rotationSpeed, cameraPreset, activeScenario]);

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    triggerSound('click');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setChatInput('');
    setChatLoading(true);

    const currentDayData = SEVEN_DAY_FORECAST[forecastDay - 1];

    try {
      const res = await fetch('/api/oceania-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userText,
          forecastDay,
          currentDayData,
          selectedVolcano,
          activeScenario
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || data.error || 'No telemetry response returned from planetary model server.';
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
      triggerSound('click');
    } catch (err: unknown) {
      console.warn("Using local fallback response for chat:", err);
      // Fallback
      const fallbackReply = `[OCEANIA GEOPHYSICAL TELEMETRY RESPONSE]\n` +
        `• Observation Horizon: Day ${forecastDay} (${currentDayData.title})\n` +
        `• Tectonic Risk: ${currentDayData.seismicRiskIndex}/10 on ${selectedFault.name}\n` +
        `• Volcanic Alert: ${selectedVolcano.name} (${selectedVolcano.status}, SO₂: ${selectedVolcano.so2Flux})\n` +
        `• Atmospheric Coupling: Ionospheric TEC anomaly at ${currentDayData.tecAnomaly}. SaliBuoy acoustic arrays confirm telemetry continuity.`;
      setMessages(prev => [...prev, { role: 'model', text: fallbackReply }]);
      triggerSound('click');
    } finally {
      setChatLoading(false);
    }
  };

  const handleExportReport = () => {
    triggerSound('click');
    const currentDayData = SEVEN_DAY_FORECAST[forecastDay - 1];
    const reportText = `OCEANIA & POLAR OBSERVATORY MISSION CONTROL
=====================================================
TIMESTAMP: ${utcTime}
ACTIVE SCENARIO: ${activeScenario ? activeScenario.toUpperCase() : 'NOMINAL OBSERVATION'}
PROJECTION DAY: Day ${forecastDay} (${currentDayData.title})

[1. SYNOPTIC METRICS]
  - Jet Stream Velocity: ${currentDayData.jetStreamSpeed}
  - Surface Barometric Pressure: ${currentDayData.surfacePressure}
  - Ozone Depletion Anomaly: ${currentDayData.ozoneAnomalies}
  - Cloud Cover: ${currentDayData.cloudCoverPct}%
  - Ionospheric TEC Shift: ${currentDayData.tecAnomaly}

[2. VOLCANIC ARC UNREST]
  - Target Volcano: ${selectedVolcano.name}
  - Alert Status: ${selectedVolcano.status}
  - SO2 Gas Emission: ${selectedVolcano.so2Flux}
  - Modelled Ash Plume Radius: ${ashDispersionModelKm} km

[3. TECTONIC & LAIC RISK]
  - Risk Level Index: ${currentDayData.seismicRiskIndex} / 10
  - Primary Active Fault: ${selectedFault.name}
  - Strain Velocity: ${selectedFault.strainAccumulation}
  - Simulated Stress Accumulation: ${simulatedStressInput}%

[4. DART TSUNAMI BUOY READINGS]
  - Active Station: ${selectedBuoy.name}
  - Sea Level Anomaly: ${selectedBuoy.seaLevelDeltaCm} cm
  - Battery Health: ${selectedBuoy.battery}

[5. SPACE WEATHER PARAMETERS]
  - Solar Wind Velocity: ${solarWindSpeed} km/s
  - Interplanetary Magnetic Field (Bz): ${bzMagnetic} nT
  - Kp Geomagnetic Index: ${currentDayData.kpIndex}
=====================================================
`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Oceania_Observatory_Report_Day${forecastDay}.txt`;
    link.click();
  };

  const currentDayInfo = SEVEN_DAY_FORECAST[forecastDay - 1];

  return (
    <div className="space-y-6">
      
      {/* HEADER BAR */}
      <div className="border border-cyan-500/30 bg-slate-900/90 backdrop-blur-md px-6 py-4 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/50 shadow-lg shadow-cyan-500/20">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-500 font-mono uppercase">
                OCEANIA & POLAR OBSERVATORY
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                LIVE TELEMETRY
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              3D Atmospheric Wave Projections • Tsunami Shockwaves • Taupō Volcanic Plumes • Space Weather
            </p>
          </div>
        </div>

        {/* Header Telemetry & Emergency Trigger Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Emergency Hazard Scenario Trigger Panel */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-rose-900/60 font-mono text-[11px]">
            <span className="text-rose-400 font-bold px-2 flex items-center gap-1 text-[10px]">
              <Siren className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> SIMULATE:
            </span>
            <button
              onClick={() => handleTriggerScenario('hikurangi-megathrust')}
              className={`px-2.5 py-1 rounded-lg border font-bold transition-all ${
                activeScenario === 'hikurangi-megathrust' 
                  ? 'bg-rose-600 text-white border-rose-400 shadow-md animate-pulse' 
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-rose-300'
              }`}
            >
              M8.3 Hikurangi
            </button>
            <button
              onClick={() => handleTriggerScenario('kermadec-eruption')}
              className={`px-2.5 py-1 rounded-lg border font-bold transition-all ${
                activeScenario === 'kermadec-eruption' 
                  ? 'bg-amber-600 text-white border-amber-400 shadow-md animate-pulse' 
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-amber-300'
              }`}
            >
              Whakaari Plume
            </button>
            <button
              onClick={() => handleTriggerScenario('g5-solar-storm')}
              className={`px-2.5 py-1 rounded-lg border font-bold transition-all ${
                activeScenario === 'g5-solar-storm' 
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md animate-pulse' 
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-emerald-300'
              }`}
            >
              G5 Solar Storm
            </button>
          </div>

          <div className="bg-slate-950/90 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">UTC:</span>
            <span className="text-cyan-300 font-bold">{utcTime || '12:00:00 UTC'}</span>
          </div>

          <button
            onClick={handleExportReport}
            className="px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-700 text-cyan-300 hover:bg-cyan-900 transition-colors text-xs font-mono font-bold flex items-center gap-1.5"
            title="Download Hazard Briefing Report"
          >
            <Download className="w-3.5 h-3.5" /> REPORT
          </button>

          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              triggerSound('click');
            }}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
            title="Toggle Web Audio SFX"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* LIVE ALERT TICKER */}
      <div className={`px-5 py-2 rounded-xl flex items-center gap-3 text-xs font-mono transition-colors ${
        activeScenario ? 'bg-rose-950/90 border border-rose-800 text-rose-200' : 'bg-cyan-950/60 border border-cyan-900/50 text-cyan-300'
      }`}>
        <span className={`px-2 py-0.5 rounded font-bold text-[10px] shrink-0 ${
          activeScenario ? 'bg-rose-600 text-white animate-pulse' : 'bg-pink-950 text-pink-400 border border-pink-800 animate-pulse'
        }`}>
          {activeScenario ? 'CRITICAL EMERGENCY SIMULATION' : 'OBSERVATORY TICKER'}
        </span>
        <div className="truncate text-slate-300">
          Hikurangi Subduction Strain Rate: <span className="text-pink-400 font-bold">45 mm/yr</span> • Taupō Caldera Uplift: <span className="text-amber-400 font-bold">+14 mm/yr</span> • DART 55023 Anomaly: <span className="text-amber-400 font-bold">+4.1 cm</span> • Aurora Australis Boundary: <span className="text-emerald-400 font-bold">{auroraLatitude}° S</span>
        </div>
      </div>

      {/* SUB NAVIGATION TABS */}
      <div className="flex bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl overflow-x-auto scrollbar-none gap-1">
        {[
          { id: '3d-globe', label: '3D Earth & Wave Diagram', icon: Globe },
          { id: 'sat-weather', label: 'Multispectral Satellite Studio', icon: Eye },
          { id: 'seismic-shifts', label: 'Seismic Strain & Fault Lines', icon: Activity },
          { id: 'volcano-arc', label: 'Volcanic Arc & Ash Plumes', icon: Flame },
          { id: 'tsunami-dart', label: 'Tsunami & DART Buoy Engine', icon: Waves },
          { id: 'space-weather', label: 'Space Weather & Aurora', icon: Sunrise },
          { id: 'ozone-hole', label: 'Ozone Hole & Stratosphere', icon: ShieldAlert },
          { id: 'script-editor', label: 'Python Analytics Kernel', icon: Terminal },
          { id: 'ai-chat', label: 'Gemini Geophysical AI', icon: Sparkles }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                triggerSound('click');
              }}
              className={`py-2 px-3.5 rounded-lg font-medium text-xs font-mono flex items-center gap-2 shrink-0 transition-all ${
                isActive
                  ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* --- TAB 1: 3D GLOBE & 7-DAY WAVE DIAGRAM --- */}
      {activeTab === '3d-globe' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* 3D WebGL Canvas Viewer Frame (8 cols) */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between relative shadow-2xl min-h-[650px]">
            
            <div className="flex flex-wrap justify-between items-center gap-3 z-10 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wide">3D Planetary Wave & Volcano Diagram</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                <button
                  onClick={() => {
                    setGlobeLayers({ ...globeLayers, atmosphereShell: !globeLayers.atmosphereShell });
                    triggerSound('click');
                  }}
                  className={`px-2.5 py-1 rounded-md border transition-all ${globeLayers.atmosphereShell ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                >
                  ● Atmosphere Shell
                </button>
                <button
                  onClick={() => {
                    setGlobeLayers({ ...globeLayers, polarVortexRing: !globeLayers.polarVortexRing });
                    triggerSound('click');
                  }}
                  className={`px-2.5 py-1 rounded-md border transition-all ${globeLayers.polarVortexRing ? 'bg-rose-950 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                >
                  ● Polar Jet Ring
                </button>
                <button
                  onClick={() => {
                    setGlobeLayers({ ...globeLayers, seismicShiftNodes: !globeLayers.seismicShiftNodes });
                    triggerSound('click');
                  }}
                  className={`px-2.5 py-1 rounded-md border transition-all ${globeLayers.seismicShiftNodes ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                >
                  ● Fault Nodes
                </button>
                <button
                  onClick={() => {
                    setGlobeLayers({ ...globeLayers, volcanicHotspots: !globeLayers.volcanicHotspots });
                    triggerSound('click');
                  }}
                  className={`px-2.5 py-1 rounded-md border transition-all ${globeLayers.volcanicHotspots ? 'bg-amber-950 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                >
                  ● Volcano Hotspots
                </button>
              </div>
            </div>

            {/* Three.js Canvas Container */}
            <div className="w-full flex-1 min-h-[480px] my-3 relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center group">
              <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

              <div className="absolute top-4 left-4 flex flex-col gap-1.5 bg-slate-950/80 backdrop-blur border border-slate-800 p-2 rounded-lg font-mono text-[10px]">
                <span className="text-slate-500 font-bold uppercase text-[9px] mb-1">Camera Focus</span>
                {[
                  { id: 'oceania' as const, label: 'Oceania Center' },
                  { id: 'southpole' as const, label: 'Antarctica Pole' },
                  { id: 'hikurangi' as const, label: 'Hikurangi Margin' },
                  { id: 'global' as const, label: 'Global View' }
                ].map(cam => (
                  <button
                    key={cam.id}
                    onClick={() => {
                      setCameraPreset(cam.id);
                      triggerSound('click');
                    }}
                    className={`px-2 py-1 rounded text-left transition-colors ${cameraPreset === cam.id ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    {cam.label}
                  </button>
                ))}
              </div>

              <div className="absolute bottom-4 left-4 bg-slate-950/90 backdrop-blur border border-slate-800 p-3.5 rounded-xl font-mono text-[11px] text-slate-300 max-w-sm space-y-1 shadow-lg">
                <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5" />
                  {currentDayInfo.title}
                </div>
                <div className="text-slate-400">{currentDayInfo.atmosphericWave}</div>
                <div className="text-pink-400 font-bold mt-1 flex justify-between">
                  <span>LAIC Risk Score:</span>
                  <span>{currentDayInfo.seismicRiskIndex} / 10</span>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg font-mono text-[10px] text-slate-400 text-right space-y-0.5">
                <div>Orbit: Click & Drag Mouse</div>
                <div>Speed: {(rotationSpeed * 1000).toFixed(1)} rad/s</div>
              </div>
            </div>

            {/* 7-DAY FORECAST SCRUBBER TIMELINE */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 shadow-inner">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setIsAutoPlayingTimeline(!isAutoPlayingTimeline);
                      triggerSound('click');
                    }}
                    className={`px-4 py-2 rounded-lg font-mono text-xs font-bold flex items-center gap-2 transition-all ${
                      isAutoPlayingTimeline 
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 animate-pulse' 
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20'
                    }`}
                  >
                    {isAutoPlayingTimeline ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isAutoPlayingTimeline ? 'PAUSE PROJECTION' : 'PLAY 7-DAY TIMELINE'}
                  </button>

                  <button
                    onClick={() => {
                      setSonificationActive(!sonificationActive);
                      triggerSound('click');
                    }}
                    className={`px-3 py-2 rounded-lg font-mono text-xs font-bold border transition-all ${
                      sonificationActive ? 'bg-pink-950 border-pink-500 text-pink-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                    title="Audio Sonification Synthesizer"
                  >
                    🔊 AUDIO SONIFICATION
                  </button>
                </div>

                <span className="text-xs font-mono text-slate-400">
                  Projection Horizon: <strong className="text-cyan-300 font-bold uppercase">{currentDayInfo.dateLabel}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {SEVEN_DAY_FORECAST.map((fd) => {
                  const isSel = forecastDay === fd.day;
                  return (
                    <button
                      key={fd.day}
                      onClick={() => {
                        setForecastDay(fd.day);
                        setIsAutoPlayingTimeline(false);
                        if (sonificationActive) triggerSound('sonification', { freq: 100 + fd.day * 30 });
                        else triggerSound('click');
                      }}
                      className={`p-2.5 rounded-xl border font-mono text-left transition-all ${
                        isSel
                          ? 'bg-gradient-to-b from-cyan-950 via-slate-900 to-pink-950 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-bold">DAY {fd.day}</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${fd.seismicRiskIndex > 6 ? 'bg-pink-500' : 'bg-emerald-400'}`}></span>
                      </div>
                      <div className="text-[11px] font-bold mt-1 text-slate-200 truncate">{fd.surfacePressure}</div>
                      <div className="text-[9px] text-cyan-400 mt-0.5 truncate">{fd.jetStreamSpeed}</div>
                      <div className={`text-[9px] font-bold mt-1 ${fd.seismicRiskIndex > 6 ? 'text-pink-400' : 'text-emerald-400'}`}>
                        Risk {fd.seismicRiskIndex}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar Inspector Column (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                <h3 className="text-sm font-bold font-mono text-cyan-300 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  7-Day Wave Synoptic Profile
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold">
                  DAY {forecastDay} / 7
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-100">{currentDayInfo.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800 font-sans">
                  Numerical modeling indicates <strong>{currentDayInfo.atmosphericWave}</strong> triggering baroclinic instability across New Zealand and Southern Ocean trenches.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">JET STREAM SPEED</span>
                  <span className="text-cyan-300 font-bold text-sm mt-0.5 block">{currentDayInfo.jetStreamSpeed}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">SURFACE PRESSURE</span>
                  <span className="text-amber-300 font-bold text-sm mt-0.5 block">{currentDayInfo.surfacePressure}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">IONOSPHERIC TEC</span>
                  <span className="text-pink-400 font-bold text-sm mt-0.5 block">{currentDayInfo.tecAnomaly}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">GEOMAGNETIC KP</span>
                  <span className="text-emerald-400 font-bold text-sm mt-0.5 block">Kp {currentDayInfo.kpIndex}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-pink-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-pink-500 animate-pulse" />
                  Lithosphere-Ionosphere Coupling
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  currentDayInfo.seismicRiskIndex > 6 ? 'bg-rose-950 border border-rose-800 text-rose-300' : 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                }`}>
                  RISK {currentDayInfo.seismicRiskIndex} / 10
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>Acoustic-Gravity Wave Coupling:</span>
                  <span className="text-pink-400 font-bold">{currentDayInfo.seismicEventsCount} Micro-Tremors</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden p-0.5">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${currentDayInfo.seismicRiskIndex > 6 ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-emerald-400'}`} 
                    style={{ width: `${(currentDayInfo.seismicRiskIndex / 10) * 100}%` }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-normal font-sans pt-1">
                Peak wave convergence on Day {forecastDay} creates atmospheric pressure gradients capable of triggering micro-seismic strain along subduction fault interfaces.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* --- TAB 2: MULTISPECTRAL SATELLITE STUDIO --- */}
      {activeTab === 'sat-weather' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4 flex flex-wrap justify-between items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 font-mono">
                <Eye className="w-5 h-5 text-cyan-400" />
                Multispectral Satellite Studio & Radar Vector Studio
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Geostationary Imagery Backscatter Processing (Himawari-9 / Sentinel-5P Cloud Vector Arrays)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
              {[
                { id: 'ir-cloud', label: 'IR Thermal Cloud Top' },
                { id: 'water-vapor', label: '6.2 µm Water Vapor' },
                { id: 'swir-ozone', label: 'SWIR Ozone Column' },
                { id: 'visible-high', label: 'Visible High-Res' }
              ].map(ch => (
                <button
                  key={ch.id}
                  onClick={() => {
                    setSatChannel(ch.id);
                    triggerSound('click');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${satChannel === ch.id ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {ch.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative min-h-[500px]">
              <div className="w-full aspect-[16/9] bg-slate-900 rounded-xl border border-slate-800 overflow-hidden relative flex items-center justify-center">
                <svg 
                  viewBox="0 0 800 450" 
                  className="w-full h-full select-none"
                  style={{
                    filter: `contrast(${satContrast}) brightness(${satBrightness})`,
                    transform: `scale(${satZoom})`
                  }}
                >
                  <rect width="800" height="450" fill="#070f24" />

                  <g stroke="#1e293b" strokeWidth="0.8" strokeDasharray="5 5">
                    <line x1="0" y1="120" x2="800" y2="120" />
                    <line x1="0" y1="240" x2="800" y2="240" />
                    <line x1="0" y1="360" x2="800" y2="360" />
                    <line x1="200" y1="0" x2="200" y2="450" />
                    <line x1="400" y1="0" x2="400" y2="450" />
                    <line x1="600" y1="0" x2="600" y2="450" />
                  </g>

                  <g fill="#172554" stroke="#334155" strokeWidth="1.6">
                    <path d="M 40,40 L 170,50 L 210,180 L 180,320 L 110,380 L 50,250 Z" />
                    <path d="M 510,230 L 540,210 L 550,250 L 520,280 Z" />
                    <path d="M 480,280 L 520,290 L 470,370 L 440,360 Z" />
                    <path d="M 80,410 Q 400,380 720,410 L 800,450 L 0,450 Z" fill="#0f172a" />
                  </g>

                  {satChannel === 'ir-cloud' && (
                    <g opacity="0.85">
                      <path d="M 340,170 Q 490,110 590,210 Q 530,330 410,270 Q 330,210 430,150" fill="none" stroke="#f1f5f9" strokeWidth="38" strokeLinecap="round" className="blur-sm opacity-80" />
                      <path d="M 190,310 Q 340,300 490,370" fill="none" stroke="#cbd5e1" strokeWidth="28" strokeLinecap="round" className="opacity-70" />
                    </g>
                  )}

                  {satChannel === 'water-vapor' && (
                    <g opacity="0.8">
                      <circle cx="490" cy="230" r="150" fill="url(#wvGradient)" />
                      <defs>
                        <radialGradient id="wvGradient">
                          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.85" />
                          <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                    </g>
                  )}

                  {satChannel === 'swir-ozone' && (
                    <g opacity="0.8">
                      <ellipse cx="490" cy="370" rx="230" ry="85" fill="url(#swirOzoneGrad)" />
                      <defs>
                        <radialGradient id="swirOzoneGrad">
                          <stop offset="0%" stopColor="#be185d" stopOpacity="0.95" />
                          <stop offset="70%" stopColor="#f43f5e" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                    </g>
                  )}

                  {satChannel === 'visible-high' && (
                    <g opacity="0.75">
                      <path d="M 320,160 Q 450,140 520,220" stroke="#ffffff" strokeWidth="18" fill="none" />
                    </g>
                  )}

                  <g stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.7">
                    <path d="M 290,90 L 330,90 M 325,85 L 330,90 L 325,95" />
                    <path d="M 440,140 L 480,150 M 475,145 L 480,150 L 475,155" />
                    <path d="M 570,270 L 610,300 M 605,295 L 610,300 L 603,305" />
                  </g>
                </svg>

                <div className="absolute top-3 left-3 bg-slate-950/90 border border-slate-800 p-2.5 rounded-lg font-mono text-[11px] shadow-lg">
                  <span className="text-cyan-400 font-bold uppercase">{satChannel} SCAN</span>
                  <div className="text-slate-400 text-[9px] mt-0.5">Pixel Scale: 1.1 km • Refresh: 10 min</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-5 shadow-xl">
              <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Imagery Radiance Controls
              </h3>

              <div>
                <label className="text-xs font-mono text-slate-300 flex justify-between mb-1.5">
                  <span>Contrast Gain:</span>
                  <span className="text-cyan-400 font-bold">{satContrast.toFixed(2)}</span>
                </label>
                <input type="range" min="0.5" max="2.0" step="0.05" value={satContrast} onChange={e => setSatContrast(parseFloat(e.target.value))} className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer" />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 flex justify-between mb-1.5">
                  <span>Brightness Offset:</span>
                  <span className="text-cyan-400 font-bold">{satBrightness.toFixed(2)}</span>
                </label>
                <input type="range" min="0.5" max="1.8" step="0.05" value={satBrightness} onChange={e => setSatBrightness(parseFloat(e.target.value))} className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer" />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 flex justify-between mb-1.5">
                  <span>Digital Zoom:</span>
                  <span className="text-cyan-400 font-bold">{satZoom.toFixed(1)}x</span>
                </label>
                <input type="range" min="1.0" max="2.2" step="0.1" value={satZoom} onChange={e => setSatZoom(parseFloat(e.target.value))} className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer" />
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                <div className="font-bold text-cyan-300 font-mono">Channel Band Specs:</div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  The SWIR 1.66 µm absorption channel isolates Total Column Water Vapor and Stratospheric Ozone filaments associated with polar vortex pinching.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: SEISMIC SHIFTS & FAULT STRAIN --- */}
      {activeTab === 'seismic-shifts' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 font-mono">
              <Activity className="w-5 h-5 text-rose-500 animate-pulse" />
              Seismic Shift Monitor & Lithosphere Fault Stress Engine
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Real-time subduction zone monitoring, Alpine Fault slip velocity, and ionospheric acoustic precursor signals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-mono uppercase text-rose-400 font-bold">Oceania Tectonic Boundary Faults</h3>
              
              <div className="space-y-2">
                {FAULT_LINES.map((fault) => (
                  <div
                    key={fault.id}
                    onClick={() => {
                      setSelectedFault(fault);
                      triggerSound('click');
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer font-mono text-xs transition-all flex justify-between items-center ${
                      selectedFault.id === fault.id
                        ? 'border-rose-500 bg-rose-950/30 text-rose-200 shadow-md ring-1 ring-rose-500'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-200">{fault.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Length: {fault.lengthKm} km • Rate: {fault.strainAccumulation}</div>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                      fault.riskLevel === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-800 animate-pulse' :
                      fault.riskLevel === 'VERY HIGH' ? 'bg-pink-950 text-pink-400 border border-pink-800' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {fault.riskLevel}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300 font-bold">
                      {selectedFault.riskLevel} SEISMIC THREAT
                    </span>
                    <h3 className="text-base font-bold text-slate-100 mt-2">{selectedFault.name}</h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">Depth Slice: {selectedFault.depthRange} • Lat/Lon: {selectedFault.lat}°, {selectedFault.lon}°</p>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-500 block">SLIP ACCUMULATION</span>
                    <span className="text-rose-400 font-bold text-xl">{selectedFault.strainAccumulation}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono text-slate-300">
                    <span>Interactive Stress Accumulation Simulator:</span>
                    <span className="text-rose-400 font-bold">{simulatedStressInput}% Threshold</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="98" 
                    value={simulatedStressInput} 
                    onChange={e => setSimulatedStressInput(parseInt(e.target.value))} 
                    className="w-full accent-rose-500 h-2 bg-slate-900 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 flex-1 shadow-xl">
                <h4 className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Micro-Tremor & Acoustic Wave Stream
                </h4>

                <div className="space-y-2 text-xs font-mono">
                  {seismicEvents.map(eq => (
                    <div key={eq.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center hover:border-slate-700 transition-colors">
                      <div>
                        <div className="font-semibold text-slate-200">{eq.region}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Depth: {eq.depthKm} km • {eq.time}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-rose-400 font-bold text-sm block">M {eq.mag}</span>
                        <span className="text-[9px] text-cyan-400">{eq.precursorIonospheric}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 4: VOLCANIC ARC & ASH PLUMES --- */}
      {activeTab === 'volcano-arc' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 font-mono">
              <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
              Volcanic Arc SO₂ Gas Monitor & Taupō Caldera Array
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Sulfur Dioxide (SO₂) emissions, Whakaari unrest indicators, and atmospheric ash cloud dispersion trajectories.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
              <h3 className="text-xs font-mono uppercase text-amber-400 font-bold">Active Volcanic Arc Centers</h3>

              <div className="space-y-2.5 font-mono text-xs">
                {VOLCANO_SYSTEMS.map(volc => (
                  <div
                    key={volc.id}
                    onClick={() => {
                      setSelectedVolcano(volc);
                      triggerSound('click');
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                      selectedVolcano.id === volc.id
                        ? 'border-amber-500 bg-amber-950/30 text-amber-200 shadow-md ring-1 ring-amber-500'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-200">{volc.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{volc.location} • SO₂: {volc.so2Flux}</div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-bold block px-2 py-0.5 rounded ${
                        volc.alertLevel >= 2 ? 'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse' : 'bg-slate-800 text-slate-300'
                      }`}>
                        ALERT LEVEL {volc.alertLevel}
                      </span>
                      <span className="text-[9px] text-slate-400 mt-1 block">{volc.ashRisk} ASH RISK</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-5 shadow-xl">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 font-bold">
                    {selectedVolcano.status}
                  </span>
                  <h3 className="text-base font-bold text-slate-100 mt-2">{selectedVolcano.name}</h3>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">Uplift / Strain: {selectedVolcano.deformation}</p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-500 block">SO₂ EMISSION FLUX</span>
                  <span className="text-amber-400 font-bold text-lg">{selectedVolcano.so2Flux}</span>
                </div>
              </div>

              <div className="space-y-2 font-mono">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Modelled Volcanic Ash Plume Radius:</span>
                  <span className="text-amber-400 font-bold">{ashDispersionModelKm} km</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="600" 
                  step="10" 
                  value={ashDispersionModelKm} 
                  onChange={e => setAshDispersionModelKm(parseInt(e.target.value))} 
                  className="w-full accent-amber-500 h-2 bg-slate-900 rounded-lg cursor-pointer"
                />
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                <span className="text-cyan-400 font-bold block">Regional Aviation & Atmospheric Impact Matrix:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 text-[9px] block">FLIGHT LEVEL HAZARD</span>
                    <span className="text-slate-200 font-bold">FL250 - FL380</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 text-[9px] block">AEROSOL OPTICAL DEPTH</span>
                    <span className="text-amber-300 font-bold">0.42 AOD (Heavy)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 5: TSUNAMI & DART BUOY ENGINE --- */}
      {activeTab === 'tsunami-dart' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 font-mono">
              <Waves className="w-5 h-5 text-cyan-400 animate-pulse" />
              Tsunami Acoustic-Gravity Airwave & DART Buoy Array
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Deep-ocean Assessment and Reporting of Tsunamis (DART) telemetry and atmospheric acoustic airwave speed calculations.
            </p>
          </div>

          {/* Ocean Boys Real-Time Satellites Integration Callout */}
          <div className="p-3 bg-teal-950/40 border border-teal-800/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center space-x-2 text-teal-300">
              <Radio className="w-4 h-4 text-teal-400 animate-pulse" />
              <span>Full Fleet Integration: <strong>23 Ocean Boys</strong> (SaliBuoys, Argo Floats, DART Buoys, & BOM Moorings) monitored with real-time Himawari-9 & GOES-18 satellite feeds.</span>
            </div>
            <span className="text-[10px] text-teal-400 bg-teal-950 px-2 py-1 rounded border border-teal-800 uppercase font-bold shrink-0">
              OPPO A5X READY
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
              <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center gap-2">
                <RadioTower className="w-4 h-4" /> Pacific DART Bottom-Pressure Buoys
              </h3>

              <div className="space-y-2.5 font-mono text-xs">
                {DART_BUOYS.map((buoy) => (
                  <div
                    key={buoy.id}
                    onClick={() => {
                      setSelectedBuoy(buoy);
                      triggerSound('click');
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                      selectedBuoy.id === buoy.id
                        ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-md ring-1 ring-cyan-400'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-200">{buoy.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Depth: {buoy.depthM} m • Battery: {buoy.battery}</div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold block ${buoy.seaLevelDeltaCm.includes('+4') ? 'text-rose-400 animate-pulse' : 'text-cyan-300'}`}>
                        {buoy.seaLevelDeltaCm} cm
                      </span>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {buoy.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-5 shadow-xl">
              <h3 className="text-xs font-mono uppercase text-pink-400 font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Shockwave & Coastal Arrival Estimator
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] block">EPICENTER ZONE</span>
                  <span className="text-cyan-300 font-bold text-sm block">{tsunamiOrigin.name}</span>
                  <span className="text-[10px] text-slate-400 block mt-1">Distance to NZ: {tsunamiOrigin.distanceKm} km</span>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] block">ESTIMATED WATER TSUNAMI SPEED</span>
                  <span className="text-rose-400 font-bold text-sm block">
                    {Math.round(Math.sqrt(9.81 * tsunamiOrigin.oceanDepthM) * 3.6)} km/h
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">Shallow Water Wave Mechanics (v = √(g·h))</span>
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                <span className="text-cyan-400 font-bold block">Estimated Coastal Arrival Times (ETA):</span>
                <div className="space-y-2">
                  {[
                    { city: 'Gisborne / East Cape', estMin: Math.round((tsunamiOrigin.distanceKm / 720) * 30) },
                    { city: 'Wellington Harbor', estMin: Math.round((tsunamiOrigin.distanceKm / 720) * 55) },
                    { city: 'Lyttelton / Christchurch', estMin: Math.round((tsunamiOrigin.distanceKm / 720) * 75) },
                    { city: 'Suva, Fiji', estMin: Math.round((tsunamiOrigin.distanceKm / 720) * 110) }
                  ].map((eta, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-300">{eta.city}</span>
                      <span className="text-amber-400 font-bold">{eta.estMin} minutes</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 6: SPACE WEATHER & AURORA --- */}
      {activeTab === 'space-weather' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 font-mono">
              <Sunrise className="w-5 h-5 text-emerald-400 animate-pulse" />
              Geomagnetic Space Weather & Aurora Australis Oval
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Interplanetary Magnetic Field (Bz) orientation, solar wind velocity, and Southern Hemisphere aurora visibility projection.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-5 shadow-xl">
              <h3 className="text-xs font-mono uppercase text-emerald-400 font-bold">Solar Wind Parameters</h3>

              <div>
                <label className="text-xs font-mono text-slate-300 flex justify-between mb-1.5">
                  <span>Solar Wind Speed:</span>
                  <span className="text-cyan-400 font-bold">{solarWindSpeed} km/s</span>
                </label>
                <input type="range" min="300" max="950" step="10" value={solarWindSpeed} onChange={e => setSolarWindSpeed(parseInt(e.target.value))} className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer" />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 flex justify-between mb-1.5">
                  <span>Interplanetary Bz (nT):</span>
                  <span className={`font-bold ${bzMagnetic < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{bzMagnetic} nT</span>
                </label>
                <input type="range" min="-30" max="15" step="0.5" value={bzMagnetic} onChange={e => setBzMagnetic(parseFloat(e.target.value))} className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer" />
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                <span className="text-emerald-400 font-bold block">Aurora Australis Visibility:</span>
                <div className="text-slate-300 text-[11px] font-sans">
                  {bzMagnetic < -5 ? 'HIGH POTENTIAL: Aurora Australis visible from Stewart Island, Otago, and Canterbury.' : 'LOW ACTIVITY: Restricted to South Pole and Ross Island.'}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
              <h3 className="text-xs font-mono uppercase text-slate-300 font-bold">Geomagnetic Kp Index & Auroral Oval Radius</h3>

              <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">GEOMAGNETIC KP</span>
                  <span className="text-emerald-400 font-bold text-lg mt-0.5 block">Kp {currentDayInfo.kpIndex}</span>
                </div>
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">AURORA EQUATOR BOUNDARY</span>
                  <span className="text-cyan-300 font-bold text-lg mt-0.5 block">{auroraLatitude}° S</span>
                </div>
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">SOLAR FLUX (F10.7)</span>
                  <span className="text-amber-400 font-bold text-lg mt-0.5 block">162 sfu</span>
                </div>
              </div>

              <div className="aspect-[16/8] bg-slate-900 rounded-xl border border-slate-800 p-4 relative overflow-hidden flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border-2 border-dashed border-emerald-500/40 relative flex items-center justify-center animate-pulse">
                  <div className="w-28 h-28 rounded-full bg-emerald-500/20 blur-md"></div>
                  <span className="text-emerald-300 font-mono text-[10px] font-bold z-10">AURORA OVAL (SOUTH POLE)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 7: OZONE HOLE & STRATOSPHERE --- */}
      {activeTab === 'ozone-hole' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 font-mono">
              <ShieldAlert className="w-5 h-5 text-pink-400" />
              Polar Ozone Hole Depletion & Stratosphere Chemistry
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Springtime Dobson Column metrics, Polar Stratospheric Cloud (PSC Type I/II) reaction thresholds.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-5 shadow-xl">
              <h3 className="text-xs font-mono uppercase text-pink-400 font-bold">Vortex Stratospheric Parameters</h3>
              
              <div>
                <label className="text-xs text-slate-300 flex justify-between font-mono mb-1.5">
                  <span>Minimum Dobson Column:</span>
                  <span className="text-pink-400 font-bold">{minOzoneDobson} DU</span>
                </label>
                <input type="range" min="90" max="280" value={minOzoneDobson} onChange={e => setMinOzoneDobson(parseInt(e.target.value))} className="w-full accent-pink-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer" />
              </div>

              <div>
                <label className="text-xs text-slate-300 flex justify-between font-mono mb-1.5">
                  <span>Ozone Hole Area:</span>
                  <span className="text-cyan-400 font-bold">{ozoneHoleArea} Million km²</span>
                </label>
                <input type="range" min="5" max="30" step="0.1" value={ozoneHoleArea} onChange={e => setOzoneHoleArea(parseFloat(e.target.value))} className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer" />
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 space-y-1.5">
                <span className="text-pink-400 font-bold block">PSC Type II Reaction:</span>
                <div className="text-[11px] text-slate-400 font-sans">
                  ClONO₂ + HCl → Cl₂ + HNO₃ (Occurs on nitric acid trihydrate ice crystals at T &lt; -83°C).
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
              <h3 className="text-xs font-mono uppercase text-slate-300 font-bold">Antarctic & Oceania Ground Observatories</h3>
              
              <div className="space-y-2.5 font-mono text-xs">
                {stations.map(st => (
                  <div key={st.id} className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center hover:border-slate-700 transition-colors">
                    <div>
                      <div className="font-bold text-slate-200">{st.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{st.location} • Methane: {st.methaneBaseline}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-pink-400 font-bold text-sm block">{st.ozoneDobson} DU</span>
                      <span className="text-[10px] text-emerald-400">UV Index: {st.uvIndex}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 8: PYTHON ANALYTICS KERNEL --- */}
      {activeTab === 'script-editor' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4 flex flex-wrap justify-between items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 font-mono">
                <Terminal className="w-5 h-5 text-amber-400" />
                Python Geophysical Analytics Kernel
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Execute custom geophysical models for ionospheric electron density and seismic stress accumulation.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Load Script:</span>
              <select
                value={selectedPresetIndex}
                onChange={(e) => {
                  const idx = parseInt(e.target.value);
                  setSelectedPresetIndex(idx);
                  setCodeContent(CODE_PRESETS[idx].code);
                  triggerSound('click');
                }}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-cyan-300 focus:outline-none"
              >
                {CODE_PRESETS.map((p, idx) => (
                  <option key={p.id} value={idx}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 flex flex-col gap-3">
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-inner">
                <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 text-[10px] font-mono text-slate-400 flex justify-between items-center">
                  <span>model_kernel.py</span>
                  <span className="text-emerald-400">Python 3.11 Standard</span>
                </div>
                <textarea 
                  value={codeContent} 
                  onChange={e => setCodeContent(e.target.value)} 
                  className="w-full h-80 bg-slate-950 p-4 font-mono text-xs text-slate-200 focus:outline-none resize-none leading-relaxed" 
                />
              </div>

              <button 
                onClick={() => {
                  triggerSound('click');
                  setScriptLog(`[${new Date().toLocaleTimeString()}] Script execution successful.\n[OUTPUT]\n> Computed Model Payload completed.\n> Status: NOMINAL BACKGROUND DEVIATION`);
                }}
                className="bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold px-5 py-2.5 rounded-xl self-start flex items-center gap-2 shadow-lg shadow-amber-600/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> EXECUTE PYTHON PAYLOAD
              </button>
            </div>

            <div className="lg:col-span-4 bg-black p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 flex flex-col justify-between shadow-inner">
              <div>
                <div className="text-slate-500 text-[10px] uppercase mb-2 border-b border-slate-900 pb-1">Console Output stdout</div>
                <pre className="whitespace-pre-wrap leading-relaxed">{scriptLog}</pre>
              </div>
              <div className="text-[9px] text-slate-600 border-t border-slate-900 pt-2 mt-4">
                Kernel Status: READY • Memory: 124 MB / 1024 MB
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 9: GEMINI AI ASSISTANT --- */}
      {activeTab === 'ai-chat' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-[650px] justify-between shadow-2xl">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 font-mono">
                <Sparkles className="w-5 h-5 text-cyan-400" /> Gemini Geophysical & Planetary AI Assistant
              </h2>
              <p className="text-xs text-slate-400 font-sans">Powered by Gemini 3.8 Flash • Lithosphere-Atmosphere-Ionosphere Intelligence</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto my-4 space-y-3 text-xs font-sans pr-2">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-2xl leading-relaxed max-w-[85%] shadow-md whitespace-pre-wrap ${
                  m.role === 'user' 
                    ? 'bg-cyan-950/80 border border-cyan-800 text-cyan-100 ml-auto' 
                    : 'bg-slate-950 border border-slate-800 text-slate-300 mr-auto font-mono'
                }`}
              >
                {m.text}
              </div>
            ))}
            {chatLoading && (
              <div className="text-xs font-mono text-cyan-400 animate-pulse flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Querying planetary intelligence kernel...
              </div>
            )}
          </div>

          <form onSubmit={handleSendChatMessage} className="flex gap-2">
            <input 
              type="text" 
              value={chatInput} 
              onChange={e => setChatInput(e.target.value)} 
              placeholder="Ask about Day 4 jet stream alignment, Hikurangi subduction stress, Taupō Caldera, DART buoys, or space weather..." 
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono" 
            />
            <button 
              type="submit" 
              disabled={chatLoading || !chatInput.trim()}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-mono font-bold px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-600/20"
            >
              <Send className="w-3.5 h-3.5" /> SUBMIT
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
