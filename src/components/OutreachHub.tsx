import React, { useState } from 'react';
import { 
  Building2, 
  DollarSign, 
  Sparkles, 
  Award, 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Calculator,
  Send,
  Loader2,
  Building,
  Cloud,
  RefreshCw
} from 'lucide-react';
import { downloadFile } from '../utils/exportUtils';
import { microsoftGraphService } from '../services/microsoftGraphService';

export const OutreachHub: React.FC = () => {
  // Calculator state
  const [hardwareExp, setHardwareExp] = useState<number>(180000);
  const [labTestingExp, setLabTestingExp] = useState<number>(65000);
  const [vesselCharterExp, setVesselCharterExp] = useState<number>(85000);
  const [engineeringExp, setEngineeringExp] = useState<number>(120000);

  const totalEligibleExp = hardwareExp + labTestingExp + vesselCharterExp + engineeringExp;
  const callaghan40PctRebate = Math.round(totalEligibleExp * 0.40);

  // AI Generator state
  const [proposalType, setProposalType] = useState('Callaghan Innovation R&D Grant');
  const [targetAudience, setTargetAudience] = useState('Callaghan Innovation & Outset Ventures Pukekohe');
  const [projectFocus, setProjectFocus] = useState('SaliBuoy Mark-III Subsurface Salinity Injector');
  const [budgetNZD, setBudgetNZD] = useState<number>(450000);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<string>('');
  const [copiedDoc, setCopiedDoc] = useState(false);

  const handleGenerateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedDoc('');

    try {
      const response = await fetch('/api/generate-grant-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalType,
          targetAudience,
          projectFocus,
          budgetNZD,
          keyMilestones: 'Mark-III 500m depth rating, 30-day Hauraki Gulf sea trial, zero-chemical natural brine diffusion'
        })
      });

      const data = await response.json();
      if (data.proposalText) {
        setGeneratedDoc(data.proposalText);
      } else {
        setGeneratedDoc('Error generating document. Please try again.');
      }
    } catch (err) {
      console.error('Failed to generate:', err);
      setGeneratedDoc('Failed to connect to proposal engine.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyDoc = () => {
    navigator.clipboard.writeText(generatedDoc);
    setCopiedDoc(true);
    setTimeout(() => setCopiedDoc(false), 2500);
  };

  const [isUploadingOneDrive, setIsUploadingOneDrive] = useState(false);
  const [oneDriveStatus, setOneDriveStatus] = useState<string | null>(null);

  const exportProposalToOneDrive = async () => {
    if (!generatedDoc) return;
    setIsUploadingOneDrive(true);
    setOneDriveStatus('Uploading Proposal to OneDrive (Grant_Proposals)...');
    try {
      if (!microsoftGraphService.isAuthenticated()) {
        await microsoftGraphService.login();
      }

      const fileName = `${proposalType.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
      await microsoftGraphService.uploadFile(
        fileName,
        generatedDoc,
        'text/plain',
        'Grant_Proposals'
      );

      setOneDriveStatus(`Successfully saved ${fileName} to OneDrive folder 'Grant_Proposals'!`);
    } catch (err: any) {
      console.error('OneDrive proposal upload error:', err);
      setOneDriveStatus('Failed to upload proposal to OneDrive.');
    } finally {
      setIsUploadingOneDrive(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950 border border-slate-800 rounded-2xl p-6 space-y-3">
        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
          <Award className="w-4 h-4" />
          <span>New Zealand Incubator & Grant Acceleration</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Funding & Incubator Outreach Hub
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Application tools for Outset Ventures (Pukekohe, Auckland), Callaghan Innovation 40% R&D rebate calculator, and AI-powered grant proposal generator.
        </p>
      </div>

      {/* Callaghan Innovation 40% Rebate Calculator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-sky-400">
              <Calculator className="w-4 h-4" />
              <span>New Zealand Government R&D Co-Funding</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">Callaghan Innovation 40% R&D Rebate Estimator</h3>
          </div>
          <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-xs font-bold rounded-lg">
            40% NON-DILUTIVE REBATE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-mono mb-1">Hardware Prototyping (Titanium, Pumps, Electronics) ($)</label>
              <input
                type="number"
                step={5000}
                value={hardwareExp}
                onChange={(e) => setHardwareExp(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-mono mb-1">Outset Wet-Lab & Pressure Tank Testing ($)</label>
              <input
                type="number"
                step={5000}
                value={labTestingExp}
                onChange={(e) => setLabTestingExp(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-mono mb-1">Offshore Vessel Charter & Hauraki Gulf Trials ($)</label>
              <input
                type="number"
                step={5000}
                value={vesselCharterExp}
                onChange={(e) => setVesselCharterExp(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-mono mb-1">Physical Science & Engineering Labor ($)</label>
              <input
                type="number"
                step={5000}
                value={engineeringExp}
                onChange={(e) => setEngineeringExp(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase text-slate-400">Calculation Summary</span>
              
              <div className="flex justify-between items-center text-xs text-slate-300 font-mono border-b border-slate-800/80 pb-2">
                <span>Total Eligible NZ R&D Expenditure:</span>
                <span className="text-white font-bold">${totalEligibleExp.toLocaleString()} NZD</span>
              </div>

              <div className="flex justify-between items-center text-sm font-mono text-emerald-400 pt-1">
                <span className="font-bold">Estimated 40% Callaghan Rebate:</span>
                <span className="text-2xl font-extrabold text-emerald-300">${callaghan40PctRebate.toLocaleString()} NZD</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800">
              💡 <strong>Audit Tip:</strong> Maintain itemized invoices under your Sole Trader IRD BIC code M691010 and link Outset Lab timesheets to streamline Callaghan Innovation audit claims.
            </p>
          </div>
        </div>
      </div>

      {/* AI DeepTech Grant & Proposal Generator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center space-x-2 text-xs font-mono text-purple-400">
          <Sparkles className="w-4 h-4" />
          <span>AI DeepTech Proposal Engine (Gemini Server-Side)</span>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white">Generate Custom Grant & Investment Proposals</h3>
          <p className="text-xs text-slate-400 mt-1">
            Produce formal, audit-ready proposal documents formatted for Callaghan Innovation, Outset Ventures, or VC investment committees.
          </p>
        </div>

        <form onSubmit={handleGenerateProposal} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-mono mb-1">Proposal Type</label>
            <select
              value={proposalType}
              onChange={(e) => setProposalType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500 cursor-pointer font-mono"
            >
              <option value="Callaghan Innovation R&D Grant">Callaghan Innovation R&D Grant</option>
              <option value="Outset Ventures Incubator Application">Outset Ventures Incubator Application</option>
              <option value="Pacific Channel VC Investment Memo">Pacific Channel VC Investment Memo</option>
              <option value="MBIE Endeavour Smart Ideas Proposal">MBIE Endeavour Smart Ideas Proposal</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-mono mb-1">Target Recipient</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-mono mb-1">Hardware Focus</label>
            <input
              type="text"
              value={projectFocus}
              onChange={(e) => setProjectFocus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-mono mb-1">Budget Target ($ NZD)</label>
            <input
              type="number"
              value={budgetNZD}
              onChange={(e) => setBudgetNZD(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-4 pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-sky-600 hover:from-purple-500 hover:to-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-950/50 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isGenerating ? 'Generating Proposal with Gemini AI...' : 'Generate Grant Proposal Document'}</span>
            </button>
          </div>
        </form>

        {/* Generated Output Display */}
        {generatedDoc && (
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 font-bold flex items-center space-x-1.5">
                <Check className="w-4 h-4" />
                <span>Generated Proposal Document</span>
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={exportProposalToOneDrive}
                  disabled={isUploadingOneDrive}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 bg-sky-950 hover:bg-sky-900 border border-sky-800 text-sky-200 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  {isUploadingOneDrive ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
                  ) : (
                    <Cloud className="w-3.5 h-3.5 text-sky-400" />
                  )}
                  <span>OneDrive Proposal (Grant_Proposals)</span>
                </button>

                <button
                  onClick={copyDoc}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition-colors cursor-pointer"
                >
                  {copiedDoc ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDoc ? 'Copied!' : 'Copy Document'}</span>
                </button>

                <button
                  onClick={() => downloadFile(generatedDoc, `${proposalType.replace(/\s+/g, '_')}_SaliBuoy.txt`, 'text/plain')}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 bg-purple-950 hover:bg-purple-900 border border-purple-800 text-purple-200 rounded-lg text-xs font-mono transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Text</span>
                </button>
              </div>
            </div>

            {oneDriveStatus && (
              <div className="p-3 bg-slate-950 border border-sky-800/80 rounded-xl flex items-center justify-between font-mono text-xs text-sky-300">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{oneDriveStatus}</span>
                </div>
                <a
                  href="https://onedrive.live.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 underline font-bold text-[11px]"
                >
                  Open OneDrive (salibuoy.systems@outlook.com) ↗
                </a>
              </div>
            )}

            <pre className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[450px] overflow-y-auto">
              {generatedDoc}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
