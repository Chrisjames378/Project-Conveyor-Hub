import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Calculator, 
  PieChart, 
  Download, 
  Coins, 
  Building2, 
  Clock, 
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { downloadFile } from '../utils/exportUtils';

export const FinancialModel: React.FC = () => {
  // Fleet Unit Economics State
  const [buoyCapexNZD, setBuoyCapexNZD] = useState<number>(42000); // $42,000 NZD per unit
  const [annualOpexNZD, setAnnualOpexNZD] = useState<number>(3500); // $3,500 NZD per unit/yr
  const [fleetSize, setFleetSize] = useState<number>(50); // 50 Buoys
  const [co2SequestrationTonsPerBuoy, setCo2SequestrationTonsPerBuoy] = useState<number>(1250); // 1,250 tons CO2/yr per buoy
  const [carbonCreditPriceUSD, setCarbonCreditPriceUSD] = useState<number>(45); // $45 USD/ton CO2
  const [nzdToUsdRate] = useState<number>(0.61);

  // Financial Calculations
  const totalFleetCapexNZD = buoyCapexNZD * fleetSize;
  const totalAnnualOpexNZD = annualOpexNZD * fleetSize;
  
  // Revenue from Carbon / AMOC Stability Credits
  const annualCarbonTonsFleet = co2SequestrationTonsPerBuoy * fleetSize;
  const annualRevenueUSD = annualCarbonTonsFleet * carbonCreditPriceUSD;
  const annualRevenueNZD = Math.round(annualRevenueUSD / nzdToUsdRate);

  const netAnnualProfitNZD = annualRevenueNZD - totalAnnualOpexNZD;
  const paybackPeriodYears = Number((totalFleetCapexNZD / Math.max(1, netAnnualProfitNZD)).toFixed(1));
  const tenYearGrossRevenueNZD = annualRevenueNZD * 10;
  const tenYearNetNPVNZD = Math.round((tenYearGrossRevenueNZD - (totalAnnualOpexNZD * 10) - totalFleetCapexNZD) * 0.72); // Discounted 10% rate

  const exportFinancialProjectionsCSV = () => {
    const csvLines = [
      'SALIBUOY SYSTEMS - 10-YEAR FLEET UNIT ECONOMICS & FINANCIAL MODEL',
      '==================================================================',
      `Fleet Size: ${fleetSize} Units`,
      `CAPEX per Buoy: $${buoyCapexNZD.toLocaleString()} NZD`,
      `Total Initial Fleet CAPEX: $${totalFleetCapexNZD.toLocaleString()} NZD`,
      `Annual OPEX per Buoy: $${annualOpexNZD.toLocaleString()} NZD`,
      `Total Annual Fleet OPEX: $${totalAnnualOpexNZD.toLocaleString()} NZD`,
      `CO2 Sequestration per Buoy: ${co2SequestrationTonsPerBuoy} Tons/Year`,
      `Total Fleet CO2 Sequestration: ${annualCarbonTonsFleet.toLocaleString()} Tons/Year`,
      `Carbon Price: $${carbonCreditPriceUSD} USD/Ton`,
      `Annual Gross Revenue: $${annualRevenueNZD.toLocaleString()} NZD ($${annualRevenueUSD.toLocaleString()} USD)`,
      `Net Annual Operating Profit: $${netAnnualProfitNZD.toLocaleString()} NZD`,
      `Simple Payback Period: ${paybackPeriodYears} Years`,
      `10-Year Discounted Net Present Value (NPV @ 10%): $${tenYearNetNPVNZD.toLocaleString()} NZD`
    ].join('\n');

    downloadFile(csvLines, 'SaliBuoy_Fleet_Financial_Model.csv', 'text/csv');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950 border border-slate-800 rounded-2xl p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>Unit Economics • Fleet Scaling • Carbon Credit Revenue • NPV Model</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Financial Model & Fleet Unit Economics
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Interactive financial calculator modeling unit manufacturing CAPEX, autonomous ocean OPEX, carbon credit yield from deep thermohaline CO2 pumps, and 10-year NPV projections.
            </p>
          </div>

          <button
            onClick={exportFinancialProjectionsCSV}
            className="inline-flex items-center space-x-2 px-3.5 py-2 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/80 rounded-xl text-xs font-mono cursor-pointer transition-colors self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Financial Model CSV</span>
          </button>
        </div>
      </div>

      {/* Top Highlight Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase">Initial Fleet CAPEX</span>
          <div className="text-lg sm:text-xl font-extrabold text-white">${(totalFleetCapexNZD / 1000000).toFixed(2)}M <span className="text-xs font-normal text-slate-400">NZD</span></div>
          <p className="text-[10px] text-slate-500">${buoyCapexNZD.toLocaleString()} NZD / Buoy</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase">Annual Fleet Revenue</span>
          <div className="text-lg sm:text-xl font-extrabold text-emerald-400">${(annualRevenueNZD / 1000000).toFixed(2)}M <span className="text-xs font-normal text-slate-400">NZD</span></div>
          <p className="text-[10px] text-emerald-500">${annualRevenueUSD.toLocaleString()} USD / Year</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase">Simple Payback Period</span>
          <div className="text-lg sm:text-xl font-extrabold text-sky-300">{paybackPeriodYears} <span className="text-xs font-normal text-slate-400">Years</span></div>
          <p className="text-[10px] text-sky-400">Net Profit ROI Threshold</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase">10-Year Fleet NPV (@10%)</span>
          <div className="text-lg sm:text-xl font-extrabold text-purple-300">${(tenYearNetNPVNZD / 1000000).toFixed(2)}M <span className="text-xs font-normal text-slate-400">NZD</span></div>
          <p className="text-[10px] text-purple-400">50-Buoy Scaling Net Value</p>
        </div>
      </div>

      {/* Interactive Financial Model Sliders */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center space-x-2 text-xs font-mono text-sky-400 border-b border-slate-800 pb-3">
          <Coins className="w-4 h-4" />
          <span>Interactive Fleet Scaling & Carbon Credit Price Controls</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          {/* Slider 1: Deployed Buoy Fleet Count */}
          <div className="space-y-2">
            <div className="flex justify-between text-slate-300">
              <label>Fleet Scale: <span className="text-sky-400 font-bold">{fleetSize} Buoys</span></label>
              <span className="text-slate-500 text-[10px]">1 to 250</span>
            </div>
            <input
              type="range"
              min="5"
              max="250"
              step="5"
              value={fleetSize}
              onChange={(e) => setFleetSize(parseInt(e.target.value))}
              className="w-full accent-sky-400 bg-slate-950 cursor-pointer"
            />
          </div>

          {/* Slider 2: Carbon Credit / AMOC Credit Price USD */}
          <div className="space-y-2">
            <div className="flex justify-between text-slate-300">
              <label>Carbon Price: <span className="text-emerald-400 font-bold">${carbonCreditPriceUSD} USD/Ton</span></label>
              <span className="text-slate-500 text-[10px]">$15-$150</span>
            </div>
            <input
              type="range"
              min="15"
              max="150"
              value={carbonCreditPriceUSD}
              onChange={(e) => setCarbonCreditPriceUSD(parseInt(e.target.value))}
              className="w-full accent-emerald-400 bg-slate-950 cursor-pointer"
            />
          </div>

          {/* Slider 3: CO2 Sequestration Yield per Buoy */}
          <div className="space-y-2">
            <div className="flex justify-between text-slate-300">
              <label>CO2 Pump Yield: <span className="text-teal-400 font-bold">{co2SequestrationTonsPerBuoy} Tons/Yr</span></label>
              <span className="text-slate-500 text-[10px]">200-3000</span>
            </div>
            <input
              type="range"
              min="200"
              max="3000"
              step="50"
              value={co2SequestrationTonsPerBuoy}
              onChange={(e) => setCo2SequestrationTonsPerBuoy(parseInt(e.target.value))}
              className="w-full accent-teal-400 bg-slate-950 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Unit Breakdown & Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CAPEX Unit Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 font-mono text-xs">
          <div className="flex items-center space-x-2 text-sky-400 border-b border-slate-800 pb-3 font-bold">
            <Building2 className="w-4 h-4" />
            <span>Single SaliBuoy Mark-III Manufacturing CAPEX ($42,000 NZD)</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between p-2.5 bg-slate-950 rounded border border-slate-800">
              <span className="text-slate-300">Grade 5 Titanium Pressure Hull (500m)</span>
              <span className="text-white font-bold">$12,500 NZD</span>
            </div>

            <div className="flex justify-between p-2.5 bg-slate-950 rounded border border-slate-800">
              <span className="text-slate-300">Vertical-Axis Wind Turbine & Rotor Drive</span>
              <span className="text-white font-bold">$7,800 NZD</span>
            </div>

            <div className="flex justify-between p-2.5 bg-slate-950 rounded border border-slate-800">
              <span className="text-slate-300">Subsea Alumina Ceramic Impeller Pump</span>
              <span className="text-white font-bold">$8,400 NZD</span>
            </div>

            <div className="flex justify-between p-2.5 bg-slate-950 rounded border border-slate-800">
              <span className="text-slate-300">Iridium SBD Satellite & Acoustic Modem</span>
              <span className="text-white font-bold">$6,200 NZD</span>
            </div>

            <div className="flex justify-between p-2.5 bg-slate-950 rounded border border-slate-800">
              <span className="text-slate-300">1000m Kevlar Tether & Acoustic Release</span>
              <span className="text-white font-bold">$7,100 NZD</span>
            </div>
          </div>
        </div>

        {/* 10-Year Pro-Forma Cash Flow Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 font-mono text-xs">
          <div className="flex items-center space-x-2 text-emerald-400 border-b border-slate-800 pb-3 font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>10-Year Pro-Forma Fleet Revenue & Cash Flow</span>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-1 text-[10px]">
              <span>YEAR</span>
              <span>DEPLOYED</span>
              <span>GROSS REVENUE</span>
              <span>NET PROFIT</span>
            </div>

            {[1, 2, 3, 5, 10].map((yr) => {
              const activeCount = Math.min(fleetSize, Math.round(fleetSize * (yr / 3)));
              const gross = Math.round((activeCount * co2SequestrationTonsPerBuoy * carbonCreditPriceUSD) / nzdToUsdRate);
              const opex = activeCount * annualOpexNZD;
              const net = gross - opex;

              return (
                <div key={yr} className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-300 font-bold">Year {yr}</span>
                  <span className="text-slate-400">{activeCount} Buoys</span>
                  <span className="text-emerald-400">${(gross / 1000).toFixed(0)}k NZD</span>
                  <span className="text-white font-bold">${(net / 1000).toFixed(0)}k NZD</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
