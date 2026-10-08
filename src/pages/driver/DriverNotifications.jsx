import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, MapPin, Truck, AlertCircle } from 'lucide-react';
import { notificationService, binService } from '../../services/api';
import { ROLES } from '../../data/users';

export default function DriverNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifs();
  }, []);

  const loadNotifs = () => {
    // Get notifications and sanitize to plain language without percentages
    const raw = notificationService.getNotifications(ROLES.DRIVER);
    const simplified = raw.map(n => {
      let friendlyTitle = n.title;
      let friendlyMessage = n.message;

      // Strip percentage numbers and technical terms
      if (friendlyMessage.includes('%')) {
        friendlyMessage = friendlyMessage.replace(/reached \d+%/g, 'is now FULL');
        friendlyMessage = friendlyMessage.replace(/\d+%/g, 'Full');
      }
      if (friendlyTitle.includes('Bin Overflow Imminent')) {
        friendlyTitle = '🚨 Bin is FULL and Needs Emptying';
      }

      return {
        ...n,
        title: friendlyTitle,
        message: friendlyMessage
      };
    });

    setNotifications(simplified);
  };

  const handleMarkRead = (id) => {
    notificationService.markAsRead(id);
    loadNotifs();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div>
        <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Full Bin Alerts & Messages</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
          Alerts sent directly to your truck when a bin fills up
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {notifications.map((n) => (
          <div
            key={n.id}
            style={{
              background: n.read ? 'rgba(16, 23, 41, 0.6)' : 'rgba(239, 68, 68, 0.08)',
              border: n.read ? '1px solid var(--border-subtle)' : '1px solid rgba(239, 68, 68, 0.4)',
              borderLeft: n.read ? '4px solid #64748b' : '5px solid #ef4444',
              borderRadius: 'var(--radius-lg)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: n.read ? 'rgba(255,255,255,0.06)' : '#ef4444',
                  color: '#fff'
                }}>
                  {n.read ? 'READ' : '🚨 NEW ALERT'}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{n.timestamp}</span>
              </div>

              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#f8fafc', marginBottom: '6px' }}>
                {n.title}
              </h3>

              <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.5 }}>
                {n.message}
              </p>
            </div>

            {!n.read && (
              <button
                onClick={() => handleMarkRead(n.id)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '8px 14px', fontSize: '13px' }}
              >
                <CheckCheck size={16} /> Got It
              </button>
            )}
          </div>
        ))}

        {notifications.length === 0 && (
          <div style={{
            background: 'rgba(16, 23, 41, 0.6)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '40px',
            textAlign: 'center',
            color: 'var(--text-muted)'
          }}>
            No new alerts right now.
          </div>
        )}
      </div>
    </div>
  );
}
