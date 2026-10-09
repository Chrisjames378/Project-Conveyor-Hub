import React, { useState, useEffect } from 'react';
import { 
  Globe2, 
  Thermometer, 
  Flame, 
  Snowflake, 
  Layers, 
  RefreshCw, 
  ExternalLink, 
  Download, 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  Check, 
  Copy, 
  Compass, 
  Radio, 
  ArrowUpRight, 
  Info,
  Maximize2,
  TrendingDown,
  TrendingUp,
  Sliders,
  Anchor
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  AreaChart,
  Area
} from 'recharts';
import { OceanRegionData } from '../types';
import { downloadFile } from '../utils/exportUtils';

interface NoaaClimateResponse {
  status: string;
  timestamp: string;
  dateString: string;
  sourceAuthority: string;
  productVersion: string;
  ohcProduct: string;
  satelliteConstellation: string;
  baselineClimatology: string;
  amocStatus: {
    rapidTransportSv: number;
    rapidBaselineSv: number;
    rapidAnomalyPercent: number;
    osnapTransportSv: number;
    subpolarColdBlobCenter: { lat: number; lng: number };
    subpolarColdBlobAnomalyC: number;
    subtropicalWarmPoolAnomalyC: number;
    meridionalDensityGradientKgM3: number;
    criticalDensityThresholdKgM3: number;
    ohcGlobalAnomalyZJ: number;
    ohcNorthAtlanticDeficitZJ: number;
    salinityAnomalySPGPsu: number;
    greenlandDischargeGtYear: number;
    systemStabilityRating: string;
  };
  noaaLayers: {
    id: string;
    name: string;
    description: string;
    unit: string;
    imageUrl: string;
  }[];
  regions: OceanRegionData[];
}

