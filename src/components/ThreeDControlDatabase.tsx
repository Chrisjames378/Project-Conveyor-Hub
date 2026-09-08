import React, { useState, useEffect, useRef } from 'react';
import { ThreeDSubsystem } from '../types';
import { 
  Box, 
  Layers, 
  RotateCcw, 
  Search, 
  Database, 
  Eye, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Download, 
  Cpu, 
  Anchor, 
  Crosshair, 
  Sliders, 
  Maximize2,
  RefreshCw,
  Wind,
  Fan,
  Snowflake,
  Waves,
  X,
  FileText,
  HelpCircle,
  BarChart3,
  Thermometer,
  Gauge
} from 'lucide-react';
import { downloadFile } from '../utils/exportUtils';

const INITIAL_3D_SUBSYSTEMS: ThreeDSubsystem[] = [
  {
    id: 'sub-01',
    name: 'Savonius Vertical Wind & Wave Turbine Rotor',
    partNo: 'SB-3D-WND-001',
    layerDepthMeters: -5,
    materialSpec: 'Carbon-Reinforced Aerodynamic Rotor Blades (316L Stainless Shaft)',
    status: 'Nominal',
    telemetryMetric: '680 Watts Wind Kinetic Output @ 42 RPM',
    pressureBar: 1.0,
    cadFileRef: 'CAD_SB_01_WIND_TURBINE_ROTOR.STEP',
    lastInspectionDate: '2026-08-15',
    rpm: 42,
    plumeVelocityMs: 0.0,
    iceYieldTonsPerDay: 0.0,
    physicsFormula: 'P = 0.5 * ρ_air * A * v^3 * Cp (Cp = 0.38 Savonius Limit)',
    subsystemCategory: 'Wind Turbine & Surface Rotor',
    description: 'Polar-grade vertical-axis wind turbine engineered to harvest 15-45 knot surface Antarctic winds even in severe icing conditions.'
  },
  {
    id: 'sub-02',
    name: 'Subsea Impeller Water Turbine & Ceramic Drive',
    partNo: 'SB-3D-TRB-002',
    layerDepthMeters: 200,
    materialSpec: 'Alumina Ceramic Impellers + Magnetically Coupled Shaft Drive',
    status: 'Active Pumping',
    telemetryMetric: '280 L/min Subsea Downward Flow @ 120 RPM',
    pressureBar: 20.4,
    cadFileRef: 'CAD_SB_02_SUBSEA_WATER_TURBINE.STEP',
    lastInspectionDate: '2026-08-28',
    rpm: 120,
    plumeVelocityMs: 2.8,
    iceYieldTonsPerDay: 1420,
    physicsFormula: 'Q = η * (T_rotor * ω) / (ΔP_hydrostatic)',
    subsystemCategory: 'Subsea Impeller Turbine',
    description: 'High-torque subsea water turbine driven directly by surface wind/wave torque to pump concentrated 45.0 PSU brine downwards.'
  },
  {
    id: 'sub-03',
    name: 'Downward Dense Brine Plume Jet Array',
    partNo: 'SB-3D-PLM-003',
    layerDepthMeters: 500,
    materialSpec: 'Hydro-Nozzle Assembly (Provisional Patent IPONZ 782194)',
    status: 'Active Pumping',
    telemetryMetric: '3.4 m/s Downwelling Velocity @ 1052 kg/m³ Density',
    pressureBar: 51.0,
    cadFileRef: 'CAD_SB_03_DOWNWARD_PLUME_NOZZLE.STEP',
    lastInspectionDate: '2026-09-01',
    rpm: 0,
    plumeVelocityMs: 3.4,
    iceYieldTonsPerDay: 1850,
    physicsFormula: 'F_buoyancy = (ρ_brine - ρ_ocean) * g * V_injected (Forced Downward Plume)',
    subsystemCategory: 'Plume Diffuser',
    description: 'Creates a heavy downward plume column that breaks through surface thermal stratification and forces convective oceanic sinking.'
  },
  {
    id: 'sub-04',
    name: 'Cryo-Restoration Sea Ice Crust Generator',
    partNo: 'SB-3D-ICE-004',
    layerDepthMeters: 0,
    materialSpec: 'Surface Nucleation Spray Ring + Hydro-Saline Chiller Collar',
    status: 'Nominal',
    telemetryMetric: '1,420 Tons/Day Re-frozen Polar Sea Ice Yield',
    pressureBar: 1.0,
    cadFileRef: 'CAD_SB_04_CRYO_ICE_GENERATOR.STEP',
    lastInspectionDate: '2026-09-02',
    rpm: 18,
    plumeVelocityMs: 0.0,
    iceYieldTonsPerDay: 1420,
    physicsFormula: 'dM_ice/dt = (Q_cooling + ΔS_freezing) / L_fusion',
    subsystemCategory: 'Wind Turbine & Surface Rotor',
    description: 'Forces accelerated sea ice freezing at the polar ocean interface by extracting low-salinity meltwater and accelerating thermohaline exchange.'
  },
  {
    id: 'sub-05',
    name: 'Grade 5 Titanium Pressure Hull Assembly',
    partNo: 'SB-3D-HUL-005',
    layerDepthMeters: 50,
    materialSpec: 'Ti-6Al-4V Titanium Alloy (O-Ring Fluoropolymer Seals)',
    status: 'Nominal',
    telemetryMetric: '500m Depth Structural Rating (Safety Factor 2.4)',
    pressureBar: 50.8,
    cadFileRef: 'CAD_SB_05_TITANIUM_HULL.STEP',
    lastInspectionDate: '2026-08-22',
    rpm: 0,
    plumeVelocityMs: 0.0,
    iceYieldTonsPerDay: 0.0,
    physicsFormula: 'σ_hoop = P * r / t < σ_yield (Ti-6Al-4V = 880 MPa)',
    subsystemCategory: 'Titanium Hull',
    description: 'Corrosion-resistant titanium pressure hull shielding central energy, telemetry, and autonomous sensor electronics at 50 Bar pressure.'
  },
  {
    id: 'sub-06',
    name: '24V 2.4kWh LiFePO4 Energy & Power Core',
    partNo: 'SB-3D-PWR-006',
    layerDepthMeters: 100,
    materialSpec: 'IP68 Potting Compound in Thermal Aluminum Casing',
    status: 'Nominal',
    telemetryMetric: '96% Charge Level (25.4V State-of-Charge)',
    pressureBar: 10.2,
    cadFileRef: 'CAD_SB_06_POWER_CORE.STEP',
    lastInspectionDate: '2026-08-25',
    rpm: 0,
    plumeVelocityMs: 0.0,
    iceYieldTonsPerDay: 0.0,
    physicsFormula: 'E_stored = V * Ah = 24V * 100Ah = 2400 Wh',
    subsystemCategory: 'Energy Core',
    description: 'Subsea battery pack balancing peak turbine power surges and powering continuous Iridium satellite satellite telemetry.'
  },
  {
    id: 'sub-07',
    name: 'Kevlar Mooring Cable & Acoustic Release Shackle',
    partNo: 'SB-3D-MRG-007',
    layerDepthMeters: 1000,
    materialSpec: 'Aramid Kevlar Core + 200kHz Acoustic Transponder',
    status: 'Nominal',
    telemetryMetric: '3.2 Tons Tether Tension @ 1000m Seabed Anchor',
    pressureBar: 101.5,
    cadFileRef: 'CAD_SB_07_ACOUSTIC_MOORING.STEP',
    lastInspectionDate: '2026-09-03',
    rpm: 0,
    plumeVelocityMs: 0.0,
    iceYieldTonsPerDay: 0.0,
    physicsFormula: 'T_tether = F_drag + F_buoyancy + F_wave',
    subsystemCategory: 'Mooring Anchor',
    description: 'Seabed anchoring system with acoustic trigger for autonomous surface retrieval during severe sub-Antarctic ice storms.'
  }
];

