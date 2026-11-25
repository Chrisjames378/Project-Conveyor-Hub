import React, { useState } from 'react';
import { ActiveTab } from '../types';
import {
  ArrowRight,
  Award,
  Check,
  Download,
  Globe2,
  Lock,
  MapPin,
  Radio,
  Send,
  ShieldCheck,
  Wind
} from 'lucide-react';
import { downloadFile } from '../utils/exportUtils';

interface LandingPageProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setActiveTab }) => {
  const [investorName, setInvestorName] = useState('');
  const [investorEmail, setInvestorEmail] = useState('');
  const [investorOrg, setInvestorOrg] = useState('');
  const [investorType, setInvestorType] = useState('Venture Capital / Angel');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmitDataRoomRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const downloadExecutiveOnePager = () => {
    const textContent = `SALIBUOY SYSTEMS ("PROJECT CONVEYOR")
EXECUTIVE INVESTMENT & GRANT SUMMARY (1-PAGER)
===================================================
HEADQUARTERS: Pukekohe, Auckland, New Zealand
FOUNDER BASE: Sole Trader Entity (NZBN Pending)
SECTOR: DeepTech / Ocean Climate Hardware / AMOC Stabilization
TARGET SEED ROUND: $1,500,000 NZD ($600k Non-dilutive Callaghan Grant + $900k Equity)

1. THE GLOBAL CLIMATE THREAT
Accelerating meltwater from the Greenland Ice Sheet delivers excess freshwater to the North Atlantic, diluting surface salinity and threatening to collapse the Atlantic Meridional Overturning Circulation (AMOC) by 2040–2050.

2. THE SALIBUOY TECHNOLOGICAL SOLUTION
SaliBuoy Systems builds wind-powered, subsurface oceanographic buoys that restore natural oceanic thermohaline downwelling:
  - Wind & Wave Kinetic Harvesting: Autonomous offshore energy capture.
  - Natural Seawater Concentration: Extracts ambient seawater and concentrates it to 42.0–48.0 PSU natural brine.
  - Subsurface Plume Injection: Injects dense brine at 200m–500m depth to force downward convective plumes.
  - Zero-Chemical Impact: 100% natural concentrated seawater brine with zero synthetic additives.

3. NEW ZEALAND ADVANTAGE & R&D ECOSYSTEM
  - R&D Facility: Outset Ventures (Pukekohe, Auckland).
  - Oceanography Data: NIWA Southern Ocean bathymetry & circulation modeling.
  - Government Co-Funding: 40% Callaghan Innovation R&D rebate.
  - Regulatory Clearance: EPA EEZ Act Permitted Activity & Maritime NZ COLREGS compliance.

CONTACT: chris.james378@gmail.com • Pukekohe, Auckland, New Zealand`;

    downloadFile(textContent, 'SaliBuoy_Systems_Executive_OnePager.txt', 'text/plain');
  };

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      {/* Asymmetrical Editorial + Telemetry Instrument Hero */}
      <section className="relative overflow-hidden bg-[#060f1f]/95 border border-slate-800/90 rounded-2xl p-6 sm:p-10 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Core Narrative & Primary CTAs */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center space-x-2 text-[11px] font-mono text-sky-400 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Auckland DeepTech • Seed Round Open</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.12]">
              Stabilizing the Ocean Conveyor.{' '}
              <span className="text-sky-400">Preserving Earth&apos;s Climate.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              SaliBuoy Systems builds autonomous, wind- and wave-powered subsurface buoys engineered in New Zealand to reinforce thermohaline downwelling and monitor polar ocean health with zero synthetic chemicals.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                onClick={() => setActiveTab('ocean-boys-fleet')}
                className="inline-flex items-center space-x-2 px-5 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <Radio className="w-4 h-4" />
                <span>Launch 23-Buoy Fleet</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('wind-turbine-3d')}
                className="inline-flex items-center space-x-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 font-semibold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <Wind className="w-4 h-4 text-sky-400" />
                <span>3D Turbine Platform</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('data-room-form');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center space-x-2 px-4 py-3 bg-slate-950 hover:bg-slate-900 text-emerald-300 border border-emerald-800/70 font-mono text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Data Room</span>
              </button>

              <button
                type="button"
                onClick={downloadExecutiveOnePager}
                className="inline-flex items-center space-x-2 px-4 py-3 bg-slate-950 hover:bg-slate-900 text-slate-300 border border-slate-800 font-mono text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-sky-400" />
                <span>1-Pager</span>
              </button>
            </div>
          </div>

          {/* Right Column: Precision Telemetry Readiness Card */}
          <div className="lg:col-span-5 bg-[#030812] border border-slate-800 rounded-2xl p-5 space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800/90 pb-3">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Hardware &amp; Telemetry Spec
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                MARK-III READY
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block uppercase">Seed Round</span>
                <span className="text-lg font-bold text-emerald-400 tabular-nums">$1.5M NZD</span>
                <span className="text-[10px] text-slate-400 block">40% Callaghan Rebate</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block uppercase">Target Plume</span>
                <span className="text-lg font-bold text-cyan-300 tabular-nums">45.0 PSU</span>
                <span className="text-[10px] text-slate-400 block">200–500 m Depth</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block uppercase">Synthetic Chem</span>
                <span className="text-lg font-bold text-white tabular-nums">0.00 ppm</span>
                <span className="text-[10px] text-slate-400 block">Pure Seawater Brine</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block uppercase">Acoustic Shield</span>
                <span className="text-lg font-bold text-sky-300 tabular-nums">84.2 dB</span>
                <span className="text-[10px] text-slate-400 block">Limit &lt;120 dB IMO</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
              <span className="text-slate-400">R&amp;D Facility: Outset Pukekohe</span>
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="text-sky-400 hover:text-sky-300 font-bold flex items-center space-x-1 cursor-pointer"
              >
                <span>Open Mission Control</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Physical Mechanism */}
      <section className="bg-[#060f1f]/90 border border-slate-800/90 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 text-xs font-mono text-sky-400 uppercase">
              <Globe2 className="w-4 h-4" />
              <span>Thermohaline Physics</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-white">
              How SaliBuoy Reinforces Ocean Downwelling
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            Greenland glacial melt dilutes surface salinity and weakens sinking convection. SaliBuoy restores local density using ambient wind and swell energy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#030812] p-5 rounded-xl border border-slate-800 space-y-2.5">
            <span className="text-xs font-mono font-bold text-sky-400">01 / KINETIC CAPTURE</span>
            <h3 className="text-base font-bold text-white">Wind &amp; Wave Energy Harvesting</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Surface vertical-axis rotors and wave floats generate continuous off-grid mechanical and electrical power across sub-polar storm bands.
            </p>
          </div>

          <div className="bg-[#030812] p-5 rounded-xl border border-slate-800 space-y-2.5">
            <span className="text-xs font-mono font-bold text-teal-400">02 / BRINE CONCENTRATION</span>
            <h3 className="text-base font-bold text-white">Membrane-Less Natural Salinity</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dual-chamber ceramic pumps concentrate ambient seawater to 42.0–48.0 PSU natural brine with zero synthetic polymers or anti-scalants.
            </p>
          </div>

          <div className="bg-[#030812] p-5 rounded-xl border border-slate-800 space-y-2.5">
            <span className="text-xs font-mono font-bold text-emerald-400">03 / DEEP CONVECTION</span>
            <h3 className="text-base font-bold text-white">Subsurface Plume Injection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-nozzle diffusers release dense plumes into high-shear currents at 200m–500m depth (&gt;1050 kg/m³), re-igniting downward water transport.
            </p>
          </div>
        </div>
      </section>

      {/* NZ DeepTech Ecosystem */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        <div className="bg-[#060f1f]/90 p-5 rounded-xl border border-slate-800 space-y-2">
          <ShieldCheck className="w-5 h-5 text-sky-400" />
          <h4 className="font-bold text-white text-sm font-sans">40% Non-Dilutive Rebate</h4>
          <p className="text-slate-400 leading-relaxed font-sans">
            Callaghan Innovation R&amp;D grants cover 40% of prototyping, vessel charter, and engineering expenses in NZ.
          </p>
        </div>

        <div className="bg-[#060f1f]/90 p-5 rounded-xl border border-slate-800 space-y-2">
          <MapPin className="w-5 h-5 text-teal-400" />
          <h4 className="font-bold text-white text-sm font-sans">Outset Ventures Pukekohe</h4>
          <p className="text-slate-400 leading-relaxed font-sans">
            Access to Auckland wet-labs, hyperbaric pressure testing tanks, and deep-tech hardware mentors.
          </p>
        </div>

        <div className="bg-[#060f1f]/90 p-5 rounded-xl border border-slate-800 space-y-2">
          <Lock className="w-5 h-5 text-amber-400" />
          <h4 className="font-bold text-white text-sm font-sans">IPONZ Provisional Patent</h4>
          <p className="text-slate-400 leading-relaxed font-sans">
            Priority filing path for the variable-density diffusion nozzle with clean IP assignment for seed investors.
          </p>
        </div>

        <div className="bg-[#060f1f]/90 p-5 rounded-xl border border-slate-800 space-y-2">
          <Award className="w-5 h-5 text-emerald-400" />
          <h4 className="font-bold text-white text-sm font-sans">EPA EEZ Permitted</h4>
          <p className="text-slate-400 leading-relaxed font-sans">
            Maritime NZ COLREGS and EPA EEZ Act compliant for Hauraki Gulf and sub-Antarctic proving trials.
          </p>
        </div>
      </section>

      {/* Investor & Grant Data Room Request Form */}
      <section id="data-room-form" className="bg-[#060f1f]/95 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="max-w-2xl mx-auto text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs font-mono text-sky-400 uppercase">
            <Lock className="w-4 h-4" />
            <span>Confidential Data Room Access</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Request Investor Data Room &amp; Grant Prospectus
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Receive access to the financial model, pressure vessel blueprints, and Pukekohe wet-lab test reports.
          </p>
        </div>

        {formSubmitted ? (
          <div className="max-w-xl mx-auto bg-[#030812] p-8 rounded-2xl border border-emerald-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Data Room Request Received</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Thank you, <strong>{investorName}</strong>. Prospectus details for the SaliBuoy Mark-III program have been queued for <strong>{investorEmail}</strong>.
            </p>

            <button
              type="button"
              onClick={downloadExecutiveOnePager}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Executive 1-Pager</span>
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmitDataRoomRequest}
            className="max-w-xl mx-auto space-y-4 bg-[#030812] p-6 rounded-2xl border border-slate-800 text-xs font-mono"
          >
            <div>
              <label className="block text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Sarah Jenkins"
                value={investorName}
                onChange={(e) => setInvestorName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Work Email *</label>
              <input
                type="email"
                required
                placeholder="sarah@outsetventures.co.nz"
                value={investorEmail}
                onChange={(e) => setInvestorEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1">Organization / Fund *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Outset Ventures / Callaghan"
                  value={investorOrg}
                  onChange={(e) => setInvestorOrg(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Evaluator Category</label>
                <select
                  value={investorType}
                  onChange={(e) => setInvestorType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="Venture Capital / Angel">Venture Capital / Angel Fund</option>
                  <option value="Government Grant Evaluator">Government Grant Committee</option>
                  <option value="Ocean Research Partner">Ocean Research Institute (NIWA/Uni)</option>
                  <option value="DeepTech Incubator">Incubator Manager (Outset/Icehouse)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center space-x-2 py-3.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Data Room Access Request</span>
            </button>
          </form>
        )}
      </section>
    </div>
  );
};
