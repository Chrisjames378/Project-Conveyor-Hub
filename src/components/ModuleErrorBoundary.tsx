import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ModuleErrorBoundaryProps {
  children: ReactNode;
  label?: string;
}

interface ModuleErrorBoundaryState {
  hasError: boolean;
}

export class ModuleErrorBoundary extends Component<ModuleErrorBoundaryProps, ModuleErrorBoundaryState> {
  state: ModuleErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ModuleErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Workspace module failed to load:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section role="alert" className="mx-auto flex min-h-[38vh] max-w-xl flex-col items-center justify-center gap-3 rounded-2xl border border-rose-400/20 bg-slate-950/80 p-6 text-center shadow-xl">
          <div className="text-sm font-semibold text-slate-100">This {this.props.label || 'workspace'} module could not be loaded.</div>
          <p className="max-w-md text-xs leading-relaxed text-slate-400">Your saved workspace data has not been intentionally changed. Check your connection and reload the application to retry loading the module.</p>
          <button type="button" onClick={() => window.location.reload()} className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-400/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300">Reload application</button>
        </section>
      );
    }
    return this.props.children;
  }
}
