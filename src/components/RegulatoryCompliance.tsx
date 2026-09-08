import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  FileText, 
  Anchor, 
  Globe2, 
  AlertTriangle,
  Download,
  Copy,
  Check
} from 'lucide-react';

export const RegulatoryCompliance: React.FC = () => {
  const [copiedEia, setCopiedEia] = useState(false);

  const eiaSummaryText = `SALIBUOY SYSTEMS - ENVIRONMENTAL IMPACT ASSESSMENT SUMMARY
-----------------------------------------------------------
PROJECT: Ocean Salinity Injection & AMOC Downwelling Proving Trials
TEST ZONE: Outer Hauraki Gulf / EEZ Boundary, New Zealand
PROPOSED ACTIVITY: Autonomous subsurface extraction and localized release of concentrated natural ocean brine (38.5 to 45.0 PSU).

KEY COMPLIANCE & SAFETY FINDINGS:
1. ZERO CHEMICAL ADDITIVES: Brine is generated 100% physically via seawater concentration (ambient ocean salt). Zero synthetic polymers, heavy metals, or anti-scalants.
2. DISCHARGE PLUME BEHAVIOR: Dense brine descends vertically toward subsea floor channels at 3.5 - 5.0 cm/s, rapidly diluting to baseline within 40m radius.
3. MARITIME SAFETY (COLREGS): Moored buoy equipped with yellow IALA flashing light (5nm range), radar reflector, and Class-B AIS Transponder.
4. ACOUSTIC EMISSIONS: Subsea acoustic doppler current profiler operates above 200 kHz (inaudible to cetaceans and marine mammals).`;

  const copyEia = () => {
    navigator.clipboard.writeText(eiaSummaryText);
    setCopiedEia(true);
    setTimeout(() => setCopiedEia(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
        <div className="flex items-center space-x-2 text-xs font-mono text-sky-400">
          <ShieldAlert className="w-4 h-4" />
          <span>Maritime Law & Ocean Environmental Governance</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Maritime NZ, EPA EEZ Act & UNCLOS Compliance Framework
        </h2>
        <p className="text-xs text-slate-400 max-w-3xl">
          Complete regulatory architecture governing offshore buoy deployment, natural brine discharge consents, navigation hazard compliance, and international marine scientific research rights.
        </p>
      </div>

      {/* Compliance Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1: Maritime NZ */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-sky-950 text-sky-400 rounded-lg border border-sky-800/60">
              <Anchor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">1. Maritime New Zealand</h3>
              <p className="text-[11px] text-slate-400">Navigation & Safety Compliance</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
              <span className="font-mono text-sky-300 font-bold block text-[11px]">IALA Special Mark Aid:</span>
              <p className="text-[11px] text-slate-400">Yellow hull with yellow flashing light (Fl Y 4s, 5nm visibility range).</p>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
              <span className="font-mono text-sky-300 font-bold block text-[11px]">AIS Navigation Notice:</span>
              <p className="text-[11px] text-slate-400">Class-B AIS transponder broadcasting "Special Mark Buoy" hazard position to vessel traffic.</p>
            </div>
          </div>
        </div>

        {/* Pillar 2: EPA EEZ Act */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-950 text-emerald-400 rounded-lg border border-emerald-800/60">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">2. EPA NZ EEZ Act</h3>
              <p className="text-[11px] text-slate-400">Environmental Discharge Exemption</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
              <span className="font-mono text-emerald-300 font-bold block text-[11px]">Natural Brine Exemption:</span>
              <p className="text-[11px] text-slate-400">Zero chemical additive discharge qualifies under EEZ Permitted Activity rules for physical research.</p>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
              <span className="font-mono text-emerald-300 font-bold block text-[11px]">EIA Assessment:</span>
              <p className="text-[11px] text-slate-400">Localized hyper-saline plume assessment submitted to EPA prior to Southern Ocean trials.</p>
            </div>
          </div>
        </div>

        {/* Pillar 3: UNCLOS & High Seas */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-purple-950 text-purple-400 rounded-lg border border-purple-800/60">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">3. UNCLOS Article 238</h3>
              <p className="text-[11px] text-slate-400">International High Seas Treaty</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
              <span className="font-mono text-purple-300 font-bold block text-[11px]">Marine Research Mandate:</span>
              <p className="text-[11px] text-slate-400">Grants all states right to deploy oceanographic telemetry buoys in international waters for climate study.</p>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
              <span className="font-mono text-purple-300 font-bold block text-[11px]">Ocean Carbon Rights:</span>
              <p className="text-[11px] text-slate-400">Establishing international protocol for AMOC downwelling cryo-stabilization credits.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Impact Assessment Document Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base">Environmental Impact Assessment (EIA) Summary</h3>
            <p className="text-xs text-slate-400">Prepared for EPA New Zealand & Maritime NZ Coastal Discharge Consent.</p>
          </div>

          <button
            onClick={copyEia}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition-colors cursor-pointer"
          >
            {copiedEia ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedEia ? 'Copied EIA Summary!' : 'Copy EIA Summary'}</span>
          </button>
        </div>

        <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
          {eiaSummaryText}
        </pre>
      </div>
    </div>
  );
};
