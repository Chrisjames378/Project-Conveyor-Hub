import React, { useState } from 'react';
import { ActiveTab, OceanBoy } from '../types';
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
  Wind,
  BrainCircuit,
  Megaphone,
  Menu,
  Search,
  X
} from 'lucide-react';

export interface NavItemConfig {
  id: ActiveTab;
  label: string;
  shortLabel?: string;
  icon: React.ReactNode;
  tag?: string;
  group: 'Fleet & Autonomy' | '3D & Engineering' | 'Ocean & Risk Science' | 'Venture & Operations';
}

export function getNavItems(superintendentGen = 2): NavItemConfig[] {
  return [
    { id: 'landing', label: 'Investor Landing', shortLabel: 'Home', icon: <Globe2 className="w-4 h-4" />, tag: 'PUBLIC', group: 'Venture & Operations' },
    { id: 'overview', label: 'Mission Overview', shortLabel: 'Overview', icon: <Compass className="w-4 h-4" />, group: 'Fleet & Autonomy' },
    { id: 'superintendent', label: 'Interior Superintendent', shortLabel: 'Supt', icon: <BrainCircuit className="w-4 h-4" />, tag: `GEN ${superintendentGen}.0`, group: 'Fleet & Autonomy' },
    { id: 'ocean-boys-fleet', label: 'Ocean Boys Fleet', shortLabel: 'Fleet', icon: <Radio className="w-4 h-4" />, tag: '23', group: 'Fleet & Autonomy' },
    { id: 'satellite-weather', label: 'Polar & NZ Radar', icon: <Radio className="w-4 h-4" />, tag: 'SAT', group: 'Fleet & Autonomy' },
    { id: 'trials-logistics', label: 'Ocean Trials Logistics', icon: <Ship className="w-4 h-4" />, group: 'Fleet & Autonomy' },
    { id: 'telemetry', label: 'Live Telemetry Sim', icon: <Activity className="w-4 h-4" />, tag: 'SIM', group: 'Fleet & Autonomy' },

    { id: 'wind-turbine-3d', label: 'Wind Turbine 3D', shortLabel: 'Turbine', icon: <Wind className="w-4 h-4" />, tag: '3D', group: '3D & Engineering' },
    { id: 'mesh-ai', label: 'Mesh AI 3D & STL', icon: <Box className="w-4 h-4" />, tag: 'STL', group: '3D & Engineering' },
    { id: '3d-control', label: '3D CAD Database', icon: <Box className="w-4 h-4" />, tag: 'CAD', group: '3D & Engineering' },
    { id: 'hardware', label: 'Hardware Roadmap', icon: <Cpu className="w-4 h-4" />, tag: 'Mk-III', group: '3D & Engineering' },
    { id: 'bom', label: 'Hardware BOM', icon: <Package className="w-4 h-4" />, group: '3D & Engineering' },

    { id: 'eco-impact', label: 'Eco Safety & Risk Sim', shortLabel: 'Risk', icon: <Leaf className="w-4 h-4" />, tag: 'EPA', group: 'Ocean & Risk Science' },
    { id: 'weather-pollution-3d', label: '3D Weather & CO2/CH4', icon: <Wind className="w-4 h-4" />, tag: '3D', group: 'Ocean & Risk Science' },
    { id: 'oceania-observatory', label: 'Oceania Observatory', icon: <Radio className="w-4 h-4" />, tag: '3D', group: 'Ocean & Risk Science' },
    { id: 'global-climate', label: 'Global Climate & SST', icon: <Thermometer className="w-4 h-4" />, tag: 'NOAA', group: 'Ocean & Risk Science' },
    { id: 'system-dynamics', label: 'System Dynamics 50-Yr', icon: <LineChart className="w-4 h-4" />, tag: 'D3', group: 'Ocean & Risk Science' },
    { id: 'regulatory', label: 'Maritime Compliance', icon: <ShieldAlert className="w-4 h-4" />, group: 'Ocean & Risk Science' },

    { id: 'financial-model', label: 'Fleet Financial Model', icon: <Calculator className="w-4 h-4" />, tag: 'ROI', group: 'Venture & Operations' },
    { id: 'funding', label: '12-Mo NZ Funding', icon: <DollarSign className="w-4 h-4" />, tag: '$1.5M', group: 'Venture & Operations' },
    { id: 'outreach', label: 'Grant & Proposal Hub', icon: <Sparkles className="w-4 h-4" />, tag: 'AI', group: 'Venture & Operations' },
    { id: 'nz-business', label: 'NZ Sole Trader Setup', icon: <FileCheck2 className="w-4 h-4" />, group: 'Venture & Operations' },
    { id: 'pitch-deck', label: 'VC Pitch Deck', icon: <Presentation className="w-4 h-4" />, group: 'Venture & Operations' }
  ];
}

