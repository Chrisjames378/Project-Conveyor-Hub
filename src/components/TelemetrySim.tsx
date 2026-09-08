import React, { useState, useEffect } from 'react';
import { TelemetryBuoy } from '../types';
import { INITIAL_TELEMETRY_BUOYS } from '../db/localDatabase';
import { 
  Activity, 
  Radio, 
  Zap, 
  BatteryCharging, 
  Compass, 
  Waves, 
  Play, 
  Pause,
  Download,
  TrendingUp,
  BarChart3,
  Cloud,
  Check,
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line, 
  ComposedChart, 
  Bar 
} from 'recharts';
import { downloadFile } from '../utils/exportUtils';
import { microsoftGraphService } from '../services/microsoftGraphService';

// Mock 24-Hour Historical Sensor Data for Recharts
const MOCK_HISTORICAL_TELEMETRY = [
  { time: '00:00', ambientPsu: 35.1, injectedPsu: 41.2, waveWatts: 180, batteryPct: 82, depthTempC: 16.8 },
  { time: '03:00', ambientPsu: 35.0, injectedPsu: 41.8, waveWatts: 240, batteryPct: 85, depthTempC: 16.5 },
  { time: '06:00', ambientPsu: 35.2, injectedPsu: 42.5, waveWatts: 310, batteryPct: 90, depthTempC: 16.2 },
  { time: '09:00', ambientPsu: 35.1, injectedPsu: 43.1, waveWatts: 380, batteryPct: 94, depthTempC: 16.0 },
  { time: '12:00', ambientPsu: 35.0, injectedPsu: 44.2, waveWatts: 420, batteryPct: 98, depthTempC: 15.8 },
  { time: '15:00', ambientPsu: 35.1, injectedPsu: 43.8, waveWatts: 390, batteryPct: 96, depthTempC: 16.1 },
  { time: '18:00', ambientPsu: 35.2, injectedPsu: 42.9, waveWatts: 280, batteryPct: 91, depthTempC: 16.4 },
  { time: '21:00', ambientPsu: 35.0, injectedPsu: 42.1, waveWatts: 210, batteryPct: 87, depthTempC: 16.6 },
];

