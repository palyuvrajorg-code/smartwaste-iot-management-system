export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-001',
    targetRole: 'ALL',
    type: 'CRITICAL',
    title: 'Full Bin Alert: Downtown Civic Square',
    message: 'The smart bin at Downtown Civic Square is now full. Dispatched to nearest available truck.',
    timestamp: '5 mins ago',
    read: false,
    relatedBinId: 'BIN-101'
  },
  {
    id: 'NOTIF-002',
    targetRole: 'IOT TECHNICIAN',
    type: 'WARNING',
    title: 'Critical Battery Depletion: BIN-109',
    message: 'ESP32 node battery at 12% and tilt anomaly detected (18.4°). Site visit required.',
    timestamp: '18 mins ago',
    read: false,
    relatedBinId: 'BIN-109'
  },
  {
    id: 'NOTIF-003',
    targetRole: 'DRIVER',
    type: 'INFO',
    title: 'New Full Bin Assigned: Pier 14',
    message: 'Pier 14 is now full and added to your active pickup queue. Please collect next.',
    timestamp: '32 mins ago',
    read: false,
    relatedBinId: 'BIN-103'
  },
  {
    id: 'NOTIF-004',
    targetRole: 'SUPERVISOR',
    type: 'SUCCESS',
    title: 'Shift Quota Milestone Reached',
    message: 'Zone North has achieved 85% scheduled collections ahead of the 15:00 deadline.',
    timestamp: '1 hour ago',
    read: true,
    relatedDriverId: 'DRV-101'
  },
  {
    id: 'NOTIF-005',
    targetRole: 'IOT TECHNICIAN',
    type: 'WARNING',
    title: 'High Methane / Gas Anomaly: BIN-107',
    message: 'Gas sensor MQ-4 triggered 84 ppm at Sunset Boardwalk Market. Verify organic fermentation level.',
    timestamp: '2 hours ago',
    read: false,
    relatedBinId: 'BIN-107'
  },
  {
    id: 'NOTIF-006',
    targetRole: 'ADMIN',
    type: 'INFO',
    title: 'Fleet Compactor Eco-Rating',
    message: 'Monthly carbon offset achieved: 4.8 tons saved using dynamic route optimization.',
    timestamp: '3 hours ago',
    read: true
  }
];
