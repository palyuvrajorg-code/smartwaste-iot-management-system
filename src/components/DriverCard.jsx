import React from 'react';
import { Truck, Phone, Star, Fuel, CheckCircle2, Navigation } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function DriverCard({ driver, onAssignBin, onContact }) {
  const progressPercent = Math.round((driver.collectionsCompleted / (driver.collectionsTarget || 20)) * 100);

  return (
    <div className="glass-card glass-card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header with avatar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src={driver.avatar} 
            alt={driver.name}
            style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--border-accent)' }}
          />
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc' }}>{driver.name}</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>{driver.zone}</span>
              <span>•</span>
              <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
                <Star size={12} fill="#fbbf24" /> {driver.rating}
              </span>
            </div>
          </div>
        </div>
        <StatusBadge status={driver.status} size="sm" />
      </div>

      {/* Vehicle Info Box */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        padding: '12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Truck size={18} color="var(--secondary)" />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>{driver.vehicleId}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{driver.vehicleModel}</div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#38bdf8', fontWeight: 600 }}>
            <Fuel size={13} /> {driver.fuelLevel}%
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Energy/Fuel</div>
        </div>
      </div>

      {/* Shift Collections Progress */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Shift Progress</span>
          <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
            {driver.collectionsCompleted} / {driver.collectionsTarget} ({progressPercent}%)
          </span>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${Math.min(progressPercent, 100)}%`, height: '100%', background: 'var(--primary)', borderRadius: '3px' }} />
        </div>
      </div>

      {/* Footer details & action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
          Assigned Bins: <strong style={{ color: '#fff' }}>{driver.assignedBins?.length || 0}</strong>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <a 
            href={`tel:${driver.phone}`} 
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Phone size={13} /> Call
          </a>
          {onAssignBin && (
            <button onClick={() => onAssignBin(driver.id)} className="btn btn-cyan btn-sm">
              Assign Bins
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