const GROUP_ORDER: NavItemConfig['group'][] = [
  'Fleet & Autonomy',
  '3D & Engineering',
  'Ocean & Risk Science',
  'Venture & Operations'
];

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  buoys?: OceanBoy[];
  superintendentGen?: number;
  onOpenOutreachPortal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  buoys,
  superintendentGen = 2,
  onOpenOutreachPortal
}) => {
  const [isMobileModalOpen, setIsMobileModalOpen] = useState<boolean>(false);
  const [isOppoModalOpen, setIsOppoModalOpen] = useState<boolean>(false);
  const [isSmsAlertsOpen, setIsSmsAlertsOpen] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [mobileSearch, setMobileSearch] = useState('');

  const navItems = getNavItems(superintendentGen);
  const currentNavItem = navItems.find((n) => n.id === activeTab);

  const handleSelectTab = (id: ActiveTab) => {
    setActiveTab(id);
    setIsMobileDrawerOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-14 bg-[#030812]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-[1600px] mx-auto h-full px-3 sm:px-5 flex items-center justify-between gap-2">
          {/* Left: Mobile Drawer Trigger + Brand + Current View Breadcrumb */}
          <div className="flex items-center space-x-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('landing')}
              className="flex items-center space-x-2.5 cursor-pointer text-left shrink-0"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/40 flex items-center justify-center">
                <Anchor className="w-4 h-4 text-sky-400" />
              </div>
              <div className="leading-none">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-sm tracking-wider text-white font-mono">
                    SALIBUOY
                  </span>
                  <span className="hidden sm:inline px-1.5 py-0.5 text-[9px] font-mono font-semibold bg-slate-900 text-sky-300 border border-slate-700 rounded">
                    NZ
                  </span>
                </div>
                <span className="hidden md:block text-[10px] text-slate-400 font-mono mt-0.5">
                  Project Conveyor
                </span>
              </div>
            </button>

            {currentNavItem && (
              <div className="hidden sm:flex items-center space-x-2 pl-3 ml-1 border-l border-slate-800 min-w-0">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider truncate">
                  {currentNavItem.group}
                </span>
                <span className="text-slate-600">/</span>
                <span className="text-xs font-semibold text-white truncate">
                  {currentNavItem.label}
                </span>
              </div>
            )}
          </div>

          {/* Right: Hardware Terminal, SMS, QR, Campaign Portal */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => handleSelectTab('superintendent')}
              className="hidden xl:inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-800/70 text-cyan-200 text-[11px] font-mono font-semibold cursor-pointer transition-colors"
            >
              <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
              <span>Supt Gen {superintendentGen}.0</span>
            </button>

            <button
              type="button"
              onClick={() => setIsOppoModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-teal-700/60 text-teal-200 rounded-lg text-[11px] font-mono font-semibold transition-colors cursor-pointer"
              title="Launch Oppo A6x Field Terminal (90Hz)"
            >
              <Smartphone className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Oppo A6x</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSmsAlertsOpen(true)}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-[11px] font-mono font-semibold transition-colors cursor-pointer"
              title="SMS Notification Alerts"
            >
              <Bell className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">SMS</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMobileModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-[11px] font-mono transition-colors cursor-pointer"
              title="Mobile QR Link"
            >
              <QrCode className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden md:inline">QR</span>
            </button>

            {onOpenOutreachPortal && (
              <button
                type="button"
                onClick={onOpenOutreachPortal}
                className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-lg text-[11px] font-mono font-bold transition-colors cursor-pointer"
                title="Open Separate Outreach, Greenpeace & Funding Campaign Portal"
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Campaign &amp; Greenpeace</span>
                <span className="sm:hidden">Share</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Navigation Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          <aside className="relative z-10 w-72 max-w-[85vw] bg-[#060d1c] border-r border-slate-800 h-full flex flex-col">
            <div className="h-14 px-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Anchor className="w-4 h-4 text-sky-400" />
                <span className="font-mono font-bold text-sm text-white">SALIBUOY MODULES</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="border-b border-slate-800 p-3">
              <label className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 focus-within:border-cyan-400/60">
                <Search className="h-4 w-4 text-slate-500" />
                <input value={mobileSearch} onChange={(event) => setMobileSearch(event.target.value)} placeholder="Find a module..." className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500" />
              </label>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-5">
              {GROUP_ORDER.map((groupName) => {
                const term = mobileSearch.trim().toLowerCase();
                const items = navItems.filter((i) => i.group === groupName && (!term || i.label.toLowerCase().includes(term)));
                return (
                  <div key={groupName} className="space-y-1">
                    <div className="px-2.5 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                      {groupName}
                    </div>
                    {items.map((item) => {
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectTab(item.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                              : 'text-slate-300 hover:bg-slate-900 hover:text-white border border-transparent'
                          }`}
                        >
                          <span className="flex items-center space-x-2.5 truncate">
                            <span className={isActive ? 'text-sky-400' : 'text-slate-500'}>
                              {item.icon}
                            </span>
                            <span className="truncate">{item.label}</span>
                          </span>
                          {item.tag && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                              {item.tag}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
              {navItems.every((item) => !item.label.toLowerCase().includes(mobileSearch.trim().toLowerCase())) && (
                <p className="px-2 py-6 text-center text-xs text-slate-500">No modules match your search.</p>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Modals */}
      <MobileAccessModal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
        onOpenOppoSimulator={() => setIsOppoModalOpen(true)}
      />

      <OppoA6xTerminalModal
        isOpen={isOppoModalOpen}
        onClose={() => setIsOppoModalOpen(false)}
        buoys={buoys}
        onOpenSmsAlerts={() => {
          setIsOppoModalOpen(false);
          setIsSmsAlertsOpen(true);
        }}
      />

      <SmsAlertsModal
        isOpen={isSmsAlertsOpen}
        onClose={() => setIsSmsAlertsOpen(false)}
      />
    </>
  );
};

interface SidebarRailProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  superintendentGen: number;
}

export const SidebarRail: React.FC<SidebarRailProps> = ({
  activeTab,
  setActiveTab,
  superintendentGen
}) => {
  const navItems = getNavItems(superintendentGen);
  const [search, setSearch] = useState('');
  const term = search.trim().toLowerCase();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-slate-800/80 bg-[#040a16]/90 sticky top-14 h-[calc(100vh-3.5rem)]">
      <div className="border-b border-slate-800/80 p-3">
        <label className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-2 focus-within:border-cyan-500/50">
          <Search className="h-3.5 w-3.5 text-slate-500" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search workspace..." className="w-full bg-transparent text-xs text-slate-100 outline-none placeholder:text-slate-600" />
        </label>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {GROUP_ORDER.map((groupName) => {
          const items = navItems.filter((i) => i.group === groupName && (!term || i.label.toLowerCase().includes(term)));
          return (
            <div key={groupName} className="space-y-1">
              <div className="px-2.5 pb-1 text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                {groupName}
              </div>
              {items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-sky-500/12 text-white border border-sky-500/35 shadow-sm'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/70 border border-transparent'
                    }`}
                  >
                    <span className="flex items-center space-x-2.5 min-w-0">
                      <span className={isActive ? 'text-sky-400' : 'text-slate-500'}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </span>
                    {item.tag && (
                      <span
                        className={`ml-2 text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                          isActive
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            : 'bg-slate-900 text-slate-500 border border-slate-800/80'
                        }`}
                      >
                        {item.tag}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
        {navItems.every((item) => !item.label.toLowerCase().includes(term)) && (
          <p className="px-2 py-6 text-center text-xs text-slate-500">No matching modules.</p>
        )}
      </div>

      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 font-mono text-[10px] text-slate-400 space-y-1">
        <div className="flex items-center justify-between">
          <span>BASE</span>
          <span className="text-slate-200">Pukekohe, NZ</span>
        </div>
        <div className="flex items-center justify-between">
          <span>SEED ROUND</span>
          <span className="text-emerald-400 font-bold">$1.5M NZD</span>
        </div>
      </div>
    </aside>
  );
};

interface MobileBottomDockProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({ activeTab, setActiveTab }) => {
  const quickTabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'landing', label: 'Home', icon: <Globe2 className="w-4 h-4" /> },
    { id: 'ocean-boys-fleet', label: 'Fleet', icon: <Radio className="w-4 h-4" /> },
    { id: 'superintendent', label: 'Supt AI', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'wind-turbine-3d', label: 'Turbine', icon: <Wind className="w-4 h-4" /> },
    { id: 'eco-impact', label: 'Risk Sim', icon: <Leaf className="w-4 h-4" /> }
  ];

  return (
    <nav className="lg:hidden sticky bottom-0 z-30 bg-[#030812]/95 backdrop-blur-md border-t border-slate-800 grid grid-cols-5 px-1 py-1.5 font-mono text-[10px]">
      {quickTabs.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors cursor-pointer ${
              isActive ? 'text-sky-400 bg-sky-500/10 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.icon}
            <span className="mt-0.5 truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
