import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { 
  CloudRain, 
  Wind, 
  Thermometer, 
  Activity, 
  Compass, 
  Gauge, 
  Layers, 
  Eye, 
  Globe2, 
  MapPin, 
  Navigation, 
  RefreshCw, 
  Download, 
  AlertTriangle, 
  ShieldCheck, 
  Flame, 
  Zap, 
  Sparkles, 
  Maximize2, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  ChevronRight, 
  Search, 
  Radio, 
  Info,
  Clock,
  Send,
  Droplets
} from 'lucide-react';
import { LocationIntel, WeatherPattern3DData, PollutionReportData } from '../types';
import { PRESET_OBSERVATORIES, calculateLocationDynamics, getCompassHeading } from '../services/weatherPollutionService';
import { SmsAlertsModal } from './SmsAlertsModal';

type VisualLayerMode = 'composite' | 'weather' | 'co2' | 'methane';
type TimeForecastHorizon = 0 | 6 | 12 | 24 | 48;

export const WeatherPollution3DModel: React.FC = () => {
  // Location selection state
  const [selectedLocation, setSelectedLocation] = useState<LocationIntel>(PRESET_OBSERVATORIES[0]);
  const [locationsList, setLocationsList] = useState<LocationIntel[]>(PRESET_OBSERVATORIES);
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Custom coordinate inputs
  const [customLat, setCustomLat] = useState<string>('-41.408');
  const [customLng, setCustomLng] = useState<string>('174.871');
  const [customName, setCustomName] = useState<string>('Custom Marine Observatory');

  // 3D Visualization Controls
  const [layerMode, setLayerMode] = useState<VisualLayerMode>('composite');
  const [forecastHorizon, setForecastHorizon] = useState<TimeForecastHorizon>(0);
  const [isPlayingAnimation, setIsPlayingAnimation] = useState<boolean>(true);
  const [animationSpeed, setAnimationSpeed] = useState<number>(1.0);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Modals & Export state
  const [isSmsModalOpen, setIsSmsModalOpen] = useState<boolean>(false);
  const [isFetchingReport, setIsFetchingReport] = useState<boolean>(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>(new Date().toLocaleTimeString());

  // Three.js Mount Ref
  const mountRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Three.js references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const cloudMeshRef = useRef<THREE.Mesh | null>(null);
  const windStreamlinesRef = useRef<THREE.Points | null>(null);
  const co2PlumePointsRef = useRef<THREE.Points | null>(null);
  const ch4PlumePointsRef = useRef<THREE.Points | null>(null);
  const beaconMeshRef = useRef<THREE.Group | null>(null);
  const jetStreamRef = useRef<THREE.Line | null>(null);

  // Controls state for mouse interaction
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Convert Lat / Lng to 3D Cartesian coordinates on sphere of radius R
  const latLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  // Convert Vector3 on sphere back to Lat / Lng
  const vector3ToLatLng = (vector: THREE.Vector3): { lat: number; lng: number } => {
    const norm = vector.clone().normalize();
    const lat = 90 - (Math.acos(norm.y) * 180) / Math.PI;
    let lng = ((Math.atan2(norm.z, -norm.x) * 180) / Math.PI) - 180;
    while (lng < -180) lng += 360;
    while (lng > 180) lng -= 360;
    return { lat, lng };
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 560;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 5, 24);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x0f2744, 1.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff6e5, 2.4);
    sunLight.position.set(20, 15, 25);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    rimLight.position.set(-25, -10, -20);
    scene.add(rimLight);

    // 5. Globe Group (Rotatable)
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    const GLOBE_RADIUS = 7.0;

    // Create Earth sphere with ocean base and continental elevation highlights
    const earthGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Base deep ocean
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
      oceanGrad.addColorStop(0, '#020b18');
      oceanGrad.addColorStop(0.3, '#041c38');
      oceanGrad.addColorStop(0.7, '#082f49');
      oceanGrad.addColorStop(1, '#020d1c');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, 1024, 512);

      // Procedural continents approximation
      ctx.fillStyle = '#0f3854';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.5;

      // Draw stylized continents & islands
      const drawLand = (x: number, y: number, w: number, h: number, r: number) => {
        ctx.beginPath();
        ctx.ellipse(x, y, w, h, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      };

      // Australia & New Zealand (Primary region)
      drawLand(860, 370, 55, 38, 0.1); // Australia
      drawLand(945, 405, 14, 28, 0.4); // New Zealand North & South Island
      drawLand(880, 440, 16, 12, 0); // Tasmania
      // Antarctica
      drawLand(512, 495, 480, 28, 0);
      // North America
      drawLand(280, 160, 95, 60, -0.2);
      // South America
      drawLand(360, 320, 52, 90, 0.3);
      // Eurasia
      drawLand(680, 150, 140, 70, 0.1);
      // Africa
      drawLand(550, 260, 60, 80, 0.05);

      // Latitude lines & Equator
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 1;
      for (let latY = 64; latY < 512; latY += 64) {
        ctx.beginPath();
        ctx.moveTo(0, latY);
        ctx.lineTo(1024, latY);
        ctx.stroke();
      }
      // Longitude lines
      for (let lonX = 64; lonX < 1024; lonX += 64) {
        ctx.beginPath();
        ctx.moveTo(lonX, 0);
        ctx.lineTo(lonX, 512);
        ctx.stroke();
      }
    }

    const earthTexture = new THREE.CanvasTexture(canvas);
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      shininess: 35,
      specular: new THREE.Color(0x38bdf8),
      emissive: new THREE.Color(0x02162e)
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earthMesh);

    // Atmospheric Glow Outer Sphere
    const atmosphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.035, 64, 64);
    const atmosphereMaterial = new THREE.MeshLambertMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphereMesh);

    // 6. Volumetric 3D Cloud Layer
    const cloudGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.025, 48, 48);
    const cloudCanvas = document.createElement('canvas');
    cloudCanvas.width = 1024;
    cloudCanvas.height = 512;
    const cloudCtx = cloudCanvas.getContext('2d');
    if (cloudCtx) {
      cloudCtx.fillStyle = 'rgba(0,0,0,0)';
      cloudCtx.fillRect(0, 0, 1024, 512);

      // Cloud swirls
      const drawCloudBand = (yCenter: number, spread: number, count: number) => {
        for (let i = 0; i < count; i++) {
          const x = (i / count) * 1024 + Math.sin(i) * 30;
          const y = yCenter + Math.sin(i * 1.8) * spread;
          const rad = 25 + Math.sin(i * 3) * 18;
          const grad = cloudCtx.createRadialGradient(x, y, 2, x, y, rad);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
          grad.addColorStop(0.5, 'rgba(240, 249, 255, 0.45)');
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          cloudCtx.fillStyle = grad;
          cloudCtx.beginPath();
          cloudCtx.arc(x, y, rad, 0, Math.PI * 2);
          cloudCtx.fill();
        }
      };

      // Roaring Forties storm swirl band (Southern Ocean ~45-55S)
      drawCloudBand(390, 35, 26);
      // Subtropical Convergence Zone (~30S)
      drawCloudBand(330, 25, 20);
      // Intertropical Convergence Zone (Equator)
      drawCloudBand(256, 18, 30);
      // Northern storm band
      drawCloudBand(140, 30, 22);
    }

    const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
    const cloudMaterial = new THREE.MeshLambertMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.NormalBlending
    });
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    globeGroup.add(cloudMesh);
    cloudMeshRef.current = cloudMesh;

    // 7. Dynamic Wind Streamlines (Particles orbiting the globe)
    const particleCount = 1200;
    const windPositions = new Float32Array(particleCount * 3);
    const windColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Stratify into wind belts (Trades, Westerlies, Polar)
      const lat = (Math.random() - 0.5) * 160;
      const lng = (Math.random() - 0.5) * 360;
      const alt = GLOBE_RADIUS * (1.04 + Math.random() * 0.05);
      const pos = latLngToVector3(lat, lng, alt);

      windPositions[i * 3] = pos.x;
      windPositions[i * 3 + 1] = pos.y;
      windPositions[i * 3 + 2] = pos.z;

      // Color coding: Fast westerlies cyan/white, tropical gold/green
      if (Math.abs(lat) > 40 && Math.abs(lat) < 60) {
        // Roaring Forties gale winds: Bright cyan
        windColors[i * 3] = 0.2;
        windColors[i * 3 + 1] = 0.85;
        windColors[i * 3 + 2] = 1.0;
      } else if (Math.abs(lat) < 20) {
        // Trade winds: Golden emerald
        windColors[i * 3] = 0.3;
        windColors[i * 3 + 1] = 0.95;
        windColors[i * 3 + 2] = 0.6;
      } else {
        // Mid-latitude breeze: Ice blue
        windColors[i * 3] = 0.6;
        windColors[i * 3 + 1] = 0.8;
        windColors[i * 3 + 2] = 1.0;
      }
    }

    const windGeometry = new THREE.BufferGeometry();
    windGeometry.setAttribute('position', new THREE.BufferAttribute(windPositions, 3));
    windGeometry.setAttribute('color', new THREE.BufferAttribute(windColors, 3));

    const windMaterial = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const windStreamlines = new THREE.Points(windGeometry, windMaterial);
    globeGroup.add(windStreamlines);
    windStreamlinesRef.current = windStreamlines;

    // 8. 3D Jet Stream Ribbon (Polar Jet Stream curvature in Southern Hemisphere)
    const jetCurvePoints: THREE.Vector3[] = [];
    const jetRadius = GLOBE_RADIUS * 1.07;
    for (let angle = 0; angle <= Math.PI * 2; angle += Math.PI / 32) {
      const lat = -48 + Math.sin(angle * 4) * 8; // Rossby waves
      const lng = (angle * 180) / Math.PI - 180;
      jetCurvePoints.push(latLngToVector3(lat, lng, jetRadius));
    }
    const jetGeometry = new THREE.BufferGeometry().setFromPoints(jetCurvePoints);
    const jetMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 3,
      transparent: true,
      opacity: 0.75
    });
    const jetStreamLine = new THREE.Line(jetGeometry, jetMaterial);
    globeGroup.add(jetStreamLine);
    jetStreamRef.current = jetStreamLine;

    // 9. CO2 Plume Dispersion Layer (Particles with orange/red hotspot vs emerald ocean sinks)
    const co2Count = 500;
    const co2Positions = new Float32Array(co2Count * 3);
    const co2Colors = new Float32Array(co2Count * 3);

    for (let i = 0; i < co2Count; i++) {
      let lat = (Math.random() - 0.5) * 160;
      let lng = (Math.random() - 0.5) * 360;

      // Bias half toward known industrial/volcanic hotspots or ocean sinks
      if (i < 200) {
        // Oceania / Southern Ocean sink zone
        lat = -35 - Math.random() * 25;
        lng = 150 + Math.random() * 40;
      }

      const alt = GLOBE_RADIUS * (1.05 + Math.random() * 0.04);
      const pos = latLngToVector3(lat, lng, alt);
      co2Positions[i * 3] = pos.x;
      co2Positions[i * 3 + 1] = pos.y;
      co2Positions[i * 3 + 2] = pos.z;

      // Color: Green/cyan for downwelling sinks (415 ppm), Orange/amber for hotspots (440+ ppm)
      if (lat < -42) {
        // High-latitude ocean sink: Emerald green
        co2Colors[i * 3] = 0.1;
        co2Colors[i * 3 + 1] = 0.95;
        co2Colors[i * 3 + 2] = 0.45;
      } else {
        // Urban/volcanic plume: Radiant amber/orange
        co2Colors[i * 3] = 0.98;
        co2Colors[i * 3 + 1] = 0.48;
        co2Colors[i * 3 + 2] = 0.12;
      }
    }

    const co2Geometry = new THREE.BufferGeometry();
    co2Geometry.setAttribute('position', new THREE.BufferAttribute(co2Positions, 3));
    co2Geometry.setAttribute('color', new THREE.BufferAttribute(co2Colors, 3));
    const co2Material = new THREE.PointsMaterial({
      size: 0.24,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const co2Points = new THREE.Points(co2Geometry, co2Material);
    globeGroup.add(co2Points);
    co2PlumePointsRef.current = co2Points;

    // 10. Methane (CH4) Plumes & Hydrate Seeps Layer (Glowing Magenta / Golden particles)
    const ch4Count = 350;
    const ch4Positions = new Float32Array(ch4Count * 3);
    const ch4Colors = new Float32Array(ch4Count * 3);

    for (let i = 0; i < ch4Count; i++) {
      let lat = -40 + (Math.random() - 0.5) * 8; // East Coast NZ / Hikurangi Margin
      let lng = 176 + (Math.random() - 0.5) * 6;
      if (i > 150) {
        // Global wetlands / agriculture
        lat = (Math.random() - 0.5) * 140;
        lng = (Math.random() - 0.5) * 360;
      }

      const alt = GLOBE_RADIUS * (1.05 + Math.random() * 0.05);
      const pos = latLngToVector3(lat, lng, alt);
      ch4Positions[i * 3] = pos.x;
      ch4Positions[i * 3 + 1] = pos.y;
      ch4Positions[i * 3 + 2] = pos.z;

      // Vivid Magenta / Purple for active acoustic flares & methane plumes
      ch4Colors[i * 3] = 0.92;
      ch4Colors[i * 3 + 1] = 0.2;
      ch4Colors[i * 3 + 2] = 0.85;
    }

    const ch4Geometry = new THREE.BufferGeometry();
    ch4Geometry.setAttribute('position', new THREE.BufferAttribute(ch4Positions, 3));
    ch4Geometry.setAttribute('color', new THREE.BufferAttribute(ch4Colors, 3));
    const ch4Material = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const ch4Points = new THREE.Points(ch4Geometry, ch4Material);
    globeGroup.add(ch4Points);
    ch4PlumePointsRef.current = ch4Points;

    // 11. Location Beacon (Pulsating ring & vertical light beam)
    const beaconGroup = new THREE.Group();
    globeGroup.add(beaconGroup);
    beaconMeshRef.current = beaconGroup;

    const beaconPillarGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 16);
    beaconPillarGeo.translate(0, 0.6, 0);
    const beaconPillarMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.9 });
    const beaconPillar = new THREE.Mesh(beaconPillarGeo, beaconPillarMat);
    beaconGroup.add(beaconPillar);

    const beaconRingGeo = new THREE.RingGeometry(0.12, 0.24, 24);
    beaconRingGeo.rotateX(-Math.PI / 2);
    const beaconRingMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
    const beaconRing = new THREE.Mesh(beaconRingGeo, beaconRingMat);
    beaconGroup.add(beaconRing);

    // Initial position for default location
    const initialPos = latLngToVector3(selectedLocation.lat, selectedLocation.lng, GLOBE_RADIUS);
    beaconGroup.position.copy(initialPos);
    beaconGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), initialPos.clone().normalize());

    // Orient globe so New Zealand & Pacific are front and center initially
    globeGroup.rotation.y = -Math.PI * 0.72;
    globeGroup.rotation.x = 0.25;

    // 12. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Cloud rotation
      if (cloudMeshRef.current && isPlayingAnimation) {
        cloudMeshRef.current.rotation.y += 0.0012 * animationSpeed;
      }

      // Wind streamlines circulation around the globe
      if (windStreamlinesRef.current && isPlayingAnimation) {
        const positions = windStreamlinesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          // Westerlies circulate east, trades circulate west
          const x = positions[i * 3];
          const z = positions[i * 3 + 2];
          const y = positions[i * 3 + 1];
          const angle = (y < 0 ? -0.003 : 0.0025) * animationSpeed;

          positions[i * 3] = x * Math.cos(angle) - z * Math.sin(angle);
          positions[i * 3 + 2] = x * Math.sin(angle) + z * Math.cos(angle);
        }
        windStreamlinesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Pulse location beacon
      if (beaconMeshRef.current) {
        const pulse = 1 + Math.sin(time * 4) * 0.25;
        beaconRing.scale.set(pulse, pulse, pulse);
      }

      // Auto rotation of globe
      if (isAutoRotating && globeGroupRef.current && !isDraggingRef.current) {
        globeGroupRef.current.rotation.y += 0.0008 * animationSpeed;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 560;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      earthGeometry.dispose();
      atmosphereGeometry.dispose();
      cloudGeometry.dispose();
    };
  }, []);

  // Update layer visibility when layerMode changes
  useEffect(() => {
    if (cloudMeshRef.current) {
      cloudMeshRef.current.visible = layerMode === 'composite' || layerMode === 'weather';
    }
    if (windStreamlinesRef.current) {
      windStreamlinesRef.current.visible = layerMode === 'composite' || layerMode === 'weather';
    }
    if (jetStreamRef.current) {
      jetStreamRef.current.visible = layerMode === 'composite' || layerMode === 'weather';
    }
    if (co2PlumePointsRef.current) {
      co2PlumePointsRef.current.visible = layerMode === 'composite' || layerMode === 'co2';
    }
    if (ch4PlumePointsRef.current) {
      ch4PlumePointsRef.current.visible = layerMode === 'composite' || layerMode === 'methane';
    }
  }, [layerMode]);

  // Update beacon position when selectedLocation changes
  useEffect(() => {
    if (beaconMeshRef.current) {
      const GLOBE_RADIUS = 7.0;
      const pos = latLngToVector3(selectedLocation.lat, selectedLocation.lng, GLOBE_RADIUS);
      beaconMeshRef.current.position.copy(pos);
      beaconMeshRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());

      // If user selected location, smoothly align the globe toward it
      if (globeGroupRef.current) {
        const targetLngRot = -(selectedLocation.lng * Math.PI / 180) - Math.PI / 2;
        const targetLatRot = (selectedLocation.lat * Math.PI / 180) * 0.4;
        globeGroupRef.current.rotation.y = targetLngRot;
        globeGroupRef.current.rotation.x = -targetLatRot;
      }
    }
  }, [selectedLocation]);

  // Mouse & Touch Drag Interaction for Orbiting Globe
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !globeGroupRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    globeGroupRef.current.rotation.y += deltaX * 0.006;
    globeGroupRef.current.rotation.x += deltaY * 0.006;

    // Limit vertical pitch to avoid flipping upside down
    globeGroupRef.current.rotation.x = Math.max(-1.1, Math.min(1.1, globeGroupRef.current.rotation.x));

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Zoom control
  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    cameraRef.current.position.z = Math.max(12, Math.min(42, cameraRef.current.position.z + e.deltaY * 0.02));
  };

  // Click on globe to raycast and select that location
  const handleGlobeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mountRef.current || !cameraRef.current || !globeGroupRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const earthMesh = globeGroupRef.current.children[0];
    if (earthMesh) {
      const intersects = raycaster.intersectObject(earthMesh, false);
      if (intersects.length > 0) {
        // Point in local globe coordinates
        const localPoint = globeGroupRef.current.worldToLocal(intersects[0].point.clone());
        const { lat, lng } = vector3ToLatLng(localPoint);
        const pinpointName = `Pinpoint (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`;
        const intel = calculateLocationDynamics(lat, lng, pinpointName);
        setSelectedLocation(intel);
        setCustomLat(lat.toFixed(3));
        setCustomLng(lng.toFixed(3));
        setCustomName(pinpointName);
      }
    }
  };

  // Browser GPS Geolocation Integration
  const detectLiveGpsLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsDetectingGps(false);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = Math.round(position.coords.accuracy);

        const gpsLoc = calculateLocationDynamics(
          lat, 
          lng, 
          `My Live GPS Location (±${accuracy}m)`
        );

        setSelectedLocation(gpsLoc);
        setLocationsList(prev => {
          const filtered = prev.filter(l => l.id !== gpsLoc.id && !l.isUserGps);
          return [gpsLoc, ...filtered];
        });
        setCustomLat(lat.toFixed(3));
        setCustomLng(lng.toFixed(3));
        setCustomName('My Live GPS Location');
      },
      (error) => {
        setIsDetectingGps(false);
        setGpsError(`GPS Access: ${error.message}. Defaulting to Baring Head baseline.`);
      },
      { timeout: 12000, enableHighAccuracy: true }
    );
  };

  // Apply custom coordinate search
  const handleApplyCustomCoordinates = () => {
    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert('Please enter valid coordinates (-90 to 90 for Lat, -180 to 180 for Lng)');
      return;
    }

    const intel = calculateLocationDynamics(lat, lng, customName || 'Custom Coordinate Point');
    setSelectedLocation(intel);
    setLocationsList(prev => {
      const exists = prev.find(p => p.id === intel.id);
      return exists ? prev : [intel, ...prev];
    });
  };

  // Refresh live weather and pollution telemetry
  const handleRefreshReport = async () => {
    setIsFetchingReport(true);
    try {
      const res = await fetch(`/api/weather-pollution-report?lat=${selectedLocation.lat}&lng=${selectedLocation.lng}&name=${encodeURIComponent(selectedLocation.name)}`);
      if (res.ok) {
        const data = await res.json();
        // Update selected location with live returned telemetry
        setSelectedLocation(prev => ({
          ...prev,
          weather: {
            ...prev.weather,
            temperatureC: data.weather.temperatureC,
            temperatureF: data.weather.temperatureF,
            pressureHpa: data.weather.pressureHpa,
            windSpeedKnots: data.weather.windSpeedKnots,
            windSpeedMs: data.weather.windSpeedMs
          },
          pollution: {
            ...prev.pollution,
            co2: {
              ...prev.pollution.co2,
              ppm: data.pollutionReport.co2.ppm,
              deltaPpm: data.pollutionReport.co2.deltaPpm,
              oceanAtmosphereFluxMmolM2Day: data.pollutionReport.co2.oceanAtmosphereFluxMmolM2Day
            },
            methane: {
              ...prev.pollution.methane,
              ppb: data.pollutionReport.methane.ppb,
              deltaPpb: data.pollutionReport.methane.deltaPpb,
              subseaHydrateStabilityPct: data.pollutionReport.methane.subseaHydrateStabilityPct
            }
          }
        }));
      }
    } catch (err) {
      console.warn('Backend API fallback to local scientific physics engine:', err);
    } finally {
      setIsFetchingReport(false);
      setLastSyncedTime(new Date().toLocaleTimeString());
    }
  };

  // Sound generator toggle
  const toggleSound = () => {
    if (!isSoundEnabled) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioContextRef.current = ctx;

        // Ambient low-frequency atmospheric wind synthesis
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(65, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        setIsSoundEnabled(true);
      } catch (err) {
        console.error('Audio synthesis failed:', err);
      }
    } else {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      setIsSoundEnabled(false);
    }
  };

  // Export Environmental Report
  const exportEnvironmentalReport = () => {
    const reportData = {
      project: "Project Conveyor • SaliBuoy Systems",
      reportType: "3D Weather Pattern & Greenhouse Gas Pollution Report",
      generatedUtc: new Date().toISOString(),
      location: {
        name: selectedLocation.name,
        category: selectedLocation.category,
        coordinates: { lat: selectedLocation.lat, lng: selectedLocation.lng },
        elevationM: selectedLocation.elevationM,
        nearestBasin: selectedLocation.nearestBasin
      },
      weatherPattern: selectedLocation.weather,
      greenhouseGases: {
        carbonDioxide: selectedLocation.pollution.co2,
        methane: selectedLocation.pollution.methane,
        airQuality: {
          aqi: selectedLocation.pollution.aqi,
          category: selectedLocation.pollution.aqiCategory,
          pm25: selectedLocation.pollution.pm25,
          pm10: selectedLocation.pollution.pm10,
          troposphericOzonePpb: selectedLocation.pollution.troposphericOzonePpb,
          nitrousOxidePpb: selectedLocation.pollution.nitrousOxidePpb
        }
      },
      salibuoyMitigationAudit: {
        downwellingSinkStatus: selectedLocation.pollution.co2.status,
        netOceanCarbonFluxMmolM2Day: selectedLocation.pollution.co2.oceanAtmosphereFluxMmolM2Day,
        salibuoyDailyOffsetTonnes: selectedLocation.pollution.co2.salibuoySinkOffsetTonnesDay,
        subseaMethaneClathrateStability: `${selectedLocation.pollution.methane.subseaHydrateStabilityPct}%`,
        gwp20Multiplier: selectedLocation.pollution.methane.gwp20ImpactFactor
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SaliBuoy-Weather-Pollution-Report-${selectedLocation.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLocations = useMemo(() => {
    if (filterCategory === 'ALL') return locationsList;
    return locationsList.filter(l => l.category === filterCategory);
  }, [locationsList, filterCategory]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-sky-950/80 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-40 -bottom-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
                <span>REAL-TIME 3D ATMOSPHERIC MODEL</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                CO2 (ppm) & METHANE (ppb) MONITOR
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                GLOBAL & GPS LOCATION
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
              <span>Real-Time Weather Pattern 3D Model & Atmospheric Pollution Report</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Interactive WebGL 3D atmospheric globe visualizer rendering real-time planetary storm cyclogenesis, 
              streamline wind vector kinetics, and multi-spectral greenhouse gas plume dispersion for Carbon Dioxide (CO2) 
              and Methane (CH4) with geodetic GPS location pinpointing.
            </p>
          </div>

          {/* Action Header Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={detectLiveGpsLocation}
              disabled={isDetectingGps}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-sky-900/40 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Navigation className={`w-4 h-4 ${isDetectingGps ? 'animate-spin' : ''}`} />
              <span>{isDetectingGps ? 'Locating...' : 'Use My Live GPS'}</span>
            </button>

            <button
              onClick={handleRefreshReport}
              disabled={isFetchingReport}
              className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isFetchingReport ? 'animate-spin text-sky-400' : ''}`} />
              <span>Sync Telemetry</span>
            </button>

            <button
              onClick={() => setIsSmsModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-purple-400" />
              <span>Oppo A6x SMS Alerts</span>
            </button>

            <button
              onClick={exportEnvironmentalReport}
              className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export Audit</span>
            </button>
          </div>
        </div>

        {gpsError && (
          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{gpsError}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Left 3D Viewport & Controls | Right Pollution & Weather Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive 3D Model (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md relative">
            
            {/* Top Toolbar overlay on 3D Viewport */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800/80">
              <div className="flex items-center space-x-2">
                <Globe2 className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  3D Atmospheric & Plume Viewport
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-slate-400 rounded">
                  Drag to Orbit • Click Globe to Pinpoint
                </span>
              </div>

              {/* Multi-Spectral Layer Selector */}
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setLayerMode('composite')}
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                    layerMode === 'composite' 
                      ? 'bg-sky-600 text-white font-bold shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Composite
                </button>
                <button
                  onClick={() => setLayerMode('weather')}
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                    layerMode === 'weather' 
                      ? 'bg-cyan-600 text-white font-bold shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Weather & Wind
                </button>
                <button
                  onClick={() => setLayerMode('co2')}
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                    layerMode === 'co2' 
                      ? 'bg-amber-600 text-white font-bold shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  CO2 (ppm)
                </button>
                <button
                  onClick={() => setLayerMode('methane')}
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                    layerMode === 'methane' 
                      ? 'bg-purple-600 text-white font-bold shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  CH4 (ppb)
                </button>
              </div>
            </div>

            {/* Three.js Interactive WebGL Canvas Container */}
            <div 
              ref={mountRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onWheel={handleWheel}
              onClick={handleGlobeClick}
              className="w-full h-[520px] rounded-xl bg-slate-950 relative overflow-hidden cursor-grab active:cursor-grabbing border border-slate-800/80 select-none"
            >
              {/* Overlay HUD indicators */}
              <div className="absolute top-3 left-3 pointer-events-none flex flex-col space-y-1.5 z-10">
                <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-md px-3 py-1.5 rounded-lg text-[11px] font-mono text-slate-300 flex items-center space-x-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-semibold text-white">{selectedLocation.name}</span>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-slate-400 shadow">
                  POS: {selectedLocation.lat >= 0 ? `${selectedLocation.lat}°N` : `${Math.abs(selectedLocation.lat)}°S`}, {selectedLocation.lng >= 0 ? `${selectedLocation.lng}°E` : `${Math.abs(selectedLocation.lng)}°W`} • ELEV: {selectedLocation.elevationM}m
                </div>
              </div>

              {/* 3D Legend Overlay Bottom Left */}
              <div className="absolute bottom-3 left-3 pointer-events-none bg-slate-950/85 border border-slate-800/80 backdrop-blur-md p-2.5 rounded-lg text-[10px] font-mono text-slate-300 space-y-1 z-10 max-w-[240px]">
                <div className="text-[11px] font-bold text-white flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  <span>3D ATMOSPHERIC LAYERS</span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                  <span>Roaring Forties & Westerly Streams</span>
                </div>
                <div className="flex items-center space-x-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span>Marine Carbon Sink Downwelling</span>
                </div>
                <div className="flex items-center space-x-1.5 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span>CO2 High Concentration Plumes</span>
                </div>
                <div className="flex items-center space-x-1.5 text-purple-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                  <span>Subsea Methane Hydrate Flares (CH4)</span>
                </div>
              </div>

              {/* Camera preset quick-jump buttons overlay Top Right */}
              <div className="absolute top-3 right-3 flex flex-col space-y-1.5 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (globeGroupRef.current) {
                      globeGroupRef.current.rotation.y = -Math.PI * 0.72;
                      globeGroupRef.current.rotation.x = 0.25;
                    }
                  }}
                  className="px-2 py-1 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 rounded text-[10px] font-mono text-sky-300 backdrop-blur-md shadow cursor-pointer transition-all"
                >
                  NZ & Tasman Sea
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (globeGroupRef.current) {
                      globeGroupRef.current.rotation.y = -Math.PI * 0.95;
                      globeGroupRef.current.rotation.x = 0.95;
                    }
                  }}
                  className="px-2 py-1 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 rounded text-[10px] font-mono text-cyan-300 backdrop-blur-md shadow cursor-pointer transition-all"
                >
                  Antarctica / South Pole
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (globeGroupRef.current) {
                      globeGroupRef.current.rotation.y = Math.PI * 0.4;
                      globeGroupRef.current.rotation.x = -0.15;
                    }
                  }}
                  className="px-2 py-1 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 rounded text-[10px] font-mono text-emerald-300 backdrop-blur-md shadow cursor-pointer transition-all"
                >
                  Mauna Loa Pacific
                </button>
              </div>
            </div>

            {/* Bottom 3D Playback & Forecast Slider Controls */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPlayingAnimation(!isPlayingAnimation)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer"
                  title={isPlayingAnimation ? 'Pause Animation' : 'Play Animation'}
                >
                  {isPlayingAnimation ? <Pause className="w-4 h-4 text-sky-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
                </button>

                <button
                  onClick={() => setIsAutoRotating(!isAutoRotating)}
                  className={`px-2 py-1 rounded-lg border text-[11px] transition-all cursor-pointer ${
                    isAutoRotating 
                      ? 'bg-sky-600/30 border-sky-500/50 text-sky-300' 
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {isAutoRotating ? 'Auto-Rotate ON' : 'Rotate Paused'}
                </button>

                <button
                  onClick={toggleSound}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    isSoundEnabled 
                      ? 'bg-cyan-600/30 border-cyan-500/50 text-cyan-300' 
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                  title={isSoundEnabled ? 'Mute Atmospheric Audio' : 'Play Atmospheric Audio'}
                >
                  {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                  <span>Speed:</span>
                  {[0.5, 1.0, 2.0].map(spd => (
                    <button
                      key={spd}
                      onClick={() => setAnimationSpeed(spd)}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${
                        animationSpeed === spd ? 'bg-sky-600 text-white font-bold' : 'hover:text-white'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Forecast Step Slider */}
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  <span>Forecast Step:</span>
                </span>
                {([0, 6, 12, 24, 48] as TimeForecastHorizon[]).map(hrs => (
                  <button
                    key={hrs}
                    onClick={() => setForecastHorizon(hrs)}
                    className={`px-2 py-1 rounded text-[11px] transition-all cursor-pointer ${
                      forecastHorizon === hrs 
                        ? 'bg-sky-600 text-white font-bold shadow' 
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {hrs === 0 ? 'Now' : `+${hrs}h`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Location Selector Directory & Custom Geodetic Coordinate Search */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Location Intelligence Directory ({filteredLocations.length} Stations)
                </h3>
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
                {['ALL', 'Atmospheric Baseline', 'SaliBuoy Engineering', 'Subsea Methane Hydrate', 'Polar Station'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                      filterCategory === cat ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat === 'ALL' ? 'All' : cat.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Cards Slider / Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
              {filteredLocations.map(loc => {
                const isSelected = selectedLocation.id === loc.id;
                return (
                  <div
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-sky-950/60 border-sky-500 shadow-md shadow-sky-950/40 ring-1 ring-sky-500' 
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {loc.category}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
                      )}
                    </div>
                    <div className="font-semibold text-xs text-white mt-1.5 truncate">
                      {loc.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1 flex items-center justify-between">
                      <span>CO2: {loc.pollution.co2.ppm} ppm</span>
                      <span className="text-purple-300">CH4: {loc.pollution.methane.ppb} ppb</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Coordinates Search Form */}
            <div className="pt-3 border-t border-slate-800/80">
              <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center space-x-1.5">
                <Search className="w-3.5 h-3.5 text-sky-400" />
                <span>Custom Coordinate Pinpoint (Target Any Latitude & Longitude)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <div className="sm:col-span-1">
                  <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Latitude (-90 to 90)</label>
                  <input
                    type="text"
                    value={customLat}
                    onChange={(e) => setCustomLat(e.target.value)}
                    placeholder="-41.408"
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Longitude (-180 to 180)</label>
                  <input
                    type="text"
                    value={customLng}
                    onChange={(e) => setCustomLng(e.target.value)}
                    placeholder="174.871"
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Location Label</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="E.g. Cape Reinga Buoy"
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500 truncate"
                  />
                </div>
                <div className="sm:col-span-1 flex items-end">
                  <button
                    onClick={handleApplyCustomCoordinates}
                    className="w-full py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow transition-all cursor-pointer"
                  >
                    Plot Location
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Pollution Report (CO2 & CH4) + Weather Patterns (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* 1. Pollution Report: Carbon Dioxide (CO2) Panel */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Carbon Dioxide (CO2) Report
                  </h3>
                  <p className="text-[11px] text-slate-400">Scripps & NIWA Calibrated Atmospheric Sensor</p>
                </div>
              </div>
              
              <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
                selectedLocation.pollution.co2.status === 'Marine Sink Active' 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : selectedLocation.pollution.co2.status === 'Baseline Clean'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {selectedLocation.pollution.co2.status}
              </span>
            </div>

            {/* Big CO2 Metric Readout */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-baseline justify-between">
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">Atmospheric Mole Fraction</div>
                <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono tracking-tight flex items-baseline space-x-1.5">
                  <span>{selectedLocation.pollution.co2.ppm}</span>
                  <span className="text-sm font-semibold text-slate-400">ppm</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-mono text-slate-400">Baseline Delta</div>
                <div className={`text-base font-bold font-mono ${
                  selectedLocation.pollution.co2.deltaPpm <= 0 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {selectedLocation.pollution.co2.deltaPpm > 0 ? `+${selectedLocation.pollution.co2.deltaPpm}` : selectedLocation.pollution.co2.deltaPpm} ppm
                </div>
                <div className="text-[10px] text-slate-500 font-mono">vs 422.5 ppm ocean ref</div>
              </div>
            </div>

            {/* SaliBuoy Downwelling Carbon Sink Rate */}
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ocean-Atmosphere Carbon Flux</span>
                </span>
                <span className="font-mono font-bold text-emerald-300">
                  {selectedLocation.pollution.co2.oceanAtmosphereFluxMmolM2Day} mmol C/m²/day
                </span>
              </div>
              <div className="text-[11px] text-slate-400 leading-snug">
                {selectedLocation.pollution.co2.oceanAtmosphereFluxMmolM2Day < 0 
                  ? `Active marine carbon drawdown: SaliBuoy downwelling pumps pull surface CO2 into deep oceanic reservoirs (Offset: ~${selectedLocation.pollution.co2.salibuoySinkOffsetTonnesDay} t CO2/day).` 
                  : `Outgassing event: Surface water releasing carbon into boundary layer.`}
              </div>
            </div>

            {/* Source Attribution Bars */}
            <div className="space-y-1.5 text-xs">
              <div className="text-slate-400 text-[11px] font-mono uppercase">CO2 Emission & Flux Attribution</div>
              <div className="grid grid-cols-4 gap-1 text-center font-mono text-[10px]">
                <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                  <div className="text-slate-400">Fossil</div>
                  <div className="font-bold text-amber-300">{selectedLocation.pollution.co2.attribution.fossilFuelPct}%</div>
                </div>
                <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                  <div className="text-slate-400">Transport</div>
                  <div className="font-bold text-orange-300">{selectedLocation.pollution.co2.attribution.transportPct}%</div>
                </div>
                <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                  <div className="text-slate-400">Marine</div>
                  <div className="font-bold text-cyan-300">{selectedLocation.pollution.co2.attribution.marineDegassingPct}%</div>
                </div>
                <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                  <div className="text-slate-400">Biosphere</div>
                  <div className="font-bold text-emerald-300">{selectedLocation.pollution.co2.attribution.naturalVegetationPct}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Pollution Report: Methane (CH4) Panel */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Methane (CH4) & Clathrates
                  </h3>
                  <p className="text-[11px] text-slate-400">Subsea Seep & Enteric Emission Profiler</p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
                selectedLocation.pollution.methane.status === 'Plume Warning'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : selectedLocation.pollution.methane.status === 'Agricultural Hotspot'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
              }`}>
                {selectedLocation.pollution.methane.status}
              </span>
            </div>

            {/* Big Methane Metric Readout */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-baseline justify-between">
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">Methane Concentration</div>
                <div className="text-3xl sm:text-4xl font-extrabold text-purple-400 font-mono tracking-tight flex items-baseline space-x-1.5">
                  <span>{selectedLocation.pollution.methane.ppb}</span>
                  <span className="text-sm font-semibold text-slate-400">ppb</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-mono text-slate-400">Clathrate Stability</div>
                <div className="text-base font-bold font-mono text-cyan-300">
                  {selectedLocation.pollution.methane.subseaHydrateStabilityPct}%
                </div>
                <div className="text-[10px] text-slate-500 font-mono">GWP20: 84x CO2</div>
              </div>
            </div>

            {/* Subsea Flare Alert Banner */}
            {selectedLocation.pollution.methane.acousticBubbleFlareDetected && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center space-x-2.5 text-xs text-rose-300">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 animate-bounce" />
                <span className="leading-snug">
                  <strong>Acoustic Bubble Flare Active:</strong> Subsea methane gas plume venting detected from continental slope hydrates. SaliBuoy array logging flare height.
                </span>
              </div>
            )}

            {/* Methane Attribution Breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="text-slate-400 text-[11px] font-mono uppercase">Methane Source Breakdown</div>
              <div className="grid grid-cols-4 gap-1 text-center font-mono text-[10px]">
                <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                  <div className="text-slate-400">Subsea Seep</div>
                  <div className="font-bold text-purple-300">{selectedLocation.pollution.methane.attribution.subseaClathratePct}%</div>
                </div>
                <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                  <div className="text-slate-400">Enteric Agri</div>
                  <div className="font-bold text-amber-300">{selectedLocation.pollution.methane.attribution.agriculturalEntericPct}%</div>
                </div>
                <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                  <div className="text-slate-400">Wetlands</div>
                  <div className="font-bold text-teal-300">{selectedLocation.pollution.methane.attribution.wetlandBiogenicPct}%</div>
                </div>
                <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                  <div className="text-slate-400">Fugitive</div>
                  <div className="font-bold text-rose-300">{selectedLocation.pollution.methane.attribution.fugitiveFossilPct}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Real-Time Local Weather Pattern Telemetry */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
                  <Wind className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Real-Time Weather Dynamics
                  </h3>
                  <p className="text-[11px] text-slate-400">{selectedLocation.weather.frontalSystem}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-sky-300 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/30">
                  AQI: {selectedLocation.pollution.aqi} ({selectedLocation.pollution.aqiCategory.split(' ')[0]})
                </span>
              </div>
            </div>

            {/* Weather Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 flex items-center justify-center space-x-1">
                  <Thermometer className="w-3 h-3 text-rose-400" />
                  <span>Temp</span>
                </div>
                <div className="text-base font-bold text-white mt-1">
                  {selectedLocation.weather.temperatureC}°C
                </div>
                <div className="text-[10px] text-slate-500">
                  {selectedLocation.weather.temperatureF}°F (Feels {selectedLocation.weather.feelsLikeC}°C)
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 flex items-center justify-center space-x-1">
                  <Gauge className="w-3 h-3 text-sky-400" />
                  <span>Pressure</span>
                </div>
                <div className="text-base font-bold text-white mt-1">
                  {selectedLocation.weather.pressureHpa}
                </div>
                <div className="text-[10px] text-slate-500">
                  hPa ({selectedLocation.weather.pressureTendency})
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 flex items-center justify-center space-x-1">
                  <Wind className="w-3 h-3 text-cyan-400" />
                  <span>Wind</span>
                </div>
                <div className="text-base font-bold text-white mt-1">
                  {selectedLocation.weather.windSpeedKnots} kt
                </div>
                <div className="text-[10px] text-slate-500">
                  {selectedLocation.weather.windDirectionCompass} ({selectedLocation.weather.windDirectionDeg}°)
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 flex items-center justify-center space-x-1">
                  <CloudRain className="w-3 h-3 text-teal-400" />
                  <span>Precip</span>
                </div>
                <div className="text-base font-bold text-white mt-1">
                  {selectedLocation.weather.precipRateMmH} mm/h
                </div>
                <div className="text-[10px] text-slate-500">
                  {selectedLocation.weather.precipType}
                </div>
              </div>
            </div>

            {/* Cloud & Jet Stream Detail */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Cloud Cover & Genus:</span>
                <span className="font-mono font-semibold text-white">
                  {selectedLocation.weather.cloudCoverPct}% • {selectedLocation.weather.cloudType}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Polar Jet Stream Velocity:</span>
                <span className="font-mono font-semibold text-sky-300">
                  {selectedLocation.weather.jetStreamSpeedKnots} knots
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Relative Humidity / Dew Point:</span>
                <span className="font-mono font-semibold text-white">
                  {selectedLocation.weather.humidityPct}% • {selectedLocation.weather.dewPointC}°C
                </span>
              </div>
            </div>

            {/* Forecast Summary */}
            <div className="p-3 bg-sky-950/20 border border-sky-500/20 rounded-xl text-xs text-sky-200 leading-relaxed">
              <span className="font-semibold text-sky-300">Dynamic Forecast: </span>
              {selectedLocation.weather.forecastSummary}
            </div>
          </div>

        </div>
      </div>

      {/* Oppo A6x SMS Alerts Modal integration */}
      <SmsAlertsModal
        isOpen={isSmsModalOpen}
        onClose={() => setIsSmsModalOpen(false)}
      />
    </div>
  );
};
