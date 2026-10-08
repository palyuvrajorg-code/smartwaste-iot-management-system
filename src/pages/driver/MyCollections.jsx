import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Truck, MapPin, X } from 'lucide-react';
import { binService, driverService, authService } from '../../services/api';

export default function MyCollections() {
  const [driver, setDriver] = useState(null);
  const [bins, setBins] = useState([]);
  const [activeTab, setActiveTab] = useState('PENDING'); // PENDING or COMPLETED
  const [reportModalBin, setReportModalBin] = useState(null);
  const [issueReason, setIssueReason] = useState('BLOCKED_BY_CAR');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const user = authService.getCurrentUser();
    const drivers = driverService.getDrivers();
    const current = drivers.find(d => d.email === user?.email) || drivers[0];
    setDriver(current);

    const allBins = binService.getBins();
    setBins(allBins);
  };

  const handleMarkCollected = (binId) => {
    if (!driver) return;
    binService.markCollected(binId, driver.id);
    loadData();
  };

  const handleReportIssue = (e) => {
    e.preventDefault();
    alert(`Report sent for ${reportModalBin?.name}: "${issueReason}". Supervisor notified.`);
    setReportModalBin(null);
  };

  // Full bins that need collection
  const pendingBins = bins.filter(b => b.collectionRequested || b.status === 'CRITICAL' || b.status === 'WARNING');
  const completedBins = bins.filter(b => b.status === 'NORMAL' && b.lastEmptied !== 'Never');

  const getWasteLabel = (type) => {
    if (type?.toLowerCase().includes('plastic') || type?.toLowerCase().includes('recycl')) return '♻️ Plastic & Bottles';
    if (type?.toLowerCase().includes('organic') || type?.toLowerCase().includes('food')) return '🍏 Food & Organic';
    if (type?.toLowerCase().includes('paper')) return '📦 Paper & Cardboard';
    return '🗑️ General Garbage';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div>
        <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Pickup Checklist</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
          List of all full bins waiting for truck {driver?.vehicleId}
        </p>
      </div>

      {/* Simple Big Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        background: 'rgba(16, 23, 41, 0.8)',
        padding: '6px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}>
        <button
          onClick={() => setActiveTab('PENDING')}
          style={{
            flex: 1,
            padding: '12px',
            fontSize: '15px',
            fontWeight: 800,
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            cursor: 'pointer',
            transition: 'var(--transition)',
            background: activeTab === 'PENDING' ? '#ef4444' : 'transparent',
            color: activeTab === 'PENDING' ? '#ffffff' : 'var(--text-muted)'
          }}
        >
          🚨 Full Bins to Collect ({pendingBins.length})
        </button>

        <button
          onClick={() => setActiveTab('COMPLETED')}
          style={{
            flex: 1,
            padding: '12px',
            fontSize: '15px',
            fontWeight: 800,
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            cursor: 'pointer',
            transition: 'var(--transition)',
            background: activeTab === 'COMPLETED' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'COMPLETED' ? '#032b1d' : 'var(--text-muted)'
          }}
        >
          ✅ Finished Today ({completedBins.length})
        </button>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {(activeTab === 'PENDING' ? pendingBins : completedBins).map((bin) => (
          <div
            key={bin.id}
            style={{
              background: 'rgba(16, 23, 41, 0.85)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: activeTab === 'PENDING' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                color: activeTab === 'PENDING' ? '#f87171' : '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px'
              }}>
                {activeTab === 'PENDING' ? '🚨' : '✅'}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: activeTab === 'PENDING' ? '#ef4444' : 'rgba(16, 185, 129, 0.2)',
                    color: activeTab === 'PENDING' ? '#fff' : '#34d399',
                    letterSpacing: '0.04em'
                  }}>
                    {activeTab === 'PENDING' ? 'FULL - READY' : 'COLLECTED'}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>{bin.zone}</span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                  {bin.name}
                </h3>

                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {getWasteLabel(bin.type)}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {activeTab === 'PENDING' ? (
                <>
                  <button
                    onClick={() => setReportModalBin(bin)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '10px 14px', fontSize: '13px' }}
                  >
                    <AlertTriangle size={15} color="#fbbf24" /> Report Blocked
                  </button>

                  <button
                    onClick={() => handleMarkCollected(bin.id)}
                    className="btn btn-primary"
                    style={{ padding: '10px 18px', fontSize: '14px', fontWeight: 800 }}
                  >
                    <CheckCircle2 size={18} /> Mark Emptied
                  </button>
                </>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#34d399',
                  fontSize: '14px',
                  fontWeight: 700,
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '6px 14px',
                  borderRadius: '8px'
                }}>
                  <CheckCircle2 size={16} /> Emptied at {bin.lastEmptied}
                </div>
              )}
            </div>
          </div>
        ))}

        {(activeTab === 'PENDING' ? pendingBins : completedBins).length === 0 && (
          <div style={{
            background: 'rgba(16, 23, 41, 0.6)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '40px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '16px', color: 'var(--text-muted)' }}>
              No bins in this list right now.
            </p>
          </div>
        )}
      </div>

      {/* Report Obstacle Modal */}
      {reportModalBin && (
        <div className="modal-overlay" onClick={() => setReportModalBin(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Report a Problem</h3>
              <button 
                onClick={() => setReportModalBin(null)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleReportIssue}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Bin Location</label>
                  <input className="form-input" disabled value={reportModalBin.name} />
                </div>
                <div className="form-group">
                  <label className="form-label">What is the problem?</label>
                  <select
                    className="form-select"
                    value={issueReason}
                    onChange={(e) => setIssueReason(e.target.value)}
                  >
                    <option value="BLOCKED_BY_CAR">🚗 Car parked in front of bin</option>
                    <option value="ROAD_CLOSED">🚧 Road closed or blocked</option>
                    <option value="BIN_BROKEN">⚠️ Bin lid is stuck or broken</option>
                    <option value="OTHER">❓ Other issue</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setReportModalBin(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger">
                  Send Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
