import { useMemo, useState, useEffect } from 'react';
import {
  Globe,
  Activity,
  Wind,
  Droplets,
  ThermometerSnowflake,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Download,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { TelemetryState } from '../types';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface FleetCommandProps {
  telemetry: TelemetryState;
  activeBuoys: number;
}

const RECOVERY_DATA = [
  { year: 2026, amocStrength: 10.2, projected: 10.2 },
  { year: 2028, amocStrength: 9.8, projected: 11.5 },
  { year: 2030, amocStrength: null, projected: 13.8 },
  { year: 2035, amocStrength: null, projected: 16.4 },
  { year: 2040, amocStrength: null, projected: 17.5 },
  { year: 2050, amocStrength: null, projected: 18.2 },
];

export default function FleetCommand({ telemetry, activeBuoys }: FleetCommandProps) {
  const [diagnosticState, setDiagnosticState] = useState<'idle' | 'running' | 'complete'>('idle');
  const [diagnosticProgress, setDiagnosticProgress] = useState(0);

  useEffect(() => {
    let interval: number;
    if (diagnosticState === 'running') {
      interval = window.setInterval(() => {
        setDiagnosticProgress(prev => {
          if (prev >= 100) {
            setDiagnosticState('complete');
            return 100;
          }
          return prev + (Math.random() * 15);
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [diagnosticState]);

  const handleRunDiagnostic = () => {
    if (diagnosticState === 'idle') {
      setDiagnosticState('running');
      setDiagnosticProgress(0);
    }
  };

  const totalSverdrups = (telemetry.sverdrups * activeBuoys).toFixed(2);
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => setExporting(false), 1500);
  };

  // Generate random buoy locations for the map once complete
  const simulatedLocations = useMemo(() => {
    if (diagnosticState !== 'complete') return [];
    const locations = [];
    for (let i = 0; i < Math.min(activeBuoys, 50); i++) {
      locations.push({
        id: i,
        lon: -60 + Math.random() * 80, // North Atlantic cluster
        lat: 30 + Math.random() * 40,
        delay: Math.random() * 2,
      });
    }
    return locations;
  }, [diagnosticState, activeBuoys]);

  return (
    <div className="space-y-5 max-w-6xl w-full mx-auto">
      {/* Global Command Header */}
      <div className="bg-slate-950 border border-slate-600 p-5 rounded-lg shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="relative z-10">
          <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-400 uppercase tracking-widest mb-2">
            <Globe className="w-4 h-4 text-emerald-400 animate-pulse" />
            FLEET COMMAND & DEPLOYMENT ANALYTICS
          </div>
          <h3 className="font-display text-xl font-bold text-slate-100 tracking-tight uppercase mb-3">
            Global AMOC Recovery Matrix
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-3xl">
            Real-time oversight of the decentralized Sali-Buoy mesh network. Monitor live structural telemetry, global aggregate downwelling volume, and projected long-term climatic stabilization outcomes based on active fleet size.
          </p>
        </div>
        
        <button
          onClick={handleExport}
          disabled={exporting}
          className="relative z-10 shrink-0 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-600 text-sky-400 font-mono text-[10px] uppercase font-bold px-4 py-2 rounded transition-all"
        >
          {exporting ? (
            <>
              <span className="w-3.5 h-3.5 rounded-full border-2 border-sky-400/30 border-t-sky-400 animate-spin" />
              Compiling...
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              Export Fleet Report
            </>
          )}
        </button>

        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Live Analytics & Global Map */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Recovery Projection Chart */}
          <div className="bg-slate-950 border border-slate-600 p-5 rounded-lg shadow-xl">
            <div className="font-mono text-[9px] text-sky-400 uppercase tracking-widest mb-4">
              Projected AMOC Strength (Sverdrups)
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={RECOVERY_DATA}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis 
                    dataKey="year" 
                    stroke="#64748b" 
                    tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} 
                  />
                  <YAxis 
                    stroke="#64748b" 
                    tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                    domain={[8, 20]}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#475569', fontSize: '11px', fontFamily: 'monospace' }}
                    itemStyle={{ color: '#38bdf8' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="projected"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorProjected)"
                    name="Projected Recovery (Sv)"
                  />
                  <Area
                    type="monotone"
                    dataKey="amocStrength"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fill="none"
                    name="Historical Baseline"
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Interactive Global Map */}
          <div className="bg-slate-950 border border-slate-600 rounded-lg p-0 flex-1 shadow-xl relative min-h-[300px] overflow-hidden flex flex-col justify-center items-center">
            {diagnosticState === 'idle' && (
              <div className="absolute inset-0 z-10 flex flex-col justify-center items-center bg-slate-950/80 backdrop-blur-sm space-y-4">
                 <Globe className="w-12 h-12 text-slate-700 animate-[spin_120s_linear_infinite]" />
                 <div className="font-mono text-[10px] text-slate-400 tracking-widest uppercase">
                   Global Array Positioning Interface Offline
                 </div>
                 <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded text-xs font-mono text-amber-500">
                   Awaiting Fleet Mesh Synchronization
                 </div>
              </div>
            )}

            {diagnosticState === 'running' && (
              <div className="absolute inset-0 z-10 flex flex-col justify-center items-center bg-slate-950/80 backdrop-blur-sm space-y-4">
                 <Globe className="w-12 h-12 text-sky-500/50 animate-[spin_2s_linear_infinite]" />
                 <div className="font-mono text-[10px] text-sky-400 tracking-widest uppercase animate-pulse">
                   Synchronizing Mesh Network...
                 </div>
                 <div className="w-full max-w-sm bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-700">
                   <div 
                     className="bg-sky-500 h-full transition-all duration-300 ease-out" 
                     style={{ width: `${Math.min(diagnosticProgress, 100)}%` }}
                   />
                 </div>
              </div>
            )}

            {diagnosticState === 'complete' && (
              <div className="absolute top-4 left-4 z-10 font-mono text-[10px] text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mesh Network Synchronized
              </div>
            )}

            {/* The Map itself */}
            <div className="w-full h-full min-h-[350px] relative pointer-events-none md:pointer-events-auto">
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  scale: 120,
                }}
                className="w-full h-full"
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#0f172a"
                        stroke="#334155"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: 'none' },
                          hover: { fill: '#1e293b', outline: 'none' },
                          pressed: { outline: 'none' },
                        }}
                      />
                    ))
                  }
                </Geographies>

                {diagnosticState === 'complete' && simulatedLocations.map((loc) => (
                  <Marker key={loc.id} coordinates={[loc.lon, loc.lat]}>
                    <g className="group cursor-pointer">
                      <circle 
                        r={2.5} 
                        fill="#10b981" 
                        className="animate-pulse" 
                        style={{ animationDelay: `${loc.delay}s` }} 
                      />
                      <circle 
                        r={6} 
                        fill="none" 
                        stroke="#059669" 
                        strokeWidth={1}
                        className="animate-ping opacity-75"
                        style={{ animationDelay: `${loc.delay}s` }}
                      />
                    </g>
                  </Marker>
                ))}
              </ComposableMap>
            </div>
          </div>
        </div>

        {/* Right Column: Fleet Metrics */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <div className="bg-slate-950 border border-slate-600 rounded-lg p-4 shadow-xl">
            <h4 className="font-display text-xs font-bold text-slate-100 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
              Aggregate Array Telemetry
            </h4>
            
            <div className="space-y-4 font-mono">
              <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase block mb-1">Active Modules</span>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Activity className="w-3.5 h-3.5" />
                    <span className="text-lg font-bold">{activeBuoys}</span>
                  </div>
                </div>
                <span className="text-[9px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  ONLINE
                </span>
              </div>

              <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase block mb-1">Total Downwelling</span>
                  <div className="flex items-center gap-1.5 text-sky-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="text-lg font-bold">{totalSverdrups} Sv</span>
                  </div>
                </div>
                <span className="text-[9px] text-sky-400/60">
                  {telemetry.sverdrups} Sv/unit
                </span>
              </div>

              <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase block mb-1">Array Avg Salinity</span>
                  <div className="flex items-center gap-1.5 text-indigo-400">
                    <Droplets className="w-3.5 h-3.5" />
                    <span className="text-lg font-bold">{telemetry.salinity} PSU</span>
                  </div>
                </div>
                <span className="text-[9px] text-indigo-400/60">
                  High Density
                </span>
              </div>

              <div className="flex justify-between items-end pb-1">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase block mb-1">Array Avg Core Temp</span>
                  <div className="flex items-center gap-1.5 text-rose-400">
                    <ThermometerSnowflake className="w-3.5 h-3.5" />
                    <span className="text-lg font-bold">{telemetry.temperature}°C</span>
                  </div>
                </div>
                <span className="text-[9px] text-rose-400/60">
                  Nominal
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-lg p-4 shadow-xl">
             <div className="font-mono text-[9px] text-emerald-400 uppercase tracking-widest mb-2">
               Operational Status
             </div>
             <div className="text-xs font-sans text-slate-300 leading-relaxed mb-4">
               {diagnosticState === 'complete' 
                 ? "All array modules successfully synchronized. Telemetry and structural integrity confirmed across the mesh network." 
                 : "The array is currently maintaining a stable configuration. Real-time telemetry indicates optimal vortex consolidation ratios across all deployed assets."}
             </div>
             <button 
               onClick={handleRunDiagnostic}
               disabled={diagnosticState !== 'idle'}
               className={`w-full font-mono text-[10px] uppercase font-bold py-2 rounded transition-colors ${
                 diagnosticState === 'idle' 
                   ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/50 text-emerald-400' 
                   : diagnosticState === 'running'
                     ? 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
                     : 'bg-emerald-500/20 border border-emerald-500/80 text-emerald-300 cursor-default'
               }`}
             >
               {diagnosticState === 'idle' && "Run Mesh Diagnostic"}
               {diagnosticState === 'running' && `Synchronizing (${Math.min(Math.round(diagnosticProgress), 100)}%)...`}
               {diagnosticState === 'complete' && "Diagnostic Complete"}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
