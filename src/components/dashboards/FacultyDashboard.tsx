import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GatewayLiveFeed } from '../common/GatewayLiveFeed';
import { RingProofModal } from '../common/RingProofModal';
import {
  Users,
  ClipboardCheck,
  ShieldAlert,
  ArrowRight,
  Play,
  UserX,
  Radio,
  CheckCircle2,
  Sparkles,
  Fingerprint,
} from 'lucide-react';

export const FacultyDashboard: React.FC = () => {
  const {
    currentUser,
    students,
    sessions,
    activeSession,
    sosAlerts,
    verifyStudentRing,
    batchVerifyAllInSession,
    setCurrentTab,
  } = useApp();

  const [quickFeedback, setQuickFeedback] = useState<string | null>(null);

  // Section: IT 2nd Year Section A (63 students)
  const myStudents = students.filter(
    (s) =>
      s.department === 'Information Technology' &&
      s.year === '2nd Year' &&
      s.section === 'Section A'
  );

  const mySessions = sessions.filter(
    (s) =>
      s.department === 'Information Technology' &&
      s.year === '2nd Year' &&
      s.section === 'Section A'
  );

  const currentOrNextSession = activeSession || mySessions[0];

  const presentCount = currentOrNextSession
    ? currentOrNextSession.records.filter((r) => r.status === 'Present' || r.status === 'Late').length
    : 57;
  const totalCount = currentOrNextSession ? currentOrNextSession.records.length : 63;
  const absentCount = totalCount - presentCount;
  const sessionAttendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 91;

  const absentStudents = currentOrNextSession
    ? currentOrNextSession.records.filter((r) => r.status === 'Absent')
    : [];

  const myActiveAlert = sosAlerts.find(
    (a) =>
      a.department === 'Information Technology' &&
      a.year === '2nd Year' &&
      a.section === 'Section A' &&
      (a.status === 'Triggered' || a.status === 'Acknowledged' || a.status === 'Responding')
  );

  const handleSimulateTap = (ringUid: string) => {
    if (!currentOrNextSession) return;
    const res = verifyStudentRing(currentOrNextSession.id, ringUid, 'Ring');
    setQuickFeedback(res.message);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Top Banner / Classroom Hero Card - Ultra Frosted Glass */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 shadow-2xl">
        {/* Specular Ambient Backlight */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></span>
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                Live Classroom Session
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1.5 drop-shadow-md">
              Information Technology · 2nd Year
            </h1>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
              <span className="text-cyan-300 font-semibold font-mono">Section A (63 Students)</span>
              <span>·</span>
              <span>Advisor: {currentUser.name}</span>
              <span>·</span>
              <span className="text-slate-400">{currentOrNextSession?.period || 'Period 3'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {currentOrNextSession?.status === 'Active' && (
              <button
                type="button"
                onClick={() => {
                  batchVerifyAllInSession(currentOrNextSession.id);
                  setQuickFeedback('BLE Gateway: Batch verified all student rings!');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Auto-Scan All Rings
              </button>
            )}

            <button
              type="button"
              onClick={() => setCurrentTab('attendance')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              Open Attendance Console
            </button>
          </div>
        </div>

        {/* Live Attendance Progress Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Session Verification Rate</span>
            <span className="font-mono font-bold text-cyan-300">
              {presentCount} / {totalCount} Students ({sessionAttendanceRate}%)
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-950/70 p-0.5 border border-white/10 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 transition-all duration-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]"
              style={{ width: `${sessionAttendanceRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick feedback toast */}
      {quickFeedback && (
        <div className="p-3.5 glass-panel border-cyan-500/40 rounded-xl text-xs text-cyan-200 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold">{quickFeedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setQuickFeedback(null)}
            className="text-slate-400 hover:text-white font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Emergency Distress Alert (If any student in this section triggers SOS) */}
      {myActiveAlert && (
        <div className="p-4 rounded-2xl glass-card-rose flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-900/60 border border-rose-500/50">
              <ShieldAlert className="w-5 h-5 text-rose-300 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-rose-100 flex items-center gap-2">
                <span>DISTRESS ALERT: {myActiveAlert.studentName}</span>
                <span className="font-mono text-[11px] bg-rose-900/80 px-2 py-0.5 rounded">
                  {myActiveAlert.registerNumber}
                </span>
              </div>
              <div className="text-xs text-rose-300/90 mt-0.5">
                Location: {myActiveAlert.location} · Ring UID: {myActiveAlert.ringUid}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCurrentTab('sos-active')}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors shrink-0 shadow-lg shadow-rose-600/40"
          >
            Open Security Dispatch
          </button>
        </div>
      )}

      {/* Classroom BLE Sensor Gateway Telemetry Feed */}
      <GatewayLiveFeed />

      {/* 3 Frosted Glass Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Enrolled */}
        <div className="p-5 rounded-2xl glass-card space-y-2">
          <div className="flex items-center justify-between text-slate-300 text-xs font-medium">
            <span>Enrolled in Section</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white tracking-tight drop-shadow-sm">
            {myStudents.length}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            IT 2nd Year (Section A)
          </div>
        </div>

        {/* Verified Present */}
        <div className="p-5 rounded-2xl glass-card-emerald space-y-2">
          <div className="flex items-center justify-between text-emerald-300 text-xs font-medium">
            <span>Verified Present</span>
            <ClipboardCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-200 tracking-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            {presentCount}
          </div>
          <div className="text-[11px] text-emerald-300/80 font-medium">
            {sessionAttendanceRate}% Verified Attendance
          </div>
        </div>

        {/* Absent */}
        <div className="p-5 rounded-2xl glass-card-rose space-y-2">
          <div className="flex items-center justify-between text-rose-300 text-xs font-medium">
            <span>Absent / Pending Tap</span>
            <UserX className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-rose-200 tracking-tight drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]">
            {absentCount}
          </div>
          <div className="text-[11px] text-rose-300/80 font-medium">
            Auto-Derived Absentees
          </div>
        </div>
      </div>

      {/* Pending Ring Verifications Card - Pure Frosted Glass Panel */}
      <div className="glass-panel rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Pending Ring Verifications ({absentStudents.length})
            </h2>
            <p className="text-xs text-slate-300/80 mt-0.5">
              Contactless AURA Rings not yet registered at the classroom gateway
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCurrentTab('attendance')}
            className="text-xs font-semibold text-cyan-300 hover:text-white inline-flex items-center gap-1.5 transition-colors"
          >
            <span>View Full Roster</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {absentStudents.length === 0 ? (
          <div className="p-8 text-center bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-center gap-2 font-medium backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>All students in Section A have verified their rings. 100% attendance!</span>
          </div>
        ) : (
          <div className="bg-slate-950/60 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-inner">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.04] text-slate-300 border-b border-white/10 font-mono text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Register No.</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">AURA Ring UID</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Simulate Tap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-slate-200">
                {absentStudents.slice(0, 6).map((student) => (
                  <tr key={student.studentId} className="hover:bg-white/[0.04] transition-colors">
                    <td className="py-3 px-4 font-mono text-cyan-300 font-semibold">
                      {student.registerNumber}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      {student.studentName}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-300 flex items-center gap-1.5">
                      <Radio className="w-3 h-3 text-cyan-400" />
                      {student.ringUid}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-mono text-rose-300 font-bold">
                        Pending Tap
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleSimulateTap(student.ringUid)}
                        className="px-3 py-1 text-xs font-bold text-cyan-200 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/50 hover:border-cyan-400 rounded-lg transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                      >
                        Tap Ring
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Hardware Telemetry Proof Modal */}
      <RingProofModal />
    </div>
  );
};
