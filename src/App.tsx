import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ActiveTab, OceanBoy, SuperintendentState } from './types';
import { INITIAL_OCEAN_BOYS } from './db/oceanBoysFleet';
import { loadFleetState, saveFleetState } from './services/fleetStorage';
import {
  loadSuperintendentState,
  saveSuperintendentState,
  applyMonthlyUpgrade
} from './services/superintendentEngine';
import { Navbar, SidebarRail, MobileBottomDock } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { ModuleErrorBoundary } from './components/ModuleErrorBoundary';
const FundingRoadmap = lazy(() => import('./components/FundingRoadmap').then(module => ({ default: module.FundingRoadmap })));
const HardwareRoadmap = lazy(() => import('./components/HardwareRoadmap').then(module => ({ default: module.HardwareRoadmap })));
const NzBusinessGuide = lazy(() => import('./components/NzBusinessGuide').then(module => ({ default: module.NzBusinessGuide })));
const PitchDeck = lazy(() => import('./components/PitchDeck').then(module => ({ default: module.PitchDeck })));
const TelemetrySim = lazy(() => import('./components/TelemetrySim').then(module => ({ default: module.TelemetrySim })));
const BOMViewer = lazy(() => import('./components/BOMViewer').then(module => ({ default: module.BOMViewer })));
const RegulatoryCompliance = lazy(() => import('./components/RegulatoryCompliance').then(module => ({ default: module.RegulatoryCompliance })));
const OutreachHub = lazy(() => import('./components/OutreachHub').then(module => ({ default: module.OutreachHub })));
const OceanTrialsLogistics = lazy(() => import('./components/OceanTrialsLogistics').then(module => ({ default: module.OceanTrialsLogistics })));
const ThreeDControlDatabase = lazy(() => import('./components/ThreeDControlDatabase').then(module => ({ default: module.ThreeDControlDatabase })));
const SatelliteWeather = lazy(() => import('./components/SatelliteWeather').then(module => ({ default: module.SatelliteWeather })));
const EcoImpactAudit = lazy(() => import('./components/EcoImpactAudit').then(module => ({ default: module.EcoImpactAudit })));
const FinancialModel = lazy(() => import('./components/FinancialModel').then(module => ({ default: module.FinancialModel })));
const SystemDynamics = lazy(() => import('./components/SystemDynamics').then(module => ({ default: module.SystemDynamics })));
const GlobalClimateDashboard = lazy(() => import('./components/GlobalClimateDashboard').then(module => ({ default: module.GlobalClimateDashboard })));
const OceaniaObservatory = lazy(() => import('./components/OceaniaObservatory').then(module => ({ default: module.OceaniaObservatory })));
const OceanBoysFleet = lazy(() => import('./components/OceanBoysFleet').then(module => ({ default: module.OceanBoysFleet })));
const WeatherPollution3DModel = lazy(() => import('./components/WeatherPollution3DModel').then(module => ({ default: module.WeatherPollution3DModel })));
const MeshAIStudio = lazy(() => import('./components/MeshAIStudio').then(module => ({ default: module.MeshAIStudio })));
const WindTurbinePlatform3D = lazy(() => import('./components/WindTurbinePlatform3D').then(module => ({ default: module.WindTurbinePlatform3D })));
const InteriorSuperintendent = lazy(() => import('./components/InteriorSuperintendent').then(module => ({ default: module.InteriorSuperintendent })));
const PublicOutreachPortal = lazy(() => import('./components/PublicOutreachPortal').then(module => ({ default: module.PublicOutreachPortal })));

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [isOutreachPortalOpen, setIsOutreachPortalOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('portal') === 'campaign';
    }
    return false;
  });
  const [buoys, setBuoys] = useState<OceanBoy[]>(() => loadFleetState(INITIAL_OCEAN_BOYS));

  // Persist fleet edits, patrol state and locally generated demo readings in this browser.
  useEffect(() => {
    saveFleetState(buoys);
  }, [buoys]);
  const [superintendentState, setSuperintendentState] = useState<SuperintendentState>(() =>
    loadSuperintendentState()
  );

  // Periodic background check so if a monthly rollout boundary crosses while open, it auto-upgrades
  useEffect(() => {
    const interval = setInterval(() => {
      setSuperintendentState((prev) => {
        if (!prev.autoUpgradeMonthly || !prev.nextScheduledUpgradeIso) return prev;
        if (Date.now() >= new Date(prev.nextScheduledUpgradeIso).getTime()) {
          return applyMonthlyUpgrade(prev, 'Scheduled Monthly Auto-Upgrade');
        }
        return prev;
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerMonthlyUpgrade = () => {
    setSuperintendentState((prev) => applyMonthlyUpgrade(prev, 'Manual Upgrade Rollout'));
  };

  const handleToggleAutoMonthly = () => {
    setSuperintendentState((prev) => {
      const next: SuperintendentState = {
        ...prev,
        autoUpgradeMonthly: !prev.autoUpgradeMonthly
      };
      saveSuperintendentState(next);
      return next;
    });
  };

  const handleRecordSuperintendentAction = (
    buoyId: string,
    buoyName: string,
    action: string,
    outcome: string
  ) => {
    setSuperintendentState((prev) => {
      const next: SuperintendentState = {
        ...prev,
        actionLogs: [
          {
            id: `SUP-ACT-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            buoyId,
            buoyName,
            action,
            outcome,
            generationAtExecution: prev.generation
          },
          ...prev.actionLogs
        ].slice(0, 30),
        remediatedBuoyIds: prev.remediatedBuoyIds.includes(buoyId)
          ? prev.remediatedBuoyIds
          : [...prev.remediatedBuoyIds, buoyId]
      };
      saveSuperintendentState(next);
      return next;
    });
  };

  if (isOutreachPortalOpen) {
    return (
      <ModuleErrorBoundary label="campaign portal">
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#030812] text-xs font-mono text-slate-300">Loading campaign portal…</div>}>
      <PublicOutreachPortal
        onExitPortal={() => {
          setIsOutreachPortalOpen(false);
          if (typeof window !== 'undefined' && window.location.search.includes('portal=campaign')) {
            const url = new URL(window.location.href);
            url.searchParams.delete('portal');
            window.history.replaceState({}, '', url.toString());
          }
        }}
      />
      </Suspense>
      </ModuleErrorBoundary>
    );
  }

  return (
    <div className="min-h-screen bg-[#030812] bg-ocean-grid text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Telemetry & Utility Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        buoys={buoys}
        superintendentGen={superintendentState.generation}
        onOpenOutreachPortal={() => setIsOutreachPortalOpen(true)}
      />

      {/* Shell: Left Command Rail (Desktop) + Scrollable Main Canvas */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto flex">
        <SidebarRail
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          superintendentGen={superintendentState.generation}
        />

        <div className="flex-1 min-w-0 flex flex-col">
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <ModuleErrorBoundary key={activeTab} label="workspace">
            <Suspense fallback={<div className="flex min-h-[42vh] items-center justify-center"><div className="rounded-xl border border-slate-800 bg-slate-900/80 px-5 py-4 text-xs font-mono text-slate-300 shadow-xl"><span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-cyan-400" />Loading workspace module…</div></div>}>
            {activeTab === 'landing' && <LandingPage setActiveTab={setActiveTab} />}
            {activeTab === 'overview' && (
              <Dashboard
                setActiveTab={setActiveTab}
                buoys={buoys}
                superintendentState={superintendentState}
              />
            )}
            {activeTab === 'superintendent' && (
              <InteriorSuperintendent
                buoys={buoys}
                setBuoys={setBuoys}
                superintendentState={superintendentState}
                onTriggerMonthlyUpgrade={handleTriggerMonthlyUpgrade}
                onToggleAutoMonthly={handleToggleAutoMonthly}
                onRecordAction={handleRecordSuperintendentAction}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === 'ocean-boys-fleet' && (
              <OceanBoysFleet
                setActiveTab={setActiveTab}
                buoys={buoys}
                setBuoys={setBuoys}
                superintendentGen={superintendentState.generation}
              />
            )}
            {activeTab === 'mesh-ai' && <MeshAIStudio />}
            {activeTab === 'wind-turbine-3d' && <WindTurbinePlatform3D />}
            {activeTab === 'weather-pollution-3d' && <WeatherPollution3DModel />}
            {activeTab === 'oceania-observatory' && <OceaniaObservatory />}
            {activeTab === 'global-climate' && <GlobalClimateDashboard />}
            {activeTab === 'system-dynamics' && <SystemDynamics />}
            {activeTab === '3d-control' && <ThreeDControlDatabase setActiveTab={setActiveTab} />}
            {activeTab === 'satellite-weather' && <SatelliteWeather />}
            {activeTab === 'financial-model' && <FinancialModel />}
            {activeTab === 'eco-impact' && <EcoImpactAudit />}
            {activeTab === 'funding' && <FundingRoadmap />}
            {activeTab === 'outreach' && <OutreachHub />}
            {activeTab === 'hardware' && <HardwareRoadmap />}
            {activeTab === 'trials-logistics' && <OceanTrialsLogistics />}
            {activeTab === 'nz-business' && <NzBusinessGuide />}
            {activeTab === 'pitch-deck' && <PitchDeck />}
            {activeTab === 'telemetry' && <TelemetrySim />}
            {activeTab === 'bom' && <BOMViewer />}
            {activeTab === 'regulatory' && <RegulatoryCompliance />}
            </Suspense>
            </ModuleErrorBoundary>
          </main>

          <footer className="border-t border-slate-800/70 bg-[#030812]/90 py-4 px-4 sm:px-6 lg:px-8 text-xs font-mono text-slate-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-slate-300 font-semibold">
                  SaliBuoy Systems • Project Conveyor • Supt Gen {superintendentState.generation}.0
                </span>
              </div>
              <span>Pukekohe, Auckland, NZ • AMOC Stabilization &amp; Cryo-Restoration</span>
            </div>
          </footer>
        </div>
      </div>

      {/* Mobile Bottom Quick-Switch Dock */}
      <MobileBottomDock activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
