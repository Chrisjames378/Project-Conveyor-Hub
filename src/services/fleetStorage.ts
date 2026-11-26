import { OceanBoy } from '../types';

const STORAGE_KEY = 'salibuoy_ocean_boys_fleet_v1';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Loads the user's fleet workspace from this browser only.
 * The bundled fleet remains the source of truth for the supported buoy IDs
 * and supplies defaults for fields missing from older or damaged saved data.
 */
export function loadFleetState(initialFleet: OceanBoy[]): OceanBoy[] {
  if (typeof window === 'undefined') return initialFleet;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialFleet;

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return initialFleet;

    const savedById = new Map<string, Record<string, unknown>>();
    for (const item of parsed) {
      if (isRecord(item) && typeof item.id === 'string') {
        savedById.set(item.id, item);
      }
    }

    return initialFleet.map((base) => {
      const saved = savedById.get(base.id);
      if (!saved) return base;

      const numericFields: (keyof OceanBoy)[] = [
        'salinityPsu',
        'ambientTempC',
        'depthM',
        'waveHeightM',
        'wavePowerWatts',
        'batteryPct',
        'solarWatts',
        'pumpRateLpM'
      ];
      for (const field of numericFields) {
        if (typeof saved[field] !== 'number' || !Number.isFinite(saved[field])) {
          return base;
        }
      }

      const savedCoordinates = isRecord(saved.coordinates) ? saved.coordinates : {};
      const coordinates = (
        typeof savedCoordinates.lat === 'number' &&
        Number.isFinite(savedCoordinates.lat) &&
        typeof savedCoordinates.lng === 'number' &&
        Number.isFinite(savedCoordinates.lng)
      ) ? { lat: savedCoordinates.lat, lng: savedCoordinates.lng } : base.coordinates;

      const savedPass = isRecord(saved.satellitePass) ? saved.satellitePass : {};
      const satellitePass = {
        ...base.satellitePass,
        ...savedPass,
        recentFrames: Array.isArray(savedPass.recentFrames)
          ? savedPass.recentFrames
          : base.satellitePass.recentFrames
      } as OceanBoy['satellitePass'];

      return {
        ...base,
        ...saved,
        id: base.id,
        coordinates,
        satellitePass
      } as OceanBoy;
    });
  } catch {
    return initialFleet;
  }
}

/** Saves fleet workspace changes locally; this is not a server/cloud sync. */
export function saveFleetState(fleet: OceanBoy[]): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fleet));
  } catch {
    // Keep the app usable when storage is disabled or the browser quota is full.
  }
}
