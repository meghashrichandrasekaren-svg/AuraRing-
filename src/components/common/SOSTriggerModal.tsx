import React, { useState } from 'react';
import { Modal } from './Modal';
import { useApp } from '../../context/AppContext';
import { SOSTriggerType, SOSAlert } from '../../types';
import {
  ShieldAlert,
  ArrowRight,
  BellRing,
  CheckCircle2,
  Flame,
  Fingerprint,
  Check,
} from 'lucide-react';

export const SOSTriggerModal: React.FC = () => {
  const {
    sosModalOpen,
    setSosModalOpen,
    students,
    triggerSOS,
    switchRole,
    setCurrentTab,
  } = useApp();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students[0]?.id || ''
  );
  const [triggerType, setTriggerType] = useState<SOSTriggerType>('Ring');
  const [customLocation, setCustomLocation] = useState<string>(
    'Nandha Engineering College, Erode — IT Department Block'
  );
  const [alertFired, setAlertFired] = useState<boolean>(false);
  const [createdAlert, setCreatedAlert] = useState<SOSAlert | null>(null);

  // Triple-Tap Interactive Animation state
  const [tapCount, setTapCount] = useState<number>(0);
  const [isTapTriggering, setIsTapTriggering] = useState<boolean>(false);

  const student = students.find((s) => s.id === selectedStudentId);

  const locations = [
    'Nandha Engineering College, Erode — IT Department Block',
    'Nandha Engineering College, Erode — Central Library & Seminar Hall',
    'Nandha Engineering College, Erode — Main Academic Quadrangle',
    'Nandha Engineering College, Erode — Computer Science & Tech Lab',
    'Nandha Engineering College, Erode — Cafeteria & Student Amenities',
    'Nandha Engineering College, Erode — Sports Complex & Athletic Ground',
    'Nandha Engineering College, Erode — Main Entrance Security Gate',
  ];

  // DIRECT INSTANT SOS TRIGGER (Only displays Emergency Alert Sended)
  const handleExecuteTrigger = () => {
    if (!selectedStudentId) return;

    const locToUse = customLocation.trim() || 'Nandha Engineering College, Erode — Main Academic Quadrangle';

    const alert = triggerSOS(
      selectedStudentId,
      triggerType,
      locToUse,
      student?.emergencyContact.phone || '+91 98400 98765',
      student?.emergencyContact.name || 'Parent/Guardian',
      { lat: 11.2741, lng: 77.6256, accuracyMeters: 10 }
    );

    setCreatedAlert(alert);
    setAlertFired(true);
    setTapCount(0);
    setIsTapTriggering(false);
  };

  const handleRingTripleTapSimulation = () => {
    const nextCount = tapCount + 1;
    setTapCount(nextCount);

    if (nextCount >= 3) {
      setIsTapTriggering(true);
      setTimeout(() => {
        handleExecuteTrigger();
      }, 300);
    }
  };

  const handleGoToSecurity = () => {
    setSosModalOpen(false);
    setAlertFired(false);
    setCreatedAlert(null);
    switchRole('security');
    setCurrentTab('sos-active');
  };

  return (
    <Modal
      isOpen={sosModalOpen}
      onClose={() => {
        setSosModalOpen(false);
        setAlertFired(false);
        setCreatedAlert(null);
        setTapCount(0);
      }}
      title="AURA Ring Emergency SOS Distress Hub"
      subtitle="Wearable Ring Emergency Trigger"
      maxWidth="lg"
    >
      {!alertFired ? (
        <div className="space-y-5">
          {/* Highlight Banner: Ring Triple-Tap Interactive Simulation */}
          <div className="relative overflow-hidden rounded-2xl p-5 border border-rose-500/50 bg-gradient-to-r from-rose-950/90 via-slate-950 to-red-950/80 shadow-[0_0_30px_rgba(244,63,94,0.25)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
              {/* Concentric Wearable Ring Button */}
              <div
                onClick={handleRingTripleTapSimulation}
                className="relative cursor-pointer group flex flex-col items-center justify-center shrink-0"
                title="Click 3 times to simulate physical ring triple tap!"
              >
                <div
                  className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-300 shadow-2xl relative ${
                    tapCount > 0
                      ? 'border-rose-400 shadow-[0_0_35px_rgba(244,63,94,0.8)] scale-105'
                      : 'border-rose-500/50 bg-slate-950/90 shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:border-rose-400'
                  }`}
                >
                  <div className="w-16 h-16 rounded-full border border-rose-300/40 bg-gradient-to-tr from-rose-950 to-slate-900 flex flex-col items-center justify-center">
                    <ShieldAlert
                      className={`w-6 h-6 ${
                        tapCount > 0 ? 'text-rose-300 animate-bounce' : 'text-rose-400'
                      }`}
                    />
                    <span className="text-[8px] font-mono text-rose-300 font-bold mt-0.5">
                      {tapCount === 0 ? 'TAP 3x' : `TAP ${tapCount}/3`}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-rose-300 mt-1.5 flex items-center gap-1">
                  <Fingerprint className="w-3 h-3" />
                  {tapCount === 0 ? 'Click to Test 3-Tap' : `${3 - tapCount} tap remaining`}
                </span>
              </div>

              {/* Explanatory banner */}
              <div className="flex-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-950/90 border border-rose-500/50 text-[10px] font-mono font-bold text-rose-300 mb-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  EMERGENCY SOS TRIGGER
                </div>
                <h3 className="text-base font-extrabold text-white tracking-tight">
                  Instant Physical Ring Triple-Tap SOS
                </h3>
                <p className="text-xs text-rose-200/90 leading-relaxed mt-1">
                  Pressing the emergency trigger or tapping the AURA Ring <strong>three times</strong> immediately dispatches an emergency alert.
                </p>
              </div>
            </div>
          </div>

          {/* Trigger Form Controls */}
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Select Student Wearer
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => {
                  setSelectedStudentId(e.target.value);
                  setTapCount(0);
                }}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-slate-100">
                    {s.fullName} ({s.registerNumber}) · {s.department} · Ring: {s.ringUid || 'Unassigned'}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  SOS Trigger Mechanism
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Ring', 'Manual', 'System'] as SOSTriggerType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTriggerType(t)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        triggerType === t
                          ? 'bg-rose-950/70 border-rose-500 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                          : 'bg-white/[0.03] border-white/10 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <div className="text-xs font-bold">{t === 'Ring' ? 'Ring 3-Tap' : t}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {t === 'Ring' ? 'Triple Tap' : t === 'Manual' ? 'In-App' : 'Gate Beacon'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Campus Zone
                </label>
                <select
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc} className="bg-slate-900 text-slate-100">
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-white/10">
            <span className="text-[11px] text-emerald-400 font-mono hidden sm:inline flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Direct Emergency Alert
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSosModalOpen(false);
                  setTapCount(0);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white rounded-xl transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleExecuteTrigger}
                disabled={isTapTriggering}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-50 rounded-xl transition-all shadow-[0_0_25px_rgba(244,63,94,0.4)]"
              >
                <BellRing className="w-4 h-4 animate-bounce" />
                <span>Trigger Emergency SOS</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* SIMPLE SOS RESULT SCREEN: ONLY SHOWS EMERGENCY ALERT SENDED */
        <div className="py-6 space-y-6 text-center">
          {/* Big Success Icon */}
          <div className="w-20 h-20 bg-emerald-950/90 border-2 border-emerald-500 text-emerald-300 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(16,185,129,0.5)] animate-pulse">
            <Check className="w-10 h-10 text-emerald-400 stroke-[3]" />
          </div>

          {/* Prominent Emergency Alert Sended Text */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/60 text-xs font-mono font-bold text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              STATUS: DISPATCHED
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Emergency Alert Sended!
            </h3>
            <p className="text-sm font-semibold text-emerald-300/90">
              அவசர உதவி அலர்ட் வெற்றிகரமாக அனுப்பப்பட்டது!
            </p>
          </div>

          {/* Student & Place Summary */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 max-w-md mx-auto text-xs font-mono space-y-2.5 text-slate-300 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-slate-400">Student:</span>
              <span className="text-white font-bold">{student?.fullName} ({student?.registerNumber})</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-slate-400">Campus Location:</span>
              <span className="text-cyan-300 font-bold truncate max-w-[240px]">{createdAlert?.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Alert Status:</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                SENDED
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSosModalOpen(false);
                setAlertFired(false);
                setCreatedAlert(null);
              }}
              className="px-5 py-2.5 text-xs font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl transition-all"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleGoToSecurity}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 rounded-xl transition-all shadow-[0_0_25px_rgba(244,63,94,0.4)]"
            >
              <span>Security Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
