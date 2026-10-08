import React from 'react';

export default function StatusBadge({ status, size = 'md' }) {
  const getBadgeClass = (s) => {
    switch (s?.toUpperCase()) {
      case 'NORMAL':
      case 'ONLINE':
      case 'COMPLETED':
      case 'COLLECTED':
      case 'SUCCESS':
        return 'badge-normal';
      case 'WARNING':
      case 'ON_ROUTE':
      case 'IN_PROGRESS':
        return 'badge-warning';
      case 'CRITICAL':
      case 'ERROR':
      case 'DANGER':
      case 'FAULT':
        return 'badge-critical';
      case 'COLLECTING':
      case 'INFO':
        return 'badge-info';
      case 'IDLE':
      case 'OFF_DUTY':
      case 'OFFLINE':
      default:
        return 'badge-purple';
    }
  };

  const formatText = (s) => {
    if (!s) return 'UNKNOWN';
    return s.replace(/_/g, ' ');
  };

  return (
    <span className={`badge ${getBadgeClass(status)} ${size === 'sm' ? 'text-xs py-0.5 px-2' : ''}`}>
      <span className="badge-dot" />
      {formatText(status)}
    </span>
  );
}
