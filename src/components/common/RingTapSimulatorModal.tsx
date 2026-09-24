import React, { useState } from 'react';
import { Modal } from './Modal';
import { useApp } from '../../context/AppContext';
import {
  Radio,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  Fingerprint,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

export const RingTapSimulatorModal: React.FC = () => {
  const {
    ringSimulatorOpen,
    setRingSimulatorOpen,
    rings,
    students,
    sessions,
    activeSession,
    verifyStudentRing,
    setInspectingRecord,
    setProofModalOpen,
    setSosModalOpen,
  } = useApp();

  const [selectedRingUid, setSelectedRingUid] = useState<string>(
    rings.find((r) => r.status === 'Active')?.ringUid || rings[0]?.ringUid || ''
  );
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    activeSession?.id || sessions[0]?.id || ''
  );
  const [skinContact, setSkinContact] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [handshakePhase, setHandshakePhase] = useState<number>(0); // 0: Idle, 1: Beacon, 2: Anti-Proxy, 3: Crypto, 4: Commit
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    studentName?: string;
    isProxyDetected?: boolean;
  } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const activeRings = rings.filter((r) => r.assignedStudentId);
  const currentRing = rings.find((r) => r.ringUid === selectedRingUid);
  const currentStudent = students.find((s) => s.id === currentRing?.assignedStudentId);

  // Play synthetic tone using Web Audio API
  const playTone = (success: boolean) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (success) {
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.15); // A6
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      } else {
        osc.frequency.setValueAtTime(320, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(160, audioCtx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.28);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.28);
      }
    } catch {
      // Audio context may be restricted
    }
  };

  const handleSimulateTap = () => {
    if (!selectedRingUid || !selectedSessionId) return;

    setIsScanning(true);
    setScanResult(null);
    setHandshakePhase(1);

    // Realistic phase 1: BLE beacon
    setTimeout(() => {
      setHandshakePhase(2);

      // Phase 2: Anti-proxy capacitive sensor
      setTimeout(() => {
        if (!skinContact) {
          // Failed at anti-proxy stage!
          setIsScanning(false);
          setHandshakePhase(0);
          const res = verifyStudentRing(selectedSessionId, selectedRingUid, 'Ring', false);
          setScanResult(res);
          playTone(false);
          return;
        }

        setHandshakePhase(3);

        // Phase 3: Cryptographic challenge
        setTimeout(() => {
          setHandshakePhase(4);

          // Phase 4: Commit to ledger
          setTimeout(() => {
            setIsScanning(false);
            setHandshakePhase(0);
            const res = verifyStudentRing(selectedSessionId, selectedRingUid, 'Ring', true);
            setScanResult(res);
            playTone(res.success);
          }, 200);
        }, 220);
      }, 250);
    }, 200);
  };

  const handleViewProof = () => {
    const targetSession = sessions.find((s) => s.id === selectedSessionId);
    const rec = targetSession?.records.find((r) => r.ringUid === selectedRingUid);
    if (rec) {
      setInspectingRecord(rec);
      setProofModalOpen(true);
    }
  };

  return (
    <Modal
      isOpen={ringSimulatorOpen}
      onClose={() => {
        setRingSimulatorOpen(false);
        setScanResult(null);
        setHandshakePhase(0);
      }}
      title="AURA Ring Contactless BLE Tap Simulator"
      subtitle="Classroom sensor gateway handshake demonstration with anti-proxy protection"
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Hardware Wearable Visualizer - Frosted Glass Container */}
        <div className="glass-panel p-6 rounded-2xl text-center relative overflow-hidden shadow-2xl">
          {/* Ambient Glow Halo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-10">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-white/[0.05] border border-white/10 transition-colors"
              title={soundEnabled ? 'Mute acoustic chirp' : 'Enable acoustic chirp'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex flex-col items-center justify-center py-2 relative z-10">
            {/* Concentric Wearable Ring Design */}
            <div
              className={`w-28 h-28 rounded-full border-4 flex items-center justify-center transition-all duration-500 shadow-2xl relative ${
                isScanning
                  ? 'border-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.7)] scale-105'
                  : scanResult?.success
                  ? 'border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.6)]'
                  : scanResult?.isProxyDetected || scanResult?.success === false
                  ? 'border-rose-400 shadow-[0_0_40px_rgba(244,63,94,0.6)]'
                  : 'border-cyan-500/50 bg-slate-950/70 shadow-[0_0_25px_rgba(6,182,212,0.25)]'
              }`}
            >
              {/* Inner metallic chamber */}
              <div className="w-20 h-20 rounded-full border-2 border-white/20 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center shadow-inner">
                <Cpu className={`w-7 h-7 ${isScanning ? 'text-cyan-400 animate-spin' : 'text-cyan-300'}`} />
                <span className="text-[8px] font-mono font-bold tracking-widest text-cyan-300 mt-0.5">
                  AURA BLE
                </span>
              </div>

              {/* Pulsing ring waves if scanning */}
              {isScanning && (
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping" />
              )}
            </div>

            <div className="mt-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-mono text-cyan-300 shadow-inner">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>UID: {selectedRingUid}</span>
                {currentRing && (
                  <>
                    <span>·</span>
                    <span className="text-slate-300">Batt: {currentRing.batteryLevel}%</span>
                  </>
                )}
              </div>

              {currentStudent && (
                <p className="text-sm font-bold text-white mt-1">
                  {currentStudent.fullName} · <span className="text-slate-300 font-mono text-xs">{currentStudent.rollNumber}</span>
                </p>
              )}
            </div>
          </div>

          {/* 4-Phase Handshake Stepper (Shows the jury how the hardware verifies attendance) */}
          <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-4 gap-1.5 text-[10px] font-mono">
            <div
              className={`p-2 rounded-lg border text-center transition-all ${
                handshakePhase >= 1
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-950/40 border-white/5 text-slate-500'
              }`}
            >
              <div className="font-bold">Phase 1</div>
              <div className="truncate">BLE Beacon</div>
            </div>

            <div
              className={`p-2 rounded-lg border text-center transition-all ${
                handshakePhase >= 2
                  ? skinContact
                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                    : 'bg-rose-950/80 border-rose-400 text-rose-300'
                  : 'bg-slate-950/40 border-white/5 text-slate-500'
              }`}
            >
              <div className="font-bold">Phase 2</div>
              <div className="truncate">Anti-Proxy</div>
            </div>

            <div
              className={`p-2 rounded-lg border text-center transition-all ${
                handshakePhase >= 3
                  ? 'bg-purple-950/80 border-purple-400 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                  : 'bg-slate-950/40 border-white/5 text-slate-500'
              }`}
            >
              <div className="font-bold">Phase 3</div>
              <div className="truncate">SHA-256 Key</div>
            </div>

            <div
              className={`p-2 rounded-lg border text-center transition-all ${
                handshakePhase >= 4
                  ? 'bg-teal-950/80 border-teal-400 text-teal-300 shadow-[0_0_10px_rgba(20,184,166,0.3)]'
                  : 'bg-slate-950/40 border-white/5 text-slate-500'
              }`}
            >
              <div className="font-bold">Phase 4</div>
              <div className="truncate">Committed</div>
            </div>
          </div>

          {/* Real-time Scan Result Card */}
          {scanResult && (
            <div
              className={`mt-4 p-3.5 rounded-xl border text-left flex items-start justify-between gap-3 backdrop-blur-md shadow-lg ${
                scanResult.success
                  ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/70 border-rose-500/50 text-rose-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {scanResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="text-xs">
                  <p className="font-bold">
                    {scanResult.success
                      ? 'Attendance Verified via Smart Ring'
                      : scanResult.isProxyDetected
                      ? 'Proxy Attempt Blocked by Hardware'
                      : 'Verification Issue'}
                  </p>
                  <p className="text-slate-300 mt-0.5">{scanResult.message}</p>
                </div>
              </div>

              {scanResult.success && (
                <button
                  type="button"
                  onClick={handleViewProof}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[11px] shrink-0 hover:bg-emerald-400 transition-colors"
                >
                  <span>View Proof</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Anti-Proxy Jury Demonstration Switch */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Fingerprint className="w-4 h-4 text-cyan-400" />
              <span>Anti-Proxy Protection (Wearable Skin Contact)</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSkinContact(!skinContact);
                setScanResult(null);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                skinContact
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'bg-rose-950 text-rose-300 border border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
              }`}
            >
              {skinContact ? '✓ Worn on Finger (Skin Locked)' : '✕ Detached (Test Proxy)'}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {skinContact
              ? 'Ring is actively worn on student’s finger. Capacitive contact active. Normal attendance tap.'
              : 'Simulates a classmate trying to buddy-punch with a borrowed ring! The system detects absence of skin contact and automatically rejects attendance.'}
          </p>
        </div>

        {/* Configuration Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Select AURA Ring
            </label>
            <select
              value={selectedRingUid}
              onChange={(e) => {
                setSelectedRingUid(e.target.value);
                setScanResult(null);
              }}
              className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none font-mono"
            >
              {activeRings.map((r) => (
                <option key={r.ringUid} value={r.ringUid} className="bg-slate-900 text-slate-100">
                  {r.ringUid} — {r.assignedStudentName} ({r.department || 'IT'} {r.section})
                </option>
              ))}
              {rings
                .filter((r) => !r.assignedStudentId)
                .map((r) => (
                  <option key={r.ringUid} value={r.ringUid} className="bg-slate-900 text-slate-100">
                    {r.ringUid} — [Unassigned Ring Hardware]
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Target Classroom Session
            </label>
            <select
              value={selectedSessionId}
              onChange={(e) => {
                setSelectedSessionId(e.target.value);
                setScanResult(null);
              }}
              className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none"
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-slate-100">
                  {s.department} · {s.year} {s.section} · {s.period} ({s.status})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setRingSimulatorOpen(false);
              setSosModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-300 bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 rounded-xl transition-all shadow-[0_0_15px_rgba(244,63,94,0.2)]"
            title="Demonstrate physical Ring Triple-Tap Emergency distress alert"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>Demonstrate Ring Triple-Tap SOS</span>
          </button>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setRingSimulatorOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              disabled={isScanning}
              onClick={handleSimulateTap}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 disabled:opacity-50 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              {isScanning ? (
                <>
                  <Radio className="w-4 h-4 animate-spin" />
                  Validating Wearable Handshake...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Tap Ring to Classroom Sensor
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

