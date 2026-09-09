import React, { useState, useEffect } from 'react';
import { ASSETS } from '../data/mockData';
import { TabType } from '../types';

interface ScanScreenProps {
  onNavigate: (tab: TabType) => void;
}

export const ScanScreen: React.FC<ScanScreenProps> = ({ onNavigate }) => {
  const [gridActive, setGridActive] = useState(true);
  const [flashActive, setFlashActive] = useState(false);
  const [pitch, setPitch] = useState(-1.2);
  const [roll, setRoll] = useState(0.4);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [burstMode, setBurstMode] = useState<'1X' | '3X' | '5X'>('3X');
  const [showTagDrawer, setShowTagDrawer] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('Pothole');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic gyro fluctuation simulating vehicle suspension
  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      setPitch(Number((-1.2 + Math.sin(frame * 0.25) * 0.4).toFixed(1)));
      setRoll(Number((0.4 + Math.cos(frame * 0.2) * 0.3).toFixed(1)));
    }, 350);
    return () => clearInterval(interval);
  }, []);

  const handleCapture = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      onNavigate('confirm-&-report');
    }, 850);
  };

  const toggleBurst = () => {
    const modes: ('1X' | '3X' | '5X')[] = ['1X', '3X', '5X'];
    const nextIdx = (modes.indexOf(burstMode) + 1) % modes.length;
    setBurstMode(modes[nextIdx]);
    setToastMessage(`Burst capture: ${modes[nextIdx]}`);
    setTimeout(() => setToastMessage(null), 1500);
  };

  return (
    <div className="flex flex-col w-full relative select-none">
      {/* CAMERA VIEWPORT SIMULATION CONTAINER */}
      <div 
        className="relative w-full overflow-hidden bg-surface-container-lowest" 
        style={{ height: 'calc(100vh - 8rem)', minHeight: '580px' }}
      >
        {/* Realistic Asphalt Road Feed Base */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-300"
          style={{ 
            backgroundImage: `url('${ASSETS.cameraRoadFeed}')`,
            filter: flashActive ? 'brightness(1.28) contrast(1.08)' : 'none'
          }}
        />

        {/* Flashlight beam simulator */}
        {flashActive && (
          <div className="absolute inset-0 bg-radial from-amber-100/25 via-transparent to-transparent pointer-events-none" />
        )}

        {/* HUD Scrim Overlays for Industrial Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest/90 via-transparent to-surface-container-lowest/95 pointer-events-none" />

        {/* Perspective Grid / Virtual Ground Plane Visualizer */}
        <div 
          className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
            gridActive ? 'opacity-40' : 'opacity-0'
          }`}
          id="ar-grid-layer"
        >
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gridGrad" x1="0%" x2="0%" y1="100%" y2="30%">
                <stop offset="0%" stopColor="#4edea3" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#4edea3" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Horizon Reference Line */}
            <line opacity="0.4" stroke="#a08e7a" strokeDasharray="4 4" strokeWidth="0.75" x1="20" x2="380" y1="210" y2="210" />
            {/* Perspective Lines radiating to focal vanishing point */}
            <path d="M 0 540 L 170 210 M 80 560 L 185 210 M 200 580 L 200 210 M 320 560 L 215 210 M 400 540 L 230 210" stroke="url(#gridGrad)" strokeWidth="0.75" />
            {/* Transverse Distance Rings */}
            <path d="M 40 480 Q 200 450 360 480" opacity="0.3" stroke="#4edea3" strokeDasharray="2 3" strokeWidth="0.75" />
            <path d="M 80 400 Q 200 380 320 400" opacity="0.25" stroke="#4edea3" strokeDasharray="2 3" strokeWidth="0.75" />
            <path d="M 120 320 Q 200 310 280 320" opacity="0.2" stroke="#4edea3" strokeDasharray="2 3" strokeWidth="0.75" />
          </svg>
        </div>

        {/* TOP HUD UTILITY DOCK & SENSOR METRICS (Floating) */}
        <div className="absolute top-0 inset-x-0 p-space-sm flex flex-col gap-space-xs z-20 max-w-lg mx-auto">
          {/* Quick Toggles Toolbar */}
          <div className="flex items-center justify-between gap-space-xs">
            {/* Gyro Pitch/Roll Horizon Capsule */}
            <div className="flex items-center gap-space-2xs px-space-xs py-1 rounded-full bg-surface-container-high/90 backdrop-blur-md shadow-md border border-surface-variant/40">
              <span className="material-symbols-outlined text-[15px] text-secondary">explore</span>
              <span className="font-telemetry-mono text-telemetry-mono text-secondary font-bold">
                P: {pitch > 0 ? '+' : ''}{pitch}° • R: {roll > 0 ? '+' : ''}{roll}°
              </span>
            </div>

            {/* Sensor Controls */}
            <div className="flex items-center gap-space-2xs">
              {/* AR Grid Toggle Button */}
              <button 
                onClick={() => setGridActive(!gridActive)}
                aria-label="Toggle AR Grid"
                className={`h-9 w-9 rounded-full bg-surface-container-high/90 backdrop-blur-md flex items-center justify-center border border-surface-variant/40 active:scale-95 transition-all shadow-sm ${
                  gridActive ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">grid_4x4</span>
              </button>

              {/* Flash Torch Toggle Button */}
              <button 
                onClick={() => setFlashActive(!flashActive)}
                aria-label="Toggle Flashlight"
                className={`h-9 w-9 rounded-full bg-surface-container-high/90 backdrop-blur-md flex items-center justify-center border border-surface-variant/40 active:scale-95 transition-all shadow-sm ${
                  flashActive ? 'text-primary bg-primary-container/20' : 'text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {flashActive ? 'flash_on' : 'flash_off'}
                </span>
              </button>

              {/* AI Diagnostic Mode Switch */}
              <div className="flex items-center gap-1 px-space-xs py-1 rounded-full bg-surface-container-high/90 backdrop-blur-md border border-surface-variant/40">
                <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                  LIVE ML 60FPS
                </span>
              </div>
            </div>
          </div>

          {/* Live GPS & Environmental Context Strip */}
          <div className="flex items-center justify-between gap-space-xs px-space-sm py-1.5 rounded-lg bg-surface-container-low/85 backdrop-blur-md shadow-sm border border-surface-variant/40">
            <div className="flex items-center gap-space-2xs min-w-0">
              <span className="material-symbols-outlined text-[16px] text-primary-container shrink-0">pin_drop</span>
              <span className="font-label-md text-label-md text-on-surface truncate font-medium">
                742 Evergreen Blvd, Ward 4
              </span>
              <span className="font-telemetry-mono text-[10px] px-1 py-0.2 rounded-DEFAULT bg-secondary-container/20 text-secondary shrink-0 font-bold">
                RTK LOCK
              </span>
            </div>
            <div className="flex items-center gap-space-2xs shrink-0 font-telemetry-mono text-[11px] text-on-surface-variant">
              <span className="material-symbols-outlined text-[14px] text-primary">wb_sunny</span>
              <span>840 Lux • Dry</span>
            </div>
          </div>
        </div>

        {/* CENTER RETICLE & TARGET SCOPE VIEW */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-8 h-8 relative opacity-60">
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-primary/60" />
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-primary/60" />
            <div className="absolute inset-1 rounded-full border border-primary/40" />
          </div>
        </div>

        {/* DYNAMIC AR BOUNDING BOX 1: CRITICAL POTHOLE (PRIMARY HAZARD) */}
        <div 
          onClick={() => onNavigate('confirm-&-report')}
          className="absolute top-[48%] left-[16%] sm:left-[22%] w-[68%] sm:w-[56%] h-[26%] z-10 pointer-events-auto cursor-pointer group transition-transform active:scale-[0.99]"
          title="Click to view full inspection telemetry"
        >
          {/* Bounding Box Frame */}
          <div className="relative w-full h-full rounded-DEFAULT bg-primary-container/10 shadow-[0_0_16px_rgba(245,158,11,0.45)] border border-primary-container/60">
            {/* Corner Precision Reticles */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-primary-container" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-primary-container" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-primary-container" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-primary-container" />

            {/* Crosshair Centering Tag */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-primary-container animate-ping opacity-75" />
              <div className="w-1.5 h-1.5 rounded-full bg-on-primary-fixed absolute" />
            </div>

            {/* Severity Header Badge */}
            <div className="absolute -top-7 left-0 flex items-center gap-space-2xs px-space-xs py-0.5 rounded-DEFAULT bg-error-container text-on-error-container shadow-md">
              <span className="material-symbols-outlined text-[14px]">warning</span>
              <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider">
                CRITICAL HAZARD • POTHOLE CL-4
              </span>
            </div>

            {/* Real-time Confidence Anchor Tag */}
            <div className="absolute -top-7 right-0 px-space-2xs py-0.5 rounded-DEFAULT bg-surface-container-highest/90 backdrop-blur-md text-primary font-telemetry-mono text-[11px] font-bold border border-surface-variant/40">
              99.1% CONF
            </div>

            {/* Dimension & Depth Telemetry Underlay */}
            <div className="absolute -bottom-7 inset-x-0 flex items-center justify-between px-space-xs py-0.5 rounded-DEFAULT bg-surface-container-highest/95 backdrop-blur-md text-on-surface shadow-md border border-surface-variant/40">
              <div className="flex items-center gap-1 font-telemetry-mono text-[11px]">
                <span className="text-primary font-bold">DEPTH:</span>
                <span className="text-on-background">8.4 cm</span>
              </div>
              <div className="h-2.5 w-[1px] bg-outline-variant" />
              <div className="flex items-center gap-1 font-telemetry-mono text-[11px]">
                <span className="text-primary font-bold">SPAN:</span>
                <span className="text-on-background">46 cm</span>
              </div>
              <div className="h-2.5 w-[1px] bg-outline-variant" />
              <div className="flex items-center gap-1 font-telemetry-mono text-[11px]">
                <span className="text-error font-bold">TIRE THREAT</span>
              </div>
            </div>
          </div>
        </div>

        {/* DYNAMIC AR BOUNDING BOX 2: MINOR ROAD SURFACE FISSURE (SECONDARY) */}
        <div className="absolute top-[32%] right-[8%] w-[42%] sm:w-[32%] h-[14%] z-10 pointer-events-auto opacity-85 hover:opacity-100 transition-opacity">
          <div className="relative w-full h-full rounded-DEFAULT bg-surface-container-high/40 shadow-[0_0_10px_rgba(78,222,163,0.25)] border border-secondary/50">
            {/* Reticle corners */}
            <div className="absolute -top-0.5 -left-0.5 w-2 h-2 border-t-2 border-l-2 border-secondary" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 border-t-2 border-r-2 border-secondary" />
            <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 border-b-2 border-l-2 border-secondary" />
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 border-b-2 border-r-2 border-secondary" />

            {/* Minimal Label */}
            <div className="absolute -top-5 left-0 px-1.5 py-0.2 rounded-DEFAULT bg-surface-container-high/90 text-secondary font-label-sm text-[10px] uppercase font-bold flex items-center gap-1 border border-surface-variant/40">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              SURFACE CRACK • LOW RISK
            </div>
            <div className="absolute -bottom-5 right-0 px-1 py-0.2 rounded-DEFAULT bg-surface-container-high/90 text-on-surface-variant font-telemetry-mono text-[10px] border border-surface-variant/40">
              87.3% • 2.1mm
            </div>
          </div>
        </div>

        {/* REAL-TIME IMPACT SENSOR TELEMETRY CARD (Floating Mid-Left Thumb Sector) */}
        <div className="absolute bottom-28 left-gutter-mobile z-20 max-w-[210px]">
          <div className="flex flex-col gap-1 p-space-xs rounded-xl bg-surface-container-high/90 backdrop-blur-lg shadow-xl border border-surface-variant/50">
            <div className="flex items-center justify-between text-on-surface-variant">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-error">vibration</span>
                <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface">SHOCK TELEMETRY</span>
              </div>
              <span className="font-telemetry-mono text-[10px] text-error font-bold animate-pulse">PEAK</span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-headline-md text-headline-md font-bold text-error leading-none">2.4G</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">at 32 km/h</span>
            </div>
            {/* Tactile mini-waveform SVG */}
            <div className="w-full h-5 mt-1 bg-surface-container-lowest/80 rounded-DEFAULT overflow-hidden flex items-center px-1">
              <svg className="w-full h-4" preserveAspectRatio="none" viewBox="0 0 120 20">
                <path 
                  d="M 0 10 Q 20 10 30 9 L 45 11 L 55 4 L 62 18 L 68 2 L 75 16 L 82 8 L 90 10 L 120 10" 
                  fill="none" 
                  stroke="#ffb4ab" 
                  strokeLinejoin="round" 
                  strokeWidth="1.5" 
                />
              </svg>
            </div>
            <span className="font-label-sm text-[10px] text-on-surface-variant font-medium mt-0.5">
              Suspension deflection threshold triggered
            </span>
          </div>
        </div>

        {/* QUICK VOICE MEMO BADGE (Floating Mid-Right Thumb Sector) */}
        <div className="absolute bottom-28 right-gutter-mobile z-20">
          <button 
            onClick={() => setIsRecordingAudio(!isRecordingAudio)}
            aria-label="Record voice note" 
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-full backdrop-blur-md shadow-lg border border-surface-variant/40 active:scale-95 transition-all ${
              isRecordingAudio 
                ? 'bg-error text-on-error animate-pulse' 
                : 'bg-surface-container-high/90 text-primary hover:bg-surface-bright'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">mic</span>
            <span className="font-label-sm text-[8px] uppercase tracking-tighter text-on-surface-variant mt-0.5">
              {isRecordingAudio ? 'REC' : 'AUDIO'}
            </span>
          </button>
        </div>
      </div>

      {/* FLOATING LOWER ACTION DOCK (Ergonomic Thumb Arc Zone) */}
      <div className="relative w-full bg-surface px-gutter-mobile pt-space-xs pb-space-md flex flex-col gap-space-xs z-30 shadow-[0_-8px_24px_rgba(0,0,0,0.6)] border-t border-surface-variant/30 max-w-lg mx-auto">
        {/* Status Readout Banner */}
        <div className="flex items-center justify-between text-on-surface-variant px-space-2xs">
          <div className="flex items-center gap-space-2xs">
            <span className="material-symbols-outlined text-[15px] text-secondary">verified_user</span>
            <span className="font-label-sm text-label-sm uppercase tracking-wide">
              ISO 9001 Road Telemetry Protocol
            </span>
          </div>
          <div className="flex items-center gap-space-2xs font-telemetry-mono text-[11px] text-primary font-medium">
            <span>BUFF: 4 FRAMES</span>
          </div>
        </div>

        {/* Main Shutter & Trigger Controls Row */}
        <div className="flex items-center justify-between gap-space-md">
          {/* Burst Mode Selector Button */}
          <button 
            onClick={toggleBurst}
            className="flex flex-col items-center justify-center w-16 h-14 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-container active:translate-y-0.5 transition-all shadow-sm border border-surface-variant/40"
          >
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">burst_mode</span>
            <span className="font-label-sm text-[10px] uppercase font-bold text-on-surface-variant mt-0.5">
              {burstMode} BURST
            </span>
          </button>

          {/* PRIMARY FIELD TRIGGER ACTION: CAPTURE & ANALYZE */}
          <button 
            onClick={handleCapture}
            disabled={isAnalyzing}
            className="flex-1 min-h-[54px] rounded-xl bg-primary-container text-on-primary-container hover:brightness-110 active:translate-y-0.5 transition-all flex items-center justify-center gap-space-xs shadow-[0_0_20px_rgba(245,158,11,0.35)] px-space-md font-bold"
          >
            {isAnalyzing ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                <span className="font-headline-sm text-headline-sm font-bold tracking-tight uppercase">
                  PROCESSING HAZARD...
                </span>
              </>
            ) : (
              <>
                <div className="w-3.5 h-3.5 rounded-full bg-on-primary-container animate-pulse" />
                <span className="font-headline-sm text-headline-sm font-bold tracking-tight uppercase">
                  CAPTURE & ANALYZE
                </span>
                <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
              </>
            )}
          </button>

          {/* Inspection Manual Tag Filter */}
          <button 
            onClick={() => setShowTagDrawer(!showTagDrawer)}
            className="flex flex-col items-center justify-center w-16 h-14 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-container active:translate-y-0.5 transition-all shadow-sm border border-surface-variant/40"
          >
            <span className="material-symbols-outlined text-[20px] text-primary">label</span>
            <span className="font-label-sm text-[10px] uppercase font-bold text-on-surface-variant mt-0.5 truncate px-1">
              {selectedTag.toUpperCase()}
            </span>
          </button>
        </div>

        {/* Quick Audio Memo Toast Bar */}
        {isRecordingAudio && (
          <div className="flex w-full items-center justify-between p-space-xs rounded-lg bg-surface-container-highest text-on-surface shadow-md border border-surface-variant/50 animate-fade-in">
            <div className="flex items-center gap-space-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping" />
              <span className="font-label-md text-label-md font-medium text-error">
                Recording voice observation (12s)...
              </span>
            </div>
            <button 
              onClick={() => {
                setIsRecordingAudio(false);
                setToastMessage('Voice memo saved to ticket #RP-88492');
                setTimeout(() => setToastMessage(null), 2500);
              }}
              className="font-label-sm text-label-sm uppercase font-bold text-primary px-space-xs py-1 rounded bg-surface-container hover:bg-surface-bright"
            >
              SAVE MEMO
            </button>
          </div>
        )}

        {/* Tags Selection Drawer */}
        {showTagDrawer && (
          <div className="p-3 bg-surface-container-high rounded-xl border border-surface-variant/50 space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-label-md text-on-surface-variant uppercase">Select Defect Tag</span>
              <button 
                onClick={() => setShowTagDrawer(false)}
                className="text-xs text-primary font-label-sm font-bold"
              >
                DONE
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['Pothole', 'Surface Crack', 'Manhole Rim', 'Heave', 'Joint Void', 'Raveling'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-2.5 py-1 rounded-full text-xs font-label-sm transition-colors ${
                    selectedTag === tag 
                      ? 'bg-primary-container text-on-primary-fixed font-bold shadow-sm' 
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Transient notification toast */}
        {toastMessage && (
          <div className="text-center py-1 font-telemetry-mono text-xs text-secondary animate-fade-in">
            ✓ {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
};
