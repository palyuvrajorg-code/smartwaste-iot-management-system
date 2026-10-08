import React, { useState } from 'react';
import { AlertOctagon, ShieldAlert, CheckCircle, Flame, Battery, Compass } from 'lucide-react';

export default function SensorAlerts() {
  const [alerts, setAlerts] = useState([
    {
      id: 'ALT-101',
      nodeId: 'BIN-109',
      sensor: 'MPU6050 Accelerometer',
      severity: 'CRITICAL',
      reading: '18.4° Pitch Tilt',
      location: 'Industrial Logistics Gate 3',
      message: 'Bin orientation has exceeded 15° threshold. Probable physical tilt or tip-over event.',
      time: '14 mins ago',
      resolved: false
    },
    {
      id: 'ALT-102',
      nodeId: 'BIN-107',
      sensor: 'MQ-4 Combustible Gas',
      severity: 'WARNING',
      reading: '84 PPM Methane',
      location: 'Sunset Boardwalk Market',
      message: 'Decomposition vapor concentration spiked above normal background level.',
      time: '48 mins ago',
      resolved: false
    },
    {
      id: 'ALT-103',
      nodeId: 'BIN-105',
      sensor: 'Li-Ion BMS Voltage Divider',
      severity: 'WARNING',
      reading: '3.18V (18% SOC)',
      location: 'Pine Crest Medical Pavilion',
      message: 'Battery drop below operational voltage buffer. Solar trickle charging degraded.',
      time: '2 hours ago',
      resolved: false
    }
  ]);

  const handleResolve = (id) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Sensor Anomaly Alerts</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
          Physical tilt warnings, atmospheric gas spikes & sensor transducer diagnostics
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="glass-card"
            style={{
              padding: '20px',
              borderLeft: alert.severity === 'CRITICAL' ? '4px solid #ef4444' : '4px solid #f59e0b',
              opacity: alert.resolved ? 0.6 : 1
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: alert.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: alert.severity === 'CRITICAL' ? '#f87171' : '#fbbf24'
                }}>
                  {alert.severity}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>
                  {alert.nodeId}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>• {alert.location}</span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{alert.time}</span>
            </div>

            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>
              {alert.sensor}: <span style={{ color: alert.severity === 'CRITICAL' ? '#f87171' : '#fbbf24' }}>{alert.reading}</span>
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
              {alert.message}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {alert.resolved ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontSize: '13px', fontWeight: 600 }}>
                  <CheckCircle size={16} /> Acknowledged & Logged
                </span>
              ) : (
                <button onClick={() => handleResolve(alert.id)} className="btn btn-primary btn-sm">
                  <CheckCircle size={14} /> Clear & Recalibrate Anomaly
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
