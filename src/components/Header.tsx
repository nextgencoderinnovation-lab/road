import React, { useState } from 'react';
import { TabType } from '../types';
import { ASSETS } from '../data/mockData';
import { ProfileModal } from './ProfileModal';

interface HeaderProps {
  activeTab: TabType;
}

const TAB_TITLES: Record<TabType, string> = {
  'scan-&-detect': 'Scan & Detect',
  'confirm-&-report': 'Confirm & Report',
  'tracked-repairs': 'Tracked Repairs',
  'city-heatmap': 'City Heatmap',
};

export const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/85 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.4)] border-b border-surface-variant/30">
        <div className="h-16 px-gutter-mobile flex items-center justify-between gap-space-xs max-w-4xl mx-auto">
          {/* Logo & App Name */}
          <div className="flex items-center gap-space-xs">
            <img 
              alt="RoadPulse AI Logo" 
              className="h-8 w-auto object-contain" 
              src={ASSETS.logo}
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-space-2xs">
                <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
                  RoadPulse AI
                </span>
                <span className="font-label-sm text-label-sm uppercase px-space-2xs py-0.5 rounded-DEFAULT bg-primary-container/20 text-primary-fixed-dim font-bold tracking-wider">
                  HUD
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant line-clamp-1">
                {TAB_TITLES[activeTab]}
              </span>
            </div>
          </div>

          {/* Right Status Pill & Profile */}
          <div className="flex items-center gap-space-xs">
            <div className="hidden xs:flex sm:flex items-center gap-1.5 px-2 py-1 rounded-DEFAULT bg-surface-container-high border border-surface-variant/40">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              <span className="font-telemetry-mono text-[10px] text-secondary tracking-tight">
                GPS: RTK ±0.2m
              </span>
            </div>

            <button 
              onClick={() => setShowProfile(true)}
              aria-label="View Inspector Profile"
              className="min-h-[44px] min-w-[44px] p-1 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95"
            >
              <img 
                alt="Profile of Maria S." 
                className="w-8 h-8 rounded-full object-cover border border-primary-container/60 ring-1 ring-primary/20" 
                src={ASSETS.profile}
              />
            </button>
          </div>
        </div>
      </header>

      <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </>
  );
};
