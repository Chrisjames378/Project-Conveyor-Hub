export type ViewMode = 'realistic' | 'thermal' | 'wireframe';

export type DocCategory = 'sovereign' | 'vc' | 'field';

export type ActiveSection =
  | 'summary'
  | 'specifications'
  | 'swarm-ai'
  | 'business'
  | 'communications'
  | 'faq'
  | 'simulator'
  | 'fleet-command'
  | 'climate-strategy'
  | 'buoy-telemetry'
  | 'operations'
  | 'ai-agent';

export interface TelemetryState {
  windSpeed: number; // 0 - 50 Knots
  salinity: number; // 30 - 60 PSU
  vawtRpm: number;
  propRpm: number;
  torque: number; // kN·m
  iceRate: number; // mm/hr
  sverdrups: number; // Sv flow
  albedo: number;
  temperature: number; // °C
}

export interface BOMItem {
  id: string;
  name: string;
  spec: string;
  description: string;
  advantage: string;
  iconName: string;
}

export interface RoadmapPhase {
  quarter: string;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
  tags: string[];
}
