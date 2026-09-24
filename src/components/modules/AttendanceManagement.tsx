import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { GatewayLiveFeed } from '../common/GatewayLiveFeed';
import { RingProofModal } from '../common/RingProofModal';
import {
  Radio,
  Plus,
  CheckCircle2,
  AlertCircle,
  CheckCheck,
  Search,
  UserX,
  UserCheck,
  Users,
  Sparkles,
  Fingerprint,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const AttendanceManagement: React.FC = () => {
  const {
    sessions,
    activeSession,
    currentUser,
    startSession,
    markStudentAttendance,
    verifyStudentRing,
    completeSession,
    batchVerifyAllInSession,
    setInspectingRecord,
    setProofModalOpen,
  } = useApp();

  const isFaculty = currentUser.role === 'faculty';
  const isHOD = currentUser.role === 'hod';

  // Role-filtered sessions
  const availableSessions = useMemo(() => {
    return sessions.filter((s) => {
      if (isFaculty) {
        return (
          s.department === 'Information Technology' &&
          s.year === '2nd Year' &&
          s.section === 'Section A'
        );
      }
      if (isHOD && currentUser.department) {
        return s.department === currentUser.department;
      }
      return true;
    });
  }, [sessions, isFaculty, isHOD, currentUser]);

  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    activeSession && availableSessions.some((s) => s.id === activeSession.id)
      ? activeSession.id
      : availableSessions[0]?.id || ''
  );

  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ABSENT' | 'PRESENT' | 'ALL'>('ABSENT');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form for new session
  const [newSessionForm, setNewSessionForm] = useState({
    department: isFaculty ? 'Information Technology' : isHOD && currentUser.department ? currentUser.department : 'Information Technology',
    year: isFaculty ? '2nd Year' : '2nd Year',
    section: isFaculty ? 'Section A' : 'Section A',
    facultyName: currentUser.role === 'faculty' ? currentUser.name : 'Dr. Sarah Jenkins',
    date: new Date().toISOString().substring(0, 10),
    period: 'Period 3 (11:00 AM - 11:50 AM)',
    startTime: '11:00 AM',
    endTime: '11:50 AM',
  });

  const currentSession =
    availableSessions.find((s) => s.id === selectedSessionId) ||
    availableSessions[0] ||
    sessions[0];

  const handleStartSession = (e: React.FormEvent) => {
    e.preventDefault();
    const session = startSession({
      department: newSessionForm.department,
      year: newSessionForm.year,
      section: newSessionForm.section,
      facultyId: currentUser.id,
      facultyName: newSessionForm.facultyName,
      date: newSessionForm.date,
      period: newSessionForm.period,
      startTime: newSessionForm.startTime,
      endTime: newSessionForm.endTime,
      status: 'Active',
    });
    setSelectedSessionId(session.id);
    setIsNewSessionModalOpen(false);
    setToastMessage(`Session started for ${session.department} ${session.year} ${session.section}`);
  };

  // Expected vs Present vs Absent counts
  const totalExpected = currentSession ? currentSession.records.length : 0;
  const verifiedPresentList = useMemo(() => {
    return currentSession
      ? currentSession.records.filter((r) => r.status === 'Present' || r.status === 'Late')
      : [];
  }, [currentSession]);

  const absentList = useMemo(() => {
    return currentSession
      ? currentSession.records.filter((r) => r.status === 'Absent')
      : [];
  }, [currentSession]);

  const presentCount = verifiedPresentList.length;
  const absentCount = absentList.length;
  const attendanceRate = totalExpected > 0 ? Math.round((presentCount / totalExpected) * 100) : 0;

  // Filter records
  const recordsToDisplay = useMemo(() => {
    if (!currentSession) return [];
    let baseList = currentSession.records;
    if (activeTab === 'ABSENT') {
      baseList = absentList;
    } else if (activeTab === 'PRESENT') {
      baseList = verifiedPresentList;
    }

    return baseList.filter((rec) => {
      const q = searchQuery.toLowerCase();
      return (
        rec.studentName.toLowerCase().includes(q) ||
        rec.registerNumber.toLowerCase().includes(q) ||
        rec.ringUid.toLowerCase().includes(q)
      );
    });
  }, [currentSession, activeTab, absentList, verifiedPresentList, searchQuery]);

  const handleRingTap = (ringUid: string) => {
    if (!currentSession) return;
    const res = verifyStudentRing(currentSession.id, ringUid, 'Ring');
    setToastMessage(res.message);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-sm">
              Attendance & Ring Verification
            </h1>
            <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
              {currentSession?.status || 'Active'}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            {currentSession
              ? `${currentSession.department} · ${currentSession.year} (${currentSession.section}) · ${currentSession.period}`
              : 'Classroom attendance session'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {currentSession?.status === 'Active' && (
            <>
              <button
                type="button"
                onClick={() => {
                  batchVerifyAllInSession(currentSession.id);
                  setToastMessage('BLE Gateway: All student rings verified!');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                title="Simulate all classroom BLE gateway detections"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Auto-Scan All Rings
              </button>

              <button
                type="button"
                onClick={() => {
                  completeSession(currentSession.id);
                  setToastMessage('Session sealed and saved permanently.');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)]"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Seal Session
              </button>
            </>
          )}

          {!isFaculty || currentSession?.status !== 'Active' ? (
            <button
              type="button"
              onClick={() => setIsNewSessionModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              <Plus className="w-3.5 h-3.5" />
              New Session
            </button>
          ) : null}
        </div>
      </div>

      {/* Toast Notification if any */}
      {toastMessage && (
        <div className="px-4 py-3 rounded-2xl glass-panel border-cyan-500/40 text-xs text-cyan-200 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white text-xs font-medium ml-4 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Classroom BLE Gateway Live Telemetry Stream (Visible Hardware Proof for Jury) */}
      <GatewayLiveFeed />

      {/* 3 Frosted Glass Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Expected */}
        <div className="p-5 rounded-2xl glass-card space-y-2">
          <div className="flex items-center justify-between text-slate-300 text-xs font-medium">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white tracking-tight drop-shadow-sm">
            {totalExpected}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Section expected attendance
          </div>
        </div>

        {/* Verified Present */}
        <div className="p-5 rounded-2xl glass-card-emerald space-y-2">
          <div className="flex items-center justify-between text-emerald-300 text-xs font-medium">
            <span>Verified Present</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-200 tracking-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            {presentCount}
          </div>
          <div className="text-[11px] text-emerald-300/80 font-medium">
            {attendanceRate}% Section Attendance
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

      {/* Session Selector & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        {/* Filter Tabs: Absent | Present | All */}
        <div className="flex items-center bg-slate-900/40 backdrop-blur-xl p-1 rounded-xl border border-white/10 shadow-inner gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('ABSENT')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'ABSENT'
                ? 'bg-rose-500/25 text-rose-200 border border-rose-400/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>Absent</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-rose-950 text-rose-300">
              {absentCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PRESENT')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'PRESENT'
                ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>Present</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300">
              {presentCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'ALL'
                ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>All Roster</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono text-slate-200 bg-slate-800">
              {totalExpected}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search student or ring UID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Roster Table - Pure Frosted Glass Panel */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.04] text-slate-300 border-b border-white/10 font-mono text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Register No.</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">AURA Ring UID & Signal</th>
                <th className="py-3.5 px-4">Wearable Anti-Proxy</th>
                <th className="py-3.5 px-4">Timestamp & Latency</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-slate-200">
              {recordsToDisplay.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    {activeTab === 'ABSENT'
                      ? 'No absent students! All students have verified their AURA Rings.'
                      : 'No student records match filter.'}
                  </td>
                </tr>
              ) : (
                recordsToDisplay.map((record) => {
                  const isPresent = record.status === 'Present' || record.status === 'Late';
                  const isSkinLocked = record.skinContactVerified !== false && isPresent;

                  return (
                    <tr
                      key={record.studentId}
                      className={`hover:bg-white/[0.04] transition-colors ${
                        !isPresent ? 'bg-rose-950/15' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-semibold text-cyan-300">
                        {record.registerNumber}
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        {record.studentName}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs">
                        <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                          <Radio className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{record.ringUid}</span>
                        </div>
                        {isPresent && record.rssiDbm && (
                          <div className="text-[10px] text-cyan-400/90 font-mono mt-0.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block animate-pulse" />
                            <span>BLE RSSI: {record.rssiDbm} dBm (&lt; 1.2m)</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {isPresent ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                            <Fingerprint className="w-3 h-3 text-emerald-400" />
                            Skin: Locked (Worn)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/40">
                            <AlertCircle className="w-3 h-3 text-rose-400" />
                            Awaiting Proximity
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300 text-[11px]">
                        <div>{record.markedTime || '—'}</div>
                        {isPresent && record.packetLatencyMs && (
                          <div className="text-[10px] text-slate-400">
                            Handshake: {record.packetLatencyMs}ms
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={record.status} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        {currentSession?.status === 'Active' ? (
                          !isPresent ? (
                            <button
                              type="button"
                              onClick={() => handleRingTap(record.ringUid)}
                              className="px-3 py-1 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded-lg transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                            >
                              Tap Ring
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                markStudentAttendance(
                                  currentSession.id,
                                  record.studentId,
                                  'Absent',
                                  'Manual'
                                )
                              }
                              className="px-2 py-0.5 text-[11px] text-slate-400 hover:text-rose-300 transition-colors"
                            >
                              Reset
                            </button>
                          )
                        ) : (
                          <span className="text-[11px] text-slate-500 font-mono">Sealed</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hardware Telemetry Certificate Modal */}
      <RingProofModal />

      {/* Modal: Start Session */}
      <Modal
        isOpen={isNewSessionModalOpen}
        onClose={() => setIsNewSessionModalOpen(false)}
        title="Start Attendance Session"
      >
        <form onSubmit={handleStartSession} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Department</label>
              <select
                value={newSessionForm.department}
                onChange={(e) => setNewSessionForm({ ...newSessionForm, department: e.target.value })}
                disabled={isFaculty || isHOD}
                className="w-full glass-input rounded-xl px-3 py-2 text-slate-200 focus:outline-none disabled:opacity-60"
              >
                <option value="Information Technology">Information Technology</option>
                <option value="Computer Science & Eng">Computer Science & Eng</option>
                <option value="Electronics & Comm">Electronics & Comm</option>
                <option value="Mechanical Eng">Mechanical Eng</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Academic Year</label>
              <select
                value={newSessionForm.year}
                onChange={(e) => setNewSessionForm({ ...newSessionForm, year: e.target.value })}
                disabled={isFaculty}
                className="w-full glass-input rounded-xl px-3 py-2 text-slate-200 focus:outline-none disabled:opacity-60"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Section</label>
              <select
                value={newSessionForm.section}
                onChange={(e) => setNewSessionForm({ ...newSessionForm, section: e.target.value })}
                disabled={isFaculty}
                className="w-full glass-input rounded-xl px-3 py-2 text-slate-200 focus:outline-none disabled:opacity-60"
              >
                <option value="Section A">Section A</option>
                <option value="Section B">Section B</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Advisor</label>
              <input
                type="text"
                value={newSessionForm.facultyName}
                onChange={(e) => setNewSessionForm({ ...newSessionForm, facultyName: e.target.value })}
                className="w-full glass-input rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Period</label>
              <select
                value={newSessionForm.period}
                onChange={(e) => setNewSessionForm({ ...newSessionForm, period: e.target.value })}
                className="w-full glass-input rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
              >
                <option value="Period 1 (08:30 AM - 09:20 AM)">Period 1 (08:30 AM - 09:20 AM)</option>
                <option value="Period 2 (09:30 AM - 10:20 AM)">Period 2 (09:30 AM - 10:20 AM)</option>
                <option value="Period 3 (11:00 AM - 11:50 AM)">Period 3 (11:00 AM - 11:50 AM)</option>
                <option value="Period 4 (01:00 PM - 01:50 PM)">Period 4 (01:00 PM - 01:50 PM)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewSessionModalOpen(false)}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              Start Session
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
