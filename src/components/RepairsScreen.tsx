import React, { useState } from 'react';
import { RepairItem, TabType } from '../types';

interface RepairsScreenProps {
  repairs: RepairItem[];
  onNavigate: (tab: TabType) => void;
}

export const RepairsScreen: React.FC<RepairsScreenProps> = ({ repairs, onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState<'active' | 'scheduled' | 'resolved' | 'all'>('active');
  const [beforeAfterState, setBeforeAfterState] = useState<Record<string, 'before' | 'after'>>({
    '3': 'after',
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleBeforeAfter = (id: string, state: 'before' | 'after') => {
    setBeforeAfterState(prev => ({
      ...prev,
      [id]: state,
    }));
  };

  const handleShareBadge = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('Civic Guardian Level 3 - 18 Verified Road Reports | RoadPulse AI');
    }
    setToastMessage('Accomplishment copied to clipboard!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const filteredRepairs = repairs.filter(item => {
    if (activeFilter === 'all') return true;
    return item.status === activeFilter;
  });

  const activeCount = repairs.filter(r => r.status === 'active').length;
  const scheduledCount = repairs.filter(r => r.status === 'scheduled').length;
  const resolvedCount = repairs.filter(r => r.status === 'resolved').length;

  return (
    <div className="flex flex-col w-full px-gutter-mobile space-y-space-md max-w-lg mx-auto pb-32">
      {/* Gamified Citizen Impact Card */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-high p-space-md shadow-xl border border-surface-variant/40">
        <div className="absolute -right-10 -top-10 w-36 h-36 bg-primary-container/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col space-y-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <div className="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary-fixed-dim">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  military_tech
                </span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant block">
                  Civic Standing
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Beacon Hill Ward 4
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary font-telemetry-mono text-[11px] font-semibold flex items-center gap-1 border border-secondary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />
              Top 3% Contributor
            </span>
          </div>

          {/* Bento Metric Matrix */}
          <div className="grid grid-cols-2 gap-space-2xs pt-space-2xs">
            <div className="bg-surface-container rounded-lg p-space-xs flex flex-col justify-between border border-surface-variant/30">
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">flag</span> Reports Filed
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-headline-md text-headline-md text-on-surface font-bold">18</span>
                <span className="font-label-sm text-label-sm text-secondary font-medium">94% AI Valid</span>
              </div>
            </div>

            <div className="bg-surface-container rounded-lg p-space-xs flex flex-col justify-between border border-surface-variant/30">
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span> Fixed Rate
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-headline-md text-headline-md text-secondary font-bold">78%</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">14 / 18</span>
              </div>
            </div>

            <div className="bg-surface-container rounded-lg p-space-xs flex flex-col justify-between border border-surface-variant/30">
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">stars</span> Civic Points
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-headline-md text-headline-md text-primary font-bold">2,450</span>
                <span className="font-label-sm text-label-sm text-primary-fixed-dim">Pts</span>
              </div>
            </div>

            <div className="bg-surface-container rounded-lg p-space-xs flex flex-col justify-between border border-surface-variant/30">
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">car_crash</span> Blowouts Prevented
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-headline-md text-headline-md text-on-surface font-bold">~32</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Tires Saved</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Selector (Segmented Tactile Controls) */}
      <div className="flex items-center bg-surface-container-low p-1 rounded-xl shadow-inner gap-1 border border-surface-variant/30">
        <button
          type="button"
          onClick={() => setActiveFilter('active')}
          className={`flex-1 py-2 rounded-lg font-label-md text-label-md transition-all text-center ${
            activeFilter === 'active'
              ? 'bg-surface-container text-primary font-bold shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Active ({activeCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('scheduled')}
          className={`flex-1 py-2 rounded-lg font-label-md text-label-md transition-all text-center ${
            activeFilter === 'scheduled'
              ? 'bg-surface-container text-primary font-bold shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Scheduled ({scheduledCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('resolved')}
          className={`flex-1 py-2 rounded-lg font-label-md text-label-md transition-all text-center ${
            activeFilter === 'resolved'
              ? 'bg-surface-container text-primary font-bold shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Resolved ({resolvedCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`flex-1 py-2 rounded-lg font-label-md text-label-md transition-all text-center ${
            activeFilter === 'all'
              ? 'bg-surface-container text-primary font-bold shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          All
        </button>
      </div>

      {/* Interactive Tracking Stream */}
      <div className="flex flex-col space-y-space-md">
        {filteredRepairs.map((item) => {
          const isBeforeAfter = item.beforeImageUrl && item.afterImageUrl;
          const currentBA = beforeAfterState[item.id] || 'after';

          return (
            <div
              key={item.id}
              className="relative rounded-xl bg-surface-container p-space-md flex flex-col space-y-space-sm shadow-md overflow-hidden border border-surface-variant/30"
            >
              {/* Status Rail Indicator on Left */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 ${
                  item.status === 'active'
                    ? 'bg-primary-container'
                    : item.status === 'scheduled'
                    ? 'bg-surface-tint'
                    : 'bg-secondary'
                }`}
              />

              {/* Title & Ticket Header */}
              <div className="flex items-start justify-between gap-space-xs pl-1">
                <div className="flex flex-col">
                  <div className="flex items-center gap-space-2xs">
                    <span className="font-telemetry-mono text-telemetry-mono text-primary font-semibold">
                      {item.ticketNumber}
                    </span>
                    <span className="text-on-surface-variant text-label-sm">•</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                      {item.streetName}
                    </span>
                  </div>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold mt-0.5">
                    {item.title}
                  </span>
                </div>

                {item.status === 'active' ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-container/15 text-primary-fixed-dim border border-primary-container/30">
                    <span className="w-2 h-2 rounded-full bg-primary-container animate-ping" />
                    <span className="font-label-sm text-label-sm font-bold tracking-tight uppercase">
                      {item.statusLabel}
                    </span>
                  </div>
                ) : item.status === 'scheduled' ? (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-highest text-primary-fixed-dim border border-surface-variant/40">
                    <span className="material-symbols-outlined text-[14px]">policy</span>
                    <span className="font-label-sm text-label-sm font-semibold uppercase">
                      {item.statusLabel}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container/20 text-secondary font-label-sm text-label-sm font-bold uppercase border border-secondary/30">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    {item.statusLabel}
                  </div>
                )}
              </div>

              {/* Lifecycle Progress Bar if active or scheduled */}
              {item.status !== 'resolved' && (
                <div className="bg-surface-container-lowest/70 rounded-lg p-space-xs flex flex-col space-y-2 border border-surface-variant/30">
                  <div className="flex justify-between items-center px-1">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                      Repair Lifecycle
                    </span>
                    <span className="font-telemetry-mono text-[11px] text-primary font-bold">
                      Step {item.stepIndex} of {item.totalSteps}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 items-center">
                    <div className="h-1.5 rounded-full bg-secondary" />
                    <div className="h-1.5 rounded-full bg-secondary" />
                    <div className="h-1.5 rounded-full bg-secondary" />
                    <div className={`h-1.5 rounded-full ${item.status === 'active' ? 'bg-primary-container animate-pulse' : 'bg-surface-variant'}`} />
                    <div className="h-1.5 rounded-full bg-surface-variant" />
                  </div>
                  <div className="flex justify-between text-[9px] font-label-sm text-on-surface-variant px-0.5">
                    <span className="text-secondary font-semibold">Logged</span>
                    <span className="text-secondary font-semibold">AI Scan</span>
                    <span className="text-secondary font-semibold">Approved</span>
                    <span className={item.status === 'active' ? 'text-primary font-bold' : 'text-on-surface-variant'}>
                      En Route
                    </span>
                    <span>Done</span>
                  </div>
                </div>
              )}

              {/* Unit Dispatch & ETA */}
              {item.unitAssigned && (
                <div className="grid grid-cols-2 gap-space-xs pt-1">
                  <div className="flex items-center gap-2 bg-surface-container-high px-2.5 py-2 rounded-lg border border-surface-variant/30">
                    <span className="material-symbols-outlined text-[18px] text-primary">local_shipping</span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-sm text-[10px] text-on-surface-variant">{item.unitAssigned}</span>
                      <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                        {item.vehicleType}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-surface-container-high px-2.5 py-2 rounded-lg border border-surface-variant/30">
                    <span className="material-symbols-outlined text-[18px] text-secondary">schedule</span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-sm text-[10px] text-on-surface-variant">Arrival ETA</span>
                      <span className="font-telemetry-mono text-label-md text-secondary font-bold">
                        {item.eta}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* SLA limit row for scheduled */}
              {item.slaLimit && (
                <div className="flex items-center justify-between bg-surface-container-high rounded-lg p-space-xs border border-surface-variant/30">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-surface-container-lowest flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[18px]">alarm</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Mandated Municipal SLA</span>
                      <span className="font-telemetry-mono text-label-md text-on-surface font-bold">
                        {item.slaLimit}
                      </span>
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1 border border-surface-variant/40">
                    <span className="material-symbols-outlined text-[14px] text-secondary">verified_user</span>
                    {item.queuePosition}
                  </div>
                </div>
              )}

              {/* Reticle Image Snapshot */}
              {item.imageUrl && (
                <div className="relative w-full h-28 rounded-lg overflow-hidden mt-1 shadow-inner bg-surface-container-lowest border border-surface-variant/30">
                  <img
                    alt="Pothole defect snapshot"
                    className="w-full h-full object-cover opacity-75"
                    src={item.imageUrl}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
                  <div className="absolute inset-4 pointer-events-none flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div className="w-3 h-3 border-l-2 border-t-2 border-primary" />
                      <div className="w-3 h-3 border-r-2 border-t-2 border-primary" />
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="w-3 h-3 border-l-2 border-b-2 border-primary" />
                      <span className="px-1.5 py-0.5 rounded bg-surface-container-lowest/80 text-primary-fixed font-telemetry-mono text-[10px] font-bold border border-surface-variant/40">
                        {item.coordinates}
                      </span>
                      <div className="w-3 h-3 border-r-2 border-b-2 border-primary" />
                    </div>
                  </div>
                </div>
              )}

              {/* Before / After Visual Comparison for Resolved */}
              {isBeforeAfter && (
                <div className="relative w-full rounded-lg overflow-hidden bg-surface-container-lowest flex flex-col border border-surface-variant/30">
                  <div className="relative h-36 w-full">
                    {/* Before Image */}
                    <div 
                      className={`absolute inset-0 transition-opacity duration-300 ${
                        currentBA === 'before' ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                    >
                      <img 
                        src={item.beforeImageUrl} 
                        alt="Before repair" 
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-error-container/90 text-on-error-container font-label-sm text-label-sm uppercase font-bold shadow-md">
                        Before • {item.beforeDate}
                      </span>
                    </div>

                    {/* After Image */}
                    <div 
                      className={`absolute inset-0 transition-opacity duration-300 ${
                        currentBA === 'after' ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                    >
                      <img 
                        src={item.afterImageUrl} 
                        alt="After repair" 
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-secondary-container/90 text-on-secondary-container font-label-sm text-label-sm uppercase font-bold shadow-md">
                        After • {item.afterDate}
                      </span>
                    </div>
                  </div>

                  {/* Micro Toggle Switch */}
                  <div className="flex items-center justify-between p-space-xs bg-surface-container-high border-t border-surface-variant/30">
                    <div className="flex items-center gap-1.5 text-secondary font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[16px]">celebration</span>
                      <span className="truncate">{item.notes}</span>
                    </div>
                    <div className="flex items-center bg-surface-container-lowest rounded-full p-0.5 gap-0.5 border border-surface-variant/40 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleBeforeAfter(item.id, 'before')}
                        className={`px-2 py-0.5 rounded-full font-label-sm text-[10px] transition-all ${
                          currentBA === 'before'
                            ? 'bg-secondary text-on-secondary font-bold'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        Before
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleBeforeAfter(item.id, 'after')}
                        className={`px-2 py-0.5 rounded-full font-label-sm text-[10px] transition-all ${
                          currentBA === 'after'
                            ? 'bg-secondary text-on-secondary font-bold'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        After
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Civic Reward Unlocked Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-high p-space-md shadow-lg border border-primary-container/30">
        <div className="flex items-start gap-space-sm">
          <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container shadow-md shrink-0">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              shield
            </span>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                Milestone Achieved
              </span>
              <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
              Civic Guardian: Level 3
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              You unlocked priority dispatch routing for all future hazard alerts in your district.
            </span>

            <div className="flex items-center gap-space-xs mt-space-sm pt-1">
              <button 
                type="button"
                onClick={handleShareBadge}
                className="min-h-[44px] px-3.5 rounded-lg bg-surface-container-highest hover:bg-surface-bright text-on-surface font-label-md text-label-md font-semibold flex items-center gap-1.5 transition-colors border border-surface-variant/40"
              >
                <span className="material-symbols-outlined text-[16px]">share</span>
                Share Badge
              </button>

              <button 
                type="button"
                onClick={() => onNavigate('scan-&-detect')}
                className="min-h-[44px] px-4 rounded-lg bg-primary-container hover:opacity-95 text-on-primary-fixed font-label-md text-label-md font-bold flex items-center gap-1.5 shadow-sm transition-transform active:translate-y-0.5"
              >
                <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
                Report Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Feedback Toast Container */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-surface-bright text-on-surface px-4 py-2 rounded-full font-label-md text-label-md shadow-2xl flex items-center gap-2 border border-surface-variant/60 animate-fade-in">
          <span className="material-symbols-outlined text-secondary text-[18px]">check</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
