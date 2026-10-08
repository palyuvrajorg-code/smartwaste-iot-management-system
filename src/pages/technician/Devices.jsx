import React, { useState, useEffect } from 'react';
import { Cpu, RotateCcw, Wrench, Wifi, Battery, Search } from 'lucide-react';
import { binService } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function Devices() {
  const [bins, setBins] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setBins(binService.getBins());
  }, []);

  const handleReboot = (binId) => {
    alert(`Sent remote OTA Soft-Reboot command to ESP32 node on ${binId}. Rebooting in 3 seconds...`);
  };

  const handleCalibrate = (binId) => {
    alert(`Calibration tare signal sent to Ultrasonic HC-SR04 on ${binId}. Empty baseline set to 100cm.`);
  };

  const filtered = bins.filter(b => 
    b.id.toLowerCase().includes(search.toLowerCase()) || 
    b.esp32Mac.toLowerCase().includes(search.toLowerCase()) ||
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 800 }}>ESP32 Edge Devices & Gateways</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
          Physical hardware nodes, transducer pins & network transceivers
        </p>
      </div>

      {/* Search */}
      <div className="glass-card" style={{ padding: '16px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            className="form-input"
            style={{ width: '100%', paddingLeft: '38px' }}
            placeholder="Search by Node ID, MAC address, or deployment site..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table view */}
      <div className="glass-card table-container" style={{ padding: '0' }}>
        <table className="modern-table">
          <thead>
            <tr>
              <th>Node ID & Site</th>
              <th>ESP32 MAC</th>
              <th>Sensor Suite</th>
              <th>Battery</th>
              <th>Signal</th>
              <th>Firmware</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((bin) => (
              <tr key={bin.id}>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{bin.id}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{bin.name}</div>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                  {bin.esp32Mac}
                </td>
                <td>
                  <div style={{ fontSize: '12px' }}>
                    <div>HC-SR04 • DHT22</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '11px' }}>MPU6050 • MQ-4</div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: bin.battery <= 25 ? '#ef4444' : '#34d399' }}>
                    <Battery size={14} /> {bin.battery}%
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6ee7b7' }}>
                    <Wifi size={14} /> {bin.rssi} dBm
                  </div>
                </td>
                <td style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                  {bin.firmware}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleReboot(bin.id)}
                      className="btn btn-secondary btn-sm"
                      title="Remote soft reboot"
                    >
                      <RotateCcw size={13} /> Reboot
                    </button>
                    <button
                      onClick={() => handleCalibrate(bin.id)}
                      className="btn btn-cyan btn-sm"
                      title="Calibrate ultrasonic sensor zero"
                    >
                      <Wrench size={13} /> Calibrate
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
