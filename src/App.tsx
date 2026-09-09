import { useState } from 'react';
import { TabType, RepairItem } from './types';
import { INITIAL_REPAIRS } from './data/mockData';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { ScanScreen } from './components/ScanScreen';
import { ReportScreen } from './components/ReportScreen';
import { RepairsScreen } from './components/RepairsScreen';
import { HeatmapScreen } from './components/HeatmapScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('scan-&-detect');
  const [repairs, setRepairs] = useState<RepairItem[]>(INITIAL_REPAIRS);

  const handleAddNewReport = (newReport: RepairItem) => {
    setRepairs(prev => [newReport, ...prev]);
  };

  const activeRepairsCount = repairs.filter(r => r.status === 'active').length;

  return (
    <div className="bg-surface text-on-surface font-body-md text-body-md flex flex-col min-h-screen">
      {/* Fixed HUD Top Header */}
      <Header activeTab={activeTab} />

      {/* Main Screen Viewport */}
      <main className="flex-1 flex flex-col relative w-full pt-16 pb-20 bg-surface">
        {activeTab === 'scan-&-detect' && (
          <ScanScreen onNavigate={(tab) => setActiveTab(tab)} />
        )}

        {activeTab === 'confirm-&-report' && (
          <ReportScreen 
            onNavigate={(tab) => setActiveTab(tab)} 
            onAddNewReport={handleAddNewReport}
          />
        )}

        {activeTab === 'tracked-repairs' && (
          <RepairsScreen 
            repairs={repairs} 
            onNavigate={(tab) => setActiveTab(tab)} 
          />
        )}

        {activeTab === 'city-heatmap' && (
          <HeatmapScreen />
        )}
      </main>

      {/* Fixed Ergonomic Thumb Arc Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        activeRepairsCount={activeRepairsCount}
      />
    </div>
  );
}
