import React, { useState } from 'react';
import { EcoComplianceCheck } from '../types';
import { 
  ShieldCheck, 
  Fish, 
  Volume2, 
  Droplets, 
  Scale, 
  Award, 
  FileCheck, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Leaf
} from 'lucide-react';
import { downloadFile } from '../utils/exportUtils';

const ECO_AUDIT_CHECKS: EcoComplianceCheck[] = [
  {
    id: 'eco-01',
    category: 'Acoustic Mammal Protection',
    parameterName: 'Subsea Turbine Acoustic Output (10Hz - 20kHz)',
    thresholdLimit: '< 120 dB re 1 µPa @ 1m (IMO/DOC Standard)',
    measuredSaliBuoyVal: '84.2 dB re 1 µPa @ 1m (Non-cavitating magnetic drive)',
    status: 'Compliant - Certified',
    governingBody: 'NZ Department of Conservation (DOC) & IMO',
    mitigationStrategy: 'Sub-harmonic ceramic damping ring prevents high-frequency clicks, protecting Hector dolphins and sperm whale echolocation.'
  },
  {
    id: 'eco-02',
    category: 'Zero Chemical Guarantee',
    parameterName: 'Synthetic Chemical & Additive Discharge',
    thresholdLimit: '0.00 ppm Synthetic Additives',
    measuredSaliBuoyVal: '0.00 ppm (100% Concentrated Pure Natural Seawater Brine)',
    status: 'Exceeds Standard',
    governingBody: 'NZ Environmental Protection Authority (EPA EEZ Act)',
    mitigationStrategy: 'No polymers, flocculants, or anti-scalants used. Membrane-less ceramic evaporation loop utilizes ambient thermal gradients.'
  },
  {
    id: 'eco-03',
    category: 'Localized Salinity Delta',
    parameterName: 'Max Surface & Mid-water Ambient Salinity Variance',
    thresholdLimit: 'ΔPSU < 1.5 PSU outside 25m mixing radius',
    measuredSaliBuoyVal: 'ΔPSU = 0.38 PSU @ 10m radius (High turbulent mixing)',
    status: 'Compliant - Certified',
    governingBody: 'NIWA (National Institute of Water and Atmospheric Research)',
    mitigationStrategy: 'Multi-nozzle diffuser array disperses brine downward into high-shear current streams, eliminating localized hypersaline pooling.'
  },
  {
    id: 'eco-04',
    category: 'EPA EEZ Permitting',
    parameterName: 'Exclusive Economic Zone Deployment Permit',
    thresholdLimit: 'EEZ Act 2012 Marine Consent Classification',
    measuredSaliBuoyVal: 'Permitted Activity (Non-polluting scientific research structure)',
    status: 'Compliant - Certified',
    governingBody: 'EPA New Zealand',
    mitigationStrategy: 'Fulfills Section 20 of EEZ Act as non-extractive climate intervention research structure with continuous GPS telemetry.'
  },
  {
    id: 'eco-05',
    category: 'Benthic Anchor Footprint',
    parameterName: 'Seabed Habitat Disturbance Area per Buoy',
    thresholdLimit: '< 5.0 m² Seabed Contact Area',
    measuredSaliBuoyVal: '1.2 m² (Compact high-density cast iron clump anchor)',
    status: 'Compliant - Certified',
    governingBody: 'Maritime New Zealand & DOC Marine Reserve Unit',
    mitigationStrategy: 'Acoustic release mooring allows 100% seabed anchor recovery upon mission completion with zero abandoned subsea plastic debris.'
  }
];

