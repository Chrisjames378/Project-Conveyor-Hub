import {
  InteriorSubsystemStatus,
  OceanBoy,
  SuperintendentActionLog,
  SuperintendentState,
  SuperintendentUpgradeRecord
} from '../types';
import { classifyBuoyHealth } from '../utils/fleetHealth';

const STORAGE_KEY = 'salibuoy_superintendent_state_v2';

const MONTHLY_CAPABILITY_CURRICULUM: string[] = [
  'Baseline Threshold Watch & Static Telemetry Bounds',
  'ADCP Current-Shear Brine Timing & Solar MPPT Rebalancing',
  'Ceramic Impeller Micro-Vibration Biofouling Detection',
  'Polar Storm-Surge Rotor Feathering & Electro-Thermal De-Icing',
  'Cross-Buoy Swarm Load Balancing Across Convection Basins',
  'Passive Hydrophone Cetacean Corridor Auto-Quieting (<82 dB)',
  'Self-Calibrating Halocline Density Forecasting (+48h Horizon)',
  'Autonomous Subsea Valve Pulsed Backflush Anti-Scaling',
  'Multi-Constellation Satellite Cloud-Gap Predictive Interpolation',
  'Benthic Dissolved-Oxygen Feedback Guardrail & Eddy Avoidance',
  'Predictive LiFePO4 Cell Impedance Degradation Modeling',
  'Full Autonomous Basin-Scale Thermohaline Neural Dispatch'
];

export interface IntelligenceMetrics {
  generation: number;
  anomalyPrecisionPct: number;
  predictiveLeadHours: number;
  amocEfficiencyGainPct: number;
  falsePositiveRatePct: number;
  batteryLifeExtensionPct: number;
  autonomousRulesCount: number;
  modelTierLabel: string;
}

export function computeIntelligenceMetrics(generation: number): IntelligenceMetrics {
  const g = Math.max(1, generation);
  // Logarithmic/asymptotic real-world learning curve: gets smarter every month!
  const anomalyPrecisionPct = Number((99.6 - 13.6 * Math.exp(-0.26 * (g - 1))).toFixed(1));
  const predictiveLeadHours = Math.round(18 + 158 * (1 - Math.exp(-0.22 * (g - 1))));
  const amocEfficiencyGainPct = Number((22.4 * (1 - Math.exp(-0.21 * (g - 1)))).toFixed(1));
  const falsePositiveRatePct = Number((0.4 + 10.8 * Math.exp(-0.28 * (g - 1))).toFixed(1));
  const batteryLifeExtensionPct = Number((28.0 * (1 - Math.exp(-0.20 * (g - 1)))).toFixed(1));
  const autonomousRulesCount = 14 + (g - 1) * 9;

  const modelTierLabel =
    g >= 10
      ? 'Autonomous Basin Master'
      : g >= 6
        ? 'Predictive Swarm Optimizer'
        : g >= 3
          ? 'Adaptive Fleet Diagnostician'
          : 'Foundational Monitor';

  return {
    generation: g,
    anomalyPrecisionPct,
    predictiveLeadHours,
    amocEfficiencyGainPct,
    falsePositiveRatePct,
    batteryLifeExtensionPct,
    autonomousRulesCount,
    modelTierLabel
  };
}

export function getUnlockedCapabilityForMonth(generation: number): string {
  if (generation <= MONTHLY_CAPABILITY_CURRICULUM.length) {
    return MONTHLY_CAPABILITY_CURRICULUM[generation - 1];
  }
  const extraCycle = generation - MONTHLY_CAPABILITY_CURRICULUM.length;
  return `Recursive Telemetry Self-Optimization Cycle #${extraCycle} (+${(0.4 + extraCycle * 0.1).toFixed(1)}% Basin Yield)`;
}

function getNextMonthStartIso(fromDate: Date): string {
  const next = new Date(Date.UTC(fromDate.getUTCFullYear(), fromDate.getUTCMonth() + 1, 1, 2, 0, 0));
  return next.toISOString();
}