export const ThreeDControlDatabase: React.FC = () => {
  const [subsystems, setSubsystems] = useState<ThreeDSubsystem[]>(INITIAL_3D_SUBSYSTEMS);
  const [selectedSubsystemId, setSelectedSubsystemId] = useState<string>('sub-01');
  const [modalSubsystem, setModalSubsystem] = useState<ThreeDSubsystem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 3D Canvas rendering controls
  const [rotationX, setRotationX] = useState(22);
  const [rotationY, setRotationY] = useState(35);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isExplodedView, setIsExplodedView] = useState(false);
  const [renderMode, setRenderMode] = useState<'solid' | 'wireframe' | 'plume' | 'ice'>('plume');

  // Interactive Ice Yield Simulation Parameters
  const [deployedBuoyCount, setDeployedBuoyCount] = useState<number>(25);
  const [windTurbineRpm, setWindTurbineRpm] = useState<number>(45);
  const [brinePumpingLpm, setBrinePumpingLpm] = useState<number>(280);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  const activeSubsystem = subsystems.find(s => s.id === selectedSubsystemId) || subsystems[0];

  // Calculated Sea Ice & Plume Metrics
  const dailyIceYieldPerBuoyTons = Math.round((windTurbineRpm / 45) * (brinePumpingLpm / 280) * 1420);
  const totalFleetDailyIceTons = dailyIceYieldPerBuoyTons * deployedBuoyCount;
  const annualFleetIceMegatons = (totalFleetDailyIceTons * 365) / 1000000;
  const iceAreaSqKmRestored = (annualFleetIceMegatons * 1.08).toFixed(1); // Assuming ~1.2m average polar ice thickness
  const plumeVelocityMs = ((windTurbineRpm / 45) * 3.4).toFixed(1);
  const amocStabilizationIndex = Math.min(100, (deployedBuoyCount / 200) * 100).toFixed(1);

  // Auto rotation timer
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setRotationY(prev => (prev + 1.2) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // 3D Canvas Drawing Engine (Windmill, Water Turbine, Downward Plume, Sea Ice)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particleTime = 0;

    const renderFrame = () => {
      particleTime += 0.05;
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2 - 20;

      const radX = (rotationX * Math.PI) / 180;
      const radY = (rotationY * Math.PI) / 180;

      // 3D Perspective Projection
      const project = (x: number, y: number, z: number) => {
        let x1 = x * Math.cos(radY) - z * Math.sin(radY);
        let z1 = x * Math.sin(radY) + z * Math.cos(radY);

        let y2 = y * Math.cos(radX) - z1 * Math.sin(radX);
        let z2 = y * Math.sin(radX) + z1 * Math.cos(radX);

        const scale = 270 / (270 + z2 * 0.45);
        return {
          px: cx + x1 * scale,
          py: cy + y2 * scale,
          scale,
          depth: z2
        };
      };

      // 0. Render Sea Ice Crust Layer at Top (-2m to 0m)
      const iceRadius = 140;
      ctx.fillStyle = renderMode === 'wireframe' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(224, 242, 254, 0.25)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let a = 0; a <= 360; a += 20) {
        const ar = (a * Math.PI) / 180;
        const pt = project(Math.cos(ar) * iceRadius, -140, Math.sin(ar) * iceRadius);
        if (a === 0) ctx.moveTo(pt.px, pt.py);
        else ctx.lineTo(pt.px, pt.py);
      }
      ctx.stroke();
      ctx.fill();

      // Label for Sea Ice Crust
      const icePt = project(iceRadius + 10, -140, 0);
      ctx.fillStyle = '#7dd3fc';
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.fillText('Polar Sea Ice Crust (-2m)', icePt.px + 10, icePt.py);

      // Explode gap spacing multiplier
      const explodeGap = isExplodedView ? 40 : 0;

      // 1. Render Windmill / Wind Turbine Rotor (Top Module: yOffset = -130)
      const windY = -130 - explodeGap * 3;
      const windRotorAngle = particleTime * (windTurbineRpm / 10);

      // Windmill Tower Mast
      const pWindBase = project(0, windY, 0);
      const pWindTop = project(0, windY - 45, 0);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(pWindBase.px, pWindBase.py);
      ctx.lineTo(pWindTop.px, pWindTop.py);
      ctx.stroke();

      // Windmill Blades (3 Blades spaced 120 deg)
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2.5;
      for (let b = 0; b < 3; b++) {
        const bladeAngle = windRotorAngle + (b * 120 * Math.PI) / 180;
        const bx = Math.cos(bladeAngle) * 45;
        const bz = Math.sin(bladeAngle) * 45;
        const pBladeTip = project(bx, windY - 45, bz);

        ctx.beginPath();
        ctx.moveTo(pWindTop.px, pWindTop.py);
        ctx.lineTo(pBladeTip.px, pBladeTip.py);
        ctx.stroke();

        // Blade Aerofoil Tip
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(pBladeTip.px, pBladeTip.py, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Render Subsea Water Impeller Turbine (yOffset = 30)
      const turbineY = 30 - explodeGap * 1;
      const turbineAngle = -particleTime * (windTurbineRpm / 12);
      const pTurbineCenter = project(0, turbineY, 0);

      // Water Turbine Housing Ring
      ctx.strokeStyle = '#14b8a6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let a = 0; a <= 360; a += 30) {
        const ar = (a * Math.PI) / 180;
        const pt = project(Math.cos(ar) * 40, turbineY, Math.sin(ar) * 40);
        if (a === 0) ctx.moveTo(pt.px, pt.py);
        else ctx.lineTo(pt.px, pt.py);
      }
      ctx.stroke();

      // Rotating Impeller Blades (4 Blades spaced 90 deg)
      for (let b = 0; b < 4; b++) {
        const bAngle = turbineAngle + (b * 90 * Math.PI) / 180;
        const bx = Math.cos(bAngle) * 35;
        const bz = Math.sin(bAngle) * 35;
        const pBladeTip = project(bx, turbineY, bz);

        ctx.strokeStyle = '#2dd4bf';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pTurbineCenter.px, pTurbineCenter.py);
        ctx.lineTo(pBladeTip.px, pBladeTip.py);
        ctx.stroke();
      }

      // 3. Render ANIMATED Downward Dense Brine Water Plume Simulation
      const plumeStartY = turbineY + 15;
      const plumeEndY = 180 + explodeGap * 2.5;

      ctx.lineWidth = 1.5;
      for (let i = 0; i < 40; i++) {
        const progress = ((particleTime * 1.5 + i * 0.08) % 1.0);
        const curY = plumeStartY + progress * (plumeEndY - plumeStartY);
        const curRadius = 15 + progress * 35; // Expands as it sinks
        const opacity = 1.0 - progress * 0.7;

        // Spiral angle for plume rotation
        const spiralA = progress * Math.PI * 6 + particleTime;
        const px = Math.cos(spiralA) * curRadius;
        const pz = Math.sin(spiralA) * curRadius;

        const pPlumePt = project(px, curY, pz);

        ctx.fillStyle = `rgba(20, 184, 166, ${opacity})`;
        ctx.beginPath();
        ctx.arc(pPlumePt.px, pPlumePt.py, 2.5 + progress * 2, 0, Math.PI * 2);
        ctx.fill();

        // Downward Vector Arrow Line
        if (i % 6 === 0) {
          const pPlumeNext = project(px, curY + 12, pz);
          ctx.strokeStyle = `rgba(56, 189, 248, ${opacity * 0.8})`;
          ctx.beginPath();
          ctx.moveTo(pPlumePt.px, pPlumePt.py);
          ctx.lineTo(pPlumeNext.px, pPlumeNext.py);
          ctx.stroke();
        }
      }

      // Downward Plume Label
      const pPlumeLabel = project(55, plumeStartY + 60, 0);
      ctx.fillStyle = '#2dd4bf';
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.fillText(`Downward Brine Plume (${plumeVelocityMs} m/s)`, pPlumeLabel.px + 10, pPlumeLabel.py);

      // Render Static Hardware Cylinder Modules
      const layers = [
        { id: 'sub-01', yOffset: windY, radius: 40, height: 20, color: '#38bdf8', label: 'Wind Turbine Mast' },
        { id: 'sub-05', yOffset: -50 - explodeGap * 2, radius: 55, height: 50, color: '#94a3b8', label: 'Titanium Pressure Hull' },
        { id: 'sub-06', yOffset: 0 - explodeGap * 1.5, radius: 50, height: 35, color: '#10b981', label: 'LiFePO4 Power Core' },
        { id: 'sub-02', yOffset: turbineY, radius: 45, height: 35, color: '#14b8a6', label: 'Subsea Water Turbine' },
        { id: 'sub-03', yOffset: 95 + explodeGap * 0.5, radius: 35, height: 45, color: '#38bdf8', label: 'Downward Jet Nozzle' },
        { id: 'sub-07', yOffset: 160 + explodeGap * 2, radius: 15, height: 50, color: '#a855f7', label: '1000m Mooring Cable' },
      ];

      layers.forEach((layer) => {
        const isSelected = layer.id === selectedSubsystemId;
        const topY = layer.yOffset - layer.height / 2;
        const botY = layer.yOffset + layer.height / 2;

        ctx.lineWidth = isSelected ? 2.5 : 1.2;
        ctx.strokeStyle = isSelected ? '#38bdf8' : renderMode === 'wireframe' ? '#0ea5e9' : layer.color;

        // Top Ring
        ctx.beginPath();
        for (let a = 0; a <= 360; a += 20) {
          const ar = (a * Math.PI) / 180;
          const pt = project(Math.cos(ar) * layer.radius, topY, Math.sin(ar) * layer.radius);
          if (a === 0) ctx.moveTo(pt.px, pt.py);
          else ctx.lineTo(pt.px, pt.py);
        }
        ctx.stroke();

        if (renderMode === 'solid' || renderMode === 'plume' || renderMode === 'ice') {
          ctx.fillStyle = isSelected ? 'rgba(56, 189, 248, 0.25)' : 'rgba(15, 23, 42, 0.65)';
          ctx.fill();
        }

        // Bottom Ring
        ctx.beginPath();
        for (let a = 0; a <= 360; a += 20) {
          const ar = (a * Math.PI) / 180;
          const pt = project(Math.cos(ar) * layer.radius, botY, Math.sin(ar) * layer.radius);
          if (a === 0) ctx.moveTo(pt.px, pt.py);
          else ctx.lineTo(pt.px, pt.py);
        }
        ctx.stroke();

        // Connect Vertical Edges
        [0, 90, 180, 270].forEach((angle) => {
          const ar = (angle * Math.PI) / 180;
          const pTop = project(Math.cos(ar) * layer.radius, topY, Math.sin(ar) * layer.radius);
          const pBot = project(Math.cos(ar) * layer.radius, botY, Math.sin(ar) * layer.radius);
          ctx.beginPath();
          ctx.moveTo(pTop.px, pTop.py);
          ctx.lineTo(pBot.px, pBot.py);
          ctx.stroke();
        });

        // Clickable Hotspot Pin
        const pCenter = project(layer.radius + 15, layer.yOffset, 0);
        ctx.fillStyle = isSelected ? '#38bdf8' : layer.color;
        ctx.beginPath();
        ctx.arc(pCenter.px, pCenter.py, isSelected ? 6 : 4, 0, Math.PI * 2);
        ctx.fill();

        if (isSelected || isExplodedView) {
          ctx.strokeStyle = isSelected ? '#38bdf8' : 'rgba(148, 163, 184, 0.4)';
          ctx.beginPath();
          ctx.moveTo(pCenter.px, pCenter.py);
          ctx.lineTo(pCenter.px + 25, pCenter.py - 10);
          ctx.stroke();

          ctx.font = '10px JetBrains Mono, monospace';
          ctx.fillStyle = isSelected ? '#38bdf8' : '#cbd5e1';
          ctx.fillText(layer.label, pCenter.px + 30, pCenter.py - 8);
        }
      });
    };

    renderFrame();
  }, [rotationX, rotationY, isExplodedView, renderMode, selectedSubsystemId, windTurbineRpm, brinePumpingLpm]);

  // Mouse Orbit Drag Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    setIsAutoRotating(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;

    setRotationY(prev => (prev + dx * 0.5) % 360);
    setRotationX(prev => Math.max(-60, Math.min(60, prev + dy * 0.5)));

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const filteredSubsystems = subsystems.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.partNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.materialSpec.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const export3DDatabaseCSV = () => {
    const headers = ['Part Number', 'Subsystem Name', 'Layer Depth (m)', 'Material Spec', 'Status', 'Telemetry Metric', 'Pressure (Bar)', 'CAD Reference', 'RPM', 'Plume Velocity (m/s)', 'Daily Ice Yield (Tons)'];
    const rows = subsystems.map(s => [
      `"${s.partNo}"`,
      `"${s.name}"`,
      s.layerDepthMeters,
      `"${s.materialSpec}"`,
      `"${s.status}"`,
      `"${s.telemetryMetric}"`,
      s.pressureBar,
      `"${s.cadFileRef}"`,
      s.rpm || 0,
      s.plumeVelocityMs || 0,
      s.iceYieldTonsPerDay || 0
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    downloadFile(csvContent, 'SaliBuoy_3D_Turbine_Plume_Ice_Control_Database.csv', 'text/csv');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950 border border-slate-800 rounded-2xl p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
              <Wind className="w-4 h-4 text-sky-400" />
              <span>Wind Turbine • Subsea Impeller • Downward Plume • Sea Ice Yield</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              3D CAD Control Database & Sea Ice Yield Simulator
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              3D interactive digital twin rendering surface wind turbine rotors, subsea ceramic impellers, downward high-density water plume streams, and polar sea ice restoration yields.
            </p>
          </div>

          <button
            onClick={export3DDatabaseCSV}
            className="inline-flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-mono cursor-pointer transition-colors self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Export CAD & Ice Yield CSV</span>
          </button>
        </div>
      </div>

      {/* Live Sea Ice Restoration Yield Metrics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
            <Snowflake className="w-3.5 h-3.5 text-sky-400" />
            <span>Daily Fleet Ice Yield</span>
          </div>
          <div className="text-lg sm:text-xl font-bold text-sky-300">
            {totalFleetDailyIceTons.toLocaleString()} <span className="text-xs text-slate-400">Tons/Day</span>
          </div>
          <span className="text-[10px] text-slate-500 block">{deployedBuoyCount} Active SaliBuoy Units</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span>Annual Sea Ice Restored</span>
          </div>
          <div className="text-lg sm:text-xl font-bold text-teal-300">
            {annualFleetIceMegatons.toFixed(2)} <span className="text-xs text-slate-400">Megatons</span>
          </div>
          <span className="text-[10px] text-slate-500 block">~{iceAreaSqKmRestored} sq km area (@1.2m)</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
            <Waves className="w-3.5 h-3.5 text-emerald-400" />
            <span>Downward Plume Velocity</span>
          </div>
          <div className="text-lg sm:text-xl font-bold text-emerald-400">
            {plumeVelocityMs} <span className="text-xs text-slate-400">m/s</span>
          </div>
          <span className="text-[10px] text-slate-500 block">@ 1052 kg/m³ Density Jet</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
            <Gauge className="w-3.5 h-3.5 text-purple-400" />
            <span>AMOC Downwelling Index</span>
          </div>
          <div className="text-lg sm:text-xl font-bold text-purple-300">
            +{amocStabilizationIndex}% <span className="text-xs text-slate-400">Restored</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Sub-Antarctic & Greenland Basin</span>
        </div>
      </div>

      {/* Interactive Sea Ice & Plume Simulation Parameters Slider Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-sky-400 border-b border-slate-800 pb-3">
          <Sliders className="w-4 h-4" />
          <span>Sea Ice Formation & Plume Physics Simulation Controls</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          {/* Slider 1: Deployed Buoy Fleet Size */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-slate-300">Deployed Buoys: <span className="text-sky-400 font-bold">{deployedBuoyCount} Units</span></label>
              <span className="text-slate-500 text-[10px]">Max 200</span>
            </div>
            <input
              type="range"
              min="1"
              max="200"
              value={deployedBuoyCount}
              onChange={(e) => setDeployedBuoyCount(parseInt(e.target.value))}
              className="w-full accent-sky-500 bg-slate-950 cursor-pointer"
            />
          </div>

          {/* Slider 2: Wind Speed & Windmill Rotor RPM */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-slate-300">Wind Turbine Speed: <span className="text-teal-400 font-bold">{windTurbineRpm} RPM</span></label>
              <span className="text-slate-500 text-[10px]">10-120 RPM</span>
            </div>
            <input
              type="range"
              min="10"
              max="120"
              value={windTurbineRpm}
              onChange={(e) => setWindTurbineRpm(parseInt(e.target.value))}
              className="w-full accent-teal-500 bg-slate-950 cursor-pointer"
            />
          </div>

          {/* Slider 3: Subsea Brine Impeller Pumping Rate */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-slate-300">Brine Flow Rate: <span className="text-emerald-400 font-bold">{brinePumpingLpm} L/min</span></label>
              <span className="text-slate-500 text-[10px]">50-500 L/min</span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              value={brinePumpingLpm}
              onChange={(e) => setBrinePumpingLpm(parseInt(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-950 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Main 3D Canvas & Subsystem Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive 3D Canvas Viewer (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
              <Crosshair className="w-4 h-4 text-sky-400" />
              <span>3D Digital Twin Viewport (Windmill + Water Turbine + Downward Plume)</span>
            </div>

            {/* View Controls */}
            <div className="flex items-center space-x-2 text-xs font-mono">
              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                  isAutoRotating ? 'bg-sky-950 text-sky-300 border-sky-800' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                Auto-Rotate
              </button>

              <button
                onClick={() => setIsExplodedView(!isExplodedView)}
                className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                  isExplodedView ? 'bg-purple-950 text-purple-300 border-purple-800' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                Exploded CAD
              </button>
            </div>
          </div>

          {/* Canvas Render Box */}
          <div 
            className="relative w-full aspect-square max-h-[480px] bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden cursor-grab active:cursor-grabbing flex items-center justify-center"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <canvas
              ref={canvasRef}
              width={520}
              height={480}
              className="w-full h-full object-contain"
            />

            {/* Overlay Rendering Mode Selector */}
            <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 bg-slate-900/90 backdrop-blur p-1 rounded-lg border border-slate-800 text-[10px] font-mono">
              <button
                onClick={() => setRenderMode('plume')}
                className={`px-2 py-1 rounded transition-colors ${renderMode === 'plume' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Downward Plume
              </button>
              <button
                onClick={() => setRenderMode('solid')}
                className={`px-2 py-1 rounded transition-colors ${renderMode === 'solid' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Solid Hydro
              </button>
              <button
                onClick={() => setRenderMode('wireframe')}
                className={`px-2 py-1 rounded transition-colors ${renderMode === 'wireframe' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                CAD Wireframe
              </button>
            </div>

            <div className="absolute top-3 right-3 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
              Drag Orbit • Yaw: {Math.round(rotationY)}° Pitch: {Math.round(rotationX)}°
            </div>
          </div>

          <p className="text-[11px] text-slate-400 font-mono text-center">
            💡 Click any component in the list to trigger the <strong>Interactive 3D CAD Modal</strong> with full physics schematics.
          </p>
        </div>

        {/* Right Column: Database Subsystem Inspector (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-xs font-mono text-sky-400">
                <Database className="w-4 h-4" />
                <span>Component Database Inspector</span>
              </div>

              <button
                onClick={() => setModalSubsystem(activeSubsystem)}
                className="inline-flex items-center space-x-1 text-[10px] font-mono font-bold text-sky-300 bg-sky-950 border border-sky-800 px-2.5 py-1 rounded-lg hover:bg-sky-900 cursor-pointer"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Open 3D Modal</span>
              </button>
            </div>

            {/* Active Component Deep Dive Card */}
            <div className="bg-slate-950 p-4 rounded-xl border border-sky-900/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-sky-400 px-2 py-0.5 rounded bg-sky-950 border border-sky-800">
                  {activeSubsystem.partNo}
                </span>
                <span className="text-[10px] font-mono text-slate-400">Depth: {activeSubsystem.layerDepthMeters}m</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white leading-snug">{activeSubsystem.name}</h3>
                <p className="text-xs text-slate-400 font-mono mt-1">{activeSubsystem.materialSpec}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Status</span>
                  <span className="text-emerald-400 font-bold">{activeSubsystem.status}</span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Hydro Pressure</span>
                  <span className="text-slate-200 font-bold">{activeSubsystem.pressureBar} Bar</span>
                </div>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1 text-xs font-mono">
                <span className="text-slate-500 text-[10px] block">Live Telemetry & Impact Metric</span>
                <span className="text-teal-300 font-bold">{activeSubsystem.telemetryMetric}</span>
              </div>

              {activeSubsystem.physicsFormula && (
                <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800 text-[10px] font-mono text-sky-300">
                  <span className="text-slate-500 block text-[9px] uppercase">Governing Physics Equation</span>
                  <code>{activeSubsystem.physicsFormula}</code>
                </div>
              )}
            </div>

            {/* Search Filter input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search wind turbines, impellers, plume nozzles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            {/* Component Database List */}
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {filteredSubsystems.map((sub) => {
                const isSelected = sub.id === selectedSubsystemId;
                return (
                  <div
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubsystemId(sub.id);
                      setModalSubsystem(sub);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                      isSelected 
                        ? 'bg-sky-950/40 border-sky-500 text-white' 
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center space-x-1.5">
                        <span>{sub.name}</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">{sub.partNo} • Layer {sub.layerDepthMeters}m</div>
                    </div>

                    <span className="text-[10px] font-mono font-bold text-teal-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                      3D Modal
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Interactive 3D Modal Overlay */}
      {modalSubsystem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2 text-xs font-mono text-sky-400">
                  <Box className="w-4 h-4" />
                  <span>3D Subsystem Modal Inspection • {modalSubsystem.partNo}</span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">{modalSubsystem.name}</h3>
              </div>

              <button
                onClick={() => setModalSubsystem(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="space-y-4 font-mono text-xs">
              <p className="text-slate-300 leading-relaxed text-sm">
                {modalSubsystem.description}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] block uppercase">Material Grade</span>
                  <span className="text-white font-bold">{modalSubsystem.materialSpec}</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] block uppercase">Depth & Hydro Pressure</span>
                  <span className="text-sky-300 font-bold">{modalSubsystem.layerDepthMeters}m Depth • {modalSubsystem.pressureBar} Bar</span>
                </div>
              </div>

              {modalSubsystem.physicsFormula && (
                <div className="bg-slate-950 p-3 rounded-xl border border-sky-900/60 space-y-1">
                  <span className="text-sky-400 text-[10px] block uppercase font-bold">Hydrodynamic Physics Governing Formula</span>
                  <code className="text-teal-300 text-xs block bg-slate-900 p-2 rounded border border-slate-800 font-mono">
                    {modalSubsystem.physicsFormula}
                  </code>
                </div>
              )}

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <span className="text-slate-500 text-[10px] block uppercase">Live Telemetry & Sea Ice Impact</span>
                <div className="flex items-center justify-between text-sm font-bold text-emerald-400">
                  <span>{modalSubsystem.telemetryMetric}</span>
                  {modalSubsystem.iceYieldTonsPerDay ? (
                    <span className="text-sky-300 text-xs">{modalSubsystem.iceYieldTonsPerDay} Tons Ice/Day</span>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span>CAD Reference: <strong>{modalSubsystem.cadFileRef}</strong></span>
                <span>Last Inspection: <strong>{modalSubsystem.lastInspectionDate}</strong></span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setModalSubsystem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono font-bold cursor-pointer transition-colors"
              >
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
