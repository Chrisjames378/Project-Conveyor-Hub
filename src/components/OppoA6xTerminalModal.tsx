import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  X, 
  Wifi, 
  Battery, 
  Signal, 
  Navigation, 
  Activity, 
  Radio, 
  Layers, 
  Check, 
  RefreshCw, 
  Send, 
  Download, 
  Zap, 
  Compass, 
  Eye, 
  Globe2,
  ExternalLink,
  Bell,
  Waves
} from 'lucide-react';
import { INITIAL_OCEAN_BOYS } from '../db/oceanBoysFleet';
import { OceanBoy } from '../types';

export interface OppoA6xTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBuoyId?: string;
  buoys?: OceanBoy[];
  onOpenSmsAlerts?: () => void;
}

export const OppoA6xTerminalModal: React.FC<OppoA6xTerminalModalProps> = ({ 
  isOpen, 
  onClose,
  initialBuoyId,
  buoys,
  onOpenSmsAlerts
}) => {
  const [activeScreen, setActiveScreen] = useState<'field-pinger' | 'sat-view' | 'gps-logger' | 'device-specs'>('field-pinger');
  const [selectedBuoyId, setSelectedBuoyId] = useState<string>(initialBuoyId || 'ocean-boy-1');
  const [buoyList, setBuoyList] = useState<OceanBoy[]>(buoys || INITIAL_OCEAN_BOYS);
  const [syncStatus, setSyncStatus] = useState<string>('SYNCHRONIZED (90Hz • 12ms)');
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [fieldLogs, setFieldLogs] = useState<string[]>([
    '[OPPO A6X] ColorOS 14 Field Terminal initialized (Android 14).',
    '[OPPO A6X] 1612x720 90Hz Sunlight display profile active.',
    '[RADIO LINK] Downlink connected to Himawari-9 & Iridium relay servers.',
    '[SMS ALERT GATEWAY] Handset registered for anonymous information alerts.'
  ]);

  const workingPublicUrl = "https://ais-pre-anvaiib6x42jeyxbs5k5ki-205273580701.asia-east1.run.app";

  useEffect(() => {
    if (buoys && buoys.length > 0) {
      setBuoyList(buoys);
    }
  }, [buoys]);

  useEffect(() => {
    if (initialBuoyId) {
      setSelectedBuoyId(initialBuoyId);
    }
  }, [initialBuoyId]);

  if (!isOpen) return null;

  const currentBuoy = buoyList.find(b => b.id === selectedBuoyId) || buoyList[0];

  const handleFieldPulse = () => {
    setIsPinging(true);
    setSyncStatus('TRANSMITTING DOWNLINK COMMAND...');
    setTimeout(() => {
      setBuoyList(prev => prev.map(b => {
        if (b.id === selectedBuoyId) {
          return {
            ...b,
            salinityPsu: Number((b.salinityPsu + 1.25).toFixed(2)),
            pumpRateLpM: Math.min(240, b.pumpRateLpM + 25),
            lastPing: 'Just now (Oppo A6x Remote)'
          };
        }
        return b;
      }));
      setFieldLogs(prev => [
        `[OPPO A6X TX] Brine pulse command transmitted to ${currentBuoy.name} (${currentBuoy.coordinates.lat}, ${currentBuoy.coordinates.lng})`,
        ...prev.slice(0, 5)
      ]);
      setSyncStatus('ACKNOWLEDGED • 90Hz STREAMING');
      setIsPinging(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in font-mono">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-teal-800/80 rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Left Side: Realistic Oppo A6x Device Mockup (1612 x 720 HD+ 20:9 Display) */}
        <div className="md:w-[380px] p-4 bg-slate-950 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800">
          
          <div className="text-[11px] text-teal-300 font-bold mb-2 flex items-center space-x-1">
            <Smartphone className="w-3.5 h-3.5 text-teal-400" />
            <span>OPPO A6X FIELD TERMINAL</span>
            <span className="px-1.5 py-0.2 rounded bg-teal-950 text-teal-300 text-[9px] border border-teal-800">
              90Hz
            </span>
          </div>

          {/* Physical Phone Frame (Oppo A6x 6.56" Waterdrop Notch) */}
          <div className="w-[280px] sm:w-[300px] h-[580px] bg-slate-950 border-4 border-slate-700 rounded-[38px] p-2 shadow-2xl relative flex flex-col overflow-hidden ring-1 ring-teal-500/30">
            
            {/* Top Waterdrop Notch & Earpiece */}
            <div className="absolute top-2 inset-x-0 flex justify-center z-20 pointer-events-none">
              <div className="w-24 h-4 bg-slate-900 rounded-b-xl flex items-center justify-center space-x-2 border-b border-slate-800">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-700"></div>
                <div className="w-8 h-1 bg-slate-800 rounded-full"></div>
              </div>
            </div>

            {/* ColorOS 14 Status Bar */}
            <div className="w-full h-6 pt-1 px-3 flex items-center justify-between text-[9px] text-slate-300 z-10 select-none">
              <span className="font-bold">12:45</span>
              <div className="flex items-center space-x-1.5">
                <span className="text-[8px] text-teal-400 font-bold">5G</span>
                <Signal className="w-2.5 h-2.5 text-slate-300" />
                <Wifi className="w-2.5 h-2.5 text-teal-400" />
                <Battery className="w-3 h-3 text-emerald-400" />
                <span>94%</span>
              </div>
            </div>

            {/* Inner Screen Viewport (Simulating 1612 x 720 HD+ Display) */}
            <div className="flex-1 bg-slate-900 rounded-[28px] overflow-hidden flex flex-col border border-slate-800/80 text-[11px] relative">
              
              {/* App Header inside phone */}
              <div className="bg-slate-950 p-2.5 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-[10px] uppercase flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>SALIBUOY MOBILE (A6X)</span>
                  </div>
                  <div className="text-[8px] text-slate-400">
                    {syncStatus}
                  </div>
                </div>

                {/* Dropdown Buoy selector */}
                <select 
                  value={selectedBuoyId}
                  onChange={(e) => setSelectedBuoyId(e.target.value)}
                  className="bg-slate-900 text-teal-300 text-[9px] font-mono border border-slate-700 rounded px-1.5 py-0.5 max-w-[110px] truncate"
                >
                  {buoyList.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.nickname.split('-')[0].trim()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Screen Content Switcher */}
              <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
                
                {/* SCREEN 1: BUOY TELEMETRY & FIELD PINGER */}
                {activeScreen === 'field-pinger' && (
                  <div className="space-y-2">
                    <div className="p-2 bg-slate-950 rounded-xl border border-teal-800/60">
                      <div className="flex justify-between items-center text-[9px]">
                        <span className="text-teal-400 font-bold truncate max-w-[120px]">{currentBuoy.name}</span>
                        <span className="text-emerald-400 font-bold">{currentBuoy.status}</span>
                      </div>
                      <div className="text-[8px] text-slate-400 truncate">{currentBuoy.region}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[9px]">
                      <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                        <span className="text-slate-500 block text-[8px]">SALINITY:</span>
                        <span className="text-cyan-400 font-bold">{currentBuoy.salinityPsu} PSU</span>
                      </div>
                      <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                        <span className="text-slate-500 block text-[8px]">WATER TEMP:</span>
                        <span className="text-rose-400 font-bold">{currentBuoy.ambientTempC}°C</span>
                      </div>
                      <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                        <span className="text-slate-500 block text-[8px]">DRIFT SPEED:</span>
                        <span className="text-teal-300 font-bold">{currentBuoy.driftSpeedKnots || 1.8} kt</span>
                      </div>
                      <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                        <span className="text-slate-500 block text-[8px]">WAVE POWER:</span>
                        <span className="text-emerald-400 font-bold">{currentBuoy.wavePowerWatts} W</span>
                      </div>
                    </div>

                    {/* Remote Command Trigger */}
                    <button
                      onClick={handleFieldPulse}
                      disabled={isPinging}
                      className="w-full py-2 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-bold rounded-xl text-[10px] flex items-center justify-center space-x-1 cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {isPinging ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 text-yellow-300" />}
                      <span>{isPinging ? 'PULSING NOZZLE...' : 'TRANSMIT BRINE PULSE'}</span>
                    </button>

                    {/* Quick SMS Notification button */}
                    {onOpenSmsAlerts && (
                      <button
                        onClick={onOpenSmsAlerts}
                        className="w-full py-1.5 bg-slate-950 hover:bg-slate-800 text-teal-300 border border-teal-800/60 rounded-xl font-bold text-[9px] flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Bell className="w-3 h-3 text-teal-400" />
                        <span>SMS NOTIFICATION ALERTS</span>
                      </button>
                    )}

                    {/* Live Field Console Log */}
                    <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[8px] text-slate-500 block font-bold">OPPO A6X DOWNLINK STREAM:</span>
                      <div className="space-y-0.5 text-[8px] text-slate-400">
                        {fieldLogs.slice(0, 3).map((log, i) => (
                          <div key={i} className="truncate">{log}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* SCREEN 2: SATELLITE PASS VIEW ON PHONE */}
                {activeScreen === 'sat-view' && (
                  <div className="space-y-2">
                    <div className="relative h-44 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                      <img 
                        src={currentBuoy.satellitePass.imageUrl} 
                        alt="Satellite view on mobile"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 left-1 bg-slate-950/80 px-1.5 py-0.5 rounded text-[8px] text-teal-300 font-bold">
                        {currentBuoy.satellitePass.satellite.split(' ')[0]}
                      </div>
                      <div className="absolute bottom-1 right-1 bg-slate-950/80 px-1.5 py-0.5 rounded text-[8px] text-emerald-400">
                        Cloud: {currentBuoy.satellitePass.cloudCoverPct || 14}%
                      </div>
                    </div>

                    <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-[9px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Spectral Band:</span>
                        <span className="text-teal-300 truncate max-w-[130px]">{currentBuoy.satellitePass.multispectralChannel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Predicted Drift:</span>
                        <span className="text-emerald-400 font-bold">{currentBuoy.driftSpeedKnots || 1.8} kt heading {currentBuoy.driftHeadingDeg || 140}°</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* SCREEN 3: GPS LOGGER */}
                {activeScreen === 'gps-logger' && (
                  <div className="space-y-2 text-[9px]">
                    <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-500 block text-[8px]">HANDSET GNSS FIX:</span>
                      <div className="text-teal-300 font-bold">
                        -36.8485° S, 174.7633° E
                      </div>
                      <div className="text-slate-400 text-[8px]">
                        Accuracy: ±2.8 meters • MediaTek Dimensity Dual GNSS
                      </div>
                    </div>

                    <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-500 block text-[8px]">DISTANCE TO ACTIVE BUOY:</span>
                      <div className="text-emerald-400 font-bold text-xs">
                        48.2 km (Bearing 068° ENE)
                      </div>
                    </div>
                  </div>
                )}

                {/* SCREEN 4: OPPO A6X HARDWARE PROFILE */}
                {activeScreen === 'device-specs' && (
                  <div className="space-y-1.5 text-[8px]">
                    <div className="p-2 bg-slate-950 rounded-xl border border-teal-800/80 space-y-1">
                      <span className="text-teal-300 font-bold block text-[9px]">OPPO A6X SPECIFICATIONS:</span>
                      <div>Model: <span className="text-slate-300">CPH2579 (Android 14)</span></div>
                      <div>Display: <span className="text-slate-300">6.56&quot; HD+ 90Hz (1612 x 720)</span></div>
                      <div>Battery: <span className="text-slate-300">5000 mAh High-Capacity Li-Po</span></div>
                      <div>OS: <span className="text-slate-300">ColorOS 14 Enhanced</span></div>
                      <div>Radio: <span className="text-slate-300">5G / 4G LTE / Dual GNSS L1+L5</span></div>
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom Phone App Navigation Bar */}
              <div className="h-10 bg-slate-950 border-t border-slate-800 grid grid-cols-4 items-center text-[8px] text-center">
                <button
                  onClick={() => setActiveScreen('field-pinger')}
                  className={`py-1 cursor-pointer ${activeScreen === 'field-pinger' ? 'text-teal-400 font-bold' : 'text-slate-400'}`}
                >
                  <Activity className="w-3.5 h-3.5 mx-auto" />
                  <span>Telemetry</span>
                </button>
                <button
                  onClick={() => setActiveScreen('sat-view')}
                  className={`py-1 cursor-pointer ${activeScreen === 'sat-view' ? 'text-teal-400 font-bold' : 'text-slate-400'}`}
                >
                  <Eye className="w-3.5 h-3.5 mx-auto" />
                  <span>Satellite</span>
                </button>
                <button
                  onClick={() => setActiveScreen('gps-logger')}
                  className={`py-1 cursor-pointer ${activeScreen === 'gps-logger' ? 'text-teal-400 font-bold' : 'text-slate-400'}`}
                >
                  <Navigation className="w-3.5 h-3.5 mx-auto" />
                  <span>GPS</span>
                </button>
                <button
                  onClick={() => setActiveScreen('device-specs')}
                  className={`py-1 cursor-pointer ${activeScreen === 'device-specs' ? 'text-teal-400 font-bold' : 'text-slate-400'}`}
                >
                  <Smartphone className="w-3.5 h-3.5 mx-auto" />
                  <span>A6x Specs</span>
                </button>
              </div>

            </div>

            {/* Android Navigation Bar (Home, Back, Apps) */}
            <div className="w-full h-4 flex items-center justify-center space-x-8 pt-1 text-slate-600">
              <div className="w-3 h-0.5 bg-slate-600 rounded"></div>
              <div className="w-1.5 h-1.5 border border-slate-600 rounded-full"></div>
              <div className="w-2 h-2 border border-slate-600 rounded-sm"></div>
            </div>

          </div>

        </div>

        {/* Right Side: Oppo A6x Field Terminal Setup & Features */}
        <div className="flex-1 p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <span>Oppo A6x Mobile Access & Field Terminal</span>
                  <span className="px-2 py-0.5 text-[9px] bg-teal-950 text-teal-300 border border-teal-800 rounded">
                    90Hz HD+
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Calibrated for the new <strong>Oppo A6x</strong> (CPH2579): 6.56-inch 90Hz Sunlight display, 5000 mAh battery, ColorOS 14.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-teal-400 font-bold block flex items-center space-x-1">
                  <Activity className="w-3.5 h-3.5" />
                  <span>90Hz Live Telemetry Stream:</span>
                </span>
                <p className="text-slate-400 text-[11px] font-sans">
                  Real-time subsea salinity, wave kinetic generation, and current drift speed updated with zero lag on the 90Hz display.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-sky-400 font-bold block flex items-center space-x-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Multispectral Satellite Studio:</span>
                </span>
                <p className="text-slate-400 text-[11px] font-sans">
                  Himawari-9 & Sentinel-3 high-resolution orbital imagery formatted for the 20:9 aspect ratio.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-bold block flex items-center space-x-1">
                  <Battery className="w-3.5 h-3.5" />
                  <span>5000 mAh Field Endurance:</span>
                </span>
                <p className="text-slate-400 text-[11px] font-sans">
                  Background polling and offline packet caching tuned for prolonged offshore observation without draining battery.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-yellow-400 font-bold block flex items-center space-x-1">
                  <Bell className="w-3.5 h-3.5" />
                  <span>Instant SMS Alerts:</span>
                </span>
                <p className="text-slate-400 text-[11px] font-sans">
                  Instant SMS text dispatch for anonymous information, vessel approaches, and anomalous drift deviations.
                </p>
              </div>
            </div>

            {/* Direct Web App URL */}
            <div className="p-3 bg-slate-950 rounded-xl border border-teal-900/60 space-y-2">
              <span className="text-slate-400 text-[10px] block font-bold">
                DIRECT PUBLIC URL FOR OPPO A6X CHROME BROWSER (NO LOGIN REQUIRED):
              </span>
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-teal-300 font-mono select-all break-all">
                {workingPublicUrl}
              </div>
            </div>
          </div>

          {/* Action Button Footer */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-800 text-xs">
            {onOpenSmsAlerts && (
              <button
                onClick={onOpenSmsAlerts}
                className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white rounded-xl font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>CONFIGURE SMS ALERTS FOR ANONYMOUS INFO</span>
              </button>
            )}

            <button
              onClick={() => handleFieldPulse()}
              disabled={isPinging}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-teal-300 rounded-xl font-bold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-300" />
              <span>TEST REMOTE BRINE PULSE</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
