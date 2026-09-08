# SaliBuoy Systems — Project Conveyor

> **Autonomous AMOC Stabilization & Oceanographic Intervention Platform**  
> *Engineered at Pukekohe Engineering Hub, Auckland, New Zealand.*

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-8E75B2?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![Octokit](https://img.shields.io/badge/GitHub_Octokit-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/octokit/octokit.js)

---

## 🌊 Overview

**Project Conveyor** by **SaliBuoy Systems** is a specialized marine geoengineering, hardware modeling, and oceanographic monitoring platform designed to mitigate the threat of Atlantic Meridional Overturning Circulation (AMOC) collapse. 

By modeling and managing autonomous subsurface buoys (Mark-III units) engineered for controlled salinity injection, wave kinetic energy harvesting, and sub-surface temperature monitoring, Project Conveyor delivers a data-driven path toward ocean circulation stabilization.

---

## ✨ Key Features

- 📊 **Executive AMOC Dashboard**: Real-time Ocean Heat Content (OHC), thermohaline salinity balance, and tipping point collapse risk indicators.
- 🤖 **Gemini AI Briefings & OneDrive Sync**: Daily AI-generated AMOC summaries automatically formatted and uploaded to Microsoft OneDrive (`salibuoy.systems@outlook.com`).
- 🛰️ **Subsurface Buoy Telemetry Simulation**: Live time-series telemetry for Mark-III units measuring ambient vs. injected salinity (PSU), subsurface depth temperature, battery state, and kinetic wave output.
- 🛠️ **Hardware Bill of Materials (BOM) & Unit Economics**: Itemized component breakdown (NZD ~$32,400/unit) with an interactive fleet scaling calculator (10 to 250 units).
- 🌐 **3D Subsea Control & Spatial Database**: Interactive 3D buoy array mapping and subsea spatial telemetry visualization.
- 🇳🇿 **NZ EEZ & Environmental Compliance**: Regulatory auditing covering EPA marine discharge protocols, Resource Management Act (RMA) constraints, and Mana Whenua/iwi engagement frameworks.
- 🔄 **GitHub Octokit Sync Utility**: Built-in automated source code sync tool that commits and pushes the entire workspace directly to a designated GitHub repository using Octokit.

---

## 🚀 Quick Start & Local Development

### Prerequisites

- **Node.js**: v18 or higher
- **npm** or **bun**

### Environment Setup

Copy `.env.example` to `.env` and configure your API keys:

```bash
cp .env.example .env
```

Environment variables:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Installation

```bash
# Install dependencies
npm install

# Start the dev server (Express + Vite on port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Architecture & Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React Icons, Recharts, Three.js
- **Backend**: Express.js with Node TypeScript execution (`tsx`)
- **AI Integration**: Google Gemini API (`@google/genai`) for daily briefing synthesis & grant generation
- **Version Control**: Octokit SDK (`octokit`) for server-side GitHub repository synchronization
- **Cloud Storage**: Microsoft Graph API integration for Microsoft OneDrive automated report exports

---

## 📦 Project Structure

```
.
├── server.ts                    # Express backend server with Gemini & Octokit routes
├── src/
│   ├── App.tsx                  # Main React container with navigation
│   ├── components/
│   │   ├── Dashboard.tsx        # Main executive dashboard
│   │   ├── SyncToGitHub.tsx     # Octokit GitHub synchronization panel
│   │   ├── TelemetrySim.tsx     # Subsurface buoy telemetry simulator
│   │   ├── BOMViewer.tsx        # Hardware bill of materials & scaling
│   │   ├── ThreeDControlDatabase.tsx # 3D buoy spatial visualization
│   │   └── ...                  # Specialized modules (Compliance, Trials, Grant Hub)
│   ├── services/
│   │   └── microsoftGraphService.ts # OneDrive export service
│   └── types.ts                 # Shared TypeScript interfaces
├── README.md                    # Project documentation
├── package.json                 # Project dependencies and scripts
└── vite.config.ts               # Vite configuration
```

---

## 🔄 Syncing to GitHub via Octokit

1. Open the **Sync to GitHub** card on the main dashboard.
2. Enter your **GitHub Personal Access Token (PAT)** with `repo` permissions.
3. Specify your GitHub username/owner and repository name (e.g., `salibuoy-systems-conveyor`).
4. Click **Sync Codebase to GitHub Now**. The Octokit engine will automatically scan all workspace files, construct a Git tree, commit, and push to your target repository.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more details.

*SaliBuoy Systems — Engineering Climate Resilience from Pukekohe, New Zealand.*
