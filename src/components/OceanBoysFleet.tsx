import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  Waves, 
  Activity, 
  Eye, 
  Zap, 
  Battery, 
  Compass, 
  Smartphone, 
  RefreshCw, 
  Download, 
  Layers, 
  Filter, 
  Search, 
  Sliders, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Globe2, 
  Anchor,
  Sparkles,
  Maximize2,
  Play,
  Pause,
  LayoutGrid,
  Tv,
  List,
  Server,
  Wifi,
  Gauge,
  Terminal,
  FastForward,
  RotateCcw,
  Bell,
  MapPin,
  Navigation,
  Wind
} from 'lucide-react';
import { INITIAL_OCEAN_BOYS, SATELLITE_CONSTELLATIONS } from '../db/oceanBoysFleet';
import { OceanBoy, SatelliteFrame } from '../types';
import { OppoA6xTerminalModal } from './OppoA6xTerminalModal';
import { OceanBoysTrajectoryMapOverlay } from './OceanBoysTrajectoryMapOverlay';
import { SmsAlertsModal } from './SmsAlertsModal';
import { WeatherPollution3DModel } from './WeatherPollution3DModel';
import { downloadFile } from '../utils/exportUtils';
import { 
  pollSatelliteNetwork, 
  PollingNetworkStats, 
  DownlinkEventLog 
} from '../services/satellitePollingService';

