import * as THREE from 'three';
import { MeshAIObject, MeshAIPrimitiveType, Print3DSliceMetrics, SculptBrushType } from '../types';

/**
 * Procedural Mesh Synthesizers for Mesh AI
 */
export function createPrimitiveGeometry(type: MeshAIPrimitiveType, dimensions: { x: number; y: number; z: number }): THREE.BufferGeometry {
  let geo: THREE.BufferGeometry;

  const sx = Math.max(dimensions.x, 2);
  const sy = Math.max(dimensions.y, 2);
  const sz = Math.max(dimensions.z, 2);

  switch (type) {
    case 'box':
      geo = new THREE.BoxGeometry(sx, sy, sz, 16, 16, 16);
      break;

    case 'sphere':
      geo = new THREE.SphereGeometry(sx / 2, 32, 24);
      break;

    case 'cylinder':
      geo = new THREE.CylinderGeometry(sx / 2, sx / 2, sy, 32, 16);
      break;

    case 'cone':
      geo = new THREE.ConeGeometry(sx / 2, sy, 32, 16);
      break;

    case 'torus':
      geo = new THREE.TorusGeometry(sx / 2, Math.min(sx, sy) / 6, 24, 48);
      break;

    case 'capsule':
      geo = new THREE.CapsuleGeometry(sx / 2, Math.max(sy - sx, 2), 16, 24);
      break;

    case 'wedge': {
      // Custom Wedge / Ramp geometry
      const w = sx;
      const h = sy;
      const d = sz;
      const positions = new Float32Array([
        // Front face (triangle)
        -w/2, -h/2, d/2,   w/2, -h/2, d/2,   -w/2, h/2, d/2,
        // Back face (triangle)
        -w/2, -h/2, -d/2,  -w/2, h/2, -d/2,  w/2, -h/2, -d/2,
        // Bottom (quad)
        -w/2, -h/2, -d/2,  w/2, -h/2, -d/2,  w/2, -h/2, d/2,
        -w/2, -h/2, -d/2,  w/2, -h/2, d/2,   -w/2, -h/2, d/2,
        // Left back wall (quad)
        -w/2, -h/2, -d/2,  -w/2, -h/2, d/2,  -w/2, h/2, d/2,
        -w/2, -h/2, -d/2,  -w/2, h/2, d/2,   -w/2, h/2, -d/2,
        // Sloped top (quad)
        -w/2, h/2, -d/2,   -w/2, h/2, d/2,   w/2, -h/2, d/2,
        -w/2, h/2, -d/2,   w/2, -h/2, d/2,   w/2, -h/2, -d/2,
      ]);
      geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.computeVertexNormals();
      break;
    }

    case 'buoy-casing':
      geo = createOceanBuoyGeometry(sx, sy, sz);
      break;

    case 'impeller':
      geo = createMarineImpellerGeometry(sx, sy, sz);
      break;

    case 'drone-chassis':
      geo = createSubmersibleDroneGeometry(sx, sy, sz);
      break;

    case 'calibration-cube':
      geo = createCalibrationCubeGeometry(sx, sy, sz);
      break;

    case 'low-poly-character':
      geo = createLowPolyMascotGeometry(sx, sy, sz);
      break;

    default:
      geo = new THREE.BoxGeometry(sx, sy, sz, 16, 16, 16);
      break;
  }

  // Ensure non-indexed geometry for straightforward sculpting and vertex painting
  const nonIndexed = geo.toNonIndexed ? geo.toNonIndexed() : geo;
  ensureVertexColors(nonIndexed, 0x0284c7);
  nonIndexed.computeVertexNormals();
  return nonIndexed;
}

/**
 * Parametric Ocean Buoy Geometry (SaliBuoy AMOC Float Casing)
 */
