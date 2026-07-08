import { Scale, Cpu, Box, Eye, Network } from 'lucide-react';

export default function DeploymentLogistics() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="bg-slate-950 border border-slate-600 p-6 rounded-lg shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-2 font-mono text-[10px] text-amber-400 uppercase tracking-widest mb-3">
          <Network className="w-4 h-4 text-amber-400" />
          MASTER OPERATIONS
        </div>
        <h3 className="font-display text-2xl font-bold text-slate-100 tracking-tight uppercase mb-3">
          Execution & Scaling Logistics
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed font-sans max-w-3xl">
          Moving from prototype to a planetary-scale mesh network requires unprecedented coordination across four major pillars: Legal Frameworks, Supply Chain Manufacturing, Advanced Computational Modeling, and Public Data Transparency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Regulatory */}
        <div className="bg-slate-900 border border-slate-700 p-5 rounded-lg shadow-xl relative group">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/10 rounded">
              <Scale className="w-5 h-5 text-indigo-400" />
            </div>
            <h4 className="font-display text-sm font-bold text-slate-100 uppercase tracking-wider">
              1. Regulatory Sandbox
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Establish a UN-backed regulatory sandbox for oceanic geoengineering. Before mass deployment, international maritime law (UNCLOS) must provide a framework to legally protect and monitor the Sali-Buoy network in international waters.
          </p>
          <div className="space-y-2 font-mono text-[10px] text-slate-400 bg-slate-950 p-3 rounded">
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span>UNCLOS Amendment</span>
              <span className="text-indigo-400">In Progress</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span>EEZ Approvals (Greenland/UK)</span>
              <span className="text-emerald-400">Secured</span>
            </div>
            <div className="flex justify-between">
              <span>Maritime Liability Insurance</span>
              <span className="text-amber-400">Negotiating</span>
            </div>
          </div>
        </div>

        {/* AI & Computing */}
        <div className="bg-slate-900 border border-slate-700 p-5 rounded-lg shadow-xl relative group">
          <div className="absolute top-0 left-0 w-1 h-full bg-sky-500" />
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-sky-500/10 rounded">
              <Cpu className="w-5 h-5 text-sky-400" />
            </div>
            <h4 className="font-display text-sm font-bold text-slate-100 uppercase tracking-wider">
              2. Quantum Modeling
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Integrate high-fidelity computational fluid dynamics (CFD) and quantum computing models to simulate the long-term compounding effects of artificial downwelling on the AMOC and AABW simultaneously.
          </p>
          <div className="space-y-2 font-mono text-[10px] text-slate-400 bg-slate-950 p-3 rounded">
             <div className="flex justify-between border-b border-slate-800 pb-1">
              <span>Global CFD Simulation</span>
              <span className="text-emerald-400">Active</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span>Quantum Node Synchronization</span>
              <span className="text-emerald-400">Active</span>
            </div>
            <div className="flex justify-between">
              <span>Deep Learning Vortex Pred.</span>
              <span className="text-sky-400">94.2% Acc.</span>
            </div>
          </div>
        </div>

        {/* Supply Chain */}
        <div className="bg-slate-900 border border-slate-700 p-5 rounded-lg shadow-xl relative group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded">
              <Box className="w-5 h-5 text-emerald-400" />
            </div>
            <h4 className="font-display text-sm font-bold text-slate-100 uppercase tracking-wider">
              3. Mass Production
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Secure rare earth materials, advanced polymers, and specialized titanium alloys required for mass manufacturing the buoys. Formulate strategic partnerships with heavy maritime industries for global distribution.
          </p>
          <div className="space-y-2 font-mono text-[10px] text-slate-400 bg-slate-950 p-3 rounded">
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span>Titanium-Grade Procurement</span>
              <span className="text-emerald-400">Contracts Signed</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span>HDPE Polymer Supply</span>
              <span className="text-emerald-400">10kt Secured</span>
            </div>
            <div className="flex justify-between">
              <span>Dry Dock Assembly (Norway)</span>
              <span className="text-emerald-400">Operational</span>
            </div>
          </div>
        </div>

        {/* Transparency */}
        <div className="bg-slate-900 border border-slate-700 p-5 rounded-lg shadow-xl relative group">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-rose-500/10 rounded">
              <Eye className="w-5 h-5 text-rose-400" />
            </div>
            <h4 className="font-display text-sm font-bold text-slate-100 uppercase tracking-wider">
              4. Public Transparency
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Launch an open-source data portal to build public trust. Real-time ecological impact data, marine life disruption metrics, and temperature tracking must be accessible to independent scientific bodies globally.
          </p>
          <div className="space-y-2 font-mono text-[10px] text-slate-400 bg-slate-950 p-3 rounded">
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span>Open Data API v1.0</span>
              <span className="text-emerald-400">Online</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span>Marine Biology Acoustic Log</span>
              <span className="text-amber-400">Beta</span>
            </div>
            <div className="flex justify-between">
              <span>Global Audit (NGO access)</span>
              <span className="text-emerald-400">Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