function formatMonthLabel(date: Date, generation: number): string {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[date.getUTCMonth()]} ${date.getUTCFullYear()} • Cycle M${generation}`;
}

export function createInitialSuperintendentState(): SuperintendentState {
  const now = new Date();
  const baseMetrics = computeIntelligenceMetrics(2); // Start at Gen 2 after initial platform upgrade

  const gen1Metrics = computeIntelligenceMetrics(1);
  const lastMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1, 2, 0, 0));

  const upgradeHistory: SuperintendentUpgradeRecord[] = [
    {
      generation: 1,
      monthLabel: formatMonthLabel(lastMonth, 1),
      upgradedAtIso: lastMonth.toISOString(),
      triggerType: 'Baseline Initialization',
      unlockedCapability: getUnlockedCapabilityForMonth(1),
      anomalyPrecisionPct: gen1Metrics.anomalyPrecisionPct,
      predictiveLeadHours: gen1Metrics.predictiveLeadHours,
      amocEfficiencyGainPct: gen1Metrics.amocEfficiencyGainPct,
      falsePositiveRatePct: gen1Metrics.falsePositiveRatePct
    },
    {
      generation: 2,
      monthLabel: formatMonthLabel(now, 2),
      upgradedAtIso: now.toISOString(),
      triggerType: 'Scheduled Monthly Auto-Upgrade',
      unlockedCapability: getUnlockedCapabilityForMonth(2),
      anomalyPrecisionPct: baseMetrics.anomalyPrecisionPct,
      predictiveLeadHours: baseMetrics.predictiveLeadHours,
      amocEfficiencyGainPct: baseMetrics.amocEfficiencyGainPct,
      falsePositiveRatePct: baseMetrics.falsePositiveRatePct
    }
  ];

  const actionLogs: SuperintendentActionLog[] = [
    {
      id: 'SUP-INIT-1',
      timestamp: now.toLocaleTimeString(),
      buoyId: 'ocean-boy-7',
      buoyName: 'Ocean Boy #7 - Campbell Plateau',
      action: 'Solar MPPT Trickle Balance',
      outcome: 'Calibrated low-angle polar solar harvest under 40W cloud deck',
      generationAtExecution: 2
    },
    {
      id: 'SUP-INIT-2',
      timestamp: now.toLocaleTimeString(),
      buoyId: 'ocean-boy-17',
      buoyName: 'NOAA DART 55023 - Coral Sea',
      action: 'Priority Tsunami Watch Telemetry Lock',
      outcome: 'Allocated dedicated Iridium SBD channel & flagged SMS dispatch',
      generationAtExecution: 2
    }
  ];

  return {
    generation: 2,
    autoUpgradeMonthly: true,
    lastUpgradedIso: now.toISOString(),
    nextScheduledUpgradeIso: getNextMonthStartIso(now),
    upgradeHistory,
    actionLogs,
    remediatedBuoyIds: []
  };
}

export function loadSuperintendentState(): SuperintendentState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createInitialSuperintendentState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw) as SuperintendentState;

    // Automatic Monthly Upgrade Check: if autoUpgradeMonthly is true and a calendar month boundary passed
    if (parsed.autoUpgradeMonthly && parsed.nextScheduledUpgradeIso) {
      const now = new Date();
      const scheduled = new Date(parsed.nextScheduledUpgradeIso);
      if (now.getTime() >= scheduled.getTime()) {
        const upgraded = applyMonthlyUpgrade(parsed, 'Scheduled Monthly Auto-Upgrade');
        saveSuperintendentState(upgraded);
        return upgraded;
      }
    }
    return parsed;
  } catch {
    return createInitialSuperintendentState();
  }
}

export function saveSuperintendentState(state: SuperintendentState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
}

export function applyMonthlyUpgrade(
  current: SuperintendentState,
  triggerType: 'Scheduled Monthly Auto-Upgrade' | 'Manual Upgrade Rollout' = 'Manual Upgrade Rollout'
): SuperintendentState {
  const nextGen = current.generation + 1;
  const metrics = computeIntelligenceMetrics(nextGen);

  // Advance simulated rollout timestamp by 1 month per upgrade so month labels track progression cleanly
  const lastDate = new Date(current.lastUpgradedIso || Date.now());
  const nextMonthDate = new Date(
    Date.UTC(lastDate.getUTCFullYear(), lastDate.getUTCMonth() + 1, 1, 2, 0, 0)
  );

  const newRecord: SuperintendentUpgradeRecord = {
    generation: nextGen,
    monthLabel: formatMonthLabel(nextMonthDate, nextGen),
    upgradedAtIso: nextMonthDate.toISOString(),
    triggerType,
    unlockedCapability: getUnlockedCapabilityForMonth(nextGen),
    anomalyPrecisionPct: metrics.anomalyPrecisionPct,
    predictiveLeadHours: metrics.predictiveLeadHours,
    amocEfficiencyGainPct: metrics.amocEfficiencyGainPct,
    falsePositiveRatePct: metrics.falsePositiveRatePct
  };

  const newLog: SuperintendentActionLog = {
    id: `SUP-UPG-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    buoyId: 'fleet-wide',
    buoyName: 'All 23 Ocean Boys & Turbine Platforms',
    action: `Monthly Superintendent Upgrade → Gen ${nextGen}.0`,
    outcome: `Unlocked: ${newRecord.unlockedCapability} (Precision ${metrics.anomalyPrecisionPct}%)`,
    generationAtExecution: nextGen
  };

  const updated: SuperintendentState = {
    ...current,
    generation: nextGen,
    lastUpgradedIso: nextMonthDate.toISOString(),
    nextScheduledUpgradeIso: getNextMonthStartIso(nextMonthDate),
    upgradeHistory: [newRecord, ...current.upgradeHistory].slice(0, 24),
    actionLogs: [newLog, ...current.actionLogs].slice(0, 30)
  };

  saveSuperintendentState(updated);
  return updated;
}

