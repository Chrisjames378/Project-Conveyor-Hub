import { useState } from 'react';
import { Mail, Briefcase, Anchor, Clipboard, ClipboardCheck } from 'lucide-react';
import { DocCategory } from '../types';

interface DocumentContent {
  title: string;
  category: DocCategory;
  to: string;
  subject: string;
  body: string;
  signoff: string;
  icon: typeof Mail;
}

const DOCUMENTS: Record<DocCategory, DocumentContent> = {
  sovereign: {
    title: 'The Sovereign Partnership Proposal',
    category: 'sovereign',
    to: 'The Nordic Council of Ministers / Swedish Meteorological and Hydrological Institute (SMHI)',
    subject: 'Response to the Feb 2026 AMOC Tipping Report: Proposed Kinetic Reinforcement Pilot',
    body: `Following the release of the "Nordic Perspective on AMOC Tipping" report, it is evident that observational monitoring must be met with immediate physical preparation. SaliBuoy Systems has completed the preliminary engineering architecture for a hardware-level intervention: Project Conveyor.

We have designed the Polar Recovery Engine (PRE)—a modular, autonomous system built to mechanically bypass the "freshwater lid" in the Irminger and Nordic Seas. By directly coupling surface wind capture with high-torque subsurface injection propellers, our system delivers localized density reinforcement to active downwelling chimneys without consuming external fuel grids.

We are seeking a collaborative technical dialogue regarding a Phase 1 pilot deployment in the Fram Strait to validate down-prop plume coherence alongside your newly proposed Early Warning System.`,
    signoff: 'Christopher McKay\nManaging Director, SaliBuoy Systems',
    icon: Anchor,
  },
  vc: {
    title: 'The Venture Capital Briefing',
    category: 'vc',
    to: 'Investment Partners (Propeller VC / SWEN Blue Ocean)',
    subject: 'Project Conveyor: Hard-Tech for AMOC Stabilization (Seed Opportunity)',
    body: `While existing ocean-climate tech focuses heavily on Marine Carbon Dioxide Removal (mCDR), SaliBuoy Systems is targeting the physical mechanics of global circulation. 

The impending stabilization risk of the AMOC is currently being priced into sovereign risk portfolios, yet the market lacks operational hardware solutions. Project Conveyor closes this gap via the Polar Recovery Engine: a self-powered, autonomous kinetic array built from Super Duplex steel and 2026 self-healing polymers.

By establishing Oceanic Circulation Credits (OCCs), we are introducing a hard-asset class engineered for the $100B+ macro-reinsurance market. We are opening our Seed Round to transition our active fluid-dynamics models into deep-water tank verification and upcoming ocean trials.`,
    signoff: 'Christopher McKay\nChief Architect, SaliBuoy Systems',
    icon: Briefcase,
  },
  field: {
    title: 'The Field Logistics Collaboration Note',
    category: 'field',
    to: 'Lead Scientists, ARIA RASI Field Operations (Cambridge Bay, Nunavut)',
    subject: 'Collaboration: Integrating Subsurface Turbines with Surface Sea-Ice Thickening',
    body: `We have been tracking your field operations regarding winter top-down ice thickening. Your empirical validation of surface-spraying logistics represents a critical milestone for polar restoration.

SaliBuoy Systems has designed a subsurface counterpart that can build directly upon your field-tested methodology. The Polar Recovery Engine integrates a low-RPM kinetic injection prop beneath the ice frame. While your pumps spray surface sea-water to rebuild protective pack ice, our subsurface turbine drives the heavy, hyper-saline byproduct downward to prevent regional AMOC stagnation.

By combining surface cryo-spraying with mechanical downwelling, we can effectively double the verified climate insulation value of our deployment footprints. We would like to explore options for adding a subsurface kinetic module to your upcoming trial configurations.`,
    signoff: 'Christopher McKay\nManaging Director, SaliBuoy Systems',
    icon: Mail,
  },
};

