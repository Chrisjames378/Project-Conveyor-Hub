import React, { useState } from 'react';
import { FundingLead } from '../types';
import { INITIAL_FUNDING_LEADS } from '../db/localDatabase';
import { exportFundingLeadsToCSV } from '../utils/exportUtils';
import { 
  DollarSign, 
  Building, 
  Filter, 
  Plus, 
  Award, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  MapPin,
  ExternalLink,
  Download
} from 'lucide-react';

export const FundingRoadmap: React.FC = () => {
  const [leads, setLeads] = useState<FundingLead[]>(() => {
    const saved = localStorage.getItem('salibuoy_funding_leads');
    return saved ? JSON.parse(saved) : INITIAL_FUNDING_LEADS;
  });

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Lead Form State
  const [newOrg, setNewOrg] = useState('');
  const [newCat, setNewCat] = useState<'Venture Capital' | 'Government Grant' | 'Research Subsidy'>('Government Grant');
  const [newFocus, setNewFocus] = useState('');
  const [newAmount, setNewAmount] = useState(250000);
  const [newReq, setNewReq] = useState('');

  const saveLeads = (updated: FundingLead[]) => {
    setLeads(updated);
    localStorage.setItem('salibuoy_funding_leads', JSON.stringify(updated));
  };

  const handleStatusChange = (id: string, newStatus: FundingLead['status']) => {
    const updated = leads.map(item => item.id === id ? { ...item, status: newStatus } : item);
    saveLeads(updated);
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrg) return;
    const item: FundingLead = {
      id: `fund-${Date.now()}`,
      category: newCat,
      organization: newOrg,
      focusArea: newFocus || 'Ocean DeepTech',
      targetAmountNZD: Number(newAmount),
      status: 'Targeted',
      probabilityPercent: 50,
      expectedDecisionMonth: 'Q1 2027',
      keyRequirement: newReq || 'Standard proposal submission',
      nzRegion: 'Auckland / National'
    };
    saveLeads([...leads, item]);
    setShowAddModal(false);
    setNewOrg('');
    setNewFocus('');
  };

  const filteredLeads = categoryFilter === 'All' 
    ? leads 
    : leads.filter(l => l.category === categoryFilter);

  // Metrics
  const totalTarget = leads.reduce((acc, curr) => acc + curr.targetAmountNZD, 0);
  const nonDilutiveTotal = leads
    .filter(l => l.category === 'Government Grant' || l.category === 'Research Subsidy')
    .reduce((acc, curr) => acc + curr.targetAmountNZD, 0);
  const approvedSecuring = leads
    .filter(l => l.status === 'Approved / Securing')
    .reduce((acc, curr) => acc + curr.targetAmountNZD, 0);

  const weightedPipeline = leads.reduce((acc, curr) => acc + (curr.targetAmountNZD * (curr.probabilityPercent / 100)), 0);

  return (
    <div className="space-y-6">
      {/* Header & Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
              <Award className="w-4 h-4" />
              <span>New Zealand DeepTech Funding Strategy</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-1">12-Month Funding & Grant Pipeline</h2>
            <p className="text-xs text-slate-400">Targeting NZD $1.5M Seed round across Venture Capital, Government R&D Grants, and Ocean Subsidies.</p>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={() => exportFundingLeadsToCSV(leads)}
              className="inline-flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-mono cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Funding Lead</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-mono">Total Pipeline Target</span>
            <div className="text-xl font-bold text-white font-mono">${(totalTarget / 1000).toFixed(0)}k NZD</div>
            <p className="text-[10px] text-slate-500">Across {leads.length} strategic sources</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-950 space-y-1">
            <span className="text-[11px] text-emerald-400 uppercase font-mono">Non-Dilutive Grants</span>
            <div className="text-xl font-bold text-emerald-300 font-mono">${(nonDilutiveTotal / 1000).toFixed(0)}k NZD</div>
            <p className="text-[10px] text-slate-500">Callaghan + MBIE + Subsidies</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-sky-950 space-y-1">
            <span className="text-[11px] text-sky-400 uppercase font-mono">Approved / Securing</span>
            <div className="text-xl font-bold text-sky-300 font-mono">${(approvedSecuring / 1000).toFixed(0)}k NZD</div>
            <p className="text-[10px] text-slate-500">Callaghan 40% R&D Rebate active</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-amber-950 space-y-1">
            <span className="text-[11px] text-amber-400 uppercase font-mono">Weighted Expectation</span>
            <div className="text-xl font-bold text-amber-300 font-mono">${(weightedPipeline / 1000).toFixed(0)}k NZD</div>
            <p className="text-[10px] text-slate-500">Probability-adjusted runway</p>
          </div>
        </div>
      </div>

      {/* Callaghan Innovation Spotlight */}
      <div className="bg-gradient-to-r from-sky-950/80 via-slate-900 to-slate-900 border border-sky-800/50 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sky-300 font-semibold text-sm">
            <Award className="w-4 h-4 text-sky-400" />
            <span>Callaghan Innovation R&D Partnered Grant (New Zealand Government)</span>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-sky-900/60 text-sky-200 border border-sky-700/50 rounded">
            40% CO-FUNDING REBATE
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          As an active NZ Sole Trader or Registered Entity, SaliBuoy Systems qualifies for Callaghan Innovation’s 40% R&D expense rebate on hardware prototyping (titanium hulls, ceramic brine pumps, satellite modems) and testing conducted in Auckland or ocean trial grounds.
        </p>
        <div className="flex items-center space-x-4 text-[11px] font-mono text-slate-400 pt-1">
          <span className="flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Eligible Expense: Hardware Fabrication</span>
          </span>
          <span className="flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Eligible Expense: Outset Lab Testing</span>
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {['All', 'Venture Capital', 'Government Grant', 'Research Subsidy'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-mono hidden sm:inline">
          Showing {filteredLeads.length} leads
        </span>
      </div>

      {/* Leads Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLeads.map((item) => (
          <div 
            key={item.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-lg transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`inline-block px-2 py-0.5 text-[10px] font-mono font-bold rounded uppercase mb-1.5 ${
                    item.category === 'Venture Capital' 
                      ? 'bg-purple-950 text-purple-300 border border-purple-800/60'
                      : item.category === 'Government Grant'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                      : 'bg-sky-950 text-sky-300 border border-sky-800/60'
                  }`}>
                    {item.category}
                  </span>
                  <h3 className="font-bold text-white text-base leading-snug">{item.organization}</h3>
                </div>
                <div className="text-right">
                  <div className="font-mono text-base font-extrabold text-emerald-400">
                    ${(item.targetAmountNZD / 1000).toFixed(0)}k
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">NZD Target</div>
                </div>
              </div>

              <p className="text-xs text-slate-300">{item.focusArea}</p>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Decision Target:</span>
                  <span className="text-slate-200">{item.expectedDecisionMonth}</span>
                </div>
                <div className="flex items-start space-x-1 text-[11px] text-slate-300">
                  <span className="font-semibold text-slate-400 shrink-0">Key Req:</span>
                  <span className="text-slate-300 leading-tight">{item.keyRequirement}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">Probability: {item.probabilityPercent}%</span>
                <div className="w-24 bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-emerald-400 h-full rounded-full transition-all"
                    style={{ width: `${item.probabilityPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Status Select */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                  <MapPin className="w-3 h-3 text-sky-400" />
                  <span>{item.nzRegion}</span>
                </div>

                <select
                  value={item.status}
                  onChange={(e) => handleStatusChange(item.id, e.target.value as FundingLead['status'])}
                  className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono rounded-lg px-2.5 py-1 focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="Targeted">Targeted</option>
                  <option value="In Application">In Application</option>
                  <option value="Due Diligence">Due Diligence</option>
                  <option value="Approved / Securing">Approved / Securing</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Add New Funding / Grant Lead</h3>
            
            <form onSubmit={handleAddLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-mono">Organization Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Icehouse Ventures Climate Fund"
                  value={newOrg}
                  onChange={(e) => setNewOrg(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-mono">Category</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="Government Grant">Government Grant</option>
                  <option value="Venture Capital">Venture Capital</option>
                  <option value="Research Subsidy">Research Subsidy</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-mono">Focus Area / Programme</label>
                <input
                  type="text"
                  placeholder="e.g. Early Stage Climate Tech"
                  value={newFocus}
                  onChange={(e) => setNewFocus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-mono">Target Amount (NZD $)</label>
                <input
                  type="number"
                  step={10000}
                  value={newAmount}
                  onChange={(e) => setNewAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-mono">Key Requirement</label>
                <input
                  type="text"
                  placeholder="e.g. Demonstration of Mark-II buoy in sea trial"
                  value={newReq}
                  onChange={(e) => setNewReq(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500 cursor-pointer"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
