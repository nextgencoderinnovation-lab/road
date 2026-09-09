import React from 'react';
import { TabType } from '../types';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  activeRepairsCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  activeRepairsCount = 3,
}) => {
  const tabs = [
    {
      id: 'scan-&-detect' as TabType,
      label: 'Scan',
      icon: 'photo_camera',
    },
    {
      id: 'confirm-&-report' as TabType,
      label: 'Report',
      icon: 'assignment_turned_in',
    },
    {
      id: 'tracked-repairs' as TabType,
      label: 'Repairs',
      icon: 'history_edu',
      badge: activeRepairsCount,
    },
    {
      id: 'city-heatmap' as TabType,
      label: 'Heatmap',
      icon: 'radar',
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.5)] border-t border-surface-variant/30">
      <div className="flex justify-around items-center h-16 px-space-2xs max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-16 h-14 min-h-[44px] min-w-[44px] relative transition-colors ${
                isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span 
                  className="material-symbols-outlined text-[24px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {tab.icon}
                </span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2.5 px-1 py-0.2 rounded-full bg-primary-container text-on-primary-fixed font-label-sm text-[9px] leading-tight font-bold shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`font-label-sm text-label-sm mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
