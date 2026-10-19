import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Wind, 
  Snowflake, 
  Zap, 
  Thermometer, 
  Activity, 
  RotateCw, 
  Sliders, 
  Eye, 
  Maximize2, 
  Minimize2, 
  Compass, 
  Gauge, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Waves, 
  ShieldCheck, 
  Sun, 
  CloudFog, 
  CloudRain,
  Play,
  Pause,
  Info,
  Layers,
  HelpCircle,
  Cpu,
  ArrowDownCircle,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Ship,
  Anchor,
  FastForward,
  Check,
  EyeOff,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface DeploymentStage {
  stage: number;
  name: string;
  range: string;
  desc: string;
  stats: string;
}

const DEPLOYMENT_STAGES: DeploymentStage[] = [
  {
    stage: 1,
    name: 'Tow-Out & Crane Lowering',
    range: '0% - 20%',
    desc: 'Heavy support vessel crane lowers the spar buoy hull into position at sea. Tensioned hoist cables hold the hull until hydrostatic buoyancy is established.',
    stats: 'Cable Tension: 62.4 Tonnes • Draft: 0 - 15m'
  },
  {
    stage: 2,
    name: 'Keel Upending & Ballast Flooding',
    range: '20% - 40%',
    desc: 'Automated seawater ballast pumps flood the lower cryo-spar chamber, sinking the keel to stable operating draft and aligning the vertical buoyancy axis.',
    stats: 'Ballast Flooding: 1,450 m³ • Pitch Stability: ±0.4°'
  },
  {
    stage: 3,
    name: 'Abyssal 70m Column Extension',
    range: '40% - 60%',
    desc: 'The subsea Archimedean screw pump column and nozzle diffuser telescope downward to 70m depth, penetrating into the dense hypersaline halocline.',
    stats: 'Intake Depth: 70m Subsea • Hydrostatic Pressure: 7.1 bar'
  },
  {
    stage: 4,
    name: 'Nacelle Lift & Rotor Mating',
    range: '60% - 80%',
    desc: 'The crane mates the 24-pole PMDD generator nacelle and vertical rotor shaft onto the deck. The 3 helical aerodynamic blades unfurl to 14m swept radius.',
    stats: 'Air Gap Alignment: 1.2 mm • Swept Profile: 38m Helical'
  },
  {
    stage: 5,
    name: 'Rig Detach & Spin-Up Commissioning',
    range: '80% - 100%',
    desc: 'Crane cables disconnect and hoist clear. Polar winds accelerate the rotor to nominal 54 RPM, solar collar comes online, and brine jetting downwells into the AMOC.',
    stats: 'Rotor RPM: 54 RPM • Downwelling Jet: 310 L/min'
  }
];

interface TurbineComponentDetail {
  id: string;
  name: string;
  partNo: string;
  category: string;
  specs: string;
  physicsFormula: string;
  howItWorks: string;
  cameraTarget: { y: number; radius: number; phi: number; theta: number };
}

const TURBINE_COMPONENTS: TurbineComponentDetail[] = [
  {
    id: 'blades',
    name: 'Helical Savonius-Darrieus Hybrid Blades',
    partNo: 'SB-VAWT-01-HELIX',
    category: 'Aerodynamic Lift & Drag Rotor',
    specs: 'Carbon-Fiber Polar Composite • 38m Swept Profile • Hydrophobic Nano-Coating',
    physicsFormula: 'P = 0.5 * ρ_air * A * v_wind^3 * Cp (Cp = 0.38 Savonius Limit)',
    howItWorks: 'Combines Savonius drag cups for omnidirectional self-starting in low wind (<3 kts) with Darrieus helical aerofoils providing aerodynamic lift at high RPM without needing a yaw motor.',
    cameraTarget: { y: 38, radius: 60, phi: Math.PI / 2.2, theta: 0.4 }
  },
  {
    id: 'generator',
    name: 'Direct-Drive Permanent Magnet Alternator',
    partNo: 'SB-GEN-02-PMDD',
    category: 'Kinetic-to-Electrical Conversion',
    specs: 'Neodymium NdFeB N52 Magnets • 96.4% Efficiency • Sealed Nitrogen Cavity',
    physicsFormula: 'EMF = -N * (dΦ_B / dt) • 3-Phase Multi-Pole Synchronous Induction',
    howItWorks: 'Directly coupled to the vertical rotor shaft without a fragile gearbox. Eliminates gear lubricant freezing in -40°C polar winds. Produces 3-phase AC rectified to 24V DC battery buffer.',
    cameraTarget: { y: 16, radius: 45, phi: Math.PI / 2.3, theta: Math.PI / 4 }
  },
  {
    id: 'impeller',
    name: 'Subsea Archimedean Brine Downwelling Pump',
    partNo: 'SB-PMP-03-CRYO',
    category: 'Deepwater Hydrodynamic Convection',
    specs: 'Silicon-Carbide Ceramic Bearings • 450 L/min Peak Flow • 70m Subsea Keel',
    physicsFormula: 'Q_brine = A_nozzle * v_jet = 280 L/min @ 1052 kg/m³ Density Convection',
    howItWorks: 'Transfers mechanical torque from the surface wind rotor straight down the spar shaft to an abyssal Archimedes screw pump, injecting dense hypersaline surface brine into the deep AMOC conveyor.',
    cameraTarget: { y: -65, radius: 70, phi: Math.PI * 0.75, theta: Math.PI / 3 }
  },
  {
    id: 'deicer',
    name: 'Electro-Thermal Carbon Nanotube Heating Ribs',
    partNo: 'SB-ICE-04-DEICE',
    category: 'Anti-Ice & Active Surface Defrost',
    specs: 'Embedded Carbon Nanotube Foil • 180W Heat Pulse • 65°C Surface Threshold',
    physicsFormula: 'Q_thermal = I^2 * R * t • Instantaneous Rime Ice Shedding',
    howItWorks: 'Embedded directly inside the blade leading edges. Pulses periodic thermal bursts when temperature drops below 0°C, melting ice/snow adhesion and maintaining clean aerodynamic laminar airflow.',
    cameraTarget: { y: 32, radius: 50, phi: Math.PI / 2.2, theta: -0.2 }
  },
  {
    id: 'solar',
    name: '360° Bifacial Photovoltaic Collar Ring',
    partNo: 'SB-SOL-05-BIFACIAL',
    category: 'Solar Energy Harvesting',
    specs: '120 Watts Monocrystalline • Salt-Water Resin Encapsulation • Albedo Reflection',
    physicsFormula: 'E_solar = G_polar * A_pv * η_cell * (1 + Albedo_snow_ice)',
    howItWorks: 'Encircles the upper buoy spar, harvesting 24-hour low-angle polar summer sunlight and reflections from surrounding sea ice to charge the telemetry battery during wind calms.',
    cameraTarget: { y: 6, radius: 48, phi: Math.PI / 2.4, theta: Math.PI / 2 }
  }
];

