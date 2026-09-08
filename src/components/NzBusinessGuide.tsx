import React, { useState } from 'react';
import { BusinessTask } from '../types';
import { INITIAL_BUSINESS_TASKS } from '../db/localDatabase';
import { 
  FileCheck2, 
  CheckSquare, 
  Square, 
  ExternalLink, 
  HelpCircle, 
  DollarSign, 
  ShieldCheck, 
  Building2, 
  Briefcase, 
  Scale, 
  Copy, 
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const NzBusinessGuide: React.FC = () => {
  const [tasks, setTasks] = useState<BusinessTask[]>(() => {
    const saved = localStorage.getItem('salibuoy_business_tasks');
    return saved ? JSON.parse(saved) : INITIAL_BUSINESS_TASKS;
  });

  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('biz-1');

  const toggleTaskStatus = (id: string) => {
    const updated = tasks.map(t => {
      if (t.id === id) {
        const nextStatus: BusinessTask['status'] = 
          t.status === 'Completed' ? 'Pending' : 'Completed';
        return { ...t, status: nextStatus };
      }
      return t;
    });
    setTasks(updated);
    localStorage.setItem('salibuoy_business_tasks', JSON.stringify(updated));
  };

  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const totalCost = tasks.reduce((acc, curr) => acc + curr.estimatedCostNZD, 0);

  const ipAssignmentTemplate = `SOLE TRADER INTELLECTUAL PROPERTY ASSIGNMENT DEED
--------------------------------------------------
DATE: 2026-09-07
FOUNDER / SOLE TRADER: Chris James (Trading as "SaliBuoy Systems")
ENTITY LOCATION: Auckland, New Zealand (NZBN: Pending)

WHEREAS:
1. Founder has invented and developed proprietary technology relating to autonomous oceanic salinity injection buoys ("SaliBuoy Systems / Project Conveyor").
2. Founder intends to assign all global Intellectual Property (IP), including IPONZ Provisional Patent Application(s), CAD designs, PCB layouts, firmware, and trade secrets to SaliBuoy Systems Limited upon corporate incorporation for NZ DeepTech VC investment.

COVENANTS:
- All inventions, hardware designs, and firmware developed under SaliBuoy Systems shall belong solely to the business entity.
- Clean title guarantee provided to incoming investors (Outset Ventures / Pacific Channel).`;

  const copyTemplate = () => {
    navigator.clipboard.writeText(ipAssignmentTemplate);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950 border border-slate-800 rounded-2xl p-6 space-y-3">
        <div className="flex items-center space-x-2 text-xs font-mono text-sky-400">
          <Building2 className="w-4 h-4" />
          <span>New Zealand Business Formation & Legal Architecture</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          How to Register SaliBuoy Systems as a Sole Trader in NZ
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Step-by-step practical legal guide for establishing SaliBuoy Systems in New Zealand. Sole Trader registration is fast, costs $0 to start, and allows immediate qualification for government R&D grants before converting into a Limited Company for VC investment.
        </p>

        {/* Progress Bar */}
        <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center space-x-3">
            <span className="text-slate-400">Setup Progress:</span>
            <span className="text-emerald-400 font-bold">{completedCount} of {tasks.length} Steps Completed</span>
          </div>
          <div className="text-slate-400">
            Total Initial Official Fees: <span className="text-white font-bold">${totalCost} NZD</span>
          </div>
        </div>
      </div>

      {/* Quick Summary Steps Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="w-7 h-7 rounded-lg bg-sky-950 text-sky-400 flex items-center justify-center font-bold text-xs font-mono">
            01
          </div>
          <h3 className="font-bold text-white text-sm">1. Instant NZBN Registration</h3>
          <p className="text-xs text-slate-400">
            Visit <a href="https://www.nzbn.govt.nz" target="_blank" rel="noreferrer" className="text-sky-400 underline">nzbn.govt.nz</a>, log in with RealMe, and claim a free New Zealand Business Number for SaliBuoy Systems.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">
            02
          </div>
          <h3 className="font-bold text-white text-sm">2. IRD & GST Setup</h3>
          <p className="text-xs text-slate-400">
            In myIR, add BIC code M691010 (Scientific Research). Register for GST once grant funding or revenue exceeds NZD $60k/yr.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="w-7 h-7 rounded-lg bg-teal-950 text-teal-400 flex items-center justify-center font-bold text-xs font-mono">
            03
          </div>
          <h3 className="font-bold text-white text-sm">3. Provisional Patent ($160)</h3>
          <p className="text-xs text-slate-400">
            File a provisional patent via <a href="https://www.iponz.govt.nz" target="_blank" rel="noreferrer" className="text-sky-400 underline">iponz.govt.nz</a> for the salinity diffusion nozzle to lock in a 12-month global filing date.
          </p>
        </div>
      </div>

      {/* Interactive Task Checklist */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <FileCheck2 className="w-5 h-5 text-sky-400" />
          <span>Interactive Sole Trader Action Checklist</span>
        </h3>

        <div className="space-y-3">
          {tasks.map((task) => {
            const isCompleted = task.status === 'Completed';
            const isOpen = activeAccordion === task.id;

            return (
              <div 
                key={task.id}
                className={`bg-slate-900/90 border rounded-xl transition-all duration-200 overflow-hidden ${
                  isCompleted ? 'border-emerald-900/60 bg-emerald-950/10' : 'border-slate-800'
                }`}
              >
                {/* Header Row */}
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer select-none hover:bg-slate-800/40"
                  onClick={() => setActiveAccordion(isOpen ? null : task.id)}
                >
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskStatus(task.id);
                      }}
                      className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      {isCompleted ? (
                        <CheckSquare className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                          {task.category}
                        </span>
                        <span className="text-xs text-slate-400 font-mono hidden sm:inline">{task.nzEntityName}</span>
                      </div>
                      <h4 className={`text-sm font-bold mt-1 ${isCompleted ? 'text-emerald-300 line-through' : 'text-white'}`}>
                        {task.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-xs font-mono">
                    <span className="text-slate-400 hidden sm:inline">
                      {task.estimatedCostNZD === 0 ? 'FREE' : `$${task.estimatedCostNZD} NZD`}
                    </span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Collapsible Content */}
                {isOpen && (
                  <div className="p-4 pt-0 border-t border-slate-800/80 space-y-3 bg-slate-950/50 text-xs">
                    <p className="text-slate-300 leading-relaxed">{task.description}</p>
                    
                    <div className="space-y-1.5">
                      <span className="font-mono text-slate-400 font-bold uppercase text-[10px]">Step-by-Step Action Plan:</span>
                      <ul className="space-y-1 text-slate-300">
                        {task.keySteps.map((step, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-sky-400 font-bold font-mono shrink-0">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Official Portal: <span className="text-sky-300">{task.authorityOrPortal}</span></span>
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className={`px-3 py-1 rounded font-bold cursor-pointer transition-colors ${
                          isCompleted
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            : 'bg-emerald-600 text-white hover:bg-emerald-500'
                        }`}
                      >
                        {isCompleted ? 'Mark Pending' : 'Mark Complete'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sole Trader vs NZ Limited Company Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <Scale className="w-5 h-5 text-amber-400" />
          <span>NZ Sole Trader vs. NZ Limited Company (SaliBuoy Path)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="p-3">Feature / Legal Dimension</th>
                <th className="p-3 bg-sky-950/40 text-sky-300">Phase 1: Sole Trader (Current)</th>
                <th className="p-3 bg-purple-950/40 text-purple-300">Phase 2: SaliBuoy Systems Ltd</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="p-3 font-semibold text-white">Setup Cost & Speed</td>
                <td className="p-3 bg-sky-950/20 text-emerald-300 font-bold">$0 NZD (Instant online via NZBN)</td>
                <td className="p-3 bg-purple-950/20">$105 NZD Companies Office filing fee</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Callaghan R&D Grants</td>
                <td className="p-3 bg-sky-950/20 text-emerald-300">Eligible for 40% co-funding rebate</td>
                <td className="p-3 bg-purple-950/20">Full eligibility for large project grants</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Venture Capital Investment</td>
                <td className="p-3 bg-sky-950/20 text-slate-400">Not suitable for equity investment</td>
                <td className="p-3 bg-purple-950/20 text-purple-200 font-bold">Required for Outset & Pacific Channel VC</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Taxation Basis</td>
                <td className="p-3 bg-sky-950/20">Personal IRD tax rate (Provisional tax)</td>
                <td className="p-3 bg-purple-950/20">28% NZ Corporate Income Tax rate</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* IP Assignment Deed Template */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base">IP Assignment Deed Template (Sole Trader to Entity)</h3>
            <p className="text-xs text-slate-400">Guarantees clean intellectual property ownership for incoming seed investors.</p>
          </div>
          <button
            onClick={copyTemplate}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition-colors cursor-pointer"
          >
            {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedTemplate ? 'Copied!' : 'Copy Deed Template'}</span>
          </button>
        </div>

        <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
          {ipAssignmentTemplate}
        </pre>
      </div>
    </div>
  );
};
