import React from 'react';
import { 
  Trash2, 
  Battery, 
  Thermometer, 
  Wifi, 
  Compass, 
  CheckCircle, 
  Truck,
  AlertTriangle
} from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function BinCard({ bin, onCollect, onRequestCollection, onInspect }) {
  const getFillColor = (fill) => {
    if (fill >= 90) return 'linear-gradient(90deg, #ef4444, #f87171)';
    if (fill >= 75) return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
    return 'linear-gradient(90deg, #10b981, #34d399)';
  };

  const getBatteryColor = (bat) => {
    if (bat <= 20) return '#ef4444';
    if (bat <= 50) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="glass-card glass-card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: '12px', 
              fontWeight: 700, 
              color: 'var(--primary)',
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '2px 8px',
              borderRadius: '6px'
            }}>
              {bin.id}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{bin.zone}</span>
          </div>
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', lineHeight: 1.3 }}>
            {bin.name}
          </h4>
        </div>
        <StatusBadge status={bin.status} size="sm" />
      </div>

      {/* Fill Level Meter */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
            {bin.type} ({bin.currentLiters}L / {bin.capacityLiters}L)
          </span>
          <span style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '18px', 
            fontWeight: 800,
            color: bin.fillLevel >= 90 ? '#f87171' : bin.fillLevel >= 75 ? '#fbbf24' : '#34d399'
          }}>
            {bin.fillLevel}%
          </span>
        </div>

        <div style={{
          width: '100%',
          height: '10px',
          background: 'rgba(255, 255, 255, 0.06)',
          borderRadius: '5px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            height: '100%',
            width: `${bin.fillLevel}%`,
            background: getFillColor(bin.fillLevel),
            borderRadius: '5px',
            transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: bin.fillLevel >= 90 ? '0 0 10px rgba(239, 68, 68, 0.6)' : 'none'
          }} />
        </div>
      </div>

      {/* Sensor Telemetry Pill Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        background: 'rgba(255, 255, 255, 0.02)',
        padding: '10px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(255, 255, 255, 0.04)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', color: getBatteryColor(bin.battery) }}>
            <Battery size={13} />
            <span style={{ fontSize: '11px', fontWeight: 700 }}>{bin.battery}%</span>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>Battery</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', color: '#60a5fa' }}>
            <Thermometer size={13} />
            <span style={{ fontSize: '11px', fontWeight: 700 }}>{bin.temperature}°C</span>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>Temp</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', color: bin.tiltAngle > 10 ? '#f87171' : '#c084fc' }}>
            <Compass size={13} />
            <span style={{ fontSize: '11px', fontWeight: 700 }}>{bin.tiltAngle}°</span>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>Tilt</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', color: '#34d399' }}>
            <Wifi size={13} />
            <span style={{ fontSize: '11px', fontWeight: 700 }}>{bin.rssi}</span>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>dBm</div>
        </div>
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
          Emptied: {bin.lastEmptied}
        </span>

        <div style={{ display: 'flex', gap: '6px' }}>
          {bin.collectionRequested ? (
            <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Truck size={13} /> Dispatched
            </span>
          ) : (
            onRequestCollection && (
              <button 
                onClick={() => onRequestCollection(bin.id)} 
                className="btn btn-secondary btn-sm"
                title="Dispatch collection truck"
              >
                Dispatch
              </button>
            )
          )}

          {onCollect && (
            <button 
              onClick={() => onCollect(bin.id)} 
              className="btn btn-primary btn-sm"
              title="Mark as emptied"
            >
              <CheckCircle size={14} /> Emptied
            </button>
          )}

          {onInspect && (
            <button 
              onClick={() => onInspect(bin)} 
              className="btn btn-secondary btn-sm"
            >
              Telemetry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
