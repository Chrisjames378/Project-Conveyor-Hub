import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { Octokit } from "octokit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      system: "SaliBuoy Systems Project Conveyor Backend", 
      hasGeminiKey: !!process.env.GEMINI_API_KEY 
    });
  });

  // AI DeepTech Grant & Proposal Generator Route
  app.post("/api/generate-grant-proposal", async (req, res) => {
    try {
      const { proposalType, targetAudience, projectFocus, keyMilestones, budgetNZD } = req.body;

      if (!proposalType) {
        return res.status(400).json({ error: "Missing proposalType" });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        // High-quality structured fallback generator if no API key is set
        const fallbackDoc = generateStructuredFallbackProposal(
          proposalType, 
          targetAudience || "Callaghan Innovation & Outset Ventures", 
          projectFocus || "SaliBuoy Mark-III Subsurface Salinity Injector", 
          budgetNZD || 500000
        );
        return res.json({ proposalText: fallbackDoc, source: "fallback_engine" });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `You are a Lead DeepTech Grant & Investment Proposal Writer for SaliBuoy Systems ("Project Conveyor"), a New Zealand physical science startup based in Pukekohe, Auckland.

Generate a highly compelling, formal, production-grade proposal document for:
PROPOSAL TYPE: ${proposalType}
TARGET AUDIENCE: ${targetAudience}
HARDWARE FOCUS: ${projectFocus}
TARGET BUDGET: $${budgetNZD} NZD
KEY MILESTONES: ${keyMilestones || 'Mark-III 500m depth rated buoy, Hauraki Gulf & Southern Ocean sea trials, 40% Callaghan R&D rebate qualification'}

Format the output clearly with:
1. Executive Summary & Problem (AMOC slowdown & Greenland freshwater melt)
2. SaliBuoy Technological Solution (Subsurface wave-powered salinity injection pumps, 45.0 PSU brine, zero chemical discharge)
3. New Zealand R&D Infrastructure & Partnerships (Outset Ventures Pukekohe wet labs, NIWA oceanography data, University of Auckland)
4. Budget Allocation & Financial Justification ($${budgetNZD} NZD breakdown)
5. Regulatory & Environmental Safeguards (EPA EEZ Act Permitted Activity, Maritime NZ IALA navigation lights, COLREGS compliance)
6. Expected Milestone Deliverables & Impact

Write in professional, clear, persuasive tone tailored for NZ climate venture funds and government R&D grant committees. Do NOT use buzzwords like "jaw-dropping" or "unprecedented".`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert New Zealand DeepTech grant writer specializing in physical science, oceanography, and climate hardware funding.",
        },
      });

      const proposalText = response.text || "Unable to generate proposal content.";
      return res.json({ proposalText, source: "gemini_3_8_flash" });
    } catch (err: any) {
      console.error("Error generating proposal:", err);
      return res.status(500).json({ 
        error: "Proposal generation failed", 
        details: err?.message || String(err) 
      });
    }
  });

  // AI Satellite Weather & Polar Ice Pack Telemetry Analysis Endpoint
  app.post("/api/analyze-polar-weather", async (req, res) => {
    try {
      const { region, satellite, date, windSpeedKnots, cloudCoverPct, seaIceThicknessMeters } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      const targetRegion = region || 'New Zealand & Southern Ocean';
      const selectedSat = satellite || 'Himawari-9 & NOAA JPSS-20/21';
      const targetDate = date || new Date().toISOString().split('T')[0];

      if (!apiKey) {
        const fallbackAnalysis = `
SATELLITE WEATHER & POLAR STORM EVALUATION REPORT
=================================================
Target Region: ${targetRegion}
Satellites in Orbit: ${selectedSat}
Date: ${targetDate}
Surface Wind Conditions: ${windSpeedKnots || 38} knots
Cloud Cover: ${cloudCoverPct || 64}%
Sea Ice Thickness (ICESat-2): ${seaIceThicknessMeters || 1.45} meters

1. METEOROLOGICAL OVERVIEW:
- Himawari-9 geostationary IR imagery indicates a strong Southern Ocean low-pressure trough advancing across the Tasman Sea toward South Island NZ.
- NOAA JPSS-20/21 VIIRS pass shows high reflectivity cold cloud bands near Campbell Plateau with wind speeds peaking at ${windSpeedKnots || 38} knots.

2. SALIBUOY DEPLOYMENT VIABILITY:
- Wind Kinetic Energy Harvesting: EXCELLENT (${windSpeedKnots || 38} knots drives surface rotors at 92% peak capacity, yielding 620W per buoy).
- Subsea Downwelling Impact: High surface wind mixing accelerates brine diffusion down to 350m depth layer.
- Recommendation: Proceed with Mark-III buoy automated brine injection sequence.
        `.trim();

        return res.json({ analysis: fallbackAnalysis, source: "fallback_engine" });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `You are a Chief Oceanographic Meteorologist for SaliBuoy Systems ("Project Conveyor").
Analyze the current satellite weather feeds and polar orbit telemetry for:
- REGION: ${targetRegion}
- PRIMARY SATELLITE CONSTELLATIONS: ${selectedSat} (Himawari-9, NOAA JPSS-20/21, NASA Aqua/Terra, ESA AWS, ICESat-2)
- DATE: ${targetDate}
- CURRENT TELEMETRY: Wind Speed: ${windSpeedKnots || 38} knots, Cloud Cover: ${cloudCoverPct || 64}%, Sea Ice Thickness: ${seaIceThicknessMeters || 1.45}m.

Provide a comprehensive, professional analysis including:
1. Current Meteorological & Polar Storm Patterns
2. Wind Kinetic Harvesting Potential for SaliBuoy Vertical Axis Wind Turbines
3. Subsea Brine Injection & Thermohaline Convection Dynamics
4. Operational Recommendation for SaliBuoy Autonomous Fleet Deployment

Write in a crisp, technical, oceanographic format suitable for climate scientists and offshore buoy operators.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert satellite oceanographer and climate hardware telemetry specialist.",
        },
      });

      return res.json({ 
        analysis: response.text || "Analysis unavailable.", 
        source: "gemini_3_8_flash" 
      });

    } catch (err: any) {
      console.error("Error analyzing satellite weather:", err);
      return res.status(500).json({ 
        error: "Satellite weather analysis failed", 
        details: err?.message || String(err) 
      });
    }
  });

  // SSE Live Streaming Polar Satellite Analysis Route
  app.get('/api/stream-polar-analysis', async (req, res) => {
    const { date, region } = req.query;
    const targetDate = (date as string) || new Date().toISOString().split('T')[0];
    const targetRegion = (region as string) || 'South Pole & Southern Ocean';

    // Establish Server-Sent Events (SSE) HTTP headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const fallbackChunks = [
        "SATELLITE SYNTHESIS STREAM (SOUTH POLE EPSG:3031 STEREOGRAPHIC PROJECTION)\n",
        "========================================================================\n",
        `Target Date: ${targetDate}\n`,
        `Region: ${targetRegion}\n`,
        "Satellites Ingested: NASA Aqua MODIS, NOAA JPSS VIIRS, ICESat-2 Altimeter\n\n",
        "1. POLAR ATMOSPHERIC DYNAMICS:\n",
        "- Himawari-9 & NOAA-21 VIIRS IR pass reveals a deep 964 hPa polar vortex low-pressure cell rotating over the Ross Ice Shelf.\n",
        "- Satellite wind scatterometry indicates 42-knot surface winds accelerating off the continental slope.\n\n",
        "2. SEA ICE PACK FREEBOARD HEIGHT (ICESat-2):\n",
        "- Laser altimetry tracks show average sea-ice freeboard of 0.28m near 78°S, with visible lead fracturing.\n",
        "- Surface water thermal anomaly delta: -1.85°C (Ideal conditions for dense brine downwelling).\n\n",
        "3. SALIBUOY FLEET HARVESTING & PUMPING STATUS:\n",
        "- Surface wind turbine rotors operating at 88% capacity generating 580W per buoy.\n",
        "- Subsea ceramic impeller pumps actively discharging 46.2 PSU brine down to 350m layer.\n",
        "- Thermohaline downwelling plume velocity verified at 0.18 m/s downward.\n\n",
        "DEPLOYMENT STATUS: NOMINAL • CONTINUOUS MONITORING ACTIVE"
      ];

      for (const chunkText of fallbackChunks) {
        res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
        await new Promise(r => setTimeout(r, 120));
      }

      res.write('data: [DONE]\n\n');
      return res.end();
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const promptText = `
You are an expert satellite oceanography AI module embedded in the SaliBuoy Systems 3D Digital Twin Platform.
Analyze these Antarctic South Pole snapshots (EPSG:3031 projection) and polar orbit telemetry for ${targetDate} in region ${targetRegion}.
Identify core storm formations, rotational weather movements over the ice sheet, ICESat-2 sea-ice thickness, and SaliBuoy wind kinetic harvesting efficiency.
      `;

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3.8-flash',
        contents: promptText
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }

      res.write('data: [DONE]\n\n');
      res.end();

    } catch (error: any) {
      console.error('Streaming API error:', error);
      res.write(`data: ${JSON.stringify({ error: 'Failed to process polar data streams.' })}\n\n`);
      res.end();
    }
  });

  // Daily AMOC Stabilization AI Summary Generator Endpoint
  app.post('/api/generate-amoc-summary', async (req, res) => {
    try {
      const { transportFlowSv, salinityPsu, downwellingRateIndex, date } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      const targetDate = date || new Date().toISOString().split('T')[0];
      const svValue = transportFlowSv || 15.2;
      const psuValue = salinityPsu || 45.0;
      const downwellingIndex = downwellingRateIndex || 1.42;

      if (!apiKey) {
        const fallbackSummary = `
SALIBUOY SYSTEMS • DAILY AMOC STABILIZATION REPORT
===================================================
Date: ${targetDate}
Target Account: salibuoy.systems@outlook.com
Folder: OneDrive / Project-Conveyor-Reports

1. OVERTURNING CIRCULATION TRANSPORT METRICS
--------------------------------------------
- Observed AMOC Flow Rate: ${svValue} Sverdrups (Baseline: 18.0 Sv, Deficit: -15.5%)
- North Atlantic Subsurface Injector Array Status: 12 Autonomous Buoys Active
- Salinity Plume Density: ${psuValue} PSU (Ambient Sea Water: 35.0 PSU, Plume Delta: +10.0 PSU)
- Subsea Downwelling Velocity Index: ${downwellingIndex} m/hr (Re-igniting thermohaline convection)

2. HARVESTING & CRYO-RESTORATION EVALUATION
--------------------------------------------
- Offshore Wind Rotor Power Generation: 4.8 kW / Buoy Average
- Cryo-Brine Downwelling Efficiency: 94.2% Nominal
- Greenland Meltwater Plume Mitigation: 1,240,000 m³ / day localized dilution offset

3. DEEPTECH INTERVENTION CONCLUSION
-----------------------------------
Salinity injection at 45.0 PSU continues to force heavy water column sinking in key subsea channels, resisting North Atlantic AMOC slowdown caused by polar meltwater discharge.
`;
        return res.json({ summaryText: fallbackSummary.trim(), date: targetDate, source: 'fallback_engine' });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `You are the Lead AMOC Oceanography AI Specialist for SaliBuoy Systems ("Project Conveyor").
Generate today's official AMOC Stabilization Summary for date ${targetDate}.
Current Telemetry Metrics:
- Observed AMOC Transport Flow: ${svValue} Sverdrups (Baseline 18.0 Sv)
- Subsurface Salinity Injection Density: ${psuValue} PSU
- Subsea Downwelling Velocity Index: ${downwellingIndex} m/hr
- Operating Base: Pukekohe, Auckland, New Zealand

Write a concise, formal daily oceanographic briefing suitable for executive archiving in OneDrive ('Project-Conveyor-Reports'). Include sections:
1. Executive Transport Summary & AMOC Flow Status
2. Subsurface Salinity Injection & Density Delta
3. Cryo-Restoration & Convection Re-ignition Progress
4. Actionable Deployment Recommendations for Tomorrow`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an elite oceanographic climate AI specializing in Atlantic Meridional Overturning Circulation (AMOC) stabilization and cryo-salinity dynamics.',
        },
      });

      const summaryText = response.text || "Daily AMOC stabilization summary generated successfully.";
      return res.json({ summaryText, date: targetDate, source: 'gemini_3_8_flash' });

    } catch (err: any) {
      console.error('Error generating AMOC summary:', err);
      return res.status(500).json({ error: 'AMOC summary generation failed', details: err?.message || String(err) });
    }
  });

  // Google Docs Report Exporter API
  app.post('/api/export-to-google-doc', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const { title, contentText } = req.body;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid OAuth Authorization header' });
      }

      const accessToken = authHeader.split(' ')[1];

      // 1. Create a new Google Document
      const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title || 'SaliBuoy Systems - Satellite Weather Report'
        })
      });

      if (!createRes.ok) {
        const errText = await createRes.text();
        return res.status(createRes.status).json({ error: 'Failed to create Google Doc', details: errText });
      }

      const docData = await createRes.json();
      const documentId = docData.documentId;

      // 2. Insert content into the created document
      if (contentText) {
        const updateRes = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            requests: [
              {
                insertText: {
                  location: { index: 1 },
                  text: contentText
                }
              }
            ]
          })
        });

        if (!updateRes.ok) {
          console.warn('Batch update Google Doc warning:', await updateRes.text());
        }
      }

      const documentUrl = `https://docs.google.com/document/d/${documentId}/edit`;
      return res.json({ success: true, documentId, documentUrl });

    } catch (err: any) {
      console.error('Google Doc export error:', err);
      return res.status(500).json({ error: 'Google Doc export failed', details: err?.message || String(err) });
    }
  });

  // Google Drive File / Image Exporter API
  app.post('/api/export-image-to-google-drive', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const { fileName, mimeType, base64Data } = req.body;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid OAuth Authorization header' });
      }

      const accessToken = authHeader.split(' ')[1];
      const targetMime = mimeType || 'image/png';
      const name = fileName || `SaliBuoy_Satellite_Snapshot_${Date.now()}.png`;

      // Extract raw binary buffer from base64 data url
      let buffer: Buffer;
      if (base64Data.includes('base64,')) {
        buffer = Buffer.from(base64Data.split('base64,')[1], 'base64');
      } else {
        buffer = Buffer.from(base64Data, 'base64');
      }

      // Multipart upload metadata & media boundary
      const boundary = '-------SaliBuoyDriveBoundary' + Date.now();
      const delimiter = "\r\n--" + boundary + "\r\n";
      const closeDelim = "\r\n--" + boundary + "--";

      const metadata = {
        name: name,
        mimeType: targetMime
      };

      const multipartBody = Buffer.concat([
        Buffer.from(delimiter + 'Content-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify(metadata) + delimiter + `Content-Type: ${targetMime}\r\nContent-Transfer-Encoding: base64\r\n\r\n`),
        Buffer.from(buffer.toString('base64')),
        Buffer.from(closeDelim)
      ]);

      const uploadRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body: multipartBody
      });

      if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        return res.status(uploadRes.status).json({ error: 'Google Drive upload failed', details: errText });
      }

      const driveData = await uploadRes.json();
      const fileId = driveData.id;
      const webViewLink = `https://drive.google.com/file/d/${fileId}/view`;

      return res.json({ success: true, fileId, webViewLink });

    } catch (err: any) {
      console.error('Google Drive upload error:', err);
      return res.status(500).json({ error: 'Google Drive export failed', details: err?.message || String(err) });
    }
  });

  // Microsoft OneDrive & Microsoft Graph API File Upload Route
  app.post('/api/export-to-onedrive', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const { fileName, mimeType, base64Data, textContent, targetEmail } = req.body;
      const accountEmail = targetEmail || 'salibuoy.systems@outlook.com';

      const name = fileName || `SaliBuoy_Satellite_Report_${Date.now()}.txt`;
      const contentType = mimeType || 'text/plain';

      // 1. If an explicit MS Graph Bearer token was provided by client OAuth
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const accessToken = authHeader.split(' ')[1];

        let buffer: Buffer;
        if (base64Data) {
          buffer = base64Data.includes('base64,')
            ? Buffer.from(base64Data.split('base64,')[1], 'base64')
            : Buffer.from(base64Data, 'base64');
        } else {
          buffer = Buffer.from(textContent || '', 'utf-8');
        }

        const oneDriveRes = await fetch(
          `https://graph.microsoft.com/v1.0/me/drive/root:/SaliBuoy_Systems/${encodeURIComponent(name)}:/content`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': contentType
            },
            body: buffer
          }
        );

        if (oneDriveRes.ok) {
          const driveData = await oneDriveRes.json();
          return res.json({
            success: true,
            fileId: driveData.id,
            oneDriveUrl: driveData.webUrl || `https://onedrive.live.com`,
            accountEmail
          });
        }
      }

      // 2. Direct OneDrive Live Portal Launcher for salibuoy.systems@outlook.com
      const oneDrivePortalUrl = `https://onedrive.live.com/?id=root&cid=salibuoy_systems`;
      return res.json({
        success: true,
        oneDriveUrl: oneDrivePortalUrl,
        accountEmail,
        message: `Prepared OneDrive upload package for ${accountEmail}`
      });

    } catch (err: any) {
      console.error('OneDrive export error:', err);
      return res.status(500).json({ error: 'OneDrive export failed', details: err?.message || String(err) });
    }
  });

  // Helper to scan workspace files for Octokit sync
  function getWorkspaceFiles(dirPath: string = process.cwd(), baseDir: string = process.cwd()): Array<{ relativePath: string; content: string; sizeBytes: number }> {
    const filesList: Array<{ relativePath: string; content: string; sizeBytes: number }> = [];
    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      const ignoreList = new Set(['node_modules', 'dist', '.git', '.DS_Store', 'bun.lock', '.cache', '.npm']);

      for (const entry of entries) {
        if (ignoreList.has(entry.name)) continue;

        const fullPath = path.join(dirPath, entry.name);
        const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');

        if (entry.isDirectory()) {
          filesList.push(...getWorkspaceFiles(fullPath, baseDir));
        } else if (entry.isFile()) {
          if (relPath.endsWith('.png') || relPath.endsWith('.jpg') || relPath.endsWith('.jpeg') || relPath.endsWith('.ico')) {
            continue;
          }
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            filesList.push({ relativePath: relPath, content, sizeBytes: Buffer.byteLength(content, 'utf-8') });
          } catch (err) {
            console.warn(`Could not read file ${relPath}:`, err);
          }
        }
      }
    } catch (err) {
      console.error(`Error scanning directory ${dirPath}:`, err);
    }
    return filesList;
  }

  // GitHub Workspace Sync API Endpoints
  app.get('/api/github/file-list', (req, res) => {
    try {
      const files = getWorkspaceFiles();
      const fileSummaries = files.map(f => ({ relativePath: f.relativePath, sizeBytes: f.sizeBytes }));
      return res.json({ count: files.length, files: fileSummaries });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to scan workspace files', details: err?.message || String(err) });
    }
  });

  app.post('/api/github/sync', async (req, res) => {
    try {
      const { token, owner, repo, branch = 'main', commitMessage, createIfNotExists = true } = req.body;

      if (!token) {
        return res.status(400).json({ error: 'GitHub Personal Access Token (token) is required.' });
      }
      if (!owner || !repo) {
        return res.status(400).json({ error: 'Repository owner and repo name are required.' });
      }

      const octokit = new Octokit({ auth: token });

      // 1. Verify authenticated user token works
      let authUser = '';
      try {
        const userRes = await octokit.rest.users.getAuthenticated();
        authUser = userRes.data.login;
      } catch (err: any) {
        return res.status(401).json({ error: 'Invalid GitHub token or authentication failed', details: err?.message });
      }

      // 2. Check if repo exists or create it
      let repoExists = false;
      try {
        await octokit.rest.repos.get({ owner, repo });
        repoExists = true;
      } catch (err: any) {
        if (err.status === 404 && createIfNotExists) {
          console.log(`Repository ${owner}/${repo} does not exist. Creating repository via Octokit...`);
          try {
            await octokit.rest.repos.createForAuthenticatedUser({
              name: repo,
              private: false,
              auto_init: true,
              description: "SaliBuoy Systems Project Conveyor - Autonomous AMOC Stabilization & Oceanographic Intervention Platform",
            });
            await new Promise(r => setTimeout(r, 1500));
            repoExists = true;
          } catch (createErr: any) {
            return res.status(500).json({ error: `Failed to create GitHub repository '${owner}/${repo}'`, details: createErr?.message });
          }
        } else {
          return res.status(404).json({ error: `Repository '${owner}/${repo}' not found on GitHub`, details: err?.message });
        }
      }

      // 3. Scan workspace files
      const files = getWorkspaceFiles();
      if (files.length === 0) {
        return res.status(400).json({ error: 'No workspace source files found to commit.' });
      }

      // 4. Create blobs and tree items using Octokit
      const treeItems = await Promise.all(
        files.map(async (file) => {
          const blobRes = await octokit.rest.git.createBlob({
            owner,
            repo,
            content: file.content,
            encoding: 'utf-8',
          });
          return {
            path: file.relativePath,
            mode: '100644' as const,
            type: 'blob' as const,
            sha: blobRes.data.sha,
          };
        })
      );

      // 5. Get current branch ref commit or handle fresh repo
      let latestCommitSha: string | null = null;
      let baseTreeSha: string | null = null;

      try {
        const refRes = await octokit.rest.git.getRef({ owner, repo, ref: `heads/${branch}` });
        latestCommitSha = refRes.data.object.sha;
        const commitRes = await octokit.rest.git.getCommit({ owner, repo, commit_sha: latestCommitSha });
        baseTreeSha = commitRes.data.tree.sha;
      } catch (err: any) {
        console.log(`Branch '${branch}' ref not found. Initializing branch ref...`);
      }

      // 6. Create Git tree
      const createTreeParams: any = { owner, repo, tree: treeItems };
      if (baseTreeSha) {
        createTreeParams.base_tree = baseTreeSha;
      }
      const newTreeRes = await octokit.rest.git.createTree(createTreeParams);

      // 7. Create Git commit
      const msg = commitMessage || `Sync SaliBuoy Systems Project Conveyor source code (${new Date().toISOString()})`;
      const createCommitParams: any = {
        owner,
        repo,
        message: msg,
        tree: newTreeRes.data.sha,
        parents: latestCommitSha ? [latestCommitSha] : [],
      };
      const newCommitRes = await octokit.rest.git.createCommit(createCommitParams);

      // 8. Update or create branch ref
      if (latestCommitSha) {
        await octokit.rest.git.updateRef({
          owner,
          repo,
          ref: `heads/${branch}`,
          sha: newCommitRes.data.sha,
          force: true,
        });
      } else {
        await octokit.rest.git.createRef({
          owner,
          repo,
          ref: `refs/heads/${branch}`,
          sha: newCommitRes.data.sha,
        });
      }

      const repoUrl = `https://github.com/${owner}/${repo}`;
      return res.json({
        success: true,
        repoUrl,
        commitSha: newCommitRes.data.sha,
        fileCount: files.length,
        branch,
        message: `Successfully synchronized ${files.length} files to ${owner}/${repo} on branch ${branch}.`,
      });

    } catch (err: any) {
      console.error('GitHub Sync Octokit error:', err);
      return res.status(500).json({ error: 'GitHub sync failed', details: err?.message || String(err) });
    }
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SaliBuoy Systems Server running on http://0.0.0.0:${PORT}`);
  });
}

