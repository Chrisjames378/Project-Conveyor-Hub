import React, { useState } from 'react';
import { BOMItem } from '../types';
import { INITIAL_BOM_ITEMS } from '../db/localDatabase';
import { exportBOMToCSV } from '../utils/exportUtils';
import { microsoftGraphService } from '../services/microsoftGraphService';
import { 
  Package, 
  DollarSign, 
  Layers, 
  Truck, 
  Plus, 
  Calculator, 
  Building2,
  Check,
  Download,
  Cloud,
  RefreshCw
} from 'lucide-react';

export const BOMViewer: React.FC = () => {
  const [bomItems, setBomItems] = useState<BOMItem[]>(() => {
    const saved = localStorage.getItem('salibuoy_bom_items');
    return saved ? JSON.parse(saved) : INITIAL_BOM_ITEMS;
  });

  const [fleetScale, setFleetScale] = useState<number>(10); // 1, 10, or 100 buoys
  const [showAddModal, setShowAddModal] = useState(false);

  // New BOM Item Form State
  const [partName, setPartName] = useState('');
  const [category, setCategory] = useState<BOMItem['category']>('Salinity Pump & Diffusion');
  const [spec, setSpec] = useState('');
  const [supplier, setSupplier] = useState('');
  const [cost, setCost] = useState(1500);
  const [qty, setQty] = useState(1);
  const [leadTime, setLeadTime] = useState(2);

  const saveBOM = (updated: BOMItem[]) => {
    setBomItems(updated);
    localStorage.setItem('salibuoy_bom_items', JSON.stringify(updated));
  };

  const costPerSingleBuoy = bomItems.reduce((acc, curr) => acc + (curr.unitCostNZD * curr.qtyPerBuoy), 0);
  // Apply a 20% economies of scale discount at 100 units
  const scaleDiscountMultiplier = fleetScale >= 100 ? 0.8 : fleetScale >= 10 ? 0.9 : 1.0;
  const totalFleetCost = Math.round(costPerSingleBuoy * fleetScale * scaleDiscountMultiplier);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partName) return;
    const item: BOMItem = {
      id: `bom-${Date.now()}`,
      category,
      partName,
      specification: spec || 'Standard marine spec',
      supplier: supplier || 'NZ Marine Tech',
      unitCostNZD: Number(cost),
      qtyPerBuoy: Number(qty),
      leadTimeWeeks: Number(leadTime)
    };
    saveBOM([...bomItems, item]);
    setShowAddModal(false);
    setPartName('');
    setSpec('');
    setSupplier('');
  };

  const [isUploadingOneDrive, setIsUploadingOneDrive] = useState(false);
  const [oneDriveStatus, setOneDriveStatus] = useState<string | null>(null);

  const exportBOMToOneDrive = async () => {
    setIsUploadingOneDrive(true);
    setOneDriveStatus('Uploading BOM to OneDrive folder (BOM_Export_Logs)...');
    try {
      const headers = ['Part Name', 'Category', 'Specification', 'Supplier (NZ)', 'Unit Cost (NZD)', `Quantity (${fleetScale} Fleet)`, 'Subtotal (NZD)'];
      const rows = bomItems.map(item => [
        `"${item.partName}"`,
        `"${item.category}"`,
        `"${item.specification}"`,
        `"${item.supplier}"`,
        item.unitCostNZD,
        item.qtyPerBuoy * fleetScale,
        item.unitCostNZD * item.qtyPerBuoy * fleetScale
      ].join(','));

      const csvContent = [headers.join(','), ...rows].join('\n');

      if (!microsoftGraphService.isAuthenticated()) {
        await microsoftGraphService.login();
      }

      const fileName = `SaliBuoy_MarkIII_BOM_${fleetScale}_Units_${new Date().toISOString().split('T')[0]}.csv`;
      await microsoftGraphService.uploadFile(
        fileName,
        csvContent,
        'text/csv',
        'BOM_Export_Logs'
      );

      setOneDriveStatus(`Saved ${fileName} to OneDrive folder 'BOM_Export_Logs'!`);
    } catch (err: any) {
      console.error('OneDrive BOM upload error:', err);
      setOneDriveStatus('Failed to upload BOM to OneDrive.');
    } finally {
      setIsUploadingOneDrive(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-sky-400">
              <Package className="w-4 h-4" />
              <span>Hardware Unit Economics & Fabrication • Pukekohe Labs</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
              Mark-III Bill of Materials (BOM)
            </h2>
            <p className="text-xs text-slate-400">
              Itemized manufacturing cost model for deep-ocean salinity buoys sourced via New Zealand DeepTech suppliers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              onClick={exportBOMToOneDrive}
              disabled={isUploadingOneDrive}
              className="inline-flex items-center space-x-2 px-3.5 py-2 bg-sky-950 hover:bg-sky-900 text-sky-200 border border-sky-800 rounded-xl text-xs font-mono font-bold cursor-pointer transition-colors"
            >
              {isUploadingOneDrive ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
              ) : (
                <Cloud className="w-3.5 h-3.5 text-sky-400" />
              )}
              <span>OneDrive BOM (BOM_Export_Logs)</span>
            </button>

            <button
              onClick={() => exportBOMToCSV(bomItems, fleetScale)}
              className="inline-flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-mono cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export BOM CSV</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Component</span>
            </button>
          </div>

        {oneDriveStatus && (
          <div className="p-3 bg-slate-950 border border-sky-800/80 rounded-xl flex items-center justify-between font-mono text-xs text-sky-300">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{oneDriveStatus}</span>
            </div>
            <a
              href="https://onedrive.live.com"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 underline font-bold text-[11px]"
            >
              Open OneDrive (salibuoy.systems@outlook.com) ↗
            </a>
          </div>
        )}
      </div>

        {/* Fleet Scale Calculator Banner */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400">Cost Per Single Buoy</span>
            <div className="text-2xl font-bold text-white font-mono">${costPerSingleBuoy.toLocaleString()} NZD</div>
            <p className="text-[10px] text-slate-500">Fabricated in Auckland / Pukekohe Labs</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400">Fleet Deployment Quantity</span>
            <div className="flex items-center space-x-2 pt-1">
              {[1, 10, 100].map(qty => (
                <button
                  key={qty}
                  onClick={() => setFleetScale(qty)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                    fleetScale === qty
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {qty} {qty === 1 ? 'Buoy' : 'Buoys'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1 md:text-right">
            <span className="text-[10px] font-mono uppercase text-emerald-400">Total Fleet Cost ({fleetScale} units)</span>
            <div className="text-2xl font-bold text-emerald-300 font-mono">${totalFleetCost.toLocaleString()} NZD</div>
            <p className="text-[10px] text-slate-400">
              {scaleDiscountMultiplier < 1.0 ? `${(100 - scaleDiscountMultiplier * 100).toFixed(0)}% Scale discount applied` : 'Base prototype costing'}
            </p>
          </div>
        </div>
      </div>

      {/* BOM Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono uppercase text-[10px]">
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Part / Component Name</th>
                <th className="p-3.5">Technical Spec</th>
                <th className="p-3.5">Supplier (NZ)</th>
                <th className="p-3.5 text-right">Unit Cost (NZD)</th>
                <th className="p-3.5 text-center">Qty</th>
                <th className="p-3.5 text-center">Lead Time</th>
                <th className="p-3.5 text-right">Total ({fleetScale}x)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {bomItems.map((item) => {
                const totalItemCost = Math.round(item.unitCostNZD * item.qtyPerBuoy * fleetScale * scaleDiscountMultiplier);
                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-mono text-slate-400 text-[11px]">{item.category}</td>
                    <td className="p-3.5 font-bold text-white">{item.partName}</td>
                    <td className="p-3.5 text-slate-400">{item.specification}</td>
                    <td className="p-3.5 font-mono text-sky-300 text-[11px]">{item.supplier}</td>
                    <td className="p-3.5 text-right font-mono font-semibold text-slate-200">
                      ${item.unitCostNZD.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-center font-mono text-slate-300">{item.qtyPerBuoy}</td>
                    <td className="p-3.5 text-center font-mono text-slate-400">{item.leadTimeWeeks} wks</td>
                    <td className="p-3.5 text-right font-mono font-bold text-emerald-400">
                      ${totalItemCost.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Add BOM Hardware Component</h3>

            <form onSubmit={handleAddItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-mono">Part Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Titanium Pressure Collar"
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-mono">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="Pressure Hull & Subframe">Pressure Hull & Subframe</option>
                  <option value="Salinity Pump & Diffusion">Salinity Pump & Diffusion</option>
                  <option value="Power & Energy Storage">Power & Energy Storage</option>
                  <option value="Telemetry & Autonomy">Telemetry & Autonomy</option>
                  <option value="Mooring & Anchoring">Mooring & Anchoring</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-mono">Specification</label>
                <input
                  type="text"
                  placeholder="e.g. Grade 5 Titanium, 500m depth rated"
                  value={spec}
                  onChange={(e) => setSpec(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-mono">Supplier (NZ)</label>
                <input
                  type="text"
                  placeholder="e.g. Callaghan Fabrication Pukekohe"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-mono">Unit Cost (NZD $)</label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-mono">Qty per Buoy</label>
                  <input
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg font-bold hover:bg-sky-500 cursor-pointer"
                >
                  Save Component
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
