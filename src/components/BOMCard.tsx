import { Shield, Battery, Sparkles, Layers } from 'lucide-react';
import { BOMItem } from '../types';

const BOM_ITEMS: BOMItem[] = [
  {
    id: 'skeleton',
    name: 'Super Duplex Stainless Steel (S32750)',
    spec: 'Structural Skeleton & Rotating Blades',
    description: 'A dual-phase austenitic-ferritic steel with high chromium, molybdenum, and nitrogen contents specifically designed for intense structural load points in highly corrosive arctic sea water.',
    advantage: 'Maintains exceptional fracture toughness and mechanical ductility at -50°C and completely prevents crevice/pitting degradation caused by continuous hyper-saline brine jet stream injection.',
    iconName: 'Shield',
  },
  {
    id: 'coating',
    name: 'Self-Healing Fluorinated Copolymer Skin',
    spec: 'Hull Protection Layer & Subsurface Cowling',
    description: 'A 5cm thick polymer composite composed of a specialized p-PVDF-HFP matrix that wraps around the main steel cylinders and subsurface compartments.',
    advantage: 'Leverages reversible dipole-dipole physical interactions to autonomously flow back and reseal surface cuts, abrasions, and fissures caused by high-impact collisions with drifting ice growlers.',
    iconName: 'Layers',
  },
  {
    id: 'glaze',
    name: 'Nano-Ceramic Anti-Fouling Glaze',
    spec: 'Thermal Mitigation & Turbine assembly',
    description: 'An ultra-hydrophobic nanostructured coating chemically bonded to the surface vertical-axis turbine blades and upper superstructure brackets.',
    advantage: 'Restricts freezing sea spray, pack ice, and sub-zero moisture from crystallizing or bonding to moving turbine shafts, keeping system aerodynamic efficiencies stable in severe blizzard events.',
    iconName: 'Sparkles',
  },
  {
    id: 'battery',
    name: 'Solid-State Sodium-Ion Battery Array',
    spec: 'Power Cell Storage & Thermal Buffers',
    description: 'High-density dry sodium-electrode storage modules integrated directly into the core insulated bulkhead cavities of the Sali-Buoy cylinder.',
    advantage: 'Eliminates dangerous, flammable organic liquid solvents. Provides consistent thermal and voltage outputs in deep polar freeze environments where lithium-ion batteries suffer severe capacity loss.',
    iconName: 'Battery',
  },
];

const ICONS: Record<string, typeof Shield> = {
  Shield: Shield,
  Layers: Layers,
  Sparkles: Sparkles,
  Battery: Battery,
};

export default function BOMCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {BOM_ITEMS.map((item) => {
        const IconComponent = ICONS[item.iconName] || Shield;
        return (
          <div
            key={item.id}
            id={`bom-item-${item.id}`}
            className="group relative flex flex-col justify-between bg-slate-950/90 hover:bg-slate-900/40 border border-slate-600/80 hover:border-sky-400 rounded-lg p-4 transition-all duration-200 shadow-xl overflow-hidden"
          >
            {/* Ambient Background Glow on Hover */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-all duration-200" />

            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="p-2 bg-slate-900 rounded border border-slate-500/50 text-sky-400 group-hover:text-sky-300 group-hover:border-sky-400 transition-all">
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className="font-mono text-[8px] uppercase tracking-wider bg-slate-900 text-slate-400 border border-slate-600 px-1.5 py-0.5 rounded">
                  PARTICULARS SPECIFIED
                </span>
              </div>

              {/* Title & Specs */}
              <h4 className="font-display text-sm font-bold text-slate-100 mb-0.5 tracking-tighter group-hover:text-white">
                {item.name}
              </h4>
              <p className="font-mono text-[9px] text-sky-400 uppercase tracking-widest mb-2">
                {item.spec}
              </p>

              {/* Description */}
              <div className="text-[11px] text-slate-300 leading-snug mb-3">
                <p>{item.description}</p>
              </div>
            </div>

            {/* Tactical Advantage Box */}
            <div className="bg-slate-900/90 rounded border border-slate-600/70 p-2.5 mt-auto">
              <span className="font-mono text-[8px] text-emerald-400 uppercase font-bold tracking-widest block mb-0.5">
                KINETIC & CORROSION ADVANTAGE //
              </span>
              <p className="text-[10px] text-slate-400 leading-snug font-sans">
                {item.advantage}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
