import React, { useState, useRef, useEffect } from 'react';
import { 
  CloudRain, 
  Compass, 
  Wind, 
  Thermometer, 
  Activity, 
  Sparkles, 
  Download, 
  RefreshCw, 
  Layers, 
  Eye, 
  Globe2, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Radio,
  MapPin,
  CheckCircle2,
  Image as ImageIcon,
  Trash2,
  Camera
} from 'lucide-react';
import { downloadFile } from '../utils/exportUtils';
import { requestGoogleAccessToken } from '../utils/googleAuth';
import { microsoftGraphService, OneDriveFileItem } from '../services/microsoftGraphService';

interface SavedSnapshot {
  id: string;
  timestamp: string;
  satelliteName: string;
  region: string;
  layer: string;
  dataUrl: string;
  windSpeedKnots: number;
  iceThicknessMeters: number;
}

interface SatelliteOption {
  id: string;
  name: string;
  agency: string;
  orbitType: 'Geostationary (35,786 km)' | 'Sun-Synchronous Polar Orbit (600–824 km)' | 'Laser Altimeter Polar Orbit';
  primaryCoverage: string;
  revisitFrequency: string;
  keySensors: string;
  description: string;
}

const SATELLITE_CATALOG: SatelliteOption[] = [
  {
    id: 'himawari-9',
    name: 'Himawari-9',
    agency: 'Japan Meteorological Agency (JMA) / MetService NZ',
    orbitType: 'Geostationary (35,786 km)',
    primaryCoverage: 'New Zealand, Tasman Sea, Western Pacific',
    revisitFrequency: 'Continuous Real-Time (10-minute refresh)',
    keySensors: 'AHI (Advanced Himawari Imager) Visible & IR',
    description: 'Main real-time weather imagery satellite parked high above the equator. Views New Zealand continuously from the north, providing real-time cloud and storm motion.'
  },
  {
    id: 'noaa-jpss',
    name: 'NOAA JPSS (NOAA-20 / NOAA-21)',
    agency: 'NOAA / US National Weather Service',
    orbitType: 'Sun-Synchronous Polar Orbit (600–824 km)',
    primaryCoverage: 'Global, Direct South Pole & North Pole passes',
    revisitFrequency: '14 Orbits / Day (Passes NZ twice daily)',
    keySensors: 'VIIRS (Visible Infrared Imaging Radiometer Suite) & CrIS',
    description: 'Foundational polar-orbiting weather fleet circling pole-to-pole 14 times daily. Serves as backbone for global 3-to-7 day weather prediction models.'
  },
  {
    id: 'nasa-aqua-terra',
    name: 'NASA Aqua & Terra',
    agency: 'NASA Earth Science Division',
    orbitType: 'Sun-Synchronous Polar Orbit (600–824 km)',
    primaryCoverage: 'Global Polar Regions & Oceans',
    revisitFrequency: 'Twice daily per location',
    keySensors: 'MODIS (Moderate Resolution Imaging Spectroradiometer)',
    description: 'Long-running climate research satellites capturing true-color visual imagery, sea surface temperature (SST), and chlorophyll density across both poles.'
  },
  {
    id: 'esa-aws',
    name: 'ESA Arctic Weather Satellite (AWS)',
    agency: 'European Space Agency (ESA)',
    orbitType: 'Sun-Synchronous Polar Orbit (600–824 km)',
    primaryCoverage: 'Arctic & Antarctic High-Latitude Zones',
    revisitFrequency: 'High-frequency polar passes',
    keySensors: '19-channel Microwave Sounder (Atmosphere Profiling)',
    description: 'Custom-built polar satellite measuring atmospheric temperature and humidity profiles through cloud cover for precise high-latitude weather forecasting.'
  },
  {
    id: 'nasa-icesat2',
    name: 'NASA ICESat-2',
    agency: 'NASA Goddard Space Flight Center',
    orbitType: 'Laser Altimeter Polar Orbit',
    primaryCoverage: 'North Pole & South Pole Ice Sheets',
    revisitFrequency: '91-day repeat orbit with off-pointing',
    keySensors: 'ATLAS (Advanced Topographic Laser Altimeter System)',
    description: 'Precision space laser altimeter measuring sea-ice thickness, freeboard elevation, and glacier melt down to millimeter accuracy across both poles.'
  }
];

