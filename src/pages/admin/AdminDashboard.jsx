import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  AlertTriangle, 
  Truck, 
  Leaf, 
  Plus, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Radio
} from 'lucide-react';
import { binService, driverService, notificationService } from '../../services/api';
import MapView from '../../components/MapView';
import StatusBadge from '../../components/StatusBadge';
import BinCard from '../../components/BinCard';

export default function AdminDashboard() {
  const [bins, setBins] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setBins(binService.getBins());
    setDrivers(driverService.getDrivers());
  };

  const handleCollect = (binId) => {
    binService.markCollected(binId);
    loadData();
  };

  const handleRequestCollection = (binId) => {
    binService.requestCollection(binId);
    loadData();
  };

  const criticalBins = bins.filter((b) => b.fillLevel >= 80);
  const activeDrivers = drivers.filter((d) => d.status === 'ON_ROUTE' || d.status === 'COLLECTING');
  const avgFillRate = bins.length ? Math.round(bins.reduce((acc, b) => acc + b.fillLevel, 0) / bins.length) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Central Command Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Live urban sanitation intelligence, IoT telemetry mesh & fleet management
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid var(--border-accent)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: '#34d399',
            fontWeight: 600
          }}>
            <Radio size={16} /> Edge Gateway: Operational
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">Total Smart Bins</div>
            <div className="stat-value">{bins.length}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>
              Avg Fill: <strong style={{ color: 'var(--text-main)' }}>{avgFillRate}%</strong>
            </div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--primary)' }}>
            <Trash2 size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">Urgent / Critical Bins</div>
            <div className="stat-value" style={{ color: '#f87171' }}>{criticalBins.length}</div>
            <div style={{ fontSize: '12px', color: '#fca5a5', marginTop: '4px' }}>
              ≥ 80% Capacity Threshold
            </div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">Active Fleet Trucks</div>
            <div className="stat-value" style={{ color: 'var(--secondary)' }}>
              {activeDrivers.length} / {drivers.length}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>
              On Route / Collecting
            </div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--secondary)' }}>
            <Truck size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">CO2 Emission Saved</div>
            <div className="stat-value" style={{ color: '#34d399' }}>4.82 t</div>
            <div style={{ fontSize: '12px', color: '#6ee7b7', marginTop: '4px' }}>
              +14% route efficiency
            </div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Leaf size={24} />
          </div>
        </div>
      </div>

      {/* Interactive GIS City Map Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Metropolitan Sensor Map</h3>
          <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Click any node for real-time telemetry</span>
        </div>
        <MapView bins={bins} drivers={drivers} />
      </div>

      {/* Critical Bins Requiring Action */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>High Priority Overflow Alerts</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Bins exceeding capacity or showing sensor anomalies</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {criticalBins.map((bin) => (
            <BinCard 
              key={bin.id} 
              bin={bin} 
              onCollect={handleCollect}
              onRequestCollection={handleRequestCollection}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
