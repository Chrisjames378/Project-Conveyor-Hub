import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Check, 
  RefreshCw, 
  Sparkles, 
  ExternalLink, 
  FileText, 
  Download, 
  ShieldCheck, 
  FolderCheck,
  AlertCircle
} from 'lucide-react';
import { microsoftGraphService } from '../services/microsoftGraphService';

export const AmocSummaryOneDriveToggle: React.FC = () => {
  // Toggle State (restored from localStorage)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(() => {
    return localStorage.getItem('salibuoy_onedrive_autosave') === 'true';
  });

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentSummary, setCurrentSummary] = useState<string | null>(null);
  const [lastSavedUrl, setLastSavedUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSavingManual, setIsSavingManual] = useState<boolean>(false);

  const targetAccount = 'salibuoy.systems@outlook.com';
  const targetFolder = 'Project-Conveyor-Reports';

  // Toggle switch change handler
  const handleToggleAutoSave = async () => {
    const nextState = !autoSaveEnabled;
    setAutoSaveEnabled(nextState);
    localStorage.setItem('salibuoy_onedrive_autosave', String(nextState));

    if (nextState) {
      // Ensure user is authenticated or trigger login
      if (!microsoftGraphService.isAuthenticated()) {
        try {
          setStatusMessage('Authenticating salibuoy.systems@outlook.com with Microsoft Graph...');
          await microsoftGraphService.login();
          setStatusMessage(`OneDrive Auto-Save ACTIVE for '${targetFolder}' folder.`);
        } catch (e: any) {
          setStatusMessage('Login required to activate OneDrive auto-save.');
        }
      } else {
        setStatusMessage(`OneDrive Auto-Save ACTIVE for '${targetFolder}' folder.`);
      }
    } else {
      setStatusMessage('OneDrive Auto-Save disabled.');
    }
  };

  // Function to generate today's AI AMOC Summary and trigger auto-save if enabled
  const generateAmocSummary = async () => {
    setIsGenerating(true);
    setStatusMessage('Generating AI AMOC Stabilization Summary via Gemini...');
    setLastSavedUrl(null);

    try {
      const todayDate = new Date().toISOString().split('T')[0];

      // Request API backend
      const response = await fetch('/api/generate-amoc-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: todayDate,
          transportFlowSv: 15.2,
          salinityPsu: 45.0,
          downwellingRateIndex: 1.42
        })
      });

      const data = await response.json();
      const summaryText = data.summaryText || 'AMOC Daily Summary generated.';
      setCurrentSummary(summaryText);

      // Check if OneDrive Auto-Save Toggle is enabled
      if (autoSaveEnabled) {
        setStatusMessage(`Auto-saving to OneDrive folder '${targetFolder}'...`);

        // Check auth session
        if (!microsoftGraphService.isAuthenticated()) {
          const user = await microsoftGraphService.login();
        }

        const fileName = `AMOC_Daily_Summary_${todayDate}.txt`;
        const uploadedFile = await microsoftGraphService.uploadFile(
          fileName,
          summaryText,
          'text/plain',
          targetFolder
        );

        setLastSavedUrl(uploadedFile.webUrl || 'https://onedrive.live.com');
        setStatusMessage(`[OneDrive Auto-Saved] Saved to ${targetFolder}/${fileName}`);
      } else {
        setStatusMessage('Summary generated successfully. (OneDrive Auto-Save is OFF)');
      }

    } catch (err: any) {
      console.error('Error generating/saving summary:', err);
      setStatusMessage(err?.message || 'Failed to generate or auto-save summary.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Manual save trigger button
  const manualSaveToOneDrive = async () => {
    if (!currentSummary) return;
    setIsSavingManual(true);
    setStatusMessage(`Uploading summary to OneDrive folder '${targetFolder}'...`);

    try {
      const todayDate = new Date().toISOString().split('T')[0];
      const fileName = `AMOC_Daily_Summary_${todayDate}.txt`;

      if (!microsoftGraphService.isAuthenticated()) {
        await microsoftGraphService.login();
      }

      const uploadedFile = await microsoftGraphService.uploadFile(
        fileName,
        currentSummary,
        'text/plain',
        targetFolder
      );

      setLastSavedUrl(uploadedFile.webUrl || 'https://onedrive.live.com');
      setStatusMessage(`[OneDrive Saved] Pushed to ${targetFolder}/${fileName}`);
    } catch (err: any) {
      console.error('Manual save error:', err);
      setStatusMessage('Failed to save to OneDrive.');
    } finally {
      setIsSavingManual(false);
    }
  };

  // Download locally as fallback
  const downloadSummaryTxt = () => {
    if (!currentSummary) return;
    const todayDate = new Date().toISOString().split('T')[0];
    const blob = new Blob([currentSummary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AMOC_Daily_Summary_${todayDate}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900/90 border border-sky-800/80 rounded-2xl p-5 md:p-6 space-y-5 font-mono text-xs shadow-xl">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Cloud className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              OneDrive AMOC Reports Auto-Archiver
            </h3>
            <span className="text-[10px] bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800 font-semibold">
              {targetAccount}
            </span>
          </div>
          <p className="text-slate-400 text-xs">
            Automatically store daily AI oceanographic AMOC stabilization briefings in OneDrive folder{' '}
            <code className="text-sky-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 font-bold">
              {targetFolder}
            </code>
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center space-x-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800 self-start md:self-auto">
          <div className="text-right">
            <span className="text-[11px] font-bold text-white block">
              OneDrive Auto-Save
            </span>
            <span className={`text-[9px] font-semibold ${autoSaveEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>
              {autoSaveEnabled ? `ACTIVE (${targetFolder})` : 'DISABLED'}
            </span>
          </div>

          <button
            onClick={handleToggleAutoSave}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              autoSaveEnabled ? 'bg-sky-500' : 'bg-slate-800'
            }`}
            role="switch"
            aria-checked={autoSaveEnabled}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                autoSaveEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Status Bar */}
      {statusMessage && (
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-sky-300">
            <FolderCheck className="w-4 h-4 text-sky-400 flex-shrink-0" />
            <span className="font-semibold truncate">{statusMessage}</span>
          </div>

          {lastSavedUrl && (
            <a
              href={lastSavedUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-bold underline text-xs flex-shrink-0 ml-2"
            >
              <span>Open in OneDrive ↗</span>
            </a>
          )}
        </div>
      )}

      {/* Action Controls & AI Summary Generator */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <button
          onClick={generateAmocSummary}
          disabled={isGenerating}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-sky-500 via-blue-600 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-950/60 transition-all cursor-pointer"
        >
          {isGenerating ? (
            <RefreshCw className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Sparkles className="w-4 h-4 text-sky-200" />
          )}
          <span>{isGenerating ? 'Generating Summary...' : "Generate Today's AI AMOC Summary"}</span>
        </button>

        {currentSummary && (
          <div className="flex items-center space-x-2">
            {!autoSaveEnabled && (
              <button
                onClick={manualSaveToOneDrive}
                disabled={isSavingManual}
                className="inline-flex items-center space-x-1.5 px-3 py-2 bg-sky-950 hover:bg-sky-900 text-sky-200 border border-sky-800 rounded-xl font-bold cursor-pointer transition-colors"
              >
                {isSavingManual ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-300" />
                ) : (
                  <Cloud className="w-3.5 h-3.5 text-sky-400" />
                )}
                <span>Save to OneDrive ({targetFolder})</span>
              </button>
            )}

            <button
              onClick={downloadSummaryTxt}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Download .TXT</span>
            </button>
          </div>
        )}
      </div>

      {/* Expandable Report Container */}
      {currentSummary && (
        <div className="space-y-2 pt-2 animate-fade-in">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <span className="font-bold text-white">Daily AMOC Stabilization Briefing</span>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 font-mono">
              TARGET: {targetFolder}
            </span>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs font-mono leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
            {currentSummary}
          </div>
        </div>
      )}
    </div>
  );
};
