export type TabType = 'scan-&-detect' | 'confirm-&-report' | 'tracked-repairs' | 'city-heatmap';

export interface RepairItem {
  id: string;
  ticketNumber: string;
  streetName: string;
  title: string;
  status: 'active' | 'scheduled' | 'resolved';
  statusLabel: string;
  statusType: 'dispatched' | 'approved' | 'verified';
  stepIndex: number;
  totalSteps: number;
  unitAssigned?: string;
  vehicleType?: string;
  eta?: string;
  slaLimit?: string;
  queuePosition?: string;
  coordinates?: string;
  imageUrl?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  beforeDate?: string;
  afterDate?: string;
  notes?: string;
}

export interface StreetFeature {
  name: string;
  ward: string;
  health: number;
  hazards: number;
  fixTimeHours: number;
  description: string;
  coordinates: string;
}

export interface ShockTelemetryData {
  gForce: number;
  speedKmh: number;
  status: string;
  isTriggered: boolean;
}
