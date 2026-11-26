import React, { useMemo, useState } from 'react';
import { ActiveTab } from '../types';
import { MobileAccessModal } from './MobileAccessModal';
import { OppoA6xTerminalModal } from './OppoA6xTerminalModal';
import { SmsAlertsModal } from './SmsAlertsModal';
import {
  Activity, Anchor, Bell, Box, Building2, ChevronDown, Compass, Cpu,
  DollarSign, FileCheck2, Globe2, Layers, Leaf, Menu, Package, Presentation,
  QrCode, Radio, Search, ShieldAlert, Ship, Smartphone, Sparkles,
  Thermometer, Wind, X, Calculator, LineChart
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

type NavSection = 'Command centre' | 'Ocean intelligence' | 'Engineering & delivery';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  section: NavSection;
}

const navItems: NavItem[] = [
  { id: 'landing', label: 'Investor landing', icon: <Globe2 />, badge: 'PUBLIC', section: 'Command centre' },
  { id: 'overview', label: 'Executive overview', icon: <Compass />, section: 'Command centre' },
  { id: 'ocean-boys-fleet', label: 'Ocean Boys fleet', icon: <Radio />, badge: 'FLEET', section: 'Ocean intelligence' },
  { id: 'oceania-observatory', label: 'Oceania & polar observatory', icon: <Radio />, section: 'Ocean intelligence' },
  { id: 'global-climate', label: 'Global climate & SST', icon: <Thermometer />, badge: 'NOAA', section: 'Ocean intelligence' },
  { id: 'satellite-weather', label: 'Satellite weather', icon: <Wind />, section: 'Ocean intelligence' },
  { id: 'weather-pollution-3d', label: 'Weather & pollution 3D', icon: <Wind />, section: 'Ocean intelligence' },
  { id: 'telemetry', label: 'Telemetry simulator', icon: <Activity />, badge: 'SIM', section: 'Ocean intelligence' },
  { id: 'system-dynamics', label: 'System dynamics', icon: <LineChart />, section: 'Ocean intelligence' },
  { id: 'mesh-ai', label: 'Mesh AI studio', icon: <Box />, badge: '3D', section: 'Engineering & delivery' },
  { id: 'wind-turbine-3d', label: 'Wind turbine 3D', icon: <Wind />, section: 'Engineering & delivery' },
  { id: '3d-control', label: '3D CAD control database', icon: <Box />, section: 'Engineering & delivery' },
  { id: 'hardware', label: 'Hardware roadmap', icon: <Cpu />, section: 'Engineering & delivery' },
  { id: 'bom', label: 'Bill of materials', icon: <Package />, section: 'Engineering & delivery' },
  { id: 'trials-logistics', label: 'Ocean trials logistics', icon: <Ship />, section: 'Engineering & delivery' },
  { id: 'regulatory', label: 'Maritime compliance', icon: <ShieldAlert />, section: 'Engineering & delivery' },
  { id: 'eco-impact', label: 'Environmental safeguards', icon: <Leaf />, section: 'Engineering & delivery' },
  { id: 'financial-model', label: 'Fleet financial model', icon: <Calculator />, section: 'Engineering & delivery' },
  { id: 'funding', label: 'Funding roadmap', icon: <DollarSign />, badge: 'NZD', section: 'Engineering & delivery' },
  { id: 'outreach', label: 'Grant & outreach hub', icon: <Sparkles />, section: 'Engineering & delivery' },
  { id: 'nz-business', label: 'NZ business guide', icon: <Building2 />, section: 'Engineering & delivery' },
  { id: 'pitch-deck', label: 'Investor pitch deck', icon: <Presentation />, section: 'Engineering & delivery' },
];