export const PolarAnalysisPanel: React.FC = () => {
  const [analysisText, setAnalysisText] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  const startTelemetryAnalysis = () => {
    setAnalysisText('');
    setIsStreaming(true);

    // Connect to the Node/Express SSE endpoint
    const eventSource = new EventSource('/api/stream-polar-analysis?date=2026-09-01');

    eventSource.onmessage = (event) => {
      if (event.data === '[DONE]') {
        eventSource.close();
        setIsStreaming(false);
        return;
      }

      try {
        const parsedData = JSON.parse(event.data);
        if (parsedData.text) {
          // Functional state update prevents closure stale data bugs during fast streams
          setAnalysisText((prev) => prev + parsedData.text);
        }
      } catch (e) {
        console.error('Error parsing SSE event chunk:', e);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE Connection failed:', err);
      eventSource.close();
      setIsStreaming(false);
    };
  };

  return (
    <div className="p-5 bg-slate-900 text-white rounded-2xl shadow-md border border-slate-800 space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2 text-sky-400 font-bold">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Antarctic Telemetry Matrix (Live SSE Stream)</span>
        </div>
        <span className="text-[10px] bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800">
          EPSG:3031 STEREOGRAPHIC
        </span>
      </div>

      <button
        onClick={startTelemetryAnalysis}
        disabled={isStreaming}
        className="px-4 py-2.5 bg-gradient-to-r from-sky-600 to-teal-500 hover:from-sky-500 hover:to-teal-400 text-slate-950 rounded-xl font-bold disabled:bg-slate-800 disabled:text-slate-500 transition cursor-pointer flex items-center space-x-2"
      >
        {isStreaming ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
            <span>Streaming Live AI Evaluation...</span>
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 text-slate-950" />
            <span>Run South Pole Synthesis (Live SSE Stream)</span>
          </>
        )}
      </button>

      <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 min-h-32 whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-slate-300">
        {analysisText || <span className="text-slate-500 italic">Awaiting pipeline initialization... Click button to start live stream.</span>}
      </div>
    </div>
  );
};