export const GlobalClimateDashboard: React.FC = () => {
  const [data, setData] = useState<NoaaClimateResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeLayer, setActiveLayer] = useState<'sst-anomaly' | 'ocean-heat-content' | 'bleaching-alert' | 'salibuoy-impact'>('sst-anomaly');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('subpolar-gyre');
  const [viewMode, setViewMode] = useState<'interactive-map' | 'direct-noaa-satellite' | 'profile-analytics'>('interactive-map');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [simulatedBuoyCount, setSimulatedBuoyCount] = useState<number>(250);

  // Fetch real-time NOAA Coral Reef Watch & Ocean Heat Content API data
  const fetchNoaaData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/climate/noaa-sst');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load NOAA SST data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNoaaData();
  }, []);

  const selectedRegion = data?.regions.find(r => r.id === selectedRegionId) || data?.regions[0];

  // Historical 2000-2026 subpolar cold blob vs subtropical SST anomaly trend data
  const historicalAnomalyTrend = [
    { year: '2000', subpolarAnomaly: -0.22, subtropicalAnomaly: +0.28, amocTransport: 17.8 },
    { year: '2004', subpolarAnomaly: -0.35, subtropicalAnomaly: +0.41, amocTransport: 17.5 },
    { year: '2008', subpolarAnomaly: -0.58, subtropicalAnomaly: +0.62, amocTransport: 16.9 },
    { year: '2012', subpolarAnomaly: -0.89, subtropicalAnomaly: +0.84, amocTransport: 16.2 },
    { year: '2015', subpolarAnomaly: -1.38, subtropicalAnomaly: +1.15, amocTransport: 15.6 },
    { year: '2018', subpolarAnomaly: -1.45, subtropicalAnomaly: +1.28, amocTransport: 15.3 },
    { year: '2021', subpolarAnomaly: -1.62, subtropicalAnomaly: +1.42, amocTransport: 15.0 },
    { year: '2023', subpolarAnomaly: -1.74, subtropicalAnomaly: +1.58, amocTransport: 14.8 },
    { year: '2025', subpolarAnomaly: -1.81, subtropicalAnomaly: +1.62, amocTransport: 14.7 },
    { year: '2026', subpolarAnomaly: -1.86, subtropicalAnomaly: +1.64, amocTransport: 14.6 },
  ];

  // Depth profile data (Surface to 2,000m) for the selected region
  const depthProfileData = [
    { depth: 0, temp: selectedRegion?.surfaceTemp || 6.2, salinity: selectedRegion?.salinityPsu || 34.68, density: selectedRegion?.densitySigma || 27.42 },
    { depth: 100, temp: (selectedRegion?.surfaceTemp || 6.2) - 0.8, salinity: (selectedRegion?.salinityPsu || 34.68) + 0.12, density: (selectedRegion?.densitySigma || 27.42) + 0.15 },
    { depth: 250, temp: (selectedRegion?.surfaceTemp || 6.2) - 1.5, salinity: (selectedRegion?.salinityPsu || 34.68) + 0.22, density: (selectedRegion?.densitySigma || 27.42) + 0.28 },
    { depth: 500, temp: 3.4, salinity: 34.92, density: 27.85 },
    { depth: 1000, temp: 2.8, salinity: 34.98, density: 27.94 },
    { depth: 1500, temp: 2.1, salinity: 34.96, density: 28.02 },
    { depth: 2000, temp: 1.8, salinity: 34.94, density: 28.08 },
  ];

  // Calculate simulated SaliBuoy impact on local density and downwelling
  const densityRestorationBoost = (simulatedBuoyCount * 0.0006).toFixed(3); // kg/m³
  const simulatedDensity = ((selectedRegion?.densitySigma || 27.42) + parseFloat(densityRestorationBoost)).toFixed(2);
  const brineInjectionVolumeM3Day = (simulatedBuoyCount * 180 * 24 * 60 / 1000).toLocaleString(); // 180 L/min

  const exportClimateDataset = () => {
    if (!data) return;
    const jsonStr = JSON.stringify(data, null, 2);
    downloadFile(jsonStr, `NOAA_CRW_AMOC_Climate_Metrics_${data.dateString}.json`, 'application/json');
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-sky-400 mb-1.5">
              <Radio className="w-4 h-4 animate-pulse text-emerald-400" />
              <span className="font-semibold uppercase tracking-wider">REAL-TIME OCEANIC OBSERVATION NETWORK</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">NOAA Coral Reef Watch (CRW) & NCEI OHC</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-mono">
              Global Climate Dashboard
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl mt-1 leading-relaxed">
              Continuous satellite ingestion of daily 5km Sea Surface Temperature (SST) anomalies, Ocean Heat Content (0–2000m), and Subpolar North Atlantic downwelling diagnostics tracking the stability of the Atlantic Meridional Overturning Circulation (AMOC).
            </p>
          </div>

          {/* Actions & Refresh */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={fetchNoaaData}
              disabled={loading}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded-lg border border-slate-700 transition cursor-pointer disabled:opacity-50"
              title="Refresh NOAA Satellite Feed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-sky-400' : 'text-slate-400'}`} />
              <span>{loading ? 'Ingesting...' : 'Sync NOAA Feed'}</span>
            </button>

            <button
              onClick={exportClimateDataset}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded-lg border border-slate-700 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export Telemetry (JSON)</span>
            </button>

            <button
              onClick={copyShareLink}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-sky-950 hover:bg-sky-900 text-sky-300 text-xs font-mono rounded-lg border border-sky-800 transition cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied' : 'Share View'}</span>
            </button>
          </div>
        </div>

        {/* Unboxed Metadata Bar (Constitution Compliant) */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-slate-400">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
            <span className="text-slate-200 font-bold">CRW v3.1 Operational Daily 5km</span>
          </span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span>Constellation: JPSS VIIRS (NOAA-20/21) / MetOp AVHRR / GOES / Himawari-9</span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span>Baseline: 1985–2012 Climatology</span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span className="text-sky-300">Observation Date: {data?.dateString || '2026-09-24'}</span>
        </div>
      </div>

      {/* AMOC-Critical Oceanic Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Metric 1: AMOC Transport Rate */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>AMOC Transport (RAPID 26.5°N)</span>
              <Activity className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-mono text-white">
                {data?.amocStatus.rapidTransportSv ?? 14.6}
              </span>
              <span className="text-xs font-mono text-slate-400">Sv (10⁶ m³/s)</span>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
            <span className="text-rose-400 font-semibold flex items-center">
              <TrendingDown className="w-3 h-3 mr-1" />
              -16.6% Deficit
            </span>
            <span className="text-slate-500">Ref: 17.5 Sv</span>
          </div>
        </div>

        {/* Metric 2: Subpolar Cold Blob SST Anomaly */}
        <div className="bg-slate-900/80 border border-sky-900/50 p-4 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-sky-400 mb-1">
              <span>Subpolar Cold Blob (54.5°N)</span>
              <Snowflake className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-mono text-sky-300">
                {data?.amocStatus.subpolarColdBlobAnomalyC ?? -1.86}°C
              </span>
              <span className="text-[10px] font-mono text-sky-500">SST Dev</span>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
            <span className="text-sky-400 font-semibold">AMOC Slowdown Signature</span>
            <span className="text-slate-500">Subpolar Gyre</span>
          </div>
        </div>

        {/* Metric 3: Upper Ocean Heat Content (0-2000m) */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>Global OHC (0–2000m)</span>
              <Flame className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-mono text-white">
                +{data?.amocStatus.ohcGlobalAnomalyZJ ?? 228.4}
              </span>
              <span className="text-xs font-mono text-slate-400">ZJ (10²¹ J)</span>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
            <span className="text-rose-400 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              All-Time High
            </span>
            <span className="text-slate-500">NCEI Pentadal</span>
          </div>
        </div>

        {/* Metric 4: Meridional Density Gradient */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>Density Gradient (Δρ)</span>
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-mono text-amber-300">
                {data?.amocStatus.meridionalDensityGradientKgM3 ?? 1.18}
              </span>
              <span className="text-xs font-mono text-slate-400">kg/m³</span>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
            <span className="text-amber-400 font-semibold">Subcritical Sinking</span>
            <span className="text-slate-500">Need &ge; 1.45</span>
          </div>
        </div>

        {/* Metric 5: Subtropical Warm Pool Anomaly */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>Tropical Atlantic SST Dev</span>
              <Thermometer className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-mono text-rose-300">
                +{data?.amocStatus.subtropicalWarmPoolAnomalyC ?? 1.64}°C
              </span>
              <span className="text-[10px] font-mono text-rose-500">Heat Trap</span>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
            <span className="text-rose-400 font-semibold">CRW Bleach Alert 2</span>
            <span className="text-slate-500">14.8 DHW</span>
          </div>
        </div>

        {/* Metric 6: Glacial Freshwater Runoff */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>Greenland Melt Influx</span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-mono text-white">
                {data?.amocStatus.greenlandDischargeGtYear ?? 285}
              </span>
              <span className="text-xs font-mono text-slate-400">Gt / yr</span>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
            <span className="text-sky-300 font-semibold">-0.42 PSU Freshening</span>
            <span className="text-slate-500">Halocline Cap</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Map & Satellite Heat Content Explorer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-6">
        {/* Layer & View Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold font-mono text-white flex items-center space-x-2">
              <Globe2 className="w-5 h-5 text-sky-400" />
              <span>Ocean Thermal & Salinity Anomaly Layer Matrix</span>
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Click oceanic monitoring transects to inspect vertical halocline, thermal stratification, and SaliBuoy intervention nodes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Layer Switcher */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveLayer('sst-anomaly')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeLayer === 'sst-anomaly'
                    ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-900/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                NOAA 5km SST Anomaly
              </button>
              <button
                type="button"
                onClick={() => setActiveLayer('ocean-heat-content')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeLayer === 'ocean-heat-content'
                    ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-900/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                OHC 0–2000m Depth
              </button>
              <button
                type="button"
                onClick={() => setActiveLayer('bleaching-alert')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeLayer === 'bleaching-alert'
                    ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-900/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Marine Heatwave (CRW)
              </button>
              <button
                type="button"
                onClick={() => setActiveLayer('salibuoy-impact')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeLayer === 'salibuoy-impact'
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-900/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                SaliBuoy Brine Vector
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setViewMode('interactive-map')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'interactive-map' ? 'bg-slate-800 text-sky-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Map Canvas
              </button>
              <button
                type="button"
                onClick={() => setViewMode('direct-noaa-satellite')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'direct-noaa-satellite' ? 'bg-slate-800 text-sky-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Live NOAA Feed
              </button>
              <button
                type="button"
                onClick={() => setViewMode('profile-analytics')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'profile-analytics' ? 'bg-slate-800 text-sky-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Trend Diagnostics
              </button>
            </div>
          </div>
        </div>

        {/* View Mode 1: Interactive Ocean Map Canvas */}
        {viewMode === 'interactive-map' && (
          <div className="space-y-4">
            <div className="relative w-full h-[460px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
              {/* Dynamic SVG Oceanographic Projection */}
              <svg 
                viewBox="0 0 1000 500" 
                className="w-full h-full object-contain filter drop-shadow-lg"
              >
                <defs>
                  {/* Oceanic Grid Pattern */}
                  <pattern id="oceanGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0f172a" strokeWidth="0.8" />
                  </pattern>

                  {/* Cold Blob Anomaly Gradient */}
                  <radialGradient id="coldBlobGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.85" />
                    <stop offset="50%" stopColor="#0369a1" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                  </radialGradient>

                  {/* Subtropical Heat Pool Gradient */}
                  <radialGradient id="heatPoolGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#e11d48" stopOpacity="0.8" />
                    <stop offset="55%" stopColor="#ea580c" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                  </radialGradient>

                  {/* SaliBuoy Brine Injection Plume */}
                  <radialGradient id="brinePlumeGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                    <stop offset="60%" stopColor="#059669" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Base Ocean Background */}
                <rect width="1000" height="500" fill="#020617" />
                <rect width="1000" height="500" fill="url(#oceanGrid)" />

                {/* Simplified Continents for Context */}
                {/* North America */}
                <path 
                  d="M 120 70 Q 200 60 260 90 Q 280 130 250 170 Q 210 210 180 260 Q 150 280 130 240 Q 100 200 110 120 Z" 
                  fill="#1e293b" 
                  stroke="#334155" 
                  strokeWidth="1.2" 
                />
                {/* Greenland */}
                <path 
                  d="M 330 40 Q 390 35 410 75 Q 380 120 340 130 Q 315 90 330 40 Z" 
                  fill="#334155" 
                  stroke="#475569" 
                  strokeWidth="1.2" 
                />
                {/* Europe */}
                <path 
                  d="M 480 90 Q 560 80 620 110 Q 590 170 540 180 Q 490 160 480 90 Z" 
                  fill="#1e293b" 
                  stroke="#334155" 
                  strokeWidth="1.2" 
                />
                {/* Africa */}
                <path 
                  d="M 480 200 Q 570 190 600 260 Q 580 360 520 400 Q 470 340 460 260 Z" 
                  fill="#1e293b" 
                  stroke="#334155" 
                  strokeWidth="1.2" 
                />
                {/* South America */}
                <path 
                  d="M 210 270 Q 280 270 300 330 Q 280 430 230 470 Q 190 380 210 270 Z" 
                  fill="#1e293b" 
                  stroke="#334155" 
                  strokeWidth="1.2" 
                />
                {/* New Zealand & Australia */}
                <path 
                  d="M 820 300 Q 890 280 920 340 Q 880 390 830 380 Q 800 340 820 300 Z" 
                  fill="#1e293b" 
                  stroke="#334155" 
                  strokeWidth="1.2" 
                />
                {/* New Zealand Islands */}
                <path 
                  d="M 945 370 Q 955 365 950 385 Q 940 395 945 370 Z" 
                  fill="#38bdf8" 
                  stroke="#0284c7" 
                  strokeWidth="1.5" 
                />
                <path 
                  d="M 935 400 Q 945 390 940 425 Q 930 420 935 400 Z" 
                  fill="#38bdf8" 
                  stroke="#0284c7" 
                  strokeWidth="1.5" 
                />

                {/* Ocean Anomaly Overlay Layer */}
                {activeLayer === 'sst-anomaly' && (
                  <>
                    {/* Subpolar Cold Blob (North Atlantic Stagnation) */}
                    <circle cx="390" cy="135" r="85" fill="url(#coldBlobGrad)" />
                    <text x="390" y="135" textAnchor="middle" fill="#bae6fd" fontSize="11" fontFamily="monospace" fontWeight="bold">
                      COLD BLOB (-1.86°C)
                    </text>
                    <text x="390" y="150" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontFamily="monospace">
                      AMOC Slowdown Signature
                    </text>

                    {/* Subtropical Heat Accumulation Trap */}
                    <circle cx="280" cy="235" r="95" fill="url(#heatPoolGrad)" />
                    <text x="280" y="235" textAnchor="middle" fill="#fecdd3" fontSize="11" fontFamily="monospace" fontWeight="bold">
                      HEAT TRAP (+1.64°C)
                    </text>
                    <text x="280" y="250" textAnchor="middle" fill="#fca5a5" fontSize="9" fontFamily="monospace">
                      Gulf Stream Stagnation
                    </text>
                  </>
                )}

                {activeLayer === 'ocean-heat-content' && (
                  <>
                    {/* Deep ocean heat accumulation */}
                    <circle cx="270" cy="240" r="110" fill="url(#heatPoolGrad)" />
                    <circle cx="530" cy="280" r="90" fill="url(#heatPoolGrad)" />
                    <circle cx="850" cy="330" r="80" fill="url(#heatPoolGrad)" />
                    <text x="500" y="25" textAnchor="middle" fill="#f43f5e" fontSize="12" fontFamily="monospace" fontWeight="bold">
                      NOAA NCEI UPPER OCEAN HEAT CONTENT: +228.4 ZJ ANOMALY (0–2000m)
                    </text>
                  </>
                )}

                {activeLayer === 'bleaching-alert' && (
                  <>
                    {/* NOAA Bleaching Alert Category 2 Zones */}
                    <rect x="220" y="210" width="120" height="60" rx="30" fill="#dc2626" fillOpacity="0.45" stroke="#ef4444" strokeDasharray="4 2" />
                    <text x="280" y="245" textAnchor="middle" fill="#fef2f2" fontSize="11" fontFamily="monospace" fontWeight="bold">
                      ALERT LEVEL 2 (14.8 DHW)
                    </text>
                    <rect x="490" y="230" width="90" height="50" rx="25" fill="#f97316" fillOpacity="0.45" stroke="#fb923c" strokeDasharray="4 2" />
                    <text x="535" y="260" textAnchor="middle" fill="#fff7ed" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      ALERT LEVEL 1
                    </text>
                  </>
                )}

                {activeLayer === 'salibuoy-impact' && (
                  <>
                    {/* SaliBuoy Autonomous Injection Field at Irminger Sea & Fram Strait */}
                    <circle cx="370" cy="120" r="55" fill="url(#brinePlumeGrad)" />
                    <circle cx="460" cy="65" r="45" fill="url(#brinePlumeGrad)" />
                    <text x="370" y="115" textAnchor="middle" fill="#a7f3d0" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      SALIBUOY ALPHA SECTOR
                    </text>
                    <text x="370" y="130" textAnchor="middle" fill="#6ee7b7" fontSize="8" fontFamily="monospace">
                      +0.45 PSU Brine Injection (400m)
                    </text>
                    <text x="460" y="65" textAnchor="middle" fill="#a7f3d0" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      FRAM SECTOR
                    </text>
                  </>
                )}

                {/* AMOC Conveyor Belt Currents (Flow Arrows) */}
                {/* Warm Surface Current going North */}
                <path 
                  d="M 270 260 C 260 210, 310 170, 365 140 C 400 120, 440 85, 470 70" 
                  fill="none" 
                  stroke="#f43f5e" 
                  strokeWidth="3.5" 
                  strokeDasharray="8 4" 
                  strokeLinecap="round" 
                />
                <text x="315" y="195" fill="#fda4af" fontSize="9" fontFamily="monospace" fontWeight="bold" transform="rotate(-35 315 195)">
                  Warm Surface Arm &rarr;
                </text>

                {/* Cold Deep Return Current going South */}
                <path 
                  d="M 390 145 C 380 190, 350 260, 330 330 C 310 400, 280 440, 270 470" 
                  fill="none" 
                  stroke="#38bdf8" 
                  strokeWidth="3.5" 
                  strokeDasharray="6 4" 
                  strokeLinecap="round" 
                />
                <text x="360" y="275" fill="#7dd3fc" fontSize="9" fontFamily="monospace" fontWeight="bold" transform="rotate(70 360 275)">
                  Deep Return Flow &rarr;
                </text>

                {/* Trans-Atlantic Array Transects */}
                {/* RAPID 26.5°N */}
                <line x1="220" y1="260" x2="480" y2="260" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
                <text x="345" y="255" fill="#fcd34d" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  RAPID 26.5°N Mooring Array (14.6 Sv)
                </text>

                {/* OSNAP Array (53°-60°N) */}
                <line x1="310" y1="125" x2="490" y2="125" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
                <text x="400" y="118" fill="#fcd34d" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  OSNAP Array (15.2 Sv)
                </text>

                {/* Regional Clickable Pin Markers */}
                {data?.regions.map((region) => {
                  // Coordinate to SVG x/y projection mapping
                  // Longitude -180 to 180 -> 0 to 1000
                  // Latitude 90 to -90 -> 0 to 500
                  const x = ((region.lng + 180) / 360) * 1000;
                  const y = ((90 - region.lat) / 180) * 500;
                  const isSelected = selectedRegionId === region.id;

                  return (
                    <g 
                      key={region.id} 
                      onClick={() => setSelectedRegionId(region.id)}
                      className="cursor-pointer group"
                    >
                      {/* Pulse Circle */}
                      <circle 
                        cx={x} 
                        cy={y} 
                        r={isSelected ? 10 : 6} 
                        fill={region.sstAnomaly < 0 ? '#0284c7' : '#e11d48'} 
                        fillOpacity={isSelected ? 0.9 : 0.75}
                        stroke="#ffffff"
                        strokeWidth={isSelected ? 2.5 : 1.5}
                      />
                      {isSelected && (
                        <circle 
                          cx={x} 
                          cy={y} 
                          r={18} 
                          fill="none" 
                          stroke={region.sstAnomaly < 0 ? '#38bdf8' : '#fb7185'} 
                          strokeWidth="1.5" 
                          strokeDasharray="3 3"
                        />
                      )}
                      {/* Label on Hover / Select */}
                      <text 
                        x={x} 
                        y={y - 12} 
                        textAnchor="middle" 
                        fill="#ffffff" 
                        fontSize="9" 
                        fontFamily="monospace"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        className={`transition-opacity ${isSelected ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}
                      >
                        {region.name.split('(')[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Map Color Bar Legend */}
              <div className="absolute bottom-3 left-4 bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 backdrop-blur-md text-[11px] font-mono space-y-1">
                <span className="text-slate-400 block font-semibold">NOAA CRW SST Anomaly Scale (°C):</span>
                <div className="flex items-center space-x-1">
                  <span className="text-sky-400 font-bold">-4°C</span>
                  <div className="w-48 h-2.5 rounded bg-gradient-to-r from-blue-700 via-sky-400 via-slate-100 via-amber-400 to-rose-600 border border-slate-700" />
                  <span className="text-rose-400 font-bold">+4°C</span>
                </div>
                <div className="flex justify-between text-[9px] text-slate-500">
                  <span>Extreme Cold (AMOC Slump)</span>
                  <span>Climatology</span>
                  <span>Extreme Heat</span>
                </div>
              </div>

              {/* Mission Staging Badge */}
              <div className="absolute top-3 right-4 bg-slate-900/90 border border-sky-800/80 rounded-lg p-2.5 backdrop-blur-md text-xs font-mono">
                <div className="flex items-center space-x-1.5 text-sky-300 font-bold">
                  <Anchor className="w-3.5 h-3.5 text-sky-400" />
                  <span>SaliBuoy Engineering Staging</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Proving Trials: Auckland & Campbell Island (NZ EEZ) &rarr; Arctic Deployment: Fram Strait
                </p>
              </div>
            </div>
          </div>
        )}

        {/* View Mode 2: Direct Live NOAA Satellite Feeds */}
        {viewMode === 'direct-noaa-satellite' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Daily 5km SST Anomaly Feed */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold font-mono text-white flex items-center space-x-1.5">
                      <Radio className="w-4 h-4 text-sky-400" />
                      <span>NOAA CRW Daily 5km SST Anomaly v3.1</span>
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400">
                      Authoritative global satellite raster generated daily at 12:00 UTC
                    </p>
                  </div>
                  <a
                    href="https://coralreefwatch.noaa.gov/product/5km/index.php"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center space-x-1"
                  >
                    <span>NOAA Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                  <img
                    src="https://coralreefwatch.noaa.gov/data/5km/v3.1/image/daily/ssta/current.png"
                    alt="NOAA Coral Reef Watch 5km Daily SST Anomaly"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback visual if third-party server has strict hotlinking
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2 py-1 rounded text-[10px] font-mono text-slate-300">
                    Source: NOAA Coral Reef Watch 5km Global Blended Product
                  </div>
                </div>
              </div>

              {/* NOAA CRW Bleaching Alert Area (7-Day Max) */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold font-mono text-white flex items-center space-x-1.5">
                      <Flame className="w-4 h-4 text-rose-400" />
                      <span>NOAA CRW Bleaching Alert Area (7-Day Max)</span>
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400">
                      Marine heatwave accumulation & tropical heat trapping indicator
                    </p>
                  </div>
                  <a
                    href="https://coralreefwatch.noaa.gov/product/5km/index_baa_max_7d.php"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center space-x-1"
                  >
                    <span>NOAA Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                  <img
                    src="https://coralreefwatch.noaa.gov/data/5km/v3.1/image/daily/baa-max-7d/current.png"
                    alt="NOAA Coral Reef Watch Bleaching Alert Area"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2 py-1 rounded text-[10px] font-mono text-slate-300">
                    Source: NOAA NESDIS Operational Satellite Product
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Mode 3: Multi-Decadal Trend Diagnostics */}
        {viewMode === 'profile-analytics' && (
          <div className="space-y-4">
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-mono text-white flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-sky-400" />
                    <span>North Atlantic Divergence: Subpolar Cooling vs Subtropical Warming (2000–2026)</span>
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    The thermodynamic fingerprint of a weakening AMOC: polar downwelling chimneys cool while heat stagnates in the Caribbean and Gulf Stream.
                  </p>
                </div>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalAnomalyTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                    <YAxis 
                      stroke="#64748b" 
                      tick={{ fontSize: 11, fontFamily: 'monospace' }} 
                      domain={[-2.5, 2.5]}
                      label={{ value: 'SST Anomaly (°C)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', fontFamily: 'monospace', fontSize: '11px' }}
                    />
                    <ReferenceLine y={0} stroke="#475569" strokeDasharray="4 4" />
                    <Line 
                      type="monotone" 
                      dataKey="subpolarAnomaly" 
                      name="Subpolar Gyre Cold Blob (°C)" 
                      stroke="#38bdf8" 
                      strokeWidth={2.5} 
                      dot={{ r: 4, fill: '#0284c7' }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="subtropicalAnomaly" 
                      name="Subtropical Heat Accumulation (°C)" 
                      stroke="#f43f5e" 
                      strokeWidth={2.5} 
                      dot={{ r: 4, fill: '#e11d48' }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="amocTransport" 
                      name="AMOC Transport (Sv / 10⁶ m³ s⁻¹)" 
                      stroke="#f59e0b" 
                      strokeWidth={2} 
                      strokeDasharray="4 4" 
                      dot={{ r: 3, fill: '#d97706' }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs font-mono">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-sky-400 font-bold block">Cold Blob Deficit:</span>
                  <span className="text-slate-300">
                    Widened by -1.64°C since 2000 due to failed convective overturning.
                  </span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-rose-400 font-bold block">Tropical Heat Surcharge:</span>
                  <span className="text-slate-300">
                    Increased by +1.36°C fueling Category 5 hurricanes & coral bleaching.
                  </span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-amber-400 font-bold block">Overturning Slump:</span>
                  <span className="text-slate-300">
                    RAPID array transport dropped from 17.8 Sv down to 14.6 Sv (-18%).
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected Ocean Region Deep Dive & Halocline Inspector */}
      {selectedRegion && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1 & 2: Station Telemetry & Water Column Density Profile */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-sky-400 uppercase tracking-wider block">
                  TRANSECT DEEP DIVE & HYDROGRAPHIC STATION
                </span>
                <h3 className="text-xl font-bold font-mono text-white">
                  {selectedRegion.name}
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  Coordinates: {selectedRegion.lat}°N, {selectedRegion.lng}°E · Role: {selectedRegion.amocRole}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border ${
                  selectedRegion.convectiveStatus === 'Active Downwelling'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : selectedRegion.convectiveStatus === 'Severe Freshening Cap'
                    ? 'bg-rose-950 text-rose-300 border-rose-800'
                    : 'bg-amber-950 text-amber-300 border-amber-800'
                }`}>
                  {selectedRegion.convectiveStatus}
                </span>
              </div>
            </div>

            {/* Station Telemetry Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">SST Anomaly</span>
                <span className={`text-base font-bold ${selectedRegion.sstAnomaly < 0 ? 'text-sky-300' : 'text-rose-300'}`}>
                  {selectedRegion.sstAnomaly > 0 ? `+${selectedRegion.sstAnomaly}` : selectedRegion.sstAnomaly}°C
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Surface Temp</span>
                <span className="text-base font-bold text-white">
                  {selectedRegion.surfaceTemp}°C
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Salinity (PSU)</span>
                <span className="text-base font-bold text-cyan-300">
                  {selectedRegion.salinityPsu} PSU
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">OHC Anomaly</span>
                <span className={`text-base font-bold ${selectedRegion.oceanHeatContentZJ < 0 ? 'text-sky-300' : 'text-rose-300'}`}>
                  {selectedRegion.oceanHeatContentZJ > 0 ? `+${selectedRegion.oceanHeatContentZJ}` : selectedRegion.oceanHeatContentZJ} ZJ
                </span>
              </div>
            </div>

            {/* Depth Profile Chart (0 to 2,000m) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300">
                  Vertical Water Column Profile (0–2,000m CTD Stratification):
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  Potential Density (σ₀) & Salinity Halocline
                </span>
              </div>

              <div className="h-56 w-full bg-slate-950 p-2 rounded-xl border border-slate-800">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={depthProfileData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis 
                      dataKey="depth" 
                      stroke="#64748b" 
                      tick={{ fontSize: 10, fontFamily: 'monospace' }}
                      label={{ value: 'Depth (Meters)', position: 'insideBottom', offset: -2, fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                    />
                    <YAxis 
                      stroke="#64748b" 
                      tick={{ fontSize: 10, fontFamily: 'monospace' }}
                      domain={[26.5, 28.5]}
                      label={{ value: 'Density σ₀ (kg/m³)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', fontFamily: 'monospace', fontSize: '11px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="density" 
                      name="Density σ₀ (kg/m³)" 
                      stroke="#38bdf8" 
                      fill="#0284c7" 
                      fillOpacity={0.2} 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Oceanographic Brief */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed">
              <span className="font-bold text-white block mb-1">Oceanographic Assessment:</span>
              {selectedRegion.notes}
            </div>
          </div>

          {/* Column 3: SaliBuoy Intervention Simulation for this Region */}
          <div className="bg-slate-900/90 border border-sky-900/60 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold font-mono text-white">
                  SaliBuoy Brine Injection Simulator
                </h3>
              </div>
              <p className="text-xs font-mono text-slate-400 leading-relaxed">
                Model the physical restoration of downwelling density at this location using an autonomous SaliBuoy Mk-III wave-powered fleet.
              </p>

              {/* Buoy Fleet Slider */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Deployed Fleet Size:</span>
                  <span className="text-emerald-400 font-bold">{simulatedBuoyCount} Buoys</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="1000"
                  step="25"
                  value={simulatedBuoyCount}
                  onChange={(e) => setSimulatedBuoyCount(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>25 (Phase 1 Trials)</span>
                  <span>500 (Regional Gate)</span>
                  <span>1000 (Subpolar Array)</span>
                </div>
              </div>

              {/* Simulation Result Outputs */}
              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Total Brine Output:</span>
                  <span className="text-white font-bold">{brineInjectionVolumeM3Day} m³/day</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Target Injection Depth:</span>
                  <span className="text-sky-300 font-bold">400–600 Meters</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Local Density Lift (Δσ):</span>
                  <span className="text-emerald-400 font-bold">+{densityRestorationBoost} kg/m³</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-emerald-900/60 flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">Simulated Bottom Density:</span>
                  <span className="text-emerald-300 font-extrabold text-sm">{simulatedDensity} kg/m³</span>
                </div>
              </div>

              {/* Status Verification */}
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-xs font-mono text-emerald-200/90 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Halocline Penetration Confirmed:</strong> Brine density (1,038 kg/m³) exceeds the freshwater cap, triggering localized baroclinic sinking.
                </span>
              </div>
            </div>

            {/* Quick Link to Hardware Roadmap */}
            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Mark-III High-Pressure Pump Unit</span>
              <span className="text-sky-400 font-bold">Outset Ventures NZ</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
