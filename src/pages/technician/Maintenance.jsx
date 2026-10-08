import React, { useState } from 'react';
import { Wrench, Plus, CheckCircle, Clock, X, Calendar, User } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

export default function Maintenance() {
  const [workOrders, setWorkOrders] = useState([
    {
      id: 'WO-801',
      nodeId: 'BIN-109',
      task: 'Physical upright realignment & solar bracket tightening',
      technician: 'Dr. Tariq Al-Mansoor',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      created: '2026-10-07 14:00'
    },
    {
      id: 'WO-802',
      nodeId: 'BIN-105',
      task: 'Replace 3.7V 18650 Li-ion battery pack with fresh 3400mAh cell',
      technician: 'Dr. Tariq Al-Mansoor',
      priority: 'MEDIUM',
      status: 'PENDING',
      created: '2026-10-07 16:30'
    },
    {
      id: 'WO-799',
      nodeId: 'BIN-102',
      task: 'Clean HC-SR04 acoustic transducer face from dust accumulation',
      technician: 'Lab Field Team B',
      priority: 'LOW',
      status: 'COMPLETED',
      created: '2026-10-06 10:15'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newWO, setNewWO] = useState({
    nodeId: 'BIN-101',
    task: '',
    priority: 'MEDIUM'
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const order = {
      id: `WO-${Math.floor(800 + Math.random() * 100)}`,
      nodeId: newWO.nodeId,
      task: newWO.task,
      technician: 'Dr. Tariq Al-Mansoor',
      priority: newWO.priority,
      status: 'PENDING',
      created: 'Just now'
    };
    setWorkOrders([order, ...workOrders]);
    setShowModal(false);
    setNewWO({ nodeId: 'BIN-101', task: '', priority: 'MEDIUM' });
  };

  const handleResolve = (id) => {
    setWorkOrders(workOrders.map(w => w.id === id ? { ...w, status: 'COMPLETED' } : w));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Hardware Work Orders</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Scheduled field repairs, battery replacements, and sensor calibration logs
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={18} /> New Work Order
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {workOrders.map((wo) => (
          <div
            key={wo.id}
            className="glass-card"
            style={{
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: wo.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: wo.status === 'COMPLETED' ? '#10b981' : '#8b5cf6'
              }}>
                <Wrench size={22} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '13px', color: 'var(--primary)' }}>
                    {wo.id}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Target: <strong>{wo.nodeId}</strong></span>
                  <StatusBadge status={wo.status} size="sm" />
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 700 }}>{wo.task}</h4>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <span>Assigned: {wo.technician}</span>
                  <span>•</span>
                  <span>Created: {wo.created}</span>
                </div>
              </div>
            </div>

            <div>
              {wo.status !== 'COMPLETED' && (
                <button onClick={() => handleResolve(wo.id)} className="btn btn-primary btn-sm">
                  <CheckCircle size={14} /> Mark Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Issue Hardware Work Order</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Target Bin Node</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={newWO.nodeId}
                    onChange={(e) => setNewWO({ ...newWO, nodeId: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Maintenance Task Details</label>
                  <textarea
                    required
                    className="form-input"
                    rows={3}
                    placeholder="Describe field task, required parts, sensor replacement..."
                    value={newWO.task}
                    onChange={(e) => setNewWO({ ...newWO, task: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={newWO.priority}
                    onChange={(e) => setNewWO({ ...newWO, priority: e.target.value })}
                  >
                    <option value="LOW">Low - Routine servicing</option>
                    <option value="MEDIUM">Medium - Performance degraded</option>
                    <option value="HIGH">High - Sensor offline or battery dead</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Dispatch Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
