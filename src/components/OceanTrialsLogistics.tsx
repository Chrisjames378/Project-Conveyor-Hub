import React, { useState } from 'react';
import { 
  Anchor, 
  CheckSquare, 
  Square, 
  FileText, 
  ShieldAlert, 
  Copy, 
  Check, 
  Download, 
  Navigation,
  Layers,
  MapPin,
  Compass
} from 'lucide-react';
import { downloadFile } from '../utils/exportUtils';

interface AssemblyStep {
  id: string;
  subsystem: string;
  stepTitle: string;
  specification: string;
  completed: boolean;
}

export const OceanTrialsLogistics: React.FC = () => {
  const [assemblySteps, setAssemblySteps] = useState<AssemblyStep[]>([
    { id: 'step-1', subsystem: 'Pressure Hull', stepTitle: 'Torque Grade 5 Titanium Cylinder Bolts to 45 Nm', specification: 'Fluoropolymer coated O-ring seal with M10 marine stainless hardware', completed: true },
    { id: 'step-2', subsystem: 'Salinity Pump', stepTitle: 'Align Ceramic Dual-Chamber Impeller Shafts', specification: 'Check zero-corrosion ceramic sleeve clearance at 120 L/min pressure', completed: true },
    { id: 'step-3', subsystem: 'Power Grid', stepTitle: 'Pot 24V 2.4kWh LiFePO4 Battery in IP68 Marine Resin', specification: 'Thermal cutoff fuse set to 60°C with BMS cell balancing', completed: true },
    { id: 'step-4', subsystem: 'Wave Harvester', stepTitle: 'Attach Piezo-Kinetic Float & Oscillating Water Column Collar', specification: 'Test peak kinetic absorption at 350W wave power input', completed: false },
    { id: 'step-5', subsystem: 'Telemetry', stepTitle: 'Flash Subsea Modem & Verify Iridium SBD Satellite Ping', specification: 'Test sub-surface acoustic transponder handshake at 200kHz', completed: false },
    { id: 'step-6', subsystem: 'Mooring Rig', stepTitle: 'Inspect Kevlar Tether & Test Ultrasonic Release Shackle', specification: '5-ton breaking strain, 500m depth rated acoustic release trigger', completed: false }
  ]);

  // Notice state
  const [trialZone, setTrialZone] = useState('Hauraki Gulf Outer Reach (Auckland EEZ Boundary)');
  const [targetLat, setTargetLat] = useState('-36.421');
  const [targetLng, setTargetLng] = useState('175.102');
  const [testDurationDays, setTestDurationDays] = useState(30);
  const [copiedNotice, setCopiedNotice] = useState(false);

  const toggleStep = (id: string) => {
    setAssemblySteps(prev => prev.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const completedCount = assemblySteps.filter(s => s.completed).length;

  const maritimenzNoticeText = `NOTICE TO MARINERS & MARITIME NZ PERMITTED ACTIVITY NOTIFICATION
------------------------------------------------------------------
DATE: 2026-09-07
ISSUING ENTITY: SaliBuoy Systems (Sole Trader / NZBN Pending)
ENGINEERING BASE: Pukekohe, Auckland, New Zealand

1. BUOY DEPLOYMENT LOCATION & GPS COORDINATES
   - Test Location Name: ${trialZone}
   - Coordinates: Latitude ${targetLat}° S, Longitude ${targetLng}° E
   - Planned Trial Duration: ${testDurationDays} Consecutive Days

2. NAVIGATION AID & SAFETY MARKINGS (MARITIME NZ COLREGS)
   - Visual Aid: Yellow IALA Special Mark Buoy Hull
   - Light Sequence: Yellow Flashing Beacon (Fl Y 4s, Nominal Range 5 Nautical Miles)
   - Electronic Radar: Radar Reflector + Class-B AIS Transponder ("SaliBuoy-Sentinel")

3. SUBSEA ACTIVITY & ENVIRONMENTAL STATEMENT
   - Activity: Autonomous subsurface extraction and localized diffusion of natural concentrated ocean brine (42.0 PSU).
   - Additives: 100% ZERO synthetic chemicals or anti-scalants.
   - Environmental Impact: Compliant with Environmental Protection Authority (EPA) EEZ Permitted Activity guidelines for scientific research.

CONTACT FOR MARINERS:
Emergency Marine Contact: SaliBuoy Systems Operations (Auckland, NZ)`;

  const copyNotice = () => {
    navigator.clipboard.writeText(maritimenzNoticeText);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950 border border-slate-800 rounded-2xl p-6 space-y-3">
        <div className="flex items-center space-x-2 text-xs font-mono text-sky-400">
          <Anchor className="w-4 h-4" />
          <span>Hardware Fabrication & Coastal Deployment Logistics</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Mark-II Hardware Assembly & Ocean Trials Logistics
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Step-by-step physical assembly checklist for the Mark-II subsurface salinity buoy, plus Maritime NZ Notice to Mariners & EPA EEZ Permitted Activity Notice generator.
        </p>
      </div>

      {/* Assembly Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-400">
              <Layers className="w-4 h-4" />
              <span>Pukekohe DeepTech Facility Assembly Log</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">Mark-II Subsurface Injector Fabrication Checklist</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            {completedCount} of {assemblySteps.length} Subsystems Verified
          </span>
        </div>

        <div className="space-y-3">
          {assemblySteps.map((s) => (
            <div
              key={s.id}
              onClick={() => toggleStep(s.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                s.completed 
                  ? 'bg-emerald-950/20 border-emerald-900/60' 
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <button type="button" className="mt-0.5 text-slate-400">
                {s.completed ? (
                  <CheckSquare className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </button>

              <div className="space-y-1 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    {s.subsystem}
                  </span>
                </div>
                <h4 className={`text-sm font-bold ${s.completed ? 'text-emerald-300 line-through' : 'text-white'}`}>
                  {s.stepTitle}
                </h4>
                <p className="text-xs text-slate-400 font-mono">{s.specification}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Maritime NZ & EPA EEZ Notice Generator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-sky-400">
              <Navigation className="w-4 h-4" />
              <span>Government Maritime Compliance</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">Maritime NZ Notice to Mariners Generator</h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={copyNotice}
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition-colors cursor-pointer"
            >
              {copiedNotice ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedNotice ? 'Copied Notice!' : 'Copy Notice'}</span>
            </button>

            <button
              onClick={() => downloadFile(maritimenzNoticeText, 'MaritimeNZ_Notice_To_Mariners.txt', 'text/plain')}
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-sky-950 hover:bg-sky-900 border border-sky-800 text-sky-200 rounded-lg text-xs font-mono transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download TXT</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-mono mb-1">Ocean Trial Zone Name</label>
            <input
              type="text"
              value={trialZone}
              onChange={(e) => setTrialZone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-mono mb-1">Target Latitude (°S)</label>
            <input
              type="text"
              value={targetLat}
              onChange={(e) => setTargetLat(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-mono mb-1">Target Longitude (°E)</label>
            <input
              type="text"
              value={targetLng}
              onChange={(e) => setTargetLng(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
          {maritimenzNoticeText}
        </pre>
      </div>
    </div>
  );
};