export const SatelliteWeather: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<'new-zealand' | 'south-pole' | 'north-pole'>('new-zealand');
  const [selectedSatId, setSelectedSatId] = useState<string>('himawari-9');
  const [activeLayer, setActiveLayer] = useState<'true-color' | 'wind-vectors' | 'sea-ice' | 'infrared'>('true-color');
  
  // Simulated Live Meteorological Controls
  const [windSpeedKnots, setWindSpeedKnots] = useState<number>(38);
  const [cloudCoverPct, setCloudCoverPct] = useState<number>(64);
  const [seaIceThicknessMeters, setSeaIceThicknessMeters] = useState<number>(1.45);
  
  // AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  // Saved Satellite Imagery Snapshots
  const [savedSnapshots, setSavedSnapshots] = useState<SavedSnapshot[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Google Workspace & Microsoft OneDrive Export States
  const [googleDocUrl, setGoogleDocUrl] = useState<string | null>(null);
  const [googleDriveFileUrl, setGoogleDriveFileUrl] = useState<string | null>(null);
  const [oneDriveUrl, setOneDriveUrl] = useState<string | null>(null);
  const [isExportingDoc, setIsExportingDoc] = useState<boolean>(false);
  const [isExportingDrive, setIsExportingDrive] = useState<boolean>(false);
  const [isExportingOneDrive, setIsExportingOneDrive] = useState<boolean>(false);
  const [workspaceStatusMsg, setWorkspaceStatusMsg] = useState<string | null>(null);

  const activeSatellite = SATELLITE_CATALOG.find(s => s.id === selectedSatId) || SATELLITE_CATALOG[0];

  // Microsoft Graph OneDrive File Management State
  const [msUser, setMsUser] = useState(microsoftGraphService.getUser());
  const [oneDriveFiles, setOneDriveFiles] = useState<OneDriveFileItem[]>([]);
  const [isSyncingOneDrive, setIsSyncingOneDrive] = useState<boolean>(false);

  // Sync / Refresh OneDrive Files list via Microsoft Graph API
  const refreshOneDriveFiles = async () => {
    if (!microsoftGraphService.isAuthenticated()) return;
    setIsSyncingOneDrive(true);
    try {
      const files = await microsoftGraphService.listFiles('SaliBuoy_Satellite_Weather');
      setOneDriveFiles(files);
    } catch (err) {
      console.warn('Listing OneDrive files warning:', err);
    } finally {
      setIsSyncingOneDrive(false);
    }
  };

  // Function to Export Satellite Report / Image to Microsoft OneDrive (salibuoy.systems@outlook.com)
  const exportToOneDrive = async (customImageData?: string, customFileName?: string) => {
    setIsExportingOneDrive(true);
    setWorkspaceStatusMsg('Connecting to Microsoft Graph API for salibuoy.systems@outlook.com...');
    setOneDriveUrl(null);

    let imageData = customImageData;
    if (!imageData) {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = 1000;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, 1000, 600);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 18px monospace';
        ctx.fillText(`SALI BUOY SATELLITE SNAPSHOT • ${activeSatellite.name.toUpperCase()}`, 40, 48);
      }
      imageData = canvas.toDataURL('image/png');
    }

    try {
      const fileName = customFileName || `SaliBuoy_Satellite_${activeSatellite.id}_${selectedRegion}_${new Date().toISOString().split('T')[0]}.png`;

      // 1. Ensure Microsoft OAuth2 Login session
      if (!microsoftGraphService.isAuthenticated()) {
        const user = await microsoftGraphService.login();
        setMsUser(user);
      }

      // 2. Upload directly via Microsoft Graph API
      const uploadedFile = await microsoftGraphService.uploadFile(
        fileName,
        imageData,
        'image/png',
        'SaliBuoy_Satellite_Weather'
      );

      // Trigger standard browser download formatted for OneDrive folder import as secondary copy
      const link = document.createElement('a');
      link.href = imageData;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setOneDriveUrl(uploadedFile.webUrl || 'https://onedrive.live.com');
      setWorkspaceStatusMsg(`Successfully uploaded ${fileName} to OneDrive (salibuoy.systems@outlook.com)!`);

      // Refresh file list
      refreshOneDriveFiles();

    } catch (err: any) {
      console.error('OneDrive export error:', err);
      setWorkspaceStatusMsg(err?.message || 'Failed to complete OneDrive upload.');
    } finally {
      setIsExportingOneDrive(false);
    }
  };

  // Function to Export Satellite Report to Google Docs
  const exportReportToGoogleDoc = async () => {
    setIsExportingDoc(true);
    setWorkspaceStatusMsg('Connecting to Google Docs...');
    setGoogleDocUrl(null);

    try {
      const accessToken = await requestGoogleAccessToken([
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/drive.file'
      ]);

      const docTitle = `SaliBuoy Satellite Weather Report - ${selectedRegion.toUpperCase()} (${new Date().toISOString().split('T')[0]})`;
      const docContent = `SALIBUOY SYSTEMS - POLAR & NEW ZEALAND SATELLITE WEATHER REPORT
===============================================================
Date: ${new Date().toISOString()}
Target Region: ${selectedRegion.toUpperCase()}
Selected Satellite: ${activeSatellite.name} (${activeSatellite.agency})
Orbit Type: ${activeSatellite.orbitType}
Key Sensors: ${activeSatellite.keySensors}

LIVE TELEMETRY SNAPSHOT:
-----------------------
- Surface Wind Speed: ${windSpeedKnots} Knots
- Cloud Cover Index: ${cloudCoverPct}%
- ICESat-2 Sea Ice Thickness: ${seaIceThicknessMeters} Meters
- Wind Turbine Rotor Power Generation: ${Math.round(0.5 * 1.225 * 3.2 * Math.pow(windSpeedKnots * 0.514, 3) * 0.38)} Watts / Buoy

AI OCEANOGRAPHIC & METEOROLOGICAL EVALUATION:
-------------------------------------------
${aiReport || 'Polar satellite synthesis active. Wind turbine rotor kinetic harvesting nominal across target EEZ sector.'}
`;

      const response = await fetch('/api/export-to-google-doc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          title: docTitle,
          contentText: docContent
        })
      });

      const data = await response.json();
      if (data.documentUrl) {
        setGoogleDocUrl(data.documentUrl);
        setWorkspaceStatusMsg('Successfully created Google Document!');
      } else {
        setWorkspaceStatusMsg(data.error || 'Failed to export to Google Docs.');
      }
    } catch (err: any) {
      console.error('Google Doc export error:', err);
      setWorkspaceStatusMsg(err?.message || 'Google Auth cancelled or failed.');
    } finally {
      setIsExportingDoc(false);
    }
  };

  // Function to Upload Satellite Image PNG Snapshot to Google Drive
  const uploadImageToGoogleDrive = async (pngDataUrl?: string, customName?: string) => {
    setIsExportingDrive(true);
    setWorkspaceStatusMsg('Uploading snapshot to Google Drive...');
    setGoogleDriveFileUrl(null);

    let base64Image = pngDataUrl;

    if (!base64Image) {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = 1000;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw satellite canvas
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, 1000, 600);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 18px monospace';
        ctx.fillText(`SALI BUOY SATELLITE SNAPSHOT • ${activeSatellite.name.toUpperCase()}`, 40, 48);
      }
      base64Image = canvas.toDataURL('image/png');
    }

    try {
      const accessToken = await requestGoogleAccessToken([
        'https://www.googleapis.com/auth/drive.file'
      ]);

      const fileName = customName || `SaliBuoy_Satellite_${activeSatellite.id}_${selectedRegion}_${new Date().toISOString().split('T')[0]}.png`;

      const response = await fetch('/api/export-image-to-google-drive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          fileName,
          mimeType: 'image/png',
          base64Data: base64Image
        })
      });

      const data = await response.json();
      if (data.webViewLink) {
        setGoogleDriveFileUrl(data.webViewLink);
        setWorkspaceStatusMsg('Successfully uploaded to Google Drive!');
      } else {
        setWorkspaceStatusMsg(data.error || 'Failed to upload to Google Drive.');
      }
    } catch (err: any) {
      console.error('Google Drive upload error:', err);
      setWorkspaceStatusMsg(err?.message || 'Google Auth cancelled or failed.');
    } finally {
      setIsExportingDrive(false);
    }
  };

  // Function to render High-Res Satellite Snapshot to HTML5 Canvas and Save/Download
  const captureAndDownloadSnapshot = () => {
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Dark Space Background
    const bgGradient = ctx.createLinearGradient(0, 0, 1000, 600);
    bgGradient.addColorStop(0, '#020617');
    bgGradient.addColorStop(0.5, '#0f172a');
    bgGradient.addColorStop(1, '#020617');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1000, 600);

    // 2. Grid Lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < 1000; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 600);
      ctx.stroke();
    }
    for (let y = 0; y < 600; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1000, y);
      ctx.stroke();
    }

    // 3. Simulated Polar Globe / Earth Radius
    const globeGrad = ctx.createRadialGradient(500, 320, 50, 500, 320, 240);
    if (selectedRegion === 'new-zealand') {
      globeGrad.addColorStop(0, '#0284c7');
      globeGrad.addColorStop(0.6, '#0369a1');
      globeGrad.addColorStop(1, '#0f172a');
    } else if (selectedRegion === 'south-pole') {
      globeGrad.addColorStop(0, '#0d9488');
      globeGrad.addColorStop(0.7, '#115e59');
      globeGrad.addColorStop(1, '#020617');
    } else {
      globeGrad.addColorStop(0, '#6366f1');
      globeGrad.addColorStop(0.7, '#4338ca');
      globeGrad.addColorStop(1, '#0f172a');
    }
    ctx.fillStyle = globeGrad;
    ctx.beginPath();
    ctx.arc(500, 320, 220, 0, Math.PI * 2);
    ctx.fill();

    // 4. Cloud Formations / Ice Rings based on activeLayer
    ctx.fillStyle = activeLayer === 'infrared' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.arc(500, 300, 140, 0, Math.PI * 1.5);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(460, 340, 90, 0, Math.PI * 2);
    ctx.fill();

    // 5. Reticle Target Overlay
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(500, 320, 40, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(440, 320);
    ctx.lineTo(560, 320);
    ctx.moveTo(500, 260);
    ctx.lineTo(500, 380);
    ctx.stroke();

    // 6. Header HUD Box
    ctx.fillStyle = '#090d16';
    ctx.fillRect(20, 20, 960, 70);
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(20, 20, 960, 70);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`SALI BUOY SATELLITE SNAPSHOT • ${activeSatellite.name.toUpperCase()}`, 40, 48);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px monospace';
    ctx.fillText(`Agency: ${activeSatellite.agency} | Orbit: ${activeSatellite.orbitType}`, 40, 68);

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    ctx.fillStyle = '#34d399';
    ctx.fillText(`TIMESTAMP: ${nowStr}`, 680, 48);
    ctx.fillText(`REGION: ${selectedRegion.toUpperCase()} (${activeLayer.toUpperCase()})`, 680, 68);

    // 7. Footer HUD Telemetry Box
    ctx.fillStyle = '#090d16';
    ctx.fillRect(20, 500, 960, 80);
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(20, 500, 960, 80);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`SURFACE WIND: ${windSpeedKnots} KNOTS`, 40, 530);
    ctx.fillText(`CLOUD COVER INDEX: ${cloudCoverPct}%`, 280, 530);
    ctx.fillText(`SEA ICE THICKNESS: ${seaIceThicknessMeters} METERS`, 540, 530);

    const powerW = Math.round(0.5 * 1.225 * 3.2 * Math.pow(windSpeedKnots * 0.514, 3) * 0.38);
    ctx.fillStyle = '#34d399';
    ctx.fillText(`ROTOR HARVESTING YIELD: ${powerW} WATTS / BUOY`, 40, 558);
    ctx.fillText(`COORDINATES: ${selectedRegion === 'new-zealand' ? '41.2865° S, 174.7762° E' : selectedRegion === 'south-pole' ? '52.5483° S, 169.1417° E' : '89.5000° N, 45.0000° W'}`, 540, 558);

    // Convert Canvas to PNG Data URL
    const pngDataUrl = canvas.toDataURL('image/png');

    // Trigger Browser PNG File Download
    const downloadLink = document.createElement('a');
    const fileName = `SaliBuoy_Satellite_${activeSatellite.id}_${selectedRegion}_${new Date().toISOString().split('T')[0]}.png`;
    downloadLink.href = pngDataUrl;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Save snapshot to local state gallery
    const newSnapshot: SavedSnapshot = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      satelliteName: activeSatellite.name,
      region: selectedRegion.toUpperCase(),
      layer: activeLayer.toUpperCase(),
      dataUrl: pngDataUrl,
      windSpeedKnots,
      iceThicknessMeters: seaIceThicknessMeters
    };

    setSavedSnapshots(prev => [newSnapshot, ...prev]);
  };

  const deleteSavedSnapshot = (id: string) => {
    setSavedSnapshots(prev => prev.filter(s => s.id !== id));
  };

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    setAiReport(null);

    const regionNames = {
      'new-zealand': 'New Zealand, Tasman Sea & Hauraki Gulf',
      'south-pole': 'South Pole & Campbell Plateau (Southern Ocean)',
      'north-pole': 'North Pole & Greenland Basin (Arctic Ocean)'
    };

    try {
      const response = await fetch('/api/analyze-polar-weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region: regionNames[selectedRegion],
          satellite: activeSatellite.name,
          date: new Date().toISOString().split('T')[0],
          windSpeedKnots,
          cloudCoverPct,
          seaIceThicknessMeters
        })
      });

      const data = await response.json();
      setAiReport(data.analysis || data.error || 'Failed to generate report.');
    } catch (err) {
      setAiReport('Failed to connect to backend AI server. Please check your network connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const exportSatelliteReport = () => {
    const reportText = `
SALIBUOY SYSTEMS - POLAR & NEW ZEALAND SATELLITE WEATHER REPORT
===============================================================
Date: ${new Date().toISOString()}
Target Region: ${selectedRegion.toUpperCase()}
Selected Satellite: ${activeSatellite.name} (${activeSatellite.agency})
Orbit Type: ${activeSatellite.orbitType}
Key Sensors: ${activeSatellite.keySensors}

LIVE TELEMETRY SNAPSHOT:
-----------------------
- Surface Wind Speed: ${windSpeedKnots} Knots
- Cloud Cover Index: ${cloudCoverPct}%
- ICESat-2 Sea Ice Thickness: ${seaIceThicknessMeters} Meters
- Wind Turbine Rotor Power Generation: ${Math.round(0.5 * 1.225 * 3.2 * Math.pow(windSpeedKnots * 0.514, 3) * 0.38)} Watts / Buoy

AI OCEANOGRAPHIC & METEOROLOGICAL ANALYSIS:
-------------------------------------------
${aiReport || 'No AI analysis run yet. Trigger analysis in the SaliBuoy Satellite Weather Radar dashboard.'}
`;
    downloadFile(reportText, `SaliBuoy_Satellite_Weather_${selectedRegion}.txt`, 'text/plain');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-sky-400">
              <Radio className="w-4 h-4 text-sky-400 animate-pulse" />
              <span>Himawari-9 • NOAA JPSS • NASA Aqua/Terra • ESA AWS • ICESat-2</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Polar & New Zealand Satellite Weather Radar
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Real-time satellite weather tracking combining geostationary imagery over New Zealand (Himawari-9) with polar-orbiting fleets (NOAA JPSS, NASA Aqua/Terra, ESA AWS, ICESat-2) to optimize SaliBuoy wind kinetic harvesting and subsea brine injection.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              onClick={exportSatelliteReport}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 rounded-xl text-xs font-mono cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export TXT</span>
            </button>

            <button
              onClick={exportReportToGoogleDoc}
              disabled={isExportingDoc}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-blue-900/80 hover:bg-blue-800 text-blue-200 border border-blue-700/80 rounded-xl text-xs font-mono font-bold cursor-pointer transition-colors shadow-sm"
            >
              {isExportingDoc ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-300" />
              ) : (
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              )}
              <span>Export to Google Docs</span>
            </button>

            <button
              onClick={() => uploadImageToGoogleDrive()}
              disabled={isExportingDrive}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-teal-900/80 hover:bg-teal-800 text-teal-200 border border-teal-700/80 rounded-xl text-xs font-mono font-bold cursor-pointer transition-colors shadow-sm"
            >
              {isExportingDrive ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-300" />
              ) : (
                <Camera className="w-3.5 h-3.5 text-teal-400" />
              )}
              <span>Drive</span>
            </button>

            <button
              onClick={() => exportToOneDrive()}
              disabled={isExportingOneDrive}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-sky-900/80 hover:bg-sky-800 text-sky-200 border border-sky-700/80 rounded-xl text-xs font-mono font-bold cursor-pointer transition-colors shadow-sm"
            >
              {isExportingOneDrive ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-300" />
              ) : (
                <CloudRain className="w-3.5 h-3.5 text-sky-400" />
              )}
              <span>OneDrive (Outlook)</span>
            </button>
          </div>
        </div>

        {/* Workspace Status & Direct Open Links */}
        {(googleDocUrl || googleDriveFileUrl || oneDriveUrl || workspaceStatusMsg) && (
          <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
            {workspaceStatusMsg && (
              <span className="text-sky-300 font-semibold">{workspaceStatusMsg}</span>
            )}
            <div className="flex items-center space-x-3">
              {googleDocUrl && (
                <a
                  href={googleDocUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 font-bold underline"
                >
                  <span>Google Doc ↗</span>
                </a>
              )}
              {googleDriveFileUrl && (
                <a
                  href={googleDriveFileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 text-teal-400 hover:text-teal-300 font-bold underline"
                >
                  <span>Google Drive ↗</span>
                </a>
              )}
              {oneDriveUrl && (
                <a
                  href={oneDriveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 text-sky-400 hover:text-sky-300 font-bold underline"
                >
                  <span>Open OneDrive (salibuoy.systems@outlook.com) ↗</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Microsoft Graph API OneDrive Account & Sync Panel */}
      <div className="bg-slate-900 border border-sky-800/80 rounded-2xl p-4 font-mono text-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <CloudRain className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-white text-xs">Microsoft Graph API OneDrive Manager</span>
            <span className="text-[10px] bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800 font-semibold">
              salibuoy.systems@outlook.com
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {msUser ? (
              <>
                <button
                  onClick={refreshOneDriveFiles}
                  disabled={isSyncingOneDrive}
                  className="px-2.5 py-1 bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800 rounded text-[11px] flex items-center space-x-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isSyncingOneDrive ? 'animate-spin' : ''}`} />
                  <span>Sync Files</span>
                </button>

                <button
                  onClick={() => { microsoftGraphService.logout(); setMsUser(null); setOneDriveFiles([]); }}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800 rounded text-[11px] cursor-pointer"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={async () => {
                  try {
                    const u = await microsoftGraphService.login();
                    setMsUser(u);
                    refreshOneDriveFiles();
                  } catch (e: any) {
                    setWorkspaceStatusMsg(e?.message || 'Login failed');
                  }
                }}
                className="px-3 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded text-[11px] flex items-center space-x-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Connect salibuoy.systems@outlook.com</span>
              </button>
            )}
          </div>
        </div>

        {/* Display Active OneDrive Cloud Files List */}
        {oneDriveFiles.length > 0 ? (
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 block">
              OneDrive Cloud Files in /SaliBuoy_Satellite_Weather ({oneDriveFiles.length}):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {oneDriveFiles.map((item) => (
                <a
                  key={item.id}
                  href={item.webUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between hover:border-sky-500/50 transition-colors group"
                >
                  <div className="truncate pr-2">
                    <span className="text-slate-200 font-semibold block truncate text-[11px] group-hover:text-sky-300">
                      {item.name}
                    </span>
                    <span className="text-slate-500 text-[9px]">
                      {(item.size / 1024).toFixed(1)} KB • {new Date(item.lastModifiedDateTime).toLocaleTimeString()}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-slate-400">
            {msUser
              ? 'Click "Sync Files" or save a snapshot above to manage files directly in OneDrive.'
              : 'Connect your salibuoy.systems@outlook.com account to enable seamless OAuth2 cloud file management.'}
          </p>
        )}
      </div>

      {/* Region Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div
          onClick={() => { setSelectedRegion('new-zealand'); setSelectedSatId('himawari-9'); }}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            selectedRegion === 'new-zealand'
              ? 'bg-sky-950/80 border-sky-500 shadow-lg shadow-sky-950/50'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-lg">🇳🇿</span>
            <span className="text-[10px] bg-sky-900 text-sky-300 px-2 py-0.5 rounded font-bold">GEOSTATIONARY</span>
          </div>
          <h4 className="font-bold text-white text-sm mt-2">New Zealand & Tasman Sea</h4>
          <p className="text-[11px] text-slate-400 mt-1">Himawari-9 continuous 10-min imagery from 35,786 km above equator.</p>
        </div>

        <div
          onClick={() => { setSelectedRegion('south-pole'); setSelectedSatId('noaa-jpss'); }}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            selectedRegion === 'south-pole'
              ? 'bg-sky-950/80 border-sky-500 shadow-lg shadow-sky-950/50'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-lg">🧊</span>
            <span className="text-[10px] bg-teal-900 text-teal-300 px-2 py-0.5 rounded font-bold">POLAR ORBIT</span>
          </div>
          <h4 className="font-bold text-white text-sm mt-2">South Pole & Southern Ocean</h4>
          <p className="text-[11px] text-slate-400 mt-1">NOAA JPSS, NASA Aqua/Terra, ICESat-2 passes 14 times/day over Campbell Plateau.</p>
        </div>

        <div
          onClick={() => { setSelectedRegion('north-pole'); setSelectedSatId('nasa-icesat2'); }}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            selectedRegion === 'north-pole'
              ? 'bg-sky-950/80 border-sky-500 shadow-lg shadow-sky-950/50'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-lg">❄️</span>
            <span className="text-[10px] bg-purple-900 text-purple-300 px-2 py-0.5 rounded font-bold">ARCTIC LASER</span>
          </div>
          <h4 className="font-bold text-white text-sm mt-2">North Pole & Arctic Basin</h4>
          <p className="text-[11px] text-slate-400 mt-1">ESA AWS & ICESat-2 laser altimetry tracking sea-ice thickness within 100km of North Pole.</p>
        </div>
      </div>

      {/* Main Satellite Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Satellite Selection & Telemetry Controls */}
        <div className="space-y-5 lg:col-span-1">
          {/* Constellation Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 font-mono text-xs">
            <div className="flex items-center space-x-2 text-sky-400 border-b border-slate-800 pb-3 font-bold">
              <Radio className="w-4 h-4" />
              <span>Select Satellite Constellation</span>
            </div>

            <div className="space-y-2">
              {SATELLITE_CATALOG.map((sat) => (
                <button
                  key={sat.id}
                  onClick={() => setSelectedSatId(sat.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedSatId === sat.id
                      ? 'bg-sky-950 text-sky-200 border-sky-600 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white text-xs">{sat.name}</span>
                    <span className="text-[9px] text-sky-400 bg-sky-950 px-1.5 py-0.5 rounded border border-sky-800">
                      {sat.agency.split('/')[0]}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-1 leading-tight">{sat.orbitType}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Live Telemetry Sliders */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 font-mono text-xs">
            <div className="flex items-center space-x-2 text-emerald-400 border-b border-slate-800 pb-3 font-bold">
              <Wind className="w-4 h-4" />
              <span>Live Meteorological Telemetry Controls</span>
            </div>

            <div className="space-y-4">
              {/* Wind Speed */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <label>Surface Wind Speed:</label>
                  <span className="text-emerald-400 font-bold">{windSpeedKnots} knots</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="65"
                  value={windSpeedKnots}
                  onChange={(e) => setWindSpeedKnots(parseInt(e.target.value))}
                  className="w-full accent-emerald-400 bg-slate-950 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500">Drives SaliBuoy Surface Wind Turbine Rotors</p>
              </div>

              {/* Cloud Cover */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <label>Cloud Cover Index:</label>
                  <span className="text-sky-400 font-bold">{cloudCoverPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={cloudCoverPct}
                  onChange={(e) => setCloudCoverPct(parseInt(e.target.value))}
                  className="w-full accent-sky-400 bg-slate-950 cursor-pointer"
                />
              </div>

              {/* Sea Ice Thickness */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <label>ICESat-2 Sea Ice Thickness:</label>
                  <span className="text-teal-400 font-bold">{seaIceThicknessMeters} m</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="4.5"
                  step="0.1"
                  value={seaIceThicknessMeters}
                  onChange={(e) => setSeaIceThicknessMeters(parseFloat(e.target.value))}
                  className="w-full accent-teal-400 bg-slate-950 cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={handleRunAiAnalysis}
              disabled={isAnalyzing}
              className="w-full py-2.5 bg-gradient-to-r from-sky-600 to-teal-500 hover:from-sky-500 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 cursor-pointer transition-all shadow-lg shadow-sky-950/50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Processing Satellite Data...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Run Gemini AI Weather Evaluation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Map Radar Simulation & AI Evaluation Report */}
        <div className="space-y-5 lg:col-span-2">
          {/* Active Satellite Details Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-slate-400 text-[10px] uppercase">Active Selected Satellite</span>
                <h3 className="text-lg font-bold text-white">{activeSatellite.name}</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                  {activeSatellite.orbitType}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-300">
              <div>
                <strong className="text-slate-400 block">Primary Coverage:</strong>
                <span>{activeSatellite.primaryCoverage}</span>
              </div>
              <div>
                <strong className="text-slate-400 block">Revisit Frequency:</strong>
                <span>{activeSatellite.revisitFrequency}</span>
              </div>
              <div>
                <strong className="text-slate-400 block">Key Sensors / Instruments:</strong>
                <span className="text-sky-300 font-bold">{activeSatellite.keySensors}</span>
              </div>
              <div>
                <strong className="text-slate-400 block">NASA GIBS Layer API:</strong>
                <span className="text-emerald-400 font-bold">Active WMTS Stream</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800 leading-relaxed">
              {activeSatellite.description}
            </p>
          </div>

          {/* Simulated Satellite Map Radar Visualizer */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 font-mono text-xs relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-sky-400 font-bold">
                <Globe2 className="w-4 h-4" />
                <span>Live Satellite Layer Visualizer ({selectedRegion.toUpperCase()})</span>
              </div>

              {/* Layer Toggles */}
              <div className="flex space-x-1">
                {[
                  { id: 'true-color', label: 'True Color' },
                  { id: 'wind-vectors', label: 'Wind Vectors' },
                  { id: 'sea-ice', label: 'Sea Ice' },
                  { id: 'infrared', label: 'IR Cloud' }
                ].map((lyr) => (
                  <button
                    key={lyr.id}
                    onClick={() => setActiveLayer(lyr.id as any)}
                    className={`px-2.5 py-1 rounded text-[10px] transition-colors cursor-pointer ${
                      activeLayer === lyr.id
                        ? 'bg-sky-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lyr.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Satellite Frame Canvas */}
            <div className="relative h-64 sm:h-80 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
              {/* Grid Background */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

              {/* Simulated Storm Cloud Bands */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full bg-sky-500/10 blur-3xl animate-pulse"></div>
                <div className="w-48 h-48 rounded-full bg-teal-500/10 blur-2xl"></div>
              </div>

              {/* Satellite Reticle & Coordinates */}
              <div className="relative z-10 text-center space-y-2 p-4 bg-slate-950/80 backdrop-blur border border-slate-800 rounded-2xl max-w-md">
                <div className="flex items-center justify-center space-x-2 text-sky-400">
                  <MapPin className="w-4 h-4 text-emerald-400 animate-bounce" />
                  <span className="font-bold text-white text-xs">
                    {selectedRegion === 'new-zealand' && 'Coordinates: 41.2865° S, 174.7762° E (Tasman Sea / NZ)'}
                    {selectedRegion === 'south-pole' && 'Coordinates: 52.5483° S, 169.1417° E (Campbell Plateau)'}
                    {selectedRegion === 'north-pole' && 'Coordinates: 89.5000° N, 45.0000° W (Within 60km of North Pole)'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300">
                  <div className="bg-slate-900 p-2 rounded">
                    <span className="text-slate-500 block">Satellite Track:</span>
                    <span className="text-sky-300 font-bold">{activeSatellite.name} Pass</span>
                  </div>

                  <div className="bg-slate-900 p-2 rounded">
                    <span className="text-slate-500 block">Wind Velocity:</span>
                    <span className="text-emerald-400 font-bold">{windSpeedKnots} Knots</span>
                  </div>
                </div>

                <a
                  href="https://worldview.earthdata.nasa.gov"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 text-[10px] text-sky-400 hover:text-sky-300 underline font-mono"
                >
                  <span>Open Interactive NASA Worldview Layer</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Action Bar for Image Saving */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-900">
              <span className="text-[11px] text-slate-400">
                High-Resolution PNG Snapshot Generator (HUD & Coordinates Overlay)
              </span>
              <button
                onClick={captureAndDownloadSnapshot}
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 cursor-pointer transition-all shadow-lg shadow-emerald-950/40"
              >
                <Camera className="w-4 h-4 text-slate-950" />
                <span>Save & Download Satellite Image (.PNG)</span>
              </button>
            </div>
          </div>

          {/* Hidden Canvas Element used for Offscreen Snapshot Generation */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Saved Satellite Snapshots Gallery */}
          {savedSnapshots.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-sky-400 font-bold">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span>Saved Satellite Imagery Snapshots Gallery ({savedSnapshots.length})</span>
                </div>
                <button
                  onClick={() => setSavedSnapshots([])}
                  className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center space-x-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear Gallery</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedSnapshots.map((snap) => (
                  <div key={snap.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                    <img
                      src={snap.dataUrl}
                      alt={snap.satelliteName}
                      className="w-full h-36 object-cover rounded-lg border border-slate-800"
                    />
                    <div className="flex items-center justify-between text-[10px]">
                      <div>
                        <span className="text-white font-bold block">{snap.satelliteName}</span>
                        <span className="text-slate-400">{snap.region} • {snap.layer} • {snap.timestamp}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => exportToOneDrive(snap.dataUrl, `SaliBuoy_${snap.satelliteName}_${snap.region}_${snap.timestamp.replace(/[: ]/g, '-')}.png`)}
                          className="p-1.5 bg-sky-950 hover:bg-sky-900 text-sky-300 rounded border border-sky-800 cursor-pointer"
                          title="Save to OneDrive (salibuoy.systems@outlook.com)"
                        >
                          <CloudRain className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => uploadImageToGoogleDrive(snap.dataUrl, `SaliBuoy_${snap.satelliteName}_${snap.region}_${snap.timestamp.replace(/[: ]/g, '-')}.png`)}
                          className="p-1.5 bg-teal-950 hover:bg-teal-900 text-teal-300 rounded border border-teal-800 cursor-pointer"
                          title="Upload PNG to Google Drive"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={snap.dataUrl}
                          download={`SaliBuoy_Satellite_${snap.satelliteName}_${snap.timestamp}.png`}
                          className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 cursor-pointer"
                          title="Re-download PNG"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => deleteSavedSnapshot(snap.id)}
                          className="p-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded border border-rose-800 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SSE Live Streaming Polar Telemetry Analysis Panel */}
          <PolarAnalysisPanel />

          {/* AI Analysis Report Card */}
          {aiReport && (
            <div className="bg-slate-900 border border-sky-800 rounded-2xl p-5 space-y-3 font-mono text-xs animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Gemini AI Satellite Weather & Deployment Evaluation</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  REAL-TIME EVALUATION
                </span>
              </div>

              <div className="text-slate-200 whitespace-pre-wrap leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px]">
                {aiReport}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
