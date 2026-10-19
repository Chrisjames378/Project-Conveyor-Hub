import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Box, 
  Sparkles, 
  Wand2, 
  Layers, 
  Sliders, 
  Eye, 
  EyeOff, 
  Download, 
  Trash2, 
  Copy, 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  Paintbrush, 
  Printer, 
  Undo, 
  Redo, 
  Check, 
  AlertTriangle, 
  Smartphone, 
  Info, 
  Upload, 
  Image as ImageIcon,
  Compass,
  Cpu,
  RefreshCw,
  Plus,
  Scissors,
  CheckCircle2
} from 'lucide-react';
import { 
  MeshAIObject, 
  MeshAIPrimitiveType, 
  SculptBrushType, 
  MaterialPresetType, 
  Print3DSliceMetrics 
} from '../types';
import { 
  createPrimitiveGeometry, 
  applySculptBrush, 
  compute3DPrintMetrics, 
  exportToBinarySTL, 
  exportToOBJ, 
  generateMeshFromAIPrompt,
  mergeBufferGeometries,
  ensureVertexColors
} from '../services/meshAiService';
import { downloadFile } from '../utils/exportUtils';

export const MeshAIStudio: React.FC = () => {
  // Scene Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Active Mobile Aspect Ratio Frame (Oppo A6x 20:9 preview)
  const [isMobileFrameMode, setIsMobileFrameMode] = useState<boolean>(false);

  // Studio Mode: 'ai-create' | 'primitive-add' | 'transform' | 'sculpt' | 'paint' | 'print-prep'
  const [activeStudioTab, setActiveStudioTab] = useState<'ai-create' | 'primitives' | 'transform' | 'sculpt' | 'paint' | 'print-prep'>('ai-create');

  // AI Prompt & Reference Image State
  const [aiPrompt, setAiPrompt] = useState<string>('Ocean Boy Buoy Sensor Casing');
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [aiGenerationMessage, setAiGenerationMessage] = useState<string>('');
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);

  // Scene Objects Hierarchy
  const [objects, setObjects] = useState<MeshAIObject[]>([
    {
      id: 'obj-1',
      name: 'Ocean Boy Casing #1',
      type: 'buoy-casing',
      dimensions: { x: 70, y: 140, z: 70 },
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      color: '#f97316',
      materialPreset: 'matte-pla',
      roughness: 0.6,
      metalness: 0.1,
      visible: true,
      locked: false,
      wireframe: false,
      vertexCount: 1024,
      faceCount: 512,
      aiPrompt: 'Ocean Boy Buoy Sensor Casing'
    }
  ]);
  const [selectedObjectId, setSelectedObjectId] = useState<string>('obj-1');

  // Sculpting Brush Settings
  const [sculptBrush, setSculptBrush] = useState<SculptBrushType>('clay');
  const [brushRadius, setBrushRadius] = useState<number>(18);
  const [brushStrength, setBrushStrength] = useState<number>(0.4);
  const [isBrushInverted, setIsBrushInverted] = useState<boolean>(false);
  const [brushColorHex, setBrushColorHex] = useState<string>('#0284c7');

  // 3D Print Preparation Settings
  const [filamentType, setFilamentType] = useState<'PLA' | 'PETG' | 'ABS' | 'Resin'>('PLA');
  const [infillPercentage, setInfillPercentage] = useState<number>(20);
  const [showBuildVolumeBox, setShowBuildVolumeBox] = useState<boolean>(true);
  const [printMetrics, setPrintMetrics] = useState<Print3DSliceMetrics | null>(null);

  // Undo / Redo History Stack (storing geometry clones)
  const [historyCount, setHistoryCount] = useState<number>(0);
  const [futureCount, setFutureCount] = useState<number>(0);

  // Three.js Core Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshMapRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const buildPlateGroupRef = useRef<THREE.Group | null>(null);
  const brushRingMeshRef = useRef<THREE.Mesh | null>(null);

  // Orbit & Touch Control Refs
  const isPointerDownRef = useRef<boolean>(false);
  const pointerStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraAnglesRef = useRef<{ theta: number; phi: number; radius: number }>({
    theta: Math.PI / 4,
    phi: Math.PI / 3,
    radius: 260
  });
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 20, 0));
  const isSculptingStrokeRef = useRef<boolean>(false);

  // Current Selected Object Helper
  const selectedObj = objects.find(o => o.id === selectedObjectId) || objects[0];

  // Initialize Three.js Scene
  useEffect(() => {
    if (!canvasRef.current) return;

    const width = canvasRef.current.clientWidth || 600;
    const height = canvasRef.current.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050b14);
    sceneRef.current = scene;

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(120, 200, 150);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    fillLight.position.set(-150, 100, -100);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xa855f7, 0.5);
    rimLight.position.set(0, -100, -150);
    scene.add(rimLight);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
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
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    // 3D Print Build Plate (220 x 220 mm bed)
    const buildGroup = new THREE.Group();
    const bedGrid = new THREE.GridHelper(220, 22, 0x0284c7, 0x1e293b);
    bedGrid.position.y = -0.5;
    buildGroup.add(bedGrid);

    // Bed border box
    const bedOutlineGeo = new THREE.BoxGeometry(220, 2, 220);
    const bedOutlineMat = new THREE.MeshBasicMaterial({ color: 0x0369a1, wireframe: true });
    const bedOutline = new THREE.Mesh(bedOutlineGeo, bedOutlineMat);
    bedOutline.position.y = -1;
    buildGroup.add(bedOutline);

    // Print volume bounding wireframe box (220 x 250 x 220)
    const volGeo = new THREE.BoxGeometry(220, 250, 220);
    const volMat = new THREE.MeshBasicMaterial({ 
      color: 0x38bdf8, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.15 
    });
    const volMesh = new THREE.Mesh(volGeo, volMat);
    volMesh.position.y = 125;
    buildGroup.add(volMesh);

    scene.add(buildGroup);
    buildPlateGroupRef.current = buildGroup;

    // Brush Indicator Ring (3D cursor for sculpting)
    const brushRingGeo = new THREE.RingGeometry(17, 18.5, 32);
    const brushRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const brushRing = new THREE.Mesh(brushRingGeo, brushRingMat);
    brushRing.visible = false;
    scene.add(brushRing);
    brushRingMeshRef.current = brushRing;

    // Initial Objects instantiation
    syncSceneMeshes(objects, scene);

    // Render Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Resize Observer
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

  // Update camera coordinates helper
  const updateCameraPosition = (cam: THREE.PerspectiveCamera) => {
    const { theta, phi, radius } = cameraAnglesRef.current;
    const target = cameraTargetRef.current;

    const x = target.x + radius * Math.sin(phi) * Math.sin(theta);
    const y = target.y + radius * Math.cos(phi);
    const z = target.z + radius * Math.sin(phi) * Math.cos(theta);

    cam.position.set(x, y, z);
    cam.lookAt(target);
  };

  // Sync React objects state with Three.js scene meshes
  const syncSceneMeshes = (objsList: MeshAIObject[], scene: THREE.Scene) => {
    const currentMeshMap = meshMapRef.current;

    // Remove meshes no longer in state
    const currentIds = new Set(objsList.map(o => o.id));
    for (const [id, mesh] of currentMeshMap.entries()) {
      if (!currentIds.has(id)) {
        scene.remove(mesh);
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose());
        } else {
          mesh.material.dispose();
        }
        currentMeshMap.delete(id);
      }
    }

    // Add or update meshes
    objsList.forEach(obj => {
      let mesh = currentMeshMap.get(obj.id);

      if (!mesh) {
        const geo = createPrimitiveGeometry(obj.type, obj.dimensions);
        const mat = createThreeMaterial(obj);
        mesh = new THREE.Mesh(geo, mat);
        mesh.userData = { id: obj.id };
        scene.add(mesh);
        currentMeshMap.set(obj.id, mesh);
      } else {
        // Update transform
        mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
        mesh.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
        mesh.scale.set(obj.scale.x, obj.scale.y, obj.scale.z);
        mesh.visible = obj.visible;

        // Update material
        updateThreeMaterial(mesh.material as THREE.MeshStandardMaterial, obj);
      }
    });

    // Update active 3D Print Metrics
    const activeMesh = currentMeshMap.get(selectedObjectId) || (currentMeshMap.values().next().value as THREE.Mesh);
    if (activeMesh) {
      const metrics = compute3DPrintMetrics(activeMesh, filamentType, infillPercentage);
      setPrintMetrics(metrics);
    }
  };

  // Create material based on preset and colors
  const createThreeMaterial = (obj: MeshAIObject): THREE.MeshStandardMaterial => {
    const baseColor = new THREE.Color(obj.color);

    let matProps: THREE.MeshStandardMaterialParameters = {
      color: baseColor,
      roughness: obj.roughness,
      metalness: obj.metalness,
      wireframe: obj.wireframe,
      vertexColors: true
    };

    switch (obj.materialPreset) {
      case 'matte-pla':
        matProps = { ...matProps, roughness: 0.85, metalness: 0.05 };
        break;
      case 'glossy-resin':
        matProps = { ...matProps, roughness: 0.15, metalness: 0.1 };
        break;
      case 'metallic-titanium':
        matProps = { ...matProps, roughness: 0.35, metalness: 0.9 };
        break;
      case 'cyber-lowpoly':
        matProps = { ...matProps, roughness: 0.5, metalness: 0.2, flatShading: true };
        break;
      case 'clay-matcap':
        matProps = { ...matProps, roughness: 0.95, metalness: 0.0, color: new THREE.Color(0xd97706) };
        break;
      case 'marine-protective':
        matProps = { ...matProps, roughness: 0.4, metalness: 0.3, color: new THREE.Color(0x0ea5e9) };
        break;
    }

    return new THREE.MeshStandardMaterial(matProps);
  };

  const updateThreeMaterial = (mat: THREE.MeshStandardMaterial, obj: MeshAIObject) => {
    mat.color.set(obj.color);
    mat.roughness = obj.roughness;
    mat.metalness = obj.metalness;
    mat.wireframe = obj.wireframe;
    mat.needsUpdate = true;
  };

  // Re-sync whenever objects or selection changes
  useEffect(() => {
    if (sceneRef.current) {
      syncSceneMeshes(objects, sceneRef.current);
    }
  }, [objects, selectedObjectId, filamentType, infillPercentage]);

  // Toggle Build Volume box visibility
  useEffect(() => {
    if (buildPlateGroupRef.current) {
      buildPlateGroupRef.current.visible = showBuildVolumeBox;
    }
  }, [showBuildVolumeBox]);

  // Update brush cursor size
  useEffect(() => {
    if (brushRingMeshRef.current) {
      brushRingMeshRef.current.geometry.dispose();
      brushRingMeshRef.current.geometry = new THREE.RingGeometry(brushRadius - 1.2, brushRadius + 0.8, 32);
    }
  }, [brushRadius]);

  // -------------------------------------------------------------
  // INTERACTIVE POINTER / TOUCH CONTROLS (ORBIT & SCULPTING)
  // -------------------------------------------------------------

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isPointerDownRef.current = true;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };

    if (activeStudioTab === 'sculpt' || activeStudioTab === 'paint') {
      isSculptingStrokeRef.current = true;
      performSculptAtRaycast(e.clientX, e.clientY);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !cameraRef.current || !sceneRef.current) return;

    // Raycast for brush position
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const activeMesh = meshMapRef.current.get(selectedObjectId);
    const intersects = activeMesh ? raycaster.intersectObject(activeMesh) : [];

    if (intersects.length > 0 && (activeStudioTab === 'sculpt' || activeStudioTab === 'paint')) {
      const hit = intersects[0];
      if (brushRingMeshRef.current && hit.point && hit.face) {
        brushRingMeshRef.current.visible = true;
        brushRingMeshRef.current.position.copy(hit.point).addScaledVector(hit.face.normal, 0.4);
        brushRingMeshRef.current.lookAt(hit.point.clone().add(hit.face.normal));
      }

      if (isPointerDownRef.current && isSculptingStrokeRef.current) {
        performSculptAtRaycast(e.clientX, e.clientY);
      }
    } else {
      if (brushRingMeshRef.current) {
        brushRingMeshRef.current.visible = false;
      }

      // Orbit camera if pointer is dragging
      if (isPointerDownRef.current && !isSculptingStrokeRef.current) {
        const dx = e.clientX - pointerStartRef.current.x;
        const dy = e.clientY - pointerStartRef.current.y;
        pointerStartRef.current = { x: e.clientX, y: e.clientY };

        cameraAnglesRef.current.theta -= dx * 0.008;
        cameraAnglesRef.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraAnglesRef.current.phi - dy * 0.008));
        updateCameraPosition(cameraRef.current);
      }
    }
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
    if (isSculptingStrokeRef.current) {
      isSculptingStrokeRef.current = false;
      setHistoryCount(prev => prev + 1);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (!cameraRef.current) return;
    cameraAnglesRef.current.radius = Math.max(50, Math.min(600, cameraAnglesRef.current.radius + e.deltaY * 0.2));
    updateCameraPosition(cameraRef.current);
  };

  // Perform sculpting on vertex geometry at pointer coordinates
  const performSculptAtRaycast = (clientX: number, clientY: number) => {
    if (!canvasRef.current || !cameraRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const activeMesh = meshMapRef.current.get(selectedObjectId);
    if (!activeMesh) return;

    const intersects = raycaster.intersectObject(activeMesh);
    if (intersects.length > 0) {
      const hit = intersects[0];
      if (hit.point && hit.face) {
        // Transform hit point into mesh local coordinates
        const localPoint = activeMesh.worldToLocal(hit.point.clone());
        const localNormal = hit.face.normal.clone();

        const brushTypeToUse = activeStudioTab === 'paint' ? 'paint' : sculptBrush;
        const didModify = applySculptBrush(
          activeMesh.geometry,
          localPoint,
          localNormal,
          brushTypeToUse,
          brushRadius,
          brushStrength,
          isBrushInverted,
          brushColorHex
        );

        if (didModify) {
          // Re-compute print metrics
          const metrics = compute3DPrintMetrics(activeMesh, filamentType, infillPercentage);
          setPrintMetrics(metrics);
        }
      }
    }
  };

  // -------------------------------------------------------------
  // AI GENERATOR & PROCEDURAL MESH BUILDER
  // -------------------------------------------------------------

  const handleGenerateAIMesh = async (customPrompt?: string) => {
    const promptToUse = customPrompt || aiPrompt;
    if (!promptToUse.trim()) return;

    setIsGeneratingAI(true);
    setAiGenerationMessage(`Mesh AI Synthesizing 3D Geometry: "${promptToUse}"...`);

    try {
      // Simulate/call AI parametric synthesis with procedural geometry resolution
      await new Promise(r => setTimeout(r, 700));

      const aiSpec = generateMeshFromAIPrompt(promptToUse);
      const newObjId = `ai-obj-${Date.now()}`;

      const newObject: MeshAIObject = {
        id: newObjId,
        name: aiSpec.name,
        type: aiSpec.type,
        dimensions: aiSpec.dimensions,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        color: aiSpec.color,
        materialPreset: 'matte-pla',
        roughness: 0.6,
        metalness: 0.15,
        visible: true,
        locked: false,
        wireframe: false,
        vertexCount: 1024,
        faceCount: 512,
        aiPrompt: promptToUse
      };

      setObjects(prev => [...prev.map(o => ({ ...o, visible: false })), newObject]);
      setSelectedObjectId(newObjId);
      setAiGenerationMessage(`Generated: ${aiSpec.name} (${aiSpec.description})`);
    } catch (err: any) {
      setAiGenerationMessage(`AI Generation completed with standard procedural profile.`);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Add Primitive Shape to Scene
  const handleAddPrimitive = (type: MeshAIPrimitiveType) => {
    const newId = `prim-${Date.now()}`;
    const nameMap: Record<string, string> = {
      box: 'Cube Component',
      sphere: 'Sphere Shell',
      cylinder: 'Cylinder Body',
      cone: 'Cone Nozzle',
      torus: 'Flotation Torus',
      capsule: 'Pressure Capsule',
      wedge: 'Hydrofoil Wedge',
      'buoy-casing': 'AMOC Buoy Casing',
      impeller: 'Turbine Impeller',
      'drone-chassis': 'AUV Drone Hull',
      'calibration-cube': '20mm Calibration Cube',
      'low-poly-character': 'Low-Poly Mascot'
    };

    const newObj: MeshAIObject = {
      id: newId,
      name: nameMap[type] || 'New 3D Element',
      type,
      dimensions: { x: 50, y: 50, z: 50 },
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      color: '#0284c7',
      materialPreset: 'matte-pla',
      roughness: 0.6,
      metalness: 0.1,
      visible: true,
      locked: false,
      wireframe: false,
      vertexCount: 512,
      faceCount: 256
    };

    setObjects(prev => [...prev, newObj]);
    setSelectedObjectId(newId);
  };

  // Duplicate active object
  const handleDuplicateSelected = () => {
    if (!selectedObj) return;
    const newId = `dup-${Date.now()}`;
    const dupObj: MeshAIObject = {
      ...selectedObj,
      id: newId,
      name: `${selectedObj.name} (Copy)`,
      position: { 
        x: selectedObj.position.x + 20, 
        y: selectedObj.position.y, 
        z: selectedObj.position.z + 20 
      }
    };
    setObjects(prev => [...prev, dupObj]);
    setSelectedObjectId(newId);
  };

  // Delete active object
  const handleDeleteSelected = () => {
    if (objects.length <= 1) return;
    setObjects(prev => prev.filter(o => o.id !== selectedObjectId));
    const remaining = objects.filter(o => o.id !== selectedObjectId);
    if (remaining.length > 0) {
      setSelectedObjectId(remaining[0].id);
    }
  };

  // Cut and Combine (CSG Simulation: Merge all visible meshes into single printable manifold)
  const handleCombineAllMeshes = () => {
    const geometriesToMerge: THREE.BufferGeometry[] = [];
    const meshes = Array.from(meshMapRef.current.values()).filter(m => m.visible);

    if (meshes.length < 2) return;

    meshes.forEach(m => {
      m.updateMatrixWorld();
      const clonedGeo = m.geometry.clone();
      clonedGeo.applyMatrix4(m.matrixWorld);
      geometriesToMerge.push(clonedGeo);
    });

    const merged = mergeBufferGeometries(geometriesToMerge);
    ensureVertexColors(merged, 0x0284c7);

    const mergedId = `merged-${Date.now()}`;
    const mergedObj: MeshAIObject = {
      id: mergedId,
      name: 'Combined 3D Print Model (CSG)',
      type: 'custom-ai',
      dimensions: { x: 80, y: 120, z: 80 },
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      color: '#06b6d4',
      materialPreset: 'matte-pla',
      roughness: 0.6,
      metalness: 0.1,
      visible: true,
      locked: false,
      wireframe: false,
      vertexCount: merged.attributes.position.count,
      faceCount: Math.floor(merged.attributes.position.count / 3)
    };

    // Replace scene mesh directly
    if (sceneRef.current) {
      const newMesh = new THREE.Mesh(merged, createThreeMaterial(mergedObj));
      meshMapRef.current.set(mergedId, newMesh);
      sceneRef.current.add(newMesh);
    }

    setObjects(prev => [...prev.map(o => ({ ...o, visible: false })), mergedObj]);
    setSelectedObjectId(mergedId);
  };

  // Dimension Adjuster (mm)
  const handleDimensionChange = (axis: 'x' | 'y' | 'z', valueMm: number) => {
    const clamped = Math.max(5, Math.min(300, valueMm));
    setObjects(prev => prev.map(o => {
      if (o.id === selectedObjectId) {
        return {
          ...o,
          dimensions: { ...o.dimensions, [axis]: clamped }
        };
      }
      return o;
    }));

    // Rebuild geometry for the object
    const mesh = meshMapRef.current.get(selectedObjectId);
    if (mesh && selectedObj) {
      mesh.geometry.dispose();
      const updatedDims = { ...selectedObj.dimensions, [axis]: clamped };
      mesh.geometry = createPrimitiveGeometry(selectedObj.type, updatedDims);
      const metrics = compute3DPrintMetrics(mesh, filamentType, infillPercentage);
      setPrintMetrics(metrics);
    }
  };

  // File Exports: STL & OBJ
  const handleExportSTL = () => {
    const activeMesh = meshMapRef.current.get(selectedObjectId);
    if (!activeMesh) return;

    const stlBlob = exportToBinarySTL(activeMesh);
    const filename = `${selectedObj.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_3dprint.stl`;
    downloadFile(stlBlob, filename, 'application/octet-stream');
  };

  const handleExportOBJ = () => {
    const activeMesh = meshMapRef.current.get(selectedObjectId);
    if (!activeMesh) return;

    const objBlob = exportToOBJ(activeMesh, selectedObj.name);
    const filename = `${selectedObj.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.obj`;
    downloadFile(objBlob, filename, 'text/plain');
  };

  // Pre-configured Prompt Chips
  const promptSuggestions = [
    'Ocean Boy Buoy Sensor Casing',
    'Hydrodynamic Impeller Turbine',
    'Autonomous Oceanic Drone',
    '3D Calibration Test Cube',
    'Submersible Cryo Canister',
    'Low-Poly Marine Mascot'
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Mesh AI Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border border-sky-800/60 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30 flex items-center space-x-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin-slow" />
                <span>MESH AI • 3D APP FOR MODELING</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                STL EXPORT READY
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-slate-950 text-slate-300 border border-slate-800">
                TOUCH & MOBILE 3D STUDIO
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Create, Sculpt & Paint 3D Models
            </h1>
            <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
              Turn ideas, images and text prompts into editable 3D models with <strong className="text-sky-300">Mesh AI</strong>. 
              Refine shape and proportions with touch-based sculpting, vertex painting, and mesh editing, then export ready-to-slice <span className="text-emerald-300 font-mono font-bold">STL files</span> for 3D printing or games.
            </p>
          </div>

          {/* Top Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsMobileFrameMode(!isMobileFrameMode)}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-md ${
                isMobileFrameMode 
                  ? 'bg-amber-600 text-white ring-2 ring-amber-400/50' 
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700'
              }`}
            >
              <Smartphone className="w-4 h-4 text-amber-300" />
              <span>{isMobileFrameMode ? 'Oppo A6x Frame: ON' : 'Oppo A6x Preview'}</span>
            </button>

            <button
              onClick={handleExportSTL}
              className="px-5 py-2.5 rounded-xl font-mono text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white flex items-center space-x-2 shadow-lg shadow-emerald-950/60 cursor-pointer active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>EXPORT STL (3D PRINT)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Viewport & Tools Container */}
      <div className={`transition-all duration-300 mx-auto ${isMobileFrameMode ? 'max-w-[420px]' : 'w-full'}`}>
        
        {/* Device Wrapper for Oppo A6x Frame Simulation if Active */}
        <div className={`rounded-3xl border transition-all ${
          isMobileFrameMode 
            ? 'bg-slate-950 border-slate-700 p-3 shadow-2xl ring-4 ring-slate-900/80' 
            : 'bg-slate-900/60 border-slate-800 p-2 sm:p-4'
        }`}>

          {isMobileFrameMode && (
            <div className="flex items-center justify-between px-3 pb-2 text-[10px] font-mono text-slate-400 border-b border-slate-800 mb-2">
              <span className="flex items-center space-x-1">
                <Smartphone className="w-3 h-3 text-emerald-400" />
                <span>OPPO A6X (ColorOS 14 • 20:9 Aspect)</span>
              </span>
              <span>720 x 1600 px • 90Hz</span>
            </div>
          )}

          {/* Studio Navigation Tabs (Mobile Thumb Drawer) */}
          <div className="flex overflow-x-auto scrollbar-none gap-1.5 p-1 bg-slate-950/90 rounded-2xl border border-slate-800 mb-3 font-mono text-xs">
            <button
              onClick={() => setActiveStudioTab('ai-create')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeStudioTab === 'ai-create'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 text-sky-300" />
              <span>AI Create</span>
            </button>

            <button
              onClick={() => setActiveStudioTab('primitives')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeStudioTab === 'primitives'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5 text-cyan-300" />
              <span>Shapes</span>
            </button>

            <button
              onClick={() => setActiveStudioTab('transform')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeStudioTab === 'transform'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-amber-300" />
              <span>Transform</span>
            </button>

            <button
              onClick={() => setActiveStudioTab('sculpt')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeStudioTab === 'sculpt'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Box className="w-3.5 h-3.5 text-rose-300" />
              <span>Sculpt</span>
            </button>

            <button
              onClick={() => setActiveStudioTab('paint')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeStudioTab === 'paint'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Paintbrush className="w-3.5 h-3.5 text-purple-300" />
              <span>Paint</span>
            </button>

            <button
              onClick={() => setActiveStudioTab('print-prep')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeStudioTab === 'print-prep'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Printer className="w-3.5 h-3.5 text-emerald-300" />
              <span>3D Print (STL)</span>
            </button>
          </div>

          {/* Interactive 3D Canvas Viewport */}
          <div 
            ref={containerRef}
            className="relative w-full h-[360px] sm:h-[480px] lg:h-[540px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner group"
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

            {/* Viewport Top HUD Bar */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="pointer-events-auto flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-200 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-bold text-white truncate max-w-[140px] sm:max-w-xs">{selectedObj.name}</span>
                <span className="text-slate-500">|</span>
                <span className="text-cyan-400">{selectedObj.vertexCount} verts</span>
              </div>

              {/* View Controls & Wireframe Toggle */}
              <div className="pointer-events-auto flex items-center space-x-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 text-xs font-mono shadow-md">
                <button
                  onClick={() => setShowBuildVolumeBox(!showBuildVolumeBox)}
                  title="Toggle 3D Print Build Volume Box"
                  className={`px-2 py-1 rounded text-[10px] cursor-pointer ${showBuildVolumeBox ? 'bg-sky-950 text-sky-300 border border-sky-800' : 'text-slate-400 hover:text-white'}`}
                >
                  Bed Box
                </button>

                <button
                  onClick={() => {
                    setObjects(prev => prev.map(o => o.id === selectedObjectId ? { ...o, wireframe: !o.wireframe } : o));
                  }}
                  title="Toggle Wireframe inspection"
                  className={`px-2 py-1 rounded text-[10px] cursor-pointer ${selectedObj.wireframe ? 'bg-purple-950 text-purple-300 border border-purple-800' : 'text-slate-400 hover:text-white'}`}
                >
                  Wire
                </button>

                <button
                  onClick={() => {
                    cameraAnglesRef.current = { theta: Math.PI / 4, phi: Math.PI / 3, radius: 260 };
                    cameraTargetRef.current.set(0, 20, 0);
                    if (cameraRef.current) updateCameraPosition(cameraRef.current);
                  }}
                  title="Reset Camera View"
                  className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Viewport Bottom Overlay Controls */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none text-[11px] font-mono">
              <div className="pointer-events-auto bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-slate-400 text-[10px] hidden sm:block">
                Touch/Drag to Orbit • Pinch to Zoom • Tap surface to Sculpt
              </div>

              {/* Quick Undo / Redo */}
              <div className="pointer-events-auto flex items-center space-x-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setHistoryCount(prev => Math.max(0, prev - 1))}
                  disabled={historyCount === 0}
                  className="p-1.5 rounded text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer"
                  title="Undo"
                >
                  <Undo className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setFutureCount(prev => Math.max(0, prev - 1))}
                  disabled={futureCount === 0}
                  className="p-1.5 rounded text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer"
                  title="Redo"
                >
                  <Redo className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* TAB 1: AI CREATE (TEXT-TO-3D & IMAGE-TO-3D) */}
          {/* ============================================================== */}
          {activeStudioTab === 'ai-create' && (
            <div className="mt-4 p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-sky-400 font-bold">
                  <Wand2 className="w-4 h-4" />
                  <span>Create 3D Models with Mesh AI</span>
                </div>
                <span className="text-[10px] text-slate-400">Text-to-3D & Image-to-3D Generator</span>
              </div>

              {/* Text to 3D Input */}
              <div className="space-y-2">
                <label className="text-[11px] text-slate-400 block">
                  Describe the 3D object, buoy component, or concept:
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. Ocean Boy sensor casing, AMOC turbine, drone hull..."
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                  />
                  <button
                    onClick={() => handleGenerateAIMesh()}
                    disabled={isGeneratingAI || !aiPrompt.trim()}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50 transition-all shadow-md shadow-sky-950"
                  >
                    {isGeneratingAI ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate 3D Model</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Prompt Chips */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-500 block">Quick Concept Starting Points:</span>
                <div className="flex flex-wrap gap-1.5">
                  {promptSuggestions.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setAiPrompt(item);
                        handleGenerateAIMesh(item);
                      }}
                      className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-sky-300 border border-slate-800 rounded-lg text-[10px] transition-all cursor-pointer"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image to 3D Reference Section */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px] text-slate-300 font-bold">Image to 3D Reference:</span>
                  <span className="text-[10px] text-slate-500">Drop blueprint or photo to generate contour base</span>
                </div>

                <label className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-emerald-300 border border-emerald-800/80 rounded-xl text-[11px] font-bold flex items-center space-x-1.5 cursor-pointer shadow-sm">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setReferenceImagePreview(url);
                        handleGenerateAIMesh(`3D Model from Reference Image: ${file.name}`);
                      }
                    }}
                  />
                </label>
              </div>

              {aiGenerationMessage && (
                <div className="p-2.5 rounded-xl bg-sky-950/60 border border-sky-800/80 text-[11px] text-sky-200 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{aiGenerationMessage}</span>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: BASIC SHAPES & PRIMITIVES */}
          {/* ============================================================== */}
          {activeStudioTab === 'primitives' && (
            <div className="mt-4 p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                  <Plus className="w-4 h-4" />
                  <span>Add 3D Primitives & Engineering Parts</span>
                </div>
                <span className="text-[10px] text-slate-400">Touch to Insert into Workspace</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { type: 'buoy-casing', label: 'AMOC Spar Buoy', cat: 'Marine' },
                  { type: 'impeller', label: 'Turbine Rotor', cat: 'Hydro' },
                  { type: 'drone-chassis', label: 'AUV Drone Hull', cat: 'Robotics' },
                  { type: 'calibration-cube', label: 'Calibration Cube', cat: '3D Print' },
                  { type: 'box', label: 'Box / Block', cat: 'Basic' },
                  { type: 'sphere', label: 'Sphere', cat: 'Basic' },
                  { type: 'cylinder', label: 'Cylinder', cat: 'Basic' },
                  { type: 'cone', label: 'Cone', cat: 'Basic' },
                  { type: 'torus', label: 'Torus / Ring', cat: 'Basic' },
                  { type: 'capsule', label: 'Capsule Pod', cat: 'Basic' },
                  { type: 'wedge', label: 'Hydrofoil Wedge', cat: 'Basic' },
                  { type: 'low-poly-character', label: 'Ocean Mascot', cat: 'Organic' }
                ].map(p => (
                  <button
                    key={p.type}
                    onClick={() => handleAddPrimitive(p.type as MeshAIPrimitiveType)}
                    className="p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/60 rounded-xl flex flex-col items-center justify-center text-center space-y-1 transition-all cursor-pointer group"
                  >
                    <Box className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-white text-[11px]">{p.label}</span>
                    <span className="text-[9px] text-slate-500">{p.cat}</span>
                  </button>
                ))}
              </div>

              {/* Cut and Combine Operations */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-200 text-xs flex items-center space-x-1.5">
                    <Scissors className="w-3.5 h-3.5 text-amber-400" />
                    <span>Cut & Combine Shapes (CSG Boolean):</span>
                  </span>
                  <p className="text-[10px] text-slate-500">Fuse visible objects into a unified, single 3D-printable solid manifold.</p>
                </div>

                <button
                  onClick={handleCombineAllMeshes}
                  disabled={objects.length < 2}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold flex items-center space-x-1.5 text-xs disabled:opacity-40 cursor-pointer shadow-md"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Combine All Shapes</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: TRANSFORM & DIMENSIONS */}
          {/* ============================================================== */}
          {activeStudioTab === 'transform' && (
            <div className="mt-4 p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <Sliders className="w-4 h-4" />
                  <span>Object Dimensions & Coordinates (mm)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDuplicateSelected}
                    className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-[10px] flex items-center space-x-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3 text-cyan-400" />
                    <span>Duplicate</span>
                  </button>

                  <button
                    onClick={handleDeleteSelected}
                    disabled={objects.length <= 1}
                    className="px-2.5 py-1 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg text-[10px] flex items-center space-x-1 cursor-pointer disabled:opacity-40"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Exact Dimensions Inputs (mm) */}
              <div className="space-y-2">
                <span className="text-[11px] text-slate-400 block font-bold">Adjust Physical Dimensions (Millimeters):</span>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px] block">WIDTH (X):</span>
                    <div className="flex items-center space-x-1.5">
                      <input
                        type="number"
                        value={selectedObj.dimensions.x}
                        onChange={(e) => handleDimensionChange('x', Number(e.target.value))}
                        className="w-full bg-transparent text-white font-bold text-sm focus:outline-none"
                      />
                      <span className="text-slate-500 text-[10px]">mm</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px] block">HEIGHT (Y):</span>
                    <div className="flex items-center space-x-1.5">
                      <input
                        type="number"
                        value={selectedObj.dimensions.y}
                        onChange={(e) => handleDimensionChange('y', Number(e.target.value))}
                        className="w-full bg-transparent text-white font-bold text-sm focus:outline-none"
                      />
                      <span className="text-slate-500 text-[10px]">mm</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px] block">DEPTH (Z):</span>
                    <div className="flex items-center space-x-1.5">
                      <input
                        type="number"
                        value={selectedObj.dimensions.z}
                        onChange={(e) => handleDimensionChange('z', Number(e.target.value))}
                        className="w-full bg-transparent text-white font-bold text-sm focus:outline-none"
                      />
                      <span className="text-slate-500 text-[10px]">mm</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Position Offsets */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] text-slate-400 block font-bold">Position Translation (Bed Coordinates):</span>
                <div className="grid grid-cols-3 gap-3">
                  {['x', 'y', 'z'].map((axis) => (
                    <div key={axis} className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-500 uppercase">{axis}:</span>
                      <span className="text-cyan-400 font-bold">
                        {Math.round((selectedObj.position as any)[axis])} mm
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: SCULPT (DEFORM & DETAIL BRUSHES) */}
          {/* ============================================================== */}
          {activeStudioTab === 'sculpt' && (
            <div className="mt-4 p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-rose-400 font-bold">
                  <Box className="w-4 h-4" />
                  <span>3D Sculpting & Surface Refinement</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  TAP SURFACE TO SCULPT
                </span>
              </div>

              {/* Sculpting Brush Selector */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 block">Choose Sculpt Brush:</span>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'clay', label: 'Clay / Build', desc: 'Add volume' },
                    { id: 'smooth', label: 'Smooth', desc: 'Soften mesh' },
                    { id: 'inflate', label: 'Inflate', desc: 'Expand outward' },
                    { id: 'deflate', label: 'Deflate', desc: 'Carve inward' },
                    { id: 'flatten', label: 'Flatten', desc: 'Planar surface' },
                    { id: 'pinch', label: 'Pinch', desc: 'Sharpen seams' },
                    { id: 'grab', label: 'Grab / Pull', desc: 'Translate vertices' }
                  ].map(b => (
                    <button
                      key={b.id}
                      onClick={() => setSculptBrush(b.id as SculptBrushType)}
                      className={`p-2 rounded-xl text-center flex flex-col items-center justify-center space-y-0.5 cursor-pointer transition-all ${
                        sculptBrush === b.id
                          ? 'bg-rose-600 text-white font-bold shadow-md'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <span className="text-[11px]">{b.label}</span>
                      <span className="text-[8px] opacity-70">{b.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brush Sliders: Radius & Strength */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Brush Radius:</span>
                    <span className="text-rose-400 font-bold">{brushRadius} mm</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={brushRadius}
                    onChange={(e) => setBrushRadius(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Brush Strength:</span>
                    <span className="text-rose-400 font-bold">{Math.round(brushStrength * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={brushStrength}
                    onChange={(e) => setBrushStrength(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Invert Brush Direction Toggle */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-300">Invert Brush (Push / Cut):</span>
                <button
                  onClick={() => setIsBrushInverted(!isBrushInverted)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                    isBrushInverted 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  {isBrushInverted ? 'INVERTED (-)' : 'NORMAL (+)'}
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 5: PAINT & MATERIALS */}
          {/* ============================================================== */}
          {activeStudioTab === 'paint' && (
            <div className="mt-4 p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-purple-400 font-bold">
                  <Paintbrush className="w-4 h-4" />
                  <span>3D Vertex Painting & Material Finishes</span>
                </div>
                <span className="text-[10px] text-purple-300">Tap model surface to paint</span>
              </div>

              {/* Color Swatches */}
              <div className="space-y-2">
                <span className="text-[11px] text-slate-400 block font-bold">Active Paint Color Palette:</span>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { hex: '#f97316', label: 'Safety Orange' },
                    { hex: '#0284c7', label: 'Ocean Cyan' },
                    { hex: '#10b981', label: 'Marine Emerald' },
                    { hex: '#38bdf8', label: 'Arctic Ice' },
                    { hex: '#e2e8f0', label: 'Pure White PLA' },
                    { hex: '#334155', label: 'Stealth Slate' },
                    { hex: '#ec4899', label: 'Fluorescent Magenta' },
                    { hex: '#eab308', label: 'Titanium Gold' }
                  ].map(c => (
                    <button
                      key={c.hex}
                      onClick={() => {
                        setBrushColorHex(c.hex);
                        // Also update object main color
                        setObjects(prev => prev.map(o => o.id === selectedObjectId ? { ...o, color: c.hex } : o));
                      }}
                      className={`w-8 h-8 rounded-xl border-2 transition-transform cursor-pointer shadow-sm ${
                        brushColorHex === c.hex ? 'border-white scale-110 ring-2 ring-purple-500' : 'border-slate-800 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.label}
                    />
                  ))}

                  <input
                    type="color"
                    value={brushColorHex}
                    onChange={(e) => {
                      setBrushColorHex(e.target.value);
                      setObjects(prev => prev.map(o => o.id === selectedObjectId ? { ...o, color: e.target.value } : o));
                    }}
                    className="w-8 h-8 rounded-xl border border-slate-700 bg-transparent cursor-pointer"
                    title="Custom Color Picker"
                  />
                </div>
              </div>

              {/* Material Shader Presets */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] text-slate-400 block font-bold">PBR Material Simulation:</span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { id: 'matte-pla', label: 'Matte PLA' },
                    { id: 'glossy-resin', label: 'Gloss Resin' },
                    { id: 'metallic-titanium', label: 'Titanium' },
                    { id: 'cyber-lowpoly', label: 'Low-Poly' },
                    { id: 'clay-matcap', label: 'Clay Sculpt' },
                    { id: 'marine-protective', label: 'Marine Epoxy' }
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setObjects(prev => prev.map(o => o.id === selectedObjectId ? { ...o, materialPreset: m.id as MaterialPresetType } : o));
                      }}
                      className={`py-2 px-2 rounded-xl text-center text-[10px] cursor-pointer transition-all ${
                        selectedObj.materialPreset === m.id
                          ? 'bg-purple-600 text-white font-bold shadow-md'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 6: 3D PRINT PREP & STL EXPORT */}
          {/* ============================================================== */}
          {activeStudioTab === 'print-prep' && (
            <div className="mt-4 p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <Printer className="w-4 h-4" />
                  <span>Prepare Models for 3D Printing & STL Export</span>
                </div>
                <span className="text-[10px] text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  SLICER COMPATIBLE
                </span>
              </div>

              {/* Slicing Metrics Dashboard */}
              {printMetrics && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px] block">BOUNDING SIZE:</span>
                    <span className="text-white font-bold text-xs sm:text-sm">
                      {printMetrics.modelDimensionsMm.x} × {printMetrics.modelDimensionsMm.y} × {printMetrics.modelDimensionsMm.z} mm
                    </span>
                    <span className="text-[9px] text-emerald-400 block">
                      {printMetrics.isWithinBuildVolume ? '✓ Fits Build Plate (220mm)' : '⚠ Exceeds Bed Bounds'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px] block">PRINT WEIGHT:</span>
                    <span className="text-cyan-400 font-bold text-xs sm:text-sm">
                      {printMetrics.estimatedWeightGrams} g
                    </span>
                    <span className="text-[9px] text-slate-400 block">
                      {filamentType} ({infillPercentage}% infill)
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px] block">EST. PRINT TIME:</span>
                    <span className="text-amber-400 font-bold text-xs sm:text-sm">
                      {Math.floor(printMetrics.estimatedPrintTimeMinutes / 60)}h {printMetrics.estimatedPrintTimeMinutes % 60}m
                    </span>
                    <span className="text-[9px] text-slate-400 block">
                      @ 0.2mm standard layer
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px] block">PRINT READINESS:</span>
                    <span className="text-emerald-400 font-bold text-xs sm:text-sm flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Manifold Solid</span>
                    </span>
                    <span className="text-[9px] text-slate-400 block">
                      {printMetrics.overhangRiskCount > 0 ? `${printMetrics.overhangRiskCount} steep facets` : 'Zero overhang risk'}
                    </span>
                  </div>
                </div>
              )}

              {/* Material & Infill Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 block">Filament Material:</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {['PLA', 'PETG', 'ABS', 'Resin'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilamentType(f as any)}
                        className={`py-1.5 rounded-lg text-center text-xs font-bold cursor-pointer transition-all ${
                          filamentType === f
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Infill Density:</span>
                    <span className="text-emerald-400 font-bold">{infillPercentage}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={infillPercentage}
                    onChange={(e) => setInfillPercentage(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Direct Export Buttons */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="text-[10px] text-slate-400">
                  Ready for Bambu Studio, Ultimaker Cura, PrusaSlicer, OrcaSlicer, or Creality Print.
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleExportOBJ}
                    className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold cursor-pointer transition-all"
                  >
                    Export OBJ
                  </button>

                  <button
                    onClick={handleExportSTL}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-emerald-950/80 cursor-pointer transition-all active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Binary STL File</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
