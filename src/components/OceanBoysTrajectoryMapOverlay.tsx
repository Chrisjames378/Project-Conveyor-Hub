import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  Navigation, 
  Layers, 
  Eye, 
  Clock, 
  Activity, 
  MapPin, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Zap, 
  Smartphone, 
  AlertTriangle, 
  ShieldCheck, 
  Info,
  Waves,
  ChevronRight,
  X,
  Radio,
  Sliders,
  Send
} from 'lucide-react';
import { OceanBoy, PredictedTrajectoryPoint, CurrentVelocity } from '../types';
import { calculateBuoyCurrentVelocity, predictBuoyTrajectory } from '../services/driftTrajectoryService';

interface OceanBoysTrajectoryMapOverlayProps {
  buoys: OceanBoy[];
  selectedBuoyId: string;
  onSelectBuoy: (buoyId: string) => void;
  onOpenOppoSimulator: (buoyId: string) => void;
  onOpenSmsAlertsModal?: () => void;
  onTriggerBrinePulse: (buoyId: string) => void;
  pulsingBuoyId: string | null;
  className?: string;
}

export const OceanBoysTrajectoryMapOverlay: React.FC<OceanBoysTrajectoryMapOverlayProps> = ({
  buoys,
  selectedBuoyId,
  onSelectBuoy,
  onOpenOppoSimulator,
  onOpenSmsAlertsModal,
  onTriggerBrinePulse,
  pulsingBuoyId,
  className = ''
}) => {
  // Map View Controls
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Layer Toggles
  const [showVelocityArrows, setShowVelocityArrows] = useState<boolean>(true);
  const [showTrajectoryPaths, setShowTrajectoryPaths] = useState<boolean>(true);
  const [showDepthContours, setShowDepthContours] = useState<boolean>(true);
  const [showPlumeRadii, setShowPlumeRadii] = useState<boolean>(true);
  const [selectedHorizonHours, setSelectedHorizonHours] = useState<number>(24); // 6, 12, 24, 48

  // Selected Buoy Data
  const activeBuoy = buoys.find(b => b.id === selectedBuoyId) || buoys[0];

  // Map coordinate conversion: Maps geographic lat/lng to SVG viewport coordinates (1000 x 700 viewBox)
  // New Zealand / Oceania centered bounding box:
  // Lat: -24° (North) to -60° (South), Lng: 160° (West) to 185° / -175° (East)
  const mapWidth = 1000;
  const mapHeight = 700;

  const projectGeoToSvg = (lat: number, lng: number): { x: number; y: number } => {
    // Normalize longitude (handling wrap around 180 / -180)
    let normalizedLng = lng;
    if (normalizedLng < 0) {
      normalizedLng += 360; // e.g. -177 becomes 183
    }

    // Min/Max bounds
    const minLat = -62; // South (Campbell / Sub-Antarctic)
    const maxLat = -25; // North (Kermadec / Tonga)
    const minLng = 158; // West (Tasman Sea / Australia edge)
    const maxLng = 190; // East (Chatham Islands / Pacific)

    const x = ((normalizedLng - minLng) / (maxLng - minLng)) * mapWidth;
    const y = ((maxLat - lat) / (maxLat - minLat)) * mapHeight;

    return {
      x: Math.max(10, Math.min(mapWidth - 10, x)),
      y: Math.max(10, Math.min(mapHeight - 10, y))
    };
  };

  // Enrich buoys with live velocity and trajectories if not already present
  const enrichedBuoys = useMemo(() => {
    return buoys.map(b => {
      const vel = b.currentVelocity || calculateBuoyCurrentVelocity(b);
      const traj = b.predictedTrajectory || predictBuoyTrajectory(b, vel);
      return {
        ...b,
        currentVelocity: vel,
        predictedTrajectory: traj
      };
    });
  }, [buoys]);

  const activeEnriched = enrichedBuoys.find(b => b.id === selectedBuoyId) || enrichedBuoys[0];

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoomLevel(1.0);
    setPanOffset({ x: 0, y: 0 });
  };

  // Major ocean current streamlines to render in background
  const majorCurrentLines = [
    // East Auckland Current (EAUC)
    { path: "M 480 180 Q 550 250 630 310", label: "East Auckland Current (1.8 kt)", speed: "1.8 kt" },
    // Cook Strait Tidal Jet
    { path: "M 490 320 Q 520 335 560 340", label: "Cook Strait Jet (3.8 kt)", speed: "3.8 kt" },
    // Southland Current
    { path: "M 410 420 Q 460 380 520 340", label: "Southland Current (2.1 kt)", speed: "2.1 kt" },
    // Sub-Antarctic Front / ACC
    { path: "M 200 540 Q 500 560 850 570", label: "Antarctic Circumpolar Current (3.2 kt)", speed: "3.2 kt" },
    // Kermadec Trench Inflow
    { path: "M 660 80 Q 640 180 610 260", label: "Kermadec Boundary Jet (1.5 kt)", speed: "1.5 kt" }
  ];

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col ${className}`}>
      
      {/* MAP HEADER & CONTROL TOOLBAR */}
      <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center space-x-2.5">
          <span className="p-1.5 rounded-lg bg-teal-500/20 border border-teal-500/40 text-teal-400">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-white uppercase flex items-center space-x-2">
              <span>REAL-TIME OCEAN CURRENT DRIFT & PREDICTED TRAJECTORY MAP</span>
              <span className="px-2 py-0.5 rounded text-[9px] bg-teal-950 text-teal-300 border border-teal-800">
                NZ EEZ & SOUTHERN OCEAN
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 font-sans">
              Visualizing hydrodynamic current vectors and dead-reckoning trajectory forecasts (+6h to +48h) for all 23 Ocean Boys.
            </p>
          </div>
        </div>

        {/* Toolbar controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Horizon Selector */}
          <div className="flex items-center space-x-1 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800 text-[11px]">
            <Clock className="w-3 h-3 text-teal-400" />
            <span className="text-slate-400">Forecast:</span>
            {[6, 12, 24, 48].map(h => (
              <button
                key={h}
                onClick={() => setSelectedHorizonHours(h)}
                className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-colors ${
                  selectedHorizonHours === h 
                    ? 'bg-teal-600 text-white' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                +{h}h
              </button>
            ))}
          </div>

          {/* Layer toggles */}
          <button
            onClick={() => setShowVelocityArrows(!showVelocityArrows)}
            className={`px-2.5 py-1 rounded-xl border transition-all text-[11px] font-bold cursor-pointer ${
              showVelocityArrows 
                ? 'bg-teal-950 border-teal-600 text-teal-300' 
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title="Toggle current velocity vector arrows"
          >
            Velocity Arrows
          </button>

          <button
            onClick={() => setShowTrajectoryPaths(!showTrajectoryPaths)}
            className={`px-2.5 py-1 rounded-xl border transition-all text-[11px] font-bold cursor-pointer ${
              showTrajectoryPaths 
                ? 'bg-teal-950 border-teal-600 text-teal-300' 
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title="Toggle predicted drift trajectories"
          >
            Trajectories
          </button>

          {/* Zoom controls */}
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setZoomLevel(Math.max(0.8, zoomLevel - 0.2))}
              className="p-1 hover:bg-slate-800 text-slate-300 rounded cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-teal-300 px-1">{zoomLevel.toFixed(1)}x</span>
            <button
              onClick={() => setZoomLevel(Math.min(2.5, zoomLevel + 0.2))}
              className="p-1 hover:bg-slate-800 text-slate-300 rounded cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetView}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* MAP VIEWPORT & SIDE INSPECTOR LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
        
        {/* Interactive SVG Marine Map Canvas */}
        <div 
          className="lg:col-span-8 relative bg-slate-950 overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <svg 
            viewBox={`0 0 ${mapWidth} ${mapHeight}`}
            className="w-full h-full object-contain"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out'
            }}
          >
            <defs>
              {/* Radial gradient for deep trenches and bathymetry */}
              <radialGradient id="trenchGlow" cx="65%" cy="20%" r="40%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
              </radialGradient>

              {/* Arrow markers for drift vectors */}
              <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#2dd4bf" />
              </marker>

              <marker id="predictedArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
              </marker>

              {/* Grid pattern */}
              <pattern id="marineGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1e293b" strokeWidth="0.6" strokeDasharray="2 3" />
              </pattern>
            </defs>

            {/* Ocean Basin Background */}
            <rect width={mapWidth} height={mapHeight} fill="#030712" />
            <rect width={mapWidth} height={mapHeight} fill="url(#marineGrid)" opacity="0.7" />

            {/* Bathymetry & Trench Depth Contours */}
            {showDepthContours && (
              <g className="bathymetry-contours pointer-events-none opacity-40">
                {/* Kermadec Trench (-8,000m to -10,000m) */}
                <ellipse cx="640" cy="160" rx="40" ry="140" fill="url(#trenchGlow)" transform="rotate(-18 640 160)" />
                <path d="M 660 60 Q 640 160 610 260" stroke="#0284c7" strokeWidth="2.5" fill="none" strokeDasharray="4 4" />
                <text x="665" y="140" fill="#38bdf8" fontSize="10" fontFamily="monospace" transform="rotate(-72 665 140)">
                  KERMADEC TRENCH (-10,047m)
                </text>

                {/* Campbell Plateau Subsea Shelf */}
                <circle cx="510" cy="540" r="110" fill="#0f172a" stroke="#334155" strokeWidth="1" strokeDasharray="6 4" opacity="0.5" />
                <text x="440" y="550" fill="#64748b" fontSize="10" fontFamily="monospace">
                  CAMPBELL PLATEAU (-500m SHELF)
                </text>

                {/* Chatham Rise Oceanic Ridge */}
                <ellipse cx="680" cy="380" rx="90" ry="30" fill="#0f172a" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                <text x="640" y="385" fill="#64748b" fontSize="9" fontFamily="monospace">
                  CHATHAM RISE (SUBTROPICAL FRONT)
                </text>

                {/* EEZ 200nm Maritime Boundary Contour */}
                <path 
                  d="M 440 140 C 650 120, 720 220, 730 360 C 740 450, 650 580, 520 630 C 400 620, 340 500, 360 380 Z" 
                  fill="none" 
                  stroke="#14b8a6" 
                  strokeWidth="0.8" 
                  strokeDasharray="4 6" 
                  opacity="0.3"
                />
              </g>
            )}

            {/* Stylized New Zealand Landmass Outline */}
            <g className="landmass pointer-events-none">
              {/* North Island */}
              <path 
                d="M 490 200 L 515 220 L 535 250 L 560 280 L 545 320 L 510 330 L 490 310 L 475 270 L 460 240 L 475 210 Z" 
                fill="#0f172a" 
                stroke="#38bdf8" 
                strokeWidth="1.6" 
              />
              {/* South Island */}
              <path 
                d="M 490 340 L 515 360 L 485 410 L 450 460 L 415 480 L 390 460 L 410 410 L 440 370 L 475 345 Z" 
                fill="#0f172a" 
                stroke="#38bdf8" 
                strokeWidth="1.6" 
              />
              {/* Stewart Island */}
              <circle cx="410" cy="495" r="9" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.4" />
              
              {/* Land labels */}
              <text x="500" y="270" fill="#94a3b8" fontSize="10" fontFamily="monospace" fontWeight="bold">NORTH IS.</text>
              <text x="440" y="420" fill="#94a3b8" fontSize="10" fontFamily="monospace" fontWeight="bold">SOUTH IS.</text>
              <text x="495" y="338" fill="#38bdf8" fontSize="8" fontFamily="monospace">Cook Strait</text>
            </g>

            {/* Major Ocean Current Streamlines & Arrows */}
            {majorCurrentLines.map((cur, idx) => (
              <g key={idx} className="current-streamline pointer-events-none opacity-50">
                <path d={cur.path} fill="none" stroke="#0ea5e9" strokeWidth="1.8" strokeDasharray="6 6" />
                <text fill="#38bdf8" fontSize="8" fontFamily="monospace">
                  <textPath href={`#streamline-${idx}`} startOffset="40%">
                    {cur.label}
                  </textPath>
                </text>
              </g>
            ))}

            {/* BUOY FLEET: PREDICTED TRAJECTORY PATHS (POLYLINES) */}
            {showTrajectoryPaths && enrichedBuoys.map(boy => {
              const currentPt = projectGeoToSvg(boy.coordinates.lat, boy.coordinates.lng);
              const isSelected = boy.id === selectedBuoyId;

              // Filter trajectory points up to selected horizon
              const relevantTraj = (boy.predictedTrajectory || []).filter(t => t.hoursAhead <= selectedHorizonHours);
              if (relevantTraj.length === 0) return null;

              // Build path string: M currentPt.x currentPt.y L p1.x p1.y L p2.x p2.y ...
              let pathStr = `M ${currentPt.x} ${currentPt.y}`;
              const pointsSvg = relevantTraj.map(t => projectGeoToSvg(t.coordinates.lat, t.coordinates.lng));
              pointsSvg.forEach(pt => {
                pathStr += ` L ${pt.x} ${pt.y}`;
              });

              return (
                <g key={`traj-${boy.id}`} className="transition-opacity">
                  {/* Trajectory Polyline */}
                  <path 
                    d={pathStr} 
                    fill="none" 
                    stroke={isSelected ? '#2dd4bf' : '#38bdf8'} 
                    strokeWidth={isSelected ? 2.5 : 1.2} 
                    strokeDasharray={isSelected ? 'none' : '3 3'}
                    opacity={isSelected ? 0.95 : 0.45}
                  />

                  {/* Waypoint circles along trajectory */}
                  {pointsSvg.map((pt, pIdx) => {
                    const trajPoint = relevantTraj[pIdx];
                    return (
                      <g key={pIdx}>
                        {/* Confidence circle */}
                        <circle 
                          cx={pt.x} 
                          cy={pt.y} 
                          r={isSelected ? 5 + (trajPoint.hoursAhead / 8) : 3} 
                          fill={isSelected ? '#14b8a6' : '#0284c7'} 
                          fillOpacity={isSelected ? 0.25 : 0.15} 
                          stroke={isSelected ? '#2dd4bf' : '#38bdf8'} 
                          strokeWidth="0.8" 
                        />
                        {/* Waypoint label if selected */}
                        {isSelected && (
                          <text 
                            x={pt.x + 8} 
                            y={pt.y + 3} 
                            fill="#5eead4" 
                            fontSize="8" 
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            +{trajPoint.hoursAhead}h ({trajPoint.driftDistanceKm}km)
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* BUOY FLEET: CURRENT VELOCITY VECTOR ARROWS */}
            {showVelocityArrows && enrichedBuoys.map(boy => {
              const pt = projectGeoToSvg(boy.coordinates.lat, boy.coordinates.lng);
              const vel = boy.currentVelocity;
              if (!vel) return null;

              // Arrow length proportional to speed (e.g. 1 kt = 18px)
              const length = Math.max(12, Math.min(45, vel.speedKnots * 14));
              const rad = (vel.directionDeg * Math.PI) / 180;
              const targetX = pt.x + length * Math.sin(rad);
              const targetY = pt.y - length * Math.cos(rad); // -cos because SVG y is inverted

              const isSelected = boy.id === selectedBuoyId;

              return (
                <g key={`arrow-${boy.id}`} className="pointer-events-none">
                  <line 
                    x1={pt.x} 
                    y1={pt.y} 
                    x2={targetX} 
                    y2={targetY} 
                    stroke={isSelected ? '#2dd4bf' : '#0ea5e9'} 
                    strokeWidth={isSelected ? 2.2 : 1.4} 
                    markerEnd="url(#arrow)" 
                    opacity={isSelected ? 1 : 0.7}
                  />
                  {isSelected && (
                    <text 
                      x={targetX + 6} 
                      y={targetY - 4} 
                      fill="#2dd4bf" 
                      fontSize="9" 
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {vel.speedKnots} kt ({vel.directionCompass})
                    </text>
                  )}
                </g>
              );
            })}

            {/* BUOY FLEET MARKERS (CLICKABLE) */}
            {enrichedBuoys.map(boy => {
              const pt = projectGeoToSvg(boy.coordinates.lat, boy.coordinates.lng);
              const isSelected = boy.id === selectedBuoyId;
              const isPulsing = pulsingBuoyId === boy.id;

              const isDownwelling = boy.status === 'Active Downwelling';
              const isTsunami = boy.status === 'Tsunami Watch';

              const markerColor = isTsunami ? '#f43f5e' : isDownwelling ? '#06b6d4' : '#10b981';

              return (
                <g 
                  key={`marker-${boy.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBuoy(boy.id);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Hyper-saline plume dispersion radius circle */}
                  {showPlumeRadii && isDownwelling && (
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r={isSelected ? 26 : 16} 
                      fill="#06b6d4" 
                      fillOpacity="0.18" 
                      stroke="#06b6d4" 
                      strokeWidth="1" 
                      strokeDasharray="2 2"
                      className="animate-pulse"
                    />
                  )}

                  {/* Pulsing ring for selected / downwelling */}
                  {isSelected && (
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r="14" 
                      fill="none" 
                      stroke="#2dd4bf" 
                      strokeWidth="1.5" 
                      strokeDasharray="3 3"
                      className="animate-spin-slow"
                    />
                  )}

                  {/* Buoy Core Dot */}
                  <circle 
                    cx={pt.x} 
                    cy={pt.y} 
                    r={isSelected ? 6 : 4} 
                    fill={markerColor} 
                    stroke="#ffffff" 
                    strokeWidth={isSelected ? 2 : 1}
                    className={isPulsing ? 'animate-ping' : ''}
                  />

                  {/* Mini Buoy Label on Hover or Selection */}
                  <g className={isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-opacity'}>
                    <rect 
                      x={pt.x - 30} 
                      y={pt.y - 20} 
                      width="60" 
                      height="14" 
                      rx="3" 
                      fill="#020617" 
                      stroke={isSelected ? '#2dd4bf' : '#475569'} 
                      strokeWidth="0.8" 
                    />
                    <text 
                      x={pt.x} 
                      y={pt.y - 10} 
                      fill="#e2e8f0" 
                      fontSize="8" 
                      fontFamily="monospace" 
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {boy.nickname.split('-')[0].trim().substring(0, 12)}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Compass Rose in Corner */}
            <g transform="translate(60, 620)" className="pointer-events-none opacity-80">
              <circle cx="0" cy="0" r="26" fill="#020617" stroke="#334155" strokeWidth="1" />
              <line x1="0" y1="-22" x2="0" y2="22" stroke="#475569" strokeWidth="1" />
              <line x1="-22" y1="0" x2="22" y2="0" stroke="#475569" strokeWidth="1" />
              {/* North Pointer */}
              <polygon points="0,-22 4,-8 -4,-8" fill="#f43f5e" />
              <text x="0" y="-25" fill="#f43f5e" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">N</text>
              <text x="25" y="3" fill="#64748b" fontSize="8" fontFamily="monospace">E</text>
              <text x="0" y="24" fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">S</text>
              <text x="-26" y="3" fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="end">W</text>
            </g>

            {/* Velocity Legend Bar */}
            <g transform="translate(130, 660)" className="pointer-events-none">
              <rect x="0" y="0" width="220" height="24" rx="4" fill="#020617" stroke="#1e293b" strokeWidth="1" />
              <text x="8" y="15" fill="#64748b" fontSize="8" fontFamily="monospace">CURRENT VELOCITY:</text>
              {/* Gradient bar */}
              <rect x="110" y="8" width="100" height="8" rx="2" fill="url(#velocityGradient)" />
              <text x="110" y="22" fill="#38bdf8" fontSize="7" fontFamily="monospace">0.5 kt</text>
              <text x="200" y="22" fill="#f43f5e" fontSize="7" fontFamily="monospace">4.0+ kt</text>

              <defs>
                <linearGradient id="velocityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="35%" stopColor="#2dd4bf" />
                  <stop offset="70%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>
            </g>

          </svg>

          {/* Map Overlay Quick Tip Badge */}
          <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-lg p-2 font-mono text-[10px] space-y-1 text-slate-300 pointer-events-none">
            <div className="flex items-center space-x-1.5 text-teal-400 font-bold">
              <Navigation className="w-3 h-3 animate-pulse" />
              <span>HYDRODYNAMIC DRIFT ENGINE</span>
            </div>
            <div className="text-slate-400">
              Drag to Pan • Click Buoy to Inspect Drift Path
            </div>
          </div>
        </div>

        {/* BUOY DRIFT & TRAJECTORY DETAILED INSPECTION PANEL */}
        <div className="lg:col-span-4 p-5 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between space-y-4 font-mono text-xs">
          
          <div className="space-y-3">
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-teal-400 px-2 py-0.5 rounded bg-teal-950 border border-teal-800">
                {activeEnriched.category}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                activeEnriched.status === 'Active Downwelling' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                activeEnriched.status === 'Tsunami Watch' ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse' :
                'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {activeEnriched.status}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                {activeEnriched.name}
              </h3>
              <p className="text-xs text-slate-400">
                {activeEnriched.nickname}
              </p>
              <div className="text-[11px] text-teal-300 mt-1 flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-teal-400" />
                <span>
                  {activeEnriched.coordinates.lat.toFixed(3)}°S, {activeEnriched.coordinates.lng.toFixed(3)}°E
                </span>
              </div>
            </div>

            {/* REAL-TIME CURRENT VELOCITY TELEMETRY BOX */}
            <div className="p-3 bg-slate-950 rounded-xl border border-teal-900/60 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-[10px] text-teal-400 font-bold uppercase flex items-center space-x-1">
                  <Waves className="w-3.5 h-3.5" />
                  <span>Current Velocity Vector:</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">
                  {activeEnriched.currentVelocity?.currentSystem.split('/')[0].trim()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-slate-500 text-[10px] block">DRIFT SPEED:</span>
                  <div className="text-teal-300 font-bold text-sm">
                    {activeEnriched.currentVelocity?.speedKnots} kt
                    <span className="text-[10px] text-slate-400 font-normal ml-1">
                      ({activeEnriched.currentVelocity?.speedMs} m/s)
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">FLOW DIRECTION:</span>
                  <div className="text-sky-300 font-bold text-sm">
                    {activeEnriched.currentVelocity?.directionDeg}° ({activeEnriched.currentVelocity?.directionCompass})
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 border-t border-slate-900 pt-1.5 flex justify-between">
                <span>Zonal (u): <span className="text-slate-200">{activeEnriched.currentVelocity?.uVelocityMs} m/s</span></span>
                <span>Meridional (v): <span className="text-slate-200">{activeEnriched.currentVelocity?.vVelocityMs} m/s</span></span>
              </div>
            </div>

            {/* PREDICTED TRAJECTORY TABLE (FORECAST HORIZONS) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300 flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-teal-400" />
                  <span>Predicted Trajectory Horizon:</span>
                </span>
                <span className="text-[10px] text-teal-400 font-bold">
                  Active: +{selectedHorizonHours}h
                </span>
              </div>

              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {activeEnriched.predictedTrajectory?.map(pt => {
                  const isHorizonActive = pt.hoursAhead === selectedHorizonHours;
                  return (
                    <div 
                      key={pt.hoursAhead}
                      onClick={() => setSelectedHorizonHours(pt.hoursAhead)}
                      className={`p-2 rounded-lg border text-[11px] transition-all cursor-pointer flex items-center justify-between ${
                        isHorizonActive 
                          ? 'bg-teal-950/70 border-teal-500 text-teal-200' 
                          : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-300 hover:bg-slate-950'
                      }`}
                    >
                      <div>
                        <div className="font-bold flex items-center space-x-1">
                          <span className={isHorizonActive ? 'text-teal-300' : 'text-slate-300'}>
                            +{pt.hoursAhead} Hours
                          </span>
                          <span className="text-[10px] text-slate-500">
                            • {pt.driftDistanceKm} km drift
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {pt.coordinates.lat}°S, {pt.coordinates.lng}°E
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-bold">
                          {pt.confidencePct}% Conf.
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Geo-fence & Maritime Integrity Check */}
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center space-x-2 text-[11px] text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                Trajectory verified within permitted research coordinates. No collision corridors detected.
              </span>
            </div>

          </div>

          {/* ACTION BUTTONS */}
          <div className="space-y-2 pt-2">
            {/* Brine Downwelling Actuator */}
            <button
              onClick={() => onTriggerBrinePulse(activeEnriched.id)}
              disabled={pulsingBuoyId === activeEnriched.id}
              className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white rounded-xl font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-300" />
              <span>TRIGGER REMOTE BRINE DOWNWELLING PULSE</span>
            </button>

            {/* Sync with Oppo A6x Terminal */}
            <button
              onClick={() => onOpenOppoSimulator(activeEnriched.id)}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-teal-300 border border-teal-800/60 rounded-xl font-bold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-teal-400" />
              <span>VIEW DRIFT ON OPPO A6X (90Hz)</span>
            </button>

            {/* Open SMS Alerts Modal if provided */}
            {onOpenSmsAlertsModal && (
              <button
                onClick={onOpenSmsAlertsModal}
                className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-sky-300 border border-sky-800/40 rounded-xl font-bold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer text-[11px]"
              >
                <Send className="w-3 h-3 text-sky-400" />
                <span>CONFIGURE SMS ALERTS FOR ANONYMOUS INTEL</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