export function evaluateInteriorSubsystems(
  generation: number,
  buoys: OceanBoy[]
): InteriorSubsystemStatus[] {
  const avgBattery =
    buoys.length > 0
      ? buoys.reduce((sum, b) => sum + b.batteryPct, 0) / buoys.length
      : 92;
  const maxWave = buoys.length > 0 ? Math.max(...buoys.map((b) => b.waveHeightM)) : 4.2;
  const learnedBonus = Number(Math.min(9.8, (generation - 1) * 1.15).toFixed(1));

  return [
    {
      id: 'int-evap',
      name: 'Ceramic Membrane-Less Evaporator Loop',
      subsystemZone: 'Core Evaporator & Pump',
      baseEfficiencyPct: 87.5,
      learnedGainPct: learnedBonus,
      effectiveEfficiencyPct: Number(Math.min(98.9, 87.5 + learnedBonus).toFixed(1)),
      thermalMarginC: Number((14.2 + generation * 0.35).toFixed(1)),
      status: generation >= 2 ? 'Optimal' : 'Calibrating',
      lastTunedMonth: generation,
      upgradeNote:
        generation >= 4
          ? 'Auto-backflush cycle prevents salt crystal bridging across polar brine channels.'
          : 'Thermal gradient tracking calibrated for sub-Antarctic ambient water.'
    },
    {
      id: 'int-pump',
      name: 'Dual-Chamber Brine Concentration Pump',
      subsystemZone: 'Core Evaporator & Pump',
      baseEfficiencyPct: 88.2,
      learnedGainPct: Number((learnedBonus * 0.9).toFixed(1)),
      effectiveEfficiencyPct: Number(Math.min(99.1, 88.2 + learnedBonus * 0.9).toFixed(1)),
      thermalMarginC: Number((11.8 + generation * 0.28).toFixed(1)),
      status: maxWave >= 5.8 && generation < 4 ? 'Calibrating' : 'Optimal',
      lastTunedMonth: generation,
      upgradeNote:
        generation >= 3
          ? 'Micro-vibration harmonic monitoring predicts seal wear days before pressure drop.'
          : 'Standard pressure-compensated flow loop active.'
    },
    {
      id: 'int-rotor',
      name: 'Non-Cavitating Magnetic Turbine Drive',
      subsystemZone: 'Surface Rotor & Power',
      baseEfficiencyPct: 86.0,
      learnedGainPct: Number((learnedBonus * 1.05).toFixed(1)),
      effectiveEfficiencyPct: Number(Math.min(98.4, 86.0 + learnedBonus * 1.05).toFixed(1)),
      thermalMarginC: Number((16.5 + generation * 0.25).toFixed(1)),
      status: maxWave >= 6.0 && generation < 3 ? 'Attention Needed' : 'Optimal',
      lastTunedMonth: generation,
      upgradeNote:
        generation >= 4
          ? 'Active pitch feathering & electro-thermal de-icing engaged automatically in gale/snow states.'
          : 'Fixed pitch torque curve tracking Southern Ocean gusts.'
    },
    {
      id: 'int-power',
      name: '360° Bifacial Solar & LiFePO4 Power Bus',
      subsystemZone: 'Surface Rotor & Power',
      baseEfficiencyPct: 89.0,
      learnedGainPct: Number((learnedBonus * 0.85).toFixed(1)),
      effectiveEfficiencyPct: Number(Math.min(99.3, 89.0 + learnedBonus * 0.85).toFixed(1)),
      thermalMarginC: Number((19.0 + generation * 0.2).toFixed(1)),
      status: avgBattery < 88 ? 'Attention Needed' : 'Optimal',
      lastTunedMonth: generation,
      upgradeNote:
        generation >= 2
          ? 'Dynamic MPPT albedo tracking harvests low-angle ice glare & reduces deep discharge.'
          : 'Basic charge controller active.'
    },
    {
      id: 'int-adcp',
      name: 'Subsea ADCP & Dual Salinity Sensor Array',
      subsystemZone: 'Subsea Diffuser & Sensors',
      baseEfficiencyPct: 90.4,
      learnedGainPct: Number((learnedBonus * 0.75).toFixed(1)),
      effectiveEfficiencyPct: Number(Math.min(99.5, 90.4 + learnedBonus * 0.75).toFixed(1)),
      thermalMarginC: Number((22.1 + generation * 0.15).toFixed(1)),
      status: 'Optimal',
      lastTunedMonth: generation,
      upgradeNote:
        generation >= 7
          ? 'Cross-buoy halocline drift assimilation corrects conductivity drift autonomously.'
          : '25 m perimeter ΔPSU guardrail enforced.'
    },
    {
      id: 'int-hydrophone',
      name: 'Marine Mammal Hydrophone Shield (<85 dB)',
      subsystemZone: 'Telemetry & Shielding',
      baseEfficiencyPct: 91.5,
      learnedGainPct: Number((learnedBonus * 0.7).toFixed(1)),
      effectiveEfficiencyPct: Number(Math.min(99.7, 91.5 + learnedBonus * 0.7).toFixed(1)),
      thermalMarginC: Number((24.0 + generation * 0.12).toFixed(1)),
      status: 'Optimal',
      lastTunedMonth: generation,
      upgradeNote:
        generation >= 6
          ? 'Real-time cetacean click/song classifier feathers pumps within 1.5 s of whale approach.'
          : 'Static 84.2 dB ceiling verified against DOC/IMO standards.'
    }
  ];
}

