import React, { useState } from 'react';
import { ActiveTab } from './types';
import { Navbar } from './components/Navbar';
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

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-slate-950">
      {/* Sticky Top Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
        {activeTab === 'landing' && <LandingPage setActiveTab={setActiveTab} />}
        {activeTab === 'overview' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === '3d-control' && <ThreeDControlDatabase />}
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

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-400 font-semibold">SaliBuoy Systems • Project Conveyor</span>
          </div>
          <span>Engineering Base: Pukekohe, Auckland, New Zealand • AMOC Stabilization Platform</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
