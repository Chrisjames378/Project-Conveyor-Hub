import React from 'react';
import { ActiveTab, OceanBoy, SuperintendentState } from '../types';
import { INITIAL_OCEAN_BOYS } from '../db/oceanBoysFleet';
import { computeFleetHealthStats } from '../utils/fleetHealth';
import { computeIntelligenceMetrics, getUnlockedCapabilityForMonth } from '../services/superintendentEngine';
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
  Building2,
  Globe,
  BrainCircuit,
  Activity
} from 'lucide-react';
import { AmocSummaryOneDriveToggle } from './AmocSummaryOneDriveToggle';
import { SyncToGitHub } from './SyncToGitHub';

interface DashboardProps {
  setActiveTab: (tab: ActiveTab) => void;
  buoys?: OceanBoy[];
  superintendentState?: SuperintendentState;
}

export const Dashboard: React.FC<DashboardProps> = ({
  setActiveTab,
  buoys = INITIAL_OCEAN_BOYS,
  superintendentState
}) => {
  const fleetHealth = computeFleetHealthStats(buoys);
  const suptGen = superintendentState?.generation ?? 2;
  const suptMetrics = computeIntelligenceMetrics(suptGen);

  return (
    <div className="space-y-6 animate-fade-in">
      <div role="note" className="flex flex-col gap-2 rounded-xl border border-amber-400/25 bg-amber-400/[0.06] px-4 py-3 sm:flex-row sm:items-start">
        <div className="flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-200"><AlertTriangle className="h-4 w-4" /> Research preview</div>
        <p className="text-xs leading-relaxed text-slate-300">Fleet readings, health classifications, superintendent generations, AI performance figures and ocean indicators are illustrative application models unless a module explicitly identifies a verified external data source. This dashboard does not command physical equipment. Any field trial or environmental intervention requires independent scientific, ecological, engineering and regulatory review.</p>
      </div>
      {/* Mission Control Header */}
      <div className="rounded-2xl bg-[#060f1f]/95 p-6 md:p-7 border border-slate-800/90 shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-sky-400 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
              <span>Auckland DeepTech Climate Initiative • New Zealand</span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight">
              SaliBuoy Systems <span className="text-sky-400">Mission Overview</span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              A Pukekohe-based oceanographic research and engineering concept exploring marine sensing, renewable-energy systems and approaches to understanding ocean circulation. Proposed interventions remain research hypotheses and require independent validation.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('global-climate')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              <span>Global Climate &amp; SST</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('hardware')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Hardware Roadmap</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('funding')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>NZ Funding</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Telemetry Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#060f1f]/90 border border-slate-800 rounded-xl p-5 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Illustrative AMOC scenario</span>
            <Waves className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline space-x-2 font-mono tabular-nums">
            <span className="text-2xl font-bold text-white">15.2 Sv</span>
            <span className="text-xs text-rose-400 font-semibold">Scenario delta</span>
          </div>
          <p className="text-[11px] text-slate-400">Illustrative baseline • not a live measurement</p>
        </div>

        <div className="bg-[#060f1f]/90 border border-slate-800 rounded-xl p-5 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Design-study salinity value</span>
            <Thermometer className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline space-x-2 font-mono tabular-nums">
            <span className="text-2xl font-bold text-teal-300">45.0 PSU</span>
            <span className="text-xs text-emerald-400 font-semibold">Illustrative only</span>
          </div>
          <p className="text-[11px] text-slate-400">Requires independent modelling and validation</p>
        </div>

        <div className="bg-[#060f1f]/90 border border-slate-800 rounded-xl p-5 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">12-month funding ambition</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2 font-mono tabular-nums">
            <span className="text-2xl font-bold text-white">$1.5M NZD</span>
            <span className="text-xs text-emerald-400 font-semibold">Indicative grant target</span>
          </div>
          <p className="text-[11px] text-slate-400">Eligibility and availability must be verified</p>
        </div>

        <div className="bg-[#060f1f]/90 border border-slate-800 rounded-xl p-5 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Prototype planning status</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2 font-mono tabular-nums">
            <span className="text-2xl font-bold text-amber-300">Mark-II</span>
            <span className="text-xs text-sky-400 font-semibold">Planning estimate only</span>
          </div>
          <p className="text-[11px] text-slate-400">Next milestone depends on design review, permits and funding</p>
        </div>
      </div>

      {/* Interior Superintendent & Live Fleet Health Command Strip */}
      <div className="bg-[#060f1f]/95 border border-cyan-900/50 rounded-2xl p-5 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold tabular-nums">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>INTERIOR SUPERINTENDENT • GEN {suptGen}.0</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold tabular-nums">
              {suptMetrics.anomalyPrecisionPct}% PRECISION • +{suptMetrics.amocEfficiencyGainPct}% YIELD
            </span>
            <span className="text-[11px] text-slate-400">
              Monthly Auto-Upgrade: {superintendentState?.autoUpgradeMonthly !== false ? 'Enabled' : 'Paused'}
            </span>
          </div>
          <h3 className="text-base font-bold text-white">
            Active Monthly Intelligence: {getUnlockedCapabilityForMonth(suptGen)}
          </h3>
          <p className="text-xs font-mono text-slate-400 tabular-nums">
            Modelled Fleet ({fleetHealth.total} Units):{' '}
            <span className="text-emerald-300 font-bold">{fleetHealth.optimalPct.toFixed(1)}% Optimal</span> •{' '}
            <span className="text-amber-300 font-bold">{fleetHealth.degradedPct.toFixed(1)}% Degraded</span> •{' '}
            <span className="text-rose-300 font-bold">{fleetHealth.criticalPct.toFixed(1)}% Critical</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('superintendent')}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center space-x-1.5 cursor-pointer transition-colors"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Open Superintendent</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ocean-boys-fleet')}
            className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-teal-300 font-bold flex items-center space-x-1.5 cursor-pointer transition-colors"
          >
            <Activity className="w-4 h-4" />
            <span>Fleet Health</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('eco-impact')}
            className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-emerald-300 font-bold flex items-center space-x-1.5 cursor-pointer transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Risk Sim</span>
          </button>
        </div>
      </div>

      {/* Daily AMOC Stabilization AI Summary & OneDrive Auto-Save Toggle */}
      <AmocSummaryOneDriveToggle />

      {/* GitHub Sync Octokit Utility */}
      <SyncToGitHub />

      {/* Mechanics & Action Launchpad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#060f1f]/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-950 rounded-lg text-sky-400 border border-sky-800/60">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Why AMOC Stabilization Matters</h3>
              <p className="text-xs text-slate-400">The Physics of Ocean Thermohaline Circulation</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="p-3.5 bg-rose-950/25 border border-rose-900/50 rounded-xl space-y-1">
              <div className="flex items-center space-x-2 text-rose-300 font-semibold">
                <AlertTriangle className="w-4 h-4" />
                <span>Freshwater Melt Dilution Threat</span>
              </div>
              <p className="text-slate-400">
                Greenland ice sheet meltwater dilutes North Atlantic salinity, lowering water density and stalling natural deep-water sinking that drives the global heat conveyor.
              </p>
            </div>

            <div className="p-3.5 bg-emerald-950/25 border border-emerald-900/50 rounded-xl space-y-1">
              <div className="flex items-center space-x-2 text-emerald-300 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Brine-injection concept under evaluation</span>
              </div>
              <p className="text-slate-400">
                The concept explores renewable-powered marine platforms and sensing for controlled research into local salinity and density processes. Concentration, pumping, release mechanisms and any wider circulation effects are not validated by this dashboard; they require peer-reviewed modelling and independent ecological assessment.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#060f1f]/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-950 rounded-lg text-emerald-400 border border-emerald-800/60">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Key Action Modules</h3>
              <p className="text-xs text-slate-400">Operations, setup, and engineering workspaces</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setActiveTab('nz-business')}
              className="p-3.5 bg-[#030812] hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-xl text-left transition-colors space-y-1 group cursor-pointer"
            >
              <div className="flex items-center justify-between text-sky-400 font-semibold text-xs">
                <span>NZ Sole Trader Guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-400">NZBN, IRD GST, Provisional IPONZ patent</p>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('funding')}
              className="p-3.5 bg-[#030812] hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left transition-colors space-y-1 group cursor-pointer"
            >
              <div className="flex items-center justify-between text-emerald-400 font-semibold text-xs">
                <span>12-Mo Grant Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-400">Callaghan 40% rebate, Outset, Pacific Channel</p>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pitch-deck')}
              className="p-3.5 bg-[#030812] hover:bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-xl text-left transition-colors space-y-1 group cursor-pointer"
            >
              <div className="flex items-center justify-between text-teal-400 font-semibold text-xs">
                <span>VC Pitch Deck Outline</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-400">10-Slide deeptech deck tailored for NZ VCs</p>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('telemetry')}
              className="p-3.5 bg-[#030812] hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl text-left transition-colors space-y-1 group cursor-pointer"
            >
              <div className="flex items-center justify-between text-amber-400 font-semibold text-xs">
                <span>Telemetry Simulator</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-400">Live oceanic data stream &amp; buoy telemetry</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