export interface BuoyDiagnosis {
  buoy: OceanBoy;
  healthState: 'Optimal' | 'Degraded' | 'Critical';
  primaryIssue: string;
  recommendedAction: string;
  canAutoRemediate: boolean;
}

export function diagnoseFleetAnomalies(buoys: OceanBoy[]): BuoyDiagnosis[] {
  const diagnoses: BuoyDiagnosis[] = [];

  for (const buoy of buoys) {
    const healthState = classifyBuoyHealth(buoy);
    if (healthState === 'Optimal') continue;

    let primaryIssue = 'Sub-optimal telemetry margin';
    let recommendedAction = 'Apply adaptive power & flow calibration';
    let canAutoRemediate = true;

    if (buoy.status === 'Tsunami Watch') {
      primaryIssue = 'Active Tsunami Watch pressure wave anomaly detected';
      recommendedAction = 'Lock priority Iridium DART burst & feather brine pumps';
      canAutoRemediate = false; // Watch status remains flagged for maritime safety
    } else if (buoy.batteryPct < 88 && (buoy.solarWatts || 0) < 50) {
      primaryIssue = `Low battery (${buoy.batteryPct}% SoC) paired with low solar harvest (${buoy.solarWatts}W)`;
      recommendedAction = 'Engage MPPT Albedo Boost, shed auxiliary heaters & rebalance kinetic harvest';
    } else if (buoy.waveHeightM >= 5.2) {
      primaryIssue = `Severe sea state (${buoy.waveHeightM} m swell) stressing mooring & rotor`;
      recommendedAction = 'Switch turbine to storm-feather profile & divert surge power to LiFePO4 bank';
    } else if (buoy.batteryPct < 88) {
      primaryIssue = `Battery reserve margin below 88% (${buoy.batteryPct}% SoC)`;
      recommendedAction = 'Optimize duty-cycle pumping & recover +6% SoC from wave generator';
    } else if (buoy.status === 'Deploying' || buoy.status === 'Standby') {
      primaryIssue = `Unit in ${buoy.status} state outside active convection loop`;
      recommendedAction = 'Run pre-commissioning interior check & promote to Operational';
    }

    diagnoses.push({
      buoy,
      healthState,
      primaryIssue,
      recommendedAction,
      canAutoRemediate
    });
  }

  return diagnoses;
}

