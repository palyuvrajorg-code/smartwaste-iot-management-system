import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Search, 
  Filter, 
  Plus, 
  X, 
  CheckCircle, 
  Cpu, 
  Battery, 
  Thermometer, 
  Compass, 
  Wifi,
  Sparkles
} from 'lucide-react';
import { binService } from '../../services/api';
import BinCard from '../../components/BinCard';
import StatusBadge from '../../components/StatusBadge';

export default function SmartBins() {
  const [bins, setBins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [zoneFilter, setZoneFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [inspectedBin, setInspectedBin] = useState(null);

  // New bin form state
  const [newBin, setNewBin] = useState({
    name: '',
    zone: 'Zone A - Downtown',
    type: 'General Waste',
    fillLevel: 25,
    capacityLiters: 240
  });

  useEffect(() => {
    loadBins();
  }, []);

  const loadBins = () => {
    setBins(binService.getBins());
  };

  const handleCollect = (binId) => {
    binService.markCollected(binId);
    loadBins();
  };

  const handleRequestCollection = (binId) => {
    binService.requestCollection(binId);
    loadBins();
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newBin.name) return;
    binService.addBin({
      name: newBin.name,
      zone: newBin.zone,
      type: newBin.type,
      fillLevel: Number(newBin.fillLevel),
      capacityLiters: Number(newBin.capacityLiters),
      currentLiters: Math.round((Number(newBin.fillLevel) / 100) * Number(newBin.capacityLiters))
    });
    setShowAddModal(false);
    setNewBin({
      name: '',
      zone: 'Zone A - Downtown',
      type: 'General Waste',
      fillLevel: 25,
      capacityLiters: 240
    });
    loadBins();
  };

  const filteredBins = bins.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.zone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesZone = zoneFilter === 'ALL' || b.zone === zoneFilter;
    return matchesSearch && matchesStatus && matchesZone;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Smart Bins Fleet</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Ultrasonic fill sensors, telemetry diagnostics & deployment records
          </p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)} 
          className="btn btn-primary"
        >
          <Plus size={18} /> Deploy Smart Bin
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            className="form-input"
            style={{ width: '100%', paddingLeft: '38px' }}
            placeholder="Search by Bin ID (e.g. BIN-101), location, or zone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select 
            className="form-select" 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="NORMAL">Normal (&lt;75%)</option>
            <option value="WARNING">Warning (75-89%)</option>
            <option value="CRITICAL">Critical (90%+)</option>
          </select>

          <select 
            className="form-select" 
            value={zoneFilter} 
            onChange={(e) => setZoneFilter(e.target.value)}
          >
            <option value="ALL">All Zones</option>
            <option value="Zone A - Downtown">Zone A - Downtown</option>
            <option value="Zone B - Tech Hub">Zone B - Tech Hub</option>
            <option value="Zone C - Harborfront">Zone C - Harborfront</option>
            <option value="Zone D - West End">Zone D - West End</option>
          </select>
        </div>
      </div>

      {/* Bins Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {filteredBins.map((bin) => (
          <BinCard
            key={bin.id}
            bin={bin}
            onCollect={handleCollect}
            onRequestCollection={handleRequestCollection}
            onInspect={(b) => setInspectedBin(b)}
          />
        ))}
      </div>

      {filteredBins.length === 0 && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Trash2 size={48} color="var(--text-dim)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>No smart bins match filter criteria</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Try adjusting your search query or status filter.
          </p>
        </div>
      )}

      {/* Deploy Bin Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Deploy New Smart Bin Node</h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Location / Landmark Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. City Hall Plaza - West Arcade"
                    value={newBin.name}
                    onChange={(e) => setNewBin({ ...newBin, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Zone</label>
                  <select
                    className="form-select"
                    value={newBin.zone}
                    onChange={(e) => setNewBin({ ...newBin, zone: e.target.value })}
                  >
                    <option value="Zone A - Downtown">Zone A - Downtown</option>
                    <option value="Zone B - Tech Hub">Zone B - Tech Hub</option>
                    <option value="Zone C - Harborfront">Zone C - Harborfront</option>
                    <option value="Zone D - West End">Zone D - West End</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Waste Stream Type</label>
                  <select
                    className="form-select"
                    value={newBin.type}
                    onChange={(e) => setNewBin({ ...newBin, type: e.target.value })}
                  >
                    <option value="General Waste">General Waste</option>
                    <option value="Recyclable Plastic & Metal">Recyclable Plastic & Metal</option>
                    <option value="Paper & Cardboard">Paper & Cardboard</option>
                    <option value="Organic Waste">Organic Waste</option>
                    <option value="Hazardous / Electronic">Hazardous / Electronic</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Capacity (Liters)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={newBin.capacityLiters}
                      onChange={(e) => setNewBin({ ...newBin, capacityLiters: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Initial Fill %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="form-input"
                      value={newBin.fillLevel}
                      onChange={(e) => setNewBin({ ...newBin, fillLevel: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Deploy Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Telemetry Diagnostics Modal */}
      {inspectedBin && (
        <div className="modal-overlay" onClick={() => setInspectedBin(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>
                    {inspectedBin.id}
                  </span>
                  <StatusBadge status={inspectedBin.status} size="sm" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginTop: '4px' }}>
                  {inspectedBin.name}
                </h3>
              </div>
              <button 
                onClick={() => setInspectedBin(null)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Hardware Module Info */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                fontSize: '13px'
              }}>
                <div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '11px' }}>ESP32 MAC ADDRESS</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--secondary)' }}>
                    {inspectedBin.esp32Mac}
                  </div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '11px' }}>FIRMWARE VERSION</div>
                  <div style={{ fontWeight: 600 }}>{inspectedBin.firmware}</div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '11px' }}>RSSI SIGNAL STRENGTH</div>
                  <div style={{ fontWeight: 600, color: '#34d399' }}>{inspectedBin.rssi} dBm (Strong)</div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '11px' }}>LAST TELEMETRY PACKET</div>
                  <div style={{ fontWeight: 600 }}>{inspectedBin.lastTelemetry}</div>
                </div>
              </div>

              {/* Sensor Readings Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#60a5fa', marginBottom: '6px' }}>
                    <Thermometer size={16} />
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>DHT22 Temperature & Humidity</span>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800 }}>{inspectedBin.temperature}°C / {inspectedBin.humidity}%</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc', marginBottom: '6px' }}>
                    <Compass size={16} />
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>MPU6050 Accelerometer / Tilt</span>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800 }}>{inspectedBin.tiltAngle}°</div>
                </div>
              </div>

              {/* Methane & Fill Levels */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Ultrasonic HC-SR04 Fill Calculation</span>
                  <span style={{ fontWeight: 700, color: inspectedBin.fillLevel >= 85 ? '#f87171' : '#34d399' }}>
                    {inspectedBin.fillLevel}% ({inspectedBin.currentLiters}L / {inspectedBin.capacityLiters}L)
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${inspectedBin.fillLevel}%`, height: '100%', background: inspectedBin.fillLevel >= 85 ? '#ef4444' : '#10b981' }} />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setInspectedBin(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
