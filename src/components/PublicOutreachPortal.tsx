import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Send,
  Copy,
  Check,
  Download,
  ExternalLink,
  ArrowLeft,
  Globe2,
  ShieldCheck,
  Sparkles,
  DollarSign,
  Leaf,
  Share2,
  Mail,
  FileCode2,
  AlertCircle
} from 'lucide-react';
import { downloadFile } from '../utils/exportUtils';

interface PublicOutreachPortalProps {
  onExitPortal: () => void;
}

type TargetCategory = 'All' | 'Priority NGOs' | 'Climate & DeepTech Funding' | 'Ocean Science' | 'Online Launch & Ads';
type OutreachStatus = 'Ready' | 'Copied' | 'Sent';

interface OutreachTarget {
  id: string;
  rank: number;
  name: string;
  category: Exclude<TargetCategory, 'All'>;
  region: string;
  whyThisTarget: string;
  contactOrUrl: string;
  contactEmail?: string;
  actionUrl: string;
  subjectLine: string;
  pitchBody: string;
}

const LIVE_SHARED_URL = 'https://ais-pre-anvaiib6x42jeyxbs5k5ki-205273580701.asia-east1.run.app';
const CAMPAIGN_URL = `${LIVE_SHARED_URL}/?portal=campaign`;
const CONTACT_EMAIL = 'chris.james378@gmail.com';
const STORAGE_STATUS_KEY = 'salibuoy_outreach_status_v1';

