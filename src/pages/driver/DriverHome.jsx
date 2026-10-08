import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Navigation, 
  CheckCircle2, 
  MapPin, 
  Bell, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { binService, driverService, authService } from '../../services/api';

export default function DriverHome() {
  const [driver, setDriver] = useState(null);
  const [assignedBins, setAssignedBins] = useState([]);
  const [justCollected, setJustCollected] = useState(null);
  const [bridgeConnected, setBridgeConnected] = useState(false);

  useEffect(() => {
    loadData();

    // Connect to live ESP32 Bridge SSE Stream
    let eventSource;
    try {
      eventSource = new EventSource('http://localhost:5000/api/events');

      eventSource.onopen = () => {
        setBridgeConnected(true);
      };

      eventSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.type === 'BIN_FULL') {
            // Update bin in service as collection requested / full
            binService.requestCollection(data.binId);
            // Add driver notification
            notificationService.addNotification({
              targetRole: 'DRIVER',
              type: 'CRITICAL',
              title: `🚨 Full Bin Alert: ${data.binId}`,
              message: `Smart Bin ${data.binId} is now FULL and has been added to your route!`
            });
            loadData();
          }
        } catch (err) {
          console.error('Error parsing SSE event:', err);
        }
      };

      eventSource.onerror = () => {
        setBridgeConnected(false);
      };
    } catch (e) {
      console.log('ESP32 Bridge not running locally yet.');
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  const loadData = () => {
    const user = authService.getCurrentUser();
    const drivers = driverService.getDrivers();
    const current = drivers.find(d => d.email === user?.email) || drivers[0];
    setDriver(current);

    const bins = binService.getBins();
    // Show bins that are full (critical or collection requested)
    const fullBins = bins.filter(b => 
      b.collectionRequested || 
      b.status === 'CRITICAL' || 
      b.status === 'WARNING' ||
      current.assignedBins?.includes(b.id)
    );
    setAssignedBins(fullBins);
  };

  const handleMarkCollected = (binId, binName) => {
    if (!driver) return;
    binService.markCollected(binId, driver.id);
    setJustCollected(binName);
    loadData();
    setTimeout(() => setJustCollected(null), 4000);
  };

  const currentPickup = assignedBins[0];

  const getWasteIcon = (type) => {
    if (type?.toLowerCase().includes('plastic') || type?.toLowerCase().includes('recycl')) return '♻️ Recyclable';
    if (type?.toLowerCase().includes('organic') || type?.toLowerCase().includes('food')) return '🍏 Food / Organic';
    if (type?.toLowerCase().includes('paper')) return '📦 Paper / Boxes';
    return '🗑️ General Waste';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Top Welcome & Truck Info */}
      <div style={{
        background: 'rgba(16, 23, 41, 0.85)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #06b6d4, #0284c7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Truck size={26} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Hello, {driver?.name}</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc' }}>
              Truck: <span style={{ color: 'var(--secondary)' }}>{driver?.vehicleId}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '11px' }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: bridgeConnected ? '#10b981' : '#f59e0b',
                boxShadow: bridgeConnected ? '0 0 6px #10b981' : 'none'
              }} />
              <span style={{ color: bridgeConnected ? '#6ee7b7' : 'var(--text-dim)', fontWeight: 600 }}>
                {bridgeConnected ? 'ESP32 Bridge: Connected (Port 5000)' : 'ESP32 Bridge: Offline (Run node esp32-bridge.js)'}
              </span>
            </div>
          </div>
        </div>

        {/* Simple Counts */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Waiting Now</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#f87171' }}>
              {assignedBins.length} Full Bins
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Done Today</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>
              {driver?.collectionsCompleted || 0} Pickups
            </div>
          </div>
        </div>
      </div>

      {/* Success Banner when collected */}
      {justCollected && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#34d399',
          padding: '14px 20px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 700,
          fontSize: '15px'
        }}>
          <CheckCircle2 size={20} />
          <span>Great work! {justCollected} is marked emptied. Route updated.</span>
        </div>
      )}

      {/* MAIN TASK: Next Full Bin Notification Card */}
      {currentPickup ? (
        <div style={{
          background: 'radial-gradient(ellipse at 90% 10%, rgba(239, 68, 68, 0.15) 0%, rgba(16, 23, 41, 0.95) 75%)',
          border: '2px solid rgba(239, 68, 68, 0.4)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(239, 68, 68, 0.15)'
        }}>
          {/* Urgent Notification Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#ef4444',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 800,
              padding: '6px 12px',
              borderRadius: '20px',
              letterSpacing: '0.04em'
            }}>
              <Bell size={14} /> NEW NOTIFICATION: BIN IS FULL
            </div>

            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
              Assigned to your truck
            </span>
          </div>

          {/* Place Name in large, clear text */}
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', lineHeight: 1.25, marginBottom: '8px' }}>
            {currentPickup.name}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '15px', marginBottom: '18px' }}>
            <MapPin size={18} color="#f87171" />
            <span>{currentPickup.zone}</span>
          </div>

          {/* Simple Waste Category Box */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: 600 }}>WASTE TYPE</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
                {getWasteIcon(currentPickup.type)}
              </div>
            </div>

            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '6px 14px',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '13px'
            }}>
              NEEDS EMPTYING
            </div>
          </div>

          {/* Big, Easy Touch Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <button
              onClick={() => handleMarkCollected(currentPickup.id, currentPickup.name)}
              className="btn btn-primary"
              style={{
                padding: '18px 24px',
                fontSize: '17px',
                fontWeight: 800,
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
              }}
            >
              <CheckCircle2 size={24} /> Mark as Collected
            </button>

            <button
              onClick={() => alert(`Starting GPS route to: ${currentPickup.name}`)}
              className="btn btn-secondary"
              style={{
                padding: '18px 24px',
                fontSize: '17px',
                fontWeight: 700,
                borderRadius: 'var(--radius-lg)'
              }}
            >
              <Navigation size={22} color="var(--secondary)" /> Start GPS Route
            </button>
          </div>
        </div>
      ) : (
        /* No Full Bins Screen */
        <div style={{
          background: 'rgba(16, 23, 41, 0.75)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '50px 24px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <CheckCircle2 size={36} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>
            All Assigned Bins Are Clean!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '420px', margin: '0 auto' }}>
            There are no full bins waiting for your truck right now. You will be automatically notified here as soon as a bin fills up.
          </p>
        </div>
      )}

      {/* Upcoming Full Bins In Queue */}
      {assignedBins.length > 1 && (
        <div style={{ marginTop: '10px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Next Full Bins Waiting</span>
            <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '12px', color: 'var(--text-muted)' }}>
              {assignedBins.length - 1} more
            </span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {assignedBins.slice(1).map((bin, idx) => (
              <div
                key={bin.id}
                style={{
                  background: 'rgba(16, 23, 41, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.15)',
                    color: '#f87171',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '14px'
                  }}>
                    {idx + 2}
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc' }}>
                      {bin.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '2px' }}>
                      {bin.zone} • {getWasteIcon(bin.type)}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    color: '#f87171',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: '6px'
                  }}>
                    FULL
                  </span>
                  <button
                    onClick={() => handleMarkCollected(bin.id, bin.name)}
                    className="btn btn-secondary btn-sm"
                  >
                    Mark Done
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
