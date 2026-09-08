import React from 'react';
import { ActiveTab } from '../types';
import { 
  Waves, 
  Compass, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  Thermometer,
  Zap,
  Building2
} from 'lucide-react';
import { AmocSummaryOneDriveToggle } from './AmocSummaryOneDriveToggle';
import { SyncToGitHub } from './SyncToGitHub';

interface DashboardProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 p-6 md:p-8 border border-sky-900/40 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-800 text-sky-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
            <span>Auckland DeepTech Climate Initiative • New Zealand</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            SaliBuoy Systems <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400">Project Conveyor</span>
          </h1>
          
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            A hardware-first oceanographic intervention platform engineered in New Zealand to stabilize the Atlantic Meridional Overturning Circulation (AMOC) through autonomous subsurface salinity pumping and polar cryo-restoration.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('nz-business')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-sky-950/80 transition-all duration-200 cursor-pointer"
            >
              <Building2 className="w-4 h-4" />
              <span>NZ Sole Trader & Business Setup</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => setActiveTab('funding')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer"
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>View 12-Mo NZ Funding Pipeline</span>
            </button>

            <button
              onClick={() => setActiveTab('hardware')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-sky-300 border border-sky-800/60 font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-sky-400" />
              <span>AMOC Hardware Roadmap</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2 hover:border-sky-800/60 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wider">AMOC Transport</span>
            <Waves className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white font-mono">15.2 Sv</span>
            <span className="text-xs text-rose-400 font-mono font-medium">-15.5% vs baseline</span>
          </div>
          <p className="text-[11px] text-slate-400">Baseline 18.0 Sverdrups (1 Sv = 1M m³/s)</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2 hover:border-teal-800/60 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wider">Target Salinity Injection</span>
            <Thermometer className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-teal-300 font-mono">45.0 PSU</span>
            <span className="text-xs text-emerald-400 font-mono font-medium">+10 PSU Density</span>
          </div>
          <p className="text-[11px] text-slate-400">Forces localized subsea water sinking</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2 hover:border-emerald-800/60 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wider">12-Mo Funding Target</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white font-mono">$1.5M NZD</span>
            <span className="text-xs text-emerald-400 font-mono font-medium">$600k Non-dilutive</span>
          </div>
          <p className="text-[11px] text-slate-400">VC Seed + Callaghan R&D 40% rebate</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2 hover:border-amber-800/60 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wider">Hardware Status</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-amber-300 font-mono">Mark-II Testing</span>
            <span className="text-xs text-sky-400 font-mono font-medium">75% Complete</span>
          </div>
          <p className="text-[11px] text-slate-400">Next: Mark-III Hauraki Gulf ocean trial</p>
        </div>
      </div>

      {/* Daily AMOC Stabilization AI Summary & OneDrive Auto-Save Toggle */}
      <AmocSummaryOneDriveToggle />

      {/* GitHub Sync Octokit Utility */}
      <SyncToGitHub />

      {/* Mechanics & Physics of AMOC Stabilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mechanics Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-950 rounded-lg text-sky-400 border border-sky-800/50">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Why AMOC Stabilization Matters</h3>
              <p className="text-xs text-slate-400">The Physics of Ocean Thermohaline Circulation</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="p-3 bg-rose-950/30 border border-rose-900/40 rounded-lg space-y-1">
              <div className="flex items-center space-x-2 text-rose-300 font-semibold">
                <AlertTriangle className="w-4 h-4" />
                <span>The Threat: Freshwater Melt Dilution</span>
              </div>
              <p className="text-slate-400">
                Accelerating Greenland ice sheet melting pours massive volumes of zero-salinity freshwater into the North Atlantic. Lower salinity lowers water density, preventing ocean water from sinking—which stalls the global AMOC conveyor belt.
              </p>
            </div>

            <div className="p-3 bg-emerald-950/30 border border-emerald-900/40 rounded-lg space-y-1">
              <div className="flex items-center space-x-2 text-emerald-300 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>The SaliBuoy Intervention</span>
              </div>
              <p className="text-slate-400">
                SaliBuoy autonomous offshore platforms harvest wind energy via surface wind turbine rotors to extract ambient seawater, concentrate it into dense high-salinity brine (42-48 PSU), and inject it at critical subsea downwelling channels, forcing heavy cold water to sink and re-igniting natural convection.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Launchpad Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-950 rounded-lg text-emerald-400 border border-emerald-800/50">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Key Action Modules</h3>
              <p className="text-xs text-slate-400">Access required setup & planning tools</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => setActiveTab('nz-business')}
              className="p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/50 rounded-lg text-left transition-all space-y-1 group"
            >
              <div className="flex items-center justify-between text-sky-400 font-semibold text-xs">
                <span>NZ Sole Trader Guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-400">NZBN, IRD GST, Provisional IPONZ patent</p>
            </button>

            <button
              onClick={() => setActiveTab('funding')}
              className="p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 rounded-lg text-left transition-all space-y-1 group"
            >
              <div className="flex items-center justify-between text-emerald-400 font-semibold text-xs">
                <span>12-Mo Grant Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-400">Callaghan 40% rebate, Outset, Pacific Channel</p>
            </button>

            <button
              onClick={() => setActiveTab('pitch-deck')}
              className="p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-teal-500/50 rounded-lg text-left transition-all space-y-1 group"
            >
              <div className="flex items-center justify-between text-teal-400 font-semibold text-xs">
                <span>VC Pitch Deck Outline</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-400">10-Slide deeptech deck tailored for NZ VCs</p>
            </button>

            <button
              onClick={() => setActiveTab('telemetry')}
              className="p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 rounded-lg text-left transition-all space-y-1 group"
            >
              <div className="flex items-center justify-between text-amber-400 font-semibold text-xs">
                <span>Telemetry Simulator</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-400">Live oceanic data stream & buoy telemetry</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
