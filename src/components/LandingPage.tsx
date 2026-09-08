import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { 
  Anchor, 
  ArrowRight, 
  Award, 
  Check, 
  CheckCircle2, 
  Compass, 
  Cpu, 
  DollarSign, 
  Download, 
  FileText, 
  Globe2, 
  Layers, 
  Lock, 
  Mail, 
  MapPin, 
  Radio, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Waves, 
  Zap 
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
Accelerating meltwater from the Greenland Ice Sheet delivers excess freshwater to the North Atlantic, diluting surface salinity and threatening to collapse the Atlantic Meridional Overturning Circulation (AMOC) by 2040–2050. AMOC collapse would alter global weather patterns, disrupt agricultural yields, and accelerate sea-level rise across Europe and the Americas.

2. THE SALIBUOY TECHNOLOGICAL SOLUTION
SaliBuoy Systems builds wind-powered, subsurface oceanographic buoys that restore natural oceanic thermohaline downwelling:
  - Wind Kinetic Harvesting: Converts surface wind rotor rotation into high-pressure mechanical energy.
  - Natural Seawater Concentration: Extracts ambient ocean water and concentrates it to 42.0–48.0 PSU natural brine.
  - Subsurface Plume Injection: Injects dense brine at depths of 200m–500m to force downward convective plumes, triggering localized ocean downwelling.
  - Zero-Chemical Impact: 100% natural concentrated seawater brine with zero synthetic additives.

3. NEW ZEALAND ADVANTAGE & R&D ECOSYSTEM
  - R&D Facility: DeepTech incubation at Outset Ventures (Pukekohe, Auckland).
  - Oceanography Data: NIWA Southern Ocean bathymetry & circulation modeling.
  - Government Co-Funding: 40% Callaghan Innovation R&D non-dilutive co-funding rebate.
  - Regulatory Clearance: EPA EEZ Act Permitted Activity for marine scientific research & Maritime NZ COLREGS navigation compliance.

4. SEED ROUND CAPITAL ALLOCATION ($1.5M NZD)
  - 38% ($570k): Hardware Fabrication & Pressure Vessel Prototyping (Grade 5 Titanium)
  - 25% ($375k): Offshore Vessel Charters & Hauraki Gulf / Southern Ocean Proving Trials
  - 22% ($330k): Pukekohe Wet-Lab Pressure Tank Testing & Engineering Labor
  - 15% ($225k): Global Patent Prosecution (IPONZ / PCT) & Regulatory Consents

CONTACT FOR INVESTOR & GRANT INQUIRIES:
Email: chris.james378@gmail.com
Operations Base: Pukekohe, Auckland, New Zealand`;

    downloadFile(textContent, 'SaliBuoy_Systems_Executive_OnePager.txt', 'text/plain');
  };

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl">
        {/* Background Decorative Glow Effect */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>New Zealand DeepTech Climate Innovation • Seed Round Open</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Stabilizing the Ocean Conveyor.{' '}
            <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Preserving Earth's Climate.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            SaliBuoy Systems builds autonomous, wind-powered subsurface buoys engineered to force ocean downwelling and stabilize the Atlantic Meridional Overturning Circulation (AMOC).
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                const el = document.getElementById('data-room-form');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-sky-950/50 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Request Investor Data Room</span>
            </button>

            <button
              onClick={downloadExecutiveOnePager}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-mono text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span>Download 1-Pager (TXT)</span>
            </button>

            <button
              onClick={() => setActiveTab('overview')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-slate-950 hover:bg-slate-900 text-sky-300 border border-sky-800/60 font-mono text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
            >
              <span>Explore Founder App Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Key Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-800/80 text-left font-mono">
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Target Seed Round</span>
              <span className="text-lg font-bold text-emerald-400">$1,500,000 <span className="text-xs">NZD</span></span>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Callaghan Non-Dilutive</span>
              <span className="text-lg font-bold text-sky-400">$600,000 <span className="text-xs">Rebate (40%)</span></span>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">R&D Base</span>
              <span className="text-sm font-bold text-white">Outset Pukekohe <span className="text-xs text-slate-400">AUCKLAND</span></span>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Environmental Impact</span>
              <span className="text-sm font-bold text-teal-300">100% Zero-Chemical <span className="text-xs text-slate-400">BRINE</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* The AMOC Crisis & How SaliBuoy Works */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs font-mono text-sky-400">
            <Globe2 className="w-4 h-4" />
            <span>The Planetary Climate Physics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">How SaliBuoy Stabilizes Thermohaline Downwelling</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Greenland meltwater dilutes surface ocean salinity, preventing dense water sinking. SaliBuoy restores downwelling mechanics using zero-emission ocean wave power.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400 font-mono font-bold">
              01
            </div>
            <h3 className="text-base font-bold text-white">Wave Kinetic Harvesting</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Buoy floats capture mechanical energy from 3m–5m ocean swell, generating up to 350W of continuous zero-carbon pumping power without external fuels.
            </p>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400 font-mono font-bold">
              02
            </div>
            <h3 className="text-base font-bold text-white">Natural Salt Concentration</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dual-chamber ceramic pumps extract seawater and concentrate it to 42.0–48.0 PSU natural brine using zero synthetic chemicals or anti-scalants.
            </p>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 font-mono font-bold">
              03
            </div>
            <h3 className="text-base font-bold text-white">Subsurface Injection Plumes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              High-density brine is injected at depths of 200m–500m where seawater density reaches &gt;1050 kg/m³, forcing convective downward plumes to jump-start downwelling.
            </p>
          </div>
        </div>
      </section>

      {/* Why Invest in SaliBuoy Systems (NZ DeepTech Ecosystem) */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono text-emerald-400">DeepTech Investment Highlights</span>
            <h2 className="text-2xl font-bold text-white mt-1">Why Back SaliBuoy Systems Now?</h2>
          </div>

          <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-mono font-bold rounded-lg self-start sm:self-auto">
            NZ SEED ROUND OPEN
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            <h4 className="font-bold text-white text-sm">40% Non-Dilutive Rebate</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Callaghan Innovation R&D grants cover 40% of prototyping, vessel charter, and labor expenses in NZ.
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <MapPin className="w-5 h-5 text-teal-400" />
            <h4 className="font-bold text-white text-sm">Outset Ventures Pukekohe</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Direct access to Auckland wet-labs, hyperbaric pressure testing tanks, and physical science advisory.
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <h4 className="font-bold text-white text-sm">IPONZ Provisional Patent</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Filing priority date for the variable-density diffusion nozzle with clean IP assignment deed for VC transition.
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <Award className="w-5 h-5 text-purple-400" />
            <h4 className="font-bold text-white text-sm">EPA EEZ Permitted Activity</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Maritime NZ and EPA EEZ Act compliant for rapid deployment off Hauraki Gulf and sub-Antarctic trial zones.
            </p>
          </div>
        </div>
      </section>

      {/* Investor & Grant Data Room Request Form */}
      <section id="data-room-form" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="max-w-2xl mx-auto text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs font-mono text-purple-400">
            <Lock className="w-4 h-4" />
            <span>Secure Confidential Data Room Access</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Request Investor Data Room & Grant Prospectus</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Get instant access to the SaliBuoy Systems financial model, hardware pressure vessel blueprints, and wet-lab test reports.
          </p>
        </div>

        {formSubmitted ? (
          <div className="max-w-xl mx-auto bg-slate-950 p-8 rounded-2xl border border-emerald-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Data Room Request Received!</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Thank you, <strong>{investorName}</strong>. A confidential download link for the SaliBuoy Mark-III prospectus and financial model has been queued for <strong>{investorEmail}</strong>.
            </p>

            <button
              onClick={downloadExecutiveOnePager}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Executive 1-Pager Immediately</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitDataRoomRequest} className="max-w-xl mx-auto space-y-4 bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 text-xs font-mono">
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
                <label className="block text-slate-300 mb-1">Investor / Evaluator Category</label>
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
              className="w-full inline-flex items-center justify-center space-x-2 py-3.5 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-sky-950/50"
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
