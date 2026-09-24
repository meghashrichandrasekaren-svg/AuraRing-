import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  GraduationCap,
  Cpu,
  ClipboardCheck,
  ShieldAlert,
  ArrowRight,
  Plus,
  ArrowUpRight,
  Clock,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    students,
    facultyList,
    rings,
    sessions,
    sosAlerts,
    activeSOSCount,
    setCurrentTab,
    auditLogs,
  } = useApp();

  const totalStudents = students.length;
  const totalFaculty = facultyList.length;
  const totalRings = rings.length;

  // Calculate today's attendance summary
  const todaySessions = sessions.filter((s) => s.date === '2026-09-23');
  const allRecords = todaySessions.flatMap((s) => s.records);
  const presentCount = allRecords.filter((r) => r.status === 'Present' || r.status === 'Late').length;
  const attendanceRate = allRecords.length > 0 ? Math.round((presentCount / allRecords.length) * 100) : 94;

  const recentLogs = auditLogs.slice(0, 5);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-sm">
              Institutional Overview
            </h1>
            <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
              Admin Gateway
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Campus-wide summary of students, faculty, AURA Ring fleet, and attendance telemetry.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentTab('students')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.35)]"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Student
          </button>
          <button
            type="button"
            onClick={() => setCurrentTab('faculty')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-200 bg-white/[0.05] hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Faculty
          </button>
          <button
            type="button"
            onClick={() => setCurrentTab('rings')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-200 bg-white/[0.05] hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl transition-all"
          >
            Manage Rings
          </button>
        </div>
      </div>

      {/* Active SOS Notice if any */}
      {activeSOSCount > 0 && (
        <div className="glass-card-rose p-4 rounded-2xl flex items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-900/60 border border-rose-500/50 flex items-center justify-center text-rose-300 shrink-0">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-rose-100">
                {activeSOSCount} Active Emergency Alert
              </div>
              <div className="text-xs text-rose-200/80 mt-0.5">
                {sosAlerts[0]?.studentName} ({sosAlerts[0]?.location}) — Security team notified.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCurrentTab('sos-active')}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors shrink-0 shadow-lg shadow-rose-600/30"
          >
            View Alert
          </button>
        </div>
      )}

      {/* 4 Summary Glass Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <button
          type="button"
          onClick={() => setCurrentTab('students')}
          className="p-5 rounded-2xl glass-card text-left group"
        >
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-medium">Total Students</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-2 tabular-nums drop-shadow-sm">
            {totalStudents}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Enrolled across 4 depts</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-300 transition-colors" />
          </div>
        </button>

        {/* Faculty */}
        <button
          type="button"
          onClick={() => setCurrentTab('faculty')}
          className="p-5 rounded-2xl glass-card text-left group"
        >
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-medium">Faculty</span>
            <GraduationCap className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-2 tabular-nums drop-shadow-sm">
            {totalFaculty}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Active teaching staff</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-300 transition-colors" />
          </div>
        </button>

        {/* AURA Rings */}
        <button
          type="button"
          onClick={() => setCurrentTab('rings')}
          className="p-5 rounded-2xl glass-card text-left group"
        >
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-medium">AURA Rings</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-2 tabular-nums drop-shadow-sm">
            {totalRings}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Hardware units in fleet</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-300 transition-colors" />
          </div>
        </button>

        {/* Today's Attendance */}
        <button
          type="button"
          onClick={() => setCurrentTab('attendance')}
          className="p-5 rounded-2xl glass-card-emerald text-left group"
        >
          <div className="flex items-center justify-between text-emerald-300">
            <span className="text-xs font-medium">Today's Attendance</span>
            <ClipboardCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-200 mt-2 tabular-nums drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            {attendanceRate}%
          </div>
          <div className="text-xs text-emerald-300/80 mt-1 flex items-center justify-between">
            <span>Verified via AURA Rings</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>
      </div>

      {/* Main Content: Attendance Summary & Recent Important Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Summary */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white">Today's Attendance Summary</h2>
              <button
                type="button"
                onClick={() => setCurrentTab('attendance')}
                className="text-xs text-cyan-300 hover:text-white font-semibold flex items-center gap-1 transition-colors"
              >
                View Sessions <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">Overall Campus Attendance</span>
                  <span className="font-mono font-bold text-white">{attendanceRate}%</span>
                </div>
                <div className="w-full h-3 bg-slate-950/70 p-0.5 rounded-full border border-white/10 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 rounded-full transition-all shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                    style={{ width: `${attendanceRate}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3.5 bg-slate-950/50 rounded-xl border border-white/10 shadow-inner">
                  <span className="text-slate-400 block text-[11px]">Today's Recorded Sessions</span>
                  <span className="text-xl font-mono font-bold text-white mt-0.5 block">
                    {todaySessions.length}
                  </span>
                </div>
                <div className="p-3.5 bg-slate-950/50 rounded-xl border border-white/10 shadow-inner">
                  <span className="text-slate-400 block text-[11px]">Verification Rate</span>
                  <span className="text-xl font-mono font-bold text-emerald-300 mt-0.5 block">
                    99.1%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Important Activity */}
        <div className="glass-panel rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Recent Activity</h2>
            <button
              type="button"
              onClick={() => setCurrentTab('audit-logs')}
              className="text-xs text-slate-300 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
            >
              All Logs <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-white/[0.06] text-xs">
            {recentLogs.map((log) => (
              <div key={log.id} className="py-2.5 first:pt-0 last:pb-0 flex items-start gap-3">
                <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-white truncate">{log.action}</span>
                    <span className="font-mono text-[10px] text-slate-400 shrink-0">
                      {log.timestamp.substring(11, 16)}
                    </span>
                  </div>
                  <p className="text-slate-300/80 text-[11px] truncate mt-0.5">
                    {log.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
