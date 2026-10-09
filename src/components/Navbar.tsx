import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { MobileAccessModal } from './MobileAccessModal';
import { OppoA6xTerminalModal } from './OppoA6xTerminalModal';
import { SmsAlertsModal } from './SmsAlertsModal';
import { 
  Globe2,
  Compass, 
  DollarSign, 
  Cpu, 
  FileCheck2, 
  Presentation, 
  Activity, 
  Package, 
  ShieldAlert, 
  Anchor,
  Sparkles,
  Ship,
  Box,
  Leaf,
  Calculator,
  Radio,
  LineChart,
  Thermometer,
  Smartphone,
  QrCode,
  Bell,
  Wind
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [isMobileModalOpen, setIsMobileModalOpen] = useState<boolean>(false);
  const [isOppoModalOpen, setIsOppoModalOpen] = useState<boolean>(false);
  const [isSmsAlertsOpen, setIsSmsAlertsOpen] = useState<boolean>(false);
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'landing', label: 'Investor Landing', icon: <Globe2 className="w-4 h-4 text-emerald-400" />, badge: 'PUBLIC' },
    { id: 'overview', label: 'Overview & AMOC', icon: <Compass className="w-4 h-4" /> },
    { id: 'ocean-boys-fleet', label: 'Ocean Boys & Real-Time Satellites', icon: <Radio className="w-4 h-4 text-teal-400 animate-pulse" />, badge: '23 BOYS • LIVE SAT' },
    { id: 'weather-pollution-3d', label: '3D Weather & Pollution (CO2/CH4)', icon: <Wind className="w-4 h-4 text-emerald-400 animate-pulse" />, badge: '3D • CO2 • CH4' },
    { id: 'oceania-observatory', label: 'Oceania & Polar Observatory', icon: <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />, badge: '3D LIVE' },
    { id: 'global-climate', label: 'Global Climate & NOAA SST', icon: <Thermometer className="w-4 h-4 text-rose-400" />, badge: 'NOAA CRW' },
    { id: 'system-dynamics', label: 'System Dynamics 50-Yr', icon: <LineChart className="w-4 h-4 text-sky-400" />, badge: 'D3.JS' },
    { id: '3d-control', label: '3D CAD Control Database', icon: <Box className="w-4 h-4 text-cyan-400" />, badge: '3D TWIN' },
    { id: 'satellite-weather', label: 'Polar & NZ Satellite Radar', icon: <Radio className="w-4 h-4 text-sky-400" />, badge: 'NOAA/NASA/HIMAWARI' },
    { id: 'financial-model', label: 'Fleet Financial Model', icon: <Calculator className="w-4 h-4 text-emerald-400" />, badge: 'ROI/NPV' },
    { id: 'eco-impact', label: 'Eco Safety Audit', icon: <Leaf className="w-4 h-4 text-emerald-400" />, badge: 'EPA EEZ' },
    { id: 'funding', label: '12-Mo NZ Funding', icon: <DollarSign className="w-4 h-4" />, badge: '$1.5M NZD' },
    { id: 'outreach', label: 'Grant & Outreach Hub', icon: <Sparkles className="w-4 h-4 text-purple-400" />, badge: 'AI' },
    { id: 'hardware', label: 'Hardware Roadmap', icon: <Cpu className="w-4 h-4" />, badge: 'Mk-III' },
    { id: 'trials-logistics', label: 'Ocean Trials Logistics', icon: <Ship className="w-4 h-4 text-sky-400" /> },
    { id: 'nz-business', label: 'NZ Business & Sole Trader', icon: <FileCheck2 className="w-4 h-4" /> },
    { id: 'pitch-deck', label: 'VC Pitch Deck', icon: <Presentation className="w-4 h-4" /> },
    { id: 'telemetry', label: 'Live Telemetry Sim', icon: <Activity className="w-4 h-4" />, badge: 'LIVE' },
    { id: 'bom', label: 'Hardware BOM', icon: <Package className="w-4 h-4" /> },
    { id: 'regulatory', label: 'Maritime Compliance', icon: <ShieldAlert className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-teal-400 p-0.5 shadow-lg shadow-sky-950/50 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Anchor className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white font-mono">SALIBUOY</span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-sky-950 text-sky-300 border border-sky-800/60 rounded">
                  NZ DEEPTECH
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight hidden sm:block">
                Project Conveyor • AMOC Stabilization & Cryo-Restoration
              </p>
            </div>
          </div>

          {/* Quick Actions & Status */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Oppo A6x Field Simulator Direct Trigger */}
            <button
              type="button"
              onClick={() => setIsOppoModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 hover:from-teal-500/30 hover:to-emerald-500/30 border border-teal-400/40 text-teal-200 hover:text-white rounded-lg text-xs font-mono font-medium transition-all shadow-sm cursor-pointer"
              title="Launch Oppo A6x Field Terminal Simulator (90Hz)"
            >
              <Smartphone className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span className="hidden sm:inline">Oppo A6x Terminal</span>
              <span className="sm:hidden">Oppo A6x</span>
              <span className="px-1.5 py-0.2 text-[9px] bg-teal-500/20 text-teal-300 rounded font-bold border border-teal-500/30">
                90Hz
              </span>
            </button>

            {/* SMS Alerts Direct Trigger */}
            <button
              type="button"
              onClick={() => setIsSmsAlertsOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-500/40 text-emerald-300 hover:text-white rounded-lg text-xs font-mono font-medium transition-all shadow-sm cursor-pointer"
              title="Configure SMS Notification Alerts for Anonymous Info & Drift"
            >
              <Bell className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
              <span className="hidden sm:inline">SMS Alerts</span>
              <span className="sm:hidden">SMS</span>
            </button>

            {/* Mobile / QR Access Trigger Button */}
            <button
              type="button"
              onClick={() => setIsMobileModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white rounded-lg text-xs font-mono font-medium transition-all shadow-sm cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Mobile QR Link</span>
              <span className="sm:hidden">QR</span>
            </button>

            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-slate-300">Base: Pukekohe, Auckland (NZ)</span>
              </div>
              <div className="flex items-center space-x-2 bg-sky-950/60 px-3 py-1.5 rounded-lg border border-sky-800/50 text-xs font-mono text-sky-200">
                <span>Target Seed:</span>
                <span className="font-bold text-emerald-400">$1,500,000 NZD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Row */}
        <div className="flex space-x-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-900 text-xs">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-sky-500/10 text-sky-300 border border-sky-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <span className={isActive ? 'text-sky-400' : 'text-slate-500'}>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 text-[9px] font-mono rounded font-bold ${
                      isActive ? 'bg-sky-400/20 text-sky-200' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Access & Device Guide Modal */}
      <MobileAccessModal 
        isOpen={isMobileModalOpen} 
        onClose={() => setIsMobileModalOpen(false)}
        onOpenOppoSimulator={() => setIsOppoModalOpen(true)}
      />

      {/* Oppo A6x Field Terminal Simulator Modal */}
      <OppoA6xTerminalModal 
        isOpen={isOppoModalOpen}
        onClose={() => setIsOppoModalOpen(false)}
        onOpenSmsAlerts={() => {
          setIsOppoModalOpen(false);
          setIsSmsAlertsOpen(true);
        }}
      />

      {/* SMS Alerts for Anonymous Info & Field Intelligence Modal */}
      <SmsAlertsModal 
        isOpen={isSmsAlertsOpen}
        onClose={() => setIsSmsAlertsOpen(false)}
      />
    </header>
  );
};
