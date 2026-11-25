import React, { useState, useEffect } from 'react';
import { ActiveTab, OceanBoy, SuperintendentState } from './types';
import { INITIAL_OCEAN_BOYS } from './db/oceanBoysFleet';
import {
  loadSuperintendentState,
  saveSuperintendentState,
  applyMonthlyUpgrade
} from './services/superintendentEngine';
import { Navbar, SidebarRail, MobileBottomDock } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { FundingRoadmap } from './components/FundingRoadmap';
import { HardwareRoadmap } from './components/HardwareRoadmap';
import { NzBusinessGuide } from './components/NzBusinessGuide';
import { PitchDeck } from './components/PitchDeck';
import { TelemetrySim } from './components/TelemetrySim';
import { BOMViewer } from './components/BOMViewer';
import { RegulatoryCompliance } from './components/RegulatoryCompliance';
import { OutreachHub } from './components/OutreachHub';
import { OceanTrialsLogistics } from './components/OceanTrialsLogistics';
import { ThreeDControlDatabase } from './components/ThreeDControlDatabase';
import { SatelliteWeather } from './components/SatelliteWeather';
import { EcoImpactAudit } from './components/EcoImpactAudit';
import { FinancialModel } from './components/FinancialModel';
import { SystemDynamics } from './components/SystemDynamics';
import { GlobalClimateDashboard } from './components/GlobalClimateDashboard';
import { OceaniaObservatory } from './components/OceaniaObservatory';
import { OceanBoysFleet } from './components/OceanBoysFleet';
import { WeatherPollution3DModel } from './components/WeatherPollution3DModel';
import { MeshAIStudio } from './components/MeshAIStudio';
import { WindTurbinePlatform3D } from './components/WindTurbinePlatform3D';
import { InteriorSuperintendent } from './components/InteriorSuperintendent';
import { PublicOutreachPortal } from './components/PublicOutreachPortal';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [isOutreachPortalOpen, setIsOutreachPortalOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('portal') === 'campaign';
    }
    return false;
  });
  const [buoys, setBuoys] = useState<OceanBoy[]>(INITIAL_OCEAN_BOYS);
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