const OUTREACH_TARGETS: OutreachTarget[] = [
  {
    id: 'greenpeace',
    rank: 1,
    name: 'Greenpeace International & Greenpeace Aotearoa',
    category: 'Priority NGOs',
    region: 'Auckland, NZ & Amsterdam / Global Oceans Campaign',
    whyThisTarget:
      'Priority #1 adoption partner. SaliBuoy provides zero-chemical AMOC telemetry, sub-85 dB marine mammal acoustic compliance, and a live ecological risk & Polar Oil / Deep-Sea Strip Mining comparison suite aligned with Greenpeace ocean protection campaigns.',
    contactOrUrl: 'info.nz@greenpeace.org / supporter.services.int@greenpeace.org',
    contactEmail: 'info.nz@greenpeace.org',
    actionUrl: 'https://www.greenpeace.org/aotearoa/about/contact-us/',
    subjectLine: 'NZ Ocean Tech & Polar Threat Telemetry Platform Ready for Greenpeace Oceans Use (SaliBuoy)',
    pitchBody: `Kia ora Greenpeace Aotearoa & Greenpeace Oceans Team,

I am reaching out from SaliBuoy Systems (Project Conveyor) based in Pukekohe, Auckland, New Zealand. We have built a live, open-access ocean climate & marine threat monitoring application and want Greenpeace teams and ocean campaigners to use it directly.

Live Platform: ${LIVE_SHARED_URL}

Key capabilities ready for campaign & field use:
1. Live 23-Buoy Telemetry & Polar/NZ Satellite Radar: Tracks Southern Ocean & Tasman drift trajectories, salinity, sea-surface temperature anomalies, and real-time fleet health (including a mobile field view).
2. Polar Oil & Deep-Sea Strip Mining Ecological Risk Simulator: Quantifies 0.00 ppm synthetic chemical discharge and <85 dB acoustic mammal safety alongside documented threats from 230+ dB Antarctic seismic airguns, 2048 Madrid Protocol pressure, and abyssal polymetallic nodule strip mining.
3. 3D Wind Turbine & CO2/CH4 Monitoring: Interactive 3D weather, snow/icing, and subsea methane hydrate seep visualization.

We are actively seeking NGO adoption, scientific collaboration, and seed/grant funding ($1.5M NZD target) to deploy Mark-III prototypes in NZ and Southern Ocean waters. We would welcome a 15-minute walkthrough with your Oceans or Antarctic campaign leads.

Ngā mihi,
Chris James
SaliBuoy Systems (Pukekohe, Auckland, NZ)
Email: ${CONTACT_EMAIL}`
  },
  {
    id: 'sea-shepherd',
    rank: 2,
    name: 'Sea Shepherd Global & Sea Shepherd New Zealand',
    category: 'Priority NGOs',
    region: 'Southern Ocean & Aotearoa',
    whyThisTarget:
      'Direct synergy with Southern Ocean patrols, IUU toothfish/krill trawler monitoring, and rapid SMS maritime intel alerts.',
    contactOrUrl: 'contact@seashepherd.org.nz',
    contactEmail: 'contact@seashepherd.org.nz',
    actionUrl: 'https://seashepherd.org.nz/contact/',
    subjectLine: 'Southern Ocean Buoy Telemetry & Anonymous Maritime Alert Tool — SaliBuoy Systems',
    pitchBody: `Hello Sea Shepherd NZ & Global Marine Team,

We built SaliBuoy Systems ("Project Conveyor") in Auckland, NZ—an open ocean telemetry and environmental risk platform tracking 23 Southern Ocean & Tasman buoys, satellite drift corridors, and subsea acoustic/extractive risks.

Live App: ${LIVE_SHARED_URL}

Your patrol crews can test the mobile Oppo A6x 90Hz terminal, +48h current drift vectors, and anonymous maritime SMS alert gateway immediately. We would love to collaborate on Southern Ocean observation and krill/IUU monitoring.

Best regards,
Chris James (${CONTACT_EMAIL})`
  },
  {
    id: 'dscc-asoc',
    rank: 3,
    name: 'Deep Sea Conservation Coalition (DSCC) & ASOC',
    category: 'Priority NGOs',
    region: 'Antarctic & Deep-Sea Policy Advocacy',
    whyThisTarget:
      'Built-in Deep-Sea Strip Mining & Antarctic 2048 Madrid Protocol risk assessment briefing ready for policy outreach.',
    contactOrUrl: 'info@savethehighseas.org / secretariat@asoc.org',
    contactEmail: 'info@savethehighseas.org',
    actionUrl: 'https://deep-sea-conservation.org/contact/',
    subjectLine: 'Interactive Deep-Sea Mining & Antarctic Seismic Risk Simulator — Public Briefing Tool',
    pitchBody: `Hello DSCC & ASOC Policy Teams,

Our SaliBuoy Systems platform includes an interactive Ecological Risk & Polar/Deep-Sea Threat Matrix comparing abyssal polymetallic nodule strip mining and 230+ dB Antarctic seismic surveying against zero-chemical ocean monitoring.

Explore live: ${LIVE_SHARED_URL}

We invite your researchers and campaigners to use and share the risk simulator and downloadable briefing reports freely.

Sincerely,
Chris James • Pukekohe, Auckland, NZ (${CONTACT_EMAIL})`
  },
  {
    id: 'callaghan-outset',
    rank: 4,
    name: 'Callaghan Innovation & Outset Ventures (NZ)',
    category: 'Climate & DeepTech Funding',
    region: 'Pukekohe / Auckland, New Zealand',
    whyThisTarget:
      'Primary NZ funding stack: 40% non-dilutive R&D rebate ($600k) + Outset Ventures physical science wet-lab incubation.',
    contactOrUrl: 'info@callaghaninnovation.govt.nz / outset.ventures',
    contactEmail: 'info@callaghaninnovation.govt.nz',
    actionUrl: 'https://www.outset.ventures/',
    subjectLine: 'Seed & R&D Application: SaliBuoy Systems (AMOC Stabilization Hardware, Pukekohe)',
    pitchBody: `Kia ora Callaghan Innovation & Outset Ventures Team,

SaliBuoy Systems ("Project Conveyor") is raising $1.5M NZD ($600k Callaghan R&D co-funding + $900k Seed) out of Pukekohe, Auckland to complete Mark-III ocean trials for autonomous subsurface salinity-injection buoys that reinforce thermohaline downwelling.

Interactive Investor Data Room & Live Digital Twin: ${LIVE_SHARED_URL}

Includes our 12-month NZ funding pipeline, full Hardware BOM, 3D CAD/STL prototyping suite, EPA EEZ Act compliance matrix, and autonomous Fleet Superintendent. We would appreciate scheduling an R&D assessment and wet-lab tour.

Regards,
Chris James (${CONTACT_EMAIL})`
  },
  {
    id: 'pacific-channel-nz',
    rank: 5,
    name: 'Pacific Channel & Icehouse Ventures (NZ Climate VC)',
    category: 'Climate & DeepTech Funding',
    region: 'Auckland, New Zealand',
    whyThisTarget:
      'Leading Aotearoa DeepTech & Climate venture investors backing hardware-first physical science ventures.',
    contactOrUrl: 'hello@pacificchannel.com',
    contactEmail: 'hello@pacificchannel.com',
    actionUrl: 'https://www.pacificchannel.com/contact',
    subjectLine: 'NZ DeepTech Seed: SaliBuoy Systems — Hardware AMOC Stabilization ($1.5M NZD)',
    pitchBody: `Hi Pacific Channel & Icehouse Investment Teams,

Sharing our live interactive platform for SaliBuoy Systems (Project Conveyor), an Auckland DeepTech venture building wave- and wind-powered subsurface ocean stabilization hardware.

Live Platform & Financial Model: ${LIVE_SHARED_URL}

Highlights: IPONZ provisional patent path, 40% Callaghan R&D leverage, NZ EPA EEZ compliance, and live 23-buoy telemetry + 3D wind/subsea engineering twin. Requesting a seed review meeting.

Best,
Chris James (${CONTACT_EMAIL})`
  },
  {
    id: 'ocean-visions-schmidt',
    rank: 6,
    name: 'Ocean Visions, Schmidt Ocean Institute & Grantham Foundation',
    category: 'Climate & DeepTech Funding',
    region: 'Global Ocean Climate Philanthropy & Grants',
    whyThisTarget:
      'International catalytic funding for marine climate restoration, high-latitude oceanography, and open ocean telemetry.',
    contactOrUrl: 'info@oceanvisions.org',
    contactEmail: 'info@oceanvisions.org',
    actionUrl: 'https://oceanvisions.org/contact/',
    subjectLine: 'Hardware-First Thermohaline Convection & Open Polar Telemetry Platform — SaliBuoy',
    pitchBody: `Hello Ocean Visions & Marine Philanthropy Teams,

We are developing SaliBuoy Systems in New Zealand—autonomous wind- and wave-powered buoys concentrating natural seawater (0.00 ppm synthetic chemicals) to reinforce thermohaline downwelling alongside open Southern Ocean telemetry.

Live Interactive Simulator & Ecological Risk Matrix: ${LIVE_SHARED_URL}

We are seeking catalytic grant partners and ocean-trial collaborators for our Mark-III Southern Ocean pilot.

Warm regards,
Chris James (${CONTACT_EMAIL})`
  },
  {
    id: 'niwa-uoa',
    rank: 7,
    name: 'NIWA, University of Auckland Marine Science & Antarctica NZ',
    category: 'Ocean Science',
    region: 'Auckland / Wellington / Christchurch, NZ',
    whyThisTarget:
      'Scientific validation of Southern Ocean ADCP plumes, Campbell Plateau deployments, and Hauraki Gulf sea trials.',
    contactOrUrl: 'enquiries@niwa.co.nz',
    contactEmail: 'enquiries@niwa.co.nz',
    actionUrl: 'https://niwa.co.nz/about/contact-us',
    subjectLine: 'Research Collaboration: SaliBuoy Subsea Plume Telemetry & Hauraki Gulf Trials',
    pitchBody: `Tēnā koutou NIWA & University of Auckland Oceanographers,

SaliBuoy Systems (Pukekohe) has deployed an interactive simulation & live buoy telemetry suite covering 23 Tasman/Southern Ocean nodes, +48h drift trajectories, and EPA EEZ ecological safety modeling.

Platform: ${LIVE_SHARED_URL}

We are seeking academic/CRI partners for wet-lab validation and Hauraki Gulf sea trials.

Ngā mihi,
Chris James (${CONTACT_EMAIL})`
  },
  {
    id: 'social-launch',
    rank: 8,
    name: 'LinkedIn, Product Hunt, Hacker News (Show HN) & Reddit',
    category: 'Online Launch & Ads',
    region: 'Global Public Launch & Developer/Climate Discovery',
    whyThisTarget:
      'Free high-leverage online distribution to attract climate founders, angel investors, 3D hardware makers, and ocean advocates immediately.',
    contactOrUrl: 'LinkedIn • X/Twitter • Product Hunt • Show HN • r/climate • r/oceanography',
    actionUrl: 'https://www.linkedin.com/feed/',
    subjectLine: 'Launching SaliBuoy Systems: Live 23-Buoy Ocean Telemetry, 3D Wind Platform & Polar Risk Sim',
    pitchBody: `We just opened public access to SaliBuoy Systems (Project Conveyor) — an ocean-climate hardware & telemetry workspace built in New Zealand:
- Live 23-Buoy Southern Ocean & Tasman satellite matrix + Oppo A6x mobile view
- Interactive 3D Wind Turbine platform (wind, storm & snow simulation) + Mesh AI STL export
- Ecological Risk Simulator vs. South Pole seismic oil & deep-sea strip mining
- Monthly self-upgrading Fleet Superintendent

Try it live (no login): ${LIVE_SHARED_URL}
Contact / Funding / Partnerships: ${CONTACT_EMAIL}`
  }
];