export default function DocViewer() {
  const [activeDoc, setActiveDoc] = useState<DocCategory>('sovereign');
  const [copied, setCopied] = useState(false);

  const doc = DOCUMENTS[activeDoc];

  const handleCopy = () => {
    const fullText = `SALIBUOY SYSTEMS OUTREACH PROFILE
----------------------------------------
DATE: June 2026
TO: ${doc.to}
SUBJECT: ${doc.subject}

Dear Recipients,

${doc.body}

Sincerely,
${doc.signoff}`;

    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const IconComponent = doc.icon;

  return (
    <div className="flex flex-col h-full bg-slate-950/90 rounded-lg border border-slate-600 overflow-hidden shadow-xl">
      {/* Selector Tabs */}
      <div className="flex border-b border-slate-600 bg-slate-900/90 p-1.5 gap-1 overflow-x-auto">
        {(Object.keys(DOCUMENTS) as DocCategory[]).map((cat) => {
          const item = DOCUMENTS[cat];
          const isActive = activeDoc === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setActiveDoc(cat);
                setCopied(false);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded font-mono text-[11px] uppercase tracking-wider transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-sky-500/10 border border-sky-400 text-sky-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <item.icon className="w-3.5 h-3.5" />
              <span>{cat === 'sovereign' ? 'Sovereign' : cat === 'vc' ? 'Venture Capital' : 'Field Logistics'}</span>
            </button>
          );
        })}
      </div>

      {/* Document Sheet Container */}
      <div className="flex-1 p-4 md:p-5 bg-slate-950 overflow-y-auto font-sans relative">
        {/* Copy Floating Action Button */}
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-500 hover:border-sky-400 rounded text-slate-300 hover:text-sky-300 transition-all shadow-md flex items-center gap-1.5 z-10"
          title="Copy Document to Clipboard"
        >
          {copied ? (
            <>
              <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Copied</span>
            </>
          ) : (
            <>
              <Clipboard className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-mono text-[9px] uppercase tracking-wider">Copy Text</span>
            </>
          )}
        </button>

        {/* Professional Letterhead Grid */}
        <div className="border-b border-slate-600 pb-4 mb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            {/* Firm Details */}
            <div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-sky-400 rounded-sm animate-pulse" />
                <h2 className="font-display text-base font-bold uppercase tracking-wider text-slate-100">
                  SALIBUOY SYSTEMS
                </h2>
              </div>
              <p className="font-mono text-[8px] text-sky-400 uppercase tracking-widest mt-0.5">
                salibuoysystems.com // Environmental Intervention Systems
              </p>
            </div>
            {/* Meta Timestamp */}
            <div className="font-mono text-right text-[9px] text-slate-400 bg-slate-900/50 px-2 py-1 rounded border border-slate-600">
              <span className="text-slate-500">FILED:</span> JUNE 2026 // <span className="text-sky-400">PRO-00{(activeDoc === 'sovereign' ? 1 : activeDoc === 'vc' ? 2 : 3)}</span>
            </div>
          </div>
        </div>

        {/* Recipients Header */}
        <div className="space-y-1 mb-4 text-slate-300 font-mono text-[11px] max-w-4xl">
          <div className="grid grid-cols-[70px_1fr] border-b border-slate-900 py-0.5">
            <span className="text-slate-500 uppercase tracking-wider font-bold">TO:</span>
            <span className="text-slate-200 font-semibold">{doc.to}</span>
          </div>
          <div className="grid grid-cols-[70px_1fr] border-b border-slate-900 py-0.5">
            <span className="text-slate-500 uppercase tracking-wider font-bold">FROM:</span>
            <span className="text-slate-200">Christopher McKay, Managing Director</span>
          </div>
          <div className="grid grid-cols-[70px_1fr] border-b border-slate-900 py-0.5">
            <span className="text-slate-500 uppercase tracking-wider font-bold">SUBJECT:</span>
            <span className="text-sky-300 font-bold">{doc.subject}</span>
          </div>
        </div>

        {/* Body Text */}
        <div className="space-y-3 text-slate-300 text-xs leading-relaxed font-sans max-w-4xl border-l-2 border-slate-600 pl-3.5 py-0.5">
          {doc.body.split('\n\n').map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {/* Signoff block */}
        <div className="mt-6 pt-4 border-t border-slate-600 max-w-4xl">
          <p className="font-mono text-[10px] text-slate-400">Respectfully Submitted,</p>
          <div className="mt-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-600 flex items-center justify-center text-slate-400">
              <IconComponent className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <p className="font-display text-xs font-bold text-slate-200">Christopher McKay</p>
              <p className="font-mono text-[9px] text-slate-500 uppercase tracking-wider">
                Managing Director & Chief Systems Architect
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
