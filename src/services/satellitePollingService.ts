import { OceanBoy, SatelliteFrame } from '../types';

export interface PollingNetworkStats {
  meanLatencyMs: number;
  downlinkBandwidthKbps: number;
  packetsDelivered: number;
  packetLossPct: number;
  groundStationsLocked: string[];
  lastPollUtc: string;
  pollCycle: number;
  activeConstellations: string[];
}

export interface DownlinkEventLog {
  id: string;
  timestamp: string;
  satellite: string;
  buoyNickname: string;
  channel: string;
  frameSizeKb: number;
  latencyMs: number;
  status: 'SUCCESS' | 'OPTIMAL' | 'DOWNWELLING_PLUME';
}

const FALLBACK_SATELLITE_IMAGES = [
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80"
];

export async function pollSatelliteNetwork(
  currentBuoys: OceanBoy[],
  pollCycle: number,
  spectralBand: string = 'clean-ir'
): Promise<{
  updatedBuoys: OceanBoy[];
  networkStats: PollingNetworkStats;
  logEntry: DownlinkEventLog;
}> {
  const now = new Date();
  const utcTimeStr = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

  try {
    const res = await fetch(`/api/ocean-boys-satellite-stream?pollCycle=${pollCycle}&band=${spectralBand}`);
    if (res.ok) {
      const data = await res.json();
      const buoyUpdates = data.buoyUpdates || {};

      const updatedBuoys = currentBuoys.map((buoy, idx) => {
        const update = buoyUpdates[buoy.id];
        if (!update) return buoy;

        const newFrame: SatelliteFrame = {
          frameId: update.frameId,
          timestamp: update.timestamp,
          label: `${update.satellite} Pass Scan`,
          imageUrl: update.imageUrl,
          cloudCoverPct: update.cloudCoverPct,
          sensorMode: update.multispectralChannel,
          solarZenithAngleDeg: update.solarZenithAngleDeg,
          dataQualityPct: update.dataQualityPct
        };

        const existingFrames = buoy.satellitePass.recentFrames || [];
        const nextFrames = [newFrame, ...existingFrames.slice(0, 4)];

        // Micro-drift simulation on telemetry
        const salinityJitter = (Math.random() - 0.5) * 0.05;
        const tempJitter = (Math.random() - 0.5) * 0.03;
        const waveJitter = Math.floor((Math.random() - 0.5) * 8);

        return {
          ...buoy,
          salinityPsu: Number(Math.max(32, Math.min(48, buoy.salinityPsu + salinityJitter)).toFixed(2)),
          ambientTempC: Number((buoy.ambientTempC + tempJitter).toFixed(1)),
          wavePowerWatts: Math.max(0, buoy.wavePowerWatts + waveJitter),
          lastPing: 'Live Downlink Sync',
          satellitePass: {
            ...buoy.satellitePass,
            satellite: update.satellite,
            multispectralChannel: update.multispectralChannel,
            elevationAngle: update.elevationAngle,
            nextPassMinutes: update.nextPassMinutes,
            imageUrl: update.imageUrl,
            recentFrames: nextFrames,
            currentFrameIndex: 0,
            lastScannedAt: update.timestamp,
            cloudCoverPct: update.cloudCoverPct,
            opticalResolutionM: update.opticalResolutionM,
            downlinkLatencyMs: update.downlinkLatencyMs
          }
        };
      });

      const randomBuoy = updatedBuoys[pollCycle % updatedBuoys.length];

      const logEntry: DownlinkEventLog = {
        id: `LOG-${pollCycle}-${Date.now()}`,
        timestamp: utcTimeStr.split(' ')[1],
        satellite: randomBuoy.satellitePass.satellite.split(' ')[0],
        buoyNickname: randomBuoy.nickname,
        channel: randomBuoy.satellitePass.multispectralChannel,
        frameSizeKb: 1420 + Math.round(Math.random() * 320),
        latencyMs: randomBuoy.satellitePass.downlinkLatencyMs || 15,
        status: randomBuoy.status === 'Active Downwelling' ? 'DOWNWELLING_PLUME' : 'SUCCESS'
      };

      const networkStats: PollingNetworkStats = {
        meanLatencyMs: data.networkStats?.meanLatencyMs || 14.2,
        downlinkBandwidthKbps: data.networkStats?.downlinkBandwidthKbps || 2450,
        packetsDelivered: (pollCycle * 23),
        packetLossPct: 0.0,
        groundStationsLocked: data.networkStats?.groundStationsLocked || ["Warkworth NZ", "Awarua Southland NZ"],
        lastPollUtc: utcTimeStr,
        pollCycle,
        activeConstellations: data.constellationsActive || ["Himawari-9", "NOAA GOES-18", "Sentinel-3A", "Aqua MODIS"]
      };

      return { updatedBuoys, networkStats, logEntry };
    }
  } catch (err) {
    console.warn("Satellite stream API offline, running high-fidelity client synthesis:", err);
  }

  // Standalone client fallback if backend is offline
  const updatedBuoys = currentBuoys.map((buoy, idx) => {
    const imgIdx = (idx * 2 + pollCycle) % FALLBACK_SATELLITE_IMAGES.length;
    const cloudCover = Math.max(5, Math.min(88, Math.round(20 + Math.sin(idx + pollCycle * 0.5) * 20)));
    const frameId = `FALLBACK-F${pollCycle}-OB${idx + 1}`;

    const newFrame: SatelliteFrame = {
      frameId,
      timestamp: utcTimeStr,
      label: `${buoy.satellitePass.satellite} Sector Scan`,
      imageUrl: FALLBACK_SATELLITE_IMAGES[imgIdx],
      cloudCoverPct: cloudCover,
      sensorMode: buoy.satellitePass.multispectralChannel,
      solarZenithAngleDeg: 38.5,
      dataQualityPct: 99.4
    };

    const existingFrames = buoy.satellitePass.recentFrames || [];
    const nextFrames = [newFrame, ...existingFrames.slice(0, 4)];

    return {
      ...buoy,
      lastPing: 'Local Stream Ingested',
      satellitePass: {
        ...buoy.satellitePass,
        imageUrl: FALLBACK_SATELLITE_IMAGES[imgIdx],
        recentFrames: nextFrames,
        currentFrameIndex: 0,
        lastScannedAt: utcTimeStr,
        cloudCoverPct: cloudCover,
        opticalResolutionM: 500,
        downlinkLatencyMs: 16
      }
    };
  });

  const logEntry: DownlinkEventLog = {
    id: `LOG-FALLBACK-${pollCycle}`,
    timestamp: utcTimeStr.split(' ')[1] || '00:00:00',
    satellite: 'Himawari-9',
    buoyNickname: updatedBuoys[0].nickname,
    channel: 'Clean IR 10.4µm',
    frameSizeKb: 1480,
    latencyMs: 16,
    status: 'SUCCESS'
  };

  const networkStats: PollingNetworkStats = {
    meanLatencyMs: 15.4,
    downlinkBandwidthKbps: 2200,
    packetsDelivered: (pollCycle * 23),
    packetLossPct: 0.0,
    groundStationsLocked: ["Warkworth Ground Station NZ", "Awarua Ground Station NZ"],
    lastPollUtc: utcTimeStr,
    pollCycle,
    activeConstellations: ["Himawari-9", "NOAA GOES-18", "Sentinel-3A", "Sentinel-2B", "Aqua MODIS"]
  };

  return { updatedBuoys, networkStats, logEntry };
}
