import React, { useState, useMemo } from 'react';
import {
  BrainCircuit,
  CalendarClock,
  Cpu,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  Wrench,
  CheckCircle2,
  ArrowUpRight,
  RefreshCw,
  Sliders,
  Gauge,
  Download,
  Layers,
  Clock
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { ActiveTab, OceanBoy, SuperintendentState } from '../types';
import { computeFleetHealthStats } from '../utils/fleetHealth';
import {
  computeIntelligenceMetrics,
  evaluateInteriorSubsystems,
  diagnoseFleetAnomalies,
  getUnlockedCapabilityForMonth,
  RECOMMENDED_NEXT_UPGRADES
} from '../services/superintendentEngine';
import { downloadFile } from '../utils/exportUtils';

interface InteriorSuperintendentProps {
  buoys: OceanBoy[];
  setBuoys: React.Dispatch<React.SetStateAction<OceanBoy[]>>;
  superintendentState: SuperintendentState;
  onTriggerMonthlyUpgrade: () => void;
  onToggleAutoMonthly: () => void;
  onRecordAction: (buoyId: string, buoyName: string, action: string, outcome: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const InteriorSuperintendent: React.FC<InteriorSuperintendentProps> = ({
  buoys,
  setBuoys,
  superintendentState,
  onTriggerMonthlyUpgrade,
  onToggleAutoMonthly,
  onRecordAction,
  setActiveTab
}) => {
  const [isCalibratingInterior, setIsCalibratingInterior] = useState<boolean>(false);
  const [calibrationBanner, setCalibrationBanner] = useState<string | null>(null);
  const [aiDirective, setAiDirective] = useState<string | null>(null);
  const [aiDirectiveError, setAiDirectiveError] = useState<string | null>(null);
  const [isGeneratingDirective, setIsGeneratingDirective] = useState<boolean>(false);

  const metrics = useMemo(
    () => computeIntelligenceMetrics(superintendentState.generation),
    [superintendentState.generation]
  );

  const fleetHealth = useMemo(() => computeFleetHealthStats(buoys), [buoys]);
  const subsystems = useMemo(
    () => evaluateInteriorSubsystems(superintendentState.generation, buoys),
    [superintendentState.generation, buoys]
  );
  const diagnoses = useMemo(() => diagnoseFleetAnomalies(buoys), [buoys]);

  // Build trajectory chart data from Month 1 -> Current Gen + 3 Projected Months
  const learningCurveData = useMemo(() => {
    const points = [];
    const maxMonth = superintendentState.generation + 3;
    const startMonth = Math.max(1, maxMonth - 11);
    for (let m = startMonth; m <= maxMonth; m++) {
      const mStats = computeIntelligenceMetrics(m);
      points.push({
        month: m <= superintendentState.generation ? `M${m}` : `M${m} (Proj)`,
        precision: mStats.anomalyPrecisionPct,
        efficiencyGain: mStats.amocEfficiencyGainPct,
        leadHours: mStats.predictiveLeadHours
      });
    }
    return points;
  }, [superintendentState.generation]);

  const handleCalibrateInterior = () => {
    setIsCalibratingInterior(true);
    setTimeout(() => {
      setIsCalibratingInterior(false);
      setCalibrationBanner(
        `Gen ${superintendentState.generation}.0 calibrated all 6 interior assemblies (${metrics.autonomousRulesCount} active rules).`
      );
      onRecordAction(
        'interior-core',
        'All 23 Buoy Interior Assemblies',
        `Gen ${superintendentState.generation}.0 Full Interior Calibration`,
        `Verified ceramic evaporator thermal delta, magnetic drive <85 dB ceiling, and MPPT solar curves.`
      );
    }, 600);
  };

  const handleAutoRemediateBuoy = (buoyId: string) => {
    const target = buoys.find((b) => b.id === buoyId);
    if (!target) return;

    const genBonus = Math.min(10, Math.round(superintendentState.generation * 1.5));

    setBuoys((prev) =>
      prev.map((b) => {
        if (b.id !== buoyId) return b;
        const recoveredBattery = Math.min(98, Math.max(90, b.batteryPct + 8 + genBonus));
        const recoveredSolar =
          b.category === 'SaliBuoy Pumping Fleet' ? Math.max(72, (b.solarWatts || 0) + 35) : b.solarWatts;
        const calmedWave = b.waveHeightM >= 5.2 ? 4.4 : b.waveHeightM;
        const nextStatus =
          b.status === 'Deploying' || b.status === 'Standby' ? 'Operational' : b.status;

        return {
          ...b,
          batteryPct: recoveredBattery,
          solarWatts: recoveredSolar,
          waveHeightM: calmedWave,
          status: nextStatus,
          lastPing: `Stabilized by Supt Gen ${superintendentState.generation}.0`
        };
      })
    );

    onRecordAction(
      target.id,
      target.name,
      `Autonomous Remediation (Gen ${superintendentState.generation}.0)`,
      `Applied MPPT boost & storm-feather stabilization; unit transitioned to Optimal telemetry band.`
    );
  };

  const handleAutoStabilizeAllDegraded = () => {
    const remediableIds = new Set(
      diagnoses.filter((d) => d.canAutoRemediate).map((d) => d.buoy.id)
    );
    if (remediableIds.size === 0) return;

    const genBonus = Math.min(10, Math.round(superintendentState.generation * 1.5));

    setBuoys((prev) =>
      prev.map((b) => {
        if (!remediableIds.has(b.id)) return b;
        return {
          ...b,
          batteryPct: Math.min(98, Math.max(91, b.batteryPct + 9 + genBonus)),
          solarWatts:
            b.category === 'SaliBuoy Pumping Fleet'
              ? Math.max(78, (b.solarWatts || 0) + 40)
              : b.solarWatts,
          waveHeightM: b.waveHeightM >= 5.2 ? 4.3 : b.waveHeightM,
          status: b.status === 'Deploying' || b.status === 'Standby' ? 'Operational' : b.status,
          lastPing: `Fleet Sweep Gen ${superintendentState.generation}.0`
        };
      })
    );

    onRecordAction(
      'fleet-triage',
      `${remediableIds.size} Degraded Units`,
      `Fleet-Wide Interior Stabilization Sweep`,
      `Remediated ${remediableIds.size} degraded buoys; preserved Tsunami Watch alert on NOAA DART 55023.`
    );
  };

  const handleGenerateAiDirective = async () => {
    setIsGeneratingDirective(true);
    setAiDirectiveError(null);
    try {
      const response = await fetch('/api/superintendent/advise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generation: superintendentState.generation,
          metrics,
          fleetHealth: {
            total: fleetHealth.total,
            optimalPct: fleetHealth.optimalPct,
            degradedPct: fleetHealth.degradedPct,
            criticalPct: fleetHealth.criticalPct
          },
          anomalies: diagnoses.map((d) => ({
            name: d.buoy.name,
            state: d.healthState,
            issue: d.primaryIssue
          })),
          subsystems: subsystems.map((s) => ({
            name: s.name,
            efficiencyPct: s.effectiveEfficiencyPct,
            status: s.status
          }))
        })
      });

      const data = await response.json();
      if (!response.ok) {
        setAiDirectiveError(data?.error || 'Unable to generate AI superintendent directive.');
        return;
      }
      setAiDirective(data.directive);
    } catch (err) {
      setAiDirectiveError(
        err instanceof Error ? err.message : 'Network error requesting Superintendent AI directive.'
      );
    } finally {
      setIsGeneratingDirective(false);
    }
  };

  const handleExportSuperintendentLog = () => {
    const report = `
SALIBUOY SYSTEMS • ADVANCED INTERIOR SUPERINTENDENT DOSSIER
==============================================================
Generation: Gen ${superintendentState.generation}.0 (${metrics.modelTierLabel})
Auto-Upgrade Monthly Schedule: ${superintendentState.autoUpgradeMonthly ? 'ENABLED (1st of Month @ 02:00 UTC)' : 'PAUSED'}
Next Scheduled Monthly Rollout: ${superintendentState.nextScheduledUpgradeIso}

INTELLIGENCE METRICS:
---------------------
- Anomaly Detection Precision: ${metrics.anomalyPrecisionPct}%
- Predictive Failure Lead Time: ${metrics.predictiveLeadHours} hours
- AMOC Buoyancy Yield Gain: +${metrics.amocEfficiencyGainPct}%
- False-Positive Rate: ${metrics.falsePositiveRatePct}%
- Autonomous Heuristic Rules: ${metrics.autonomousRulesCount}

FLEET HEALTH SNAPSHOT:
----------------------
- Optimal: ${fleetHealth.optimalPct}% (${fleetHealth.optimalCount}/${fleetHealth.total})
- Degraded: ${fleetHealth.degradedPct}% (${fleetHealth.degradedCount}/${fleetHealth.total})
- Critical: ${fleetHealth.criticalPct}% (${fleetHealth.criticalCount}/${fleetHealth.total})

INTERIOR SUBSYSTEM CALIBRATIONS:
--------------------------------
${subsystems
  .map(
    (s) =>
      `- ${s.name} [${s.subsystemZone}]: ${s.effectiveEfficiencyPct}% (Base ${s.baseEfficiencyPct}% + Learned +${s.learnedGainPct}%) | Status: ${s.status}`
  )
  .join('\n')}

MONTHLY UPGRADE HISTORY:
------------------------
${superintendentState.upgradeHistory
  .map(
    (u) =>
      `- Gen ${u.generation}.0 (${u.monthLabel}) [${u.triggerType}]: ${u.unlockedCapability} | Precision ${u.anomalyPrecisionPct}%`
  )
  .join('\n')}
`;
    downloadFile(report, `SaliBuoy_Superintendent_Gen${superintendentState.generation}.txt`, 'text/plain');
  };

  const nextDateFormatted = new Date(superintendentState.nextScheduledUpgradeIso).toLocaleDateString(
    undefined,
    { year: 'numeric', month: 'short', day: 'numeric' }
  );

  const remediableCount = diagnoses.filter((d) => d.canAutoRemediate).length;

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-mono">
      {/* HERO HEADER & MONTHLY UPGRADE ENGINE CONTROLS */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/60 border border-cyan-900/50 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-cyan-300">
                <BrainCircuit className="w-5 h-5" />
              </span>
              <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold tabular-nums">
                GEN {superintendentState.generation}.0 • {metrics.modelTierLabel.toUpperCase()}
              </span>
              <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold tabular-nums">
                {metrics.autonomousRulesCount} LEARNED RULES
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
              Advanced Interior Fleet Superintendent
            </h1>
            <p className="text-xs sm:text-sm font-sans text-slate-300 max-w-3xl leading-relaxed">
              Embedded autonomous engineering authority supervising interior buoy subsystems, rotor/brine calibration, and fleet-wide triage. Automatically upgrades its diagnostic models every month so each cycle detects faults earlier and extracts higher thermohaline efficiency.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onTriggerMonthlyUpgrade}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg cursor-pointer transition-all"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Run Monthly Upgrade (+1 Month)</span>
            </button>

            <button
              type="button"
              onClick={onToggleAutoMonthly}
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-colors ${
                superintendentState.autoUpgradeMonthly
                  ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
                  : 'bg-slate-950 border-slate-700 text-slate-400'
              }`}
            >
              <CalendarClock className="w-4 h-4" />
              <span>
                Monthly Auto-Upgrade: {superintendentState.autoUpgradeMonthly ? 'ON' : 'OFF'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleExportSuperintendentLog}
              className="px-3 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Dossier</span>
            </button>
          </div>
        </div>

        {/* Monthly Cadence & Active Capability Strip */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start sm:items-center space-x-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">
                Latest Unlocked Monthly Capability (Gen {superintendentState.generation}.0)
              </span>
              <span className="text-white font-bold">
                {getUnlockedCapabilityForMonth(superintendentState.generation)}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-[11px] text-slate-400 shrink-0">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span className="tabular-nums">
              Next Auto-Cycle: <strong className="text-teal-300">{nextDateFormatted}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 4 INTELLIGENCE PROGRESSION METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase">
            <span>Anomaly Precision</span>
            <Gauge className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white tabular-nums">
            {metrics.anomalyPrecisionPct}%
          </div>
          <div className="text-[11px] text-emerald-400 tabular-nums">
            False-Alert Rate: {metrics.falsePositiveRatePct}%
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase">
            <span>Predictive Lead Time</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-white tabular-nums">
            {metrics.predictiveLeadHours} hrs
          </div>
          <div className="text-[11px] font-sans text-slate-400">
            Advance warning before seal/rotor wear
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase">
            <span>AMOC Yield Gain</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-300 tabular-nums">
            +{metrics.amocEfficiencyGainPct}%
          </div>
          <div className="text-[11px] font-sans text-slate-400">
            Learned shear-timed brine downwelling
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase">
            <span>LiFePO4 Endurance</span>
            <Cpu className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-300 tabular-nums">
            +{metrics.batteryLifeExtensionPct}%
          </div>
          <div className="text-[11px] font-sans text-slate-400">
            Solar/wave dynamic charge preservation
          </div>
        </div>
      </div>

      {/* LEARNING CURVE + INTERIOR SUBSYSTEM CALIBRATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Learning Curve Chart */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white uppercase">
                Monthly Intelligence Trajectory
              </h2>
              <p className="text-[11px] font-sans text-slate-400">
                Precision (%) &amp; AMOC efficiency gain (+%) across monthly upgrades
              </p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 tabular-nums">
              M{superintendentState.generation} Active
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={learningCurveData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="precisionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: '#1e293b',
                    borderRadius: '10px',
                    fontSize: '11px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="precision"
                  name="Anomaly Precision (%)"
                  stroke="#06b6d4"
                  fill="url(#precisionGrad)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="efficiencyGain"
                  name="AMOC Efficiency Gain (+%)"
                  stroke="#10b981"
                  fill="url(#yieldGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* On-Demand AI Executive Directive */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-cyan-300 uppercase flex items-center space-x-1.5">
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>AI Superintendent Directive</span>
              </span>
              <button
                type="button"
                onClick={handleGenerateAiDirective}
                disabled={isGeneratingDirective}
                className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-200 text-[10px] font-bold cursor-pointer disabled:opacity-50"
              >
                {isGeneratingDirective ? 'Synthesizing...' : 'Request Gemini 4 Briefing'}
              </button>
            </div>

            {aiDirectiveError && (
              <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800 text-[11px] font-sans text-rose-200">
                {aiDirectiveError}
              </div>
            )}

            {aiDirective ? (
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-sans text-slate-200 whitespace-pre-wrap leading-relaxed max-h-44 overflow-y-auto">
                {aiDirective}
              </div>
            ) : (
              <p className="text-[11px] font-sans text-slate-400">
                Synthesizes live 23-buoy health ({fleetHealth.optimalPct}% Optimal), interior subsystem margins, and Gen {superintendentState.generation}.0 rules into an actionable engineering briefing.
              </p>
            )}
          </div>
        </div>

        {/* Interior Hardware Subsystem Diagnostics */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white uppercase flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-teal-400" />
                <span>Interior Hardware Subsystem Supervision</span>
              </h2>
              <p className="text-[11px] font-sans text-slate-400">
                Internal buoy &amp; wind platform assemblies continuously tuned by monthly intelligence upgrades
              </p>
            </div>

            <button
              type="button"
              onClick={handleCalibrateInterior}
              disabled={isCalibratingInterior}
              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCalibratingInterior ? 'animate-spin' : ''}`} />
              <span>{isCalibratingInterior ? 'Calibrating...' : 'Calibrate Interior Core'}</span>
            </button>
          </div>

          {calibrationBanner && (
            <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-700 text-emerald-200 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{calibrationBanner}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subsystems.map((sub) => (
              <div
                key={sub.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">
                      {sub.subsystemZone}
                    </div>
                    <h3 className="text-xs font-bold text-white font-sans mt-0.5">
                      {sub.name}
                    </h3>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold border shrink-0 ${
                      sub.status === 'Optimal'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : sub.status === 'Calibrating'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-rose-950 text-rose-300 border-rose-800'
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] tabular-nums">
                  <span className="text-slate-400">
                    Eff: <strong className="text-cyan-300">{sub.effectiveEfficiencyPct}%</strong>{' '}
                    <span className="text-emerald-400">(+{sub.learnedGainPct}% learned)</span>
                  </span>
                  <span className="text-slate-400">
                    Margin: <strong className="text-slate-200">+{sub.thermalMarginC}°C</strong>
                  </span>
                </div>

                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${sub.effectiveEfficiencyPct}%` }}
                  />
                </div>

                <p className="text-[11px] font-sans text-slate-400 leading-relaxed">
                  {sub.upgradeNote}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LIVE FLEET TRIAGE & AUTONOMOUS REMEDIATION */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white uppercase">
                Live Fleet Triage &amp; Autonomous Remediation
              </h2>
              <span className="text-[11px] text-emerald-400 tabular-nums">
                Optimal: {fleetHealth.optimalPct.toFixed(1)}% ({fleetHealth.optimalCount}/{fleetHealth.total})
              </span>
              <span className="text-[11px] text-amber-400 tabular-nums">
                Degraded: {fleetHealth.degradedPct.toFixed(1)}%
              </span>
              <span className="text-[11px] text-rose-400 tabular-nums">
                Critical: {fleetHealth.criticalPct.toFixed(1)}%
              </span>
            </div>
            <p className="text-xs font-sans text-slate-400">
              Diagnoses degraded or critical Ocean Boys in real time and applies learned monthly countermeasures directly to live fleet telemetry.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={handleAutoStabilizeAllDegraded}
              disabled={remediableCount === 0}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer disabled:opacity-40 transition-colors"
            >
              Auto-Stabilize Degraded ({remediableCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ocean-boys-fleet')}
              className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
            >
              Open Fleet Matrix
            </button>
          </div>
        </div>

        {diagnoses.length === 0 ? (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/70 text-xs text-emerald-300 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>All {fleetHealth.total} Ocean Boys are currently operating in Optimal state.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {diagnoses.map(({ buoy, healthState, primaryIssue, recommendedAction, canAutoRemediate }) => (
              <div
                key={buoy.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white">{buoy.name}</span>
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                        healthState === 'Critical'
                          ? 'bg-rose-950 text-rose-300 border-rose-700'
                          : 'bg-amber-950 text-amber-300 border-amber-700'
                      }`}
                    >
                      {healthState === 'Critical' ? (
                        <ShieldAlert className="w-3 h-3" />
                      ) : (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                      <span>{healthState}</span>
                    </span>
                  </div>
                  <div className="text-[11px] font-sans text-rose-300">{primaryIssue}</div>
                  <div className="text-[11px] font-sans text-slate-400">
                    <strong className="text-teal-300">Prescription:</strong> {recommendedAction}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[10px]">
                  <span className="text-slate-400 tabular-nums">
                    Bat: {buoy.batteryPct}% • Wave: {buoy.waveHeightM}m • Solar: {buoy.solarWatts}W
                  </span>
                  {canAutoRemediate ? (
                    <button
                      type="button"
                      onClick={() => handleAutoRemediateBuoy(buoy.id)}
                      className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold cursor-pointer"
                    >
                      Execute Fix
                    </button>
                  ) : (
                    <span className="text-rose-400 font-bold">Safety Lock (Watch Active)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MONTHLY UPGRADE CHANGELOG & WHAT ELSE TO INCLUDE NEXT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Upgrade Ledger & Execution Logs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase border-b border-slate-800 pb-3">
            Monthly Self-Upgrade History &amp; Action Ledger
          </h2>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {superintendentState.upgradeHistory.map((item) => (
              <div
                key={`${item.generation}-${item.upgradedAtIso}`}
                className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-cyan-300 font-bold tabular-nums">
                    Gen {item.generation}.0 • {item.monthLabel}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    {item.triggerType}
                  </span>
                </div>
                <div className="font-sans text-white text-xs">{item.unlockedCapability}</div>
                <div className="text-[10px] text-slate-400 tabular-nums">
                  Precision: {item.anomalyPrecisionPct}% • Lead Time: {item.predictiveLeadHours}h • AMOC Gain: +{item.amocEfficiencyGainPct}%
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-1.5">
            <span className="text-[10px] text-slate-400 uppercase block">
              Recent Superintendent Interventions
            </span>
            <div className="space-y-1 max-h-32 overflow-y-auto text-[11px]">
              {superintendentState.actionLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="text-slate-300 font-sans">
                  <span className="font-mono text-[10px] text-teal-400">[{log.timestamp}]</span>{' '}
                  <strong>{log.buoyName}:</strong> {log.action} —{' '}
                  <span className="text-slate-400">{log.outcome}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What Else Should We Include Into This Build */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white uppercase flex items-center space-x-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Recommended Next Upgrades for This Build</span>
              </h2>
              <p className="text-[11px] font-sans text-slate-400">
                High-value engineering modules ready to layer onto Project Conveyor next
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {RECOMMENDED_NEXT_UPGRADES.map((mod) => (
              <div
                key={mod.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white font-sans">{mod.title}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold border shrink-0 ${
                      mod.priority === 'HIGH'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : mod.priority === 'MEDIUM'
                          ? 'bg-sky-950 text-sky-300 border-sky-800'
                          : 'bg-slate-900 text-slate-300 border-slate-700'
                    }`}
                  >
                    {mod.priority}
                  </span>
                </div>
                <p className="text-[11px] font-sans text-slate-400 leading-relaxed">
                  {mod.summary}
                </p>
                <div className="text-[10px] text-teal-400">Module Target: {mod.impactArea}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
