import React, { useState, useEffect } from 'react';
import { User, Truck, Star, Phone, Mail, Award, Clock } from 'lucide-react';
import { authService, driverService } from '../../services/api';

export default function DriverProfile() {
  const [driver, setDriver] = useState(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    const drivers = driverService.getDrivers();
    setDriver(drivers.find(d => d.email === user?.email) || drivers[0]);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Driver Card Header */}
      <div style={{
        background: 'rgba(16, 23, 41, 0.85)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        flexWrap: 'wrap'
      }}>
        <img
          src={driver?.avatar}
          alt={driver?.name}
          style={{ width: '84px', height: '84px', borderRadius: '18px', objectFit: 'cover', border: '3px solid var(--secondary)' }}
        />
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--secondary)', padding: '3px 10px', borderRadius: '20px', fontWeight: 800 }}>
              TRUCK DRIVER
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{driver?.zone}</span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800 }}>{driver?.name}</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '14px', marginTop: '2px' }}>
            Assigned Vehicle: <strong style={{ color: '#fff' }}>{driver?.vehicleId}</strong>
          </p>
        </div>
      </div>

      {/* Simple Stats for Driver */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{
          background: 'rgba(16, 23, 41, 0.8)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
            Pickups Finished Today
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
            {driver?.collectionsCompleted || 0}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Full bins emptied on your route
          </div>
        </div>

        <div style={{
          background: 'rgba(16, 23, 41, 0.8)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
            Driver Rating
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
            ★ {driver?.rating}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Top reliability score
          </div>
        </div>

        <div style={{
          background: 'rgba(16, 23, 41, 0.8)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
            Work Shift
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', marginTop: '8px' }}>
            {driver?.shift}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Active duty hours
          </div>
        </div>
      </div>

      {/* Contact & Support */}
      <div style={{
        background: 'rgba(16, 23, 41, 0.8)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px'
      }}>
        <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '14px' }}>My Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '14px' }}>
          <div>
            <div style={{ color: 'var(--text-dim)', fontSize: '12px' }}>Phone Number</div>
            <div style={{ fontWeight: 600, marginTop: '2px' }}>{driver?.phone}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-dim)', fontSize: '12px' }}>Email Address</div>
            <div style={{ fontWeight: 600, marginTop: '2px' }}>{driver?.email}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-dim)', fontSize: '12px' }}>Truck Model</div>
            <div style={{ fontWeight: 600, marginTop: '2px' }}>{driver?.vehicleModel}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
