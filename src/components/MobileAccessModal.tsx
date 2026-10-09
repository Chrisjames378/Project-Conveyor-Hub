import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  Smartphone, 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertTriangle, 
  ShieldCheck, 
  Apple, 
  RefreshCw,
  QrCode,
  Share2
} from 'lucide-react';

export interface MobileAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOppoSimulator?: () => void;
}

export const MobileAccessModal: React.FC<MobileAccessModalProps> = ({ 
  isOpen, 
  onClose,
  onOpenOppoSimulator 
}) => {
  const [selectedDeviceTab, setSelectedDeviceTab] = useState<'oppo' | 'iphone' | 'universal'>('oppo');
  const [copied, setCopied] = useState<boolean>(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // The 100% public, working URL with NO Google authentication or cookie requirement
  const workingPublicUrl = "https://ais-pre-anvaiib6x42jeyxbs5k5ki-205273580701.asia-east1.run.app";
  // The dev URL that fails on mobile due to Google session cookie blocks
  const brokenDevUrl = "https://ais-dev-anvaiib6x42jeyxbs5k5ki-205273580701.asia-east1.run.app";

  useEffect(() => {
    QRCode.toDataURL(workingPublicUrl, {
      width: 240,
      margin: 1.5,
      color: {
        dark: '#0284c7', // Sky blue
        light: '#020617'  // Dark slate background
      }
    }).then(url => {
      setQrCodeDataUrl(url);
    }).catch(err => {
      console.error('Failed to generate QR Code:', err);
    });
  }, [workingPublicUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(workingPublicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Mobile Field Access: Oppo A6x & iPhone</span>
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-teal-950 text-teal-300 border border-teal-800 rounded">
                  OPPO A6X READY (90Hz)
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Optimized for Oppo A6x (6.56&quot; HD+ 90Hz 1612x720) & iOS Safari
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

        {/* Device Mode Switcher Tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 pb-0 bg-slate-950/40 border-b border-slate-800 font-mono text-xs">
          <button
            type="button"
            onClick={() => setSelectedDeviceTab('oppo')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all flex items-center space-x-1.5 cursor-pointer ${
              selectedDeviceTab === 'oppo'
                ? 'border-teal-400 text-teal-300 bg-teal-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4 text-teal-400" />
            <span>Oppo A6x (Android / ColorOS 14)</span>
            <span className="text-[9px] px-1.5 py-0.2 bg-teal-950 text-teal-300 rounded border border-teal-800">90Hz</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedDeviceTab('iphone')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all flex items-center space-x-1.5 cursor-pointer ${
              selectedDeviceTab === 'iphone'
                ? 'border-sky-400 text-sky-300 bg-sky-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Apple className="w-4 h-4 text-slate-300" />
            <span>iPhone (iOS Safari)</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedDeviceTab('universal')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all flex items-center space-x-1.5 cursor-pointer ${
              selectedDeviceTab === 'universal'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Universal QR & Link</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-200">
          
          {/* TAB 1: OPPO A6X */}
          {selectedDeviceTab === 'oppo' && (
            <div className="space-y-4 animate-fade-in font-sans">
              <div className="p-4 bg-teal-950/30 border border-teal-800/60 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-teal-300 font-bold font-mono text-xs uppercase">
                    <Smartphone className="w-4 h-4 text-teal-400" />
                    <span>Oppo A6x Setup & Offshore Field Profile</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    5000 mAh Ultra Battery
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your new <strong>Oppo A6x</strong> features a 6.56-inch HD+ 90Hz (1612 x 720) Sunlight display with 20:9 aspect ratio and ColorOS 14 (Android 14 base). SaliBuoy Systems runs completely standalone with live Ocean Boys telemetry, real-time satellite imagery, and SMS notification alerts.
                </p>
              </div>

              {/* QR and Direct Access for Oppo A6x */}
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                {qrCodeDataUrl ? (
                  <div className="flex-shrink-0 p-2 bg-slate-950 rounded-lg border border-teal-800/60 shadow-md text-center">
                    <img src={qrCodeDataUrl} alt="Oppo A6x QR Code" className="w-32 h-32 rounded" />
                    <span className="block mt-1 text-[10px] font-mono text-teal-400 flex items-center justify-center space-x-1">
                      <QrCode className="w-3 h-3" />
                      <span>Scan with Oppo Camera</span>
                    </span>
                  </div>
                ) : null}

                <div className="flex-1 space-y-3 w-full">
                  <div className="text-xs font-mono font-bold text-teal-400">
                    Direct Public Link for Oppo A6x Chrome / ColorOS:
                  </div>
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded font-mono text-xs text-teal-300 break-all select-all">
                    {workingPublicUrl}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold font-mono transition-colors shadow-sm cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Link Copied!' : 'Copy Link for Oppo A6x'}</span>
                    </button>
                    {onOpenOppoSimulator && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenOppoSimulator();
                        }}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-700/60 rounded-lg text-xs font-semibold font-mono transition-colors cursor-pointer"
                      >
                        <Smartphone className="w-3.5 h-3.5 text-teal-400" />
                        <span>Open Oppo A6x Simulator</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 3 Step Guide for Oppo A6x */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
                  <div className="text-xs font-bold text-teal-400 font-mono">1. Open in Chrome</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    Scan the QR above using the Oppo Camera or Google Lens, or paste the link directly into Chrome for Android.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
                  <div className="text-xs font-bold text-emerald-400 font-mono">2. Add to Home Screen</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    Tap the 3 dots in Chrome &rarr; <strong>&quot;Install app&quot;</strong>. The app launches full-screen on your 90Hz 1612x720 display like a native Android app!
                  </p>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
                  <div className="text-xs font-bold text-amber-400 font-mono">3. Allow Background Sync</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    In Oppo Settings &rarr; Battery &rarr; Chrome &rarr; select <strong>&quot;Allow Background Running&quot;</strong> to keep live buoy telemetry pings alive.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IPHONE & SAFARI 401 */}
          {selectedDeviceTab === 'iphone' && (
            <div className="space-y-6 animate-fade-in">
              {/* Why the 401 / Malformed Error happens on iPhone */}
              <div className="p-4 bg-amber-950/25 border border-amber-800/40 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-amber-300 font-semibold text-xs uppercase tracking-wider font-mono">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Why you get 401 &quot;Malformed Request. That’s all we know.&quot; on iPhone</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Google Cloud Run uses two separate URLs. When you tap the <strong>Development URL</strong> (<code className="text-rose-300 bg-slate-950 px-1 py-0.5 rounded text-[11px]">ais-dev-...</code>) on an iPhone, iOS Safari&apos;s default <strong>Prevent Cross-Site Tracking</strong> and <strong>iCloud Private Relay</strong> block internal session cookies. Using the public shared link resolves this 100%.
                </p>
              </div>

              {/* Solution: Use Public Shared App URL */}
              <div className="p-4 bg-sky-950/30 border border-sky-800/50 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-emerald-400 font-mono font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>THE WORKING IPHONE LINK (100% Public • No Login Required)</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Works in Safari & Chrome</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950 p-4 rounded-lg border border-slate-800">
                  {/* QR Code */}
                  {qrCodeDataUrl ? (
                    <div className="flex-shrink-0 p-2 bg-slate-950 rounded-lg border border-sky-800/50 shadow-md text-center">
                      <img src={qrCodeDataUrl} alt="iPhone QR Code" className="w-32 h-32 rounded" />
                      <span className="block mt-1 text-[10px] font-mono text-sky-400 flex items-center justify-center space-x-1">
                        <QrCode className="w-3 h-3" />
                        <span>Scan with iPhone Camera</span>
                      </span>
                    </div>
                  ) : (
                    <div className="w-32 h-32 flex items-center justify-center bg-slate-900 rounded text-xs text-slate-500">
                      Generating QR...
                    </div>
                  )}

                  {/* URL & Action buttons */}
                  <div className="flex-1 space-y-3 w-full">
                    <div className="p-2.5 bg-slate-900 border border-slate-800 rounded font-mono text-xs text-sky-300 break-all select-all">
                      {workingPublicUrl}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold font-mono transition-colors shadow-sm cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Working Link'}</span>
                      </button>
                      <a
                        href={workingPublicUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition-colors border border-slate-700 cursor-pointer"
                      >
                        <span>Open Public URL</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Steps for iPhone */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                  <Apple className="w-4 h-4 text-slate-300" />
                  <span>3 Ways to Open Immediately on Your iPhone</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
                    <div className="text-xs font-bold text-sky-400 font-mono">Method 1: Scan QR</div>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      Open your iPhone Camera app, point it at the QR code above, and tap the yellow link banner to launch directly.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
                    <div className="text-xs font-bold text-teal-400 font-mono">Method 2: Share / Message</div>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      Click &quot;Copy Working Link&quot; above and send it to your iPhone via iMessage, WhatsApp, or AirDrop.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
                    <div className="text-xs font-bold text-emerald-400 font-mono">Method 3: Add to Home Screen</div>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      Once open in iPhone Safari, tap the <strong>Share</strong> button (box with arrow) &rarr; <strong>Add to Home Screen</strong> to run as a full screen app!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: UNIVERSAL ACCESS */}
          {selectedDeviceTab === 'universal' && (
            <div className="space-y-4 animate-fade-in font-mono text-xs">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <span className="font-bold text-emerald-400 text-xs block">
                  UNIVERSAL ZERO-AUTH CLOUD RUN ACCESS
                </span>
                <p className="text-slate-300 text-xs font-sans leading-relaxed">
                  Anyone on Android (Oppo, Samsung, Pixel), iOS (iPhone, iPad), or desktop can access the platform instantly through this direct link with zero Google sign-in required:
                </p>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded text-sky-300 select-all break-all">
                  {workingPublicUrl}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center space-x-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                  <a
                    href={workingPublicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center space-x-1.5 cursor-pointer"
                  >
                    <span>Open in New Tab</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* If Safari Cached the Malformed Redirect */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-2 text-xs">
            <span className="font-bold text-slate-300 font-mono flex items-center space-x-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
              <span>If your iPhone Safari still shows the cached 401 error:</span>
            </span>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
              <li>
                Open the link in a <strong>Private Tab</strong> in Safari (this bypasses cached malformed cookies).
              </li>
              <li>
                Or clear the stale cookie: On iPhone, go to <strong>Settings &rarr; Safari &rarr; Advanced &rarr; Website Data &rarr; Search &quot;run.app&quot; &rarr; Delete</strong>.
              </li>
            </ul>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">
            SaliBuoy Systems • iOS & Mobile Optimization
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
