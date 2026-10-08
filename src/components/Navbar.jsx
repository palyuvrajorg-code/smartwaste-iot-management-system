import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Radio, 
  LogOut, 
  Menu, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  ChevronDown,
  Shield,
  Truck,
  Cpu,
  Activity
} from 'lucide-react';
import { authService, notificationService } from '../services/api';
import { ROLES } from '../data/users';

export default function Navbar({ currentUser, onToggleSidebar, onLogout }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const notifs = notificationService.getNotifications(currentUser.role);
      setNotifications(notifs);
    }
  }, [currentUser]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSignOut = () => {
    authService.logout();
    if (onLogout) onLogout();
    navigate('/login');
  };

  const handleMarkRead = (id) => {
    const updated = notificationService.markAsRead(id);
    setNotifications(updated.filter(n => currentUser.role === 'ADMIN' || n.targetRole === 'ALL' || n.targetRole === currentUser.role));
  };

  const getRoleIcon = () => {
    switch (currentUser?.role) {
      case ROLES.DRIVER:
        return <Truck size={15} color="#38bdf8" />;
      case ROLES.ADMIN:
        return <Shield size={15} color="#34d399" />;
      case ROLES.TECHNICIAN:
        return <Cpu size={15} color="#c084fc" />;
      case ROLES.SUPERVISOR:
        return <Activity size={15} color="#fbbf24" />;
      default:
        return null;
    }
  };

  const getRoleColor = () => {
    switch (currentUser?.role) {
      case ROLES.DRIVER:
        return '#38bdf8';
      case ROLES.ADMIN:
        return '#34d399';
      case ROLES.TECHNICIAN:
        return '#c084fc';
      case ROLES.SUPERVISOR:
        return '#fbbf24';
      default:
        return 'var(--primary)';
    }
  };

  return (
    <header style={{
      height: '70px',
      background: 'rgba(11, 16, 29, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Left branding & mobile toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={onToggleSidebar}
          className="btn btn-secondary btn-icon"
          style={{ display: 'flex' }}
          title="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
          }}>
            <Radio size={20} color="#042017" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ 
              fontFamily: 'var(--font-display)', 
              fontWeight: 800, 
              fontSize: '18px', 
              letterSpacing: '-0.02em',
              background: 'linear-gradient(90deg, #ffffff, #94a3b8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.2
            }}>
              SmartWaste <span style={{ color: 'var(--primary)', WebkitTextFillColor: 'var(--primary)' }}>IoT</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.04em' }}>
              URBAN RECYCLING & TELEMETRY
            </div>
          </div>
        </div>

        {/* Dedicated Role Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          padding: '6px 14px',
          borderRadius: '20px',
          marginLeft: '12px'
        }}>
          {getRoleIcon()}
          <span style={{ fontSize: '12px', fontWeight: 700, color: getRoleColor(), textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {currentUser?.role} PORTAL
          </span>
          {currentUser?.vehicleId && (
            <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
              ({currentUser.vehicleId})
            </span>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Notifications Popover strictly for this user role */}
        <div style={{ position: 'relative' }}>
          <button 
            className="btn btn-secondary btn-icon"
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowUserMenu(false);
            }}
            style={{ position: 'relative' }}
            title="Role Alerts & Messages"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                background: 'var(--danger)',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 800,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #070a12'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '360px',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 200,
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '14px 18px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>{currentUser?.role} Alerts</span>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{unreadCount} unread</span>
              </div>
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '13px' }}>
                    No alerts in queue
                  </div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => handleMarkRead(n.id)}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        background: n.read ? 'transparent' : 'rgba(16, 185, 129, 0.05)',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ 
                          fontSize: '12px', 
                          fontWeight: 700,
                          color: n.type === 'CRITICAL' ? '#f87171' : n.type === 'WARNING' ? '#fbbf24' : '#34d399'
                        }}>
                          {n.title}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{n.timestamp}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        {n.message}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Sign Out Dropdown */}
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifMenu(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <img 
              src={currentUser?.avatar} 
              alt={currentUser?.name}
              style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }}
            />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.2 }}>
                {currentUser?.name}
              </div>
              <div style={{ fontSize: '11px', color: getRoleColor(), fontWeight: 600 }}>
                {currentUser?.role}
              </div>
            </div>
            <ChevronDown size={14} color="var(--text-dim)" />
          </div>

          {showUserMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '52px',
              width: '240px',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 200,
              padding: '8px'
            }}>
              <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>{currentUser?.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{currentUser?.email}</div>
                <div style={{ 
                  marginTop: '6px', 
                  fontSize: '11px', 
                  color: getRoleColor(), 
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  ● {currentUser?.role}
                </div>
              </div>

              <button
                onClick={handleSignOut}
                style={{
                  width: '100%',
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  background: 'transparent',
                  border: 'none',
                  color: '#f87171',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  transition: 'var(--transition)'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <LogOut size={16} /> Sign Out (Switch User)
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
