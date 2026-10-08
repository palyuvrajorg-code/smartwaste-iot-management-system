import React from 'react';
import { BarChart3, Download, Leaf, TrendingUp, Award, Calendar, FileText } from 'lucide-react';

export default function Reports() {
  const handleExport = (type) => {
    alert(`Generating SmartWaste ESG Compliance Report (${type}). Download initialized.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Environmental & Operations Intelligence</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            ESG sustainability benchmarks, stream segregation analytics & municipal carbon audit
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleExport('CSV')} className="btn btn-secondary">
            <Download size={16} /> Export CSV
          </button>
          <button onClick={() => handleExport('PDF')} className="btn btn-primary">
            <FileText size={16} /> Export Municipal PDF Report
          </button>
        </div>
      </div>

      {/* Sustainability Metrics */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">Landfill Diversion Rate</div>
            <div className="stat-value" style={{ color: 'var(--primary)' }}>64.8%</div>
            <div style={{ fontSize: '12px', color: '#6ee7b7', marginTop: '4px' }}>+8.2% vs previous quarter</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--primary)' }}>
            <Leaf size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">Total Recycled Biomass</div>
            <div className="stat-value" style={{ color: 'var(--secondary)' }}>124.6 t</div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>Composted & Processed</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--secondary)' }}>
            <Award size={24} />
          </div>
        </div>

        <div className="glass-card stat-card">
          <div>
            <div className="stat-label">Carbon Offset Equivalent</div>
            <div className="stat-value" style={{ color: '#fbbf24' }}>18.4 t CO₂</div>
            <div style={{ fontSize: '12px', color: '#fde68a', marginTop: '4px' }}>Optimized fuel routing</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      {/* Waste Stream Breakdown Visuals */}
      <div className="glass-card">
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>
          Material Stream Composition & Diversion Breakdown
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { label: 'General Household Waste', percent: 42, color: '#94a3b8', tons: '82.4 t' },
            { label: 'Recyclable Plastic & Metals', percent: 28, color: '#38bdf8', tons: '54.8 t' },
            { label: 'Organic Compost / Food Waste', percent: 18, color: '#34d399', tons: '35.2 t' },
            { label: 'Paper & Clean Cardboard', percent: 8, color: '#c084fc', tons: '15.6 t' },
            { label: 'Hazardous / E-Waste', percent: 4, color: '#f87171', tons: '7.8 t' }
          ].map((stream) => (
            <div key={stream.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px' }}>
                <span style={{ fontWeight: 600 }}>{stream.label}</span>
                <span style={{ color: 'var(--text-dim)' }}>
                  <strong style={{ color: '#fff' }}>{stream.tons}</strong> ({stream.percent}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${stream.percent}%`, height: '100%', background: stream.color, borderRadius: '5px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
