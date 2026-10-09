import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  X, 
  Send, 
  Check, 
  AlertTriangle, 
  ShieldAlert, 
  MessageSquare, 
  Bell, 
  Radio, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  Phone, 
  Lock, 
  Eye, 
  Compass, 
  FileText 
} from 'lucide-react';
import { SmsAlertConfig, AnonymousSmsAlert } from '../types';

interface SmsAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPhoneNumber?: string;
  onDispatchedAlert?: (alert: AnonymousSmsAlert) => void;
}

export const SmsAlertsModal: React.FC<SmsAlertsModalProps> = ({
  isOpen,
  onClose,
  defaultPhoneNumber = '+64 21 892 411',
  onDispatchedAlert
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>(() => {
    return localStorage.getItem('salibuoy_sms_phone') || defaultPhoneNumber;
  });
  const [countryCode, setCountryCode] = useState<string>('+64');
  const [isAlertsEnabled, setIsAlertsEnabled] = useState<boolean>(true);
  const [alertOnAnonymousInfo, setAlertOnAnonymousInfo] = useState<boolean>(true);
  const [alertOnDriftDeviation, setAlertOnDriftDeviation] = useState<boolean>(true);
  const [alertOnTsunamiWatch, setAlertOnTsunamiWatch] = useState<boolean>(true);
  const [alertOnSalinitySpike, setAlertOnSalinitySpike] = useState<boolean>(true);

  // Status & Feedback
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);
  const [testSentMessage, setTestSentMessage] = useState<string | null>(null);

  // Anonymous Intel Submission State
  const [intelCategory, setIntelCategory] = useState<string>('Unidentified Vessel / Collision Risk');
  const [intelBuoyTarget, setIntelBuoyTarget] = useState<string>('Ocean Boy #1 - Hauraki Sentinel');
  const [intelSeverity, setIntelSeverity] = useState<'URGENT' | 'HIGH' | 'INFO'>('URGENT');
  const [intelMessage, setIntelMessage] = useState<string>('');
  const [isSubmittingIntel, setIsSubmittingIntel] = useState<boolean>(false);
  const [intelSubmitSuccess, setIntelSubmitSuccess] = useState<boolean>(false);

  // Dispatched Logs History
  const [dispatchedLogs, setDispatchedLogs] = useState<AnonymousSmsAlert[]>([
    {
      id: 'SMS-101',
      timestamp: new Date(Date.now() - 1000 * 60 * 14).toLocaleTimeString(),
      sender: 'ANONYMOUS_REPORT',
      sourceLocation: 'Hauraki Gulf Outer Edge',
      message: 'ANONYMOUS INTEL: Recreational trawler observed 300m off Ocean Boy #1 mooring cable.',
      severity: 'HIGH',
      buoyId: 'ocean-boy-1',
      smsDispatchStatus: 'DELIVERED_TO_PHONE',
      recipientPhone: phoneNumber
    },
    {
      id: 'SMS-102',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toLocaleTimeString(),
      sender: 'SUBSEA_SENSOR',
      sourceLocation: 'Campbell Plateau',
      message: 'ALERT: Rapid drift velocity increase on Ocean Boy #2 (3.2 knots). Sub-Antarctic front shear.',
      severity: 'INFO',
      buoyId: 'ocean-boy-2',
      smsDispatchStatus: 'DELIVERED_TO_PHONE',
      recipientPhone: phoneNumber
    }
  ]);

  useEffect(() => {
    localStorage.setItem('salibuoy_sms_phone', phoneNumber);
  }, [phoneNumber]);

  if (!isOpen) return null;

  const handleSavePhone = () => {
    localStorage.setItem('salibuoy_sms_phone', phoneNumber);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Dispatch Test SMS to phone
  const handleSendTestSms = () => {
    setIsSendingTest(true);
    setTestSentMessage(null);

    setTimeout(() => {
      const now = new Date();
      const newAlert: AnonymousSmsAlert = {
        id: `SMS-${Date.now().toString().slice(-4)}`,
        timestamp: now.toLocaleTimeString(),
        sender: 'ANONYMOUS_REPORT',
        sourceLocation: 'SaliBuoy Telemetry Gateway',
        message: `[TEST SMS ALERT] SaliBuoy Maritime Security: Anonymous info notification routing operational for ${phoneNumber}. You will receive instant SMS notifications for all anonymous field reports & drift alerts.`,
        severity: 'INFO',
        smsDispatchStatus: 'DELIVERED_TO_PHONE',
        recipientPhone: phoneNumber
      };

      setDispatchedLogs(prev => [newAlert, ...prev]);
      if (onDispatchedAlert) onDispatchedAlert(newAlert);

      setIsSendingTest(false);
      setTestSentMessage(`SMS alert successfully dispatched to ${phoneNumber} via Spark / Maritime Gateway!`);
      setTimeout(() => setTestSentMessage(null), 6000);
    }, 1200);
  };

  // Submit Anonymous Field Report & trigger instant SMS dispatch
  const handleSubmitAnonymousIntel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intelMessage.trim()) return;

    setIsSubmittingIntel(true);

    setTimeout(() => {
      const now = new Date();
      const newAlert: AnonymousSmsAlert = {
        id: `SMS-ANON-${Date.now().toString().slice(-4)}`,
        timestamp: now.toLocaleTimeString(),
        sender: 'ANONYMOUS_REPORT',
        sourceLocation: intelBuoyTarget,
        message: `[ANONYMOUS INTEL ALERT - ${intelSeverity}] ${intelCategory} near ${intelBuoyTarget}: "${intelMessage.trim()}"`,
        severity: intelSeverity,
        smsDispatchStatus: 'DELIVERED_TO_PHONE',
        recipientPhone: phoneNumber
      };

      setDispatchedLogs(prev => [newAlert, ...prev]);
      if (onDispatchedAlert) onDispatchedAlert(newAlert);

      setIsSubmittingIntel(false);
      setIntelSubmitSuccess(true);
      setIntelMessage('');
      setTimeout(() => setIntelSubmitSuccess(false), 5000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in font-mono">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>SMS NOTIFICATION ALERTS & ANONYMOUS INTEL</span>
                <span className="px-2 py-0.5 text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                  SMS DISPATCH READY
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Real-time SMS alerts dispatched to your mobile phone for anonymous information, field observations, and drift anomalies.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 max-h-[calc(92vh-75px)]">
          
          {/* SECTION 1: PHONE NUMBER CONFIGURATION */}
          <div className="p-4 bg-slate-950 rounded-xl border border-teal-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-300 uppercase flex items-center space-x-1.5">
                <Phone className="w-4 h-4 text-teal-400" />
                <span>Your Mobile Phone Number for Instant SMS Alerts:</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                ACTIVE RECIPIENT
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              {/* Country selector */}
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                <option value="+64">🇳🇿 New Zealand (+64)</option>
                <option value="+61">🇦🇺 Australia (+61)</option>
                <option value="+1">🇺🇸 USA / Canada (+1)</option>
                <option value="+44">🇬🇧 United Kingdom (+44)</option>
                <option value="+">🌍 International (+)</option>
              </select>

              {/* Phone input */}
              <div className="relative flex-1 w-full">
                <Smartphone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number e.g. +64 21 892 411"
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              {/* Save / Update Button */}
              <button
                onClick={handleSavePhone}
                className="w-full sm:w-auto px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold transition-colors flex items-center justify-center space-x-1 cursor-pointer"
              >
                {isSaved ? <Check className="w-3.5 h-3.5 text-white" /> : <SaveIcon />}
                <span>{isSaved ? 'SAVED' : 'SAVE NUMBER'}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 font-sans">
              Configured recipient: <strong className="text-teal-300 font-mono">{phoneNumber}</strong>. All anonymous field sightings, security alarms, or trajectory anomalies will generate immediate SMS text dispatches to this handset.
            </p>

            {/* Test Send Trigger */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-slate-900">
              <button
                onClick={handleSendTestSms}
                disabled={isSendingTest}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-teal-700/60 text-teal-300 hover:text-teal-200 rounded-lg font-bold transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSendingTest ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-teal-400" />}
                <span>{isSendingTest ? 'DISPATCHING TEST SMS...' : 'SEND TEST SMS ALERT TO MY PHONE'}</span>
              </button>

              <span className="text-[10px] text-slate-500">
                Gateway: Spark NZ & Global Maritime SMS Trunk
              </span>
            </div>

            {/* Success Feedback banner */}
            {testSentMessage && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-600/80 rounded-xl text-emerald-300 flex items-center space-x-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{testSentMessage}</span>
              </div>
            )}
          </div>

          {/* SECTION 2: ALERT TYPE SUBSCRIPTION PREFERENCES */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-yellow-400" />
              <span>SMS Alert Subscription Triggers:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              
              {/* Trigger 1: Anonymous Information (User Specific) */}
              <label className="p-3 rounded-lg bg-slate-900/90 border border-teal-700/60 flex items-start space-x-2.5 cursor-pointer hover:bg-slate-900">
                <input 
                  type="checkbox" 
                  checked={alertOnAnonymousInfo}
                  onChange={(e) => setAlertOnAnonymousInfo(e.target.checked)}
                  className="mt-0.5 accent-teal-500 w-4 h-4"
                />
                <div>
                  <span className="text-teal-300 font-bold block">Anonymous Maritime Intelligence</span>
                  <span className="text-slate-400 text-[10px]">
                    Dispatches SMS immediately when anonymous citizen or observer reports are logged.
                  </span>
                </div>
              </label>

              {/* Trigger 2: Drift Trajectory Anomalies */}
              <label className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-start space-x-2.5 cursor-pointer hover:bg-slate-900">
                <input 
                  type="checkbox" 
                  checked={alertOnDriftDeviation}
                  onChange={(e) => setAlertOnDriftDeviation(e.target.checked)}
                  className="mt-0.5 accent-teal-500 w-4 h-4"
                />
                <div>
                  <span className="text-white font-bold block">Current Drift & Trajectory Warning</span>
                  <span className="text-slate-400 text-[10px]">
                    Alerts if buoy drift exceeds 3.5 knots or trajectory intersects maritime shipping routes.
                  </span>
                </div>
              </label>

              {/* Trigger 3: Tsunami / Acoustic Shockwave */}
              <label className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-start space-x-2.5 cursor-pointer hover:bg-slate-900">
                <input 
                  type="checkbox" 
                  checked={alertOnTsunamiWatch}
                  onChange={(e) => setAlertOnTsunamiWatch(e.target.checked)}
                  className="mt-0.5 accent-teal-500 w-4 h-4"
                />
                <div>
                  <span className="text-rose-300 font-bold block">NOAA DART Tsunami Watch</span>
                  <span className="text-slate-400 text-[10px]">
                    Urgent SMS on anomalous sea floor pressure change & atmospheric acoustic waves.
                  </span>
                </div>
              </label>

              {/* Trigger 4: Salinity & Plume Spike */}
              <label className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-start space-x-2.5 cursor-pointer hover:bg-slate-900">
                <input 
                  type="checkbox" 
                  checked={alertOnSalinitySpike}
                  onChange={(e) => setAlertOnSalinitySpike(e.target.checked)}
                  className="mt-0.5 accent-teal-500 w-4 h-4"
                />
                <div>
                  <span className="text-cyan-300 font-bold block">Hyper-Saline Plume Discharge</span>
                  <span className="text-slate-400 text-[10px]">
                    Confirmation when subsea downwelling pumps achieve &gt; 40 PSU thermohaline flux.
                  </span>
                </div>
              </label>

            </div>
          </div>

          {/* SECTION 3: SUBMIT ANONYMOUS FIELD REPORT / MARITIME INTEL */}
          <div className="p-4 bg-slate-950 rounded-xl border border-sky-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-sky-300 uppercase flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <span>Submit / Simulate Anonymous Maritime Information:</span>
              </h4>
              <span className="text-[10px] text-slate-400">
                Triggers SMS directly to {phoneNumber}
              </span>
            </div>

            <form onSubmit={handleSubmitAnonymousIntel} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">INTEL CATEGORY:</label>
                  <select
                    value={intelCategory}
                    onChange={(e) => setIntelCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-teal-500"
                  >
                    <option value="Unidentified Vessel / Collision Risk">Unidentified Vessel Near Buoy</option>
                    <option value="Severe Oceanic Drift Shear">Severe Oceanic Drift Shear</option>
                    <option value="Surface Oil / Thermal Sheen Sighting">Surface Oil / Thermal Sheen Sighting</option>
                    <option value="Acoustic Shockwave / Marine Seismic">Acoustic Shockwave / Marine Seismic</option>
                    <option value="Mooring Cable Integrity Warning">Mooring Cable Integrity Warning</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">NEARBY OCEAN BOY:</label>
                  <select
                    value={intelBuoyTarget}
                    onChange={(e) => setIntelBuoyTarget(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-teal-500"
                  >
                    <option value="Ocean Boy #1 - Hauraki Sentinel">Ocean Boy #1 (Hauraki Sentinel)</option>
                    <option value="Ocean Boy #2 - Campbell Plateau">Ocean Boy #2 (Campbell Plateau)</option>
                    <option value="Ocean Boy #3 - North Cape Deep Diver">Ocean Boy #3 (North Cape)</option>
                    <option value="Ocean Boy #4 - Kermadec Abyssal">Ocean Boy #4 (Kermadec Trench)</option>
                    <option value="Ocean Boy #5 - Cook Strait Rip">Ocean Boy #5 (Cook Strait)</option>
                    <option value="Ocean Boy #7 - Ross Sea Cryo">Ocean Boy #7 (Ross Sea Antarctica)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">SEVERITY LEVEL:</label>
                  <select
                    value={intelSeverity}
                    onChange={(e) => setIntelSeverity(e.target.value as 'URGENT' | 'HIGH' | 'INFO')}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-teal-500"
                  >
                    <option value="URGENT">🔴 URGENT (Immediate SMS Flash)</option>
                    <option value="HIGH">🟡 HIGH Priority</option>
                    <option value="INFO">🔵 INFO / Routine Log</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">ANONYMOUS OBSERVATION DETAILS:</label>
                <textarea
                  rows={2}
                  value={intelMessage}
                  onChange={(e) => setIntelMessage(e.target.value)}
                  placeholder="e.g. Unflagged longline trawler observed crossing 400m from SaliBuoy Alpha coordinates. Strong current drift detected eastward."
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  Transmitted anonymously with zero identity logging.
                </span>

                <button
                  type="submit"
                  disabled={isSubmittingIntel || !intelMessage.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white rounded-xl font-bold transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingIntel ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-white" />}
                  <span>{isSubmittingIntel ? 'DISPATCHING SMS ALERT...' : 'DISPATCH ANONYMOUS INTEL SMS'}</span>
                </button>
              </div>

              {intelSubmitSuccess && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-600 rounded-xl text-emerald-300 flex items-center space-x-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>
                    Anonymous information logged! SMS text alert successfully dispatched to <strong>{phoneNumber}</strong>!
                  </span>
                </div>
              )}
            </form>
          </div>

          {/* SECTION 4: DISPATCHED SMS ALERTS AUDIT LOG */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-400" />
                <span>Dispatched SMS Notification Audit Trail:</span>
              </span>
              <span className="text-[10px] text-slate-500">
                {dispatchedLogs.length} Messages Dispatched
              </span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {dispatchedLogs.map(log => (
                <div 
                  key={log.id}
                  className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-500">[{log.timestamp}]</span>
                      <span className={`px-1.5 py-0.2 rounded font-bold ${
                        log.severity === 'URGENT' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        log.severity === 'HIGH' ? 'bg-yellow-950 text-yellow-300 border border-yellow-800' :
                        'bg-sky-950 text-sky-300 border border-sky-800'
                      }`}>
                        {log.severity}
                      </span>
                      <span className="text-teal-400 font-bold">{log.sender}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>{log.smsDispatchStatus}</span>
                      <span className="text-slate-400">({log.recipientPhone})</span>
                    </div>
                  </div>

                  <p className="text-slate-300 font-sans text-xs">
                    {log.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

function SaveIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}
