import React, { useState, useEffect } from 'react';
import { Truck, Phone, Radio, MapPin, Gauge, Star, Fuel } from 'lucide-react';
import { driverService } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function SupervisorDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  useEffect(() => {
    setDrivers(driverService.getDrivers());
  }, []);

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMessage) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastMessage('');
    }, 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Driver Fleet Telemetry & Dispatch</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
          Real-time compactor vehicle tracking, speeds, fuel efficiency & radio broadcast
        </p>
      </div>

      {/* Broadcast Message to All Drivers */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio size={18} color="var(--primary)" /> Broadcast Dispatch Bulletin to Fleet Cabins
        </h3>
        <form onSubmit={handleBroadcast} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-input"
            style={{ flex: 1, minWidth: '260px' }}
            placeholder="Type priority dispatch notice (e.g. Heavy rain alert on Harborfront route)..."
            value={broadcastMessage}
            onChange={(e) => setBroadcastMessage(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Transmit to All Trucks
          </button>
        </form>
        {broadcastSent && (
          <div style={{ marginTop: '10px', fontSize: '13px', color: '#34d399', fontWeight: 600 }}>
            ✓ Bulletin transmitted to all active compactor cabin terminals!
          </div>
        )}
      </div>

      {/* Fleet Live Tracking Table */}
      <div className="glass-card table-container" style={{ padding: '0' }}>
        <table className="modern-table">
          <thead>
            <tr>
              <th>Operator</th>
              <th>Vehicle ID & Model</th>
              <th>Assigned Zone</th>
              <th>Current Speed</th>
              <th>Battery / Fuel</th>
              <th>Status</th>
              <th>Performance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img 
                      src={driver.avatar} 
                      alt={driver.name} 
                      style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700 }}>{driver.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{driver.id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--secondary)' }}>{driver.vehicleId}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{driver.vehicleModel}</div>
                </td>
                <td>{driver.zone}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    <Gauge size={14} color="var(--text-dim)" />
                    <span>{driver.speedKmh} km/h</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38bdf8', fontWeight: 600 }}>
                    <Fuel size={14} /> {driver.fuelLevel}%
                  </div>
                </td>
                <td>
                  <StatusBadge status={driver.status} size="sm" />
                </td>
                <td>
                  <span style={{ color: '#fbbf24', fontWeight: 700 }}>★ {driver.rating}</span>
                </td>
                <td>
                  <a href={`tel:${driver.phone}`} className="btn btn-secondary btn-sm">
                    <Phone size={13} /> Direct Line
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