export function OceanBoysFleet() {
  const [buoys, setBuoys] = useState<OceanBoy[]>(INITIAL_OCEAN_BOYS);
  const [selectedBuoyId, setSelectedBuoyId] = useState<string>('ocean-boy-1');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Dashboard Visual View Modes:
  // 'matrix' = Live multi-stream visual wall of all 23 buoys
  // 'recon' = Deep Recon single buoy multispectral studio & filmstrip
  // 'trajectory-map' = Interactive ocean current drift and predicted trajectory map overlay
  // 'weather-3d' = Real-time weather pattern 3D model and CO2 / Methane pollution report
  // 'logs' = Live downlink stream telemetry & constellation console
  const [dashboardView, setDashboardView] = useState<'matrix' | 'recon' | 'trajectory-map' | 'weather-3d' | 'logs'>('matrix');
  const [matrixGridCols, setMatrixGridCols] = useState<'compact' | 'standard' | 'large'>('standard');

  // Real-Time Polling Engine State
  const [isPollingActive, setIsPollingActive] = useState<boolean>(true);
  const [pollingIntervalSec, setPollingIntervalSec] = useState<number>(5);
  const [pollingCountdown, setPollingCountdown] = useState<number>(5);
  const [pollCycleCount, setPollCycleCount] = useState<number>(1);
  const [isPollingInProgress, setIsPollingInProgress] = useState<boolean>(false);
  const [recentlyUpdatedBuoyIds, setRecentlyUpdatedBuoyIds] = useState<Set<string>>(new Set());
  const [audioPingsEnabled, setAudioPingsEnabled] = useState<boolean>(true);
  const [isSmsAlertsOpen, setIsSmsAlertsOpen] = useState<boolean>(false);

  // Network Telemetry Stats
  const [networkStats, setNetworkStats] = useState<PollingNetworkStats>({
    meanLatencyMs: 14.2,
    downlinkBandwidthKbps: 2450,
    packetsDelivered: 23,
    packetLossPct: 0.0,
    groundStationsLocked: ["Warkworth NZ", "Awarua Southland NZ", "Canberra DSS-43", "Hawaii Koko Head"],
    lastPollUtc: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    pollCycle: 1,
    activeConstellations: ["Himawari-9", "NOAA GOES-18", "Sentinel-3A", "Sentinel-2B", "Aqua MODIS"]
  });

  // Downlink Stream Event Logs
  const [downlinkLogs, setDownlinkLogs] = useState<DownlinkEventLog[]>([
    {
      id: 'LOG-INIT-1',
      timestamp: new Date().toLocaleTimeString(),
      satellite: 'Himawari-9',
      buoyNickname: 'Ocean Boy #1 - Hauraki Sentinel',
      channel: 'AHI Band 13 (Clean IR 10.4µm)',
      frameSizeKb: 1540,
      latencyMs: 14,
      status: 'DOWNWELLING_PLUME'
    },
    {
      id: 'LOG-INIT-2',
      timestamp: new Date(Date.now() - 3000).toLocaleTimeString(),
      satellite: 'NOAA GOES-18',
      buoyNickname: 'Ocean Boy #4 - Kermadec Abyssal',
      channel: 'ABI Band 8 (Water Vapor)',
      frameSizeKb: 1480,
      latencyMs: 16,
      status: 'SUCCESS'
    },
    {
      id: 'LOG-INIT-3',
      timestamp: new Date(Date.now() - 6000).toLocaleTimeString(),
      satellite: 'Sentinel-3A',
      buoyNickname: 'Ocean Boy #3 - North Cape Deep Diver',
      channel: 'OLCI Multispectral RGB 8-6-4',
      frameSizeKb: 1610,
      latencyMs: 12,
      status: 'OPTIMAL'
    }
  ]);

  // Satellite Studio State for Buoys
  const [selectedSpectralBand, setSelectedSpectralBand] = useState<'clean-ir' | 'visible' | 'water-vapor' | 'ocean-color' | 'sst' | 'sar-radar'>('clean-ir');
  const [satZoom, setSatZoom] = useState<number>(1.0);
  const [satContrast, setSatContrast] = useState<number>(1.2);
  const [satBrightness, setSatBrightness] = useState<number>(1.05);
  const [showRadarGrid, setShowRadarGrid] = useState<boolean>(true);
  const [radarSweepAngle, setRadarSweepAngle] = useState<number>(0);

  // Time-Lapse Filmstrip Playback State
  const [activeFrameIndex, setActiveFrameIndex] = useState<number>(0);
  const [isPlayingFilmstrip, setIsPlayingFilmstrip] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Auto Patrol / Focus Cycle Mode across the Fleet
  const [isPatrolCycleActive, setIsPatrolCycleActive] = useState<boolean>(false);

  // Oppo A5x Simulator Modal State
  const [isOppoModalOpen, setIsOppoModalOpen] = useState<boolean>(false);
  const [activeBuoyForOppo, setActiveBuoyForOppo] = useState<string>('ocean-boy-1');

  // Pulse Feedback state
  const [pulsingBuoyId, setPulsingBuoyId] = useState<string | null>(null);

  // Radar Sweep Animation
  useEffect(() => {
    if (!isPollingActive) return;
    const interval = setInterval(() => {
      setRadarSweepAngle(prev => (prev + 4) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isPollingActive]);

  // Audio Sonar Chirp
  const playSonarChirp = (frequency = 880) => {
    if (!audioPingsEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.5, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio fallback
    }
  };

  // EXECUTE LIVE SATELLITE POLLING (Fetches dynamic frames for ALL 23 deployed buoys)
  const triggerPollSync = async (forcedCycle?: number) => {
    if (isPollingInProgress) return;
    setIsPollingInProgress(true);

    const cycle = forcedCycle !== undefined ? forcedCycle : pollCycleCount;

    try {
      const { updatedBuoys, networkStats: newStats, logEntry } = await pollSatelliteNetwork(
        buoys,
        cycle,
        selectedSpectralBand
      );

      setBuoys(updatedBuoys);
      setNetworkStats(newStats);
      setPollCycleCount(prev => prev + 1);

      // Flash visual updates on updated buoy cards
      const updatedIds = new Set(updatedBuoys.map(b => b.id));
      setRecentlyUpdatedBuoyIds(updatedIds);
      setTimeout(() => {
        setRecentlyUpdatedBuoyIds(new Set());
      }, 1400);

      // Add to downlink stream log
      setDownlinkLogs(prev => [logEntry, ...prev.slice(0, 19)]);

      // Sonar feedback on frame ingestion
      playSonarChirp(840 + Math.random() * 180);
    } catch (err) {
      console.error("Polling stream sync error:", err);
    } finally {
      setIsPollingInProgress(false);
      setPollingCountdown(pollingIntervalSec);
    }
  };

  // Polling Mechanism Timer
  useEffect(() => {
    if (!isPollingActive) return;

    const timer = setInterval(() => {
      setPollingCountdown(prev => {
        if (prev <= 1) {
          triggerPollSync();
          return pollingIntervalSec;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPollingActive, pollingIntervalSec, buoys, pollCycleCount, selectedSpectralBand, isPollingInProgress]);

  // Patrol Cycle: Rotates focused buoy every 7 seconds if active
  useEffect(() => {
    if (!isPatrolCycleActive) return;

    const patrolTimer = setInterval(() => {
      setBuoys(currentBuoys => {
        setSelectedBuoyId(currentId => {
          const currentIndex = currentBuoys.findIndex(b => b.id === currentId);
          const nextIndex = (currentIndex + 1) % currentBuoys.length;
          return currentBuoys[nextIndex].id;
        });
        return currentBuoys;
      });
    }, 7000);

    return () => clearInterval(patrolTimer);
  }, [isPatrolCycleActive]);

  // Filmstrip Playback Loop
  const activeBuoy = buoys.find(b => b.id === selectedBuoyId) || buoys[0];
  const framesList: SatelliteFrame[] = activeBuoy.satellitePass.recentFrames && activeBuoy.satellitePass.recentFrames.length > 0 
    ? activeBuoy.satellitePass.recentFrames 
    : [
        {
          frameId: 'FRAME-LIVE-00',
          timestamp: activeBuoy.satellitePass.lastScannedAt || 'Live Now',
          label: 'Live Overhead Orbit Pass',
          imageUrl: activeBuoy.satellitePass.imageUrl,
          cloudCoverPct: activeBuoy.satellitePass.cloudCoverPct || 16,
          sensorMode: activeBuoy.satellitePass.multispectralChannel,
          solarZenithAngleDeg: 41.2,
          dataQualityPct: 99.8
        }
      ];

  useEffect(() => {
    if (!isPlayingFilmstrip || framesList.length <= 1) return;

    const intervalMs = Math.max(400, Math.round(1800 / playbackSpeed));
    const interval = setInterval(() => {
      setActiveFrameIndex(prev => (prev + 1) % framesList.length);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isPlayingFilmstrip, framesList.length, playbackSpeed]);

  // Trigger Brine Downwelling Pulse on Buoy
  const handleTriggerBrinePulse = (buoyId: string) => {
    setPulsingBuoyId(buoyId);
    playSonarChirp(1250);

    setTimeout(() => {
      setBuoys(prevList => prevList.map(b => {
        if (b.id === buoyId) {
          return {
            ...b,
            salinityPsu: Number((b.salinityPsu + 1.6).toFixed(2)),
            pumpRateLpM: Math.min(260, b.pumpRateLpM + 35),
            lastPing: 'Brine Plume Active'
          };
        }
        return b;
      }));
      setPulsingBuoyId(null);
    }, 800);
  };

  // Filtered List for Views
  const filteredBuoys = buoys.filter(b => {
    const matchesCategory = filterCategory === 'All' || b.category === filterCategory;
    const matchesSearch = searchQuery === '' || 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.region.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Export Full Telemetry Data
  const handleExportFleet = () => {
    const jsonStr = JSON.stringify(buoys, null, 2);
    downloadFile(jsonStr, `ocean_boys_fleet_telemetry_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
  };

  // Spectral Color Overlay Filter Generator
  const getSpectralFilterStyle = () => {
    switch (selectedSpectralBand) {
      case 'clean-ir':
        return {
          filter: `contrast(${satContrast * 125}%) brightness(${satBrightness * 110}%) hue-rotate(180deg) saturate(180%)`,
        };
      case 'water-vapor':
        return {
          filter: `contrast(${satContrast * 135}%) brightness(${satBrightness * 95}%) hue-rotate(240deg) saturate(220%)`,
        };
      case 'ocean-color':
        return {
          filter: `contrast(${satContrast * 110}%) brightness(${satBrightness * 105}%) hue-rotate(90deg) saturate(190%)`,
        };
      case 'sst':
        return {
          filter: `contrast(${satContrast * 130}%) brightness(${satBrightness * 105}%) hue-rotate(330deg) saturate(240%)`,
        };
      case 'sar-radar':
        return {
          filter: `contrast(${satContrast * 145}%) brightness(${satBrightness * 90}%) grayscale(90%) invert(10%)`,
        };
      default: // visible
        return {
          filter: `contrast(${satContrast * 100}%) brightness(${satBrightness * 100}%)`,
        };
    }
  };

  const currentDisplayImage = framesList[activeFrameIndex]?.imageUrl || activeBuoy.satellitePass.imageUrl;

  return (
    <div className="space-y-6">
      
      {/* SECTION 1: TOP LIVE STREAMING COMMAND HEADER */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950/70 border border-teal-800/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-500/20 border border-teal-500/40 text-teal-400">
                <Anchor className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-mono uppercase">
                THE OCEAN BOYS & REAL-TIME SATELLITE FLEET
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-800 rounded">
                23 BOYS DEPLOYED
              </span>
              <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-[10px] font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>DYNAMIC POLLING STREAM ACTIVE</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 font-sans max-w-3xl leading-relaxed">
              Continuous live multispectral orbital surveillance monitoring every deployed <strong>Ocean Boy</strong> across New Zealand, the Southern Ocean, and Global Convection Basins. Polling mechanism delivers frame downlinks from Himawari-9, NOAA GOES-18, Sentinel-3, and Aqua MODIS.
            </p>
          </div>

          {/* Quick Hardware & Device Sync */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {/* Oppo A6x Field Sync Trigger */}
            <button
              onClick={() => {
                setActiveBuoyForOppo(selectedBuoyId);
                setIsOppoModalOpen(true);
              }}
              className="inline-flex items-center space-x-2 px-3.5 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl font-bold shadow-md transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-white" />
              <span>Oppo A6x Field Terminal</span>
              <span className="px-1.5 py-0.2 bg-teal-900/60 text-white text-[9px] rounded font-bold">
                90Hz
              </span>
            </button>

            {/* SMS Alerts for Anonymous Info & Maritime Intel */}
            <button
              onClick={() => setIsSmsAlertsOpen(true)}
              className="inline-flex items-center space-x-2 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold shadow-md transition-all cursor-pointer"
              title="SMS Notification Alerts for anonymous information & drift"
            >
              <Bell className="w-4 h-4 text-emerald-200 animate-bounce" />
              <span>SMS Alerts: Anonymous Intel</span>
            </button>

            {/* Audio Ping Toggle */}
            <button
              onClick={() => setAudioPingsEnabled(!audioPingsEnabled)}
              className="p-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
              title="Toggle Sonar Audio Ping on Packet Ingestion"
            >
              {audioPingsEnabled ? <Volume2 className="w-4 h-4 text-teal-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Export Dataset */}
            <button
              onClick={handleExportFleet}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT JSON</span>
            </button>
          </div>
        </div>

        {/* POLLING CONTROL & REAL-TIME STREAMING STRIP */}
        <div className="mt-5 p-4 rounded-xl bg-slate-950/90 border border-teal-900/60 font-mono text-xs shadow-inner">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Left: Polling State & Countdown Gauge */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Play / Pause Polling Switch */}
              <button
                onClick={() => setIsPollingActive(!isPollingActive)}
                className={`px-3 py-1.5 rounded-lg font-bold border transition-all flex items-center space-x-1.5 cursor-pointer ${
                  isPollingActive 
                    ? 'bg-teal-950/80 border-teal-500 text-teal-300 shadow-sm shadow-teal-950' 
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                {isPollingActive ? <Pause className="w-3.5 h-3.5 text-teal-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{isPollingActive ? 'POLLING RUNNING' : 'POLLING PAUSED'}</span>
              </button>

              {/* Force Poll / Sync Now Trigger */}
              <button
                onClick={() => triggerPollSync()}
                disabled={isPollingInProgress}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                title="Immediately poll satellite feeds for all 23 buoys"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-teal-400 ${isPollingInProgress ? 'animate-spin' : ''}`} />
                <span>{isPollingInProgress ? 'DOWNLINK INGESTING...' : 'POLL SATELLITES NOW'}</span>
              </button>

              {/* Polling Interval Selector */}
              <div className="flex items-center space-x-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-[11px]">
                <Clock className="w-3 h-3 text-slate-400" />
                <span className="text-slate-400">Rate:</span>
                {[
                  { sec: 3, label: '3s (Ultra)' },
                  { sec: 5, label: '5s' },
                  { sec: 10, label: '10s' },
                  { sec: 20, label: '20s' }
                ].map(rate => (
                  <button
                    key={rate.sec}
                    onClick={() => {
                      setPollingIntervalSec(rate.sec);
                      setPollingCountdown(rate.sec);
                    }}
                    className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                      pollingIntervalSec === rate.sec 
                        ? 'bg-teal-600 text-white font-bold' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {rate.label}
                  </button>
                ))}
              </div>

              {/* Patrol Mode Toggle */}
              <button
                onClick={() => setIsPatrolCycleActive(!isPatrolCycleActive)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                  isPatrolCycleActive 
                    ? 'bg-indigo-950 border-indigo-500 text-indigo-300' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
                }`}
                title="Automatically cycles focal buoy across the network"
              >
                <RotateCcw className={`w-3 h-3 ${isPatrolCycleActive ? 'animate-spin' : ''}`} />
                <span>Auto-Patrol: {isPatrolCycleActive ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            {/* Right: Live Polling Progress Bar & Packets */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="flex items-center space-x-2 justify-end">
                  <span className="text-slate-400 text-[10px]">NEXT SCAN:</span>
                  <span className="text-teal-300 font-bold text-xs">
                    {isPollingActive ? `${pollingCountdown}s` : 'STOPPED'}
                  </span>
                  <span className="text-[10px] text-slate-500">| Frame #{pollCycleCount}</span>
                </div>
                {/* Visual Progress Bar */}
                <div className="w-36 h-1.5 bg-slate-900 rounded-full overflow-hidden mt-1 border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-1000"
                    style={{ width: `${isPollingActive ? ((pollingIntervalSec - pollingCountdown) / pollingIntervalSec) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Mean Latency */}
              <div className="hidden sm:block pl-3 border-l border-slate-800 text-[11px]">
                <span className="text-slate-500 block text-[9px]">DOWNLINK RTT:</span>
                <span className="text-emerald-400 font-bold">{networkStats.meanLatencyMs} ms</span>
              </div>
            </div>

          </div>

          {/* Telemetry Stream Diagnostics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 mt-3 pt-3 border-t border-slate-900 text-[10px]">
            <div>
              <span className="text-slate-500">TRACKED BUOYS:</span>
              <span className="text-teal-300 font-bold ml-1">23 / 23 Streaming</span>
            </div>
            <div>
              <span className="text-slate-500">DATA BANDWIDTH:</span>
              <span className="text-cyan-400 font-bold ml-1">{networkStats.downlinkBandwidthKbps} Kbps</span>
            </div>
            <div>
              <span className="text-slate-500">PACKETS DELIVERED:</span>
              <span className="text-emerald-400 font-bold ml-1">{networkStats.packetsDelivered} frames</span>
            </div>
            <div>
              <span className="text-slate-500">PACKET LOSS:</span>
              <span className="text-teal-400 font-bold ml-1">{networkStats.packetLossPct.toFixed(1)}%</span>
            </div>
            <div className="hidden lg:block">
              <span className="text-slate-500">GROUND STATIONS:</span>
              <span className="text-sky-300 font-bold ml-1">Warkworth & Awarua NZ</span>
            </div>
            <div className="hidden lg:block text-right">
              <span className="text-slate-500">LAST SCAN:</span>
              <span className="text-slate-300 ml-1">{networkStats.lastPollUtc.split(' ')[1] || 'Synchronized'}</span>
            </div>
          </div>
        </div>

        {/* DASHBOARD VIEW SWITCHER TABS */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800/80 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setDashboardView('matrix')}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                dashboardView === 'matrix'
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-950/60'
                  : 'bg-slate-950 hover:bg-slate-900 text-slate-300 border border-slate-800'
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-teal-300" />
              <span>LIVE SATELLITE MATRIX (ALL 23 BUOYS)</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 text-teal-300 border border-teal-800">
                23 LIVE FEEDS
              </span>
            </button>

            {/* NEW: INTERACTIVE CURRENT DRIFT & PREDICTED TRAJECTORY MAP */}
            <button
              onClick={() => setDashboardView('trajectory-map')}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                dashboardView === 'trajectory-map'
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-950/60'
                  : 'bg-slate-950 hover:bg-slate-900 text-slate-300 border border-slate-800'
              }`}
            >
              <Compass className="w-4 h-4 text-teal-300 animate-spin-slow" />
              <span>CURRENT DRIFT & TRAJECTORY MAP</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-teal-950 text-teal-300 border border-teal-700 font-bold">
                VELOCITY VECTORS (+48h)
              </span>
            </button>

            <button
              onClick={() => setDashboardView('recon')}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                dashboardView === 'recon'
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-950/60'
                  : 'bg-slate-950 hover:bg-slate-900 text-slate-300 border border-slate-800'
              }`}
            >
              <Tv className="w-4 h-4 text-teal-300" />
              <span>DEEP RECON STUDIO (FOCAL BUOY)</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300">
                {activeBuoy.nickname.split('-')[0].trim()}
              </span>
            </button>

            {/* NEW: 3D WEATHER PATTERN & CO2 / METHANE POLLUTION REPORT */}
            <button
              onClick={() => setDashboardView('weather-3d')}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                dashboardView === 'weather-3d'
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-950/60'
                  : 'bg-slate-950 hover:bg-slate-900 text-slate-300 border border-slate-800'
              }`}
            >
              <Wind className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>3D WEATHER & POLLUTION (CO2/CH4)</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
                3D & GPS
              </span>
            </button>

            <button
              onClick={() => setDashboardView('logs')}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                dashboardView === 'logs'
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-950/60'
                  : 'bg-slate-950 hover:bg-slate-900 text-slate-300 border border-slate-800'
              }`}
            >
              <Terminal className="w-4 h-4 text-teal-300" />
              <span>DOWNLINK STREAM LOGS</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 text-emerald-400">
                {downlinkLogs.length} LOGS
              </span>
            </button>
          </div>

          {/* Matrix Grid Density Controls (only when on matrix view) */}
          {dashboardView === 'matrix' && (
            <div className="flex items-center space-x-1 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800 text-[11px]">
              <span className="text-slate-500 mr-1">Grid Density:</span>
              <button
                onClick={() => setMatrixGridCols('compact')}
                className={`px-2 py-0.5 rounded cursor-pointer ${matrixGridCols === 'compact' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                4-Col
              </button>
              <button
                onClick={() => setMatrixGridCols('standard')}
                className={`px-2 py-0.5 rounded cursor-pointer ${matrixGridCols === 'standard' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                3-Col
              </button>
              <button
                onClick={() => setMatrixGridCols('large')}
                className={`px-2 py-0.5 rounded cursor-pointer ${matrixGridCols === 'large' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                2-Col Large
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FILTER & SEARCH STRIP (APPLIES ACROSS VIEWS) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-500 text-[11px] mr-1 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-teal-400" />
            <span>Filter Network:</span>
          </span>
          {[
            'All',
            'SaliBuoy Pumping Fleet',
            'Argo Profiling Float',
            'NOAA DART Tsunami Buoy',
            'BOM & Tasman Marine Buoy'
          ].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterCategory === cat 
                  ? 'bg-teal-600 text-white shadow-sm' 
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              {cat === 'All' ? `All (${buoys.length})` : cat.replace('Fleet', '').replace('Float', '').trim()}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search buoy, region, GPS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 w-full sm:w-56"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW MODE 1: LIVE SATELLITE MATRIX (ALL 23 BUOYS VISUAL WALL) */}
      {/* ========================================================================= */}
      {dashboardView === 'matrix' && (
        <div className="space-y-4">
          
          <div className="flex items-center justify-between font-mono text-xs text-slate-400 px-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-white font-bold">
                STREAMING {filteredBuoys.length} OF 23 DEPLOYED BUOYS (POLLED DYNAMICALLY)
              </span>
            </div>
            <span>Click any buoy feed to switch to Deep Recon Studio or sync to Oppo A5x</span>
          </div>

          {/* Matrix Grid of Live Satellite Imagery Feeds */}
          <div className={`grid gap-4 ${
            matrixGridCols === 'compact' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
            matrixGridCols === 'large' ? 'grid-cols-1 md:grid-cols-2' :
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {filteredBuoys.map(boy => {
              const isSelected = boy.id === selectedBuoyId;
              const isJustUpdated = recentlyUpdatedBuoyIds.has(boy.id);

              return (
                <div 
                  key={boy.id}
                  className={`rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden relative shadow-xl ${
                    isSelected 
                      ? 'bg-slate-900 border-teal-500 ring-2 ring-teal-500/40' 
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  } ${isJustUpdated ? 'ring-1 ring-emerald-400' : ''}`}
                >
                  {/* Just Polled Flash Badge */}
                  {isJustUpdated && (
                    <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-mono font-bold text-[9px] shadow-lg animate-pulse flex items-center space-x-1">
                      <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                      <span>DOWNLINK SYNCED</span>
                    </div>
                  )}

                  {/* Satellite Viewport Window */}
                  <div 
                    className="relative w-full h-44 sm:h-48 bg-slate-950 overflow-hidden cursor-pointer group"
                    onClick={() => {
                      setSelectedBuoyId(boy.id);
                      setDashboardView('recon');
                    }}
                  >
                    {/* Live Satellite Image */}
                    <img 
                      src={boy.satellitePass.imageUrl} 
                      alt={`Live satellite view for ${boy.name}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={getSpectralFilterStyle()}
                    />

                    {/* Radar Sweep & Crosshairs Overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Radar sweep line */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/10 to-transparent"
                        style={{
                          transform: `rotate(${radarSweepAngle}deg)`,
                          transformOrigin: 'center center'
                        }}
                      ></div>

                      {/* Center Crosshair Marker */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                        <div className="w-6 h-6 border border-teal-400/60 rounded-full animate-ping opacity-70"></div>
                        <div className="w-2.5 h-2.5 bg-teal-400 rounded-full border border-white shadow-md"></div>
                      </div>

                      {/* Range rings */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 border border-teal-500/20 rounded-full"></div>
                        <div className="w-40 h-40 border border-teal-500/10 rounded-full"></div>
                      </div>
                    </div>

                    {/* Viewport Top HUD Bar */}
                    <div className="absolute top-2 right-2 flex items-center space-x-1 z-10">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-[10px] font-mono text-teal-300 font-bold flex items-center space-x-1">
                        <Radio className="w-2.5 h-2.5 text-teal-400 animate-pulse" />
                        <span>{boy.satellitePass.satellite.split(' ')[0]}</span>
                      </span>
                    </div>

                    {/* Viewport Bottom HUD Bar */}
                    <div className="absolute bottom-2 inset-x-2 flex items-center justify-between text-[10px] font-mono z-10">
                      <span className="px-2 py-0.5 rounded bg-slate-950/85 backdrop-blur-md border border-slate-800 text-slate-300">
                        {boy.coordinates.lat.toFixed(2)}°, {boy.coordinates.lng.toFixed(2)}°
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-950/85 backdrop-blur-md border border-slate-800 text-emerald-400 font-bold">
                        Cloud: {boy.satellitePass.cloudCoverPct || 18}%
                      </span>
                    </div>
                  </div>

                  {/* Buoy Metadata & Telemetry Block */}
                  <div className="p-4 space-y-3 font-mono">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-teal-400 font-bold truncate max-w-[160px]">
                          {boy.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          boy.status === 'Active Downwelling' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                          boy.status === 'Tsunami Watch' ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse' :
                          'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                          {boy.status}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white truncate">
                        {boy.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 truncate">
                        {boy.nickname}
                      </p>
                    </div>

                    {/* Mini Telemetry Numbers */}
                    <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                      <div className="p-1.5 bg-slate-950 rounded border border-slate-800">
                        <span className="text-slate-500 block text-[8px]">SALINITY:</span>
                        <span className="text-cyan-400 font-bold">{boy.salinityPsu} PSU</span>
                      </div>
                      <div className="p-1.5 bg-slate-950 rounded border border-slate-800">
                        <span className="text-slate-500 block text-[8px]">SST TEMP:</span>
                        <span className="text-rose-400 font-bold">{boy.ambientTempC}°C</span>
                      </div>
                      <div className="p-1.5 bg-slate-950 rounded border border-slate-800">
                        <span className="text-slate-500 block text-[8px]">WAVE POWER:</span>
                        <span className="text-emerald-400 font-bold">{boy.wavePowerWatts} W</span>
                      </div>
                    </div>

                    {/* Downlink Pass & Quick Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                      <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
                        <Clock className="w-3 h-3 text-teal-400" />
                        <span>Pass: {boy.satellitePass.nextPassMinutes === 0 ? 'Live Now' : `+${boy.satellitePass.nextPassMinutes}m`}</span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        {/* Brine pulse trigger */}
                        <button
                          onClick={() => handleTriggerBrinePulse(boy.id)}
                          disabled={pulsingBuoyId === boy.id}
                          className="p-1.5 bg-slate-950 hover:bg-slate-800 text-yellow-300 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Trigger Remote Brine Pulse"
                        >
                          <Zap className={`w-3.5 h-3.5 ${pulsingBuoyId === boy.id ? 'animate-bounce' : ''}`} />
                        </button>

                        {/* Open on Oppo A6x */}
                        <button
                          onClick={() => {
                            setActiveBuoyForOppo(boy.id);
                            setIsOppoModalOpen(true);
                          }}
                          className="p-1.5 bg-slate-950 hover:bg-slate-800 text-teal-400 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Sync with Oppo A6x Field Terminal"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                        </button>

                        {/* Deep Recon Button */}
                        <button
                          onClick={() => {
                            setSelectedBuoyId(boy.id);
                            setDashboardView('recon');
                          }}
                          className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold text-[10px] flex items-center space-x-0.5 transition-colors cursor-pointer"
                        >
                          <span>Recon</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 2: DEEP RECON STUDIO (FOCUSED SINGLE BUOY INSPECTION) */}
      {/* ========================================================================= */}
      {dashboardView === 'recon' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Multispectral Satellite Pass Studio */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="space-y-0.5 font-mono">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    REAL-TIME SATELLITE PASS OVERHEAD: {activeBuoy.name}
                  </h2>
                </div>
                <p className="text-[11px] text-slate-400">
                  Satellite: <span className="text-teal-300 font-bold">{activeBuoy.satellitePass.satellite}</span> • Uplink: <span className="text-sky-300">{activeBuoy.satelliteUplink}</span> • Cloud: <span className="text-emerald-300 font-bold">{activeBuoy.satellitePass.cloudCoverPct || 14}%</span>
                </p>
              </div>

              {/* Spectral Band Selector */}
              <div className="flex flex-wrap items-center gap-1 font-mono text-[11px] bg-slate-950 p-1 rounded-xl border border-slate-800">
                {[
                  { id: 'clean-ir', label: 'Clean IR 10.4µm' },
                  { id: 'visible', label: 'True Color HD' },
                  { id: 'water-vapor', label: 'Water Vapor 6.2µm' },
                  { id: 'ocean-color', label: 'Sentinel-3 Plume' },
                  { id: 'sst', label: 'SST Anomaly' },
                  { id: 'sar-radar', label: 'SAR Radar' }
                ].map(band => (
                  <button
                    key={band.id}
                    onClick={() => setSelectedSpectralBand(band.id as typeof selectedSpectralBand)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      selectedSpectralBand === band.id 
                        ? 'bg-teal-600 text-white shadow-sm' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {band.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Satellite Viewport Container */}
            <div className="relative w-full h-[380px] sm:h-[440px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center select-none shadow-inner">
              
              {/* The Real Satellite Image Feed */}
              <img 
                src={currentDisplayImage} 
                alt={`Real-Time Satellite Feed over ${activeBuoy.name}`}
                className="w-full h-full object-cover transition-transform duration-300"
                style={{
                  ...getSpectralFilterStyle(),
                  transform: `scale(${satZoom})`
                }}
              />

              {/* Radar / HUD Crosshair Overlay Centered on the Ocean Boy */}
              {showRadarGrid && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Radar Sweep Line */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/10 to-transparent"
                    style={{
                      transform: `rotate(${radarSweepAngle}deg)`,
                      transformOrigin: 'center center'
                    }}
                  ></div>

                  {/* Circular range rings */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 border border-teal-500/20 rounded-full"></div>
                    <div className="w-64 h-64 border border-teal-500/20 rounded-full"></div>
                    <div className="w-96 h-96 border border-teal-500/10 rounded-full"></div>
                  </div>

                  {/* Grid cross lines */}
                  <div className="absolute inset-x-0 top-1/2 h-[1px] bg-teal-500/20"></div>
                  <div className="absolute inset-y-0 left-1/2 w-[1px] bg-teal-500/20"></div>

                  {/* Ocean Boy Target Crosshair at Center */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="relative flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-teal-400 rounded-full animate-ping opacity-60"></div>
                      <div className="w-4 h-4 bg-teal-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-slate-950 rounded-full"></div>
                      </div>
                    </div>
                    <div className="mt-2 px-2 py-1 bg-slate-950/90 border border-teal-500/60 rounded text-[10px] font-mono text-teal-300 font-bold whitespace-nowrap shadow-xl">
                      {activeBuoy.nickname} • {activeBuoy.coordinates.lat.toFixed(3)}°S, {activeBuoy.coordinates.lng.toFixed(3)}°E
                    </div>
                  </div>
                </div>
              )}

              {/* Top-Right HUD Badge */}
              <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-lg p-2 font-mono text-[10px] space-y-1 text-slate-300 shadow-lg">
                <div className="flex items-center space-x-1.5 text-teal-400 font-bold">
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>{activeBuoy.satellitePass.multispectralChannel}</span>
                </div>
                <div className="text-slate-400">
                  Resolution: <span className="text-slate-200">{activeBuoy.satellitePass.opticalResolutionM || 500}m Sub-Satellite Point</span>
                </div>
                <div className="text-slate-400">
                  Frame Latency: <span className="text-emerald-400 font-bold">{activeBuoy.satellitePass.downlinkLatencyMs || 14} ms</span>
                </div>
              </div>

              {/* Bottom-Left Controls inside Viewport */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2 font-mono text-xs">
                <div className="bg-slate-950/90 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-300 text-[11px] flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-teal-400" />
                  <span>Status:</span>
                  <span className="text-emerald-400 font-bold">
                    {activeBuoy.satellitePass.nextPassMinutes === 0 ? 'REAL-TIME CONTINUOUS' : `Next Pass: +${activeBuoy.satellitePass.nextPassMinutes}m`}
                  </span>
                </div>
                <button
                  onClick={() => setShowRadarGrid(!showRadarGrid)}
                  className="bg-slate-950/90 border border-slate-800 px-2 py-1 rounded-lg text-slate-300 hover:text-white text-[11px] cursor-pointer"
                >
                  {showRadarGrid ? 'Hide HUD' : 'Show HUD'}
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-slate-950/90 border border-slate-800 p-1 rounded-lg font-mono text-xs">
                <button
                  onClick={() => setSatZoom(Math.max(0.8, satZoom - 0.2))}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-white rounded cursor-pointer"
                >
                  -
                </button>
                <span className="px-1 text-[11px] text-teal-300">{satZoom.toFixed(1)}x</span>
                <button
                  onClick={() => setSatZoom(Math.min(2.5, satZoom + 0.2))}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-white rounded cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* DYNAMIC TIME-LAPSE FILMSTRIP SCRUBBER */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400 text-[11px] font-bold">POLLED PASS FILMSTRIP:</span>
                  <span className="text-teal-300 text-[11px]">
                    Frame {activeFrameIndex + 1} of {framesList.length}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Play / Pause Time-Lapse Loop */}
                  <button
                    onClick={() => setIsPlayingFilmstrip(!isPlayingFilmstrip)}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-teal-300 rounded font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    {isPlayingFilmstrip ? <Pause className="w-3 h-3 text-yellow-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                    <span>{isPlayingFilmstrip ? 'Pause Loop' : 'Play Loop'}</span>
                  </button>

                  {/* Speed toggle */}
                  <button
                    onClick={() => setPlaybackSpeed(prev => (prev === 1 ? 2 : prev === 2 ? 4 : 1))}
                    className="px-2 py-1 bg-slate-900 border border-slate-700 text-slate-300 rounded font-bold text-[10px] cursor-pointer"
                  >
                    {playbackSpeed}x
                  </button>
                </div>
              </div>

              {/* Thumbnails strip */}
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-1">
                {framesList.map((fr, idx) => (
                  <div
                    key={fr.frameId || idx}
                    onClick={() => {
                      setActiveFrameIndex(idx);
                      setIsPlayingFilmstrip(false);
                    }}
                    className={`relative h-16 rounded-lg overflow-hidden border cursor-pointer transition-all ${
                      activeFrameIndex === idx 
                        ? 'border-teal-400 ring-2 ring-teal-500/50' 
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={fr.imageUrl} 
                      alt={fr.label}
                      className="w-full h-full object-cover"
                      style={getSpectralFilterStyle()}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 p-0.5 text-[8px] text-center text-slate-300 truncate">
                      {fr.timestamp.split(' ')[1] || `T -${idx * 10}m`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Contrast & Satellite Tuning */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1 font-mono text-xs text-slate-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-3.5 h-3.5 text-teal-400" />
                  <span>Contrast:</span>
                  <input 
                    type="range" 
                    min="0.8" 
                    max="2.0" 
                    step="0.1" 
                    value={satContrast}
                    onChange={(e) => setSatContrast(parseFloat(e.target.value))}
                    className="w-24 accent-teal-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span>Brightness:</span>
                  <input 
                    type="range" 
                    min="0.7" 
                    max="1.5" 
                    step="0.05" 
                    value={satBrightness}
                    onChange={(e) => setSatBrightness(parseFloat(e.target.value))}
                    className="w-24 accent-teal-500"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setSatZoom(1.0);
                  setSatContrast(1.2);
                  setSatBrightness(1.05);
                }}
                className="text-[11px] text-teal-400 hover:text-teal-300 underline cursor-pointer"
              >
                Reset Visual Filters
              </button>
            </div>
          </div>

          {/* Selected Ocean Boy Detailed Telemetry & Controls Card */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 font-mono">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-teal-400 px-2 py-0.5 rounded bg-teal-950 border border-teal-800">
                  {activeBuoy.category}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  activeBuoy.status === 'Active Downwelling' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                  activeBuoy.status === 'Tsunami Watch' ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse' :
                  'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {activeBuoy.status}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">
                  {activeBuoy.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {activeBuoy.nickname}
                </p>
                <p className="text-[11px] text-teal-300 mt-0.5">
                  Region: {activeBuoy.region}
                </p>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed border-t border-slate-800 pt-2">
                {activeBuoy.description}
              </p>

              {/* Core Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">SALINITY OUTPUT:</span>
                  <span className="text-cyan-400 font-bold text-sm">{activeBuoy.salinityPsu} PSU</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">WATER TEMP (SST):</span>
                  <span className="text-rose-400 font-bold text-sm">{activeBuoy.ambientTempC}°C</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">WAVE POWER:</span>
                  <span className="text-emerald-400 font-bold text-sm">{activeBuoy.wavePowerWatts} W</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">PUMP FLOW:</span>
                  <span className="text-indigo-400 font-bold text-sm">{activeBuoy.pumpRateLpM} L/min</span>
                </div>
              </div>

              {/* Technical Subsea Details */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mooring Depth:</span>
                  <span className="font-bold text-slate-200">{activeBuoy.depthM} meters</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Significant Wave Height:</span>
                  <span className="font-bold text-teal-300">{activeBuoy.waveHeightM} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Satellite DCS Link:</span>
                  <span className="font-bold text-sky-400">{activeBuoy.satelliteUplink}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Last Telemetry Ping:</span>
                  <span className="font-bold text-emerald-400">{activeBuoy.lastPing}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 text-xs">
              {/* Brine Pulse Trigger */}
              <button
                onClick={() => handleTriggerBrinePulse(activeBuoy.id)}
                disabled={pulsingBuoyId === activeBuoy.id}
                className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white rounded-xl font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md disabled:opacity-50"
              >
                {pulsingBuoyId === activeBuoy.id ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>TRANSMITTING BRINE PULSE...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-yellow-300" />
                    <span>TRIGGER REMOTE BRINE DOWNWELLING PULSE</span>
                  </>
                )}
              </button>

              {/* Launch on Oppo A6x */}
              <button
                onClick={() => {
                  setActiveBuoyForOppo(activeBuoy.id);
                  setIsOppoModalOpen(true);
                }}
                className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-teal-300 border border-teal-800/60 rounded-xl font-bold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-teal-400" />
                <span>OPEN ON OPPO A6X FIELD TERMINAL</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE: INTERACTIVE CURRENT DRIFT & PREDICTED TRAJECTORY MAP OVERLAY */}
      {/* ========================================================================= */}
      {dashboardView === 'trajectory-map' && (
        <OceanBoysTrajectoryMapOverlay 
          buoys={buoys}
          selectedBuoyId={selectedBuoyId}
          onSelectBuoy={setSelectedBuoyId}
          onOpenOppoSimulator={(buoyId) => {
            setActiveBuoyForOppo(buoyId);
            setIsOppoModalOpen(true);
          }}
          onOpenSmsAlertsModal={() => setIsSmsAlertsOpen(true)}
          onTriggerBrinePulse={handleTriggerBrinePulse}
          pulsingBuoyId={pulsingBuoyId}
        />
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 3: DOWNLINK STREAM LOGS & CONSTELLATION HEALTH */}
      {/* ========================================================================= */}
      {dashboardView === 'logs' && (
        <div className="space-y-6">
          
          {/* Constellations Ingested Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {SATELLITE_CONSTELLATIONS.map(sat => (
              <div key={sat.name} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl font-mono text-xs space-y-2 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-teal-400 font-bold">{sat.name}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {sat.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300">Refresh: {sat.refreshRate}</div>
                <div className="text-slate-500 text-[10px]">Orbit: {sat.orbit} • Res: {sat.resolution}</div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800 text-[10px] text-slate-300">
                  {sat.coverage}
                </div>
              </div>
            ))}
          </div>

          {/* Real-Time Incoming Packet Console */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl font-mono text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white uppercase">
                  LIVE SATELLITE DOWNLINK EVENT STREAM (TELEMETRY PACKETS)
                </h3>
              </div>
              <span className="text-slate-500 text-[11px]">
                Auto-polled via Warkworth & Awarua ground stations
              </span>
            </div>

            <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-2">
              {downlinkLogs.map(log => (
                <div 
                  key={log.id}
                  className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500">[{log.timestamp}]</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-950 text-teal-300 border border-slate-800 text-[10px]">
                      {log.satellite}
                    </span>
                    <span className="text-white font-bold">{log.buoyNickname}</span>
                    <span className="text-slate-400 hidden md:inline">({log.channel})</span>
                  </div>

                  <div className="flex items-center space-x-3 text-[10px]">
                    <span className="text-slate-400">{log.frameSizeKb} KB</span>
                    <span className="text-emerald-400 font-bold">{log.latencyMs} ms</span>
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      log.status === 'DOWNWELLING_PLUME' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                      log.status === 'OPTIMAL' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      'bg-slate-950 text-slate-300 border border-slate-800'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 5: 3D WEATHER PATTERN & CO2 / METHANE POLLUTION REPORT */}
      {/* ========================================================================= */}
      {dashboardView === 'weather-3d' && (
        <WeatherPollution3DModel />
      )}

      {/* Oppo A6x Field Simulator Modal */}
      <OppoA6xTerminalModal 
        isOpen={isOppoModalOpen}
        onClose={() => setIsOppoModalOpen(false)}
        initialBuoyId={activeBuoyForOppo}
        buoys={buoys}
        onOpenSmsAlerts={() => {
          setIsOppoModalOpen(false);
          setIsSmsAlertsOpen(true);
        }}
      />

      {/* SMS Alerts for Anonymous Information & Field Intelligence Modal */}
      <SmsAlertsModal 
        isOpen={isSmsAlertsOpen}
        onClose={() => setIsSmsAlertsOpen(false)}
      />

    </div>
  );
}
