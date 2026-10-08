import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  TrendingUp, 
  Truck, 
  Trash2, 
  CheckCircle2, 
  MapPin, 
  BarChart3,
  Calendar
} from 'lucide-react';
import { binService, driverService } from '../../services/api';
import MapView from '../../components/MapView';
import StatusBadge from '../../components/StatusBadge';

export default function SupervisorDashboard() {
  const [bins, setBins] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    setBins(binService.getBins());
    setDrivers(driverService.getDrivers());
  }, []);

  const totalCollectedToday = drivers.reduce((acc, d) => acc + (d.collectionsCompleted || 0), 0);
  const totalTargetToday = drivers.reduce((acc, d) => acc + (d.collectionsTarget || 20), 0);
  const completionPercentage = Math.round((totalCollectedToday / totalTargetToday) * 100);

  // Zone statistics
  const zones = ['Zone A - Downtown', 'Zone B - Tech Hub', 'Zone C - Harborfront', 'Zone D - West End'];
  const zoneStats = zones.map(zone => {
    const zoneBins = bins.filter(b => b.zone === zone);
    const avgFill = zoneBins.length ? Math.round(zoneBins.reduce((a, b) => a + b.fillLevel, 0) / zoneBins.length) : 0;
    const critical = zoneBins.filter(b => b.fillLevel >= 80).length;
    return { zone, count: zoneBins.length, avgFill, critical };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '12px', color: 'var(--warning)', fontWeight: 700, letterSpacing: '0.05em' }}>
            METROPOLITAN OPERATIONS COMMAND
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>District Sanitation Oversight</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Zone fill heatmaps, driver route compliance & live collection velocity
          </p>
        </div>

        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          padding: '8px 16px',
          borderRadius: 'var(--radius-md)',
          color: '#fbbf24',
          fontSize: '13px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Calendar size={16} /> Day Shift Progress: {completionPercentage}%
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">Total Pickups Completed</div>
            <div className="stat-value" style={{ color: 'var(--primary)' }}>
              {totalCollectedToday} <span style={{ fontSize: '18px', color: 'var(--text-dim)' }}>/ {totalTargetToday}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#6ee7b7', marginTop: '4px' }}>
              {completionPercentage}% of scheduled quota
            </div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--primary)' }}>
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">Fleet Compactor Availability</div>
            <div className="stat-value" style={{ color: 'var(--secondary)' }}>
              {drivers.filter(d => d.status !== 'OFF_DUTY').length} / {drivers.length}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>
              All heavy trucks in service
            </div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--secondary)' }}>
            <Truck size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">Route Optimization Score</div>
            <div className="stat-value" style={{ color: '#fbbf24' }}>94.2%</div>
            <div style={{ fontSize: '12px', color: '#fde68a', marginTop: '4px' }}>
              Dynamic AI waypoint routing
            </div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">City Overflow Index</div>
            <div className="stat-value" style={{ color: bins.filter(b => b.fillLevel >= 85).length > 2 ? '#f87171' : 'var(--text-main)' }}>
              {bins.filter(b => b.fillLevel >= 85).length} Bins
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>
              Require immediate clearance
            </div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
            <Trash2 size={24} />
          </div>
        </div>
      </div>

      {/* Zone Fill Rate Heatmap Cards */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>District Zone Performance</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {zoneStats.map((z) => (
            <div key={z.zone} className="glass-card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700 }}>{z.zone.split(' - ')[1] || z.zone}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{z.count} Nodes</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px', color: z.avgFill >= 75 ? '#fbbf24' : '#34d399' }}>
                {z.avgFill}% <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: 500 }}>avg fill</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${z.avgFill}%`, height: '100%', background: z.avgFill >= 75 ? '#f59e0b' : '#10b981' }} />
              </div>
              <div style={{ marginTop: '8px', fontSize: '11px', color: z.critical > 0 ? '#f87171' : 'var(--text-dim)' }}>
                {z.critical > 0 ? `⚠️ ${z.critical} critical bin(s) in zone` : '✓ All bins stable'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Map */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>District Live GIS Oversight</h3>
        <MapView bins={bins} drivers={drivers} />
      </div>
    </div>
  );
}
