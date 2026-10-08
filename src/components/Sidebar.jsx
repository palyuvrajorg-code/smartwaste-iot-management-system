import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Trash2, 
  Truck, 
  ClipboardList, 
  Settings, 
  Navigation, 
  Bell, 
  User, 
  Cpu, 
  AlertOctagon, 
  Wrench, 
  BarChart3, 
  Activity,
  Layers
} from 'lucide-react';
import { ROLES } from '../data/users';

export default function Sidebar({ currentUser, collapsed }) {
  const getNavItems = () => {
    switch (currentUser?.role) {
      case ROLES.ADMIN:
        return [
          { to: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard },
          { to: '/admin/bins', label: 'Smart Bins', icon: Trash2 },
          { to: '/admin/drivers', label: 'Fleet & Drivers', icon: Truck },
          { to: '/admin/requests', label: 'Collection Requests', icon: ClipboardList },
          { to: '/admin/settings', label: 'System Settings', icon: Settings }
        ];
      case ROLES.DRIVER:
        return [
          { to: '/driver', label: 'Current Pickup', icon: Navigation },
          { to: '/driver/collections', label: 'Pickup Checklist', icon: ClipboardList },
          { to: '/driver/notifications', label: 'Full Bin Alerts', icon: Bell },
          { to: '/driver/profile', label: 'My Profile', icon: User }
        ];
      case ROLES.TECHNICIAN:
        return [
          { to: '/technician', label: 'Hardware Telemetry', icon: Cpu },
          { to: '/technician/devices', label: 'ESP32 Nodes', icon: Layers },
          { to: '/technician/alerts', label: 'Sensor Faults', icon: AlertOctagon },
          { to: '/technician/maintenance', label: 'Work Orders', icon: Wrench }
        ];
      case ROLES.SUPERVISOR:
        return [
          { to: '/supervisor', label: 'District Oversight', icon: Activity },
          { to: '/supervisor/collections', label: 'City Collections', icon: ClipboardList },
          { to: '/supervisor/drivers', label: 'Live Fleet Tracking', icon: Truck },
          { to: '/supervisor/reports', label: 'Reports & ESG', icon: BarChart3 }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside style={{
      width: collapsed ? '80px' : '260px',
      background: 'rgba(9, 13, 24, 0.95)',
      borderRight: '1px solid var(--border-subtle)',
      transition: 'var(--transition)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 90,
      flexShrink: 0
    }}>
      {/* Role Identifier Banner */}
      <div style={{
        padding: collapsed ? '16px 8px' : '20px 24px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid var(--border-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary)',
          flexShrink: 0
        }}>
          <Activity size={18} />
        </div>
        {!collapsed && (
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              PORTAL ACCESS
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUser?.role}
            </div>
          </div>
        )}
      </div>

      {/* Nav List */}
      <nav style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin' || item.to === '/driver' || item.to === '/technician' || item.to === '/supervisor'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                color: isActive ? '#f8fafc' : 'var(--text-muted)',
                background: isActive ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.05))' : 'transparent',
                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                fontWeight: isActive ? 600 : 500,
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'var(--transition)'
              })}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Node / Driver Info */}
      {!collapsed && (
        <div style={{
          padding: '16px 20px',
          margin: '16px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          fontSize: '12px'
        }}>
          {currentUser?.role === ROLES.DRIVER ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-dim)' }}>GPS Signal</span>
                <span style={{ color: '#34d399', fontWeight: 700 }}>● Active</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)' }}>Truck Status</span>
                <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>On Route</span>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-dim)' }}>Network Protocol</span>
                <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>MQTT v5.0</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)' }}>Sync Interval</span>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>10 sec live</span>
              </div>
            </>
          )}
        </div>
      )}
    </aside>
  );
}