const AD_CHANNELS = [
  {
    id: 'linkedin',
    channel: 'LinkedIn (Climate VCs, Maritime & NGO Leaders)',
    headline: 'Can ocean hardware help prevent AMOC collapse without adding a single synthetic chemical?',
    copy: `We just opened public access to Project Conveyor (SaliBuoy Systems), engineered in Auckland, New Zealand.

Inside the live web platform:
• Real-time 23-buoy Southern Ocean & Tasman telemetry + mobile field view
• 3D Wind Turbine platform in storm & snow conditions + Mesh AI 3D-print STL tools
• Ecological Risk Simulator benchmarking SaliBuoy (0.00 ppm chemicals, <85 dB) against South Pole seismic oil & deep-sea seabed strip mining
• Autonomous Interior Superintendent that upgrades monthly

We're inviting Greenpeace, ocean researchers, and climate seed partners ($1.5M NZD round) to test it live:
${LIVE_SHARED_URL}

Direct contact: ${CONTACT_EMAIL}
#ClimateTech #OceanConservation #DeepTech #NewZealand #AMOC #MarineScience`
  },
  {
    id: 'x-bluesky',
    channel: 'X / Bluesky Thread (Greenpeace Tag + Climate Science)',
    headline: 'Built an open ocean-climate telemetry & polar threat simulator in NZ — ready for @Greenpeace & ocean scientists.',
    copy: `1/ Introducing SaliBuoy Systems (Project Conveyor) — an interactive ocean telemetry, 3D wind-platform & ecological risk platform built in New Zealand. Live now (no login): ${LIVE_SHARED_URL}

2/ Built for @Greenpeace @GreenpeaceNZ & ocean defenders: compare zero-chemical thermohaline stabilization (<85 dB, 0.00 ppm chemicals) directly against 230+ dB Antarctic seismic airguns & deep-sea strip mining.

3/ We're seeking NGO adoption, oceanographic partners, and seed/grant funding ($1.5M NZD) for Mark-III sea trials. Try the mobile field view or email ${CONTACT_EMAIL}.`
  },
  {
    id: 'show-hn-ph',
    channel: 'Hacker News (Show HN) / Product Hunt / Reddit',
    headline: 'Show HN: SaliBuoy – Interactive 3D ocean telemetry, STL modeling & polar ecological risk simulator',
    copy: `Built Project Conveyor (SaliBuoy Systems) out of Pukekohe, NZ to combine live oceanographic buoy telemetry (23 nodes across Tasman/Southern Ocean), a Three.js offshore wind-turbine weather/snow simulator, a browser 3D STL modeling studio, an ecological risk simulator (comparing operations against polar oil seismic surveys and deep-sea mining), and a monthly self-upgrading fleet superintendent.

Live app: ${LIVE_SHARED_URL}
Looking for feedback from oceanographers, NGOs (especially Greenpeace), hardware engineers, and climate funders.`
  }
];