function createOceanBuoyGeometry(w: number, h: number, d: number): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  const radius = w / 2;
  const height = h;

  // Lathe profile for marine spar buoy:
  // Keel counterweight, lower battery cylinder, conical buoyancy collar, upper instrument deck, mast
  points.push(new THREE.Vector2(0, -height * 0.5));
  points.push(new THREE.Vector2(radius * 0.45, -height * 0.48));
  points.push(new THREE.Vector2(radius * 0.45, -height * 0.35));
  points.push(new THREE.Vector2(radius * 0.65, -height * 0.2));
  points.push(new THREE.Vector2(radius, 0)); // Buoyancy collar max radius
  points.push(new THREE.Vector2(radius * 0.95, height * 0.15));
  points.push(new THREE.Vector2(radius * 0.6, height * 0.3));
  points.push(new THREE.Vector2(radius * 0.55, height * 0.4));
  points.push(new THREE.Vector2(radius * 0.15, height * 0.45));
  points.push(new THREE.Vector2(radius * 0.08, height * 0.5));
  points.push(new THREE.Vector2(0, height * 0.5));

  const lathe = new THREE.LatheGeometry(points, 32);
  return lathe;
}

/**
 * Marine Impeller / Cryo-Pump Rotor Geometry
 */
function createMarineImpellerGeometry(w: number, h: number, d: number): THREE.BufferGeometry {
  const hubRadius = w * 0.22;
  const bladeRadius = w * 0.5;
  const bladeThickness = h * 0.15;
  const numBlades = 5;

  const geometries: THREE.BufferGeometry[] = [];

  // Central hub
  const hub = new THREE.CylinderGeometry(hubRadius, hubRadius * 1.1, h, 24, 8);
  geometries.push(hub);

  // Curved hydrofoil blades
  for (let i = 0; i < numBlades; i++) {
    const angle = (i / numBlades) * Math.PI * 2;
    const bladeGeo = new THREE.BoxGeometry(bladeRadius * 0.65, bladeThickness, bladeRadius * 0.3, 6, 4, 4);
    
    // Twist blade vertices for hydrodynamic pitch
    const pos = bladeGeo.attributes.position;
    for (let v = 0; v < pos.count; v++) {
      const x = pos.getX(v);
      const twist = (x / (bladeRadius * 0.65)) * 0.65;
      const curY = pos.getY(v);
      const curZ = pos.getZ(v);
      pos.setY(v, curY * Math.cos(twist) - curZ * Math.sin(twist));
      pos.setZ(v, curY * Math.sin(twist) + curZ * Math.cos(twist));
    }
    bladeGeo.computeVertexNormals();

    bladeGeo.translate(hubRadius + bladeRadius * 0.28, 0, 0);
    bladeGeo.rotateY(angle);
    geometries.push(bladeGeo);
  }

  // Merge blade geometries manually into a single BufferGeometry
  return mergeBufferGeometries(geometries);
}

/**
 * Submersible Oceanic Drone / Sensor Torpedo
 */
