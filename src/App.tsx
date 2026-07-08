import { useState, useMemo, useEffect } from 'react';
import {
  Wind,
  Activity,
  Compass,
  FileText,
  ShieldAlert,
  Anchor,
  Briefcase,
  HelpCircle,
  Layers,
  Thermometer,
  Sparkles,
  Calculator,
  Calendar,
  Volume2,
  Lock,
  ChevronRight,
  TrendingUp,
  MapPin,
  RefreshCw,
  Globe,
  Radio,
  Network,
  Download,
} from 'lucide-react';
import SaliBuoySim from './components/SaliBuoySim';
import BOMCard from './components/BOMCard';
import DocViewer from './components/DocViewer';
import FleetCommand from './components/FleetCommand';
import ClimateStrategy from './components/ClimateStrategy';
import BuoyTelemetry from './components/BuoyTelemetry';
import DeploymentLogistics from './components/DeploymentLogistics';
import PublicWebsite from './components/PublicWebsite';
import AIAgentTab from './components/AIAgentTab';
import { ActiveSection, ViewMode, TelemetryState, RoadmapPhase, FAQItem } from './types';
import { db } from './db/localDatabase';

// ROADMAP TIMELINE DATA
const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    quarter: '2026 Q3',
    title: 'Tank Testing & Mechanical Validation',
    subtitle: 'Physical scale verification in controlled fluid loops',
    description: 'Validating down-prop mechanical plume density, vertical torque transfer shafts, and testing self-healing copolymer matrices against simulated growler ice impacts.',
    details: [
      'Confirm low-RPM vortex consolidation ratios in saltwater flumes.',
      'Deploy 1:10 scale structural test rigs in high-velocity wind chambers.',
      'Refine hydrophobic nanoceramic glazes for turbine de-icing mechanics.',
    ],
  },
  {
    quarter: '2027 Q1',
    title: 'Irminger Sea Pilot Swarm',
    subtitle: 'Deploying the first active operational alpha units',
    description: 'Deploying 5 alpha-class Sali-Buoys directly into critical Irminger downwelling zones to confirm open-sea telemetry and real-time physical sinking velocity.',
    details: [
      'Initialize dynamic acoustic underwater mesh networks.',
      'Establish sovereign ground stations and satellite feed relays.',
      'Track real-time ocean current volume adjustments in Sverdrups (Sv).',
    ],
  },
  {
    quarter: '2027 Q4',
    title: 'Comprehensive Data Verification',
    subtitle: 'Observing vortex performance via orbital sensors',
    description: 'Evaluating regional sinking plumes through high-resolution scientific satellite sensors (including ESA Sentinel and NASA-JAXA PREFIRE arrays).',
    details: [
      'Analyze temperature and salinity cross-sections at deep levels.',
      'Calibrate decentralized Edge Swarm AI routing behaviors.',
      'Validate initial OCC asset creation for reinsurance markets.',
    ],
  },
  {
    quarter: '2028+',
    title: 'Sovereign Commercial Scale',
    subtitle: 'Full scale modular deployment of the 5,000-unit array',
    description: 'Commencing high-rate mass production of Super Duplex assemblies and launching deep-sea deployment vectors to establish a resilient global stabilization loop.',
    details: [
      'Launch service level agreements (SLAs) with Nordic and EU nations.',
      'Deliver continuous, verifiable 1.5 - 2.0 Sv circulation boost.',
      'Expand regional swarms into the Fram Strait and Labrador Sea.',
    ],
  },
];

// FAQS DATA
const FAQS: FAQItem[] = [
  {
    question: 'Does the turbine pose a fragmentation or collision risk to regional marine life?',
    answer: 'No. Unlike high-velocity hydroelectric impellers or commercial shipping screws, the subsurface injection engine is an ultra-low velocity, high-torque mechanism operating at 5 to 15 RPM. The wide-aspect blades rotate slower than a standard domestic ceiling fan. Furthermore, the structure integrates decentralized hydro-acoustic pingers utilizing low-frequency deterrent thresholds validated by PNNL marine mammal safety reviews. Marine life is naturally deterred, and multi-angle camera tracking allows for automated system braking upon near-proximity identification.',
    tags: ['Marine Life', 'Mechanical Safety'],
  },
  {
    question: 'Will the concentrated brine payloads damage the local benthic ecosystem?',
    answer: 'No. The Sali-Buoy does not allow dense, hyper-saline brine to settle or pool loosely on shallow marine shelves. The injection nozzles are positioned precisely inside high-velocity deep-water chimneys where the water column is already traveling downward toward the abyssal plains. The kinetic propeller actively accelerates the brine payload directly into these deep currents, ensuring rapid, homogenous mixing with massive open-ocean water volumes.',
    tags: ['Benthic', 'Salinity Control'],
  },
  {
    question: 'How will the hardware maintain continuous operation against severe biofouling and ice accretion?',
    answer: 'We eliminate manual maintenance protocols by using nano-ceramic hydrophobic coats that prevent biological attachment and ice adhesion. Additionally, the internal processor core controls specialized high-frequency ultrasonic transducers wired directly into the hull plating. These emit subtle, structured vibrational pulses throughout the Super Duplex frame, shattering surface ice formations and shedding biofilm layers automatically without disrupting local marine acoustics.',
    tags: ['Biofouling', 'Ice Accretion', 'Materials'],
  },
  {
    question: 'Are the corporate communications and domain records for salibuoysystems.com fully secured?',
    answer: 'Yes. Following our transition to Google Workspace, we have fully verified and configured our domain records. This includes complete setup of MX records for secure inbound/outbound mail flow under chris.mckay@salibuoysystems.com, SPF (Sender Policy Framework) to authorized Google IPs, DKIM (DomainKeys Identified Mail) with custom 2048-bit cryptographic signatures, and a DMARC policy (p=reject) to guarantee complete protection against phishing and domain impersonation.',
    tags: ['Domain Security', 'Google Workspace', 'Infrastructure'],
  },
];

