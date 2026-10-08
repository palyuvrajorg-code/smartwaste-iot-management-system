import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Radio, 
  ShieldCheck, 
  Truck, 
  Cpu, 
  Activity, 
  ArrowRight, 
  Lock, 
  Mail,
  AlertCircle
} from 'lucide-react';
import { authService } from '../services/api';
import { ROLES, INITIAL_USERS } from '../data/users';

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@smartwaste.io');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await authService.login(email, password);
      if (onLoginSuccess) onLoginSuccess(user);
      routeForRole(user.role);
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setError('');
    setLoading(true);
    try {
      const user = await authService.loginAsRole(role);
      if (onLoginSuccess) onLoginSuccess(user);
      routeForRole(user.role);
    } catch (err) {
      setError(err.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  const routeForRole = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        navigate('/admin');
        break;
      case ROLES.DRIVER:
        navigate('/driver');
        break;
      case ROLES.TECHNICIAN:
        navigate('/technician');
        break;
      case ROLES.SUPERVISOR:
        navigate('/supervisor');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(ellipse at 50% 20%, rgba(16, 185, 129, 0.12) 0%, rgba(7, 10, 18, 0.98) 75%)',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '1050px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '32px',
        alignItems: 'center'
      }}>
        {/* Left Hero Overview */}
        <div style={{ padding: '20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid var(--border-accent)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            color: 'var(--primary)',
            fontSize: '12px',
            fontWeight: 700,
            marginBottom: '20px'
          }}>
            <Radio size={14} /> SMART CITY SENSOR INTELLIGENCE
          </div>

          <h1 style={{
            fontSize: '44px',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '18px',
            background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            SmartWaste <span style={{ color: 'var(--primary)', WebkitTextFillColor: 'var(--primary)' }}>IoT</span> Management
          </h1>

          <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '32px' }}>
            Next-generation urban sanitation operations powered by real-time ESP32 edge telemetry, dynamic fleet route optimization, and multi-role operations oversight.
          </p>

          {/* Role Feature Highlights */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              padding: '16px',
              borderRadius: 'var(--radius-md)'
            }}>
              <ShieldCheck size={20} color="var(--primary)" style={{ marginBottom: '8px' }} />
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>Admin Oversight</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Central fleet metrics, dispatch queues, and system thresholds.</p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              padding: '16px',
              borderRadius: 'var(--radius-md)'
            }}>
              <Truck size={20} color="var(--secondary)" style={{ marginBottom: '8px' }} />
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>Driver Cockpit</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Turn-by-turn bin queue, collection status updates, and vehicle stats.</p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              padding: '16px',
              borderRadius: 'var(--radius-md)'
            }}>
              <Cpu size={20} color="var(--accent)" style={{ marginBottom: '8px' }} />
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>IoT Technician</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Sensor calibrations, battery health, tilt faults, and work orders.</p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              padding: '16px',
              borderRadius: 'var(--radius-md)'
            }}>
              <Activity size={20} color="var(--warning)" style={{ marginBottom: '8px' }} />
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>Supervisor Hub</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>District collection analytics, driver GPS monitoring, and ESG reports.</p>
            </div>
          </div>
        </div>

        {/* Right Authentication Card */}
        <div className="glass-card" style={{ padding: '36px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>Sign in to Portal</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Choose a role for instant demo access or enter credentials
            </p>
          </div>

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              color: '#f87171',
              fontSize: '13px',
              marginBottom: '20px'
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Role Demo Access Buttons */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '10px' }}>
              Quick Demo Logins (Click to Enter)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => handleQuickDemo(ROLES.ADMIN)}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '10px 12px' }}
              >
                <ShieldCheck size={16} color="var(--primary)" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700 }}>Admin</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Municipal HQ</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo(ROLES.DRIVER)}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '10px 12px' }}
              >
                <Truck size={16} color="var(--secondary)" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700 }}>Driver</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Fleet TRK-902</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo(ROLES.TECHNICIAN)}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '10px 12px' }}
              >
                <Cpu size={16} color="var(--accent)" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700 }}>IoT Tech</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Hardware Lab</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo(ROLES.SUPERVISOR)}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '10px 12px' }}
              >
                <Activity size={16} color="var(--warning)" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700 }}>Supervisor</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Sanitation Ops</div>
                </div>
              </button>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: '20px 0',
            color: 'var(--text-dim)',
            fontSize: '12px'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            <span>OR LOGIN WITH CREDENTIALS</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          </div>

          {/* Standard Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '38px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@smartwaste.io"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '38px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '8px', padding: '12px' }}
            >
              {loading ? 'Authenticating...' : (
                <>
                  Enter System <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
