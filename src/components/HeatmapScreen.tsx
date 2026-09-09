import React, { useState } from 'react';
import { STREET_FEATURES } from '../data/mockData';
import { StreetFeature } from '../types';

export const HeatmapScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('Ward 4 • Evergreen Corridor');
  const [activeFilter, setActiveFilter] = useState('Severe Potholes');
  const [selectedStreet, setSelectedStreet] = useState<StreetFeature>(
    STREET_FEATURES['Evergreen Corridor']
  );
  const [isDashModeActive, setIsDashModeActive] = useState(true);
  const [cardPulse, setCardPulse] = useState(false);

  const filterPills = [
    { label: 'Severe Potholes', icon: 'error' },
    { label: 'Roughness (IRI)', icon: 'vibration' },
    { label: 'Recent Patches', icon: 'secondary' },
    { label: 'School Zones', icon: 'school' },
  ];

  const handleSelectStreet = (featureKey: string) => {
    if (STREET_FEATURES[featureKey]) {
      setCardPulse(true);
      setSelectedStreet(STREET_FEATURES[featureKey]);
      setTimeout(() => setCardPulse(false), 200);
    }
  };

  const getHealthColorClass = (health: number) => {
    if (health >= 85) return 'text-secondary';
    if (health >= 65) return 'text-primary';
    return 'text-error';
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto pb-32">
      {/* Search & Telemetry Controls Panel */}
      <section className="px-gutter-mobile pt-space-xs pb-space-sm flex flex-col gap-space-xs">
        {/* Search Bar */}
        <div className="relative flex items-center w-full">
          <span className="material-symbols-outlined absolute left-space-sm text-on-surface-variant text-[20px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            id="geo-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search streets, wards, or zip codes..."
            className="w-full h-12 pl-10 pr-10 bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant font-body-md text-body-md rounded-xl shadow-sm focus:outline-none focus:bg-surface-container-low border border-surface-variant/40 transition-colors"
          />
          <button 
            type="button"
            onClick={() => setSearchQuery('')}
            aria-label="Filter settings" 
            className="absolute right-space-2xs min-h-[40px] min-w-[40px] flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">
              {searchQuery ? 'close' : 'tune'}
            </span>
          </button>
        </div>

        {/* Quick Pill Filters (Horizontal Scrollable) */}
        <div className="flex items-center gap-space-2xs overflow-x-auto no-scrollbar py-0.5" id="filter-pills-bar">
          {filterPills.map((pill) => {
            const isActive = activeFilter === pill.label;
            return (
              <button
                key={pill.label}
                type="button"
                onClick={() => setActiveFilter(pill.label)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap shadow-sm transition-all border ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container border-primary/50'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface border-surface-variant/30'
                }`}
              >
                {pill.icon === 'error' && (
                  <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
                )}
                {pill.icon === 'secondary' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                )}
                {pill.icon === 'vibration' && (
                  <span className="material-symbols-outlined text-[14px]">vibration</span>
                )}
                {pill.icon === 'school' && (
                  <span className="material-symbols-outlined text-[14px]">school</span>
                )}
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Interactive Map Canvas Container */}
      <section className="relative w-full px-gutter-mobile">
        <div className="relative w-full h-[360px] rounded-xl overflow-hidden bg-surface-container-lowest shadow-md border border-surface-variant/40">
          {/* Vector Field / Neon Grid Visualization (Interactive HUD Map Canvas) */}
          <svg
            className="absolute inset-0 w-full h-full object-cover"
            fill="none"
            viewBox="0 0 380 360"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Neon Glowing Filters */}
              <filter height="140%" id="glow-red" width="140%" x="-20%" y="-20%">
                <feGaussianBlur result="blur" stdDeviation="3.5" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter height="140%" id="glow-green" width="140%" x="-20%" y="-20%">
                <feGaussianBlur result="blur" stdDeviation="3" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter height="140%" id="glow-amber" width="140%" x="-20%" y="-20%">
                <feGaussianBlur result="blur" stdDeviation="2.5" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Base Dark Road Arteries */}
            <g stroke="#171f33" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12">
              <path d="M-10 180 H390" />
              <path d="M-10 80 H390" />
              <path d="M-10 270 H390" />
              <path d="M90 -20 V380" />
              <path d="M190 -20 V380" />
              <path d="M290 -20 V380" />
              <path d="M-20 40 L380 340" strokeWidth="8" />
            </g>

            {/* Secondary Road Infill Grids */}
            <g stroke="#131b2e" strokeLinecap="round" strokeWidth="4">
              <path d="M30 0 V360" />
              <path d="M140 0 V360" />
              <path d="M240 0 V360" />
              <path d="M340 0 V360" />
              <path d="M0 35 H380" />
              <path d="M0 130 H380" />
              <path d="M0 225 H380" />
              <path d="M0 315 H380" />
            </g>

            {/* Green Route Segments (Recently Resurfaced: Quality 98%) */}
            <g filter="url(#glow-green)">
              <path d="M90 80 V225" stroke="#4edea3" strokeLinecap="round" strokeWidth="4.5" />
              <path d="M190 270 H290" stroke="#4edea3" strokeLinecap="round" strokeWidth="4.5" />
              <path d="M290 80 L360 130" stroke="#4edea3" strokeLinecap="round" strokeWidth="4" />
            </g>

            {/* Amber Glowing Road Segments (Moderate IRI Roughness) */}
            <g filter="url(#glow-amber)">
              <path d="M190 80 V180" stroke="#ffc174" strokeDasharray="6 4" strokeLinecap="round" strokeWidth="4" />
              <path d="M90 180 H140" stroke="#ffc174" strokeLinecap="round" strokeWidth="3.5" />
            </g>

            {/* Red Glowing Hazardous Road Segments (Severe Damage Clusters) */}
            <g filter="url(#glow-red)">
              <path d="M140 180 H290" stroke="#ff9198" strokeLinecap="round" strokeWidth="5" />
              <path d="M190 180 V240" stroke="#ff9198" strokeLinecap="round" strokeWidth="4.5" />
            </g>

            {/* Active Scanning GPS Reticle Radar Wave */}
            <circle
              className="animate-ping"
              cx="190"
              cy="180"
              opacity="0.4"
              r="32"
              stroke="#ffc174"
              strokeWidth="1"
              style={{ animationDuration: '3s' }}
            />
            <circle cx="190" cy="180" opacity="0.2" r="48" stroke="#ff9198" strokeWidth="0.75" />

            {/* High-Hazard Marker Cluster: P1 Critical (Evergreen Corridor) */}
            <g 
              className="cursor-pointer transition-transform hover:scale-110" 
              id="pin-p1" 
              onClick={() => handleSelectStreet('Evergreen Corridor')}
            >
              <circle cx="190" cy="180" fill="#93000a" filter="url(#glow-red)" r="14" />
              <circle cx="190" cy="180" fill="#ff9198" r="10" />
              <circle cx="190" cy="180" fill="#0b1326" r="5" />
            </g>

            {/* Secondary Damage Marker Cluster: P2 Medium (14th Crossway) */}
            <g 
              className="cursor-pointer transition-transform hover:scale-110" 
              id="pin-p2" 
              onClick={() => handleSelectStreet('14th Crossway')}
            >
              <circle cx="290" cy="180" fill="#613b00" filter="url(#glow-amber)" r="12" />
              <circle cx="290" cy="180" fill="#ffc174" r="8" />
              <circle cx="290" cy="180" fill="#0b1326" r="4" />
            </g>

            {/* Quality Verification Checkpoint (St. Claire Blvd) */}
            <g 
              className="cursor-pointer transition-transform hover:scale-110" 
              onClick={() => handleSelectStreet('St. Claire Blvd')}
            >
              <circle cx="90" cy="140" fill="#003824" filter="url(#glow-green)" r="11" />
              <circle cx="90" cy="140" fill="#4edea3" r="7" />
              <circle cx="90" cy="140" fill="#0b1326" r="3" />
            </g>
          </svg>

          {/* Map Overlaid Quick Badges */}
          <div className="absolute top-space-xs left-space-xs flex flex-col gap-1 pointer-events-none">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-DEFAULT bg-surface-container/90 backdrop-blur-md shadow-sm border border-surface-variant/40">
              <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
              <span className="font-telemetry-mono text-label-sm text-error font-bold">P1 CRITICAL (8)</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-DEFAULT bg-surface-container/90 backdrop-blur-md shadow-sm border border-surface-variant/40">
              <span className="w-2 h-2 rounded-full bg-primary-container" />
              <span className="font-telemetry-mono text-label-sm text-primary font-bold">P2 MEDIUM (14)</span>
            </div>
          </div>

          {/* Real-time Quality Legend Pill */}
          <div className="absolute top-space-xs right-space-xs pointer-events-none">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-DEFAULT bg-surface-container/90 backdrop-blur-md shadow-sm border border-surface-variant/40">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="font-telemetry-mono text-label-sm text-secondary font-bold">RESURFACED 98%</span>
            </div>
          </div>

          {/* Interactive Selected Street Floating Overlay Card */}
          <div 
            className={`absolute bottom-space-xs inset-x-space-xs p-space-sm bg-surface-container/95 backdrop-blur-lg rounded-xl shadow-xl flex flex-col gap-space-2xs border border-surface-variant/50 transition-all duration-300 ${
              cardPulse ? 'scale-[0.98]' : 'scale-100'
            }`}
          >
            <div className="flex items-start justify-between gap-space-xs">
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[16px]">alt_route</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface truncate font-bold">
                    {selectedStreet.name}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-DEFAULT bg-surface-container-highest text-on-surface-variant font-label-sm text-[10px] border border-surface-variant/40">
                    {selectedStreet.ward}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 line-clamp-1">
                  {selectedStreet.description}
                </p>
              </div>

              {/* Health Metric Circle */}
              <div className="flex flex-col items-center justify-center min-w-[54px] px-2 py-1 rounded-lg bg-surface-container-high shadow-inner border border-surface-variant/40">
                <span className={`font-headline-sm text-headline-sm font-bold leading-none ${getHealthColorClass(selectedStreet.health)}`}>
                  {selectedStreet.health}
                </span>
                <span className="font-label-sm text-[9px] text-on-surface-variant uppercase tracking-wider">
                  Health
                </span>
              </div>
            </div>

            {/* Metric Strips Row */}
            <div className="grid grid-cols-2 gap-space-2xs pt-1">
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-surface-container-low border border-surface-variant/30">
                <span className="material-symbols-outlined text-error text-[18px]">warning</span>
                <div className="flex flex-col">
                  <span className="font-telemetry-mono text-label-md text-on-surface font-bold leading-tight">
                    {selectedStreet.hazards} {selectedStreet.hazards === 1 ? 'Hazard' : 'Hazards'}
                  </span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant">Active Reports</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-surface-container-low border border-surface-variant/30">
                <span className="material-symbols-outlined text-secondary text-[18px]">timer</span>
                <div className="flex flex-col">
                  <span className="font-telemetry-mono text-label-md text-on-surface font-bold leading-tight">
                    {selectedStreet.fixTimeHours > 0 ? `~${selectedStreet.fixTimeHours} hrs` : 'Verified'}
                  </span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant">Est. DPW Repair</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insights & Analytics Sliding Sheet */}
      <section className="flex flex-col gap-space-sm px-gutter-mobile pt-space-md pb-space-lg">
        {/* City Infrastructure Health Index Card */}
        <div className="p-space-md rounded-xl bg-surface-container shadow-md flex flex-col gap-space-sm border border-surface-variant/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">speed</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  City Road Health Index
                </h2>
                <span className="font-label-sm text-label-sm text-secondary font-bold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> +3.2% this quarter
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display-lg-mobile text-display-lg-mobile text-on-surface font-bold leading-none">
                74<span className="text-headline-sm font-normal text-on-surface-variant">/100</span>
              </div>
              <span className="font-label-sm text-[10px] text-on-surface-variant uppercase">Metro Baseline</span>
            </div>
          </div>

          {/* Segmented Quality Progress Bar */}
          <div className="flex flex-col gap-1.5">
            <div className="h-2.5 w-full bg-surface-container-low rounded-full overflow-hidden flex border border-surface-variant/30">
              <div className="h-full bg-secondary transition-all" style={{ width: '58%' }} title="Optimal Condition: 58%" />
              <div className="h-full bg-primary-container transition-all" style={{ width: '28%' }} title="Fair / Maintenance Scheduled: 28%" />
              <div className="h-full bg-error transition-all" style={{ width: '14%' }} title="Severe / Priority Triage: 14%" />
            </div>
            <div className="flex justify-between items-center text-on-surface-variant font-label-sm text-[11px] px-0.5">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> 58% Prime
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container" /> 28% Monitored
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-error" /> 14% Critical
              </span>
            </div>
          </div>
        </div>

        {/* Municipal Triage Leaderboard Banner */}
        <div className="p-space-sm rounded-xl bg-surface-container-low shadow-sm flex items-center justify-between gap-space-sm border border-surface-variant/40">
          <div className="flex items-center gap-space-xs min-w-0">
            <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex-shrink-0 flex items-center justify-center text-secondary border border-secondary/30">
              <span className="material-symbols-outlined text-[22px]">verified</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-label-lg text-label-lg text-on-surface font-bold truncate">
                  Ward 4 Rapid Response
                </span>
                <span className="px-1.5 py-0.2 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[10px] font-bold">
                  #1 SPOT
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">
                Response time improved by <span className="text-secondary font-bold">41%</span> via AI auto-triage.
              </p>
            </div>
          </div>
          <button className="min-h-[44px] min-w-[44px] flex items-center justify-center text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>

        {/* Dash-Mount Crowdsource Drive Mode CTA Card */}
        <div className="p-space-md rounded-xl bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low shadow-lg flex flex-col gap-space-sm border border-surface-variant/40">
          <div className="flex items-start justify-between gap-space-sm">
            <div className="flex items-start gap-space-xs">
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container flex-shrink-0 shadow-md">
                <span className="material-symbols-outlined text-[24px]">directions_car</span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Background Auto-Detection
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Crowdsource road safety while driving. Uses RTK camera telemetry with low OLED power draw.
                </p>
              </div>
            </div>

            {/* Custom Mechanical Toggle Switch */}
            <label 
              aria-label="Toggle Dash-Mount Background Detection" 
              className="relative inline-flex items-center cursor-pointer min-h-[44px] min-w-[56px] justify-center"
            >
              <input
                type="checkbox"
                checked={isDashModeActive}
                onChange={(e) => setIsDashModeActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-surface-container-lowest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[14px] after:left-[6px] after:bg-on-secondary after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary border border-surface-variant/40" />
            </label>
          </div>

          {/* Telemetry Mode Sensor Readout Footer */}
          <div className="pt-space-xs flex items-center justify-between text-on-surface-variant font-telemetry-mono text-[11px] border-t border-surface-variant/30">
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isDashModeActive ? 'bg-secondary animate-ping' : 'bg-surface-variant'}`} />
              AI SENSOR DAEMON: {isDashModeActive ? 'READY' : 'STANDBY'}
            </span>
            <span className="tracking-wider text-primary">
              {isDashModeActive ? 'GPS LOCKED • 60 FPS INFERENCE' : 'SENSOR SLEEP'}
            </span>
          </div>
        </div>

        {/* Active Ward Inspections Micro-List */}
        <div className="flex flex-col gap-space-2xs mt-1">
          <div className="flex items-center justify-between px-1">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">
              Recent Field Verification
            </span>
            <span className="font-label-sm text-label-sm text-primary font-bold cursor-pointer hover:underline">
              View All 128
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {/* Inspection Item 1 */}
            <div 
              onClick={() => handleSelectStreet('Broadway & 8th St')}
              className="p-space-sm rounded-lg bg-surface-container flex items-center justify-between shadow-sm border border-surface-variant/30 hover:border-primary/40 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                <div className="flex flex-col">
                  <span className="font-label-lg text-label-lg text-on-surface font-bold">Broadway & 8th St</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Repaired by Municipal Crew • Grade A
                  </span>
                </div>
              </div>
              <span className="font-telemetry-mono text-label-sm text-secondary font-bold">12m ago</span>
            </div>

            {/* Inspection Item 2 */}
            <div 
              onClick={() => handleSelectStreet('Evergreen Corridor')}
              className="p-space-sm rounded-lg bg-surface-container flex items-center justify-between shadow-sm border border-surface-variant/30 hover:border-primary/40 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-error text-[20px]">report</span>
                <div className="flex flex-col">
                  <span className="font-label-lg text-label-lg text-on-surface font-bold">Pinecrest Viaduct</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Severe expansion joint gap detected
                  </span>
                </div>
              </div>
              <span className="font-telemetry-mono text-label-sm text-error font-bold">48m ago</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