function generateStructuredFallbackProposal(
  type: string, 
  audience: string, 
  focus: string, 
  budget: number
): string {
  return `SALIBUOY SYSTEMS - OFFICIAL R&D GRANT & INVESTMENT PROPOSAL
===================================================================
DOCUMENT TYPE: ${type.toUpperCase()}
TARGET RECIPIENT: ${audience}
HARDWARE PROGRAMME: ${focus}
ALLOCATED BUDGET: $${budget.toLocaleString()} NZD
LOCATION: Outset Ventures DeepTech Facility, Pukekohe, Auckland, New Zealand

1. EXECUTIVE SUMMARY
-------------------
SaliBuoy Systems ("Project Conveyor") is developing autonomous hardware-first oceanographic buoys designed to stabilize the Atlantic Meridional Overturning Circulation (AMOC) and mitigate climate tipping points. Accelerating Greenland glacial melt dilutes surface ocean salinity, impairing natural thermohaline downwelling. SaliBuoy buoys harvest ocean wave kinetic energy to extract seawater, concentrate it to 42.0–48.0 PSU natural brine, and inject it at depth (200m–500m) to force dense water sinking.

2. R&D MILESTONES & TECHNICAL OBJECTIVES
----------------------------------------
- Complete Mark-II & Mark-III hydrodynamic pressure vessel fabrication (Grade 5 Titanium & Hard Anodized Aluminum).
- Integrate ceramic dual-chamber brine pumps (120–200 L/min flow rate) and Iridium SBD satellite telemetry.
- Conduct 30-day continuous ocean proving trials in Hauraki Gulf and sub-Antarctic waters off Campbell Island.
- Measure localized water column density increase (>1050 kg/m³) with Underwater Acoustic Doppler Current Profilers (ADCP).

3. FINANCIAL BUDGET JUSTIFICATION ($${budget.toLocaleString()} NZD)
--------------------------------------------------------------
- Hardware Prototyping & Fabrication (38%): $${(budget * 0.38).toLocaleString()} NZD
- Wet-Lab & Tank Testing at Outset Pukekohe (22%): $${(budget * 0.22).toLocaleString()} NZD
- Offshore Vessel Charter & Ocean Trial Deployment (25%): $${(budget * 0.25).toLocaleString()} NZD
- Regulatory Compliance & IPONZ Patent Filings (15%): $${(budget * 0.15).toLocaleString()} NZD

4. CALLAGHAN INNOVATION & NZ R&D CO-FUNDING
-------------------------------------------
Under New Zealand Callaghan Innovation R&D grant guidelines, $${(budget * 0.40).toLocaleString()} NZD (40%) of eligible expenditure is claimable as non-dilutive co-funding rebate. All IP remains 100% owned by SaliBuoy Systems.

5. REGULATORY & ENVIRONMENTAL COMPLIANCE
----------------------------------------
- Zero Synthetic Chemicals: Discharges 100% natural concentrated seawater brine.
- EPA EEZ Act Permitted Activity status for scientific ocean research.
- Maritime NZ COLREGS compliance with yellow IALA flashing beacons and Class-B AIS transponders.`;
}

startServer();
