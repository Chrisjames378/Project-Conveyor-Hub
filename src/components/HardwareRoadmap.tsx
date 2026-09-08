import React, { useState } from 'react';
import { HardwareMilestone } from '../types';
import { INITIAL_HARDWARE_MILESTONES } from '../db/localDatabase';
import { 
  Cpu, 
  CheckCircle2, 
  Clock, 
  Gauge, 
  Zap, 
  ShieldCheck, 
  Sliders, 
  Anchor, 
  ChevronRight,
  Layers
} from 'lucide-react';

export const HardwareRoadmap: React.FC = () => {
  const [milestones, setMilestones] = useState<HardwareMilestone[]>(() => {
    const saved = localStorage.getItem('salibuoy_hardware_milestones');
    return saved ? JSON.parse(saved) : INITIAL_HARDWARE_MILESTONES;
  });

  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('hw-2');

  // Simulation state
  const [testSalinityPsu, setTestSalinityPsu] = useState<number>(42);
  const [testDepth, setTestDepth] = useState<number>(200);

  const selectedMilestone = milestones.find(m => m.id === selectedMilestoneId) || milestones[1];

  // Calculated density index based on temperature (assume 10C) and salinity (PSU)
  const seawaterDensityKgM3 = (1025 + (testSalinityPsu * 0.8) + (testDepth * 0.004)).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-mono text-sky-400">
          <Cpu className="w-4 h-4" />
          <span>Deep-Sea Engineering & Hydrodynamics</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">AMOC Hardware Development Roadmap</h2>
        <p className="text-xs text-slate-400 max-w-3xl">
          Progressive iteration of autonomous oceanic buoys designed to withstand hyper-pressurized subsea conditions, harvest wind kinetic energy via wind turbines, and inject high-density brine to restore Atlantic Meridional Overturning Circulation.
        </p>
      </div>

      {/* Hardware Timeline Progression Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {milestones.map((m) => {
          const isSelected = m.id === selectedMilestoneId;
          return (
            <div
              key={m.id}
              onClick={() => setSelectedMilestoneId(m.id)}
              className={`bg-slate-900/90 border rounded-xl p-5 space-y-3 cursor-pointer transition-all duration-200 relative ${
                isSelected
                  ? 'border-sky-500 bg-sky-950/20 shadow-lg shadow-sky-950/50'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                  {m.phase}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  m.status === 'Completed'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                    : m.status === 'In Development'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800/60'
                    : m.status === 'Testing'
                    ? 'bg-sky-950 text-sky-400 border border-sky-800/60'
                    : 'bg-slate-950 text-slate-500 border border-slate-800'
                }`}>
                  {m.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-base leading-tight">{m.codename}</h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{m.targetDate}</p>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Progress</span>
                  <span className="text-sky-300 font-bold">{m.progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-teal-400 h-full rounded-full"
                    style={{ width: `${m.progressPercent}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div>
                  <span className="text-slate-500 block">Depth Rating</span>
                  <span className="text-slate-200 font-bold">{m.depthRatingMeters}m</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Salinity PSU</span>
                  <span className="text-teal-300 font-bold">{m.salinityOutputPsu} PSU</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Hardware Deep Dive & Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Specs Column */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-sky-400">{selectedMilestone.phase} Specification</span>
              <h3 className="text-xl font-bold text-white mt-0.5">{selectedMilestone.codename}</h3>
            </div>
            <div className="text-right font-mono text-xs">
              <span className="text-slate-400 block">Target Deployment</span>
              <span className="text-emerald-400 font-bold">{selectedMilestone.targetDate}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">Primary Objective</h4>
            <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
              {selectedMilestone.keyObjective}
            </p>
          </div>

          {/* Key Hardware Specs List */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">Engineering Subsystems</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedMilestone.specifications.map((spec, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Parameters */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-1">
              <Gauge className="w-4 h-4 text-sky-400 mx-auto" />
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Subsea Rating</span>
              <span className="text-sm font-bold text-white font-mono">{selectedMilestone.depthRatingMeters} Meters</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-1">
              <Zap className="w-4 h-4 text-amber-400 mx-auto" />
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Power Harvesting</span>
              <span className="text-xs font-bold text-amber-300 font-mono leading-tight block">{selectedMilestone.powerSource}</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-1">
              <Anchor className="w-4 h-4 text-teal-400 mx-auto" />
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Brine Target</span>
              <span className="text-sm font-bold text-teal-300 font-mono">{selectedMilestone.salinityOutputPsu} PSU</span>
            </div>
          </div>
        </div>

        {/* Interactive Physics & Salinity Diffusion Sandbox */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
              <Sliders className="w-4 h-4" />
              <span>Downwelling Physics Sandbox</span>
            </div>
            <h3 className="font-bold text-white text-base">Brine Density Simulator</h3>
            <p className="text-xs text-slate-400">
              Test how increasing salinity PSU and target depth forces seawater density above ambient levels (1025 kg/m³) to induce localized AMOC sinking.
            </p>
          </div>

          <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
            {/* Salinity Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">Brine Salinity (PSU):</span>
                <span className="text-teal-300 font-bold">{testSalinityPsu} PSU</span>
              </div>
              <input
                type="range"
                min="35"
                max="50"
                step="0.5"
                value={testSalinityPsu}
                onChange={(e) => setTestSalinityPsu(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
            </div>

            {/* Depth Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">Injection Depth (m):</span>
                <span className="text-sky-300 font-bold">{testDepth}m</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={testDepth}
                onChange={(e) => setTestDepth(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>

            {/* Calculated Output */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between font-mono">
                <span className="text-slate-400">Calculated Seawater Density:</span>
                <span className="text-emerald-400 font-bold text-sm">{seawaterDensityKgM3} kg/m³</span>
              </div>
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-900/50 rounded-lg text-[11px] text-emerald-200">
                {Number(seawaterDensityKgM3) > 1050 
                  ? '⚡ High Convective Trigger: Rapid downwelling plume induced! Sinking velocity > 4.5 cm/s.'
                  : 'Sufficient density delta to trigger steady subsurface downwelling plume.'}
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono text-center">
            Validating hydrodynamic equations against NOAA & NIWA ocean data.
          </div>
        </div>
      </div>
    </div>
  );
};
