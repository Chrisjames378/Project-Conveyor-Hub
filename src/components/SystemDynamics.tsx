import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  LineChart, 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  Activity, 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  Thermometer, 
  Zap, 
  Droplets, 
  Maximize2,
  Anchor,
  Cpu,
  TrendingDown,
  TrendingUp,
  Award
} from 'lucide-react';

// Schematic Image Path from generation tool
const SCHEMATIC_IMAGE_PATH = "/src/assets/images/salibuoy_schematic_1790259416815.jpg";

interface SimulationPoint {
  year: number;
  baselineSv: number;
  moderateSv: number;
  customSv: number;
  geoscaleSv: number;
  densityAnomalyBaseline: number;
  densityAnomalyCustom: number;
  heatTransportPW: number;
}

export const SystemDynamics: React.FC = () => {
  // Simulation Parameter Controls
  const [fleetSize, setFleetSize] = useState<number>(250); // 0 to 500 units
  const [salinityDeltaPsu, setSalinityDeltaPsu] = useState<number>(8.5); // 0 to 12 PSU
  const [startYear, setStartYear] = useState<number>(2028); // 2026 to 2040
  const [warmingFactor, setWarmingFactor] = useState<number>(1.2); // 0.8x to 2.0x warming trajectory

  // Animation Controls
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentAnimYear, setCurrentAnimYear] = useState<number>(2076);
  const [hoveredPoint, setHoveredPoint] = useState<SimulationPoint | null>(null);

  // Scenario Visibility Toggle
  const [showBaseline, setShowBaseline] = useState<boolean>(true);
  const [showModerate, setShowModerate] = useState<boolean>(true);
  const [showCustom, setShowCustom] = useState<boolean>(true);
  const [showGeoscale, setShowGeoscale] = useState<boolean>(true);

  // Selected Hotspot for Hull Schematic
  const [activeHotspot, setActiveHotspot] = useState<string>('cooling');

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Calculate 50-Year Simulation Data (2026 to 2076)
  const simulationData: SimulationPoint[] = useMemo(() => {
    const data: SimulationPoint[] = [];
    const baseYear = 2026;
    const totalYears = 50;

    const nominalSv = 17.8; // Nominal historical AMOC strength in Sverdrups

    for (let i = 0; i <= totalYears; i++) {
      const year = baseYear + i;
      const t = i / totalYears; // normalized time 0 to 1

      // Melt freshening forcing (exponential decay of baseline flow without intervention)
      const meltForcing = Math.pow(t, 1.4) * 11.2 * warmingFactor;
      const baselineSv = Math.max(5.2, nominalSv - meltForcing - (year > 2042 ? (year - 2042) * 0.12 : 0));

      // 100 Buoys Moderate Scenario (Starts 2029)
      const modEffort = year >= 2029 ? Math.min(1, (year - 2029) / 8) : 0;
      const moderateSv = Math.min(18.2, baselineSv + modEffort * 4.8);

      // Custom User Configuration Scenario
      const customEffort = year >= startYear ? Math.min(1, (year - startYear) / 6) : 0;
      const customInjectionPower = (fleetSize / 250) * (salinityDeltaPsu / 8.5) * 8.4;
      const customSv = Math.min(19.0, Math.max(baselineSv, baselineSv + customEffort * customInjectionPower));

      // Geo-scale Fleet Scenario (500 Buoys, Starts 2027)
      const geoEffort = year >= 2027 ? Math.min(1, (year - 2027) / 5) : 0;
      const geoscaleSv = Math.min(18.8, baselineSv + geoEffort * 10.5);

      // Subsurface Density Anomaly Delta rho (kg/m3 relative to baseline freshwater)
      const densityAnomalyBaseline = 1027.4 - (meltForcing * 0.18);
      const densityAnomalyCustom = densityAnomalyBaseline + (customSv - baselineSv) * 0.22;

      // Ocean Heat Transport in Petawatts (PW, nominal ~1.3 PW)
      const heatTransportPW = Math.max(0.3, (customSv / 17.8) * 1.32);

      data.push({
        year,
        baselineSv: Number(baselineSv.toFixed(2)),
        moderateSv: Number(moderateSv.toFixed(2)),
        customSv: Number(customSv.toFixed(2)),
        geoscaleSv: Number(geoscaleSv.toFixed(2)),
        densityAnomalyBaseline: Number(densityAnomalyBaseline.toFixed(2)),
        densityAnomalyCustom: Number(densityAnomalyCustom.toFixed(2)),
        heatTransportPW: Number(heatTransportPW.toFixed(2)),
      });
    }

    return data;
  }, [fleetSize, salinityDeltaPsu, startYear, warmingFactor]);

  // Handle Play/Pause Animation
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentAnimYear((prev) => {
          if (prev >= 2076) return 2026;
          return prev + 1;
        });
      }, 250);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Render D3 SVG Chart
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous drawing

    const containerWidth = svgRef.current.clientWidth || 800;
    const containerHeight = 420;
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const g = svg
      .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Filter data up to currentAnimYear
    const activeData = simulationData.filter((d) => d.year <= currentAnimYear);

    // X Scale
    const xScale = d3
      .scaleLinear()
      .domain([2026, 2076])
      .range([0, width]);

    // Y Scale (Sv from 0 to 22)
    const yScale = d3
      .scaleLinear()
      .domain([0, 22])
      .range([height, 0]);

    // Grid lines
    const makeXGrid = () => d3.axisBottom(xScale).ticks(10);
    const makeYGrid = () => d3.axisLeft(yScale).ticks(8);

    g.append("g")
      .attr("class", "grid-lines opacity-10 stroke-slate-500")
      .attr("transform", `translate(0,${height})`)
      .call(makeXGrid().tickSize(-height).tickFormat(() => ""));

    g.append("g")
      .attr("class", "grid-lines opacity-10 stroke-slate-500")
      .call(makeYGrid().tickSize(-width).tickFormat(() => ""));

    // Tipping Point Threat Threshold (Shaded Area below 12.0 Sv)
    const tippingSv = 12.0;
    const tippingY = yScale(tippingSv);

    g.append("rect")
      .attr("x", 0)
      .attr("y", tippingY)
      .attr("width", width)
      .attr("height", height - tippingY)
      .attr("fill", "#rose")
      .attr("class", "fill-rose-950/20 stroke-none");

    // Tipping Point Threshold Line
    g.append("line")
      .attr("x1", 0)
      .attr("y1", tippingY)
      .attr("x2", width)
      .attr("y2", tippingY)
      .attr("stroke", "#f43f5e")
      .attr("stroke-dasharray", "4,4")
      .attr("stroke-width", 1.5)
      .attr("opacity", 0.8);

    g.append("text")
      .attr("x", width - 10)
      .attr("y", tippingY - 6)
      .attr("text-anchor", "end")
      .attr("fill", "#f43f5e")
      .attr("font-size", "11px")
      .attr("font-family", "monospace")
      .attr("font-weight", "bold")
      .text("CRITICAL AMOC TIPPING THRESHOLD (12.0 Sv)");

    // X Axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format("d")).ticks(10))
      .attr("class", "text-slate-400 font-mono text-xs")
      .selectAll("text")
      .attr("fill", "#94a3b8");

    // Y Axis
    g.append("g")
      .call(d3.axisLeft(yScale).ticks(8))
      .attr("class", "text-slate-400 font-mono text-xs")
      .selectAll("text")
      .attr("fill", "#94a3b8");

    // Axis Labels
    g.append("text")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .attr("text-anchor", "middle")
      .attr("fill", "#94a3b8")
      .attr("font-size", "11px")
      .attr("font-family", "monospace")
      .text("PROJECTION TIMELINE (YEARS)");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -42)
      .attr("text-anchor", "middle")
      .attr("fill", "#94a3b8")
      .attr("font-size", "11px")
      .attr("font-family", "monospace")
      .text("AMOC FLOW VELOCITY (SVERDRUPS - Sv)");

    // Line generators
    const createLine = (key: keyof SimulationPoint) =>
      d3
        .line<SimulationPoint>()
        .x((d) => xScale(d.year))
        .y((d) => yScale(d[key] as number))
        .curve(d3.curveMonotoneX);

    // Gradient for Custom User Line
    const svgDefs = svg.append("defs");
    const customGradient = svgDefs
      .append("linearGradient")
      .attr("id", "custom-area-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    customGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#38bdf8")
      .attr("stop-opacity", 0.35);

    customGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#38bdf8")
      .attr("stop-opacity", 0.0);

    // Area Generator for Custom User Deployment
    if (showCustom && activeData.length > 0) {
      const areaGen = d3
        .area<SimulationPoint>()
        .x((d) => xScale(d.year))
        .y0(height)
        .y1((d) => yScale(d.customSv))
        .curve(d3.curveMonotoneX);

      g.append("path")
        .datum(activeData)
        .attr("fill", "url(#custom-area-gradient)")
        .attr("d", areaGen);
    }

    // Render Baseline Scenario (Unmitigated)
    if (showBaseline) {
      g.append("path")
        .datum(activeData)
        .attr("fill", "none")
        .attr("stroke", "#ef4444")
        .attr("stroke-dasharray", "5,5")
        .attr("stroke-width", 2)
        .attr("d", createLine("baselineSv"));
    }

    // Render Moderate Scenario (100 buoys)
    if (showModerate) {
      g.append("path")
        .datum(activeData)
        .attr("fill", "none")
        .attr("stroke", "#f97316")
        .attr("stroke-width", 2)
        .attr("d", createLine("moderateSv"));
    }

    // Render Geo-scale Fleet (500 buoys)
    if (showGeoscale) {
      g.append("path")
        .datum(activeData)
        .attr("fill", "none")
        .attr("stroke", "#10b981")
        .attr("stroke-width", 2)
        .attr("d", createLine("geoscaleSv"));
    }

    // Render Active Custom User Config
    if (showCustom) {
      g.append("path")
        .datum(activeData)
        .attr("fill", "none")
        .attr("stroke", "#38bdf8")
        .attr("stroke-width", 3.5)
        .attr("d", createLine("customSv"));
    }

    // Animated Endpoint Indicator
    if (activeData.length > 0 && showCustom) {
      const lastPt = activeData[activeData.length - 1];
      g.append("circle")
        .attr("cx", xScale(lastPt.year))
        .attr("cy", yScale(lastPt.customSv))
        .attr("r", 6)
        .attr("fill", "#38bdf8")
        .attr("stroke", "#0f172a")
        .attr("stroke-width", 2)
        .attr("class", "animate-pulse");
    }

    // Overlay Mouse Interactivity Box
    const overlay = g
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "none")
      .attr("pointer-events", "all");

    // Crosshair Lines
    const focusX = g
      .append("line")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-dasharray", "3,3")
      .attr("opacity", 0);

    const focusY = g
      .append("line")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-dasharray", "3,3")
      .attr("opacity", 0);

    const focusDot = g
      .append("circle")
      .attr("r", 5)
      .attr("fill", "#38bdf8")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2)
      .attr("opacity", 0);

    overlay
      .on("mousemove", (event) => {
        const [mouseX] = d3.pointer(event);
        const yearVal = Math.round(xScale.invert(mouseX));
        const matched = simulationData.find((d) => d.year === yearVal);

        if (matched) {
          setHoveredPoint(matched);
          const xPos = xScale(matched.year);
          const yPos = yScale(matched.customSv);

          focusX
            .attr("x1", xPos)
            .attr("y1", 0)
            .attr("x2", xPos)
            .attr("y2", height)
            .attr("opacity", 0.7);

          focusY
            .attr("x1", 0)
            .attr("y1", yPos)
            .attr("x2", width)
            .attr("y2", yPos)
            .attr("opacity", 0.7);

          focusDot.attr("cx", xPos).attr("cy", yPos).attr("opacity", 1);
        }
      })
      .on("mouseleave", () => {
        setHoveredPoint(null);
        focusX.attr("opacity", 0);
        focusY.attr("opacity", 0);
        focusDot.attr("opacity", 0);
      });
  }, [
    simulationData,
    currentAnimYear,
    showBaseline,
    showModerate,
    showCustom,
    showGeoscale,
  ]);

  // Current values at currentAnimYear or hovered point
  const displayPoint = hoveredPoint || simulationData.find((d) => d.year === currentAnimYear) || simulationData[simulationData.length - 1];
  const deltaSvVsBaseline = (displayPoint.customSv - displayPoint.baselineSv).toFixed(2);
  const percentRestored = (((displayPoint.customSv - displayPoint.baselineSv) / (17.8 - displayPoint.baselineSv)) * 100).toFixed(0);

  // Technical Hotspots data for SaliBuoy Hull Schematic
  const hotspots = [
    {
      id: 'cooling',
      title: 'Dual-Stage Water Cooling System',
      icon: <Thermometer className="w-4 h-4 text-cyan-400" />,
      tag: 'Heat Exchanger',
      coords: 'Top Hydrodynamic Deck (0-200m)',
      description: 'Chills concentrated brine down to sub-polar equilibrium (1.8°C) before ejection. Lowering output temperature dramatically boosts fluid density (Δρ), triggering cascading downwelling plume convection into deep ocean layers.',
      metric: 'Thermal Sink Delta: -4.2°C',
    },
    {
      id: 'salinity',
      title: 'Variable-Salinity Injection Chamber',
      icon: <Droplets className="w-4 h-4 text-sky-400" />,
      tag: 'Salinity Nozzle',
      coords: 'Subsea Brine Core (1,200m)',
      description: 'Dual-phase high pressure pump system delivering ultra-pure saline concentrates at up to 12.5 PSU above ambient seawater. Forces dense salt plumes through micro-diffuser nozzles to accelerate thermohaline sinking.',
      metric: 'Max Output: 1,450 L/min',
    },
    {
      id: 'hull',
      title: 'Titanium Grade-5 Pressure Vessel',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      tag: 'Pressure Hull',
      coords: 'Deep Subframe (2,000m rated)',
      description: 'Isogrid-reinforced titanium subframe built at Pukekohe Engineering Hub. Built to withstand 200 bar ambient hydrostatic pressure while housing central AI buoyancy engines and ballast control cells.',
      metric: 'Depth Rating: 2,000 m',
    },
    {
      id: 'turbine',
      title: 'Wave-Kinetic Energy Generator',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      tag: 'Power Unit',
      coords: 'Surface Wave Column',
      description: 'Self-sustaining ocean kinetic generator harnessing surface heave motion. Continuously charges internal 120 kWh lithium-iron-phosphate (LFP) energy cells to power continuous pumping operations without external grid dependency.',
      metric: 'Kinetic Output: 4.2 kW',
    },
    {
      id: 'sensors',
      title: 'Subsea CTD & Satellite Telemetry Array',
      icon: <Activity className="w-4 h-4 text-purple-400" />,
      tag: 'Sensor Node',
      coords: 'Multi-Depth Spar Array',
      description: 'High-precision Conductivity, Temperature, Depth (CTD) sensors combined with Iridium Satellite mesh nodes. Transmits sub-second oceanographic telemetry directly to SaliBuoy control centers and NOAA/NASA research hubs.',
      metric: 'Ping Latency: < 450 ms',
    },
  ];

  const activeHotspotObj = hotspots.find((h) => h.id === activeHotspot) || hotspots[0];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Title Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-slate-950 border border-sky-800/80 rounded-xl text-sky-400 shadow-inner">
              <LineChart className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-white text-2xl tracking-tight">System Dynamics 50-Year AMOC Simulation</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-950 border border-sky-800 text-[11px] font-mono font-semibold text-sky-300">
                  D3.JS Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Stommel Box Model • Thermohaline Flow Velocity (Sv) • 2026–2076 Climate Mitigation Projection
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-right">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Projected Flow (Yr {displayPoint.year})</span>
              <span className="text-lg font-mono font-bold text-sky-300">{displayPoint.customSv} Sv</span>
            </div>
            <div className="px-3.5 py-2 bg-emerald-950/40 border border-emerald-800/80 rounded-xl text-right">
              <span className="text-[10px] font-mono text-emerald-400 block uppercase">Flow Lift vs Baseline</span>
              <span className="text-lg font-mono font-bold text-emerald-300">+{deltaSvVsBaseline} Sv</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          This system dynamics model simulates the Atlantic Meridional Overturning Circulation (AMOC) thermohaline feedback loop. By injecting high-density chilled brine into subpolar deep-convection zones, SaliBuoy Mark-III fleets counteract Greenland meltwater freshening, preventing the ocean circulation from crossing the catastrophic 12.0 Sv tipping point threshold.
        </p>
      </div>

      {/* Main Interactive D3 Simulation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Parameter Control Panel */}
        <div className="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-white text-sm font-mono uppercase">Fleet Controls</h3>
              </div>
              <button
                onClick={() => {
                  setFleetSize(250);
                  setSalinityDeltaPsu(8.5);
                  setStartYear(2028);
                  setWarmingFactor(1.2);
                  setCurrentAnimYear(2076);
                }}
                className="text-[10px] font-mono text-slate-400 hover:text-sky-300 flex items-center space-x-1 transition-colors cursor-pointer"
                title="Reset Parameters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Slider 1: Fleet Size */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300 font-medium">Deployed Fleet Size</span>
                <span className="text-sky-300 font-bold">{fleetSize} Buoys</span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={fleetSize}
                onChange={(e) => setFleetSize(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0 (None)</span>
                <span>250 (Target)</span>
                <span>500 (Geo-scale)</span>
              </div>
            </div>

            {/* Slider 2: Salinity Injection Delta */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300 font-medium">Injection Salinity Delta</span>
                <span className="text-sky-300 font-bold">+{salinityDeltaPsu} PSU</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={salinityDeltaPsu}
                onChange={(e) => setSalinityDeltaPsu(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>+0 PSU</span>
                <span>+8.5 PSU</span>
                <span>+12.0 PSU</span>
              </div>
            </div>

            {/* Slider 3: Deployment Start Year */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300 font-medium">Deployment Start Year</span>
                <span className="text-amber-300 font-bold">{startYear}</span>
              </div>
              <input
                type="range"
                min="2026"
                max="2040"
                step="1"
                value={startYear}
                onChange={(e) => setStartYear(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>2026 (Immediate)</span>
                <span>2040 (Delayed)</span>
              </div>
            </div>

            {/* Slider 4: Climate Warming Acceleration */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300 font-medium">Greenland Melt Rate</span>
                <span className="text-rose-300 font-bold">{warmingFactor.toFixed(1)}x Rate</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="2.0"
                step="0.1"
                value={warmingFactor}
                onChange={(e) => setWarmingFactor(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-rose-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0.8x (Mild)</span>
                <span>1.2x (Standard)</span>
                <span>2.0x (Extreme)</span>
              </div>
            </div>

            {/* Scenario Toggles */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-mono text-slate-400 font-semibold block uppercase">Active Scenarios</span>
              <div className="space-y-1.5">
                <label className="flex items-center space-x-2 text-xs font-mono cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={showCustom}
                    onChange={(e) => setShowCustom(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-950 text-sky-400 focus:ring-sky-400"
                  />
                  <span className="text-sky-300 font-bold">Custom User Fleet ({fleetSize} Buoys)</span>
                </label>

                <label className="flex items-center space-x-2 text-xs font-mono cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={showBaseline}
                    onChange={(e) => setShowBaseline(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-950 text-rose-500 focus:ring-rose-500"
                  />
                  <span className="text-rose-400">Baseline (No Intervention)</span>
                </label>

                <label className="flex items-center space-x-2 text-xs font-mono cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={showModerate}
                    onChange={(e) => setShowModerate(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-950 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-orange-400">Moderate Fleet (100 Buoys)</span>
                </label>

                <label className="flex items-center space-x-2 text-xs font-mono cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={showGeoscale}
                    onChange={(e) => setShowGeoscale(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-emerald-400">Geo-Scale Fleet (500 Buoys)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Animation Play/Pause button */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-full py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/40 hover:bg-sky-500/30'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-amber-300" />
                  <span>Pause Time-Lapse</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-sky-300" />
                  <span>Animate 50-Yr Timeline</span>
                </>
              )}
            </button>
            <div className="text-[10px] font-mono text-slate-500 text-center">
              Timeline Index: Year <span className="text-slate-300 font-bold">{currentAnimYear}</span> / 2076
            </div>
          </div>
        </div>

        {/* Right Column: D3 SVG Chart Display & Telemetry Card */}
        <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            {/* Chart Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-white text-sm font-mono uppercase">
                  Interactive AMOC Trajectory Projection (2026–2076)
                </h3>
              </div>
              <div className="flex items-center space-x-3 text-[11px] font-mono">
                <span className="text-slate-400">Tipping Point Threshold:</span>
                <span className="text-rose-400 font-bold">12.0 Sv</span>
              </div>
            </div>

            {/* Render D3 SVG Container */}
            <div className="w-full relative bg-slate-950/80 border border-slate-800/80 rounded-xl p-2 overflow-hidden">
              <svg ref={svgRef} className="w-full h-auto min-h-[380px] cursor-crosshair"></svg>
            </div>
          </div>

          {/* Real-time Telemetry Status Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 font-mono">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-500 block uppercase">Selected Year</span>
              <span className="text-base font-bold text-white">{displayPoint.year}</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-500 block uppercase">Custom AMOC Flow</span>
              <span className={`text-base font-bold ${displayPoint.customSv >= 12 ? 'text-sky-300' : 'text-rose-400'}`}>
                {displayPoint.customSv} Sv
              </span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-500 block uppercase">Subsurface Density Δρ</span>
              <span className="text-base font-bold text-teal-300">{displayPoint.densityAnomalyCustom} kg/m³</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-500 block uppercase">Ocean Heat Transport</span>
              <span className="text-base font-bold text-amber-300">{displayPoint.heatTransportPW} PW</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conceptual Schematic Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-slate-950 border border-sky-800/80 rounded-xl text-sky-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-white text-lg tracking-tight">SaliBuoy Mark-III Hull Architecture Schematic</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-[10px] font-mono text-emerald-300">
                  CAD BLUEPRINT
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Technical breakdown of water-cooling micro-channels and salinity-adjustment mechanisms.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-400">Pukekohe Engineering Hub • Spec Rev 3.4</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Schematic Image Display with interactive overlay */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-3 overflow-hidden relative group">
            <img
              src={SCHEMATIC_IMAGE_PATH}
              alt="SaliBuoy Mark-III Hull Architecture Conceptual Schematic"
              referrerPolicy="no-referrer"
              className="w-full h-auto rounded-xl object-cover shadow-2xl border border-slate-900 transition-transform duration-500 group-hover:scale-[1.01]"
            />

            {/* Hotspot Selector Pills on top of Image */}
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              {hotspots.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setActiveHotspot(h.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center space-x-1.5 transition-all cursor-pointer ${
                    activeHotspot === h.id
                      ? 'bg-sky-500 text-slate-950 font-bold shadow-lg shadow-sky-500/20'
                      : 'bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {h.icon}
                  <span>{h.tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hotspot Technical Details Box */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800/90 rounded-2xl p-6 space-y-5 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg">
                  {activeHotspotObj.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base font-mono">{activeHotspotObj.title}</h3>
                  <span className="text-[10px] text-sky-400 font-mono">{activeHotspotObj.coords}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {activeHotspotObj.description}
            </p>

            <div className="p-3.5 bg-slate-900/80 border border-sky-800/50 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Engineering Performance Benchmark</span>
              <span className="text-sm font-mono font-bold text-sky-300">{activeHotspotObj.metric}</span>
            </div>

            {/* Technical Mechanism Summary Pills */}
            <div className="space-y-2 pt-2 border-t border-slate-900">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">Mechanism Coupling</span>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                <div className="p-2 bg-slate-900/60 rounded border border-slate-800 flex items-center space-x-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span>Thermo-Chilling</span>
                </div>
                <div className="p-2 bg-slate-900/60 rounded border border-slate-800 flex items-center space-x-1.5">
                  <Droplets className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                  <span>Brine Injection</span>
                </div>
                <div className="p-2 bg-slate-900/60 rounded border border-slate-800 flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span>Kinetic Wave</span>
                </div>
                <div className="p-2 bg-slate-900/60 rounded border border-slate-800 flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                  <span>Deep-Sea CTD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