export const PublicOutreachPortal: React.FC<PublicOutreachPortalProps> = ({ onExitPortal }) => {
  const [selectedCategory, setSelectedCategory] = useState<TargetCategory>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [targetStatuses, setTargetStatuses] = useState<Record<string, OutreachStatus>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STATUS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Custom AI pitch generator state
  const [customOrg, setCustomOrg] = useState<string>('Greenpeace Aotearoa');
  const [customGoal, setCustomGoal] = useState<string>('Adopt the telemetry & polar threat app in ocean campaigns and co-host a briefing');
  const [customPitch, setCustomPitch] = useState<string>('');
  const [customPitchError, setCustomPitchError] = useState<string | null>(null);
  const [isGeneratingPitch, setIsGeneratingPitch] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STATUS_KEY, JSON.stringify(targetStatuses));
    } catch {
      // ignore storage failure
    }
  }, [targetStatuses]);

  const updateStatus = (id: string, status: OutreachStatus) => {
    setTargetStatuses((prev) => ({ ...prev, [id]: status }));
  };

  const handleCopyText = (id: string, text: string, markCopied = true) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    if (markCopied) {
      updateStatus(id, targetStatuses[id] === 'Sent' ? 'Sent' : 'Copied');
    }
    setTimeout(() => setCopiedId(null), 2200);
  };

  const handleDownloadStandaloneHtmlKit = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SaliBuoy Systems — Ocean Conservation, Greenpeace & Funding Brief</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #020617; color: #e2e8f0; margin: 0; padding: 32px 16px; line-height: 1.6; }
    .wrap { max-width: 840px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; }
    h1 { color: #ffffff; margin-top: 0; font-size: 28px; }
    h2 { color: #38bdf8; font-size: 18px; margin-top: 28px; }
    .tag { display: inline-block; background: #064e3b; color: #6ee7b7; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; }
    .btn { display: inline-block; background: #10b981; color: #020617; font-weight: 700; text-decoration: none; padding: 12px 20px; border-radius: 10px; margin-top: 12px; }
    .card { background: #020617; border: 1px solid #1e293b; border-radius: 10px; padding: 16px; margin-top: 12px; }
    ul { padding-left: 20px; }
  </style>
</head>
<body>
  <div class="wrap">
    <span class="tag">SALIBUOY SYSTEMS • PUKEKOHE, NEW ZEALAND</span>
    <h1>Stabilizing Ocean Circulation &amp; Monitoring Polar Extractive Threats</h1>
    <p>An open-access oceanographic telemetry platform, 3D offshore engineering twin, and ecological risk simulator built in Auckland, New Zealand—ready for immediate adoption by <strong>Greenpeace</strong>, ocean NGOs, researchers, and climate funders.</p>
    <a class="btn" href="${LIVE_SHARED_URL}" target="_blank">Launch Live SaliBuoy App &rarr;</a>

    <h2>Why Greenpeace &amp; Ocean NGOs Can Use This Today</h2>
    <div class="card">
      <ul>
        <li><strong>Live 23-Buoy Fleet &amp; Satellite Matrix:</strong> Tracks Southern Ocean, Tasman, and global convection nodes with +48h drift trajectories and mobile 90Hz view.</li>
        <li><strong>Polar Oil &amp; Deep-Sea Strip Mining Threat Briefing:</strong> Interactive ecological simulator comparing zero-chemical operations (0.00 ppm chemicals, 84.2 dB acoustic ceiling) directly against 230+ dB Antarctic seismic airguns and abyssal polymetallic nodule strip mining.</li>
        <li><strong>3D Wind Turbine &amp; CO2/CH4 Seep Visualization:</strong> Real-time weather, snow/icing, and subsea methane hydrate monitoring.</li>
      </ul>
    </div>

    <h2>Seed &amp; Grant Funding Opportunity ($1,500,000 NZD)</h2>
    <div class="card">
      <p>Seeking NGO partnerships, scientific collaborators, and $1.5M NZD Seed + Callaghan Innovation 40% R&amp;D co-funding to execute Mark-III Hauraki Gulf and Southern Ocean sea trials.</p>
      <p><strong>Founder Contact:</strong> ${CONTACT_EMAIL} &bull; <strong>Base:</strong> Pukekohe, Auckland, New Zealand</p>
    </div>
  </div>
</body>
</html>`;
    downloadFile(htmlContent, 'SaliBuoy_Standalone_Outreach_Pitch_Kit.html', 'text/html');
  };

  const handleGenerateCustomPitch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingPitch(true);
    setCustomPitchError(null);
    setCustomPitch('');

    try {
      const response = await fetch('/api/outreach/custom-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization: customOrg,
          goal: customGoal,
          appUrl: LIVE_SHARED_URL,
          contactEmail: CONTACT_EMAIL
        })
      });
      const data = await response.json();
      if (!response.ok) {
        setCustomPitchError(data?.error || 'Could not generate custom pitch.');
        return;
      }
      setCustomPitch(data.pitchText);
    } catch (err) {
      setCustomPitchError(err instanceof Error ? err.message : 'Network error generating pitch.');
    } finally {
      setIsGeneratingPitch(false);
    }
  };

  const filteredTargets =
    selectedCategory === 'All'
      ? OUTREACH_TARGETS
      : OUTREACH_TARGETS.filter((t) => t.category === selectedCategory);

  const sentCount = Object.values(targetStatuses).filter((s) => s === 'Sent').length;
  const greenpeaceTarget = OUTREACH_TARGETS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Separate Standalone Portal Header */}
      <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-emerald-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white font-mono text-sm">
                  SALIBUOY OUTREACH &amp; FUNDING CAMPAIGN PORTAL
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold">
                  SEPARATE LAUNCH KIT
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Isolated distribution &amp; fundraising hub • Priority #1: Greenpeace • Shareable Link Ready
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={handleDownloadStandaloneHtmlKit}
              className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-200 font-bold flex items-center space-x-1.5 cursor-pointer"
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Download Standalone HTML Kit</span>
            </button>
            <button
              type="button"
              onClick={onExitPortal}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Engineering App</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Transparency Notice + Direct Share Links */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Send, Advertise &amp; Fund SaliBuoy Globally
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                External emails, NGO submissions, and online ads require your click to send from your mail client or social accounts. Every target below includes pre-filled email drafts, public share links, and copy-ready campaign text.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 font-mono text-xs shrink-0">
              <div className="text-[10px] text-slate-400 uppercase">Outreach Progress</div>
              <div className="text-lg font-extrabold text-emerald-300 tabular-nums">
                {sentCount} / {OUTREACH_TARGETS.length} Sent
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block uppercase">Public App Link (For Ads &amp; NGOs)</span>
                <span className="text-teal-300 truncate block">{LIVE_SHARED_URL}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyText('shared-url', LIVE_SHARED_URL, false)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center space-x-1 shrink-0 cursor-pointer"
              >
                {copiedId === 'shared-url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'shared-url' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block uppercase">Separate Campaign Portal Link</span>
                <span className="text-emerald-300 truncate block">{CAMPAIGN_URL}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyText('campaign-url', CAMPAIGN_URL, false)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center space-x-1 shrink-0 cursor-pointer"
              >
                {copiedId === 'campaign-url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'campaign-url' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* PRIORITY #1 SPOTLIGHT: GREENPEACE */}
        <section className="bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-700/70 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-900/60 pb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 font-bold">
                <Leaf className="w-4 h-4" />
                <span>PRIORITY #1 DISTRIBUTION TARGET • IMMEDIATE ADOPTION BRIEF</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">
                {greenpeaceTarget.name}
              </h2>
              <p className="text-xs text-slate-300 max-w-3xl">
                {greenpeaceTarget.whyThisTarget}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs shrink-0">
              <a
                href={`mailto:${greenpeaceTarget.contactEmail}?subject=${encodeURIComponent(
                  greenpeaceTarget.subjectLine
                )}&body=${encodeURIComponent(greenpeaceTarget.pitchBody)}`}
                onClick={() => updateStatus(greenpeaceTarget.id, 'Sent')}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center space-x-1.5 cursor-pointer shadow-lg"
              >
                <Mail className="w-4 h-4" />
                <span>Open Email to Greenpeace</span>
              </a>

              <button
                type="button"
                onClick={() =>
                  handleCopyText(
                    greenpeaceTarget.id,
                    `Subject: ${greenpeaceTarget.subjectLine}\n\n${greenpeaceTarget.pitchBody}`
                  )
                }
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-emerald-700 text-emerald-200 font-bold flex items-center space-x-1.5 cursor-pointer"
              >
                {copiedId === greenpeaceTarget.id ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span>{copiedId === greenpeaceTarget.id ? 'Copied Pitch' : 'Copy Pitch'}</span>
              </button>

              <a
                href={greenpeaceTarget.actionUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold flex items-center space-x-1.5"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Greenpeace Contact Page</span>
              </a>
            </div>
          </div>

          <pre className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
            {`To: ${greenpeaceTarget.contactOrUrl}\nSubject: ${greenpeaceTarget.subjectLine}\n\n${greenpeaceTarget.pitchBody}`}
          </pre>
        </section>

        {/* FULL DISTRIBUTION & FUNDING DIRECTORY */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-white">
                Everywhere SaliBuoy Should Be Sent (NGOs, Funding &amp; Public Launch)
              </h2>
              <p className="text-xs text-slate-400">
                Track outreach status across ocean NGOs, NZ &amp; global DeepTech funding bodies, research institutes, and public ad channels.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {(['All', 'Priority NGOs', 'Climate & DeepTech Funding', 'Ocean Science', 'Online Launch & Ads'] as TargetCategory[]).map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-emerald-600 text-white border-emerald-500 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTargets.map((target) => {
              const status = targetStatuses[target.id] || 'Ready';
              return (
                <div
                  key={target.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 font-mono text-[10px]">
                      <span className="text-teal-400 font-bold uppercase tabular-nums">
                        #{target.rank} • {target.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-bold border ${
                          status === 'Sent'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                            : status === 'Copied'
                              ? 'bg-sky-950 text-sky-300 border-sky-700'
                              : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white">{target.name}</h3>
                      <div className="text-[11px] font-mono text-slate-400">{target.region}</div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{target.whyThisTarget}</p>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 truncate">
                      Target: {target.contactOrUrl}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 font-mono text-xs">
                    {target.contactEmail && (
                      <a
                        href={`mailto:${target.contactEmail}?subject=${encodeURIComponent(
                          target.subjectLine
                        )}&body=${encodeURIComponent(target.pitchBody)}`}
                        onClick={() => updateStatus(target.id, 'Sent')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center space-x-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Email</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        handleCopyText(
                          target.id,
                          `Subject: ${target.subjectLine}\n\n${target.pitchBody}`
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedId === target.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedId === target.id ? 'Copied' : 'Copy Pitch'}</span>
                    </button>

                    <a
                      href={target.actionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-sky-300 flex items-center space-x-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Site</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => updateStatus(target.id, status === 'Sent' ? 'Ready' : 'Sent')}
                      className="ml-auto text-[11px] text-slate-400 hover:text-emerald-300 cursor-pointer"
                    >
                      {status === 'Sent' ? 'Reset' : 'Mark Sent'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ONLINE ADVERTISING & SOCIAL CAMPAIGN COPY */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-sky-400 font-bold uppercase">
            <Share2 className="w-4 h-4" />
            <span>Ready-to-Post Online Advertising &amp; Social Launch Copy</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {AD_CHANNELS.map((ad) => (
              <div
                key={ad.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-emerald-400 font-bold">{ad.channel}</div>
                  <h3 className="text-xs font-bold text-white">{ad.headline}</h3>
                  <pre className="text-[11px] font-sans text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800 max-h-56 overflow-y-auto">
                    {ad.copy}
                  </pre>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyText(`ad-${ad.id}`, `${ad.headline}\n\n${ad.copy}`, false)}
                  className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 font-bold flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  {copiedId === `ad-${ad.id}` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === `ad-${ad.id}` ? 'Ad Copy Copied' : 'Copy Post / Ad Copy'}</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* AI CUSTOM PITCH WRITER (GEMINI 4) */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-purple-400 font-bold uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Custom Campaign &amp; Funder Pitch Generator (Gemini 4)</span>
          </div>

          <form onSubmit={handleGenerateCustomPitch} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Target Organization / Platform</label>
              <input
                type="text"
                required
                value={customOrg}
                onChange={(e) => setCustomOrg(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-400 mb-1">Outreach Objective</label>
              <input
                type="text"
                required
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="md:col-span-3 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isGeneratingPitch}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGeneratingPitch ? 'Drafting Custom Pitch...' : 'Generate Tailored Pitch'}</span>
              </button>
            </div>
          </form>

          {customPitchError && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-200 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{customPitchError}</span>
            </div>
          )}

          {customPitch && (
            <div className="space-y-2">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleCopyText('custom-pitch', customPitch, false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-white flex items-center space-x-1 cursor-pointer"
                >
                  {copiedId === 'custom-pitch' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'custom-pitch' ? 'Copied' : 'Copy Generated Pitch'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
                {customPitch}
              </pre>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
