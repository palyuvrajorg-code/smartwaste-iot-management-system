import React, { useState, useEffect } from 'react';
import { ClipboardList, Sparkles, AlertCircle, CheckCircle, X } from 'lucide-react';
import { binService, driverService } from '../../services/api';
import CollectionRequest from '../../components/CollectionRequest';

export default function CollectionRequests() {
  const [bins, setBins] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [filter, setFilter] = useState('ALL'); // ALL, URGENT, UNASSIGNED
  const [assignModalBinId, setAssignModalBinId] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setBins(binService.getBins());
    setDrivers(driverService.getDrivers());
  };

  const requestedBins = bins.filter((b) => b.collectionRequested || b.fillLevel >= 80);

  const filteredRequests = requestedBins.filter((b) => {
    if (filter === 'URGENT') return b.fillLevel >= 90;
    if (filter === 'UNASSIGNED') return !b.assignedDriverId;
    return true;
  });

  const handleComplete = (binId) => {
    binService.markCollected(binId);
    loadData();
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!assignModalBinId || !selectedDriverId) return;
    driverService.assignBinToDriver(selectedDriverId, assignModalBinId);
    setAssignModalBinId(null);
    loadData();
  };

  const handleAutoDispatch = () => {
    // Automatically match unassigned critical bins with active drivers
    const activeDriver = drivers.find((d) => d.status === 'ON_ROUTE' || d.status === 'COLLECTING') || drivers[0];
    if (!activeDriver) return;

    requestedBins.filter((b) => !b.assignedDriverId).forEach((bin) => {
      driverService.assignBinToDriver(activeDriver.id, bin.id);
    });
    loadData();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Collection Requests & Dispatch</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Smart bin overflow triggers, driver queue assignments & routing priorities
          </p>
        </div>

        <button onClick={handleAutoDispatch} className="btn btn-primary">
          <Sparkles size={18} /> Auto-Optimize & Dispatch All
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="glass-card" style={{ padding: '12px 16px', display: 'flex', gap: '10px' }}>
        {[
          { key: 'ALL', label: `All Requests (${requestedBins.length})` },
          { key: 'URGENT', label: `Emergency 90%+ (${requestedBins.filter(b => b.fillLevel >= 90).length})` },
          { key: 'UNASSIGNED', label: `Unassigned (${requestedBins.filter(b => !b.assignedDriverId).length})` }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className="btn btn-sm"
            style={{
              background: filter === tab.key ? 'var(--primary)' : 'transparent',
              color: filter === tab.key ? '#032b1d' : 'var(--text-muted)',
              border: filter === tab.key ? 'none' : '1px solid var(--border-subtle)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Requests Queue */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredRequests.map((bin) => (
          <CollectionRequest
            key={bin.id}
            bin={bin}
            drivers={drivers}
            onAssign={(binId) => {
              setAssignModalBinId(binId);
              setSelectedDriverId(drivers[0]?.id || '');
            }}
            onComplete={handleComplete}
          />
        ))}

        {filteredRequests.length === 0 && (
          <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
            <CheckCircle size={40} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>No pending collection requests</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              All smart bin nodes are within safe operational fill levels.
            </p>
          </div>
        )}
      </div>

      {/* Assign Driver Modal */}
      {assignModalBinId && (
        <div className="modal-overlay" onClick={() => setAssignModalBinId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Dispatch Driver to {assignModalBinId}</h3>
              <button 
                onClick={() => setAssignModalBinId(null)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Select Driver & Truck</label>
                  <select
                    className="form-select"
                    value={selectedDriverId}
                    onChange={(e) => setSelectedDriverId(e.target.value)}
                    required
                  >
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.vehicleId} - {d.status}) - {d.zone}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setAssignModalBinId(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Dispatch Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