export const WindTurbinePlatform3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Active View Mode: 'simulation' | 'how-it-works' | 'exploded' | 'deployment'
  const [activeTabMode, setActiveTabMode] = useState<'simulation' | 'how-it-works' | 'exploded' | 'deployment'>('how-it-works');
  const [activeExplodedProgress, setActiveExplodedProgress] = useState<number>(0);
  const [selectedComponentId, setSelectedComponentId] = useState<string>('blades');
  const [isInspectorCardVisible, setIsInspectorCardVisible] = useState<boolean>(false);
  const [isClean3DViewActive, setIsClean3DViewActive] = useState<boolean>(false);

  // 3D Deployment / Assembly at Sea States
  const [deploymentProgress, setDeploymentProgress] = useState<number>(0); // 0 to 100%
  const [isDeployingAnimationPlaying, setIsDeployingAnimationPlaying] = useState<boolean>(false);
  const [deploymentSpeed, setDeploymentSpeed] = useState<number>(1); // 0.5x, 1x, 2x
  const [isDeploymentLooping, setIsDeploymentLooping] = useState<boolean>(false);

  // Weather & Environmental Simulation States
  const [windSpeedKnots, setWindSpeedKnots] = useState<number>(32);
  const [ambientTempC, setAmbientTempC] = useState<number>(-14);
  const [weatherCondition, setWeatherCondition] = useState<'polar-sun' | 'marine-fog' | 'katabatic-storm' | 'blizzard'>('blizzard');
  const [snowIntensityPct, setSnowIntensityPct] = useState<number>(85);
  const [isDeIcerActive, setIsDeIcerActive] = useState<boolean>(true);
  const [isStormBrakeEngaged, setIsStormBrakeEngaged] = useState<boolean>(false);
  const [showStreamlines, setShowStreamlines] = useState<boolean>(true);
  const [showSnowParticles, setShowSnowParticles] = useState<boolean>(true);
  const [showBrinePlume, setShowBrinePlume] = useState<boolean>(true);

  // Real-time Physics Telemetry
  const [rotorRpm, setRotorRpm] = useState<number>(54);
  const [powerWatts, setPowerWatts] = useState<number>(720);
  const [iceThicknessMm, setIceThicknessMm] = useState<number>(0.8);
  const [brinePumpingLpm, setBrinePumpingLpm] = useState<number>(310);
  const [aerodynamicTorqueNm, setAerodynamicTorqueNm] = useState<number>(128);

  // Three.js Core Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  
  // Model Components Refs for Dynamic Animation & Exploded Separation
  const platformRootRef = useRef<THREE.Group | null>(null);
  const rotorGroupRef = useRef<THREE.Group | null>(null);
  const bladeMeshesRef = useRef<THREE.Mesh[]>([]);
  const mastCapMeshRef = useRef<THREE.Mesh | null>(null);
  const nacelleMeshRef = useRef<THREE.Mesh | null>(null);
  const generatorCoilsMeshRef = useRef<THREE.Mesh | null>(null);
  const floatCollarMeshRef = useRef<THREE.Mesh | null>(null);
  const subseaDiffuserMeshRef = useRef<THREE.Mesh | null>(null);
  const deIceHeaterMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const snowMeshRef = useRef<THREE.Mesh | null>(null);
  const windStreamlinesPointsRef = useRef<THREE.Points | null>(null);
  const snowFlakesPointsRef = useRef<THREE.Points | null>(null);
  const brinePlumePointsRef = useRef<THREE.Points | null>(null);

  // Crane Rigging & Water Splash Refs for Deployment Process
  const craneRigGroupRef = useRef<THREE.Group | null>(null);
  const splashRingMeshRef = useRef<THREE.Mesh | null>(null);

  // Loop synchronization refs
  const isDeployingAnimationPlayingRef = useRef<boolean>(false);
  const deploymentSpeedRef = useRef<number>(1);
  const isDeploymentLoopingRef = useRef<boolean>(false);
  const activeTabModeRef = useRef<string>('how-it-works');

  useEffect(() => {
    isDeployingAnimationPlayingRef.current = isDeployingAnimationPlaying;
  }, [isDeployingAnimationPlaying]);

  useEffect(() => {
    deploymentSpeedRef.current = deploymentSpeed;
  }, [deploymentSpeed]);

  useEffect(() => {
    isDeploymentLoopingRef.current = isDeploymentLooping;
  }, [isDeploymentLooping]);

  useEffect(() => {
    activeTabModeRef.current = activeTabMode;
  }, [activeTabMode]);

  // Orbit / Pointer Control Refs
  const isPointerDownRef = useRef<boolean>(false);
  const pointerStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraAnglesRef = useRef<{ theta: number; phi: number; radius: number }>({
    theta: Math.PI / 4,
    phi: Math.PI / 2.7,
    radius: 140
  });
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 15, 0));

  const activeComponent = TURBINE_COMPONENTS.find(c => c.id === selectedComponentId) || TURBINE_COMPONENTS[0];

  // Helper to trigger 3D at-sea deployment & assembly animation
  const handleTriggerDeploymentAnimation = () => {
    setActiveTabMode('deployment');
    setDeploymentProgress(0);
    setIsDeployingAnimationPlaying(true);
    if (cameraRef.current) {
      cameraAnglesRef.current = {
        theta: Math.PI / 3.2,
        phi: Math.PI / 2.5,
        radius: 175
      };
      cameraTargetRef.current.set(0, 10, 0);
      updateCameraPosition(cameraRef.current);
    }
  };

  // Initialize Three.js Scene
  useEffect(() => {
    if (!canvasRef.current) return;

    const width = canvasRef.current.clientWidth || 800;
    const height = canvasRef.current.clientHeight || 560;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06101e);
    scene.fog = new THREE.FogExp2(0x0a192f, 0.0035);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    updateCameraPosition(camera);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    // Studio & Environmental Lighting
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
    sunLight.position.set(100, 180, 80);
    scene.add(sunLight);

    const oceanFillLight = new THREE.DirectionalLight(0x0284c7, 0.6);
    oceanFillLight.position.set(-80, -50, -60);
    scene.add(oceanFillLight);

    // ========================================================
    // BUILD 3D WIND TURBINE PLATFORM & SPAR BUOY STRUCTURE
    // ========================================================
    const platformRoot = new THREE.Group();
    platformRootRef.current = platformRoot;

    // 1. Sea Water Plane Surface (y = 0)
    const seaGeo = new THREE.PlaneGeometry(350, 350, 48, 48);
    seaGeo.rotateX(-Math.PI / 2);
    const seaMat = new THREE.MeshStandardMaterial({
      color: 0x034a75,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85
    });
    const seaMesh = new THREE.Mesh(seaGeo, seaMat);
    scene.add(seaMesh);

    // 2. Spar Buoy Flotation Collar (y = -10 to +8)
    const floatCollarGeo = new THREE.CylinderGeometry(18, 16, 22, 32);
    const floatCollarMat = new THREE.MeshStandardMaterial({
      color: 0xf97316, // Marine Safety Orange
      roughness: 0.4,
      metalness: 0.2
    });
    const floatCollar = new THREE.Mesh(floatCollarGeo, floatCollarMat);
    floatCollar.position.y = 2;
    platformRoot.add(floatCollar);
    floatCollarMeshRef.current = floatCollar;

    // Solar Panel Band around upper collar
    const solarBandGeo = new THREE.CylinderGeometry(18.2, 18.2, 5, 32, 1, true);
    const solarBandMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.9
    });
    const solarBand = new THREE.Mesh(solarBandGeo, solarBandMat);
    solarBand.position.y = 8;
    platformRoot.add(solarBand);

    // 3. Subsea Spar Hull & Downwelling Intake (y = -10 to -70)
    const subseaSparGeo = new THREE.CylinderGeometry(9, 7, 60, 24);
    const subseaSparMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.5
    });
    const subseaSpar = new THREE.Mesh(subseaSparGeo, subseaSparMat);
    subseaSpar.position.y = -35;
    platformRoot.add(subseaSpar);

    // Subsea Archimedean Ceramic Impeller Blades (inside keel)
    const impellerCoreGeo = new THREE.CylinderGeometry(4, 4, 12, 16);
    const impellerCoreMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.8, roughness: 0.2 });
    const impellerCore = new THREE.Mesh(impellerCoreGeo, impellerCoreMat);
    impellerCore.position.y = -58;
    platformRoot.add(impellerCore);

    // Subsea Brine Acceleration Diffuser Cone (bottom keel)
    const diffuserGeo = new THREE.ConeGeometry(14, 18, 24, 1, true);
    diffuserGeo.rotateX(Math.PI);
    const diffuserMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.3,
      metalness: 0.7
    });
    const diffuser = new THREE.Mesh(diffuserGeo, diffuserMat);
    diffuser.position.y = -70;
    platformRoot.add(diffuser);
    subseaDiffuserMeshRef.current = diffuser;

    // 4. Turbine Generator Nacelle (Platform Deck at y = 14)
    const nacelleGeo = new THREE.CylinderGeometry(8, 12, 8, 24);
    const nacelleMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.3,
      metalness: 0.8
    });
    const nacelle = new THREE.Mesh(nacelleGeo, nacelleMat);
    nacelle.position.y = 15;
    platformRoot.add(nacelle);
    nacelleMeshRef.current = nacelle;

    // Internal Generator Stator Copper Coils (revealed in exploded view)
    const statorGeo = new THREE.TorusGeometry(5, 1.2, 16, 24);
    statorGeo.rotateX(Math.PI / 2);
    const statorMat = new THREE.MeshStandardMaterial({
      color: 0xb45309, // Copper coil
      metalness: 0.8,
      roughness: 0.2
    });
    const statorMesh = new THREE.Mesh(statorGeo, statorMat);
    statorMesh.position.y = 15;
    platformRoot.add(statorMesh);
    generatorCoilsMeshRef.current = statorMesh;

    // Dynamic Rime Ice / Snow Crust Layer on Nacelle & Hull
    const snowCapGeo = new THREE.CylinderGeometry(8.1, 12.1, 2, 24);
    const snowCapMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.9,
      metalness: 0.05,
      transparent: true,
      opacity: 0.85
    });
    const snowCap = new THREE.Mesh(snowCapGeo, snowCapMat);
    snowCap.position.y = 19;
    platformRoot.add(snowCap);
    snowMeshRef.current = snowCap;

    // 5. ROTATING HELICAL SAVONIUS-DARRIEUS WIND TURBINE
    const rotorGroup = new THREE.Group();
    rotorGroup.position.y = 20;

    // Central Shaft (y = 0 to 45)
    const shaftGeo = new THREE.CylinderGeometry(1.5, 1.5, 45, 16);
    const shaftMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.2,
      metalness: 0.9
    });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.position.y = 22.5;
    rotorGroup.add(shaft);

    // Helical Aerodynamic Rotor Blades (3 helical blades)
    const numBlades = 3;
    const bladeHeight = 38;
    const rotorRadius = 14;

    // Anti-Ice Electro-Thermal De-Icing Material (Glows when active!)
    const deIceMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf97316,
      emissiveIntensity: 0.7,
      roughness: 0.3,
      metalness: 0.4
    });
    deIceHeaterMaterialRef.current = deIceMat;
    const bladeMeshes: THREE.Mesh[] = [];

    for (let b = 0; b < numBlades; b++) {
      const baseAngle = (b / numBlades) * Math.PI * 2;
      const bladeSegments = 24;
      const bladeGeo = new THREE.BufferGeometry();
      const positions: number[] = [];
      const normals: number[] = [];

      for (let s = 0; s < bladeSegments; s++) {
        const t1 = s / bladeSegments;
        const t2 = (s + 1) / bladeSegments;

        const y1 = t1 * bladeHeight + 3;
        const y2 = t2 * bladeHeight + 3;

        // Twist angle along blade height (helical curvature)
        const twist1 = baseAngle + t1 * 1.4;
        const twist2 = baseAngle + t2 * 1.4;

        // Outer aerofoil tip
        const x1 = Math.cos(twist1) * rotorRadius;
        const z1 = Math.sin(twist1) * rotorRadius;

        const x2 = Math.cos(twist2) * rotorRadius;
        const z2 = Math.sin(twist2) * rotorRadius;

        // Inner aerofoil root
        const inX1 = Math.cos(twist1) * (rotorRadius * 0.4);
        const inZ1 = Math.sin(twist1) * (rotorRadius * 0.4);

        const inX2 = Math.cos(twist2) * (rotorRadius * 0.4);
        const inZ2 = Math.sin(twist2) * (rotorRadius * 0.4);

        // Quad 1: Outer shell
        positions.push(
          x1, y1, z1,   x2, y2, z2,   inX1, y1, inZ1,
          inX1, y1, inZ1, x2, y2, z2, inX2, y2, inZ2
        );

        for (let k = 0; k < 6; k++) {
          normals.push(Math.cos(twist1), 0.2, Math.sin(twist1));
        }
      }

      bladeGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      bladeGeo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
      bladeGeo.computeVertexNormals();

      const bladeMesh = new THREE.Mesh(bladeGeo, deIceMat);
      bladeMesh.userData = { baseAngle };
      rotorGroup.add(bladeMesh);
      bladeMeshes.push(bladeMesh);

      // Radial aerodynamic support struts
      const strutGeo = new THREE.CylinderGeometry(0.6, 0.6, rotorRadius, 8);
      strutGeo.rotateZ(Math.PI / 2);

      const bottomStrut = new THREE.Mesh(strutGeo, shaftMat);
      bottomStrut.position.set(Math.cos(baseAngle) * rotorRadius * 0.5, 4, Math.sin(baseAngle) * rotorRadius * 0.5);
      bottomStrut.rotation.y = -baseAngle;
      rotorGroup.add(bottomStrut);

      const topStrut = new THREE.Mesh(strutGeo, shaftMat);
      const topAngle = baseAngle + 1.4;
      topStrut.position.set(Math.cos(topAngle) * rotorRadius * 0.5, 41, Math.sin(topAngle) * rotorRadius * 0.5);
      topStrut.rotation.y = -topAngle;
      rotorGroup.add(topStrut);
    }
    bladeMeshesRef.current = bladeMeshes;

    // Top aerodynamic dome & anemometer mast
    const topCapGeo = new THREE.SphereGeometry(3, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const topCap = new THREE.Mesh(topCapGeo, shaftMat);
    topCap.position.y = 45;
    rotorGroup.add(topCap);
    mastCapMeshRef.current = topCap;

    platformRoot.add(rotorGroup);
    rotorGroupRef.current = rotorGroup;
    scene.add(platformRoot);

    // ========================================================
    // 6. AERODYNAMIC WIND STREAMLINE PARTICLES
    // ========================================================
    const streamCount = 450;
    const streamPositions = new Float32Array(streamCount * 3);
    const streamSpeeds = new Float32Array(streamCount);

    for (let i = 0; i < streamCount; i++) {
      streamPositions[i * 3] = -90 + Math.random() * 20;
      streamPositions[i * 3 + 1] = 5 + Math.random() * 65;
      streamPositions[i * 3 + 2] = -50 + Math.random() * 100;
      streamSpeeds[i] = 1.0 + Math.random() * 0.5;
    }

    const streamGeo = new THREE.BufferGeometry();
    streamGeo.setAttribute('position', new THREE.BufferAttribute(streamPositions, 3));
    const streamMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 2.2,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const streamlines = new THREE.Points(streamGeo, streamMat);
    scene.add(streamlines);
    windStreamlinesPointsRef.current = streamlines;

    // ========================================================
    // 7. POLAR SNOW PARTICLES (BLIZZARD SIMULATION)
    // ========================================================
    const snowCount = 1400;
    const snowPositions = new Float32Array(snowCount * 3);
    const snowVelocities = new Float32Array(snowCount * 3);

    for (let i = 0; i < snowCount; i++) {
      snowPositions[i * 3] = -120 + Math.random() * 240;
      snowPositions[i * 3 + 1] = Math.random() * 120;
      snowPositions[i * 3 + 2] = -120 + Math.random() * 240;

      snowVelocities[i * 3] = 0.5 + Math.random() * 1.5;
      snowVelocities[i * 3 + 1] = -(0.4 + Math.random() * 0.8);
      snowVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }

    const snowGeo = new THREE.BufferGeometry();
    snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));
    const snowPointsMat = new THREE.PointsMaterial({
      color: 0xf8fafc,
      size: 1.8,
      transparent: true,
      opacity: 0.85
    });
    const snowFlakes = new THREE.Points(snowGeo, snowPointsMat);
    scene.add(snowFlakes);
    snowFlakesPointsRef.current = snowFlakes;

    // ========================================================
    // 8. SUBSEA DOWNWELLING BRINE PLUME DISCHARGE PARTICLES
    // ========================================================
    const brineCount = 350;
    const brinePositions = new Float32Array(brineCount * 3);
    const brineSpeeds = new Float32Array(brineCount);

    for (let i = 0; i < brineCount; i++) {
      brinePositions[i * 3] = (Math.random() - 0.5) * 6;
      brinePositions[i * 3 + 1] = -72 - Math.random() * 35;
      brinePositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      brineSpeeds[i] = 0.6 + Math.random() * 0.8;
    }

    const brineGeo = new THREE.BufferGeometry();
    brineGeo.setAttribute('position', new THREE.BufferAttribute(brinePositions, 3));
    const brineMat = new THREE.PointsMaterial({
      color: 0x06b6d4,
      size: 2.8,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const brinePlume = new THREE.Points(brineGeo, brineMat);
    scene.add(brinePlume);
    brinePlumePointsRef.current = brinePlume;

    // ========================================================
    // 9. AT-SEA CRANE RIGGING & WATER SPLASH RING (DEPLOYMENT)
    // ========================================================
    const craneRigGroup = new THREE.Group();
    craneRigGroup.position.y = 110;

    // Heavy Lift Marine Spreader Bar (Yellow)
    const spreaderGeo = new THREE.BoxGeometry(32, 2.5, 6);
    const spreaderMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.8,
      roughness: 0.3
    });
    const spreader = new THREE.Mesh(spreaderGeo, spreaderMat);
    craneRigGroup.add(spreader);

    // Crane Hoist Top Block
    const hookGeo = new THREE.CylinderGeometry(1.5, 1.5, 8, 12);
    const hookMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });
    const hook = new THREE.Mesh(hookGeo, hookMat);
    hook.position.y = 5;
    craneRigGroup.add(hook);

    // 4 Steel Hoist Wire Cables descending to spar collar
    const cableMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
    const cableGeo = new THREE.CylinderGeometry(0.2, 0.2, 110, 8);
    cableGeo.translate(0, -55, 0);

    [-14, 14].forEach(cx => {
      [-2.5, 2.5].forEach(cz => {
        const cable = new THREE.Mesh(cableGeo, cableMat);
        cable.position.set(cx, 0, cz);
        craneRigGroup.add(cable);
      });
    });

    craneRigGroup.visible = false;
    scene.add(craneRigGroup);
    craneRigGroupRef.current = craneRigGroup;

    // Sea Water Splash Ring during water entry
    const splashGeo = new THREE.RingGeometry(18, 28, 32);
    splashGeo.rotateX(-Math.PI / 2);
    const splashMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.75,
      roughness: 0.1
    });
    const splashRing = new THREE.Mesh(splashGeo, splashMat);
    splashRing.position.y = 0.5;
    splashRing.visible = false;
    scene.add(splashRing);
    splashRingMeshRef.current = splashRing;

    // ========================================================
    // ANIMATION & PHYSICS TICK LOOP
    // ========================================================
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Advance 3D At-Sea Deployment Process Animation
      if (activeTabModeRef.current === 'deployment' && isDeployingAnimationPlayingRef.current) {
        setDeploymentProgress(prev => {
          const next = prev + delta * 12 * deploymentSpeedRef.current;
          if (next >= 100) {
            if (isDeploymentLoopingRef.current) {
              return 0;
            } else {
              setIsDeployingAnimationPlaying(false);
              isDeployingAnimationPlayingRef.current = false;
              return 100;
            }
          }
          return next;
        });
      }

      // 1. Rotate Wind Turbine Rotor
      if (rotorGroupRef.current) {
        const effectiveWind = isStormBrakeEngaged ? 0 : Math.max(0, windSpeedKnots);
        const icePenalty = isDeIcerActive ? 1.0 : Math.max(0.2, 1.0 - (iceThicknessMm * 0.25));
        let currentRpm = isStormBrakeEngaged ? 0 : Math.round((effectiveWind * 1.85) * icePenalty);

        // In deployment mode, rotor only starts spinning in Stage 5 (80% - 100%)
        if (activeTabModeRef.current === 'deployment') {
          if (deploymentProgress < 80) {
            currentRpm = 0;
          } else {
            currentRpm = Math.round(currentRpm * ((deploymentProgress - 80) / 20));
          }
        }

        const radPerSec = (currentRpm * 2 * Math.PI) / 60;
        rotorGroupRef.current.rotation.y += radPerSec * delta;

        // Sea Wave heave motion on Buoy
        if (platformRootRef.current && activeTabModeRef.current !== 'exploded' && activeTabModeRef.current !== 'deployment') {
          const heaveY = Math.sin(time * 1.5) * 0.8 + Math.cos(time * 0.8) * 0.4;
          const pitchZ = Math.sin(time * 1.2) * 0.02;
          const rollX = Math.cos(time * 1.4) * 0.02;
          platformRootRef.current.position.y = heaveY;
          platformRootRef.current.rotation.z = pitchZ;
          platformRootRef.current.rotation.x = rollX;
        } else if (platformRootRef.current && activeTabModeRef.current !== 'deployment') {
          platformRootRef.current.position.y = 0;
          platformRootRef.current.rotation.set(0, 0, 0);
        }
      }

      // 2. Animate Wind Streamlines
      if (windStreamlinesPointsRef.current && showStreamlines) {
        const pos = windStreamlinesPointsRef.current.geometry.attributes.position;
        const windFactor = (windSpeedKnots / 30) * 80;

        for (let i = 0; i < streamCount; i++) {
          let x = pos.getX(i);
          let y = pos.getY(i);
          let z = pos.getZ(i);

          x += delta * windFactor * streamSpeeds[i];

          if (x > 90) {
            x = -90;
            y = 5 + Math.random() * 65;
            z = -50 + Math.random() * 100;
          }

          pos.setXYZ(i, x, y, z);
        }
        pos.needsUpdate = true;
      }

      // 3. Animate Falling Snow Particles (Blizzard Physics)
      if (snowFlakesPointsRef.current && showSnowParticles) {
        const snowPos = snowFlakesPointsRef.current.geometry.attributes.position;
        const horizontalDrift = (windSpeedKnots / 25) * 45;

        for (let i = 0; i < snowCount; i++) {
          let sx = snowPos.getX(i);
          let sy = snowPos.getY(i);
          let sz = snowPos.getZ(i);

          sx += delta * horizontalDrift * snowVelocities[i * 3];
          sy += delta * 25 * snowVelocities[i * 3 + 1];
          sz += delta * 10 * snowVelocities[i * 3 + 2];

          if (sy < 0 || sx > 120) {
            sx = -120 + Math.random() * 80;
            sy = 80 + Math.random() * 40;
            sz = -120 + Math.random() * 240;
          }

          snowPos.setXYZ(i, sx, sy, sz);
        }
        snowPos.needsUpdate = true;
      }

      // 4. Animate Subsea Downwelling Brine Plume Jet
      if (brinePlumePointsRef.current && showBrinePlume) {
        const bPos = brinePlumePointsRef.current.geometry.attributes.position;
        const pumpSpeedFactor = (brinePumpingLpm / 300) * 22;

        for (let i = 0; i < brineCount; i++) {
          let bx = bPos.getX(i);
          let by = bPos.getY(i);
          let bz = bPos.getZ(i);

          by -= delta * pumpSpeedFactor * brineSpeeds[i];
          // Cone expansion as plume sinks
          bx += (Math.random() - 0.5) * delta * 4;
          bz += (Math.random() - 0.5) * delta * 4;

          if (by < -120) {
            by = -72;
            bx = (Math.random() - 0.5) * 5;
            bz = (Math.random() - 0.5) * 5;
          }

          bPos.setXYZ(i, bx, by, bz);
        }
        bPos.needsUpdate = true;
      }

      // Render Scene
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    const handleResize = () => {
      if (!canvasRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = canvasRef.current.clientWidth;
      const h = canvasRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  // Update Camera Coordinates
  const updateCameraPosition = (cam: THREE.PerspectiveCamera) => {
    const { theta, phi, radius } = cameraAnglesRef.current;
    const target = cameraTargetRef.current;

    const x = target.x + radius * Math.sin(phi) * Math.sin(theta);
    const y = target.y + radius * Math.cos(phi);
    const z = target.z + radius * Math.sin(phi) * Math.cos(theta);

    cam.position.set(x, y, z);
    cam.lookAt(target);
  };

  // Exploded Assembly Separation Animation Effect
  useEffect(() => {
    const p = activeTabMode === 'exploded' ? activeExplodedProgress / 100 : 0;

    // Separate mast cap upward
    if (mastCapMeshRef.current) {
      mastCapMeshRef.current.position.y = 45 + p * 30;
    }

    // Expand blades radially outward
    bladeMeshesRef.current.forEach((mesh) => {
      const angle = mesh.userData.baseAngle || 0;
      const offsetDist = p * 16;
      mesh.position.x = Math.cos(angle) * offsetDist;
      mesh.position.z = Math.sin(angle) * offsetDist;
    });

    // Lower flotation collar downward
    if (floatCollarMeshRef.current) {
      floatCollarMeshRef.current.position.y = 2 - p * 14;
    }

    // Lower subsea diffuser further down
    if (subseaDiffuserMeshRef.current) {
      subseaDiffuserMeshRef.current.position.y = -70 - p * 25;
    }

    // Reveal generator coils inside nacelle
    if (generatorCoilsMeshRef.current) {
      generatorCoilsMeshRef.current.position.y = 15 + p * 10;
    }
  }, [activeExplodedProgress, activeTabMode]);

  // 3D Deployment & Assembly Position Transformation Effect
  useEffect(() => {
    if (activeTabMode !== 'deployment') {
      if (craneRigGroupRef.current) craneRigGroupRef.current.visible = false;
      if (splashRingMeshRef.current) splashRingMeshRef.current.visible = false;
      if (subseaDiffuserMeshRef.current && activeTabMode !== 'exploded') subseaDiffuserMeshRef.current.position.y = -70;
      if (nacelleMeshRef.current && activeTabMode !== 'exploded') nacelleMeshRef.current.position.y = 15;
      if (generatorCoilsMeshRef.current && activeTabMode !== 'exploded') generatorCoilsMeshRef.current.position.y = 15;
      if (rotorGroupRef.current && activeTabMode !== 'exploded') rotorGroupRef.current.position.y = 20;
      if (platformRootRef.current && activeTabMode !== 'exploded') {
        platformRootRef.current.position.y = 0;
        platformRootRef.current.rotation.set(0, 0, 0);
      }
      if (activeTabMode !== 'exploded') {
        bladeMeshesRef.current.forEach((mesh) => {
          mesh.scale.set(1, 1, 1);
        });
      }
      if (brinePlumePointsRef.current) {
        brinePlumePointsRef.current.visible = showBrinePlume;
      }
      return;
    }

    const p = Math.min(100, Math.max(0, deploymentProgress));

    // Crane Rigging visibility and hoist retraction
    if (craneRigGroupRef.current) {
      craneRigGroupRef.current.visible = p < 85;
      craneRigGroupRef.current.position.y = p < 80 ? 110 : 110 + (p - 80) * 4;
    }

    // Stage 1: Spar Hull Lowering into ocean (0 - 20%)
    const p1 = Math.min(1, Math.max(0, p / 20));
    if (platformRootRef.current) {
      platformRootRef.current.position.y = (1 - p1) * 35;
      platformRootRef.current.rotation.z = (1 - p1) * 0.12;
    }

    // Sea water splash ring during water immersion
    if (splashRingMeshRef.current) {
      if (p > 12 && p < 35) {
        splashRingMeshRef.current.visible = true;
        const splashScale = 1 + (p - 12) * 0.08;
        splashRingMeshRef.current.scale.set(splashScale, 1, splashScale);
      } else {
        splashRingMeshRef.current.visible = false;
      }
    }

    // Stage 2: Deep Keel Sinking & Subsea Column Extension (20 - 40%)
    const p2 = Math.min(1, Math.max(0, (p - 20) / 20));
    if (subseaDiffuserMeshRef.current) {
      subseaDiffuserMeshRef.current.position.y = -20 - p2 * 50;
    }

    // Stage 3: Generator Nacelle Lowering onto Deck (40 - 60%)
    const p3 = Math.min(1, Math.max(0, (p - 40) / 20));
    const nacelleY = 15 + (1 - p3) * 55;
    if (nacelleMeshRef.current) {
      nacelleMeshRef.current.position.y = nacelleY;
    }
    if (generatorCoilsMeshRef.current) {
      generatorCoilsMeshRef.current.position.y = nacelleY;
    }

    // Stage 4: Rotor Group Lowering & Helical Blades Unfurling (60 - 80%)
    const p4 = Math.min(1, Math.max(0, (p - 60) / 20));
    if (rotorGroupRef.current) {
      rotorGroupRef.current.position.y = 20 + (1 - p4) * 60;
    }
    bladeMeshesRef.current.forEach((mesh) => {
      const bladeScale = 0.2 + p4 * 0.8;
      mesh.scale.set(bladeScale, 1, bladeScale);
    });

    // Stage 5: Commissioning Brine Plume (80 - 100%)
    if (brinePlumePointsRef.current) {
      brinePlumePointsRef.current.visible = p >= 85 && showBrinePlume;
    }
  }, [deploymentProgress, activeTabMode, showBrinePlume]);

  // Focus Camera on Selected Component
  const handleSelectComponent = (comp: TurbineComponentDetail) => {
    setSelectedComponentId(comp.id);
    setIsInspectorCardVisible(true);
    setIsClean3DViewActive(false);
    if (!cameraRef.current) return;

    cameraAnglesRef.current = {
      theta: comp.cameraTarget.theta,
      phi: comp.cameraTarget.phi,
      radius: comp.cameraTarget.radius
    };
    cameraTargetRef.current.set(0, comp.cameraTarget.y, 0);
    updateCameraPosition(cameraRef.current);
  };

  // Weather and Physics Updates
  useEffect(() => {
    if (deIceHeaterMaterialRef.current) {
      if (isDeIcerActive) {
        deIceHeaterMaterialRef.current.emissive.setHex(0xf97316);
        deIceHeaterMaterialRef.current.emissiveIntensity = 0.8;
      } else {
        deIceHeaterMaterialRef.current.emissive.setHex(0x0284c7);
        deIceHeaterMaterialRef.current.emissiveIntensity = 0.1;
      }
    }

    const effectiveWind = isStormBrakeEngaged ? 0 : windSpeedKnots;
    const icePenalty = isDeIcerActive ? 1.0 : Math.max(0.2, 1.0 - (iceThicknessMm * 0.25));
    const calculatedRpm = isStormBrakeEngaged ? 0 : Math.round((effectiveWind * 1.85) * icePenalty);
    setRotorRpm(calculatedRpm);

    const airDensity = 1.34;
    const sweptArea = 2.4;
    const vMs = effectiveWind * 0.5144;
    const cp = 0.36;
    const rawPower = 0.5 * airDensity * sweptArea * Math.pow(vMs, 3) * cp * icePenalty;
    const cappedPower = isStormBrakeEngaged ? 0 : Math.round(Math.min(1800, rawPower));
    setPowerWatts(cappedPower);

    const torque = calculatedRpm > 0 ? Math.round(cappedPower / ((calculatedRpm * 2 * Math.PI) / 60)) : 0;
    setAerodynamicTorqueNm(torque);
    setBrinePumpingLpm(Math.round(calculatedRpm * 5.8));

    if (isDeIcerActive) {
      setIceThicknessMm(prev => Math.max(0, Number((prev - 0.2).toFixed(1))));
      if (snowMeshRef.current) snowMeshRef.current.visible = false;
    } else {
      if (ambientTempC < 0 && (weatherCondition === 'blizzard' || weatherCondition === 'katabatic-storm')) {
        setIceThicknessMm(prev => Math.min(6.5, Number((prev + 0.15).toFixed(1))));
        if (snowMeshRef.current) {
          snowMeshRef.current.visible = true;
          snowMeshRef.current.scale.set(1 + iceThicknessMm * 0.1, 1 + iceThicknessMm * 0.3, 1 + iceThicknessMm * 0.1);
        }
      }
    }
  }, [windSpeedKnots, ambientTempC, weatherCondition, isDeIcerActive, isStormBrakeEngaged]);

  const handleApplyWeatherPreset = (preset: 'polar-sun' | 'marine-fog' | 'katabatic-storm' | 'blizzard') => {
    setWeatherCondition(preset);
    if (sceneRef.current) {
      switch (preset) {
        case 'polar-sun':
          sceneRef.current.background = new THREE.Color(0x0f2d4a);
          setAmbientTempC(-4);
          setWindSpeedKnots(18);
          setSnowIntensityPct(0);
          setShowSnowParticles(false);
          break;
        case 'marine-fog':
          sceneRef.current.background = new THREE.Color(0x1e293b);
          setAmbientTempC(-1);
          setWindSpeedKnots(24);
          setSnowIntensityPct(20);
          setShowSnowParticles(true);
          break;
        case 'katabatic-storm':
          sceneRef.current.background = new THREE.Color(0x050c18);
          setAmbientTempC(-18);
          setWindSpeedKnots(56);
          setSnowIntensityPct(60);
          setShowSnowParticles(true);
          break;
        case 'blizzard':
          sceneRef.current.background = new THREE.Color(0x06101e);
          setAmbientTempC(-26);
          setWindSpeedKnots(44);
          setSnowIntensityPct(90);
          setShowSnowParticles(true);
          break;
      }
    }
  };

  // Pointer Orbit Controls
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isPointerDownRef.current = true;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPointerDownRef.current || !cameraRef.current) return;
    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };

    cameraAnglesRef.current.theta -= dx * 0.008;
    cameraAnglesRef.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraAnglesRef.current.phi - dy * 0.008));
    updateCameraPosition(cameraRef.current);
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (!cameraRef.current) return;
    cameraAnglesRef.current.radius = Math.max(35, Math.min(300, cameraAnglesRef.current.radius + e.deltaY * 0.15));
    updateCameraPosition(cameraRef.current);
  };

  return (
    <div className="space-y-6 font-mono text-xs animate-fade-in">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border border-sky-800/60 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30 flex items-center space-x-1.5 shadow-sm">
                <Wind className="w-3.5 h-3.5 text-sky-400 animate-spin-slow" />
                <span>POLAR SAVONIUS WIND TURBINE PLATFORM</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-800">
                3D MECHANICAL ARCHITECTURE
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] bg-slate-950 text-slate-300 border border-slate-800">
                DIRECT-DRIVE AMOC PUMP
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              3D Wind Turbine Platform Design & Operation
            </h1>
            <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
              Engineered specifically for harsh sub-Antarctic polar oceans: see how the omnidirectional vertical-axis helical rotor runs, harvests kinetic wind energy, drives deepwater brine downwelling, and sheds freezing snow and rime ice.
            </p>
          </div>

          {/* Quick De-Icing Master Switch & Deployment Trigger */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleTriggerDeploymentAnimation}
              className="px-4 py-3 rounded-2xl font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-lg active:scale-95 bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 hover:from-sky-500 hover:to-indigo-500 text-white ring-2 ring-sky-400/60 shadow-sky-950/60"
            >
              <Play className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
              <span>TRIGGER 3D AT-SEA DEPLOYMENT ANIMATION</span>
            </button>

            <button
              onClick={() => setIsDeIcerActive(!isDeIcerActive)}
              className={`px-4 py-3 rounded-2xl font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
                isDeIcerActive 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 ring-2 ring-amber-400 shadow-amber-950/60' 
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              <Flame className={`w-4 h-4 ${isDeIcerActive ? 'text-slate-950 animate-bounce' : 'text-slate-500'}`} />
              <span>{isDeIcerActive ? 'THERMAL DE-ICER: ACTIVE' : 'DE-ICER: OFF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio View Mode Navigation Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 p-2 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTabMode('how-it-works')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              activeTabMode === 'how-it-works'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-950'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-400'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-sky-300" />
            <span>HOW IT RUNS & WORKS (4 PHASES)</span>
          </button>

          <button
            onClick={() => {
              setActiveTabMode('deployment');
              if (deploymentProgress === 0) {
                setIsDeployingAnimationPlaying(true);
              }
            }}
            className={`px-4 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              activeTabMode === 'deployment'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950 ring-2 ring-indigo-400/50'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-400'
            }`}
          >
            <Ship className="w-4 h-4 text-sky-400" />
            <span>3D AT-SEA DEPLOYMENT & ASSEMBLY (5 PHASES)</span>
          </button>

          <button
            onClick={() => setActiveTabMode('exploded')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              activeTabMode === 'exploded'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-950'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-400'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-300" />
            <span>3D EXPLODED ASSEMBLY & CAD VIEW</span>
          </button>

          <button
            onClick={() => setActiveTabMode('simulation')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              activeTabMode === 'simulation'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-400'
            }`}
          >
            <Wind className="w-4 h-4 text-emerald-300" />
            <span>EXTREMES & SNOW SIMULATION</span>
          </button>
        </div>

        {activeTabMode === 'deployment' && (
          <div className="flex flex-wrap items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-indigo-800/80">
            <button
              onClick={() => setIsDeployingAnimationPlaying(!isDeployingAnimationPlaying)}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center space-x-1 cursor-pointer text-[11px]"
            >
              {isDeployingAnimationPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              <span>{isDeployingAnimationPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={() => {
                setDeploymentProgress(0);
                setIsDeployingAnimationPlaying(true);
              }}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              title="Restart Deployment"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-indigo-300 font-bold">Assembly Progress:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(deploymentProgress)}
              onChange={(e) => {
                setIsDeployingAnimationPlaying(false);
                setDeploymentProgress(Number(e.target.value));
              }}
              className="w-24 sm:w-36 accent-indigo-500 cursor-pointer"
            />
            <span className="text-white font-bold text-[11px]">{Math.round(deploymentProgress)}%</span>
          </div>
        )}

        {activeTabMode === 'exploded' && (
          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 font-bold">Explode Distance:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={activeExplodedProgress}
              onChange={(e) => setActiveExplodedProgress(Number(e.target.value))}
              className="w-24 sm:w-36 accent-amber-500 cursor-pointer"
            />
            <span className="text-white font-bold text-[11px]">{activeExplodedProgress}%</span>
          </div>
        )}
      </div>

      {/* Physics Telemetry HUD Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
            <Wind className="w-3.5 h-3.5 text-sky-400" />
            <span>WIND VELOCITY:</span>
          </div>
          <span className="text-lg font-bold text-sky-300 block">{windSpeedKnots} kts</span>
          <span className="text-[10px] text-slate-500 block">Beaufort Force {windSpeedKnots < 28 ? '6 (Strong)' : windSpeedKnots < 48 ? '8 (Gale)' : '10 (Storm)'}</span>
        </div>

        <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
            <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>ROTOR RPM:</span>
          </div>
          <span className="text-lg font-bold text-emerald-400 block">{rotorRpm} RPM</span>
          <span className="text-[10px] text-slate-500 block">TSR (λ) = 1.15 Optimal</span>
        </div>

        <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>POWER OUTPUT:</span>
          </div>
          <span className="text-lg font-bold text-amber-300 block">{powerWatts} W</span>
          <span className="text-[10px] text-slate-500 block">~{(powerWatts * 0.024).toFixed(1)} kWh/Day</span>
        </div>

        <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
            <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
            <span>BLADE ICE LOAD:</span>
          </div>
          <span className={`text-lg font-bold block ${iceThicknessMm > 2 ? 'text-rose-400 animate-pulse' : 'text-cyan-300'}`}>
            {iceThicknessMm} mm
          </span>
          <span className="text-[10px] text-slate-500 block">{isDeIcerActive ? 'Heater Shedding Ice' : 'Rime Ice Building'}</span>
        </div>

        <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
            <Thermometer className="w-3.5 h-3.5 text-rose-400" />
            <span>AMBIENT TEMP:</span>
          </div>
          <span className="text-lg font-bold text-rose-400 block">{ambientTempC}°C</span>
          <span className="text-[10px] text-slate-500 block">Wind Chill: {Math.round(ambientTempC - (windSpeedKnots * 0.4))}°C</span>
        </div>

        <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
            <Waves className="w-3.5 h-3.5 text-teal-400" />
            <span>BRINE PUMPING:</span>
          </div>
          <span className="text-lg font-bold text-teal-300 block">{brinePumpingLpm} L/min</span>
          <span className="text-[10px] text-slate-500 block">Torque: {aerodynamicTorqueNm} N·m</span>
        </div>
      </div>

      {/* Main 3D Interactive Canvas & Floating HUD */}
      <div 
        ref={containerRef}
        className="relative w-full h-[460px] sm:h-[580px] lg:h-[640px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onWheel={handleWheel}
        />

        {/* VIEWPORT CONTROLS & HUD */}
        
        {/* Top-Right Master Control: Clear View / Hide HUD Toggle */}
        <div className="absolute top-3 right-3 z-30 flex items-center space-x-2">
          <button
            onClick={() => setIsClean3DViewActive(!isClean3DViewActive)}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 text-xs transition-all cursor-pointer shadow-2xl ${
              isClean3DViewActive
                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 font-black animate-pulse'
                : 'bg-slate-900/95 text-sky-300 border border-slate-700 hover:text-white hover:bg-slate-800'
            }`}
            title="Toggle full 3D view without overlays"
          >
            {isClean3DViewActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{isClean3DViewActive ? 'Show Controls & HUD' : 'Clear View / Hide HUD'}</span>
          </button>
        </div>

        {/* Regular Overlays (Hidden when isClean3DViewActive is true) */}
        {!isClean3DViewActive && (
          <>
            {/* Viewport Top Left: Weather Condition Presets (or Deployment Stage Banner) */}
            {activeTabMode === 'deployment' ? (
              <div className="absolute top-3 left-3 z-20 bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl border border-indigo-700 shadow-2xl space-y-1 max-w-[280px] sm:max-w-sm pointer-events-auto animate-fade-in">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-indigo-400 flex items-center space-x-1">
                    <Ship className="w-3.5 h-3.5 text-sky-400" />
                    <span>AT-SEA ASSEMBLY SEQUENCE</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
                    {Math.round(deploymentProgress)}%
                  </span>
                </div>
                <div className="text-white font-extrabold text-xs">
                  Stage {Math.min(5, Math.floor(deploymentProgress / 20) + 1)}: {DEPLOYMENT_STAGES[Math.min(4, Math.floor(deploymentProgress / 20))].name}
                </div>
                <p className="text-[10px] text-slate-300 leading-tight">
                  {DEPLOYMENT_STAGES[Math.min(4, Math.floor(deploymentProgress / 20))].desc}
                </p>
                <div className="text-[9px] text-cyan-300 font-mono pt-0.5 border-t border-slate-800/80">
                  {DEPLOYMENT_STAGES[Math.min(4, Math.floor(deploymentProgress / 20))].stats}
                </div>
              </div>
            ) : (
              <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-xl max-w-[230px] sm:max-w-xs">
                <span className="text-[9px] text-slate-400 font-bold px-1.5 py-0.5 block w-full border-b border-slate-800">
                  WEATHER CONDITION:
                </span>
                {[
                  { id: 'blizzard', label: 'Blizzard', icon: Snowflake, color: 'text-sky-300' },
                  { id: 'katabatic-storm', label: 'Gale', icon: Wind, color: 'text-cyan-300' },
                  { id: 'marine-fog', label: 'Fog', icon: CloudFog, color: 'text-slate-300' },
                  { id: 'polar-sun', label: 'Sun', icon: Sun, color: 'text-amber-300' }
                ].map(w => {
                  const Icon = w.icon;
                  return (
                    <button
                      key={w.id}
                      onClick={() => handleApplyWeatherPreset(w.id as any)}
                      className={`px-2 py-1 rounded-lg font-bold flex items-center space-x-1 text-[10px] cursor-pointer transition-all ${
                        weatherCondition === w.id
                          ? 'bg-sky-600 text-white shadow-md'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <Icon className={`w-3 h-3 ${w.color}`} />
                      <span>{w.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Viewport Top Right (Below Toggle): Subsystem Selector */}
            {activeTabMode !== 'deployment' && (
              <div className="absolute top-12 right-3 z-20 flex flex-col items-end gap-1 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-xl text-[10px] max-w-[240px] sm:max-w-xs">
                <span className="text-slate-400 font-bold block mb-0.5 text-[9px]">INSPECT SUBSYSTEM:</span>
                <div className="flex flex-wrap justify-end gap-1">
                  {TURBINE_COMPONENTS.map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleSelectComponent(c)}
                      className={`px-2 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer text-[10px] ${
                        selectedComponentId === c.id && isInspectorCardVisible
                          ? 'bg-sky-500 text-slate-950 shadow-sm'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {c.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Viewport Component Inspector Card (COLLAPSIBLE TO PREVENT BLOCKING VIEW) */}
            {isInspectorCardVisible ? (
              <div className="absolute bottom-16 left-3 right-3 sm:right-auto max-w-sm z-20 bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl border border-sky-600 shadow-2xl space-y-2 pointer-events-auto animate-fade-in ring-1 ring-sky-500/50">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <div className="min-w-0 pr-2">
                    <span className="text-[9px] text-amber-400 font-bold block uppercase tracking-wider truncate">{activeComponent.category}</span>
                    <h4 className="text-xs font-bold text-white tracking-tight truncate">{activeComponent.name}</h4>
                  </div>
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <span className="text-[9px] font-mono bg-sky-950 text-sky-300 px-1.5 py-0.5 rounded border border-sky-800">
                      {activeComponent.partNo}
                    </span>
                    <button
                      onClick={() => setIsInspectorCardVisible(false)}
                      className="p-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 flex items-center justify-center cursor-pointer transition-colors"
                      title="Close Card & Clear 3D View"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-[10px] text-slate-300 leading-relaxed max-h-24 overflow-y-auto">
                  {activeComponent.howItWorks}
                </p>

                <div className="pt-1 flex flex-col gap-0.5 text-[9px] font-mono text-slate-400 border-t border-slate-800/80">
                  <div className="truncate"><strong className="text-slate-300">Physics:</strong> <span className="text-cyan-300">{activeComponent.physicsFormula}</span></div>
                  <div className="truncate"><strong className="text-slate-300">Polar Spec:</strong> {activeComponent.specs}</div>
                </div>

                <div className="pt-1 flex justify-between items-center text-[9px] text-slate-400 border-t border-slate-800/60">
                  <span>Orbit/zoom freely behind this card</span>
                  <button
                    onClick={() => setIsInspectorCardVisible(false)}
                    className="text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
                  >
                    Hide Overlay ✕
                  </button>
                </div>
              </div>
            ) : (
              <div className="absolute bottom-14 left-3 z-20">
                <button
                  onClick={() => setIsInspectorCardVisible(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-sky-700/80 hover:border-sky-400 text-sky-200 hover:text-white font-bold flex items-center space-x-1.5 shadow-xl cursor-pointer text-[11px]"
                  title="Expand component detail card"
                >
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  <span>Inspect: {activeComponent.name.split(' ')[0]} ▴</span>
                </button>
              </div>
            )}

            {/* Viewport Bottom Overlay: Real-Time Streamline & Snow Particle Toggles */}
            <div className="absolute bottom-2 left-2 right-2 sm:left-4 sm:right-4 z-20 flex flex-wrap items-center justify-between gap-2 bg-slate-950/85 backdrop-blur-md p-2 rounded-2xl border border-slate-800 text-[10px]">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <label className="flex items-center space-x-1 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={showStreamlines}
                    onChange={(e) => setShowStreamlines(e.target.checked)}
                    className="rounded accent-sky-500 scale-90"
                  />
                  <span>Streamlines</span>
                </label>

                <label className="flex items-center space-x-1 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={showSnowParticles}
                    onChange={(e) => setShowSnowParticles(e.target.checked)}
                    className="rounded accent-sky-500 scale-90"
                  />
                  <span>Snow</span>
                </label>

                <label className="flex items-center space-x-1 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={showBrinePlume}
                    onChange={(e) => setShowBrinePlume(e.target.checked)}
                    className="rounded accent-cyan-500 scale-90"
                  />
                  <span>Brine Jet</span>
                </label>

                <label className="flex items-center space-x-1 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={isStormBrakeEngaged}
                    onChange={(e) => setIsStormBrakeEngaged(e.target.checked)}
                    className="rounded accent-rose-500 scale-90"
                  />
                  <span className={isStormBrakeEngaged ? 'text-rose-400 font-bold' : ''}>
                    Brake
                  </span>
                </label>
              </div>

              <div className="text-[9px] text-slate-400 hidden md:block">
                Drag to Orbit • Scroll to Zoom
              </div>
            </div>
          </>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SECTION: 3D AT-SEA DEPLOYMENT & ASSEMBLY SEQUENCE (5 STAGES) */}
      {/* ========================================================================= */}
      {activeTabMode === 'deployment' && (
        <div className="p-6 bg-slate-900/90 border border-indigo-700/80 rounded-3xl space-y-6 shadow-2xl animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center space-x-1">
                  <Ship className="w-3 h-3 text-sky-400" />
                  <span>OFFSHORE INSTALLATION SPECIFICATION</span>
                </span>
                <span className="text-white font-bold text-xs">
                  STAGE {Math.min(5, Math.floor(deploymentProgress / 20) + 1)} OF 5
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1 flex items-center space-x-2">
                <span>At-Sea Turbine Platform Deployment & Assembly Procedure</span>
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Click any stage below to jump the 3D model directly to that point in the assembly, or use Play/Pause above to watch the full cinematic sequence.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => setIsDeployingAnimationPlaying(!isDeployingAnimationPlaying)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                {isDeployingAnimationPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isDeployingAnimationPlaying ? 'Pause Assembly' : 'Play 3D Assembly'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono">
            {DEPLOYMENT_STAGES.map((s, idx) => {
              const currentStageIdx = Math.min(4, Math.floor(deploymentProgress / 20));
              const isCurrent = currentStageIdx === idx;
              const isDone = currentStageIdx > idx;

              return (
                <div
                  key={s.stage}
                  onClick={() => {
                    setIsDeployingAnimationPlaying(false);
                    setDeploymentProgress(idx * 20);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isCurrent
                      ? 'bg-indigo-950/80 border-indigo-500 ring-2 ring-indigo-400/50 shadow-xl'
                      : isDone
                      ? 'bg-slate-950/80 border-emerald-800/80 hover:border-slate-700'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold ${
                        isCurrent ? 'bg-indigo-600 text-white' : isDone ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isDone ? <Check className="w-3.5 h-3.5" /> : s.stage}
                      </span>
                      <span className="text-slate-400">{s.range}</span>
                    </div>

                    <h4 className="text-xs font-bold text-white pt-1">
                      {s.name}
                    </h4>

                    <p className="text-[10px] text-slate-300 font-sans leading-relaxed">
                      {s.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[9px] text-sky-400 font-mono">
                    {s.stats}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 1: HOW IT RUNS & WORKS (4 PHASES WALKTHROUGH) */}
      {/* ========================================================================= */}
      <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-sky-400" />
              <span>How the SaliBuoy Wind Platform Runs & Operates in Extreme Polar Seas</span>
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Step-by-step kinetic transfer from sub-Antarctic wind shear down to abyssal AMOC thermohaline downwelling.
            </p>
          </div>
          <span className="px-3 py-1 bg-sky-950 text-sky-300 border border-sky-800 rounded-xl text-xs font-mono font-bold">
            ZERO-GEARBOX DIRECT-DRIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Phase 1 */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-950 border border-sky-800 flex items-center justify-center font-bold text-sky-400">
              1
            </div>
            <h4 className="text-sm font-bold text-white">Omnidirectional Wind Capture</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Savonius drag cups produce high static torque at low start-up speeds (3 knots). As angular velocity climbs, Darrieus helical aerodynamic lift foils take over, yielding a clean power coefficient ($C_p = 0.38$) without needing yaw steering motors.
            </p>
            <div className="text-[10px] text-sky-400 font-mono pt-1 border-t border-slate-800">
              Aerodynamic Limit: 38% Betz Eff.
            </div>
          </div>

          {/* Phase 2 */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-950 border border-amber-800 flex items-center justify-center font-bold text-amber-400">
              2
            </div>
            <h4 className="text-sm font-bold text-white">Direct-Drive Magnetic Generation</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              The vertical titanium shaft spins a sealed 24-pole Neodymium NdFeB magnet rotor past stationary copper coils inside the dry nitrogen nacelle. Operates at 96% electrical efficiency with zero gear oil to freeze or sludge at -30°C.
            </p>
            <div className="text-[10px] text-amber-400 font-mono pt-1 border-t border-slate-800">
              Output: Up to 1.8 kW @ 75 kts
            </div>
          </div>

          {/* Phase 3 */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center font-bold text-cyan-400">
              3
            </div>
            <h4 className="text-sm font-bold text-white">Abyssal Brine Pumping Jet</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              The mechanical shaft extends through ceramic seals down to a 70m subsea Archimedean screw pump. Kinetic rotation directly accelerates heavy high-salinity brine downwards at 0.85 m/s, stabilizing the global AMOC thermohaline circulation.
            </p>
            <div className="text-[10px] text-cyan-400 font-mono pt-1 border-t border-slate-800">
              Pumping Rate: 310 L/min @ 54 RPM
            </div>
          </div>

          {/* Phase 4 */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-950 border border-rose-800 flex items-center justify-center font-bold text-rose-400">
              4
            </div>
            <h4 className="text-sm font-bold text-white">Electro-Thermal Anti-Icing</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              When freezing spray or polar snow threatens to foul the blade aerofoils, internal carbon nanotube ribbons pulse 180W of thermal heat. Snow and rime ice melt instantly, restoring aerodynamic laminar flow and battery buffer charging.
            </p>
            <div className="text-[10px] text-rose-400 font-mono pt-1 border-t border-slate-800">
              De-Ice Draw: 180W (Thermal Flush)
            </div>
          </div>

        </div>
      </div>

      {/* Physics Sliders & Weather Customization Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/90 p-5 rounded-3xl border border-slate-800">
        
        {/* Wind Speed Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-bold flex items-center space-x-1.5">
              <Wind className="w-4 h-4 text-sky-400" />
              <span>Wind Speed Control:</span>
            </span>
            <span className="text-sky-400 font-bold text-sm">{windSpeedKnots} Knots ({Math.round(windSpeedKnots * 0.5144)} m/s)</span>
          </div>
          <input
            type="range"
            min="0"
            max="75"
            value={windSpeedKnots}
            onChange={(e) => setWindSpeedKnots(Number(e.target.value))}
            className="w-full accent-sky-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Calm (0 kts)</span>
            <span>Optimal (30 kts)</span>
            <span>Katabatic Storm (75 kts)</span>
          </div>
        </div>

        {/* Ambient Temperature Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-bold flex items-center space-x-1.5">
              <Thermometer className="w-4 h-4 text-rose-400" />
              <span>Polar Temperature:</span>
            </span>
            <span className="text-rose-400 font-bold text-sm">{ambientTempC}°C ({Math.round((ambientTempC * 9/5) + 32)}°F)</span>
          </div>
          <input
            type="range"
            min="-35"
            max="10"
            value={ambientTempC}
            onChange={(e) => setAmbientTempC(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Sub-Zero (-35°C)</span>
            <span>Freezing (0°C)</span>
            <span>Mild (+10°C)</span>
          </div>
        </div>

        {/* Snow & Blizzard Intensity Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-bold flex items-center space-x-1.5">
              <Snowflake className="w-4 h-4 text-cyan-400" />
              <span>Snow Precipitation Rate:</span>
            </span>
            <span className="text-cyan-400 font-bold text-sm">{snowIntensityPct}% Intensity</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={snowIntensityPct}
            onChange={(e) => setSnowIntensityPct(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Clear Skies</span>
            <span>Moderate Snow</span>
            <span>Whiteout Blizzard</span>
          </div>
        </div>

      </div>

    </div>
  );
};
