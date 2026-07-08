import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ViewMode } from '../types';

interface SaliBuoySimProps {
  windSpeed: number; // 0 to 50 Knots
  salinity: number; // 30 to 60 PSU
  viewMode: ViewMode;
  showSprayer: boolean;
}

export default function SaliBuoySim({
  windSpeed,
  salinity,
  viewMode,
  showSprayer,
}: SaliBuoySimProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  // Use refs to pass values smoothly into the animation loop without restarting Three.js
  const windSpeedRef = useRef(windSpeed);
  const salinityRef = useRef(salinity);
  const viewModeRef = useRef(viewMode);
  const showSprayerRef = useRef(showSprayer);

  useEffect(() => {
    windSpeedRef.current = windSpeed;
  }, [windSpeed]);

  useEffect(() => {
    salinityRef.current = salinity;
  }, [salinity]);

  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode]);

  useEffect(() => {
    showSprayerRef.current = showSprayer;
  }, [showSprayer]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x010811, 0.015);

    // --- CAMERA SETUP ---
    const initWidth = container.clientWidth || 800;
    const initHeight = container.clientHeight || 600;
    const camera = new THREE.PerspectiveCamera(
      50,
      initWidth / initHeight,
      0.1,
      1000
    );
    camera.position.set(24, 10, 32);

    // --- RENDERER SETUP ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(initWidth, initHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // --- CONTROLS ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.3; // Prevent rotating completely below ground, but allow looking slightly up at the sea-floor
    controls.minDistance = 10;
    controls.maxDistance = 80;
    controls.target.set(0, -3, 0);

    // --- LIGHTS ---
    const ambientLight = new THREE.AmbientLight(0x0a1c36, 1.5);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(15, 40, 20);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // --- SIMULATION ENTITIES & MATERIALS REFERENCE ---
    const meshesToColor: { mesh: THREE.Mesh; type: 'hull' | 'shaft' | 'blade' | 'propeller' | 'water' | 'ice' }[] = [];
    const originalMaterials = new Map<string, THREE.Material>();

    // Save and trace materials
    const registerMesh = (mesh: THREE.Mesh, type: 'hull' | 'shaft' | 'blade' | 'propeller' | 'water' | 'ice') => {
      meshesToColor.push({ mesh, type });
      originalMaterials.set(mesh.uuid, mesh.material as THREE.Material);
      scene.add(mesh);
    };

    // --- ENVIRONMENT ---
    // Translucent Ocean Surface
    const waterGeo = new THREE.PlaneGeometry(300, 300, 32, 32);
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x011e41,
      transparent: true,
      opacity: 0.65,
      transmission: 0.7,
      roughness: 0.1,
      metalness: 0.1,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const waterSurface = new THREE.Mesh(waterGeo, waterMat);
    waterSurface.rotation.x = -Math.PI / 2;
    registerMesh(waterSurface, 'water');

    // Cryo Ice Shelf (Adjacent)
    const iceGeo = new THREE.BoxGeometry(45, 2.5, 45);
    const iceMat = new THREE.MeshStandardMaterial({
      color: 0xecfeff,
      roughness: 0.4,
      metalness: 0.1,
    });
    const iceShelf = new THREE.Mesh(iceGeo, iceMat);
    iceShelf.position.set(26, 0.25, 0);
    registerMesh(iceShelf, 'ice');

    // Ocean grid helper (subsurface grid for scale)
    const gridHelper = new THREE.GridHelper(200, 50, 0x1e293b, 0x0f172a);
    gridHelper.position.y = -49;
    scene.add(gridHelper);

    // --- SALI-BUOY MECHANICAL ASSEMBLY ---
    const buoyGroup = new THREE.Group();

    // 1. Deck Platform
    const deckMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.2 });
    const deckPlatform = new THREE.Mesh(new THREE.CylinderGeometry(5.8, 5.8, 1.2, 32), deckMat);
    deckPlatform.position.y = 1.0;
    deckPlatform.castShadow = true;
    buoyGroup.add(deckPlatform);
    meshesToColor.push({ mesh: deckPlatform, type: 'hull' });
    originalMaterials.set(deckPlatform.uuid, deckPlatform.material);

    // 2. Main Hull Cylinder (Super Duplex S32750 structure)
    const hullMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.9, roughness: 0.1 });
    const mainHull = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, 11, 32), hullMat);
    mainHull.position.y = -5.0; // Suspended through waterline
    buoyGroup.add(mainHull);
    meshesToColor.push({ mesh: mainHull, type: 'hull' });
    originalMaterials.set(mainHull.uuid, mainHull.material);

    // 3. Engine Room Chamber (Subsurface -9m to -12m)
    const engineChamber = new THREE.Mesh(new THREE.CylinderGeometry(5.0, 5.0, 3.5, 32), deckMat);
    engineChamber.position.y = -11.0;
    buoyGroup.add(engineChamber);
    meshesToColor.push({ mesh: engineChamber, type: 'hull' });
    originalMaterials.set(engineChamber.uuid, engineChamber.material);

    // 4. Central Structural Drive Shaft (Direct torque transfer)
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.95, roughness: 0.05 });
    const driveShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 32, 16), shaftMat);
    driveShaft.position.y = 1.0;
    buoyGroup.add(driveShaft);
    meshesToColor.push({ mesh: driveShaft, type: 'shaft' });
    originalMaterials.set(driveShaft.uuid, driveShaft.material);

    // 5. Vertical-Axis Wind Turbine (VAWT) on top
    const vawtGroup = new THREE.Group();
    vawtGroup.position.y = 11.0; // Rises above deck

    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.6, roughness: 0.3 });
    
    // Build Helical Twist Blades for VAWT
    const createHelicalBlade = (angleOffset: number) => {
      const points: THREE.Vector3[] = [];
      const height = 9;
      const radius = 3.6;
      const segments = 24;
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = t * Math.PI * 0.9 + angleOffset; // Spiral curve
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = t * height - height / 2;
        points.push(new THREE.Vector3(x, y, z));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.4, 12, false);
      const mesh = new THREE.Mesh(tubeGeo, bladeMat);
      mesh.castShadow = true;
      return mesh;
    };

    const blade1 = createHelicalBlade(0);
    const blade2 = createHelicalBlade((Math.PI * 2) / 3);
    const blade3 = createHelicalBlade((Math.PI * 4) / 3);
    vawtGroup.add(blade1, blade2, blade3);

    // Horizontal struts to connect blades to shaft
    const strutMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const r = 3.6;
      // Top Strut
      const topStrut = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, r, 8), strutMat);
      topStrut.rotation.z = Math.PI / 2;
      topStrut.rotation.y = -angle;
      topStrut.position.set(Math.cos(angle) * (r / 2), 4.5, Math.sin(angle) * (r / 2));
      vawtGroup.add(topStrut);

      // Bottom Strut
      const botStrut = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, r, 8), strutMat);
      botStrut.rotation.z = Math.PI / 2;
      botStrut.rotation.y = -angle;
      botStrut.position.set(Math.cos(angle) * (r / 2), -4.5, Math.sin(angle) * (r / 2));
      vawtGroup.add(botStrut);
    }
    buoyGroup.add(vawtGroup);

    // Register VAWT blades & components
    vawtGroup.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        meshesToColor.push({ mesh: node, type: 'blade' });
        originalMaterials.set(node.uuid, node.material);
      }
    });

    // 6. Subsurface Propeller (The Sinker, below engine room)
    const propellerAssembly = new THREE.Group();
    propellerAssembly.position.y = -13.0;

    const propHubMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.95 });
    const propHub = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 2.0, 16), propHubMat);
    propellerAssembly.add(propHub);
    meshesToColor.push({ mesh: propHub, type: 'propeller' });
    originalMaterials.set(propHub.uuid, propHub.material);

    // Large high-torque blades
    const bladeGeometry = new THREE.BoxGeometry(5.2, 0.18, 1.1);
    const propBladeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.1 });
    for (let i = 0; i < 4; i++) {
      const blade = new THREE.Mesh(bladeGeometry, propBladeMat);
      blade.rotation.y = (i * Math.PI) / 2;
      blade.rotation.z = 0.38; // Dynamic hydrodynamic angle
      blade.translateX(2.6);
      propellerAssembly.add(blade);
      meshesToColor.push({ mesh: blade, type: 'propeller' });
      originalMaterials.set(blade.uuid, blade.material);
    }
    buoyGroup.add(propellerAssembly);

    scene.add(buoyGroup);

    // --- KINETIC DOWNWELLING VORTEX PLUME ---
    const particleCount = 2800;
    const vortexGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalProgress = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const progress = Math.random(); // vertical span
      originalProgress[i] = progress;
      const depth = -13.5 - progress * 35.5; // Injecting down to -49m
      const r = 0.9 + progress * 7.5; // Expanding funnel
      const angle = progress * Math.PI * 14.0 + Math.random() * 0.5;

      positions[idx] = Math.cos(angle) * r;
      positions[idx + 1] = depth;
      positions[idx + 2] = Math.sin(angle) * r;
    }

    vortexGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const vortexMaterial = new THREE.PointsMaterial({
      color: 0x00f5d4,
      size: 0.42,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const vortexParticles = new THREE.Points(vortexGeometry, vortexMaterial);
    scene.add(vortexParticles);

    // --- CYRO-SPRAYER EMITTER (Top-down salt induction) ---
    const sprayCount = 450;
    const sprayGeometry = new THREE.BufferGeometry();
    const sprayPositions = new Float32Array(sprayCount * 3);
    const sprayVelocities = new Float32Array(sprayCount * 3);

    const resetSprayParticle = (idx: number) => {
      // Sprays from deck level (y = 1.0) on the Sali-Buoy outer edge (x = 5.0, z = 0)
      sprayPositions[idx] = 4.8;
      sprayPositions[idx + 1] = 1.6;
      sprayPositions[idx + 2] = (Math.random() - 0.5) * 1.5;

      // Projectile mechanics toward adjacent ice shelf at x = 12..25
      sprayVelocities[idx] = 0.15 + Math.random() * 0.12; // horizontal velocity
      sprayVelocities[idx + 1] = 0.15 + Math.random() * 0.1; // initial upward spray arc
      sprayVelocities[idx + 2] = (Math.random() - 0.5) * 0.04;
    };

    for (let i = 0; i < sprayCount; i++) {
      resetSprayParticle(i * 3);
    }

    sprayGeometry.setAttribute('position', new THREE.BufferAttribute(sprayPositions, 3));
    const sprayMaterial = new THREE.PointsMaterial({
      color: 0xbae6fd,
      size: 0.32,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sprayParticles = new THREE.Points(sprayGeometry, sprayMaterial);
    scene.add(sprayParticles);

    // --- ANIMATION FRAME MANAGEMENT ---
    let animationId: number;
    let localTime = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      localTime += 0.016;

      const currentWind = windSpeedRef.current;
      const currentSalinity = salinityRef.current;
      const currentView = viewModeRef.current;
      const currentSprayer = showSprayerRef.current;

      // Mechanical rotational coupling
      const vawtSpeed = currentWind * 0.0016; // high-speed surface capture
      const propSpeed = vawtSpeed * 0.45; // low-RPM high-torque gearing

      vawtGroup.rotation.y += vawtSpeed;
      driveShaft.rotation.y += vawtSpeed;
      propellerAssembly.rotation.y += propSpeed;

      // --- BRINE VORTEX PHYSICS ---
      if (vortexParticles) {
        const pos = vortexGeometry.attributes.position.array as Float32Array;
        // Dynamically alter particle color based on Salinity PSU (30 = pale blue, 60 = deep hyper-saline violet)
        const tColor = new THREE.Color();
        if (currentView === 'realistic') {
          // Range from Cyan (0x00f5d4) to deep indigo/purple (0x4f46e5)
          const ratio = (currentSalinity - 30) / 30;
          tColor.lerpColors(new THREE.Color(0x00f5d4), new THREE.Color(0x6366f1), ratio);
          vortexMaterial.color.copy(tColor);
          vortexMaterial.opacity = 0.75;
        } else if (currentView === 'thermal') {
          vortexMaterial.color.setHex(0xd946ef); // purple analyzer beam
          vortexMaterial.opacity = 0.85;
        } else {
          vortexMaterial.color.setHex(0x10b981); // emerald wireframe vector
          vortexMaterial.opacity = 0.65;
        }

        const flowMultiplier = Math.max(0.2, (currentWind / 18) * (currentSalinity / 35));

        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3;
          // Move downward
          pos[idx + 1] -= 0.15 * flowMultiplier + (i % 6) * 0.02;

          // Recycle particle if it exceeds boundaries
          if (pos[idx + 1] < -49) {
            pos[idx + 1] = -13.0;
          }

          // Swirl physics
          const prog = (pos[idx + 1] + 13.0) / -36.0; // depth fraction
          // High salinity compresses/thickens the stream, wind expands/drives torque
          const maxRadius = 1.0 + prog * (8.5 + (currentWind / 20) * 1.5 - (currentSalinity - 30) * 0.08);
          const swirlSpeed = 2.5 * flowMultiplier;
          const angle = prog * Math.PI * 13.0 + localTime * swirlSpeed + (i % 10) * 0.1;

          pos[idx] = Math.cos(angle) * maxRadius;
          pos[idx + 2] = Math.sin(angle) * maxRadius;
        }
        vortexGeometry.attributes.position.needsUpdate = true;
      }

      // --- CRYO-SPRAYER PHYSICS ---
      if (sprayParticles) {
        if (currentSprayer && currentWind > 1) {
          sprayParticles.visible = true;
          const pos = sprayGeometry.attributes.position.array as Float32Array;

          for (let i = 0; i < sprayCount; i++) {
            const idx = i * 3;
            // Update projectile mechanics with gravity
            pos[idx] += sprayVelocities[idx] * (currentWind / 18); // horizontal drift driven by wind
            pos[idx + 1] += sprayVelocities[idx + 1]; // vertical arc
            pos[idx + 2] += sprayVelocities[idx + 2];

            // Apply gravity vector
            sprayVelocities[idx + 1] -= 0.0085; // downward gravitational pull

            // Impact with ice shelf (adjacent at y=0.5, x>=12)
            if (pos[idx + 1] <= 1.2 && pos[idx] >= 10) {
              resetSprayParticle(idx);
            } else if (pos[idx + 1] < -2 || pos[idx] > 40) {
              // Missed or drifted too far
              resetSprayParticle(idx);
            }
          }
          sprayGeometry.attributes.position.needsUpdate = true;
        } else {
          sprayParticles.visible = false;
        }
      }

      // --- WATER SURFACE MICRO-WAVES ---
      if (waterSurface && currentView === 'realistic') {
        const wavePos = waterGeo.attributes.position.array as Float32Array;
        const waveSpeed = localTime * 2.0;
        const waveHeight = 0.05 + (currentWind / 50) * 0.35;
        for (let i = 0; i < wavePos.length / 3; i++) {
          const idx = i * 3;
          const x = wavePos[idx];
          const y = wavePos[idx + 1];
          // Simple wave simulation formula
          wavePos[idx + 2] = Math.sin(x * 0.15 + waveSpeed) * Math.cos(y * 0.15 + waveSpeed) * waveHeight;
        }
        waterGeo.attributes.position.needsUpdate = true;
        waterGeo.computeVertexNormals();
      }

      // --- VIEW MODES HANDLER ---
      applyViewMode(currentView);

      controls.update();
      renderer.render(scene, camera);
    };

    // Helper to dynamically switch materials for different diagnostic view modes
    const applyViewMode = (mode: ViewMode) => {
      if (mode === 'realistic') {
        scene.fog = new THREE.FogExp2(0x010811, 0.012);
        renderer.setClearColor(0x010811);
        scene.background = new THREE.Color(0x010811);
        
        // Restore realistic materials
        meshesToColor.forEach(({ mesh, type }) => {
          const origMat = originalMaterials.get(mesh.uuid);
          if (origMat) {
            mesh.material = origMat;
            // Ensure wireframe is disabled
            (origMat as any).wireframe = false;
          }
        });
        
        if (sprayParticles) {
          sprayMaterial.color.setHex(0xbae6fd);
          sprayMaterial.size = 0.32;
        }
        gridHelper.visible = false;
      } else if (mode === 'thermal') {
        // Density Diagnostic Mode (Deep Purple/Orange thermographic overlay)
        scene.fog = new THREE.FogExp2(0x05011a, 0.015);
        renderer.setClearColor(0x05011a);
        scene.background = new THREE.Color(0x05011a);

        meshesToColor.forEach(({ mesh, type }) => {
          if (type === 'water') {
            mesh.material = new THREE.MeshBasicMaterial({
              color: 0x1e1b4b,
              transparent: true,
              opacity: 0.25,
              wireframe: false,
            });
          } else if (type === 'ice') {
            mesh.material = new THREE.MeshBasicMaterial({
              color: 0x312e81,
              transparent: true,
              opacity: 0.5,
            });
          } else if (type === 'shaft') {
            mesh.material = new THREE.MeshBasicMaterial({ color: 0xf97316 }); // High energy kinetic torque transfer (orange)
          } else if (type === 'blade' || type === 'propeller') {
            mesh.material = new THREE.MeshBasicMaterial({ color: 0xef4444 }); // High velocity interaction points (red)
          } else {
            mesh.material = new THREE.MeshBasicMaterial({ color: 0x4338ca }); // Heavy structural insulation (blue)
          }
        });

        if (sprayParticles) {
          sprayMaterial.color.setHex(0xf43f5e); // Hot induction spray particles
          sprayMaterial.size = 0.4;
        }
        gridHelper.visible = true;
      } else if (mode === 'wireframe') {
        // Engineering Wireframe Mode (Emerald green structural vector scans)
        scene.fog = new THREE.FogExp2(0x000501, 0.01);
        renderer.setClearColor(0x000501);
        scene.background = new THREE.Color(0x000501);

        meshesToColor.forEach(({ mesh, type }) => {
          mesh.material = new THREE.MeshBasicMaterial({
            color: type === 'water' ? 0x064e3b : type === 'ice' ? 0x022c22 : 0x10b981,
            wireframe: true,
          });
        });

        if (sprayParticles) {
          sprayMaterial.color.setHex(0x34d399);
          sprayMaterial.size = 0.25;
        }
        gridHelper.visible = true;
      }
    };

    // Begin execution loop
    animate();

    // --- RESPONSIVE AUTO-RESIZE ---
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const width = container.clientWidth || 800;
      const height = container.clientHeight || 600;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    // --- RECURSIVE DESTRUCTION CLEANUP ---
    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();

      // Deep clean geometries & materials
      waterGeo.dispose();
      waterMat.dispose();
      iceGeo.dispose();
      iceMat.dispose();
      deckPlatform.geometry.dispose();
      mainHull.geometry.dispose();
      engineChamber.geometry.dispose();
      driveShaft.geometry.dispose();
      vawtGroup.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.geometry.dispose();
          if (Array.isArray(node.material)) {
            node.material.forEach((mat) => mat.dispose());
          } else {
            node.material.dispose();
          }
        }
      });
      propHub.geometry.dispose();
      bladeGeometry.dispose();
      propellerAssembly.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.geometry.dispose();
          if (Array.isArray(node.material)) {
            node.material.forEach((mat) => mat.dispose());
          } else {
            node.material.dispose();
          }
        }
      });
      vortexGeometry.dispose();
      vortexMaterial.dispose();
      sprayGeometry.dispose();
      sprayMaterial.dispose();
      gridHelper.dispose();

      // Clean cached structures
      originalMaterials.clear();
      controls.dispose();
      renderer.dispose();

      // Wipe container element
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[400px] md:min-h-[500px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
      {/* 3D Canvas Mount Node */}
      <div ref={mountRef} className="w-full h-full absolute inset-0 z-10" />

      {/* Embedded Compass Overlay */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none flex flex-col items-start gap-1 font-mono text-[10px] text-sky-400 bg-slate-950/80 backdrop-blur px-3 py-2 rounded-lg border border-sky-500/20 shadow-lg">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold tracking-wider text-slate-200">INTERACTIVE 4D PREVIEW</span>
        </div>
        <div className="text-slate-400">FPS: 60 // ORBIT: LEFT-DRAG // ZOOM: PINCH</div>
        <div className="text-[9px] text-slate-500 uppercase">Sali-Buoy System Model v2.4</div>
      </div>

      {/* Scientific Overlay Graticules */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none flex flex-col items-end gap-1 font-mono text-[9px] text-slate-500 text-right">
        <div>COORDS: 72.4° N, 31.8° W</div>
        <div>SCAN RATE: 4.88 GHz</div>
        <div>DEPTH LIMIT: -50.0m</div>
      </div>

      {/* Subsurface/Atmosphere Waterline indicator */}
      <div className="absolute top-1/2 left-0 right-0 z-20 pointer-events-none border-t border-dashed border-sky-400/40 flex justify-between px-4">
        <span className="text-[10px] text-sky-400/60 font-mono -translate-y-4">ATMOSPHERE (WIND TURBINE)</span>
        <span className="text-[10px] text-sky-400/60 font-mono -translate-y-4">PELAGIC BOUNDARY // WATERLINE</span>
        <span className="text-[10px] text-sky-400/60 font-mono -translate-y-4">BATHYAL VORTEX ENGINE</span>
      </div>
    </div>
  );
}