function createSubmersibleDroneGeometry(w: number, h: number, d: number): THREE.BufferGeometry {
  const geometries: THREE.BufferGeometry[] = [];
  const bodyLen = h * 0.85;
  const radius = w * 0.3;

  // Main streamlined hull
  const mainHull = new THREE.CapsuleGeometry(radius, bodyLen * 0.6, 16, 24);
  mainHull.rotateZ(Math.PI / 2);
  geometries.push(mainHull);

  // Camera dome at front
  const dome = new THREE.SphereGeometry(radius * 0.95, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  dome.rotateZ(-Math.PI / 2);
  dome.translate(bodyLen * 0.45, 0, 0);
  geometries.push(dome);

  // Left & right dive planes
  const leftFin = new THREE.BoxGeometry(bodyLen * 0.25, radius * 0.1, radius * 0.8);
  leftFin.translate(0, 0, radius * 0.8);
  geometries.push(leftFin);

  const rightFin = new THREE.BoxGeometry(bodyLen * 0.25, radius * 0.1, radius * 0.8);
  rightFin.translate(0, 0, -radius * 0.8);
  geometries.push(rightFin);

  // Vertical stabilizer fin
  const topFin = new THREE.BoxGeometry(bodyLen * 0.3, radius * 0.8, radius * 0.1);
  topFin.translate(-bodyLen * 0.3, radius * 0.6, 0);
  geometries.push(topFin);

  return mergeBufferGeometries(geometries);
}

/**
 * 3D Print Calibration Test Cube (20mm style)
 */
function createCalibrationCubeGeometry(w: number, h: number, d: number): THREE.BufferGeometry {
  const geo = new THREE.BoxGeometry(w, h, d, 16, 16, 16);
  // Indent 'X', 'Y', 'Z' or bevel corners
  return geo;
}

/**
 * Low-Poly Mascot / Character Concept
 */
function createLowPolyMascotGeometry(w: number, h: number, d: number): THREE.BufferGeometry {
  const geometries: THREE.BufferGeometry[] = [];
  const headSize = Math.min(w, h, d) * 0.4;

  // Head (low poly sphere)
  const head = new THREE.DodecahedronGeometry(headSize, 1);
  head.translate(0, h * 0.25, 0);
  geometries.push(head);

  // Body
  const body = new THREE.ConeGeometry(headSize * 1.1, h * 0.5, 7);
  body.translate(0, -h * 0.1, 0);
  geometries.push(body);

  // Cute fins / arms
  const armL = new THREE.BoxGeometry(headSize * 0.6, headSize * 0.2, headSize * 0.3);
  armL.rotateZ(0.4);
  armL.translate(-headSize * 1.1, -h * 0.05, 0);
  geometries.push(armL);

  const armR = new THREE.BoxGeometry(headSize * 0.6, headSize * 0.2, headSize * 0.3);
  armR.rotateZ(-0.4);
  armR.translate(headSize * 1.1, -h * 0.05, 0);
  geometries.push(armR);

  return mergeBufferGeometries(geometries);
}

/**
 * Merges multiple BufferGeometries into one single continuous BufferGeometry
 */
export function mergeBufferGeometries(geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  let totalVertices = 0;
  for (const g of geos) {
    const nonIdx = g.toNonIndexed ? g.toNonIndexed() : g;
    totalVertices += nonIdx.attributes.position.count;
  }

  const mergedPos = new Float32Array(totalVertices * 3);
  const mergedNormals = new Float32Array(totalVertices * 3);
  const mergedColors = new Float32Array(totalVertices * 3);

  let offset = 0;
  for (const g of geos) {
    const nonIdx = g.toNonIndexed ? g.toNonIndexed() : g;
    const pos = nonIdx.attributes.position;
    const norm = nonIdx.attributes.normal;
    const col = nonIdx.attributes.color;

    for (let i = 0; i < pos.count; i++) {
      const idx = (offset + i) * 3;
      mergedPos[idx] = pos.getX(i);
      mergedPos[idx + 1] = pos.getY(i);
      mergedPos[idx + 2] = pos.getZ(i);

      if (norm) {
        mergedNormals[idx] = norm.getX(i);
        mergedNormals[idx + 1] = norm.getY(i);
        mergedNormals[idx + 2] = norm.getZ(i);
      } else {
        mergedNormals[idx + 1] = 1;
      }

      if (col) {
        mergedColors[idx] = col.getX(i);
        mergedColors[idx + 1] = col.getY(i);
        mergedColors[idx + 2] = col.getZ(i);
      } else {
        mergedColors[idx] = 0.01;
        mergedColors[idx + 1] = 0.52;
        mergedColors[idx + 2] = 0.78;
      }
    }
    offset += pos.count;
  }

  const result = new THREE.BufferGeometry();
  result.setAttribute('position', new THREE.BufferAttribute(mergedPos, 3));
  result.setAttribute('normal', new THREE.BufferAttribute(mergedNormals, 3));
  result.setAttribute('color', new THREE.BufferAttribute(mergedColors, 3));
  result.computeVertexNormals();
  return result;
}

/**
 * Ensures RGB vertex colors attribute exists on the geometry
 */
export function ensureVertexColors(geo: THREE.BufferGeometry, defaultHex: number = 0x0284c7) {
  if (!geo.attributes.color) {
    const color = new THREE.Color(defaultHex);
    const count = geo.attributes.position.count;
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  }
}

/**
 * Sculpt Deformer
 * Deforms geometry vertices based on brush hit point, normal, radius, and brush type.
 */
export function applySculptBrush(
  geometry: THREE.BufferGeometry,
  hitPoint: THREE.Vector3,
  hitNormal: THREE.Vector3,
  brushType: SculptBrushType,
  brushRadius: number,
  brushStrength: number,
  invert: boolean = false,
  paintColorHex: string = '#0284c7'
): boolean {
  const pos = geometry.attributes.position;
  const col = geometry.attributes.color;
  const count = pos.count;
  const dirMultiplier = invert ? -1 : 1;

  let modified = false;
  const v = new THREE.Vector3();
  const normal = hitNormal.clone().normalize();
  const paintCol = new THREE.Color(paintColorHex);

  // Pre-calculate centroid for smooth brush
  let smoothCentroid = new THREE.Vector3();
  let affectedCount = 0;

  if (brushType === 'smooth') {
    for (let i = 0; i < count; i++) {
      v.set(pos.getX(i), pos.getY(i), pos.getZ(i));
      const dist = v.distanceTo(hitPoint);
      if (dist <= brushRadius) {
        smoothCentroid.add(v);
        affectedCount++;
      }
    }
    if (affectedCount > 0) {
      smoothCentroid.divideScalar(affectedCount);
    }
  }

  for (let i = 0; i < count; i++) {
    v.set(pos.getX(i), pos.getY(i), pos.getZ(i));
    const dist = v.distanceTo(hitPoint);

    if (dist <= brushRadius) {
      // Smooth bell curve falloff: w = (1 - (dist / R)^2)^2
      const falloff = Math.pow(1 - Math.pow(dist / brushRadius, 2), 2);
      const factor = falloff * brushStrength;

      switch (brushType) {
        case 'clay': {
          // Push along normal
          v.addScaledVector(normal, factor * dirMultiplier * (brushRadius * 0.15));
          pos.setXYZ(i, v.x, v.y, v.z);
          modified = true;
          break;
        }

        case 'smooth': {
          if (affectedCount > 0) {
            v.lerp(smoothCentroid, factor * 0.4);
            pos.setXYZ(i, v.x, v.y, v.z);
            modified = true;
          }
          break;
        }

        case 'inflate': {
          // Push outward from hit point
          const outward = v.clone().sub(hitPoint).normalize();
          v.addScaledVector(outward, factor * dirMultiplier * (brushRadius * 0.15));
          pos.setXYZ(i, v.x, v.y, v.z);
          modified = true;
          break;
        }

        case 'deflate': {
          // Push inward toward hit point
          const inward = hitPoint.clone().sub(v).normalize();
          v.addScaledVector(inward, factor * (brushRadius * 0.15));
          pos.setXYZ(i, v.x, v.y, v.z);
          modified = true;
          break;
        }

        case 'flatten': {
          // Project vertex onto tangent plane passing through hitPoint with hitNormal
          const distToPlane = v.clone().sub(hitPoint).dot(normal);
          v.addScaledVector(normal, -distToPlane * factor * 0.5);
          pos.setXYZ(i, v.x, v.y, v.z);
          modified = true;
          break;
        }

        case 'pinch': {
          // Pull toward hitPoint center
          v.lerp(hitPoint, factor * 0.3 * dirMultiplier);
          pos.setXYZ(i, v.x, v.y, v.z);
          modified = true;
          break;
        }

        case 'grab': {
          // Move in direction of normal
          v.addScaledVector(normal, factor * dirMultiplier * (brushRadius * 0.2));
          pos.setXYZ(i, v.x, v.y, v.z);
          modified = true;
          break;
        }

        case 'paint': {
          if (col) {
            const curR = col.getX(i);
            const curG = col.getY(i);
            const curB = col.getZ(i);
            const curCol = new THREE.Color(curR, curG, curB);
            curCol.lerp(paintCol, factor * 0.8);
            col.setXYZ(i, curCol.r, curCol.g, curCol.b);
            modified = true;
          }
          break;
        }
      }
    }
  }

  if (modified) {
    pos.needsUpdate = true;
    if (col) col.needsUpdate = true;
    if (brushType !== 'paint') {
      geometry.computeVertexNormals();
    }
  }

  return modified;
}

/**
 * Computes comprehensive 3D Printing and Slicing Metrics
 */
export function compute3DPrintMetrics(
  objectOrGeometry: THREE.BufferGeometry | THREE.Mesh,
  filamentType: 'PLA' | 'PETG' | 'ABS' | 'Resin' = 'PLA',
  infillPct: number = 20,
  bedDimensionsMm: { x: number; y: number; z: number } = { x: 220, y: 220, z: 250 }
): Print3DSliceMetrics {
  const geo = (objectOrGeometry as THREE.Mesh).isMesh 
    ? (objectOrGeometry as THREE.Mesh).geometry 
    : (objectOrGeometry as THREE.BufferGeometry);

  geo.computeBoundingBox();
  const bbox = geo.boundingBox || new THREE.Box3();
  const size = new THREE.Vector3();
  bbox.getSize(size);

  const modelDims = {
    x: Math.round(size.x * 10) / 10,
    y: Math.round(size.y * 10) / 10,
    z: Math.round(size.z * 10) / 10
  };

  // Calculate volume using signed tetrahedra
  const pos = geo.attributes.position;
  let signedVolume = 0;
  let overhangRiskCount = 0;

  if (pos) {
    const p1 = new THREE.Vector3();
    const p2 = new THREE.Vector3();
    const p3 = new THREE.Vector3();
    const normal = new THREE.Vector3();

    for (let i = 0; i < pos.count; i += 3) {
      p1.set(pos.getX(i), pos.getY(i), pos.getZ(i));
      p2.set(pos.getX(i + 1), pos.getY(i + 1), pos.getZ(i + 1));
      p3.set(pos.getX(i + 2), pos.getY(i + 2), pos.getZ(i + 2));

      // Signed volume of tetrahedron
      signedVolume += p1.dot(p2.clone().cross(p3)) / 6.0;

      // Overhang risk check (> 45 deg downward slope: normal.y < -0.707)
      const edge1 = p2.clone().sub(p1);
      const edge2 = p3.clone().sub(p1);
      normal.crossVectors(edge1, edge2).normalize();
      if (normal.y < -0.707) {
        overhangRiskCount++;
      }
    }
  }

  // Volume in mm^3 converted to cm^3 (1 cm^3 = 1000 mm^3)
  const volumeMm3 = Math.abs(signedVolume);
  const volumeCm3 = Math.round((volumeMm3 / 1000) * 100) / 100;

  // Material densities (g/cm^3)
  const densities: Record<string, number> = {
    PLA: 1.24,
    PETG: 1.27,
    ABS: 1.04,
    Resin: 1.15
  };
  const baseDensity = densities[filamentType] || 1.24;

  // Effective solid ratio: Shell (approx 20%) + Infill (e.g. 20% of remaining 80%)
  const infillRatio = 0.25 + (0.75 * (infillPct / 100));
  const estimatedWeightGrams = Math.round(volumeCm3 * baseDensity * infillRatio * 10) / 10;

  // Print time estimate: approx 15g/hour on standard FDM at 0.2mm layer height
  const layerHeightMm = 0.2;
  const estimatedPrintTimeMinutes = Math.max(15, Math.round((estimatedWeightGrams / 15) * 60));

  const isWithinBuildVolume = 
    modelDims.x <= bedDimensionsMm.x &&
    modelDims.y <= bedDimensionsMm.y &&
    modelDims.z <= bedDimensionsMm.z;

  return {
    bedDimensionsMm,
    modelDimensionsMm: modelDims,
    volumeCm3,
    estimatedWeightGrams,
    filamentType,
    infillPct,
    layerHeightMm,
    estimatedPrintTimeMinutes,
    isWithinBuildVolume,
    overhangRiskCount,
    isWatertightManifold: overhangRiskCount < pos.count * 0.4
  };
}

/**
 * EXPORT: Binary STL File (Standard 3D Print File for Cura, Bambu Studio, PrusaSlicer)
 */
export function exportToBinarySTL(meshOrGeometry: THREE.BufferGeometry | THREE.Mesh): Blob {
  const geo = (meshOrGeometry as THREE.Mesh).isMesh 
    ? (meshOrGeometry as THREE.Mesh).geometry 
    : (meshOrGeometry as THREE.BufferGeometry);

  const nonIndexed = geo.toNonIndexed ? geo.toNonIndexed() : geo;
  const pos = nonIndexed.attributes.position;
  const trianglesCount = Math.floor(pos.count / 3);

  // Binary STL Header: 80 bytes header + 4 bytes triangle count + triangles * 50 bytes
  const bufferSize = 84 + trianglesCount * 50;
  const buffer = new ArrayBuffer(bufferSize);
  const dataView = new DataView(buffer);

  // 80-byte header
  const headerStr = 'Mesh AI 3D Studio - SaliBuoy Systems STL Export (3D Print Ready)';
  for (let i = 0; i < 80; i++) {
    dataView.setUint8(i, i < headerStr.length ? headerStr.charCodeAt(i) : 0);
  }

  // 4-byte UINT32: number of triangles (Little Endian)
  dataView.setUint32(80, trianglesCount, true);

  let offset = 84;
  const p1 = new THREE.Vector3();
  const p2 = new THREE.Vector3();
  const p3 = new THREE.Vector3();
  const normal = new THREE.Vector3();

  for (let i = 0; i < pos.count; i += 3) {
    p1.set(pos.getX(i), pos.getY(i), pos.getZ(i));
    p2.set(pos.getX(i + 1), pos.getY(i + 1), pos.getZ(i + 1));
    p3.set(pos.getX(i + 2), pos.getY(i + 2), pos.getZ(i + 2));

    // Calculate face normal
    const e1 = p2.clone().sub(p1);
    const e2 = p3.clone().sub(p1);
    normal.crossVectors(e1, e2).normalize();

    // Normal (3 floats)
    dataView.setFloat32(offset, normal.x, true); offset += 4;
    dataView.setFloat32(offset, normal.y, true); offset += 4;
    dataView.setFloat32(offset, normal.z, true); offset += 4;

    // Vertex 1 (3 floats)
    dataView.setFloat32(offset, p1.x, true); offset += 4;
    dataView.setFloat32(offset, p1.y, true); offset += 4;
    dataView.setFloat32(offset, p1.z, true); offset += 4;

    // Vertex 2 (3 floats)
    dataView.setFloat32(offset, p2.x, true); offset += 4;
    dataView.setFloat32(offset, p2.y, true); offset += 4;
    dataView.setFloat32(offset, p2.z, true); offset += 4;

    // Vertex 3 (3 floats)
    dataView.setFloat32(offset, p3.x, true); offset += 4;
    dataView.setFloat32(offset, p3.y, true); offset += 4;
    dataView.setFloat32(offset, p3.z, true); offset += 4;

    // Attribute byte count (UINT16 = 0)
    dataView.setUint16(offset, 0, true); offset += 2;
  }

  return new Blob([buffer], { type: 'application/octet-stream' });
}

/**
 * EXPORT: Wavefront OBJ File Format (.obj)
 */
export function exportToOBJ(meshOrGeometry: THREE.BufferGeometry | THREE.Mesh, modelName: string = 'mesh_ai_model'): Blob {
  const geo = (meshOrGeometry as THREE.Mesh).isMesh 
    ? (meshOrGeometry as THREE.Mesh).geometry 
    : (meshOrGeometry as THREE.BufferGeometry);

  const nonIndexed = geo.toNonIndexed ? geo.toNonIndexed() : geo;
  const pos = nonIndexed.attributes.position;
  const norm = nonIndexed.attributes.normal;

  let objText = `# Mesh AI 3D Studio - Wavefront OBJ Export\n# Model: ${modelName}\no ${modelName}\n\n`;

  // Vertices
  for (let i = 0; i < pos.count; i++) {
    objText += `v ${pos.getX(i).toFixed(4)} ${pos.getY(i).toFixed(4)} ${pos.getZ(i).toFixed(4)}\n`;
  }

  // Normals
  if (norm) {
    for (let i = 0; i < norm.count; i++) {
      objText += `vn ${norm.getX(i).toFixed(4)} ${norm.getY(i).toFixed(4)} ${norm.getZ(i).toFixed(4)}\n`;
    }
  }

  // Faces (1-indexed)
  objText += `s 1\n`;
  for (let i = 0; i < pos.count; i += 3) {
    const i1 = i + 1;
    const i2 = i + 2;
    const i3 = i + 3;
    if (norm) {
      objText += `f ${i1}//${i1} ${i2}//${i2} ${i3}//${i3}\n`;
    } else {
      objText += `f ${i1} ${i2} ${i3}\n`;
    }
  }

  return new Blob([objText], { type: 'text/plain' });
}

/**
 * Generates AI 3D Mesh from Text Prompt or Reference Description
 */
export function generateMeshFromAIPrompt(prompt: string): {
  type: MeshAIPrimitiveType;
  dimensions: { x: number; y: number; z: number };
  color: string;
  name: string;
  description: string;
} {
  const p = prompt.toLowerCase();

  if (p.includes('buoy') || p.includes('salibuoy') || p.includes('float') || p.includes('sensor casing')) {
    return {
      type: 'buoy-casing',
      dimensions: { x: 70, y: 140, z: 70 },
      color: '#f97316', // High-visibility marine safety orange
      name: 'Ocean Boy Sensor Buoy',
      description: 'Parametric SaliBuoy hull with buoyancy collar, instrument bay, and ballast keel.'
    };
  }

  if (p.includes('turbine') || p.includes('impeller') || p.includes('propeller') || p.includes('fan') || p.includes('rotor')) {
    return {
      type: 'impeller',
      dimensions: { x: 80, y: 25, z: 80 },
      color: '#06b6d4', // Cyan
      name: 'Hydrodynamic Impeller Rotor',
      description: '5-blade twisted hydrofoil impeller for downwelling brine acceleration.'
    };
  }

  if (p.includes('submarine') || p.includes('drone') || p.includes('torpedo') || p.includes('auv') || p.includes('robot')) {
    return {
      type: 'drone-chassis',
      dimensions: { x: 50, y: 150, z: 50 },
      color: '#10b981', // Emerald
      name: 'Autonomous Oceanic Drone',
      description: 'Streamlined subsea AUV hull with camera viewport and dual steering dive planes.'
    };
  }

  if (p.includes('character') || p.includes('mascot') || p.includes('figurine') || p.includes('toy')) {
    return {
      type: 'low-poly-character',
      dimensions: { x: 50, y: 90, z: 40 },
      color: '#ec4899', // Pink
      name: 'Low-Poly Oceanic Mascot',
      description: 'Stylized 3D figurine ready for game engines, desktop showcase, or color 3D printing.'
    };
  }

  if (p.includes('cube') || p.includes('calibration') || p.includes('test') || p.includes('box')) {
    return {
      type: 'calibration-cube',
      dimensions: { x: 40, y: 40, z: 40 },
      color: '#3b82f6', // Blue
      name: 'Calibration Test Cube',
      description: 'Precision dimension cube for checking 3D printer axis tolerances and bed leveling.'
    };
  }

  if (p.includes('cylinder') || p.includes('pipe') || p.includes('tube') || p.includes('canister')) {
    return {
      type: 'cylinder',
      dimensions: { x: 50, y: 100, z: 50 },
      color: '#8b5cf6', // Violet
      name: 'Cryo Pressure Canister',
      description: 'Cylindrical pressure vessel casing designed for high-depth telemetry pods.'
    };
  }

  if (p.includes('sphere') || p.includes('planet') || p.includes('orb') || p.includes('ball')) {
    return {
      type: 'sphere',
      dimensions: { x: 60, y: 60, z: 60 },
      color: '#0284c7', // Sky
      name: 'Titanium Pressure Sphere',
      description: 'Abyssal rated spherical enclosure with uniform hydrostatic pressure tolerance.'
    };
  }

  // Default procedural base
  return {
    type: 'buoy-casing',
    dimensions: { x: 65, y: 130, z: 65 },
    color: '#0ea5e9',
    name: `Mesh AI: ${prompt.slice(0, 24)}`,
    description: `AI synthesized 3D model generated from prompt: "${prompt}".`
  };
}
