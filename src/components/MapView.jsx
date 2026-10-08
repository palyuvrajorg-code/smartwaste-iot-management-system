import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  MapPin, 
  Truck, 
  Maximize2, 
  Filter, 
  Info,
  X,
  Battery,
  Thermometer,
  Trash2
} from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function MapView({ bins = [], drivers = [], onSelectBin }) {
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, CRITICAL, TRUCKS
  const [selectedPin, setSelectedPin] = useState(null);

  const filteredBins = bins.filter((b) => {
    if (activeFilter === 'CRITICAL') return b.fillLevel >= 80 || b.status === 'CRITICAL';
    return true;
  });

  const getPinColor = (bin) => {
    if (bin.fillLevel >= 90) return '#ef4444';
    if (bin.fillLevel >= 75) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="glass-card" style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
      {/* Top Map Toolbar */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        right: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 20,
        pointerEvents: 'none'
      }}>
        <div style={{
          background: 'rgba(11, 16, 29, 0.9)',
          backdropFilter: 'blur(12px)',
          padding: '6px 14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Compass size={16} color="var(--primary)" />
          <span style={{ fontSize: '13px', fontWeight: 700 }}>Metropolitan IoT GIS Map</span>
          <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>• Live GPS Telemetry</span>
        </div>

        {/* Filter Controls */}
        <div style={{
          background: 'rgba(11, 16, 29, 0.9)',
          backdropFilter: 'blur(12px)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          pointerEvents: 'auto',
          display: 'flex',
          gap: '4px'
        }}>
          {['ALL', 'CRITICAL', 'TRUCKS'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                background: activeFilter === f ? 'var(--primary)' : 'transparent',
                color: activeFilter === f ? '#032b1d' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '11px',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas Map Surface */}
      <div style={{
        width: '100%',
        height: '420px',
        background: '#070a14',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* SVG Decorative Grid & Roads */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <pattern id="city-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
            </pattern>
            <linearGradient id="bay-water" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#041624" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#082b45" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Grid Background */}
          <rect width="100%" height="100%" fill="url(#city-grid)" />

          {/* Coastline / Bay Area */}
          <path d="M 600 0 Q 700 200 650 420 L 1000 420 L 1000 0 Z" fill="url(#bay-water)" />

          {/* Major Expressways / Arterials */}
          <path d="M 0 140 Q 400 180 1000 120" fill="none" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="4" />
          <path d="M 320 0 Q 340 220 380 420" fill="none" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="4" />
          <path d="M 0 320 Q 500 280 1000 340" fill="none" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="3" />

          {/* Zone Labels */}
          <text x="60" y="80" fill="rgba(255,255,255,0.15)" fontSize="12" fontWeight="700">ZONE D (WEST END)</text>
          <text x="360" y="80" fill="rgba(255,255,255,0.15)" fontSize="12" fontWeight="700">ZONE A (DOWNTOWN)</text>
          <text x="560" y="80" fill="rgba(255,255,255,0.15)" fontSize="12" fontWeight="700">ZONE B (TECH HUB)</text>
          <text x="750" y="240" fill="rgba(6, 182, 212, 0.25)" fontSize="12" fontWeight="700">ZONE C (HARBORFRONT)</text>

          {/* Central Recycling Depot Pin */}
          <circle cx="50%" cy="50%" r="18" fill="rgba(16, 185, 129, 0.1)" stroke="var(--primary)" strokeWidth="2" strokeDasharray="3 3" />
        </svg>

        {/* Central Depot Landmark */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'none'
        }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.9)',
            color: '#032b1d',
            fontSize: '10px',
            fontWeight: 800,
            padding: '2px 6px',
            borderRadius: '4px',
            whiteSpace: 'nowrap'
          }}>
            HQ DEPOT
          </div>
        </div>

        {/* Smart Bins Pins */}
        {activeFilter !== 'TRUCKS' && filteredBins.map((bin) => {
          const pinColor = getPinColor(bin);
          const isCritical = bin.fillLevel >= 85;

          return (
            <div
              key={bin.id}
              onClick={() => {
                setSelectedPin(bin);
                if (onSelectBin) onSelectBin(bin);
              }}
              style={{
                position: 'absolute',
                top: `${bin.coords?.y || 50}%`,
                left: `${bin.coords?.x || 50}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'transform 0.2s ease'
              }}
              title={`${bin.name} (${bin.fillLevel}%)`}
            >
              {/* Pulsating Ping Aura if Critical */}
              {isCritical && (
                <div style={{
                  position: 'absolute',
                  inset: '-6px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.4)',
                  animation: 'ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite'
                }} />
              )}

              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'rgba(11, 16, 29, 0.95)',
                border: `2px solid ${pinColor}`,
                boxShadow: `0 0 12px ${pinColor}88`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: pinColor,
                fontSize: '10px',
                fontWeight: 800,
                position: 'relative'
              }}>
                {bin.fillLevel}%
              </div>
            </div>
          );
        })}

        {/* Fleet Trucks Pins */}
        {activeFilter !== 'CRITICAL' && drivers.filter(d => d.status !== 'OFF_DUTY').map((driver) => (
          <div
            key={driver.id}
            style={{
              position: 'absolute',
              top: `${driver.coords?.y || 40}%`,
              left: `${driver.coords?.x || 40}%`,
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              zIndex: 15
            }}
            title={`${driver.name} (${driver.vehicleId})`}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#06b6d4',
              color: '#04272e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.7)',
              border: '2px solid #fff'
            }}>
              <Truck size={18} strokeWidth={2.5} />
            </div>
            <div style={{
              position: 'absolute',
              top: '34px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.85)',
              color: '#38bdf8',
              fontSize: '9px',
              fontWeight: 800,
              padding: '1px 5px',
              borderRadius: '3px',
              whiteSpace: 'nowrap'
            }}>
              {driver.vehicleId}
            </div>
          </div>
        ))}

        {/* Selected Bin Popover Tooltip */}
        {selectedPin && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            maxWidth: '340px',
            background: 'rgba(14, 21, 38, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-accent)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 30
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 700 }}>
                  {selectedPin.id}
                </span>
                <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>{selectedPin.name}</h5>
              </div>
              <button 
                onClick={() => setSelectedPin(null)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
              <StatusBadge status={selectedPin.status} size="sm" />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Fill: <strong>{selectedPin.fillLevel}%</strong></span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '11px', color: 'var(--text-dim)' }}>
              <div>Battery: <strong style={{ color: '#fff' }}>{selectedPin.battery}%</strong></div>
              <div>Temp: <strong style={{ color: '#fff' }}>{selectedPin.temperature}°C</strong></div>
              <div>Tilt: <strong style={{ color: '#fff' }}>{selectedPin.tiltAngle}°</strong></div>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div style={{
        padding: '12px 20px',
        background: 'rgba(11, 16, 29, 0.95)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
            <span style={{ color: 'var(--text-muted)' }}>Normal (&lt;75%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ color: 'var(--text-muted)' }}>Warning (75-89%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ color: 'var(--text-muted)' }}>Critical / Overflow (90%+)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#06b6d4' }} />
            <span style={{ color: 'var(--text-muted)' }}>Active Compactor Fleet</span>
          </div>
        </div>

        <div style={{ color: 'var(--text-dim)', fontSize: '11px' }}>
          Total Deployed Nodes: <strong>{bins.length}</strong>
        </div>
      </div>
    </div>
  );
}
