import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wind,
  Activity,
  Anchor,
  Briefcase,
  HelpCircle,
  Layers,
  Thermometer,
  Sparkles,
  Calculator,
  Calendar,
  Lock,
  ChevronRight,
  TrendingUp,
  MapPin,
  RefreshCw,
  Globe,
  Radio,
  Network,
  Download,
  Mail,
  ArrowRight,
  Check,
  Send,
  ShieldAlert,
  FileText
} from 'lucide-react';
import { TelemetryState, RoadmapPhase } from '../types';

interface PublicWebsiteProps {
  onEnterPortal: () => void;
  windSpeed: number;
  setWindSpeed: (val: number) => void;
  salinity: number;
  setSalinity: (val: number) => void;
  telemetry: TelemetryState;
  projectedOCC: {
    occs: number;
    estimatedValue: number;
  };
  calcBuoyCount: number;
  setCalcBuoyCount: (val: number) => void;
  calcOperatingDays: number;
  setCalcOperatingDays: (val: number) => void;
}

const ROADMAP_STEPS: RoadmapPhase[] = [
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

export default function PublicWebsite({
  onEnterPortal,
  windSpeed,
  setWindSpeed,
  salinity,
  setSalinity,
  telemetry,
  projectedOCC,
  calcBuoyCount,
  setCalcBuoyCount,
  calcOperatingDays,
  setCalcOperatingDays,
}: PublicWebsiteProps) {
  // Navigation active tab
  const [activeSection, setActiveSection] = useState<string>('home');

  // Contact Form State
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    agency: '',
    email: '',
    scope: 'Sovereign SLA (Circulation Guarantee)',
    message: '',
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setFormSubmitted(true);
    }
  };

  const handleDownloadMOU = () => {
    const text = `MEMORANDUM OF UNDERSTANDING // SALIBUOY SYSTEMS
--------------------------------------------------
DATE: ${new Date().toLocaleDateString()}
PARTIES:
1. SaliBuoy Systems Inc. (Christopher McKay, Managing Director)
2. ${formData.agency || 'Sovereign Coalition / Stakeholder'} (Represented by: ${formData.name})

MANDATE: Thermohaline Circulation Stabilization & Heat Grid Insurance
SCOPE: ${formData.scope}

WHEREAS SaliBuoy Systems operates autonomous, wind-powered, vertical-torque kinetic downwelling arrays (the "Sali-Buoy System") to accelerate subpolar ocean chimney downwelling.
WHEREAS the counterparty seeks to insure regional temperature equilibrium and marine ecosystems against Atlantic Meridional Overturning Circulation (AMOC) collapse.

AGREEMENTS & PROTOCOLS:
1. SaliBuoy Systems commits to deploy modular, telemetry-verified kinetic arrays to maintain a baseline circulation volume target.
2. Verified sinking velocities and Sverdrup (Sv) flow boosts shall be logged permanently to decentralised telemetry networks.
3. Funding/Credits shall be issued in Sverdrup Circulation Credits (SvC) pegged directly to certified marine downwelling.

SIGNED BY:
Christopher McKay, Managing Director, SaliBuoy Systems
Inquirer Signature: ${formData.name} (${formData.agency || 'Sovereign Coalition'})
Contact: chris.mckay@salibuoysystems.com
`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SaliBuoy_MOU_Draft_${formData.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500/30 selection:text-sky-200">
      
      {/* 1. BRAND STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between transition-all">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-slate-950 font-black text-xs shadow-lg shadow-sky-500/20">
            S
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-xs font-bold tracking-widest text-slate-100 uppercase">
                SaliBuoy Systems
              </span>
              <span className="text-[7px] font-mono bg-sky-500/10 text-sky-400 border border-sky-400/20 rounded px-1 uppercase py-0.2">
                Live Tech
              </span>
            </div>
            <p className="font-mono text-[7px] text-slate-500 uppercase tracking-widest leading-none">
              salibuoysystems.com
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-6 font-mono text-[10px] tracking-wider uppercase text-slate-400">
          <a
            href="#technology"
            onClick={() => setActiveSection('technology')}
            className={`hover:text-sky-400 transition-colors ${activeSection === 'technology' ? 'text-sky-400' : ''}`}
          >
            Technology Platform
          </a>
          <a
            href="#credits"
            onClick={() => setActiveSection('credits')}
            className={`hover:text-sky-400 transition-colors ${activeSection === 'credits' ? 'text-sky-400' : ''}`}
          >
            Circulation Credits
          </a>
          <a
            href="#roadmap"
            onClick={() => setActiveSection('roadmap')}
            className={`hover:text-sky-400 transition-colors ${activeSection === 'roadmap' ? 'text-sky-400' : ''}`}
          >
            Scientific Roadmap
          </a>
          <a
            href="#contact"
            onClick={() => setActiveSection('contact')}
            className={`hover:text-sky-400 transition-colors ${activeSection === 'contact' ? 'text-sky-400' : ''}`}
          >
            Sovereign Inquiry
          </a>
        </nav>

        {/* Enter Portal Link */}
        <button
          onClick={onEnterPortal}
          className="group relative flex items-center gap-2 bg-slate-900 hover:bg-slate-850 text-[10px] font-mono tracking-wider uppercase border border-sky-500/30 hover:border-sky-400 text-sky-400 hover:text-slate-100 rounded px-3.5 py-1.5 transition-all shadow-[0_0_10px_rgba(56,189,248,0.1)] hover:shadow-[0_0_15px_rgba(56,189,248,0.25)]"
        >
          <span className="flex h-1.5 w-1.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-400"></span>
          </span>
          Enter Fleet Command
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-950/40 via-slate-950 to-slate-950 border-b border-slate-900">
        
        {/* Abstract background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-sky-500/5 border border-sky-400/20 rounded-full px-3 py-1 font-mono text-[9px] text-sky-400 uppercase tracking-widest">
            <Globe className="w-3 h-3 animate-spin" style={{ animationDuration: '20s' }} />
            <span>Planetary Fluid Infrastructure Portal</span>
          </div>

          <h1 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-100 max-w-4xl mx-auto leading-tight md:leading-none">
            Thermohaline Circulation <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">Stabilization</span> Systems
          </h1>

          <p className="font-sans text-sm md:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            SaliBuoy Systems deploys autonomous, wind-powered vertical kinetic downwelling arrays in subpolar downwelling chimneys to combat AMOC stagnation, driving cold, hyper-saline dense water past freshwater lids back into the deep global conveyor loop.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onEnterPortal}
              className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-bold tracking-wider uppercase text-xs rounded-lg px-6 py-3 transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/15 group"
            >
              <Radio className="w-4 h-4 animate-pulse text-slate-950" />
              Launch Live Command Center
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <a
              href="#technology"
              className="w-full sm:w-auto bg-slate-900/60 hover:bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-slate-100 font-bold tracking-wider uppercase text-xs rounded-lg px-6 py-3 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Explore Technology</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Core Telemetry Feed Ribbon */}
          <div className="pt-12">
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 md:p-5 text-left shadow-2xl backdrop-blur max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/60 pb-3 mb-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400"></span>
                  </span>
                  <span className="font-mono text-[9px] text-sky-400 font-bold uppercase tracking-widest">
                    ACTIVE SENSOR INTEGRATION // STATION 46042
                  </span>
                </div>
                <div className="text-[9px] font-mono text-slate-500">
                  REFRESHED: LIVE BACKGROUND DAEMON // EVERY 5 MIN
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-0.5">
                  <div className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">Surface Wind Speed</div>
                  <div className="text-sm font-mono font-bold text-slate-200 flex items-baseline gap-1">
                    <Wind className="w-3.5 h-3.5 text-sky-400 shrink-0 self-center" />
                    <span>{windSpeed.toFixed(1)}</span>
                    <span className="text-[9px] text-slate-500 font-normal">knots</span>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">Active Swell Height</div>
                  <div className="text-sm font-mono font-bold text-slate-200 flex items-baseline gap-1">
                    <Activity className="w-3.5 h-3.5 text-indigo-400 shrink-0 self-center" />
                    <span>{telemetry.windSpeed > 30 ? '4.8' : telemetry.windSpeed > 15 ? '3.2' : '2.1'}</span>
                    <span className="text-[9px] text-slate-500 font-normal">meters</span>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">Planetary Density Current</div>
                  <div className="text-sm font-mono font-bold text-sky-400 flex items-baseline gap-1">
                    <Anchor className="w-3.5 h-3.5 text-sky-400 shrink-0 self-center animate-spin" style={{ animationDuration: '4s' }} />
                    <span>{telemetry.sverdrups.toFixed(3)}</span>
                    <span className="text-[9px] text-slate-500 font-normal">Sv flow</span>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">Operational Temp</div>
                  <div className="text-sm font-mono font-bold text-slate-200 flex items-baseline gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-emerald-400 shrink-0 self-center" />
                    <span>{telemetry.temperature.toFixed(1)}</span>
                    <span className="text-[9px] text-slate-500 font-normal">°C Ambient</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. TECHNOLOGY PLATFORM SECTION */}
      <section id="technology" className="py-20 border-b border-slate-900 bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="font-mono text-[9px] text-sky-400 font-bold uppercase tracking-widest block">
              ENGINEERING PLATFORM DESIGN
            </span>
            <h2 className="font-display text-xl md:text-2xl font-black uppercase tracking-tight text-slate-100">
              The Polar Recovery Engine (PRE)
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">
              Bypassing subpolar freshwater capping layer barriers. Our mechanical turbine acts as a density-pumping chimney driver.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Schematic column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 font-mono text-[10px] text-slate-300 border-b border-slate-800 pb-2">
                  <Layers className="w-4 h-4 text-sky-400" />
                  <span>SALI-BUOY MK. II ARCHITECTURE</span>
                </div>
                
                <div className="space-y-3.5 text-xs">
                  <div className="flex gap-2.5">
                    <span className="w-5 h-5 rounded bg-sky-500/10 text-sky-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">1</span>
                    <div>
                      <h4 className="font-bold text-slate-200">Wind Turbine Cap</h4>
                      <p className="text-[11px] text-slate-400">High-torque Savonius Vertical Axis Wind Turbine gathers energy in extreme gale-force polar winds.</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="w-5 h-5 rounded bg-sky-500/10 text-sky-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">2</span>
                    <div>
                      <h4 className="font-bold text-slate-200">Mechanical Drive-Shaft</h4>
                      <p className="text-[11px] text-slate-400">Telescopic composite shaft routes continuous mechanical rotation directly down past the freezing zones.</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="w-5 h-5 rounded bg-sky-500/10 text-sky-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">3</span>
                    <div>
                      <h4 className="font-bold text-slate-200">Kinetic Downwelling Impeller</h4>
                      <p className="text-[11px] text-slate-400">Subsurface prop accelerated at 15 RPM to propel cold, hyper-saline brine deep through fresh water locks.</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <span className="w-5 h-5 rounded bg-sky-500/10 text-sky-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">4</span>
                    <div>
                      <h4 className="font-bold text-slate-200">De-icing Transducers</h4>
                      <p className="text-[11px] text-slate-400">Hydro-acoustic ultrasonic sound fields prevent biological adhesion and surface ice buildup.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live sandbox playground column */}
            <div className="lg:col-span-7">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-28 h-28 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-sky-400 animate-pulse" />
                    <span className="font-mono text-[10px] text-slate-200 font-bold uppercase tracking-wider">
                      Interactive Mechanical Simulator Widget
                    </span>
                  </div>
                  <span className="text-[8px] font-mono bg-sky-400/10 text-sky-400 px-1.5 py-0.5 rounded uppercase">
                    Interactive
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Slider 1 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[9px] text-slate-400">
                      <span className="uppercase tracking-wider">Wind Velocity Input</span>
                      <span className="text-slate-200 font-bold">{windSpeed.toFixed(0)} knots</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={windSpeed}
                      onChange={(e) => setWindSpeed(Number(e.target.value))}
                      className="w-full accent-sky-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                      <span>5 KTS (CALM)</span>
                      <span>50 KTS (STORM)</span>
                    </div>
                  </div>

                  {/* Slider 2 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[9px] text-slate-400">
                      <span className="uppercase tracking-wider">Deep Ocean Salinity PSU</span>
                      <span className="text-slate-200 font-bold">{salinity.toFixed(1)} PSU</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="60"
                      value={salinity}
                      onChange={(e) => setSalinity(Number(e.target.value))}
                      className="w-full accent-sky-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                      <span>30 PSU</span>
                      <span>60 PSU</span>
                    </div>
                  </div>
                </div>

                {/* Outputs Panel */}
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="space-y-0.5">
                    <div className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">Turbine Rotation</div>
                    <div className="text-xs font-mono font-bold text-slate-200">{telemetry.vawtRpm} RPM</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">Propeller Shaft</div>
                    <div className="text-xs font-mono font-bold text-slate-200">{telemetry.propRpm} RPM</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">Rotational Torque</div>
                    <div className="text-xs font-mono font-bold text-slate-200">{telemetry.torque} kN·m</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">Freezing Point</div>
                    <div className="text-xs font-mono font-bold text-slate-200">{( -1.91 - (salinity - 35) * 0.053).toFixed(2)} °C</div>
                  </div>
                  <div className="col-span-2 space-y-0.5">
                    <div className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">Mechanical Sinking Flow</div>
                    <div className="text-xs font-mono font-bold text-sky-400 animate-pulse">{telemetry.sverdrups.toFixed(3)} Sv boost per unit</div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={onEnterPortal}
                    className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-mono uppercase tracking-wider transition-colors hover:underline"
                  >
                    <span>Analyze Full Physical Fluid Equations In Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. CIRCULATION CREDITS SECTION */}
      <section id="credits" className="py-20 border-b border-slate-900 bg-slate-950/40 relative">
        <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-12 relative z-10">
          
          <div className="text-center space-y-2">
            <span className="font-mono text-[9px] text-sky-400 font-bold uppercase tracking-widest block">
              MARKET CAPABILITIES
            </span>
            <h2 className="font-display text-xl md:text-2xl font-black uppercase tracking-tight text-slate-100">
              Sverdrup Circulation Credits (SvC)
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">
              Introducing sovereign-grade thermohaline insurance. Securing planetary circulation volume to prevent regional cooling risks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Explainer column */}
            <div className="lg:col-span-5 space-y-5">
              <div className="space-y-4">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-100">
                  What is a Sverdrup Credit?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  A Sverdrup Circulation Credit (SvC) represents the verified mechanical downwelling of 1,000 Sverdrup-days (Sv·days) of cold, hyper-dense water through freshwater chimneys, directly keeping deep ocean pump chimneys operational.
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Decentralized sensor readings in the Polar Recovery Engine register real-time downwelling currents. Our sovereign-led contracts protect ocean thermal currents to secure European heat grids and global climates against sudden tipping points.
                </p>
              </div>

              <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/30 space-y-2.5">
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-amber-400 uppercase tracking-widest">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sovereign Risk Alignment</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Reinsurance companies and sovereign portfolios leverage Sverdrup Credits to directly finance mechanical downwelling, securing multitrillion-dollar regional asset values.
                </p>
              </div>
            </div>

            {/* Calculator column */}
            <div className="lg:col-span-7">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-sky-400" />
                    <span className="font-mono text-[10px] text-slate-200 font-bold uppercase tracking-wider">
                      Circulation Credit Generator
                    </span>
                  </div>
                  <span className="text-[8px] text-slate-500 font-mono">
                    MARKET PRICING PEGGED @ $42,000 USD / SvC
                  </span>
                </div>

                <div className="space-y-5">
                  {/* Slider: Fleet size */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[9px] text-slate-400">
                      <span className="uppercase tracking-wider">Sali-Buoy Fleet Size</span>
                      <span className="text-slate-200 font-bold">{calcBuoyCount} Buoys</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      step="10"
                      value={calcBuoyCount}
                      onChange={(e) => setCalcBuoyCount(Number(e.target.value))}
                      className="w-full accent-sky-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                      <span>10 UNITS</span>
                      <span>500 UNITS</span>
                    </div>
                  </div>

                  {/* Slider: Operating Days */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[9px] text-slate-400">
                      <span className="uppercase tracking-wider">Deployment Campaign Duration</span>
                      <span className="text-slate-200 font-bold">{calcOperatingDays} Days</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="365"
                      step="5"
                      value={calcOperatingDays}
                      onChange={(e) => setCalcOperatingDays(Number(e.target.value))}
                      className="w-full accent-sky-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                      <span>30 DAYS</span>
                      <span>365 DAYS</span>
                    </div>
                  </div>
                </div>

                {/* Calculation Outputs */}
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-0.5">
                    <div className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">Annual Sverdrup Credits</div>
                    <div className="text-lg font-mono font-bold text-sky-400 flex items-baseline gap-1 animate-pulse">
                      <span>{projectedOCC.occs.toLocaleString()}</span>
                      <span className="text-xs font-normal text-slate-500">SvC</span>
                    </div>
                  </div>

                  <div className="h-px sm:h-8 w-full sm:w-px bg-slate-800" />

                  <div className="space-y-0.5">
                    <div className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">Equivalent Economic Stabilization Credit Value</div>
                    <div className="text-lg font-mono font-bold text-slate-200">
                      ${projectedOCC.estimatedValue.toLocaleString()} <span className="text-[10px] text-slate-500">USD</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono font-bold tracking-wider uppercase text-[10px] rounded px-4 py-2 transition-colors shadow-lg shadow-sky-500/10"
                  >
                    <span>Request Sovereign Credit Reservation</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                  </a>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. ROADMAP TIMELINE */}
      <section id="roadmap" className="py-20 border-b border-slate-900 bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="font-mono text-[9px] text-sky-400 font-bold uppercase tracking-widest block">
              SYSTEM ROLLOUT SCHEDULE
            </span>
            <h2 className="font-display text-xl md:text-2xl font-black uppercase tracking-tight text-slate-100">
              Project Conveyor Roadmap
            </h2>
            <p className="text-xs text-slate-400">
              From physical fluid dynamics validation to full scale subpolar swarm installation.
            </p>
          </div>

          {/* Timeline Cards */}
          <div className="relative border-l border-slate-800 pl-6 ml-4 space-y-10">
            {ROADMAP_STEPS.map((step, i) => (
              <div key={i} className="relative group">
                {/* Bullet */}
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-slate-900 bg-slate-950 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-400 group-hover:scale-125 transition-transform" />
                </div>

                <div className="bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-5 transition-all space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <span className="font-mono text-[9px] text-sky-400 font-bold uppercase tracking-widest block">
                        {step.quarter}
                      </span>
                      <h3 className="font-display text-xs font-bold text-slate-100 uppercase tracking-wider">
                        {step.title}
                      </h3>
                    </div>
                    <span className="text-[9px] font-sans text-slate-400 italic">
                      {step.subtitle}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    {step.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-slate-800/60 pt-3">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex gap-1.5 text-[10px] text-slate-400">
                        <Check className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. CONTACT / STAKEHOLDER SLA SECTION */}
      <section id="contact" className="py-20 bg-slate-950/60 relative">
        <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-12 relative z-10">
          
          <div className="text-center space-y-2">
            <span className="font-mono text-[9px] text-sky-400 font-bold uppercase tracking-widest block">
              SOVEREIGN OUTREACH PORTAL
            </span>
            <h2 className="font-display text-xl md:text-2xl font-black uppercase tracking-tight text-slate-100">
              Intervention Request & SLA Briefing
            </h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              Initiate formal climate collaboration. Select your SLA scope below to generate an immediate Memorandum of Understanding (MoU) draft.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <AnimatePresence mode="wait">
              {!formSubmitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleFormSubmit}
                  className="space-y-4 text-xs font-sans"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Christopher McKay"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-sky-400 text-slate-200 rounded px-3.5 py-2 focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block">Sovereign Coalition / Agency Name</label>
                      <input
                        type="text"
                        required
                        value={formData.agency}
                        onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                        placeholder="e.g. Swedish Meteorolgical Institute (SMHI)"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-sky-400 text-slate-200 rounded px-3.5 py-2 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block">Official Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. chris.mckay@salibuoysystems.com"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-sky-400 text-slate-200 rounded px-3.5 py-2 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block">Proposed SLA Scope</label>
                    <select
                      value={formData.scope}
                      onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-sky-400 text-slate-200 rounded px-3.5 py-2 focus:outline-none transition-colors"
                    >
                      <option value="Sovereign SLA (Circulation Guarantee)">Sovereign SLA (Circulation Guarantee)</option>
                      <option value="Research & Academic Collaboration (Fram Strait)">Research & Academic Collaboration (Fram Strait)</option>
                      <option value="Sverdrup Credit Investment (Private Placement)">Sverdrup Credit Investment (Private Placement)</option>
                      <option value="Polar Recovery Engine Engineering Support">Polar Recovery Engine Engineering Support</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block">Message / SLA Briefing Requirements</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Detail physical coordinates, target sinking volumes, ocean modeling parameters, or credit purchase quantities..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-sky-400 text-slate-200 rounded px-3.5 py-2 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="pt-2 text-center">
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-mono font-bold tracking-wider uppercase text-[10px] rounded-lg px-6 py-2.5 transition-all shadow-lg shadow-sky-500/10 inline-flex items-center justify-center gap-2"
                    >
                      <Send className="w-4.5 h-4.5 text-slate-950" />
                      <span>Initiate Formal SLA Draft</span>
                    </button>
                    <div className="text-[8px] font-mono text-slate-500 mt-2">
                      SaliBuoy Systems // Pukekohe Headquarters // Auckland Office // Confidential Secure Transmission
                    </div>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  className="space-y-5 text-xs text-left"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex items-center gap-3 border-b border-emerald-900/60 pb-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-bold text-slate-100 uppercase tracking-wider leading-none">
                        Sovereign SLA Proposal Generated
                      </h3>
                      <p className="font-mono text-[8px] text-emerald-400 uppercase tracking-widest mt-1">
                        SLA-MOU Draft Ready For Verification
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-[10px] text-slate-300 leading-relaxed overflow-x-auto whitespace-pre space-y-1 select-all h-64 border-l-4 border-l-emerald-500">
                    <div>MEMORANDUM OF UNDERSTANDING // SALIBUOY SYSTEMS</div>
                    <div>--------------------------------------------------</div>
                    <div>DATE: {new Date().toLocaleDateString()}</div>
                    <div>PARTIES:</div>
                    <div>1. SaliBuoy Systems (Christopher McKay, Managing Director)</div>
                    <div>2. {formData.agency || 'Sovereign Coalition'} (Represented by: {formData.name})</div>
                    <br />
                    <div>MANDATE: Thermohaline Circulation Stabilization & Heat Grid Insurance</div>
                    <div>SCOPE: {formData.scope}</div>
                    <br />
                    <div>The parties agree to deploy verified Sali-Buoy arrays and log all</div>
                    <div>Sverdrup current flow telemetry securely. Estimated credit issuance is peg</div>
                    <div>equivalent to active downwelling chimneys.</div>
                    <br />
                    <div>DIRECT INQUIRY ROUTED TO:</div>
                    <div className="text-sky-400">chris.mckay@salibuoysystems.com</div>
                    <br />
                    <div>SIGNED BY:</div>
                    <div>[ Christopher McKay, Managing Director, SaliBuoy Systems ]</div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={handleDownloadMOU}
                      className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-100 font-mono text-[10px] tracking-wider uppercase border border-slate-700 rounded px-4 py-2 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-4 h-4 text-sky-400" />
                      Download Draft MoU (.txt)
                    </button>
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="flex-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-[10px] font-bold tracking-wider uppercase rounded px-4 py-2 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-sky-500/10"
                    >
                      <RefreshCw className="w-4 h-4 text-slate-950" />
                      Create New Inquire
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10 px-4 md:px-8 font-mono text-[9px] text-slate-500 uppercase tracking-widest text-center space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto gap-4">
          <div>SaliBuoy Systems // salibuoysystems.com // Auckland, New Zealand // Project Conveyor © 2026</div>
          <div className="flex gap-4">
            <a href="mailto:chris.mckay@salibuoysystems.com" className="text-sky-400/80 hover:text-sky-400 hover:underline">
              chris.mckay@salibuoysystems.com
            </a>
            <span>//</span>
            <span className="text-slate-500">MEMBER CLIMATE TECH INSULATION COUNCIL</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
