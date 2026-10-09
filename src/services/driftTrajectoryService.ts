import { OceanBoy, CurrentVelocity, PredictedTrajectoryPoint } from '../types';

// Ocean current systems mapped to geographic zones
const CURRENT_SYSTEMS: Record<string, { name: string; baseSpeedKnots: number; baseHeadingDeg: number; description: string }> = {
  hauraki: {
    name: 'East Auckland Current (EAUC)',
    baseSpeedKnots: 1.8,
    baseHeadingDeg: 142,
    description: 'Subtropical inflow sweeping south-east along the north-east coast of the North Island.'
  },
  campbell: {
    name: 'Sub-Antarctic Front / ACC Jet',
    baseSpeedKnots: 3.2,
    baseHeadingDeg: 95,
    description: 'Powerful eastward zonal flow driven by Roaring Forties westerly atmospheric forcing.'
  },
  kermadec: {
    name: 'Kermadec Trench Boundary Flow',
    baseSpeedKnots: 1.5,
    baseHeadingDeg: 195,
    description: 'Deep abyssal contour current following the subduction trench flank.'
  },
  cook: {
    name: 'Cook Strait Rip / D’Urville Current',
    baseSpeedKnots: 3.8,
    baseHeadingDeg: 118,
    description: 'High-energy constricted tidal jet between the Tasman Sea and Pacific Ocean.'
  },
  fiordland: {
    name: 'Southland Current / Fiordland Jet',
    baseSpeedKnots: 2.1,
    baseHeadingDeg: 210,
    description: 'Narrow coastal jet flowing equatorward over deep submarine canyon heads.'
  },
  ross: {
    name: 'Ross Sea Polar Gyre Outflow',
    baseSpeedKnots: 1.4,
    baseHeadingDeg: 285,
    description: 'Cold, dense cyclonic polar gyre carrying high-salinity shelf water northward.'
  },
  chatham: {
    name: 'Subtropical Convergence Jet',
    baseSpeedKnots: 2.4,
    baseHeadingDeg: 88,
    description: 'Oceanic frontal zone where warm northern and cold southern waters meet.'
  },
  tasman: {
    name: 'Tasman Sea Zonal Outflow',
    baseSpeedKnots: 1.6,
    baseHeadingDeg: 105,
    description: 'Broad eastward drift carrying surface waters from the Tasman Sea into the Pacific.'
  },
  default: {
    name: 'South Pacific Subtropical Gyre',
    baseSpeedKnots: 1.3,
    baseHeadingDeg: 120,
    description: 'Anticyclonic basin-scale circulation driven by trade winds.'
  }
};

function getCompassHeading(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}

export function calculateBuoyCurrentVelocity(buoy: OceanBoy, timeOffsetHours = 0): CurrentVelocity {
  let zone = 'default';
  const name = (buoy.name + ' ' + buoy.region).toLowerCase();

  if (name.includes('hauraki') || name.includes('auckland')) zone = 'hauraki';
  else if (name.includes('campbell') || name.includes('bounty') || name.includes('antarctic')) zone = 'campbell';
  else if (name.includes('kermadec')) zone = 'kermadec';
  else if (name.includes('cook') || name.includes('wellington') || name.includes('baring')) zone = 'cook';
  else if (name.includes('fiordland') || name.includes('doubtful')) zone = 'fiordland';
  else if (name.includes('ross')) zone = 'ross';
  else if (name.includes('chatham')) zone = 'chatham';
  else if (name.includes('tasman') || name.includes('bom')) zone = 'tasman';

  const system = CURRENT_SYSTEMS[zone] || CURRENT_SYSTEMS.default;

  // Real-time jitter based on coordinates and time
  const seed = Math.sin(buoy.coordinates.lat * 10 + buoy.coordinates.lng + timeOffsetHours);
  const speedKnots = Math.max(0.4, Number((system.baseSpeedKnots + seed * 0.4).toFixed(2)));
  const speedMs = Number((speedKnots * 0.514444).toFixed(2));
  const directionDeg = Math.round((system.baseHeadingDeg + seed * 12 + 360) % 360);

  // Decompose into u (east-west) and v (north-south) in m/s
  // In oceanography: direction is TOWARDS which water flows
  const rad = (directionDeg * Math.PI) / 180;
  const uVelocityMs = Number((speedMs * Math.sin(rad)).toFixed(2));
  const vVelocityMs = Number((speedMs * Math.cos(rad)).toFixed(2));

  return {
    speedKnots,
    speedMs,
    directionDeg,
    directionCompass: getCompassHeading(directionDeg),
    currentSystem: system.name,
    uVelocityMs,
    vVelocityMs
  };
}

export function predictBuoyTrajectory(
  buoy: OceanBoy,
  currentVel: CurrentVelocity
): PredictedTrajectoryPoint[] {
  const horizons = [6, 12, 24, 48]; // Hours ahead
  const now = new Date();
  const earthRadiusKm = 6371;

  return horizons.map(hours => {
    // Distance in km traveled at speedMs over hours
    // meters = speedMs * (hours * 3600), km = meters / 1000
    // Incorporate slight Coriolis deflection in Southern Hemisphere: deflection is left of motion
    const coriolisDeflectionDeg = buoy.coordinates.lat < 0 ? -1.5 * (hours / 12) : 1.5 * (hours / 12);
    const effectiveHeading = (currentVel.directionDeg + coriolisDeflectionDeg + 360) % 360;
    const distanceKm = currentVel.speedMs * (hours * 3600) / 1000;

    const radHeading = (effectiveHeading * Math.PI) / 180;
    const latRad = (buoy.coordinates.lat * Math.PI) / 180;

    // Projected delta lat & delta lng
    const deltaLatRad = (distanceKm / earthRadiusKm) * Math.cos(radHeading);
    const newLat = (latRad + deltaLatRad) * (180 / Math.PI);

    const deltaLngRad = (distanceKm / earthRadiusKm) * Math.sin(radHeading) / Math.cos(latRad);
    const newLng = buoy.coordinates.lng + deltaLngRad * (180 / Math.PI);

    const futureTime = new Date(now.getTime() + hours * 3600 * 1000);
    const timestampStr = futureTime.toISOString().replace('T', ' ').substring(0, 16) + ' UTC';

    // Confidence decreases with time horizon
    const confidencePct = Math.max(72, Math.round(98 - (hours * 0.45)));

    return {
      hoursAhead: hours,
      coordinates: {
        lat: Number(newLat.toFixed(4)),
        lng: Number(newLng.toFixed(4))
      },
      driftDistanceKm: Number(distanceKm.toFixed(1)),
      timestamp: timestampStr,
      confidencePct
    };
  });
}

export function enrichBuoysWithDrift(buoys: OceanBoy[]): OceanBoy[] {
  return buoys.map(buoy => {
    const currentVel = calculateBuoyCurrentVelocity(buoy);
    const trajectory = predictBuoyTrajectory(buoy, currentVel);

    return {
      ...buoy,
      currentVelocity: currentVel,
      predictedTrajectory: trajectory,
      driftHeadingDeg: currentVel.directionDeg,
      driftSpeedKnots: currentVel.speedKnots
    };
  });
}