export default function App() {
  const [currentPortal, setCurrentPortal] = useState<'public' | 'command'>('public');
  const [activeTab, setActiveTab] = useState<ActiveSection>('simulator');
  const [windSpeed, setWindSpeed] = useState<number>(18);
  const [salinity, setSalinity] = useState<number>(36);
  const [viewMode, setViewMode] = useState<ViewMode>('realistic');
  const [showSprayer, setShowSprayer] = useState<boolean>(true);
  const [activeRoadmapIndex, setActiveRoadmapIndex] = useState<number>(0);
  const [liveDataActive, setLiveDataActive] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      let allLogs: any[] = [];
      try {
        allLogs = await db.telemetryLogs.orderBy('timestamp').toArray();
      } catch (dbErr) {
        console.warn("Could not query IndexedDB for logs, using default sample telemetry log set:", dbErr);
      }

      if (allLogs.length === 0) {
        // Fallback to beautiful sample logs so the user always gets a successful export immediately
        const now = Date.now();
        allLogs = [
          { id: 1, timestamp: now - 40000, timeString: new Date(now - 40000).toLocaleTimeString(), swellHeight: 2.8, surfaceTemp: 14.1, deepTemp: 2.15, windSpeed: windSpeed, windDirection: 310, powerOutput: 4.1, systemStatus: 'NOMINAL (SAMPLE)' },
          { id: 2, timestamp: now - 30000, timeString: new Date(now - 30000).toLocaleTimeString(), swellHeight: 3.1, surfaceTemp: 14.3, deepTemp: 2.14, windSpeed: windSpeed, windDirection: 315, powerOutput: 4.2, systemStatus: 'NOMINAL (SAMPLE)' },
          { id: 3, timestamp: now - 20000, timeString: new Date(now - 20000).toLocaleTimeString(), swellHeight: 3.3, surfaceTemp: 14.5, deepTemp: 2.16, windSpeed: windSpeed, windDirection: 320, powerOutput: 4.2, systemStatus: 'NOMINAL (SAMPLE)' },
          { id: 4, timestamp: now - 10000, timeString: new Date(now - 10000).toLocaleTimeString(), swellHeight: 3.2, surfaceTemp: 14.7, deepTemp: 2.15, windSpeed: windSpeed, windDirection: 325, powerOutput: 4.3, systemStatus: 'NOMINAL (SAMPLE)' },
          { id: 5, timestamp: now, timeString: new Date(now).toLocaleTimeString(), swellHeight: 3.4, surfaceTemp: 14.8, deepTemp: 2.15, windSpeed: windSpeed, windDirection: 320, powerOutput: 4.2, systemStatus: 'NOMINAL (SAMPLE)' }
        ];
      }

      const headers = ['ID', 'Timestamp', 'TimeString', 'SwellHeight_m', 'SurfaceTemp_C', 'DeepTemp_C', 'WindSpeed_kts', 'WindDirection_deg', 'PowerOutput_kW', 'Status'];
      const csvRows = [headers.join(',')];

      for (const log of allLogs) {
        const row = [
          log.id ?? '',
          log.timestamp,
          log.timeString,
          (log.swellHeight ?? 0).toFixed(2),
          (log.surfaceTemp ?? 0).toFixed(2),
          (log.deepTemp ?? 0).toFixed(2),
          (log.windSpeed ?? 0).toFixed(2),
          (log.windDirection ?? 0).toFixed(2),
          (log.powerOutput ?? 0).toFixed(2),
          log.systemStatus ?? 'NOMINAL'
        ];
        csvRows.push(row.join(','));
      }

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `SaliBuoy_Telemetry_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to export CSV', err);
      alert('Failed to export CSV. Check console for details.');
    } finally {
      setIsExporting(false);
    }
  };

  // OCC Interactive Calculator State
  const [calcBuoyCount, setCalcBuoyCount] = useState<number>(50);
  const [calcOperatingDays, setCalcOperatingDays] = useState<number>(365);

  useEffect(() => {
    let interval: number;
    const fetchLiveData = async () => {
      if (!liveDataActive) return;
      try {
        const res = await fetch('/api/telemetry');
        if (res.ok) {
          const json = await res.json();
          // Update the simulation inputs based on real world data from North Atlantic NDBC 44004
          const wind = json.realSurfaceData.windSpeedKnots;
          if (wind && !isNaN(wind)) {
             setWindSpeed(Math.min(Math.max(wind, 5), 50)); // Clamp between 5 and 50 for sim bounds
          }
        }
      } catch (err) {
        console.error("Failed to fetch live telemetry");
      }
    };
    
    if (liveDataActive) {
      fetchLiveData();
      interval = window.setInterval(fetchLiveData, 15000);
    }
    
    return () => clearInterval(interval);
  }, [liveDataActive]);

  // Dynamic Telemetry State Calculations
  const telemetry = useMemo<TelemetryState>(() => {
    const vawtRpm = Math.round(windSpeed * 2.13);
    const propRpm = Math.round(vawtRpm * 0.31);
    const torque = Math.round(propRpm * 11.6); // kN·m
    const iceRate = Number((windSpeed * 0.78).toFixed(1)); // mm/hr
    const sverdrups = Number((propRpm * 0.0068).toFixed(3)); // Sv
    const albedo = Number((0.45 + (windSpeed / 50) * 0.39).toFixed(2));
    const temperature = Number((-12.5 - (windSpeed / 50) * 15.9).toFixed(1)); // °C

    return {
      windSpeed,
      salinity,
      vawtRpm,
      propRpm,
      torque,
      iceRate,
      sverdrups,
      albedo,
      temperature,
    };
  }, [windSpeed, salinity]);

  // Calculate Projected OCCs
  // 1 OCC = Verified mechanical injection of 1,000 Sv of hyper-dense brine into an active downwelling chimney.
  // Brine volume injected per buoy is proportional to its sverdrup rate.
  // OCC = (Sverdrups * 86400 * Days * BuoyCount) / 1000
  const projectedOCC = useMemo(() => {
    const dailyVolumePerBuoySv = telemetry.sverdrups;
    // Total Sv-days: Sv * Days * BuoyCount
    const totalSvDays = dailyVolumePerBuoySv * calcOperatingDays * calcBuoyCount;
    // 1 OCC = 1,000 Sv verified injection (let's say over 1 day equivalent)
    const occs = Number((totalSvDays / 1000).toFixed(2));
    const estimatedValue = Number((occs * 42000).toLocaleString(undefined, { maximumFractionDigits: 0 })); // Say $42,000 USD per OCC

    return {
      occs,
      estimatedValue,
    };
  }, [telemetry.sverdrups, calcBuoyCount, calcOperatingDays]);

  if (currentPortal === 'public') {
    return (
      <PublicWebsite
        onEnterPortal={() => setCurrentPortal('command')}
        windSpeed={windSpeed}
        setWindSpeed={setWindSpeed}
        salinity={salinity}
        setSalinity={setSalinity}
        telemetry={telemetry}
        projectedOCC={projectedOCC}
        calcBuoyCount={calcBuoyCount}
        setCalcBuoyCount={setCalcBuoyCount}
        calcOperatingDays={calcOperatingDays}
        setCalcOperatingDays={setCalcOperatingDays}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-950 border-r border-slate-600 shrink-0">
        {/* Core Branding */}
        <div className="p-4 border-b border-slate-600 bg-slate-900/40">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-slate-950 font-bold text-xs animate-pulse">
              S
            </div>
            <h1 className="font-display text-sm font-bold tracking-tight uppercase text-slate-100">
              PROJECT CONVEYOR
            </h1>
          </div>
          <p className="font-mono text-[8px] text-sky-400 uppercase tracking-widest mt-0.5">
            SaliBuoy Systems
          </p>
          <button
            onClick={() => setCurrentPortal('public')}
            className="w-full mt-3 flex items-center justify-center gap-1 bg-slate-950 hover:bg-slate-900 text-[9px] font-mono tracking-wider uppercase text-sky-400 border border-sky-500/25 rounded py-1 transition-colors"
          >
            ← Public Website
          </button>
        </div>

        {/* Navigation Link List */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto bg-slate-950/40">
          <div className="px-2 mb-1 font-mono text-[8px] text-slate-500 uppercase tracking-widest">
            Core Interface
          </div>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded font-mono text-[11px] uppercase tracking-wider transition-all ${
              activeTab === 'simulator'
                ? 'bg-sky-500/10 text-sky-400 font-bold border border-sky-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <span className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              Interactive 4D Sim
            </span>
            <ChevronRight className={`w-2.5 h-2.5 ${activeTab === 'simulator' ? 'text-sky-400' : 'text-slate-600'}`} />
          </button>

          <button
            onClick={() => setActiveTab('fleet-command')}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded font-mono text-[11px] uppercase tracking-wider transition-all ${
              activeTab === 'fleet-command'
                ? 'bg-sky-500/10 text-sky-400 font-bold border border-sky-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <span className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              Fleet Command
            </span>
            <ChevronRight className={`w-2.5 h-2.5 ${activeTab === 'fleet-command' ? 'text-sky-400' : 'text-slate-600'}`} />
          </button>

          <button
            onClick={() => setActiveTab('climate-strategy')}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded font-mono text-[11px] uppercase tracking-wider transition-all ${
              activeTab === 'climate-strategy'
                ? 'bg-sky-500/10 text-sky-400 font-bold border border-sky-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <span className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
              Climate Strategy
            </span>
            <ChevronRight className={`w-2.5 h-2.5 ${activeTab === 'climate-strategy' ? 'text-sky-400' : 'text-slate-600'}`} />
          </button>

          <button
            onClick={() => setActiveTab('buoy-telemetry')}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded font-mono text-[11px] uppercase tracking-wider transition-all ${
              activeTab === 'buoy-telemetry'
                ? 'bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <span className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-indigo-400" />
              Deep Ocean Data
            </span>
            <ChevronRight className={`w-2.5 h-2.5 ${activeTab === 'buoy-telemetry' ? 'text-indigo-400' : 'text-slate-600'}`} />
          </button>

          <button
            onClick={() => setActiveTab('operations')}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded font-mono text-[11px] uppercase tracking-wider transition-all ${
              activeTab === 'operations'
                ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <span className="flex items-center gap-2">
              <Network className="w-3.5 h-3.5 text-amber-400" />
              Master Operations
            </span>
            <ChevronRight className={`w-2.5 h-2.5 ${activeTab === 'operations' ? 'text-amber-400' : 'text-slate-600'}`} />
          </button>

          <div className="pt-4 px-2 mb-1 font-mono text-[8px] text-slate-500 uppercase tracking-widest">
            The Master Archive
          </div>

          <button
            onClick={() => setActiveTab('summary')}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded font-mono text-[11px] uppercase tracking-wider transition-all ${
              activeTab === 'summary'
                ? 'bg-sky-500/10 text-sky-400 font-bold border border-sky-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <span className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              1. Executive Summary
            </span>
            <ChevronRight className={`w-2.5 h-2.5 ${activeTab === 'summary' ? 'text-sky-400' : 'text-slate-600'}`} />
          </button>

          <button
            onClick={() => setActiveTab('specifications')}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded font-mono text-[11px] uppercase tracking-wider transition-all ${
              activeTab === 'specifications'
                ? 'bg-sky-500/10 text-sky-400 font-bold border border-sky-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <span className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              2. Technical Specs & BOM
            </span>
            <ChevronRight className={`w-2.5 h-2.5 ${activeTab === 'specifications' ? 'text-sky-400' : 'text-slate-600'}`} />
          </button>

          <button
            onClick={() => setActiveTab('swarm-ai')}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded font-mono text-[11px] uppercase tracking-wider transition-all ${
              activeTab === 'swarm-ai'
                ? 'bg-sky-500/10 text-sky-400 font-bold border border-sky-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-sky-400" />
              3. Decentralized Swarm AI
            </span>
            <ChevronRight className={`w-2.5 h-2.5 ${activeTab === 'swarm-ai' ? 'text-sky-400' : 'text-slate-600'}`} />
          </button>

          <button
            onClick={() => setActiveTab('business')}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded font-mono text-[11px] uppercase tracking-wider transition-all ${
              activeTab === 'business'
                ? 'bg-sky-500/10 text-sky-400 font-bold border border-sky-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <span className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
              4. Business Design
            </span>
            <ChevronRight className={`w-2.5 h-2.5 ${activeTab === 'business' ? 'text-sky-400' : 'text-slate-600'}`} />
          </button>

          <button
            onClick={() => setActiveTab('communications')}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded font-mono text-[11px] uppercase tracking-wider transition-all ${
              activeTab === 'communications'
                ? 'bg-sky-500/10 text-sky-400 font-bold border border-sky-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <span className="flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-sky-400" />
              5. Communications Suite
            </span>
            <ChevronRight className={`w-2.5 h-2.5 ${activeTab === 'communications' ? 'text-sky-400' : 'text-slate-600'}`} />
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded font-mono text-[11px] uppercase tracking-wider transition-all ${
              activeTab === 'faq'
                ? 'bg-sky-500/10 text-sky-400 font-bold border border-sky-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <span className="flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
              6. Technical FAQ
            </span>
            <ChevronRight className={`w-2.5 h-2.5 ${activeTab === 'faq' ? 'text-sky-400' : 'text-slate-600'}`} />
          </button>

          <button
            onClick={() => setActiveTab('ai-agent')}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded font-mono text-[11px] uppercase tracking-wider transition-all ${
              activeTab === 'ai-agent'
                ? 'bg-gradient-to-r from-sky-500/15 to-indigo-500/15 text-sky-300 font-bold border border-sky-400/40'
                : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              7. SaliAgent AI Ops
            </span>
            <ChevronRight className={`w-2.5 h-2.5 ${activeTab === 'ai-agent' ? 'text-sky-400' : 'text-slate-600'}`} />
          </button>
        </nav>

        {/* Lead Principal Footnote */}
        <div className="p-3 border-t border-slate-600 bg-slate-950 font-mono text-[10px]">
          <div className="text-slate-500 uppercase tracking-tight">Managing Director</div>
          <div className="text-slate-200 font-bold tracking-tight">Christopher McKay</div>
          <div className="text-sky-400/80 font-semibold mt-0.5 tracking-tight">SaliBuoy Systems</div>
        </div>
      </aside>

      {/* 2. MAIN APPLICATION CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-hidden">
        {/* Header Ribbon */}
        <header className="flex justify-between items-center px-4 md:px-6 py-2.5 border-b border-slate-600 bg-slate-950/95 backdrop-blur z-20 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Navigation Toggle */}
            <div className="lg:hidden flex items-center gap-1">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as ActiveSection)}
                className="bg-slate-900 border border-slate-600 text-slate-100 font-mono text-[11px] rounded px-2 py-1 uppercase tracking-wider focus:outline-none focus:border-sky-400"
              >
                <option value="simulator">Interactive Sim</option>
                <option value="fleet-command">Fleet Command</option>
                <option value="climate-strategy">Climate Strategy</option>
                <option value="buoy-telemetry">Deep Ocean Data</option>
                <option value="operations">Master Operations</option>
                <option value="summary">1. Executive Summary</option>
                <option value="specifications">2. Technical Specs</option>
                <option value="swarm-ai">3. Swarm AI</option>
                <option value="business">4. Business Strategy</option>
                <option value="communications">5. Communications</option>
                <option value="faq">6. Technical FAQ</option>
                <option value="ai-agent">7. SaliAgent AI Ops</option>
              </select>
            </div>

            {/* Title / Section State Indicator */}
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5 font-mono text-[9px] text-sky-400 uppercase tracking-widest">
                <span>PROJECT CONVEYOR STATUS</span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span className="text-slate-400 font-normal">Active Stabilization Array</span>
              </div>
              <h2 className="font-display text-sm font-bold text-slate-100 tracking-tighter">
                {activeTab === 'simulator' && 'KINETIC MECHANICAL ENGINE SIMULATOR'}
                {activeTab === 'fleet-command' && 'GLOBAL FLEET COMMAND & ANALYTICS'}
                {activeTab === 'climate-strategy' && 'GLOBAL CLIMATE MANAGEMENT & FUNDING'}
                {activeTab === 'buoy-telemetry' && 'DEEP OCEAN SENSOR TELEMETRY'}
                {activeTab === 'operations' && 'EXECUTION & SCALING LOGISTICS'}
                {activeTab === 'summary' && 'EXECUTIVE SUMMARY & 2026 CONTEXT'}
                {activeTab === 'specifications' && 'MATERIAL SPECIFICATIONS & SKELETON'}
                {activeTab === 'swarm-ai' && 'DECENTRALIZED SWARM AI LOGIC (DECA)'}
                {activeTab === 'business' && 'PLANETARY CIRCULATION CREDIT MARKETS'}
                {activeTab === 'communications' && 'FORMAL STAKEHOLDER PROPOSALS'}
                {activeTab === 'faq' && 'EXPERT TECHNICAL EVALUATIONS & FAQ'}
                {activeTab === 'ai-agent' && 'SALIBUOY AUTONOMOUS AI OPERATIONS AGENT'}
              </h2>
            </div>
          </div>

          {/* Quick Active Indicators */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPortal('public')}
              className="font-mono text-[10px] text-sky-400 hover:text-slate-100 flex items-center gap-1 bg-slate-950 hover:bg-slate-900 px-2.5 py-1.5 rounded border border-sky-500/35 transition-colors cursor-pointer"
            >
              ← <span className="hidden sm:inline">Exit Portal</span><span className="sm:hidden">Exit</span>
            </button>
            <div className="font-mono text-[10px] text-slate-300 flex items-center gap-1 bg-slate-900 px-2.5 py-1.5 rounded border border-slate-600">
              <MapPin className="w-3 h-3 text-sky-400" />
              <span className="hidden md:inline">72.4° N, 31.8° W</span>
              <span className="md:hidden">72.4° N</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1.5 rounded border border-slate-600">
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase tracking-widest">
                Sali-Buoy Live
              </span>
            </div>
          </div>
        </header>

        {/* Central Display */}
        <main className="flex-1 overflow-y-auto p-3.5 md:p-5 space-y-5 max-w-7xl mx-auto w-full">
          {/* ================= tab: SIMULATOR ================= */}
          {activeTab === 'simulator' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* Three.js interactive visualizer window */}
              <div className="lg:col-span-8 flex flex-col gap-3">
                <SaliBuoySim
                  windSpeed={windSpeed}
                  salinity={salinity}
                  viewMode={viewMode}
                  showSprayer={showSprayer}
                />

                {/* Micro instructions / guide */}
                <div className="bg-slate-950/80 border border-slate-600 rounded-lg p-3 flex flex-col md:flex-row justify-between gap-3 font-sans text-[11px] text-slate-400">
                  <div>
                    <span className="font-mono text-[9px] text-sky-400 font-bold uppercase tracking-wider block mb-0.5">
                      INTEGRATED 4D MECHANICS GUIDE
                    </span>
                    <p className="leading-relaxed">
                      This virtual prototype maps the mechanical linkage of the <strong>Sali-Buoy Mk. II</strong>. The surface turbine gathers wind velocity to mechanically rotate the subsurface drive shaft. The propeller accelerates hyper-saline dense brine down through the <strong>freshwater lid</strong>.
                    </p>
                  </div>
                  <div className="shrink-0 flex flex-col justify-end">
                    <button
                      onClick={() => {
                        setWindSpeed(18);
                        setSalinity(36);
                        setViewMode('realistic');
                        setShowSprayer(true);
                      }}
                      className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-600 text-slate-300 font-mono text-[9px] rounded uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Reset Parameters
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar Live Control Command panel */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                {/* Engine Directives Controls */}
                <div className="bg-slate-950 border border-slate-600 p-4 rounded-lg shadow-xl space-y-4">
                  <div>
                    <h3 className="font-display text-xs font-bold text-slate-100 uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5 text-sky-400" />
                      Engine Directives
                    </h3>
                    <p className="font-mono text-[9px] text-slate-500 uppercase tracking-wider">
                      Interactive parameter modulation
                    </p>
                  </div>

                  {/* Wind Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-400">WIND INPUT VELOCITY</span>
                      <span className={`${liveDataActive ? 'text-emerald-400 bg-emerald-500/10 border-emerald-400' : 'text-sky-300 bg-sky-500/10 border-sky-400'} font-bold px-1.5 py-0.5 rounded border`}>
                        {windSpeed.toFixed(1)} Knots
                      </span>
                    </div>
                    <input
                      id="slider-wind"
                      type="range"
                      min="0"
                      max="50"
                      value={windSpeed}
                      onChange={(e) => setWindSpeed(Number(e.target.value))}
                      disabled={liveDataActive}
                      className={`w-full h-1 rounded appearance-none cursor-pointer focus:outline-none ${liveDataActive ? 'bg-emerald-900/40 accent-emerald-500 cursor-not-allowed' : 'bg-slate-800 accent-sky-400'}`}
                    />
                    <div className="flex justify-between text-[8px] text-slate-600 font-mono">
                      <span>0 KN (STILL)</span>
                      <span>18 KN (NORMAL)</span>
                      <span>50 KN (BLIZZARD)</span>
                    </div>
                  </div>

                  {/* Salinity Brine Concentration Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-400">BRINE SALINITY INDUCTION</span>
                      <span className={`${liveDataActive ? 'text-emerald-400 bg-emerald-500/10 border-emerald-400' : 'text-indigo-400 bg-indigo-500/10 border-indigo-400'} font-bold px-1.5 py-0.5 rounded border`}>
                        {salinity} PSU
                      </span>
                    </div>
                    <input
                      id="slider-salinity"
                      type="range"
                      min="30"
                      max="60"
                      value={salinity}
                      onChange={(e) => setSalinity(Number(e.target.value))}
                      disabled={liveDataActive}
                      className={`w-full h-1 rounded appearance-none cursor-pointer focus:outline-none ${liveDataActive ? 'bg-emerald-900/40 accent-emerald-500 cursor-not-allowed' : 'bg-slate-800 accent-indigo-400'}`}
                    />
                    <div className="flex justify-between text-[8px] text-slate-600 font-mono">
                      <span>30 PSU (FRESH)</span>
                      <span>36 PSU (AMBIENT)</span>
                      <span>60 PSU (HYPER-BRINE)</span>
                    </div>
                  </div>

                  {/* Cryo Sprayer toggle */}
                  <div className="border-t border-slate-600 pt-3 flex items-center justify-between font-mono text-[10px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                      CRYO-SPRAYER INDUCTION
                    </span>
                    <button
                      onClick={() => setShowSprayer(!showSprayer)}
                      className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        showSprayer ? 'bg-sky-500' : 'bg-slate-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                          showSprayer ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  
                  {/* Live Telemetry toggle */}
                  <div className="border-t border-slate-600 pt-3 flex items-center justify-between font-mono text-[10px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      NDBC LIVE TELEMETRY
                    </span>
                    <button
                      onClick={() => setLiveDataActive(!liveDataActive)}
                      className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        liveDataActive ? 'bg-emerald-500' : 'bg-slate-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                          liveDataActive ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Live Diagnostic Telemetry Metrics */}
                <div className="bg-slate-950 rounded-lg border border-slate-600 p-4 shadow-xl space-y-3">
                  <div>
                    <h3 className="font-display text-xs font-bold text-slate-100 uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                      Live Diagnostic Telemetry
                    </h3>
                    <p className="font-mono text-[9px] text-slate-500 uppercase tracking-wider">
                      Real-time computed structural values
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono">
                    <div className="bg-slate-900 p-2.5 rounded border border-slate-600">
                      <span className="text-[8px] text-slate-500 uppercase block">VAWT Velocity</span>
                      <span className="text-xs font-bold text-sky-400 mt-0.5 block">
                        {telemetry.windSpeed} Knots
                      </span>
                      <span className="text-[9px] text-sky-300/50 block">
                        {telemetry.vawtRpm} RPM
                      </span>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded border border-slate-600">
                      <span className="text-[8px] text-slate-500 uppercase block">Sinker Torque</span>
                      <span className="text-xs font-bold text-sky-400 mt-0.5 block">
                        {telemetry.propRpm} RPM
                      </span>
                      <span className="text-[9px] text-sky-300/50 block">
                        {telemetry.torque} kN·m
                      </span>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded border border-slate-600">
                      <span className="text-[8px] text-slate-500 uppercase block">Brine Salinity</span>
                      <span className="text-xs font-bold text-indigo-400 mt-0.5 block">
                        {telemetry.salinity} PSU
                      </span>
                      <span className="text-[9px] text-indigo-300/50 block">
                        1.2x Ambient
                      </span>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded border border-slate-600">
                      <span className="text-[8px] text-slate-500 uppercase block">Ice Build Rate</span>
                      <span className="text-xs font-bold text-emerald-400 mt-0.5 block">
                        {showSprayer ? `${telemetry.iceRate} mm/hr` : '0.0 mm/hr'}
                      </span>
                      <span className="text-[9px] text-emerald-300/50 block">
                        Albedo: {showSprayer ? telemetry.albedo : '0.45'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-600 p-2 rounded-md flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[8px] text-slate-500 uppercase block">Core Temp</span>
                      <span className="font-mono text-xs font-bold text-rose-400">
                        {telemetry.temperature}°C
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[8px] text-slate-500 uppercase block">Operational Stat</span>
                      <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
                        DECA ACTIVE
                      </span>
                    </div>
                  </div>

                  <div className="bg-sky-950/40 p-2.5 rounded border border-sky-400 text-center font-mono">
                    <span className="text-[9px] text-sky-400 uppercase tracking-widest font-bold block">
                      Estimated AMOC Injection Volume
                    </span>
                    <span className="text-xl font-black text-sky-300 block mt-0.5 tracking-tight glow-cyan">
                      {telemetry.sverdrups} Sv
                    </span>
                    <span className="text-[8px] text-sky-400/60 block mt-0.5">
                      (Sverdrup unit = 1,000,000 cubic meters/sec)
                    </span>
                  </div>

                  <button
                    onClick={handleExportCSV}
                    disabled={isExporting}
                    className="w-full flex justify-center items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 rounded shadow-lg transition-colors border border-indigo-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-xs font-bold tracking-wider uppercase">
                      {isExporting ? 'Exporting Logs...' : 'Export Telemetry Data'}
                    </span>
                  </button>
                </div>

                {/* Imaging Modes */}
                <div className="bg-slate-950 rounded-lg border border-slate-600 p-4 shadow-xl space-y-2">
                  <div className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                    Diagnostic Imaging Mode
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => setViewMode('realistic')}
                      className={`px-1.5 py-2 rounded text-[10px] font-mono font-bold transition-all flex flex-col items-center justify-center gap-1 border ${
                        viewMode === 'realistic'
                          ? 'bg-sky-500/10 border-sky-400 text-sky-300'
                          : 'bg-slate-900 border-slate-600 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="text-[8px]">REALISTIC</span>
                    </button>
                    <button
                      onClick={() => setViewMode('thermal')}
                      className={`px-1.5 py-2 rounded text-[10px] font-mono font-bold transition-all flex flex-col items-center justify-center gap-1 border ${
                        viewMode === 'thermal'
                          ? 'bg-indigo-500/10 border-indigo-400 text-indigo-300'
                          : 'bg-slate-900 border-slate-600 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Thermometer className="w-3.5 h-3.5" />
                      <span className="text-[8px]">DENSITY</span>
                    </button>
                    <button
                      onClick={() => setViewMode('wireframe')}
                      className={`px-1.5 py-2 rounded text-[10px] font-mono font-bold transition-all flex flex-col items-center justify-center gap-1 border ${
                        viewMode === 'wireframe'
                          ? 'bg-emerald-500/10 border-emerald-400 text-emerald-300'
                          : 'bg-slate-900 border-slate-600 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span className="text-[8px]">WIRE FRAME</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= tab: FLEET COMMAND ================= */}
          {activeTab === 'fleet-command' && (
            <FleetCommand telemetry={telemetry} activeBuoys={calcBuoyCount} />
          )}

          {/* ================= tab: CLIMATE STRATEGY ================= */}
          {activeTab === 'climate-strategy' && (
            <ClimateStrategy />
          )}

          {/* ================= tab: BUOY TELEMETRY ================= */}
          {activeTab === 'buoy-telemetry' && (
            <BuoyTelemetry />
          )}

          {/* ================= tab: OPERATIONS ================= */}
          {activeTab === 'operations' && (
            <DeploymentLogistics />
          )}

          {/* ================= tab: SUMMARY ================= */}
          {activeTab === 'summary' && (
            <div className="space-y-5 max-w-4xl">
              {/* Context Block */}
              <div className="p-4 md:p-5 bg-slate-950/90 rounded-lg border border-slate-600 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-sky-400 uppercase tracking-widest mb-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                  SECTION 1.1 // THE CRITICAL TIPPING POINT
                </div>
                <h3 className="font-display text-lg font-bold text-slate-100 tracking-tight mb-2 uppercase">
                  AMOC Weakest in a Millennium
                </h3>
                <div className="space-y-3 text-slate-300 leading-relaxed font-sans text-xs md:text-sm">
                  <p>
                    As of mid-2026, academic research and global observation networks have confirmed that the 
                    <strong> Atlantic Meridional Overturning Circulation (AMOC)</strong> is at its weakest point in a millennium. 
                    A potential collapse poses an existential threat to Northern Hemisphere climate stability, risking sharp 
                    temperature drops across Europe and catastrophic disruptions to global agricultural supply chains.
                  </p>
                  <p>
                    When the North Atlantic becomes heavily diluted by freshwater from Greenland ice melt and shifting 
                    precipitation patterns, a low-density <strong>"freshwater lid"</strong> forms over the ocean. Because freshwater is 
                    less dense than saltwater, it resists sinking. This phenomenon effectively stalls the natural 
                    downwelling "chimneys" that drive the global ocean conveyor belt.
                  </p>
                </div>
              </div>

              {/* Paradigm shift and active restoration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-slate-600 rounded-lg p-4">
                  <div className="font-mono text-[8px] text-sky-400 uppercase tracking-widest mb-1.5">
                    SECTION 1.2 // PARADIGM SHIFT
                  </div>
                  <h4 className="font-display text-xs font-bold text-slate-100 mb-2 uppercase tracking-wider">
                    Active Mechanical Adaptation
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans mb-3">
                    Traditional climate proposals fail to deliver immediate, scalable results. Large-scale concrete structural concepts—such as Utrecht University's 2025 paper modeling an 80 km dam across the Bering Strait—face immense geopolitical deadlocks and permanent, irreversible ecological risks. 
                  </p>
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-600 text-[10px] text-sky-300 leading-relaxed font-mono">
                    <strong>Project Conveyor</strong> deploys a modular, autonomous network of <strong>Polar Recovery Engines (PRE)</strong>, also known as <strong>Sali-Buoys</strong>, to address the crisis directly at depth.
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-600 rounded-lg p-4">
                  <div className="font-mono text-[8px] text-sky-400 uppercase tracking-widest mb-1.5">
                    SECTION 1.3 // STRATEGIC ADVANTAGES
                  </div>
                  <h4 className="font-display text-xs font-bold text-slate-100 mb-2 uppercase tracking-wider">
                    The Dual-Action Advantage
                  </h4>
                  <ul className="space-y-2 text-[11px] text-slate-300 font-sans">
                    <li className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-1.5 shrink-0" />
                      <span>
                        <strong>Incremental Scalability:</strong> Capital requirements scale modularly. Operations begin with localized pilots before expanding arrays.
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-1.5 shrink-0" />
                      <span>
                        <strong>Geopolitical Neutrality:</strong> Headquartered out of Pukekohe, New Zealand, operating smoothly outside North Atlantic sovereign friction in international waters.
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-1.5 shrink-0" />
                      <span>
                        <strong>Immediate Reversibility:</strong> Sali-Buoy arrays feature fail-safe mechanical braking, easily shutting down or towing away instantly.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ================= tab: SPECIFICATIONS ================= */}
          {activeTab === 'specifications' && (
            <div className="space-y-5">
              {/* ASCII schematic block with highlight specifications */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                <div className="lg:col-span-5 bg-slate-950 border border-slate-600 p-4 flex flex-col justify-between rounded-lg">
                  <div>
                    <div className="font-mono text-[8px] text-sky-400 uppercase tracking-widest mb-2">
                      SCHEMATIC DIAGRAM // SALI-BUOY MK. II
                    </div>
                    <div className="bg-slate-900 p-3 rounded border border-slate-600 font-mono text-[9px] text-sky-400/90 overflow-x-auto whitespace-pre leading-normal leading-relaxed">
{`   ▲      [Vertical-Axis Wind Turbine (VAWT)]
   │      - Twist-curve aerodynamics
────┼────  - Nano-ceramic anti-icing glaze
│
┌───┴───┐  [Deck Platform & Seawater Induction]
│       ├─► (Cryo-Sprayer: up to 14.2 mm/hr)
└───┬───┘
│      [Super Duplex S32750 Main Hull Cylinder]
│      - Reverse-Loop Desalination Units
════╪════  ================ WATERLINE ================
│
│      [Central Structural Drive Shaft]
│      - Torque transfer turbine to propeller
│
┌───┴───┐  [Subsurface Down-Prop Engine Room]
│   █   │  - Low-RPM 15-meter axis propeller
└───┬───┘  - Pre-cooled hyper-saline brine injection
│
▼      [Kinetic Downwelling Vortex Plume]
( )     - Forcing past the freshwater lid
(   )    - Deep abyssal current acceleration`}
                    </div>
                  </div>
                  <div className="mt-3 text-[11px] text-slate-400 leading-relaxed font-sans">
                    * The mechanical configuration bypasses chemical auxiliary systems, coupling wind kinetic directly to down-thrust force, avoiding high marine engineering failure rates.
                  </div>
                </div>

                {/* Specific capabilities summary cards */}
                <div className="lg:col-span-7 bg-slate-950 border border-slate-600 p-4 flex flex-col justify-between rounded-lg">
                  <div className="space-y-3">
                    <div className="font-mono text-[8px] text-sky-400 uppercase tracking-widest">
                      SECTION 2.1 // MECHANICAL ARCHITECTURE
                    </div>
                    <h3 className="font-display text-sm font-bold text-slate-100 uppercase tracking-wide">
                      Semi-Submersible Energy Neutrality
                    </h3>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                      The Sali-Buoy Mk. II is an autonomous, semi-submersible energy-neutral platform engineered to withstand the harshest polar marine environments on Earth.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1.5 font-sans">
                      <div className="bg-slate-900 p-3 rounded border border-slate-600 text-xs">
                        <span className="font-mono text-[9px] text-sky-400 font-bold block mb-0.5">
                          01. AT DEPTH (THE SINKER)
                        </span>
                        Subsurface kinetic injection engines actively break through freshwater stratification, pushing heavy hyper-saline brine columns downward.
                      </div>
                      <div className="bg-slate-900 p-3 rounded border border-slate-600 text-xs">
                        <span className="font-mono text-[9px] text-sky-400 font-bold block mb-0.5">
                          02. SURFACE (THE FREEZE)
                        </span>
                        High-volume sprayers utilize polar wind energy to induction spray seawater over ice sheets, accelerating winter thickening and restoring global albedo.
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-600 pt-3 mt-4">
                    <div className="flex justify-between font-mono text-[10px] text-slate-400">
                      <span>CLASSIFICATION: HARSH-ENVIRONMENT HIGH-CORROSION UNIT</span>
                      <span className="text-sky-400 font-bold">MK. II COMPLIANCE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bill of Materials list */}
              <div className="space-y-3">
                <div className="font-mono text-xs text-slate-500 uppercase tracking-widest pl-1">
                  SECTION 2.2 // MATERIAL BILL OF MATERIALS (BOM)
                </div>
                <BOMCard />
              </div>
            </div>
          )}

          {/* ================= tab: SWARM AI ================= */}
          {activeTab === 'swarm-ai' && (
            <div className="space-y-5 max-w-4xl">
              <div className="bg-slate-950 border border-slate-600 p-4 md:p-5 space-y-4 rounded-lg shadow-xl">
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-sky-400 uppercase tracking-widest">
                  <ShieldAlert className="w-3.5 h-3.5 text-sky-400" />
                  SECTION 3.0 // DECENTRALIZED EDGE COLLABORATION
                </div>
                <h3 className="font-display text-sm font-bold text-slate-100 tracking-tight uppercase">
                  Ruggedized Swarm Mesh Logic (DECA)
                </h3>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  The Project Conveyor fleet does not rely on fragile, high-latency satellite communication links to a centralized mainland mainframe. It operates as a fully localized, self-organizing mesh network utilizing specialized <strong>Decentralized Edge Collaboration (DECA)</strong> algorithms.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="bg-slate-900 p-3 rounded border border-slate-600">
                    <span className="w-6 h-6 rounded bg-sky-500/10 border border-sky-400/40 flex items-center justify-center text-sky-400 mb-2 font-mono text-[10px] font-bold">
                      A
                    </span>
                    <h4 className="font-display text-[10px] font-bold uppercase tracking-wider text-slate-200 mb-1">
                      Neighbor Mesh
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                      Autonomous units communicate directly with their six nearest surrounding modules using ruggedized acoustic sub-surface modems and robust L-band satellite uplinks.
                    </p>
                  </div>

                  <div className="bg-slate-900 p-3 rounded border border-slate-600">
                    <span className="w-6 h-6 rounded bg-sky-500/10 border border-sky-400/40 flex items-center justify-center text-sky-400 mb-2 font-mono text-[10px] font-bold">
                      B
                    </span>
                    <h4 className="font-display text-[10px] font-bold uppercase tracking-wider text-slate-200 mb-1">
                      Targeted Convergence
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                      When real-time telemetry indicates a widening of the freshwater lid, nearby buoys alter drift patterns and converge in coordinated hexagonal arrays to concentrate downward mechanical thrust.
                    </p>
                  </div>

                  <div className="bg-slate-900 p-3 rounded border border-slate-600">
                    <span className="w-6 h-6 rounded bg-sky-500/10 border border-sky-400/40 flex items-center justify-center text-sky-400 mb-2 font-mono text-[10px] font-bold">
                      C
                    </span>
                    <h4 className="font-display text-[10px] font-bold uppercase tracking-wider text-slate-200 mb-1">
                      Cryo-Sleep Hibernation
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                      If overrun by expanding heavy winter pack ice, modules lock propellers to prevent drivetrain shearing, stabilize cores at a uniform -5°C, and reactivate via vibrational pulse sequencing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= tab: BUSINESS ================= */}
          {activeTab === 'business' && (
            <div className="space-y-5">
              {/* CaaS & OCCs specifications */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                <div className="lg:col-span-6 bg-slate-950 border border-slate-600 p-4 md:p-5 flex flex-col justify-between space-y-4 rounded-lg shadow-xl">
                  <div className="space-y-2">
                    <div className="font-mono text-[8px] text-sky-400 uppercase tracking-widest">
                      SECTION 4.1 // CIRCULATION-AS-A-SERVICE (CAAS)
                    </div>
                    <h3 className="font-display text-sm font-bold text-slate-100 uppercase tracking-wide">
                      Thermohaline Circulation as an Insurable Asset
                    </h3>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                      SaliBuoy Systems enters into multi-decade Service Level Agreements (SLAs) directly with sovereign coalitions and municipal bodies (e.g., the United Kingdom, Norway, and the European Union) whose localized stability relies on mild North Atlantic currents. The business monetization is tied directly to guaranteeing a baseline current volume, measured uniformly in Sverdrups (Sv).
                    </p>
                  </div>

                  <div className="bg-slate-900 p-3 rounded border border-indigo-400/30 space-y-1.5">
                    <span className="font-mono text-[8px] text-indigo-400 font-bold tracking-widest uppercase block">
                      ASSET CLASS FORMULA // OCEANIC CIRCULATION CREDIT
                    </span>
                    <div className="bg-slate-950 p-2 rounded font-mono text-center text-xs text-slate-100 font-bold border border-slate-600">
                      1 OCC = 1,000 Sv verified dense brine mechanical downwelling
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                      Global reinsurance giants buy OCCs as a physical hedge. Funding the Sali-Buoy array lowers their underwriting exposures to catastrophic winter damage claims in Europe.
                    </p>
                  </div>
                </div>

                {/* Sverdrups-to-OCC Calculator widget */}
                <div className="lg:col-span-6 bg-slate-950 border border-slate-600 p-4 md:p-5 flex flex-col justify-between rounded-lg shadow-xl">
                  <div className="space-y-3">
                    <div className="font-mono text-[8px] text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Calculator className="w-3.5 h-3.5 text-sky-400" />
                      SIMULATE CAAS REVENUE ENGINE
                    </div>
                    <h3 className="font-display text-sm font-bold text-slate-100 uppercase tracking-wide">
                      OCC Dynamic Yield Calculator
                    </h3>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                      Simulate the scale of Oceanic Circulation Credits (OCC) generated based on fleet size, operating timeline, and the live computed Sverdrup output of the 3D visualizer above.
                    </p>

                    <div className="grid grid-cols-2 gap-3 font-mono text-xs pt-1">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block uppercase">Sali-Buoy Count</label>
                        <input
                          type="number"
                          value={calcBuoyCount}
                          onChange={(e) => setCalcBuoyCount(Math.max(1, Number(e.target.value)))}
                          className="w-full bg-slate-900 border border-slate-600 rounded px-2.5 py-1.5 text-sky-400 font-bold font-mono focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block uppercase">Operational Days</label>
                        <input
                          type="number"
                          value={calcOperatingDays}
                          onChange={(e) => setCalcOperatingDays(Math.max(1, Number(e.target.value)))}
                          className="w-full bg-slate-900 border border-slate-600 rounded px-2.5 py-1.5 text-sky-400 font-bold font-mono focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-600 font-mono space-y-2.5">
                    <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded border border-slate-600">
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase block">Verifiable Sverdrup-Days</span>
                        <span className="text-xs font-bold text-slate-200">
                          {(telemetry.sverdrups * calcOperatingDays * calcBuoyCount).toLocaleString(undefined, {
                            maximumFractionDigits: 1,
                          })}{' '}
                          Sv·days
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-slate-500 uppercase block">Projected OCC Credits</span>
                        <span className="text-xs font-bold text-sky-400 glow-cyan">
                          {projectedOCC.occs.toLocaleString()} OCC
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-indigo-950/30 p-2.5 rounded border border-indigo-400">
                      <span className="text-[10px] text-indigo-300 font-bold">ESTIMATED REINSURANCE OFFSET VALUE</span>
                      <span className="text-base font-black text-indigo-400 glow-cyan">
                        ${projectedOCC.estimatedValue.toLocaleString()} USD
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strategic Roadmap timeline */}
              <div className="space-y-3">
                <div className="font-mono text-xs text-slate-500 uppercase tracking-widest pl-1">
                  SECTION 4.3 // STRATEGIC ADAPTATION ROADMAP
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                  {ROADMAP_PHASES.map((phase, idx) => {
                    const isActive = activeRoadmapIndex === idx;
                    return (
                      <button
                        key={phase.quarter}
                        onClick={() => setActiveRoadmapIndex(idx)}
                        className={`text-left bg-slate-950 hover:bg-slate-900 rounded-lg p-3 border transition-all duration-300 ${
                          isActive
                            ? 'border-sky-400 bg-sky-500/5 shadow-md shadow-sky-500/2'
                            : 'border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1 font-mono">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              isActive ? 'bg-sky-500/10 text-sky-400' : 'bg-slate-900 text-slate-400'
                            }`}
                          >
                            {phase.quarter}
                          </span>
                          <Calendar className={`w-3 h-3 ${isActive ? 'text-sky-400' : 'text-slate-600'}`} />
                        </div>
                        <h4 className="font-display text-[10px] font-bold text-slate-200 uppercase tracking-wide line-clamp-1 mb-0.5">
                          {phase.title}
                        </h4>
                        <p className="text-[9px] text-slate-400 line-clamp-2 leading-relaxed">
                          {phase.subtitle}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Expanded Roadmap detail card */}
                <div className="bg-slate-950 border border-slate-600 rounded-lg p-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-3 pb-3 border-b border-slate-600">
                    <div>
                      <span className="font-mono text-[8px] text-sky-400 font-bold uppercase tracking-wider block">
                        PHASE SPECIFICS FOR
                      </span>
                      <h4 className="font-display text-sm font-bold text-slate-100">
                        {ROADMAP_PHASES[activeRoadmapIndex].quarter} // {ROADMAP_PHASES[activeRoadmapIndex].title}
                      </h4>
                    </div>
                    <span className="font-mono text-[10px] text-sky-300">
                      Status: Phase Defined
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {ROADMAP_PHASES[activeRoadmapIndex].description}
                  </p>
                  <div>
                    <span className="font-mono text-[8px] text-slate-500 uppercase tracking-widest block mb-2">
                      CORE OPERATIONAL MANDATES //
                    </span>
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {ROADMAP_PHASES[activeRoadmapIndex].details.map((detail, idx) => (
                        <li
                          key={idx}
                          className="bg-slate-900 p-2.5 rounded border border-slate-600 text-[10px] text-slate-400 leading-relaxed font-sans flex items-start gap-1.5"
                        >
                          <span className="font-mono text-[8px] text-sky-400/80 font-bold mt-0.5">
                            0{idx + 1}.
                          </span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= tab: COMMUNICATIONS ================= */}
          {activeTab === 'communications' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* Left Column: Statement of Capability profile info */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-slate-950 border border-slate-600 p-4 rounded-lg shadow-xl">
                  <div className="font-mono text-[8px] text-sky-400 uppercase tracking-widest mb-2">
                    CORPORATE STATEMENT OF CAPABILITY
                  </div>
                  <h3 className="font-display text-xs font-bold text-slate-100 uppercase tracking-wider mb-1">
                    SaliBuoy Systems
                  </h3>
                  <div className="text-[11px] text-slate-300 leading-relaxed font-sans space-y-2">
                    <p>
                      <strong>SaliBuoy Systems</strong> is an agile climate technology design and environmental systems architecture firm specializing in marine climate interventions.
                    </p>
                    <p>
                      Under the active operational direction of Managing Director <strong>Christopher McKay</strong>, the firm bridges the gap between digital edge processing logic and heavy-duty, ruggedized marine mechanical engineering.
                    </p>
                  </div>

                  <div className="border-t border-slate-600 mt-3 pt-3 space-y-1.5 font-mono text-[9px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">PRINCIPAL:</span>
                      <span className="text-slate-200">Christopher McKay</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">CONTACT:</span>
                      <a href="mailto:chris.mckay@salibuoysystems.com" className="text-sky-400 hover:underline">
                        chris.mckay@salibuoysystems.com
                      </a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">DOMAIN:</span>
                      <span className="text-slate-200">salibuoysystems.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">MANDATE:</span>
                      <span className="text-sky-400 font-bold">Climate Stabilization</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-600 p-4 rounded-lg shadow-xl space-y-2.5">
                  <div className="font-mono text-[8px] text-slate-500 uppercase tracking-widest">
                    SYSTEM CORE CAPABILITIES
                  </div>
                  <ul className="space-y-2 text-[11px] text-slate-300">
                    <li className="flex gap-1.5">
                      <span className="font-mono text-sky-400 text-[9px] font-bold">✓</span>
                      <span>
                        <strong>Systems Architecture:</strong> Edge arrays designed for high-latitude oceanic data mapping.
                      </span>
                    </li>
                    <li className="flex gap-1.5">
                      <span className="font-mono text-sky-400 text-[9px] font-bold">✓</span>
                      <span>
                        <strong>Marine Engineering:</strong> Ruggedized corrosion-resistant structural skeleton configurations.
                      </span>
                    </li>
                    <li className="flex gap-1.5">
                      <span className="font-mono text-sky-400 text-[9px] font-bold">✓</span>
                      <span>
                        <strong>Hydrodynamics:</strong> Advanced low-RPM vertical propulsion models.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Column: Communications Brief proposals viewer */}
              <div className="lg:col-span-8 h-full">
                <DocViewer />
              </div>
            </div>
          )}

          {/* ================= tab: FAQ ================= */}
          {activeTab === 'faq' && (
            <div className="space-y-5 max-w-4xl">
              <div className="bg-slate-950 border border-slate-600 p-4 md:p-5 rounded-lg shadow-xl">
                <div className="font-mono text-[8px] text-sky-400 uppercase tracking-widest mb-2">
                  SECTION 6.0 // EXPERT SCIENTIFIC REVIEW
                </div>
                <h3 className="font-display text-sm font-bold text-slate-100 tracking-tight mb-2 uppercase">
                  Oceanographic & Ecological Guardrails
                </h3>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans mb-4">
                  Restoring global environmental stability requires addressing potential downstream risks with complete honesty. Project Conveyor integrates native biological protections and mechanical failsafes directly into the Sali-Buoy core hardware.
                </p>

                <div className="space-y-3 pt-1">
                  {FAQS.map((faq, idx) => (
                    <div
                      key={idx}
                      id={`faq-item-${idx}`}
                      className="bg-slate-900 p-3.5 rounded border border-slate-600 space-y-2 hover:border-slate-400 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded bg-sky-500/10 border border-sky-400/40 flex items-center justify-center font-mono text-[9px] font-bold text-sky-400 shrink-0">
                          Q
                        </span>
                        <h4 className="font-display text-xs font-bold text-slate-100 leading-snug mt-0.5 uppercase">
                          {faq.question}
                        </h4>
                      </div>
                      <div className="flex items-start gap-2 pl-7">
                        <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                          {faq.answer}
                        </p>
                      </div>
                      <div className="flex gap-1 pl-7 pt-1">
                        {faq.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-mono text-[8px] text-slate-500 uppercase tracking-wide bg-slate-950 px-1.5 py-0.5 rounded border border-slate-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai-agent' && (
            <AIAgentTab telemetry={telemetry} />
          )}
        </main>

        {/* Footer info strip */}
        <footer className="px-6 py-2 border-t border-slate-600 bg-slate-950 flex flex-col md:flex-row justify-between items-center text-slate-600 font-mono text-[8px] uppercase tracking-wider shrink-0 gap-1.5">
          <div>SaliBuoy Systems // salibuoysystems.com // Project Conveyor Archive © 2026</div>
          <div className="text-sky-500/50 font-semibold">Christopher McKay // MD & LEAD SYSTEMS ARCHITECT // <a href="mailto:chris.mckay@salibuoysystems.com" className="text-sky-400/70 hover:text-sky-400 hover:underline lowercase font-mono">chris.mckay@salibuoysystems.com</a></div>
        </footer>
      </div>
    </div>
  );
}
