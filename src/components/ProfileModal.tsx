import React from 'react';
import { ASSETS } from '../data/mockData';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm rounded-2xl bg-surface-container border border-surface-variant p-space-md shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with avatar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={ASSETS.profile} 
                alt="Maria S." 
                className="w-14 h-14 rounded-full object-cover border-2 border-primary-container"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-secondary border-2 border-surface flex items-center justify-center text-[9px] text-on-secondary font-bold">
                ✓
              </span>
            </div>
            <div>
              <h3 className="font-headline-sm text-on-surface font-bold">Maria Santos</h3>
              <p className="font-label-sm text-primary uppercase font-bold tracking-wider">Sr. Highway Inspector</p>
              <p className="font-telemetry-mono text-[11px] text-on-surface-variant">City of Boston DPW • ID #88492</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Telemetry Hardware Badges */}
        <div className="p- space-xs rounded-xl bg-surface-container-lowest/80 border border-surface-variant/40 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-telemetry-mono">
            <span className="text-on-surface-variant">LIDAR CALIBRATION</span>
            <span className="text-secondary font-bold">±0.18mm • VALID</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-telemetry-mono">
            <span className="text-on-surface-variant">RTK GNSS LOCK</span>
            <span className="text-secondary font-bold">18 SATS (FIXED)</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-telemetry-mono">
            <span className="text-on-surface-variant">EDGE AI INFERENCE</span>
            <span className="text-primary font-bold">60.2 FPS (ONNX)</span>
          </div>
        </div>

        {/* Civic Inspector Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-lg bg-surface-container-high flex flex-col">
            <span className="text-[10px] font-label-sm text-on-surface-variant uppercase">Total Inspections</span>
            <span className="text-lg font-headline-sm font-bold text-on-surface mt-0.5">284</span>
          </div>
          <div className="p-2.5 rounded-lg bg-surface-container-high flex flex-col">
            <span className="text-[10px] font-label-sm text-on-surface-variant uppercase">Dispatched SLAS</span>
            <span className="text-lg font-headline-sm font-bold text-secondary mt-0.5">99.4%</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-primary-container text-on-primary-fixed font-label-md font-bold uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all"
        >
          Close Inspector Card
        </button>
      </div>
    </div>
  );
};