export const EcoImpactAudit: React.FC = () => {
  const [checks] = useState<EcoComplianceCheck[]>(ECO_AUDIT_CHECKS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredChecks = selectedCategory === 'All' 
    ? checks 
    : checks.filter(c => c.category === selectedCategory);

  const exportEcoAuditReport = () => {
    const reportText = `
SALIBUOY SYSTEMS - ENVIRONMENTAL & ECOLOGICAL SAFETY AUDIT REPORT
==================================================================
Date: 2026-09-07
Location: Outset Ventures Pukekohe / NIWA Subsea Testing Unit
Governing Bodies: NZ EPA, DOC, NIWA, IMO

ECOLOGICAL AUDIT SUMMARY:
-------------------------
${checks.map(c => `
- Category: ${c.category}
  Parameter: ${c.parameterName}
  Regulatory Limit: ${c.thresholdLimit}
  Measured SaliBuoy Value: ${c.measuredSaliBuoyVal}
  Status: ${c.status}
  Mitigation: ${c.mitigationStrategy}
`).join('\n')}

CERTIFICATION STATEMENT:
The SaliBuoy Mark-III wind-powered subsurface buoy operates with 0.00 ppm synthetic chemical discharge and stays well below subsea acoustic mammal protection thresholds (<85 dB re 1 µPa). Fully compliant with the NZ EEZ Act 2012.
`;
    downloadFile(reportText, 'SaliBuoy_Environmental_Safety_Audit.txt', 'text/plain');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 border border-slate-800 rounded-2xl p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>EPA EEZ Act • Marine Mammal Acoustic Safety • Zero Chemical Audit</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Environmental & Marine Safety Audit
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Comprehensive ecological safety matrix certifying zero synthetic chemical discharge, marine mammal acoustic frequency masking compliance, and EPA EEZ Act maritime permitting.
            </p>
          </div>

          <button
            onClick={exportEcoAuditReport}
            className="inline-flex items-center space-x-2 px-3.5 py-2 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/80 rounded-xl text-xs font-mono cursor-pointer transition-colors self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download Eco Audit PDF/TXT</span>
          </button>
        </div>
      </div>

      {/* High-Level Safety Guarantees */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="bg-slate-900 p-5 rounded-2xl border border-emerald-900/60 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Droplets className="w-5 h-5" />
            <h4 className="font-bold text-sm text-white">0.00 ppm Synthetic Chemicals</h4>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            100% natural concentrated seawater brine. Zero anti-scalants, zero polymers, and zero synthetic chemical additives released into the marine column.
          </p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-sky-900/60 space-y-2">
          <div className="flex items-center space-x-2 text-sky-400">
            <Volume2 className="w-5 h-5" />
            <h4 className="font-bold text-sm text-white">Subsea Mammal Shield (&lt;85 dB)</h4>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Operates at 84.2 dB re 1 µPa @ 1m—well below DOC/IMO 120 dB acoustic distress thresholds, ensuring zero echolocation interference for whales & dolphins.
          </p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-teal-900/60 space-y-2">
          <div className="flex items-center space-x-2 text-teal-400">
            <Scale className="w-5 h-5" />
            <h4 className="font-bold text-sm text-white">NZ EPA EEZ Act Permitted</h4>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Classified as a non-polluting oceanographic research structure with 100% recoverable seabed anchors via acoustic release shackles.
          </p>
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar font-mono text-xs">
        {['All', 'Acoustic Mammal Protection', 'Zero Chemical Guarantee', 'Localized Salinity Delta', 'EPA EEZ Permitting', 'Benthic Anchor Footprint'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === cat 
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700 font-bold' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Compliance Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4 p-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>NZ & International Marine Compliance Audit Table</span>
          </div>

          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
            5 / 5 Parameters Certified
          </span>
        </div>

        <div className="space-y-4">
          {filteredChecks.map((item) => (
            <div key={item.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-bold text-white text-sm">{item.parameterName}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-bold">
                    {item.status}
                  </span>
                  <span className="text-[10px] text-slate-400">Body: {item.governingBody}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] block uppercase">Regulatory Threshold Limit</span>
                  <span className="text-slate-300 font-bold">{item.thresholdLimit}</span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded border border-emerald-900/60 space-y-1">
                  <span className="text-emerald-400 text-[10px] block uppercase font-bold">SaliBuoy Tested Level</span>
                  <span className="text-emerald-300 font-bold">{item.measuredSaliBuoyVal}</span>
                </div>
              </div>

              <div className="text-slate-300 bg-slate-900/60 p-2.5 rounded border border-slate-800 text-[11px] leading-relaxed">
                <strong className="text-slate-400">Engineering Mitigation Strategy:</strong> {item.mitigationStrategy}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