const sections: NavSection[] = ['Command centre', 'Ocean intelligence', 'Engineering & delivery'];

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isOppoModalOpen, setIsOppoModalOpen] = useState(false);
  const [isSmsAlertsOpen, setIsSmsAlertsOpen] = useState(false);
  const [isModulesOpen, setIsModulesOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term ? navItems.filter(item => item.label.toLowerCase().includes(term) || item.section.toLowerCase().includes(term)) : navItems;
  }, [search]);

  const navigate = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsModulesOpen(false);
    setSearch('');
  };

  const quickLinks: ActiveTab[] = ['overview', 'ocean-boys-fleet', 'mesh-ai', 'telemetry', 'funding'];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#07111f]/95 shadow-lg shadow-slate-950/20 backdrop-blur-xl">
      <div className="mx-auto max-w-[1600px] px-3 sm:px-5 lg:px-7">
        <div className="flex min-h-[68px] items-center justify-between gap-3">
          <button type="button" onClick={() => navigate('landing')} className="group flex min-w-0 items-center gap-3 text-left" aria-label="Go to Project Conveyor home">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-gradient-to-br from-cyan-400/20 to-blue-500/10 text-cyan-300 shadow-lg shadow-cyan-950/30 transition group-hover:border-cyan-300/60">
              <Anchor className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-2">
                <span className="truncate text-sm font-extrabold tracking-[0.12em] text-white sm:text-base">SALIBUOY</span>
                <span className="hidden rounded-md border border-cyan-400/20 bg-cyan-400/10 px-1.5 py-0.5 text-[9px] font-bold tracking-widest text-cyan-200 sm:inline-flex">FIELD SYSTEMS</span>
              </span>
              <span className="hidden text-[10px] tracking-wide text-slate-400 sm:block">PROJECT CONVEYOR <span className="text-slate-600">/</span> OCEAN INTELLIGENCE</span>
            </span>
          </button>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <span className="hidden items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[10px] font-semibold tracking-wide text-emerald-300 xl:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> PLATFORM READY
            </span>
            <button type="button" onClick={() => setIsOppoModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-teal-400/25 bg-teal-400/10 px-2.5 py-2 text-xs font-semibold text-teal-200 transition hover:border-teal-300/50 hover:bg-teal-400/15 sm:px-3" title="Open field terminal simulator">
              <Smartphone className="h-4 w-4" /><span className="hidden sm:inline">Field terminal</span>
            </button>
            <button type="button" onClick={() => setIsSmsAlertsOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-2.5 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-400/10" title="Configure notification alerts">
              <Bell className="h-4 w-4" /><span className="hidden sm:inline">Alerts</span>
            </button>
            <button type="button" onClick={() => setIsMobileModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/70 px-2.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white" title="Open mobile access and QR guide">
              <QrCode className="h-4 w-4" /><span className="hidden md:inline">Mobile access</span>
            </button>
          </div>
        </div>

        <div className="flex min-h-12 items-center gap-2 border-t border-slate-800/70 py-2">
          <nav aria-label="Quick navigation" className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
            {quickLinks.map(id => {
              const item = navItems.find(entry => entry.id === id)!;
              const active = activeTab === id;
              return (
                <button key={id} type="button" onClick={() => navigate(id)} className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${active ? 'bg-cyan-400/10 text-cyan-200 ring-1 ring-inset ring-cyan-400/25' : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'}`}>
                  <span className="h-4 w-4 [&>svg]:h-4 [&>svg]:w-4">{item.icon}</span>{item.label}
                </button>
              );
            })}
          </nav>
          <div className="relative shrink-0">
            <button type="button" aria-expanded={isModulesOpen} aria-controls="conveyor-module-menu" onClick={() => setIsModulesOpen(value => !value)} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition ${isModulesOpen ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-200' : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:text-white'}`}>
              {isModulesOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}<span className="hidden sm:inline">All modules</span><span className="sm:hidden">Modules</span><ChevronDown className={`h-3.5 w-3.5 transition-transform ${isModulesOpen ? 'rotate-180' : ''}`} />
            </button>
            {isModulesOpen && (
              <div id="conveyor-module-menu" className="absolute right-0 top-[calc(100%+12px)] z-[70] max-h-[min(75vh,680px)] w-[min(92vw,760px)] overflow-y-auto rounded-2xl border border-slate-700/90 bg-[#0b1727] p-4 shadow-2xl shadow-black/50 sm:p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div><p className="text-sm font-bold text-white">Workspace modules</p><p className="mt-1 text-xs text-slate-400">Jump directly to a project area</p></div>
                  <span className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] font-mono text-slate-400">{filteredItems.length} MODULES</span>
                </div>
                <label className="mb-4 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 focus-within:border-cyan-400/50">
                  <Search className="h-4 w-4 shrink-0 text-slate-500" />
                  <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search modules..." className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500" />
                </label>
                <div className="grid gap-4 md:grid-cols-3">
                  {sections.map(section => {
                    const items = filteredItems.filter(item => item.section === section);
                    if (!items.length) return null;
                    return <section key={section}>
                      <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{section}</h3>
                      <div className="space-y-1">
                        {items.map(item => {
                          const active = activeTab === item.id;
                          return <button key={item.id} type="button" onClick={() => navigate(item.id)} className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition ${active ? 'bg-cyan-400/10 text-cyan-200 ring-1 ring-inset ring-cyan-400/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center text-slate-500 [&>svg]:h-4 [&>svg]:w-4">{item.icon}</span>
                            <span className="min-w-0 flex-1">{item.label}</span>
                            {item.badge && <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[8px] font-bold tracking-wide text-slate-500">{item.badge}</span>}
                          </button>;
                        })}
                      </div>
                    </section>;
                  })}
                </div>
                {filteredItems.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No modules match that search.</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileAccessModal isOpen={isMobileModalOpen} onClose={() => setIsMobileModalOpen(false)} onOpenOppoSimulator={() => setIsOppoModalOpen(true)} />
      <OppoA6xTerminalModal isOpen={isOppoModalOpen} onClose={() => setIsOppoModalOpen(false)} onOpenSmsAlerts={() => { setIsOppoModalOpen(false); setIsSmsAlertsOpen(true); }} />
      <SmsAlertsModal isOpen={isSmsAlertsOpen} onClose={() => setIsSmsAlertsOpen(false)} />
    </header>
  );
};
