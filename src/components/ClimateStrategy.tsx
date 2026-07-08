import { Snowflake, Globe, Landmark, TrendingUp, Anchor, Target } from 'lucide-react';

export default function ClimateStrategy() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="bg-slate-950 border border-slate-600 p-6 rounded-lg shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-2 font-mono text-[10px] text-sky-400 uppercase tracking-widest mb-3">
          <Globe className="w-4 h-4 text-sky-400" />
          GLOBAL CLIMATE MANAGEMENT
        </div>
        <h3 className="font-display text-2xl font-bold text-slate-100 tracking-tight uppercase mb-3">
          Bipolar Array Expansion & Funding Matrix
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed font-sans max-w-3xl">
          Addressing the oceanic conveyor belt requires a holistic approach. Beyond the North Atlantic (AMOC), the Southern Ocean and Antarctic Bottom Water (AABW) formation play a critical role in global climate regulation. This strategy outlines the bipolar expansion and the comprehensive funding structure required for global climate management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* South Pole Integration */}
        <div className="bg-slate-900 border border-slate-700 p-5 rounded-lg shadow-xl">
          <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-3">
            <div className="p-2 bg-indigo-500/10 rounded">
              <Snowflake className="w-5 h-5 text-indigo-400" />
            </div>
            <h4 className="font-display text-sm font-bold text-slate-100 uppercase tracking-wider">
              Southern Ocean Integration
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            The Antarctic Bottom Water (AABW) is a massive driver of the global thermohaline circulation. Expanding the Sali-Buoy network to the Weddell and Ross Seas will enhance downwelling of cold, hypersaline water, stabilizing the southern pole.
          </p>
          <ul className="space-y-2 text-xs font-mono text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-0.5">›</span>
              Phase III: Antarctic Deployment (Weddell Sea)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-0.5">›</span>
              Ice-resistant Sali-Buoy hull modifications
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-0.5">›</span>
              AABW downwelling volume enhancement
            </li>
          </ul>
        </div>

        {/* Global Climate Management - Next Steps */}
        <div className="bg-slate-900 border border-slate-700 p-5 rounded-lg shadow-xl">
          <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-3">
            <div className="p-2 bg-emerald-500/10 rounded">
              <Target className="w-5 h-5 text-emerald-400" />
            </div>
            <h4 className="font-display text-sm font-bold text-slate-100 uppercase tracking-wider">
              Strategic Next Steps
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            To achieve holistic planetary cooling, the Sali-Buoy initiative must integrate with broader geo-management frameworks and secondary climate restoration technologies.
          </p>
          <ul className="space-y-2 text-xs font-mono text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">›</span>
              Global Albedo integration (Marine Cloud Brightening)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">›</span>
              Oceanic Carbon Dioxide Removal (mCDR) synergy
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">›</span>
              International treaty alignment (UNCLOS, Paris Agreement)
            </li>
          </ul>
        </div>
      </div>

      {/* Funding & Capital Strategy */}
      <div className="bg-slate-950 border border-slate-700 p-6 rounded-lg shadow-xl mt-6">
        <div className="flex items-center gap-2 font-mono text-[10px] text-amber-400 uppercase tracking-widest mb-4">
          <Landmark className="w-4 h-4 text-amber-400" />
          FINANCIAL ACQUISITION STRATEGY
        </div>
        <h4 className="font-display text-lg font-bold text-slate-100 uppercase tracking-wider mb-4 border-b border-slate-800 pb-3">
          Global Funding Pathways
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded">
            <h5 className="font-mono text-xs text-slate-100 font-bold mb-2">1. Sovereign Wealth & UN Funds</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Engaging the Green Climate Fund (GCF) and sovereign wealth funds (e.g., Norway, UAE) for primary infrastructure capitalization of the global array.
            </p>
            <div className="text-[10px] font-mono text-amber-400/80 uppercase">Target: $500M - $1B</div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 p-4 rounded">
            <h5 className="font-mono text-xs text-slate-100 font-bold mb-2">2. Philanthropic Capital</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Partnering with Bezos Earth Fund, Breakthrough Energy, and equivalent mega-philanthropies focused on high-risk, high-reward geo-stabilization.
            </p>
            <div className="text-[10px] font-mono text-amber-400/80 uppercase">Target: $100M - $250M</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded">
            <h5 className="font-mono text-xs text-slate-100 font-bold mb-2">3. Carbon & Climate Credits</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Monetizing cooling potential through next-generation climate impact credits. Trading verified oceanic temperature reduction metrics on global markets.
            </p>
            <div className="text-[10px] font-mono text-amber-400/80 uppercase">Recurring Revenue</div>
          </div>
        </div>
      </div>

      {/* Strategic Suggestions & Next Steps */}
      <div className="bg-slate-950 border border-sky-900/50 p-6 rounded-lg shadow-xl mt-6">
        <div className="flex items-center gap-2 font-mono text-[10px] text-sky-400 uppercase tracking-widest mb-4">
          <Anchor className="w-4 h-4 text-sky-400" />
          RECOMMENDATIONS & IMMEDIATE NEXT STEPS
        </div>
        
        <div className="space-y-4">
          <div className="flex gap-4 items-start border-b border-slate-800 pb-4">
            <div className="shrink-0 w-8 h-8 rounded bg-sky-500/10 flex items-center justify-center font-mono text-sky-400 font-bold">01</div>
            <div>
              <h5 className="font-display text-sm font-bold text-slate-200 mb-1">Global Regulatory Framework & Sandbox</h5>
              <p className="text-xs text-slate-400 leading-relaxed">Establish a UN-backed regulatory sandbox for oceanic geoengineering. Before mass deployment, international maritime law must provide a framework to legally protect and monitor the Sali-Buoy network.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start border-b border-slate-800 pb-4">
            <div className="shrink-0 w-8 h-8 rounded bg-sky-500/10 flex items-center justify-center font-mono text-sky-400 font-bold">02</div>
            <div>
              <h5 className="font-display text-sm font-bold text-slate-200 mb-1">Advanced AI & Quantum Modeling Integration</h5>
              <p className="text-xs text-slate-400 leading-relaxed">Integrate high-fidelity computational fluid dynamics (CFD) and quantum computing models to simulate the long-term compounding effects of artificial downwelling on the AMOC and AABW simultaneously.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start border-b border-slate-800 pb-4">
            <div className="shrink-0 w-8 h-8 rounded bg-sky-500/10 flex items-center justify-center font-mono text-sky-400 font-bold">03</div>
            <div>
              <h5 className="font-display text-sm font-bold text-slate-200 mb-1">Supply Chain Security & Mass Production</h5>
              <p className="text-xs text-slate-400 leading-relaxed">Secure rare earth materials, advanced polymers, and specialized titanium alloys required for mass manufacturing the buoys. Formulate strategic partnerships with heavy maritime industries for global distribution.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="shrink-0 w-8 h-8 rounded bg-sky-500/10 flex items-center justify-center font-mono text-sky-400 font-bold">04</div>
            <div>
              <h5 className="font-display text-sm font-bold text-slate-200 mb-1">Public Perception & Transparency Campaign</h5>
              <p className="text-xs text-slate-400 leading-relaxed">Launch an open-source data portal (expanding upon Fleet Command) to build public trust. Real-time ecological impact data, marine life disruption metrics, and temperature tracking must be accessible to independent scientific bodies.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
