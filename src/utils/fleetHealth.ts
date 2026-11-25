import { OceanBoy } from '../types';

export type BuoyHealthState = 'Optimal' | 'Degraded' | 'Critical';

export interface FleetHealthSummary {
  total: number;
  optimalCount: number;
  degradedCount: number;
  criticalCount: number;
  optimalPct: number;
  degradedPct: number;
  criticalPct: number;
  criticalBuoys: OceanBoy[];
  degradedBuoys: OceanBoy[];
}

/**
 * Classifies an Ocean Boy telemetry unit into Optimal, Degraded, or Critical
 * based on live telemetry thresholds (status, battery SoC, salinity bounds, sea state, solar array).
 */
export function classifyBuoyHealth(buoy: OceanBoy): BuoyHealthState {
  if (
    buoy.status === 'Tsunami Watch' ||
    buoy.batteryPct < 50 ||
    buoy.salinityPsu > 44.5 ||
    buoy.salinityPsu < 32.5 ||
    buoy.ambientTempC > 26.5
  ) {
    return 'Critical';
  }

  if (
    buoy.batteryPct < 88 ||
    buoy.waveHeightM >= 5.2 ||
    buoy.status === 'Deploying' ||
    buoy.status === 'Standby' ||
    (buoy.category === 'SaliBuoy Pumping Fleet' && (buoy.solarWatts || 0) < 50)
  ) {
    return 'Degraded';
  }

  return 'Optimal';
}

export function computeFleetHealthStats(buoys: OceanBoy[]): FleetHealthSummary {
  const total = buoys.length;
  if (total === 0) {
    return {
      total: 0,
      optimalCount: 0,
      degradedCount: 0,
      criticalCount: 0,
      optimalPct: 0,
      degradedPct: 0,
      criticalPct: 0,
      criticalBuoys: [],
      degradedBuoys: []
    };
  }

  let optimalCount = 0;
  const degradedBuoys: OceanBoy[] = [];
  const criticalBuoys: OceanBoy[] = [];

  for (const buoy of buoys) {
    const state = classifyBuoyHealth(buoy);
    if (state === 'Critical') {
      criticalBuoys.push(buoy);
    } else if (state === 'Degraded') {
      degradedBuoys.push(buoy);
    } else {
      optimalCount++;
    }
  }

  const degradedCount = degradedBuoys.length;
  const criticalCount = criticalBuoys.length;

  const optimalPct = Number(((optimalCount / total) * 100).toFixed(1));
  const degradedPct = Number(((degradedCount / total) * 100).toFixed(1));
  const criticalPct = Number(((criticalCount / total) * 100).toFixed(1));

  return {
    total,
    optimalCount,
    degradedCount,
    criticalCount,
    optimalPct,
    degradedPct,
    criticalPct,
    criticalBuoys,
    degradedBuoys
  };
}
