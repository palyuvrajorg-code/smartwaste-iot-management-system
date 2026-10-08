import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle2, Star, Fuel, UserPlus, X, AlertCircle } from 'lucide-react';
import { driverService, binService } from '../../services/api';
import DriverCard from '../../components/DriverCard';
import StatusBadge from '../../components/StatusBadge';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [bins, setBins] = useState([]);
  const [assigningDriverId, setAssigningDriverId] = useState(null);
  const [selectedBinId, setSelectedBinId] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setDrivers(driverService.getDrivers());
    setBins(binService.getBins());
  };

  const handleOpenAssignModal = (driverId) => {
    setAssigningDriverId(driverId);
    setSelectedBinId('');
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!selectedBinId || !assigningDriverId) return;
    driverService.assignBinToDriver(assigningDriverId, selectedBinId);
    setAssigningDriverId(null);
    loadData();
  };

  const unassignedCriticalBins = bins.filter((b) => b.collectionRequested && !b.assignedDriverId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Fleet & Driver Roster</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Sanitation compactor vehicles, active route assignments & performance metrics
          </p>
        </div>
      </div>

      {/* Driver Summary KPI Bar */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">Total Fleet Drivers</div>
            <div className="stat-value">{drivers.length}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>All operational shifts</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--secondary)' }}>
            <Truck size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">Currently On Route</div>
            <div className="stat-value" style={{ color: '#34d399' }}>
              {drivers.filter(d => d.status === 'ON_ROUTE' || d.status === 'COLLECTING').length}
            </div>
            <div style={{ fontSize: '12px', color: '#6ee7b7', marginTop: '4px' }}>Active GPS telemetry</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--primary)' }}>
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">Pending Unassigned Dispatches</div>
            <div className="stat-value" style={{ color: unassignedCriticalBins.length ? '#f87171' : 'var(--text-main)' }}>
              {unassignedCriticalBins.length}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>Require driver assignment</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
            <AlertCircle size={24} />
          </div>
        </div>
      </div>

      {/* Drivers Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {drivers.map((driver) => (
          <DriverCard 
            key={driver.id} 
            driver={driver} 
            onAssignBin={handleOpenAssignModal}
          />
        ))}
      </div>

      {/* Assign Bin Modal */}
      {assigningDriverId && (
        <div className="modal-overlay" onClick={() => setAssigningDriverId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>
                Assign Route Node to {drivers.find(d => d.id === assigningDriverId)?.name}
              </h3>
              <button 
                onClick={() => setAssigningDriverId(null)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Select Smart Bin to Append to Route Queue</label>
                  <select 
                    className="form-select"
                    value={selectedBinId}
                    onChange={(e) => setSelectedBinId(e.target.value)}
                    required
                  >
                    <option value="">-- Choose Bin Node --</option>
                    {bins.map((bin) => (
                      <option key={bin.id} value={bin.id}>
                        {bin.id} - {bin.name} ({bin.fillLevel}% Full - {bin.zone})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setAssigningDriverId(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={!selectedBinId}>
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