export interface RecommendedBuildModule {
  id: string;
  priority: 'HIGH' | 'MEDIUM' | 'NEXT SPRINT';
  title: string;
  summary: string;
  impactArea: string;
}

export const RECOMMENDED_NEXT_UPGRADES: RecommendedBuildModule[] = [
  {
    id: 'rec-ais-iceberg',
    priority: 'HIGH',
    title: 'Real-Time Vessel AIS & Iceberg Collision Avoidance',
    summary:
      'Ingest Sentinel-1 SAR iceberg tracks and Class-A/B AIS shipping transponders so the Superintendent autonomously feathers rotors or triggers SMS vessel warnings before collisions.',
    impactArea: 'Ocean Boys Fleet & Antarctic Margins'
  },
  {
    id: 'rec-usv-dispatch',
    priority: 'HIGH',
    title: 'Autonomous USV / Tender Maintenance Dispatch Router',
    summary:
      'Route Pukekohe or Campbell Island uncrewed surface vessels directly to Degraded buoys for ceramic filter backflush, anode swaps, and mooring shackles.',
    impactArea: 'Ocean Trials Logistics & Fleet Health'
  },
  {
    id: 'rec-live-webhook',
    priority: 'MEDIUM',
    title: 'Live Iridium SBD / MQTT Hardware Ingestion Endpoint',
    summary:
      'Accept signed JSON packets from physical Mark-II/Mark-III prototype microcontrollers so real wet-lab & Hauraki Gulf sea trial telemetry replaces simulated polling.',
    impactArea: 'Backend Server & Telemetry Sim'
  },
  {
    id: 'rec-rbac-logbook',
    priority: 'NEXT SPRINT',
    title: 'Persistent Surveyor Audit Logbook (Firestore + Auth)',
    summary:
      'Store signed monthly Superintendent upgrades, EPA EEZ inspection approvals, and anomalous threshold alerts in a persistent cloud audit trail for regulators and investors.',
    impactArea: 'Eco Safety & Regulatory Compliance'
  }
];