export const TelemetrySim: React.FC = () => {
  const [buoys, setBuoys] = useState<TelemetryBuoy[]>(INITIAL_TELEMETRY_BUOYS);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [selectedBuoyId, setSelectedBuoyId] = useState<string>('buoy-101');
  const [telemetryHistory, setTelemetryHistory] = useState(MOCK_HISTORICAL_TELEMETRY);

  // Live simulation tick every 3 seconds
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setBuoys(prevBuoys => prevBuoys.map(b => {
        if (b.status !== 'Operational') return b;
        
        const salinityDelta = (Math.random() - 0.5) * 0.2;
        const tempDelta = (Math.random() - 0.5) * 0.1;
        const waveDelta = Math.floor((Math.random() - 0.5) * 15);

        return {
          ...b,
          salinityPsu: Number(Math.max(34, Math.min(48, b.salinityPsu + salinityDelta)).toFixed(2)),
          ambientTempC: Number((b.ambientTempC + tempDelta).toFixed(1)),
          wavePowerWatts: Math.max(50, b.wavePowerWatts + waveDelta),
          lastPing: 'Just now'
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  const activeBuoy = buoys.find(b => b.id === selectedBuoyId) || buoys[0];

  const toggleBuoyMode = (id: string, newStatus: TelemetryBuoy['status']) => {
    setBuoys(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const triggerBrinePulse = (id: string) => {
    setBuoys(prev => prev.map(b => {
      if (b.id === id) {
        return {
          ...b,
          salinityPsu: Number((b.salinityPsu + 1.8).toFixed(2)),
          pumpRateLpM: Math.min(220, b.pumpRateLpM + 30)
        };
      }
      return b;
    }));
  };

  const [isUploadingOneDrive, setIsUploadingOneDrive] = useState(false);
  const [oneDriveStatus, setOneDriveStatus] = useState<string | null>(null);

  const exportTelemetryCSV = () => {
    const headers = ['Time', 'Ambient Salinity (PSU)', 'Injected Salinity (PSU)', 'Wave Power (Watts)', 'Battery (%)', 'Depth Temp (C)'];
    const rows = telemetryHistory.map(row => [row.time, row.ambientPsu, row.injectedPsu, row.waveWatts, row.batteryPct, row.depthTempC].join(','));
    const csvContent = [headers.join(','), ...rows].join('\n');
    downloadFile(csvContent, `${activeBuoy.name.replace(/\s+/g, '_')}_Telemetry_Data.csv`, 'text/csv');
  };

  const exportTelemetryToOneDrive = async () => {
    setIsUploadingOneDrive(true);
    setOneDriveStatus('Uploading telemetry CSV to OneDrive (Pukekohe_Telemetry_Logs)...');
    try {
      const headers = ['Time', 'Ambient Salinity (PSU)', 'Injected Salinity (PSU)', 'Wave Power (Watts)', 'Battery (%)', 'Depth Temp (C)'];
      const rows = telemetryHistory.map(row => [row.time, row.ambientPsu, row.injectedPsu, row.waveWatts, row.batteryPct, row.depthTempC].join(','));
      const csvContent = [headers.join(','), ...rows].join('\n');

      if (!microsoftGraphService.isAuthenticated()) {
        await microsoftGraphService.login();
      }

      const fileName = `${activeBuoy.name.replace(/\s+/g, '_')}_Telemetry_${new Date().toISOString().split('T')[0]}.csv`;
      await microsoftGraphService.uploadFile(
        fileName,
        csvContent,
        'text/csv',
        'Pukekohe_Telemetry_Logs'
      );

      setOneDriveStatus(`Saved ${fileName} to OneDrive folder 'Pukekohe_Telemetry_Logs'!`);
    } catch (err: any) {
      console.error('OneDrive telemetry save error:', err);
      setOneDriveStatus('Failed to upload telemetry to OneDrive.');
    } finally {
      setIsUploadingOneDrive(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-400">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Iridium Satellite Telemetry Feed • Pukekohe Engineering Hub</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
              Subsurface Buoy Fleet Telemetry Simulator
            </h2>
            <p className="text-xs text-slate-400">
              Real-time oceanic sensor telemetry tracking salinity diffusion (PSU), wave energy harvesting, and downwelling pump diagnostics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              onClick={exportTelemetryToOneDrive}
              disabled={isUploadingOneDrive}
              className="inline-flex items-center space-x-2 px-3.5 py-2 bg-sky-950 hover:bg-sky-900 text-sky-200 border border-sky-800 rounded-xl text-xs font-mono font-bold cursor-pointer transition-colors"
            >
              {isUploadingOneDrive ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
              ) : (
                <Cloud className="w-3.5 h-3.5 text-sky-400" />
              )}
              <span>OneDrive CSV (Pukekohe_Telemetry_Logs)</span>
            </button>

            <button
              onClick={exportTelemetryCSV}
              className="inline-flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-mono cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                isLiveStreaming
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {isLiveStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isLiveStreaming ? 'Streaming Live Data' : 'Paused'}</span>
            </button>
          </div>
        </div>

        {oneDriveStatus && (
          <div className="p-3 bg-slate-950 border border-sky-800/80 rounded-xl flex items-center justify-between font-mono text-xs text-sky-300">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{oneDriveStatus}</span>
            </div>
            <a
              href="https://onedrive.live.com"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 underline font-bold text-[11px]"
            >
              Open OneDrive (salibuoy.systems@outlook.com) ↗
            </a>
          </div>
        )}
      </div>

      {/* Buoy Select Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {buoys.map((b) => {
          const isSelected = b.id === selectedBuoyId;
          return (
            <div
              key={b.id}
              onClick={() => setSelectedBuoyId(b.id)}
              className={`bg-slate-900/90 border rounded-xl p-4 space-y-3 cursor-pointer transition-all ${
                isSelected 
                  ? 'border-sky-500 bg-sky-950/20 shadow-lg shadow-sky-950/50' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">ID: {b.id}</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  b.status === 'Operational'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  {b.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-sm leading-tight">{b.name}</h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{b.location}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
                <div className="bg-slate-950 p-2 rounded border border-slate-800/80">
                  <span className="text-slate-500 block">Salinity</span>
                  <span className="text-teal-300 font-bold">{b.salinityPsu} PSU</span>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800/80">
                  <span className="text-slate-500 block">Wave Power</span>
                  <span className="text-amber-300 font-bold">{b.wavePowerWatts}W</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Buoy Deep Telemetry View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Ocean Telemetry Panel */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-sky-400">Iridium SBD Modem Active</span>
              <h3 className="text-xl font-bold text-white mt-0.5">{activeBuoy.name}</h3>
              <p className="text-xs text-slate-400 font-mono">{activeBuoy.location}</p>
            </div>

            <div className="text-right font-mono text-xs">
              <span className="text-slate-400 block">Coordinates</span>
              <span className="text-slate-200 font-bold">{activeBuoy.coordinates.lat}°S, {activeBuoy.coordinates.lng}°E</span>
            </div>
          </div>

          {/* Telemetry Gauge Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-teal-900/60 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Salinity Level</span>
              <div className="text-2xl font-extrabold text-teal-300 font-mono">{activeBuoy.salinityPsu} <span className="text-xs font-normal">PSU</span></div>
              <p className="text-[10px] text-teal-400 font-mono">+6.2 PSU above ambient</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-sky-900/60 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Pump Injection Rate</span>
              <div className="text-2xl font-extrabold text-sky-300 font-mono">{activeBuoy.pumpRateLpM} <span className="text-xs font-normal">L/min</span></div>
              <p className="text-[10px] text-sky-400 font-mono">Ceramic impeller active</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-amber-900/60 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Wave Energy Harvested</span>
              <div className="text-2xl font-extrabold text-amber-300 font-mono">{activeBuoy.wavePowerWatts} <span className="text-xs font-normal">Watts</span></div>
              <p className="text-[10px] text-amber-400 font-mono">Piezo-Float kinetic</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/60 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Battery System</span>
              <div className="text-2xl font-extrabold text-emerald-300 font-mono">{activeBuoy.batteryPct}%</div>
              <p className="text-[10px] text-emerald-400 font-mono">24V 2.4kWh LiFePO4</p>
            </div>
          </div>

          {/* Recharts 24-Hour Salinity Time Series */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center space-x-1.5">
                <BarChart3 className="w-4 h-4 text-teal-400" />
                <span>24-Hour Salinity Injection Profile (PSU)</span>
              </span>
              <span className="text-[11px] font-mono text-teal-300">Ambient (35.0) vs Injected (42.0+)</span>
            </div>

            <div className="h-60 w-full bg-slate-950 p-3 rounded-xl border border-slate-800">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetryHistory}>
                  <defs>
                    <linearGradient id="injectedColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="ambientColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontFamily="monospace" />
                  <YAxis domain={[30, 50]} stroke="#64748b" fontSize={11} fontFamily="monospace" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Area type="monotone" dataKey="injectedPsu" name="Injected Brine PSU" stroke="#14b8a6" fillOpacity={1} fill="url(#injectedColor)" strokeWidth={2} />
                  <Area type="monotone" dataKey="ambientPsu" name="Ambient Salinity PSU" stroke="#38bdf8" fillOpacity={1} fill="url(#ambientColor)" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Manual Telemetry Override Controls */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">Remote Buoy Control Commands</h4>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => triggerBrinePulse(activeBuoy.id)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Trigger High-Density Brine Injection Pulse (+1.8 PSU)
              </button>

              <button
                onClick={() => toggleBuoyMode(activeBuoy.id, activeBuoy.status === 'Operational' ? 'Standby' : 'Operational')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition-colors cursor-pointer"
              >
                Toggle Operational / Standby Mode
              </button>
            </div>
          </div>
        </div>

        {/* Ocean Radar Simulation */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">Buoy Ocean Position Radar</h3>
            <p className="text-xs text-slate-400">Simulated subsea sonar ping & GPS tracking</p>
          </div>

          <div className="relative w-full aspect-square max-w-[280px] mx-auto rounded-full bg-slate-950 border-2 border-sky-800/60 flex items-center justify-center overflow-hidden shadow-inner">
            {/* Radar Sweep Animation Line */}
            <div className="absolute inset-0 rounded-full border border-sky-500/20"></div>
            <div className="absolute inset-8 rounded-full border border-sky-500/20"></div>
            <div className="absolute inset-16 rounded-full border border-sky-500/20"></div>
            
            <div className="absolute w-full h-[1px] bg-sky-800/50"></div>
            <div className="absolute h-full w-[1px] bg-sky-800/50"></div>

            {/* Radar Sweeping Beam */}
            <div className="absolute w-full h-full rounded-full radar-sweep bg-gradient-to-tr from-transparent via-transparent to-sky-500/30"></div>

            {/* Buoy Marker Pin */}
            <div className="relative z-10 w-3 h-3 rounded-full bg-sky-400 animate-ping"></div>
            <div className="relative z-10 w-3 h-3 rounded-full bg-sky-400 border border-white"></div>
          </div>

          <div className="text-[11px] font-mono text-slate-400 space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between">
              <span>SatLink Protocol:</span>
              <span className="text-emerald-400 font-bold">Iridium SBD 1.2</span>
            </div>
            <div className="flex justify-between">
              <span>Ping Interval:</span>
              <span className="text-slate-200">180 seconds</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
