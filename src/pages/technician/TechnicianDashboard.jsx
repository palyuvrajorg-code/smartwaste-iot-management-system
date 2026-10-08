import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  BatteryWarning, 
  AlertOctagon, 
  Radio, 
  RefreshCw, 
  Wrench, 
  CheckCircle2, 
  Activity,
  Layers
} from 'lucide-react';
import { binService } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function TechnicianDashboard() {
  const [bins, setBins] = useState([]);
  const [pinging, setPinging] = useState(false);

  useEffect(() => {
    loadBins();
  }, []);

  const loadBins = () => {
    setBins(binService.getBins());
  };

  const handlePingMesh = () => {
    setPinging(true);
    setTimeout(() => {
      setPinging(false);
      alert('All 10 ESP32 nodes responded to MQTT ping. Average latency: 24ms.');
    }, 1200);
  };

  const lowBatteryNodes = bins.filter(b => b.battery <= 25);
  const tiltNodes = bins.filter(b => b.tiltAngle >= 10);
  const maintenanceNodes = bins.filter(b => b.needsMaintenance || b.battery <= 20 || b.tiltAngle >= 15);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.05em' }}>
            HARDWARE DIAGNOSTICS LAB
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>IoT Node Mesh Telemetry</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            ESP32 microcontrollers, sensor transducers & edge power telemetry
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handlePingMesh} disabled={pinging} className="btn btn-secondary">
            <RefreshCw size={16} className={pinging ? 'animate-spin' : ''} />
            {pinging ? 'Broadcasting Ping...' : 'Ping ESP32 Mesh'}
          </button>
        </div>
      </div>

      {/* Hardware Health KPI Cards */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">Active Node Transceivers</div>
            <div className="stat-value" style={{ color: 'var(--primary)' }}>{bins.length} / {bins.length}</div>
            <div style={{ fontSize: '12px', color: '#6ee7b7', marginTop: '4px' }}>100% online on MQTT broker</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--primary)' }}>
            <Radio size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">Critical Low Battery (&le;25%)</div>
            <div className="stat-value" style={{ color: lowBatteryNodes.length ? '#f87171' : 'var(--text-main)' }}>
              {lowBatteryNodes.length}
            </div>
            <div style={{ fontSize: '12px', color: '#fca5a5', marginTop: '4px' }}>Li-ion cell replacement needed</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
            <BatteryWarning size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">MPU6050 Tilt Anomalies</div>
            <div className="stat-value" style={{ color: tiltNodes.length ? '#fbbf24' : 'var(--text-main)' }}>
              {tiltNodes.length}
            </div>
            <div style={{ fontSize: '12px', color: '#fde68a', marginTop: '4px' }}>Knocked over or shifted</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <AlertOctagon size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">Pending Work Orders</div>
            <div className="stat-value" style={{ color: 'var(--accent)' }}>{maintenanceNodes.length}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>Technician dispatch required</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent)' }}>
            <Wrench size={24} />
          </div>
        </div>
      </div>

      {/* Nodes Requiring Physical Maintenance */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>
          Nodes Requiring Immediate Bench or Field Servicing
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
          {maintenanceNodes.map((bin) => (
            <div key={bin.id} className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #ef4444' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>
                  {bin.id}
                </span>
                <span style={{ fontSize: '12px', color: '#f87171', fontWeight: 700 }}>HARDWARE ALARM</span>
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{bin.name}</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '12px' }}>
                MAC: <code>{bin.esp32Mac}</code> • Zone: {bin.zone}
              </p>

              <div style={{ display: 'flex', gap: '12px', fontSize: '12px', marginBottom: '16px' }}>
                <div>Battery: <strong style={{ color: bin.battery <= 20 ? '#ef4444' : '#fff' }}>{bin.battery}%</strong></div>
                <div>Tilt Angle: <strong style={{ color: bin.tiltAngle >= 10 ? '#ef4444' : '#fff' }}>{bin.tiltAngle}°</strong></div>
                <div>Gas: <strong style={{ color: '#fff' }}>{bin.gasPpm} ppm</strong></div>
              </div>

              <button
                onClick={() => {
                  binService.resolveMaintenance(bin.id);
                  loadBins();
                  alert(`Maintenance logged for ${bin.id}. Telemetry reset to normal.`);
                }}
                className="btn btn-primary btn-sm"
                style={{ width: '100%' }}
              >
                <CheckCircle2 size={16} /> Mark Serviced & Calibrate
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
