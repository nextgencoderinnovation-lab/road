import React, { useState } from 'react';
import { ASSETS } from '../data/mockData';
import { TabType, RepairItem } from '../types';

interface ReportScreenProps {
  onNavigate: (tab: TabType) => void;
  onAddNewReport?: (report: RepairItem) => void;
}

export const ReportScreen: React.FC<ReportScreenProps> = ({ onNavigate, onAddNewReport }) => {
  const [meshMode, setMeshMode] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);
  const [notes, setNotes] = useState(
    'Sharp asphalt edge with exposed subsurface stones; observed two outbound cyclists swerve abruptly into the oncoming traffic lane.'
  );

  const [activeModifiers, setActiveModifiers] = useState<Record<string, boolean>>({
    'High Traffic Route': true,
    'Near School Zone': true,
    'Water Pooling Risk': false,
    'Bus Lane': false,
  });

  const toggleModifier = (key: string) => {
    setActiveModifiers(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = () => {
    if (isDispatched) {
      onNavigate('tracked-repairs');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsDispatched(true);
      if (onAddNewReport) {
        onAddNewReport({
          id: String(Date.now()),
          ticketNumber: 'RP-88492',
          streetName: '742 Evergreen Blvd',
          title: 'Critical Hazard • Pothole CL-4 (8.4cm Depth)',
          status: 'active',
          statusLabel: 'Crew Dispatched',
          statusType: 'dispatched',
          stepIndex: 4,
          totalSteps: 5,
          unitAssigned: 'Unit 4B',
          vehicleType: 'Rapid Patch Truck',
          eta: '1 hr 45 mins',
          coordinates: '42.3736° N, 71.1097° W',
          imageUrl: ASSETS.reportDamagePhoto,
        });
      }
    }, 900);
  };

  return (
    <div className="flex flex-col w-full px-gutter-mobile space-y-space-md max-w-lg mx-auto pb-32">
      {/* Telemetry Sub-header Strip */}
      <div className="flex items-center justify-between py-space-2xs">
        <div className="flex items-center gap-space-2xs">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-ping" />
          <span className="font-telemetry-mono text-telemetry-mono text-primary-fixed-dim uppercase tracking-wider">
            TICKET #RP-88492-DPW
          </span>
        </div>
        <div className="flex items-center gap-space-2xs bg-surface-container-high px-space-xs py-0.5 rounded-DEFAULT border border-surface-variant/40">
          <span className="material-symbols-outlined text-[14px] text-secondary">verified_user</span>
          <span className="font-label-sm text-label-sm text-secondary uppercase font-bold">
            CityScan v4.2 Certified
          </span>
        </div>
      </div>

      {/* Hero Damage Visual Card with Depth Topology Overlay */}
      <div className="relative w-full rounded-xl bg-surface-container-low overflow-hidden shadow-xl border border-surface-variant/40">
        {/* Base Capture Image */}
        <div className="relative h-56 w-full overflow-hidden">
          <img 
            alt="Asphalt roadway surface with severe deep pothole"
            className={`w-full h-full object-cover transition-all duration-500 ${
              meshMode ? 'brightness-110 contrast-110' : ''
            }`}
            src={ASSETS.reportDamagePhoto}
          />

          {/* Simulated Heat-Depth Gradient Topology Map Overlay */}
          {meshMode && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-error/25 to-transparent mix-blend-color-dodge pointer-events-none opacity-85" />
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 via-transparent to-primary/25 pointer-events-none" />
              {/* Wireframe Mesh Lines overlay */}
              <div className="absolute inset-0 opacity-30 pointer-events-none">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M 0,20 Q 50,35 100,20 M 0,40 Q 50,55 100,40 M 0,60 Q 50,75 100,60 M 0,80 Q 50,95 100,80" stroke="#4edea3" strokeWidth="0.4" fill="none" />
                  <path d="M 20,0 Q 35,50 20,100 M 40,0 Q 55,50 40,100 M 60,0 Q 75,50 60,100 M 80,0 Q 95,50 80,100" stroke="#f59e0b" strokeWidth="0.4" fill="none" />
                </svg>
              </div>
            </>
          )}

          {/* AR Reticles & Heatmap Scale Bar */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-DEFAULT bg-surface-container-lowest/90 backdrop-blur-md border border-surface-variant/40">
              <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
              <span className="font-telemetry-mono text-[11px] text-on-surface font-semibold">
                DEPTH CONTOUR: 8.4cm
              </span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-DEFAULT bg-surface-container-lowest/80 backdrop-blur-sm border border-surface-variant/40">
              <span className="font-label-sm text-label-sm text-primary">Δz σ=0.18mm</span>
            </div>
          </div>

          {/* Real-time HUD Target Ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
            <div className="w-28 h-20 rounded-lg shadow-[0_0_16px_rgba(245,158,11,0.5)] flex items-center justify-center relative border border-primary/60">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-3 h-3 bg-primary rounded-tl-sm" />
              <div className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-tr-sm" />
              <div className="absolute bottom-0 left-0 w-3 h-3 bg-primary rounded-bl-sm" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-br-sm" />
              <span className="font-telemetry-mono text-[10px] text-on-primary-fixed bg-primary px-1 rounded-DEFAULT font-bold shadow-sm">
                ANOMALY DETECTED
              </span>
            </div>
          </div>

          {/* Dynamic Topology Toggle Button */}
          <button 
            onClick={() => setMeshMode(!meshMode)}
            className={`absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high/90 backdrop-blur-md text-label-sm font-label-sm active:scale-95 transition-all shadow-md border border-surface-variant/40 ${
              meshMode ? 'text-primary border-primary/50' : 'text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">layers</span>
            <span>{meshMode ? 'LiDAR Scan Mesh' : 'Standard View'}</span>
          </button>
        </div>

        {/* Cross Section Depth Profile Graph */}
        <div className="p-space-sm bg-surface-container flex flex-col gap-1.5 border-t border-surface-variant/40">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-outline">show_chart</span>
              Transect Depth Profile (X-Axis 65cm)
            </span>
            <span className="font-telemetry-mono text-[11px] text-error font-bold">Max -8.4 cm</span>
          </div>

          {/* Inline SVG Cross-Section Graph */}
          <div className="w-full h-12 bg-surface-container-lowest rounded-DEFAULT p-1 flex items-end relative overflow-hidden border border-surface-variant/30">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 300 40">
              <defs>
                <linearGradient id="depthGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.7" />
                  <stop offset="60%" stopColor="#ff9198" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#93000a" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              {/* Surface Datum Reference Line */}
              <line stroke="#534434" strokeDasharray="2 2" strokeWidth="1" x1="0" x2="300" y1="4" y2="4" />
              {/* Road Anomaly Cavity Polygon */}
              <path 
                d="M 0,4 Q 30,4 60,6 C 85,7 95,28 135,36 C 165,39 190,34 220,18 C 240,8 270,4 300,4 L 300,40 L 0,40 Z" 
                fill="url(#depthGradient)" 
              />
              <path 
                d="M 0,4 Q 30,4 60,6 C 85,7 95,28 135,36 C 165,39 190,34 220,18 C 240,8 270,4 300,4" 
                fill="none" 
                stroke="#ffb95f" 
                strokeWidth="2" 
              />
            </svg>
            <span className="absolute bottom-1 right-2 font-telemetry-mono text-[9px] text-on-surface-variant">
              Datum Level 0.0
            </span>
          </div>
        </div>
      </div>

      {/* AI Verification Badge Banner */}
      <div className="flex items-center gap-space-xs p-space-sm rounded-lg bg-surface-container-high border border-surface-variant/40">
        <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            gavel
          </span>
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-headline-sm text-label-lg text-on-surface font-bold truncate">
              Municipal Grade A1 Verified
            </span>
            <span className="px-1 py-0.2 rounded-DEFAULT bg-secondary/15 text-secondary font-label-sm text-[9px] font-bold">
              PASS
            </span>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
            Calibrated via CityScan v4.2 Edge Neural Engine
          </span>
        </div>
      </div>

      {/* Telemetry Metrics 2x2 Grid */}
      <div className="grid grid-cols-2 gap-space-xs w-full">
        {/* Metric 1: Depth */}
        <div className="p-space-sm rounded-lg bg-surface-container flex flex-col justify-between shadow-sm relative overflow-hidden border border-surface-variant/30">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-sm text-label-sm uppercase">Estimated Depth</span>
            <span className="material-symbols-outlined text-[16px] text-error">vertical_align_bottom</span>
          </div>
          <div className="mt-2">
            <div className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
              8.4 <span className="text-label-md font-normal text-on-surface-variant">cm</span>
            </div>
            <span className="font-label-sm text-label-sm text-error font-medium flex items-center gap-0.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-error" />
              Rim Damage Risk
            </span>
          </div>
        </div>

        {/* Metric 2: Surface Area */}
        <div className="p-space-sm rounded-lg bg-surface-container flex flex-col justify-between shadow-sm border border-surface-variant/30">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-sm text-label-sm uppercase">Surface Area</span>
            <span className="material-symbols-outlined text-[16px] text-primary">straighten</span>
          </div>
          <div className="mt-2">
            <div className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
              0.34 <span className="text-label-md font-normal text-on-surface-variant">m²</span>
            </div>
            <span className="font-label-sm text-label-sm text-primary-fixed-dim font-medium mt-0.5 block">
              Elliptical Cavity
            </span>
          </div>
        </div>

        {/* Metric 3: Severity */}
        <div className="p-space-sm rounded-lg bg-surface-container flex flex-col justify-between shadow-sm border border-surface-variant/30">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-sm text-label-sm uppercase">Severity Index</span>
            <span className="material-symbols-outlined text-[16px] text-error">warning</span>
          </div>
          <div className="mt-2">
            <div className="font-headline-md text-headline-md text-error font-bold tracking-tight">
              9.2<span className="text-label-md font-normal text-on-surface-variant">/10</span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium mt-0.5 block">
              Tier 1 Intervention
            </span>
          </div>
        </div>

        {/* Metric 4: Vehicle Threat */}
        <div className="p-space-sm rounded-lg bg-surface-container flex flex-col justify-between shadow-sm border border-surface-variant/30">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-sm text-label-sm uppercase">Vehicle Threat</span>
            <span className="material-symbols-outlined text-[16px] text-primary-container">two_wheeler</span>
          </div>
          <div className="mt-2">
            <div className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
              High
            </div>
            <span className="font-label-sm text-label-sm text-primary-fixed-dim font-medium mt-0.5 block truncate">
              Cycle & Moto Hazard
            </span>
          </div>
        </div>
      </div>

      {/* Auto-populated Municipal Routing Data */}
      <div className="w-full rounded-xl bg-surface-container p-space-md space-y-space-sm shadow-md border border-surface-variant/30">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md uppercase tracking-wider text-primary font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">account_balance</span>
            Municipal Dispatch Registry
          </span>
          <span className="font-telemetry-mono text-label-sm text-secondary font-bold">AUTO-ROUTE OK</span>
        </div>

        <div className="space-y-space-xs">
          <div className="flex items-start gap-space-xs p-space-xs rounded-lg bg-surface-container-high border border-surface-variant/30">
            <span className="material-symbols-outlined text-[20px] text-outline mt-0.5">pin_drop</span>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Reported Geo-Coordinates</span>
              <span className="font-body-md text-body-md text-on-surface font-semibold truncate">
                742 Evergreen Blvd, Cambridge, MA
              </span>
              <span className="font-telemetry-mono text-[10px] text-outline">
                42.3736° N, 71.1097° W • Elevation 11m
              </span>
            </div>
          </div>

          <div className="flex items-start gap-space-xs p-space-xs rounded-lg bg-surface-container-high border border-surface-variant/30">
            <span className="material-symbols-outlined text-[20px] text-outline mt-0.5">domain</span>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Designated Agency</span>
              <span className="font-body-md text-body-md text-on-surface font-semibold truncate">
                Dept. of Public Works - Highway Division
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                District 4 Rapid Response Unit
              </span>
            </div>
          </div>

          {/* SLA Action Box */}
          <div className="flex items-center justify-between p-space-sm rounded-lg bg-error-container text-on-error-container shadow-sm">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[20px]">timelapse</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider">
                  Mandatory SLA Policy
                </span>
                <span className="font-body-sm text-body-sm font-semibold">
                  Priority 1 • 24h Emergency Cold-Patch
                </span>
              </div>
            </div>
            <span className="font-headline-sm text-headline-sm font-bold">24H</span>
          </div>
        </div>
      </div>

      {/* Editable Contextual Quick Tags */}
      <div className="w-full space-y-space-xs">
        <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider flex items-center justify-between">
          <span>Contextual Risk Modifiers</span>
          <span className="font-label-sm text-label-sm text-outline">Tap to toggle</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeModifiers).map(([tag, isActive]) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleModifier(tag)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full font-label-md text-label-md font-semibold transition-all active:scale-95 ${
                isActive 
                  ? 'bg-primary-container text-on-primary-container shadow-sm' 
                  : 'bg-surface-container text-on-surface-variant border border-surface-variant/30'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {tag.includes('Traffic') ? 'traffic' : tag.includes('School') ? 'school' : tag.includes('Water') ? 'water_drop' : 'directions_bus'}
              </span>
              <span>{tag}</span>
              <span className="material-symbols-outlined text-[14px]">
                {isActive ? 'check' : 'add'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Voice & Text Field for Citizen Field Notes */}
      <div className="w-full space-y-space-xs">
        <div className="flex items-center justify-between">
          <label 
            htmlFor="citizen-notes" 
            className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[15px]">record_voice_over</span>
            Field Inspector Observation
          </label>
          <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">mic</span> Audio Transcribed
          </span>
        </div>

        <div className="relative w-full">
          <textarea
            id="citizen-notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add specific hazards, cross streets, or severity details..."
            className="w-full rounded-lg bg-surface-container-lowest p-space-sm text-on-surface font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary placeholder-outline resize-none shadow-inner border border-surface-variant/40"
          />
          <button
            type="button"
            onClick={() => setIsRecording(!isRecording)}
            className={`absolute right-2.5 bottom-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isRecording 
                ? 'bg-error text-on-error animate-pulse' 
                : 'bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">mic</span>
          </button>
        </div>
      </div>

      {/* Municipal Submission Legal Notice */}
      <div className="flex items-center gap-space-xs p-space-xs rounded-DEFAULT bg-surface-container-low text-on-surface-variant text-label-sm font-label-sm border border-surface-variant/30">
        <span className="material-symbols-outlined text-[16px] text-outline shrink-0">encrypted</span>
        <p className="leading-tight">
          Cryptographically signed with device hardware key for municipal evidentiary compliance.
        </p>
      </div>

      {/* Sticky Floating Action Panel */}
      <div className="fixed bottom-16 inset-x-0 z-40 px-gutter-mobile py-space-xs bg-surface/90 backdrop-blur-xl shadow-2xl flex flex-col gap-2 max-w-lg mx-auto border-t border-surface-variant/30">
        <div className="flex items-center gap-space-xs">
          {/* Secondary Action: Re-scan */}
          <button 
            type="button"
            onClick={() => onNavigate('scan-&-detect')}
            className="h-12 px-4 rounded-xl bg-surface-container-high text-on-surface font-label-lg text-label-lg font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform shrink-0 border border-surface-variant/40"
          >
            <span className="material-symbols-outlined text-[20px]">replay</span>
            <span>Re-scan</span>
          </button>

          {/* Primary Action: Submit Official Dispatch */}
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`flex-1 h-12 px-space-md rounded-xl font-headline-sm text-headline-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(245,158,11,0.35)] active:translate-y-0.5 transition-all ${
              isDispatched 
                ? 'bg-secondary-container text-on-secondary-container' 
                : 'bg-primary-container text-on-primary-fixed hover:brightness-110'
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                <span className="truncate">Transmitting to DPW...</span>
              </>
            ) : isDispatched ? (
              <>
                <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <span className="truncate">Dispatched (View in Repairs)</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  send
                </span>
                <span className="truncate">Submit to DPW</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
