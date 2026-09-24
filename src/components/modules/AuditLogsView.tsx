import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScrollText, Search, Filter, Clock, ShieldAlert, Cpu, ClipboardCheck, Users, Info } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || (log.category || log.entity) === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'SOS':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
      case 'Ring':
        return <Cpu className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Attendance':
        return <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Student':
      case 'Faculty':
        return <Users className="w-3.5 h-3.5 text-indigo-400" />;
      default:
        return <Info className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Institutional Audit Logs & Security History
            </h1>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              Tamper-Evident Chronology
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Immutable system audit logs recording ring assignments, attendance session lockings, SOS life-safety actions, and administrative changes.
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search audit trail by action, description, user, or target entity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">All Event Categories</option>
          <option value="SOS">SOS Life-Safety</option>
          <option value="Ring">AURA Ring Hardware</option>
          <option value="Attendance">Attendance Sessions</option>
          <option value="Student">Student Management</option>
          <option value="Faculty">Faculty & Advisors</option>
          <option value="Security">Security Operations</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4 text-right">Performed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredLogs.map((log) => {
                const category = log.category || log.entity;
                return (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                        {getCategoryIcon(category)}
                        <span>{category}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-cyan-300">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-md">
                      {log.description}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {log.targetEntity || log.entity || '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-200">
                      {log.performedBy || log.user}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
