import React from 'react';
import { AlertCircle, Clock, Truck, Check, UserPlus } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function CollectionRequest({ bin, drivers, onAssign, onComplete }) {
  const isUrgent = bin.fillLevel >= 90;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      gap: '16px',
      flexWrap: 'wrap'
    }}>
      {/* Bin info & priority */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '240px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          background: isUrgent ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
          border: `1px solid ${isUrgent ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isUrgent ? '#ef4444' : '#f59e0b',
          flexShrink: 0
        }}>
          <AlertCircle size={22} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '13px', color: 'var(--text-main)' }}>
              {bin.id}
            </span>
            <span style={{
              fontSize: '10px',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: '4px',
              background: isUrgent ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              color: isUrgent ? '#f87171' : '#fbbf24',
              textTransform: 'uppercase'
            }}>
              {isUrgent ? 'Emergency 90%+' : 'Standard Pickup'}
            </span>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>{bin.name}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{bin.zone} • Fill: <strong style={{ color: isUrgent ? '#f87171' : '#fbbf24' }}>{bin.fillLevel}%</strong></div>
        </div>
      </div>

      {/* Driver Assignment Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Truck size={16} color="var(--text-muted)" />
        {bin.assignedDriverId ? (
          <div style={{ fontSize: '13px', color: '#6ee7b7' }}>
            Assigned: <strong>{drivers.find(d => d.id === bin.assignedDriverId)?.name || bin.assignedDriverId}</strong>
          </div>
        ) : (
          <div style={{ fontSize: '13px', color: 'var(--warning)', fontWeight: 600 }}>
            Unassigned (Needs Dispatch)
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {onAssign && (
          <button 
            onClick={() => onAssign(bin.id)} 
            className="btn btn-secondary btn-sm"
          >
            <UserPlus size={14} /> Assign Driver
          </button>
        )}

        {onComplete && (
          <button 
            onClick={() => onComplete(bin.id)} 
            className="btn btn-primary btn-sm"
          >
            <Check size={14} /> Complete Pickup
          </button>
        )}
      </div>
    </div>
  );
}
