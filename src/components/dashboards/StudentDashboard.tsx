import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { RingProofModal } from '../common/RingProofModal';
import {
  Cpu,
  ClipboardCheck,
  ShieldAlert,
  Battery,
  PhoneCall,
  Radio,
  CheckCircle2,
  Zap,
  Fingerprint,
  FileCheck,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    students,
    rings,
    sessions,
    setSosModalOpen,
    setRingSimulatorOpen,
    setInspectingRecord,
    setProofModalOpen,
  } = useApp();

  // Find student record
  const student =
    students.find((s) => s.id === currentUser.assignedStudentId) ||
    students.find((s) => s.fullName.includes('Aditya')) ||
    students[0];

  const ring = rings.find((r) => r.ringUid === student?.ringUid);

  // Student attendance records
  const studentRecords = sessions.flatMap((s) =>
    s.records
      .filter((rec) => rec.studentId === student.id || rec.registerNumber === student.registerNumber)
      .map((rec) => ({ ...rec, session: s }))
  );

  const presentCount = studentRecords.filter(
    (r) => r.status === 'Present' || r.status === 'Late'
  ).length;
  const attendanceRate =
    studentRecords.length > 0
      ? Math.round((presentCount / studentRecords.length) * 100)
      : 96;

  // Today's attendance status
  const todayRecord = studentRecords[0];
  const todayStatus = todayRecord ? todayRecord.status : 'Present';

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-sm">
            Hi, {student.fullName}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            {student.department} · {student.year} ({student.section}) · Reg: {student.registerNumber}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRingSimulatorOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] self-start sm:self-auto"
        >
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          Test Tap at Reader
        </button>
      </div>

      {/* 3 Frosted Glass Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Today's Attendance */}
        <div className="p-5 rounded-2xl glass-card-emerald space-y-2">
          <div className="flex items-center justify-between text-emerald-300 text-xs font-medium">
            <span>Today's Attendance</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-200 mt-2 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            {todayStatus}
          </div>
          <div className="text-xs text-emerald-300/80 mt-1">
            {todayRecord ? `${todayRecord.session.period}` : 'Verified via AURA Ring'}
          </div>
        </div>

        {/* Attendance Percentage */}
        <div className="p-5 rounded-2xl glass-card space-y-2">
          <div className="flex items-center justify-between text-slate-300 text-xs font-medium">
            <span>Attendance Rate</span>
            <ClipboardCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-2 tabular-nums drop-shadow-sm">
            {attendanceRate}%
          </div>
          <div className="text-xs text-slate-400 mt-1">Academic requirement: &ge; 75%</div>
        </div>

        {/* AURA Ring Status */}
        <div className="p-5 rounded-2xl glass-card-cyan space-y-2">
          <div className="flex items-center justify-between text-cyan-300 text-xs font-medium">
            <span>AURA Ring Status</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-cyan-200 mt-2 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            {ring ? ring.status : 'Active'}
          </div>
          <div className="text-xs text-cyan-300/80 mt-1 font-mono">
            UID: {ring ? ring.ringUid : student.ringUid}
          </div>
        </div>
      </div>

      {/* Two Main Sections: My AURA Ring & Emergency SOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* My AURA Ring Card - Pure Frosted Glass */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/40">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                </div>
                <h2 className="text-sm font-bold text-white">My AURA Ring</h2>
              </div>
              <StatusBadge status={ring?.status || 'Active'} />
            </div>

            <div className="space-y-4 pt-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Hardware Ring UID</span>
                <span className="font-mono font-bold text-cyan-300">
                  {ring?.ringUid || student.ringUid}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-300">Battery Level</span>
                <div className="flex items-center gap-2 font-mono font-bold text-emerald-300">
                  <Battery className="w-4 h-4 text-emerald-400" />
                  <span>{ring?.batteryLevel || 88}% Charged</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-300">Last Synced at Reader</span>
                <span className="text-slate-200 font-mono">{ring?.lastSeen || '10:14 AM Today'}</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-6 pt-3 border-t border-white/10">
            Automatic check-in happens seamlessly upon entering classrooms.
          </p>
        </div>

        {/* Emergency SOS Card - Pure Frosted Glass */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-950/60 border border-rose-500/40">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                </div>
                <h2 className="text-sm font-bold text-white">Emergency Assistance</h2>
              </div>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-lg">
                24/7 Monitored
              </span>
            </div>

            <div className="space-y-3 pt-4 text-xs">
              <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-200 text-[11px] leading-relaxed">
                <strong>Project Highlight (3-Tap SOS):</strong> Triple tapping your physical AURA Ring sends your emergency GPS coordinates directly to your <strong>Parents (Instant SMS)</strong> and the <strong>Nearest Police Station</strong> within seconds.
              </div>

              <div className="p-3 bg-white/[0.03] rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">
                    Emergency Guardian
                  </span>
                  <span className="font-bold text-white">
                    {student.emergencyContact.name} ({student.emergencyContact.relation})
                  </span>
                </div>
                <div className="text-cyan-300 font-mono text-xs flex items-center gap-1.5 font-bold">
                  <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{student.emergencyContact.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSosModalOpen(true)}
            className="w-full mt-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 rounded-xl transition-all shadow-[0_0_20px_rgba(244,63,94,0.35)] flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            Trigger Emergency SOS
          </button>
        </div>
      </div>

      {/* Period Attendance History - Frosted Glass Panel */}
      <div className="glass-panel rounded-2xl p-6 shadow-2xl">
        <h2 className="text-sm font-bold text-white mb-4">Recent Period Attendance</h2>
        <div className="divide-y divide-white/[0.06] text-xs">
          {studentRecords.slice(0, 4).map((rec, i) => (
            <div key={i} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-white">{rec.session.period}</div>
                <div className="text-slate-300/80 text-[11px] mt-0.5">
                  {rec.session.department} · Advisor: {rec.session.facultyName} · {rec.session.date}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-300 font-mono text-[11px]">{rec.markedTime || '10:04 AM'}</span>
                <StatusBadge status={rec.status} />
                {(rec.status === 'Present' || rec.status === 'Late') && (
                  <button
                    type="button"
                    onClick={() => {
                      setInspectingRecord(rec);
                      setProofModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 rounded-md transition-colors"
                    title="View hardware wearable attendance certificate"
                  >
                    <FileCheck className="w-3 h-3 text-cyan-400" />
                    <span>Proof</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hardware Telemetry Modal */}
      <RingProofModal />
    </div>
  );
};
