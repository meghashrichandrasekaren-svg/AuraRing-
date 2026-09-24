import React from 'react';
import { RingStatus, AttendanceStatus, RingVerificationState, SOSAlertStatus } from '../../types';

interface StatusBadgeProps {
  status: RingStatus | AttendanceStatus | RingVerificationState | SOSAlertStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const getStyle = () => {
    switch (status) {
      // Ring & Student status
      case 'Active':
      case 'Present':
      case 'Verified':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50';
      case 'Pending':
      case 'Scheduled':
      case 'Late':
      case 'Acknowledged':
        return 'text-amber-400 bg-amber-950/40 border-amber-800/50';
      case 'Inactive':
      case 'Unassigned':
      case 'Excused':
        return 'text-slate-400 bg-slate-900 border-slate-700/60';
      case 'Absent':
      case 'Lost':
      case 'Blocked':
      case 'Failed':
      case 'Triggered':
        return 'text-rose-400 bg-rose-950/40 border-rose-800/50 animate-pulse';
      case 'Responding':
        return 'text-sky-400 bg-sky-950/40 border-sky-800/50';
      case 'Resolved':
      case 'Completed':
        return 'text-teal-400 bg-teal-950/40 border-teal-800/50';
      case 'Manual Bypass':
        return 'text-purple-400 bg-purple-950/40 border-purple-800/50';
      default:
        return 'text-slate-300 bg-slate-800 border-slate-700';
    }
  };

  const padClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border ${getStyle()} ${padClass} font-mono uppercase tracking-wider`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
};
