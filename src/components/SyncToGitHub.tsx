import React, { useState, useEffect } from 'react';
import { 
  Github, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Code, 
  Eye, 
  EyeOff, 
  FolderGit2, 
  ChevronDown, 
  ChevronUp,
  FileCode,
  ShieldAlert
} from 'lucide-react';

interface FileSummary {
  relativePath: string;
  sizeBytes: number;
}

export const SyncToGitHub: React.FC = () => {
  const [githubToken, setGithubToken] = useState<string>('');
  const [showToken, setShowToken] = useState<boolean>(false);
  const [rememberToken, setRememberToken] = useState<boolean>(true);
  const [repoOwner, setRepoOwner] = useState<string>('');
  const [repoName, setRepoName] = useState<string>('salibuoy-systems-conveyor');
  const [branch, setBranch] = useState<string>('main');
  const [commitMessage, setCommitMessage] = useState<string>('Sync SaliBuoy Systems Project Conveyor source code');
  const [createIfNotExists, setCreateIfNotExists] = useState<boolean>(true);

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState<{
    repoUrl: string;
    commitSha: string;
    fileCount: number;
    timestamp: string;
  } | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const [fileList, setFileList] = useState<FileSummary[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState<boolean>(false);
  const [showFileList, setShowFileList] = useState<boolean>(false);

  // Load saved token & repo settings from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('salibuoy_github_pat');
    if (savedToken) {
      setGithubToken(savedToken);
    }
    const savedOwner = localStorage.getItem('salibuoy_github_owner');
    if (savedOwner) {
      setRepoOwner(savedOwner);
    }
    const savedRepo = localStorage.getItem('salibuoy_github_repo');
    if (savedRepo) {
      setRepoName(savedRepo);
    }
  }, []);

  // Fetch list of files from server
  const fetchManifest = async () => {
    setIsLoadingFiles(true);
    try {
      const res = await fetch('/api/github/file-list');
      if (res.ok) {
        const data = await res.json();
        if (data.files) {
          setFileList(data.files);
        }
      }
    } catch (err) {
      console.error('Error loading file manifest:', err);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleToggleFileList = () => {
    if (!showFileList && fileList.length === 0) {
      fetchManifest();
    }
    setShowFileList(!showFileList);
  };

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    setSyncError(null);
    setSyncSuccess(null);

    if (!githubToken.trim()) {
      setSyncError('Please enter a GitHub Personal Access Token (PAT).');
      return;
    }

    if (!repoOwner.trim() || !repoName.trim()) {
      setSyncError('Please specify both GitHub Repo Owner and Repository Name.');
      return;
    }

    // Save token if requested
    if (rememberToken) {
      localStorage.setItem('salibuoy_github_pat', githubToken.trim());
      localStorage.setItem('salibuoy_github_owner', repoOwner.trim());
      localStorage.setItem('salibuoy_github_repo', repoName.trim());
    } else {
      localStorage.removeItem('salibuoy_github_pat');
    }

    setIsSyncing(true);
    setSyncStatus('Connecting to GitHub API with Octokit...');

    try {
      const res = await fetch('/api/github/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: githubToken.trim(),
          owner: repoOwner.trim(),
          repo: repoName.trim(),
          branch: branch.trim() || 'main',
          commitMessage: commitMessage.trim() || 'Sync source code via SaliBuoy Systems Octokit Engine',
          createIfNotExists,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.details || data.error || 'Failed to sync repository with GitHub.');
      }

      setSyncSuccess({
        repoUrl: data.repoUrl,
        commitSha: data.commitSha,
        fileCount: data.fileCount,
        timestamp: new Date().toLocaleTimeString('en-NZ', { timeZone: 'Pacific/Auckland' }),
      });
      setSyncStatus(null);
    } catch (err: any) {
      console.error('GitHub Sync Error:', err);
      setSyncError(err?.message || 'Failed to sync codebase to GitHub.');
      setSyncStatus(null);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-7 space-y-6 shadow-xl relative overflow-hidden">
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-sky-500/5 rounded-full blur-2xl pointer-events-none"></div>

      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-slate-950 border border-sky-800/60 rounded-xl text-sky-400">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-white text-lg">GitHub Version Control & Code Sync</h3>
              <span className="px-2 py-0.5 rounded-full bg-sky-950 border border-sky-800 text-[10px] font-mono text-sky-300 font-semibold">
                Octokit SDK
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Automatically commit and push SaliBuoy Systems source code directly to your GitHub repository.
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleFileList}
          type="button"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-mono transition-colors cursor-pointer"
        >
          <FileCode className="w-3.5 h-3.5 text-sky-400" />
          <span>{showFileList ? 'Hide File Manifest' : 'View Code Manifest'}</span>
          {showFileList ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* File Manifest Drawer */}
      {showFileList && (
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 animate-fade-in">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="font-bold text-sky-300">Workspace Code Manifest ({fileList.length} files)</span>
            {isLoadingFiles && <span className="text-sky-400 animate-pulse">Scanning workspace...</span>}
          </div>
          <div className="max-h-48 overflow-y-auto font-mono text-[11px] text-slate-300 space-y-1 divide-y divide-slate-900 pr-2">
            {fileList.map((file, idx) => (
              <div key={idx} className="pt-1 flex items-center justify-between">
                <span className="text-slate-200">{file.relativePath}</span>
                <span className="text-slate-500 text-[10px]">{(file.sizeBytes / 1024).toFixed(1)} KB</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sync Form */}
      <form onSubmit={handleSync} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* GitHub Personal Access Token */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-mono font-medium text-slate-300">
              GitHub Personal Access Token (PAT) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 font-mono focus:outline-none focus:ring-1 focus:ring-sky-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center justify-between pt-1">
              <p className="text-[11px] text-slate-400">
                Requires a classic token with <code className="text-sky-300 bg-slate-950 px-1 py-0.5 rounded border border-slate-800">repo</code> scope or fine-grained token with Contents write access.
              </p>
              <label className="inline-flex items-center space-x-1.5 cursor-pointer text-[11px] font-mono text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberToken}
                  onChange={(e) => setRememberToken(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-sky-500 focus:ring-sky-500"
                />
                <span>Save token locally</span>
              </label>
            </div>
          </div>

          {/* Repo Owner */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-slate-300">
              GitHub Owner / Username <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={repoOwner}
              onChange={(e) => setRepoOwner(e.target.value)}
              placeholder="e.g. chris-james378 or organization"
              className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
              required
            />
          </div>

          {/* Repo Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-slate-300">
              Repository Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              placeholder="salibuoy-systems-conveyor"
              className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
              required
            />
          </div>

          {/* Target Branch */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-slate-300">Target Branch</label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="main"
              className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* Commit Message */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-slate-300">Commit Message</label>
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Sync SaliBuoy Systems Project Conveyor source code"
              className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
          <label className="inline-flex items-center space-x-2 cursor-pointer text-xs font-mono text-slate-300">
            <input
              type="checkbox"
              checked={createIfNotExists}
              onChange={(e) => setCreateIfNotExists(e.target.checked)}
              className="rounded border-slate-800 bg-slate-950 text-sky-500 focus:ring-sky-500"
            />
            <span>Create repository automatically if it does not exist</span>
          </label>
        </div>

        {/* Submit Sync Button */}
        <div className="pt-2 flex items-center space-x-3">
          <button
            type="submit"
            disabled={isSyncing}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 via-blue-600 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-white font-bold text-xs font-mono rounded-xl shadow-lg shadow-sky-950/80 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Syncing via Octokit...</span>
              </>
            ) : (
              <>
                <FolderGit2 className="w-4 h-4 text-white" />
                <span>Sync Codebase to GitHub Now</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Progress Status Banner */}
      {syncStatus && (
        <div className="p-3.5 bg-slate-950 border border-sky-800/80 rounded-xl flex items-center space-x-2.5 text-xs font-mono text-sky-300 animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin text-sky-400 flex-shrink-0" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* Success Notification */}
      {syncSuccess && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded-xl space-y-2 font-mono text-xs text-emerald-300 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>GitHub Repository Synchronized Successfully!</span>
            </div>
            <span className="text-[10px] text-emerald-400/80">{syncSuccess.timestamp} NZST</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Committed and pushed <strong className="text-emerald-300">{syncSuccess.fileCount} source files</strong> using Octokit Git Data Tree API.
          </p>
          <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px]">
            <a
              href={syncSuccess.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 font-bold text-emerald-400 hover:text-emerald-300 underline"
            >
              <span>View Repository on GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">
              Commit SHA: <code className="text-sky-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">{syncSuccess.commitSha.substring(0, 7)}</code>
            </span>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {syncError && (
        <div className="p-4 bg-rose-950/40 border border-rose-900/80 rounded-xl space-y-2 font-mono text-xs text-rose-300 animate-fade-in">
          <div className="flex items-center space-x-2 font-bold text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>GitHub Synchronization Error</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">{syncError}</p>
          <div className="p-2.5 bg-slate-950/80 rounded border border-rose-900/50 text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-rose-300">Troubleshooting Tips:</span>
            <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-400">
              <li>Ensure your Personal Access Token (PAT) has the <code className="text-sky-300">repo</code> scope enabled.</li>
              <li>Verify your GitHub username/owner exists and matches your token's user or organization account.</li>
              <li>If pushing to an existing repository, confirm you have write/push permissions.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
