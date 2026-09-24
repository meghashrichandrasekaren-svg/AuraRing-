import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  GraduationCap,
  ClipboardCheck,
  ShieldAlert,
  ArrowRight,
  UserX,
} from 'lucide-react';

export const HODDashboard: React.FC = () => {
  const { facultyList, sessions, sosAlerts, setCurrentTab, academicStructure } = useApp();

  const itDept = academicStructure.find((d) => d.code === 'IT');
  const itFaculty = facultyList.filter((f) => f.department === 'Information Technology');
  const itSessions = sessions.filter((s) => s.department === 'Information Technology');
  const itActiveAlerts = sosAlerts.filter(
    (a) =>
      a.department === 'Information Technology' &&
      (a.status === 'Triggered' || a.status === 'Acknowledged' || a.status === 'Responding')
  );

  const [selectedYear, setSelectedYear] = useState<string>('ALL');

  const itAbsentStudents = itSessions.flatMap((s) =>
    s.records
      .filter((r) => r.status === 'Absent')
      .map((r) => ({
        ...r,
        year: s.year,
        section: s.section,
        period: s.period,
      }))
  );

  const filteredAbsent =
    selectedYear === 'ALL'
      ? itAbsentStudents
      : itAbsentStudents.filter((s) => s.year === selectedYear);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-sm">
              Information Technology Department
            </h1>
            <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
              HOD Executive Console
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Department telemetry across 4 academic years, 8 sections & advisor assignments
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCurrentTab('attendance')}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] self-start sm:self-auto"
        >
          <span>Department Sessions</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Frosted Glass Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card space-y-2">
          <div className="flex items-center justify-between text-slate-300 text-xs font-medium">
            <span>Total IT Students</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white tracking-tight drop-shadow-sm">
            {itDept?.totalStudents || 243}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">4 Academic Years (8 Sections)</div>
        </div>

        <div className="p-5 rounded-2xl glass-card-emerald space-y-2">
          <div className="flex items-center justify-between text-emerald-300 text-xs font-medium">
            <span>IT Attendance Rate</span>
            <ClipboardCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-200 tracking-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            92.8%
          </div>
          <div className="text-[11px] text-emerald-300/80 font-medium">Ring-verified today</div>
        </div>

        <div className="p-5 rounded-2xl glass-card space-y-2">
          <div className="flex items-center justify-between text-slate-300 text-xs font-medium">
            <span>Faculty Advisors</span>
            <GraduationCap className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white tracking-tight drop-shadow-sm">
            {itFaculty.length || 5}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">Section In-Charges</div>
        </div>

        <div
          className={`p-5 rounded-2xl transition-all space-y-2 ${
            itActiveAlerts.length > 0 ? 'glass-card-rose' : 'glass-card'
          }`}
        >
          <div className="flex items-center justify-between text-slate-300 text-xs font-medium">
            <span>Department SOS</span>
            <ShieldAlert
              className={`w-4 h-4 ${
                itActiveAlerts.length > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-400'
              }`}
            />
          </div>
          <div
            className={`text-3xl font-extrabold font-mono tracking-tight drop-shadow-sm ${
              itActiveAlerts.length > 0 ? 'text-rose-200' : 'text-white'
            }`}
          >
            {itActiveAlerts.length}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            {itActiveAlerts.length > 0 ? 'Security unit dispatched' : 'All students safe'}
          </div>
        </div>
      </div>

      {/* Academic Year Sections Grid - Pure Frosted Glass Panel */}
      <div className="glass-panel rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight">
            Academic Years & Section Breakdown
          </h2>
          <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-cyan-500/40">
            8 Sections Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {itDept?.years.map((yr) => (
            <div
              key={yr.year}
              className="p-5 bg-slate-950/50 backdrop-blur-xl border border-white/10 rounded-xl space-y-3 shadow-inner"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                  {yr.year}
                </span>
                <span className="text-xs font-mono text-slate-300/80">
                  {yr.sections.reduce((acc, s) => acc + s.studentCount, 0)} Students Enrolled
                </span>
              </div>

              <div className="space-y-2">
                {yr.sections.map((sec) => {
                  const matchingSession = itSessions.find(
                    (s) => s.year === yr.year && s.section === sec.section
                  );
                  const present = matchingSession
                    ? matchingSession.records.filter((r) => r.status === 'Present').length
                    : Math.round(sec.studentCount * 0.92);
                  const total = matchingSession ? matchingSession.records.length : sec.studentCount;
                  const rate = Math.round((present / total) * 100);

                  return (
                    <div
                      key={sec.section}
                      className="p-3 bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 rounded-xl flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <div className="font-bold text-white">
                          {sec.section}{' '}
                          <span className="text-[11px] font-mono text-slate-400 font-normal">
                            ({total} students)
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Advisor: {sec.advisor}
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`font-mono font-bold text-xs ${
                            rate >= 90 ? 'text-emerald-300' : 'text-amber-300'
                          }`}
                        >
                          {rate}% Verified
                        </span>
                        <div className="text-[10px] font-mono text-slate-400">
                          {present}/{total} Present
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Absent Students Across IT - Frosted Glass Panel */}
      <div className="glass-panel rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-950/60 border border-rose-500/40">
              <UserX className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Absent Students Across IT ({filteredAbsent.length})
              </h2>
              <p className="text-xs text-slate-300/80">Rings unverified during current academic periods</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 font-medium">Filter Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="glass-input rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none"
            >
              <option value="ALL" className="bg-slate-900 text-slate-100">All Years</option>
              <option value="1st Year" className="bg-slate-900 text-slate-100">1st Year</option>
              <option value="2nd Year" className="bg-slate-900 text-slate-100">2nd Year</option>
              <option value="3rd Year" className="bg-slate-900 text-slate-100">3rd Year</option>
              <option value="4th Year" className="bg-slate-900 text-slate-100">4th Year</option>
            </select>
          </div>
        </div>

        <div className="bg-slate-950/60 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-inner">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.04] text-slate-300 border-b border-white/10 font-mono text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Register No.</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Year & Section</th>
                <th className="py-3 px-4">Ring UID</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-slate-200">
              {filteredAbsent.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-mono">
                    No absent students found in selected filter.
                  </td>
                </tr>
              ) : (
                filteredAbsent.slice(0, 6).map((s, idx) => (
                  <tr key={`${s.studentId}-${idx}`} className="hover:bg-white/[0.04] transition-colors">
                    <td className="py-3 px-4 font-mono text-cyan-300 font-semibold">
                      {s.registerNumber}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      {s.studentName}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {s.year} · <span className="text-cyan-300 font-mono font-medium">{s.section}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-300">
                      {s.ringUid}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[11px] font-mono text-rose-300 font-bold">
                        Unverified
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
