import Dexie, { Table } from 'dexie';

export interface TelemetryLog {
  id?: number;
  timestamp: number;
  timeString: string;
  swellHeight: number;
  surfaceTemp: number;
  deepTemp: number;
  windSpeed: number;
  windDirection: number;
  powerOutput: number;
  systemStatus: string;
}

export class TelemetryDatabase extends Dexie {
  telemetryLogs!: Table<TelemetryLog, number>;

  constructor() {
    super('SaliBuoyTelemetryDB');
    this.version(1).stores({
      telemetryLogs: '++id, timestamp, timeString' // Primary key and indexed props
    });
  }
}

export const db = new TelemetryDatabase();
