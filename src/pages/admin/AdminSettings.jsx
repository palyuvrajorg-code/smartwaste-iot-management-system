import React, { useState } from 'react';
import { Settings, Save, Bell, Radio, Shield, Check, Cpu } from 'lucide-react';

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState({
    criticalFillThreshold: 85,
    warningFillThreshold: 75,
    tiltAlertAngle: 15,
    methanePpmThreshold: 50,
    batteryAlertPercent: 20,
    mqttBrokerHost: 'mqtt.smartwaste.io:8883',
    telemetryIntervalSeconds: 15,
    fotaAutoUpdate: true,
    emergencyDispatcherWebhook: 'https://api.smartwaste.io/v1/dispatch/emergency'
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 800 }}>System Configuration & IoT Thresholds</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
          Tune edge firmware alert boundaries, telemetry intervals, and MQTT connection endpoints
        </p>
      </div>

      {saved && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 600,
          fontSize: '14px'
        }}>
          <Check size={18} /> Configuration successfully saved and broadcasted to ESP32 gateway mesh!
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Fill Level & Sensor Safety Limits */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <Radio size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Smart Bin Trigger Thresholds</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Critical Fill Level Alarm (%)</label>
              <input
                type="number"
                min="50"
                max="99"
                className="form-input"
                value={config.criticalFillThreshold}
                onChange={(e) => setConfig({ ...config, criticalFillThreshold: Number(e.target.value) })}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                Triggers immediate collection request dispatch to drivers.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Warning Fill Level (%)</label>
              <input
                type="number"
                min="30"
                max="90"
                className="form-input"
                value={config.warningFillThreshold}
                onChange={(e) => setConfig({ ...config, warningFillThreshold: Number(e.target.value) })}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                Flags bin in route planning algorithm.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">MPU6050 Tilt Anomaly Limit (Degrees)</label>
              <input
                type="number"
                min="5"
                max="45"
                className="form-input"
                value={config.tiltAlertAngle}
                onChange={(e) => setConfig({ ...config, tiltAlertAngle: Number(e.target.value) })}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                Detects knocked-over or vandalized bins.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">MQ-4 Gas / Methane Threshold (PPM)</label>
              <input
                type="number"
                min="10"
                max="200"
                className="form-input"
                value={config.methanePpmThreshold}
                onChange={(e) => setConfig({ ...config, methanePpmThreshold: Number(e.target.value) })}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                Detects hazardous decomposition or fire hazards.
              </span>
            </div>
          </div>
        </div>

        {/* MQTT & IoT Mesh Communication */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <Cpu size={20} color="var(--secondary)" />
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>IoT Hardware & Network Mesh</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">MQTT Broker URI (SSL/TLS)</label>
              <input
                type="text"
                className="form-input"
                value={config.mqttBrokerHost}
                onChange={(e) => setConfig({ ...config, mqttBrokerHost: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Telemetry Heartbeat Ping (Seconds)</label>
              <input
                type="number"
                min="5"
                max="300"
                className="form-input"
                value={config.telemetryIntervalSeconds}
                onChange={(e) => setConfig({ ...config, telemetryIntervalSeconds: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '12px' }}>
            <label className="form-label">Emergency Webhook Dispatch Endpoint</label>
            <input
              type="url"
              className="form-input"
              value={config.emergencyDispatcherWebhook}
              onChange={(e) => setConfig({ ...config, emergencyDispatcherWebhook: e.target.value })}
            />
          </div>
        </div>

        <div>
          <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }}>
            <Save size={18} /> Save System Settings
          </button>
        </div>
      </form>
    </div>
  );
}
