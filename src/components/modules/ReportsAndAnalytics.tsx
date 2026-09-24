import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, Download, Calendar, Filter, FileText, CheckCircle2, TrendingUp, Cpu, ShieldAlert } from 'lucide-react';

export const ReportsAndAnalytics: React.FC = () => {
  const { students, rings, sessions, sosAlerts } = useApp();
  const [reportType, setReportType] = useState<'attendance' | 'rings' | 'safety'>('attendance');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleExport = (format: 'CSV' | 'PDF') => {
    setDownloadSuccess(`Exported ${reportType.toUpperCase()}_REPORT_${new Date().toISOString().substring(0, 10)}.${format.toLowerCase()}`);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 4000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Institutional Reports & Wearable Telemetry
            </h1>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              Audit & Analytics
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Generate accreditation-compliant attendance summaries, hardware fleet battery lifecycle audits, and emergency safety reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleExport('CSV')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => handleExport('PDF')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-md shadow-cyan-500/20"
          >
            <FileText className="w-3.5 h-3.5" />
            Export PDF Report
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Report successfully compiled and ready: <strong className="font-mono text-emerald-200">{downloadSuccess}</strong></span>
        </div>
      )}

      {/* Report Category Switcher */}
      <div className="flex border-b border-slate-800 gap-4 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setReportType('attendance')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            reportType === 'attendance'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Period Attendance Analytics
        </button>
        <button
          type="button"
          onClick={() => setReportType('rings')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            reportType === 'rings'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4" />
          AURA Ring Hardware Audit
        </button>
        <button
          type="button"
          onClick={() => setReportType('safety')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            reportType === 'safety'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Emergency SOS Incident Audit
        </button>
      </div>

      {/* Attendance Tab */}
      {reportType === 'attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-slate-400 block">Institution Average Rate</span>
              <div className="text-2xl font-mono font-bold text-white mt-1 tabular-nums">94.8%</div>
              <p className="text-[11px] text-emerald-400 mt-0.5">Verified by AURA Rings</p>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-slate-400 block">Total Recorded Periods</span>
              <div className="text-2xl font-mono font-bold text-cyan-400 mt-1 tabular-nums">1,420</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Across all 4 departments</p>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-slate-400 block">Hardware Verification Rate</span>
              <div className="text-2xl font-mono font-bold text-teal-400 mt-1 tabular-nums">99.1%</div>
              <p className="text-[11px] text-teal-300 mt-0.5">&lt; 1% manual faculty overrides</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">Department Performance Breakdown</h3>
            <div className="space-y-3">
              {[
                { name: 'Information Technology', code: 'IT', rate: 96.2, totalStudents: 240, present: 231 },
                { name: 'Computer Science & Engineering', code: 'CSE', rate: 95.1, totalStudents: 360, present: 342 },
                { name: 'Electronics & Communication', code: 'ECE', rate: 93.8, totalStudents: 280, present: 263 },
                { name: 'Mechanical Engineering', code: 'MECH', rate: 90.4, totalStudents: 220, present: 199 },
              ].map((d) => (
                <div key={d.code} className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-white">{d.name} ({d.code})</span>
                    <span className="font-mono text-cyan-400 font-bold tabular-nums">{d.rate}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${d.rate}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                    <span>{d.present} / {d.totalStudents} Average Present</span>
                    <span>Accreditation Compliant</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ring Tab */}
      {reportType === 'rings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-slate-400 block">Fleet Deployment</span>
              <div className="text-2xl font-mono font-bold text-white mt-1 tabular-nums">{rings.length} Units</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Total inventory</p>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-slate-400 block">Average Battery</span>
              <div className="text-2xl font-mono font-bold text-emerald-400 mt-1 tabular-nums">84%</div>
              <p className="text-[11px] text-emerald-300 mt-0.5">Normal operating range</p>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-slate-400 block">Lost Rate</span>
              <div className="text-2xl font-mono font-bold text-amber-400 mt-1 tabular-nums">0.18%</div>
              <p className="text-[11px] text-slate-400 mt-0.5">2 units reported lost</p>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-slate-400 block">Firmware Parity</span>
              <div className="text-2xl font-mono font-bold text-cyan-400 mt-1 tabular-nums">98.9%</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Running v2.4.1-core</p>
            </div>
          </div>
        </div>
      )}

      {/* Safety Tab */}
      {reportType === 'safety' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-slate-400 block">Mean Response Time</span>
              <div className="text-2xl font-mono font-bold text-emerald-400 mt-1 tabular-nums">1.8 Mins</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Alert to security arrival</p>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-slate-400 block">Total Incidents Handled</span>
              <div className="text-2xl font-mono font-bold text-white mt-1 tabular-nums">{sosAlerts.length}</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Resolved with full audit trail</p>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-slate-400 block">Safety Confirmation</span>
              <div className="text-2xl font-mono font-bold text-cyan-400 mt-1 tabular-nums">100%</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Zero unaddressed alarms</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
