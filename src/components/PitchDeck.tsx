import React, { useState } from 'react';
import { PitchSlide } from '../types';
import { INITIAL_PITCH_SLIDES } from '../db/localDatabase';
import { exportPitchDeckMarkdown } from '../utils/exportUtils';
import { 
  Presentation, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  Download,
  Share2
} from 'lucide-react';

export const PitchDeck: React.FC = () => {
  const [slides, setSlides] = useState<PitchSlide[]>(INITIAL_PITCH_SLIDES);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [copiedDeck, setCopiedDeck] = useState(false);

  const activeSlide = slides[currentSlideIndex];

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const copyFullDeckText = () => {
    const formatted = slides.map(s => (
      `SLIDE ${s.id}: ${s.title.toUpperCase()}\nSubtitle: ${s.subtitle}\nMetric: ${s.highlightMetric.value} (${s.highlightMetric.label})\nPoints:\n${s.bulletPoints.map(p => `  - ${p}`).join('\n')}\nCallout: ${s.calloutNote}\n----------------------------------------`
    )).join('\n\n');

    navigator.clipboard.writeText(formatted);
    setCopiedDeck(true);
    setTimeout(() => setCopiedDeck(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-purple-400">
              <Presentation className="w-4 h-4" />
              <span>Investor Presentation Outline</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
              NZ DeepTech Venture Capital Pitch Deck
            </h2>
            <p className="text-xs text-slate-400">
              Structured 10-slide presentation engineered for Pacific Channel, Outset Ventures, and Icehouse Climate VC.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={() => exportPitchDeckMarkdown(slides)}
              className="inline-flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-mono cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              <span>Export MD</span>
            </button>

            <button
              onClick={copyFullDeckText}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              {copiedDeck ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedDeck ? 'Copied Full Deck Outline!' : 'Copy Presentation Deck'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slide Navigation Thumbnails */}
      <div className="flex space-x-2 overflow-x-auto no-scrollbar py-1 text-xs">
        {slides.map((s, idx) => {
          const isActive = idx === currentSlideIndex;
          return (
            <button
              key={s.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`px-3.5 py-2 rounded-lg font-mono whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-950/50'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Slide {s.id}
            </button>
          );
        })}
      </div>

      {/* Main Active Slide Display */}
      <div className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl min-h-[420px] flex flex-col justify-between">
        <div className="space-y-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center space-x-2">
              <span className="w-7 h-7 rounded-lg bg-purple-950 text-purple-300 border border-purple-800 flex items-center justify-center font-mono font-bold text-xs">
                {activeSlide.id}
              </span>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                SaliBuoy Systems Deck • Slide {activeSlide.id} of {slides.length}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrev}
                disabled={currentSlideIndex === 0}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentSlideIndex === slides.length - 1}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Slide Title & Metric Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2 space-y-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{activeSlide.title}</h3>
              <p className="text-sm text-purple-300 font-medium leading-relaxed">{activeSlide.subtitle}</p>
            </div>

            <div className="bg-purple-950/40 border border-purple-800/60 p-4 rounded-xl text-center space-y-1">
              <span className="text-[10px] text-purple-300 font-mono uppercase tracking-wider block">
                {activeSlide.highlightMetric.label}
              </span>
              <span className="text-2xl font-black text-white font-mono">
                {activeSlide.highlightMetric.value}
              </span>
            </div>
          </div>

          {/* Bullet Points */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">Key Executive Points</h4>
            <div className="space-y-2.5">
              {activeSlide.bulletPoints.map((pt, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs sm:text-sm text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-purple-950 text-purple-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Callout Note Footer */}
        <div className="p-3.5 bg-slate-950 border border-sky-900/50 rounded-xl flex items-center space-x-3 text-xs text-sky-200">
          <Award className="w-4 h-4 text-sky-400 shrink-0" />
          <span><strong className="text-sky-300 font-mono">Investor Takeaway:</strong> {activeSlide.calloutNote}</span>
        </div>
      </div>
    </div>
  );
};
