import React, { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle2, Truck, Clock, Filter, ArrowUpRight } from 'lucide-react';
import { binService, driverService } from '../../services/api';

export default function Collections() {
  const [bins, setBins] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    setBins(binService.getBins());
    setDrivers(driverService.getDrivers());
  }, []);

  const totalEmptied = bins.filter(b => b.fillLevel < 20).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: 800 }}>City Collection Stream Oversight</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
          Historical collection logs, vehicle weigh-in records & route completions
        </p>
      </div>

      <div className="glass-card table-container" style={{ padding: '0' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Live Collection Audit Log</h3>
          <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>
            ● Real-Time Database Sync
          </span>
        </div>

        <table className="modern-table">
          <thead>
            <tr>
              <th>Smart Bin Node</th>
              <th>District Zone</th>
              <th>Waste Stream</th>
              <th>Current Volume</th>
              <th>Status</th>
              <th>Last Serviced At</th>
            </tr>
          </thead>
          <tbody>
            {bins.map((bin) => (
              <tr key={bin.id}>
                <td>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                    {bin.id}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{bin.name}</div>
                </td>
                <td>{bin.zone}</td>
                <td>
                  <span style={{ fontSize: '13px' }}>{bin.type}</span>
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: bin.fillLevel >= 85 ? '#f87171' : '#34d399' }}>
                    {bin.fillLevel}% ({bin.currentLiters}L)
                  </span>
                </td>
                <td>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: bin.fillLevel < 20 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: bin.fillLevel < 20 ? '#34d399' : '#fbbf24'
                  }}>
                    {bin.fillLevel < 20 ? 'EMPTIED / NORMAL' : 'ACTIVE CYCLE'}
                  </span>
                </td>
                <td style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
                  {bin.lastEmptied}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
