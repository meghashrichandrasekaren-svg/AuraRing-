import React from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_ACCOUNTS } from '../../data/mockData';
import { Role } from '../../types';
import {
  ShieldAlert,
  Radio,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentRole,
    switchAccount,
    activeSOSCount,
    setDemoGuideOpen,
    setRingSimulatorOpen,
    setSosModalOpen,
    setCurrentTab,
  } = useApp();

  const roleConfigs: { role: Role; short: string; label: string }[] = [
    { role: 'faculty', short: 'Faculty', label: 'Faculty Advisor (IT 2-A)' },
    { role: 'hod', short: 'HOD', label: 'Head of Dept (IT)' },
    { role: 'principal', short: 'Principal', label: 'Principal (Executive)' },
    { role: 'security', short: 'Security', label: 'Campus Safety & SOS' },
    { role: 'student', short: 'Student', label: 'Student Wearable' },
    { role: 'admin', short: 'Admin', label: 'System Admin' },
  ];

  return (
    <header className="h-16 border-b border-white/10 bg-slate-950/50 backdrop-blur-2xl sticky top-0 z-40 px-4 lg:px-6 flex items-center justify-between gap-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
      {/* Brand & Ring Hardware Glow */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="relative group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 flex items-center justify-center text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.45)] group-hover:shadow-[0_0_35px_rgba(6,182,212,0.65)] transition-all duration-300">
            {/* Concentric Smart Ring Graphic */}
            <div className="w-5 h-5 rounded-full border-2 border-slate-950 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
            </div>
          </div>
          {/* Outer Neon Halo */}
          <div className="absolute -inset-1 rounded-xl bg-cyan-400 opacity-25 blur-md -z-10 group-hover:opacity-50 transition-opacity" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent drop-shadow-sm">
              AURA Ring
            </span>
            <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-300 bg-cyan-950/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
              CAMPUS AI
            </span>
          </div>
          <div className="text-[11px] text-slate-300/80 font-medium">
            Smart Attendance & Distress Platform
          </div>
        </div>
      </div>

      {/* Segmented 1-Click Role Switcher - Glass Acrylic Bar */}
      <div className="hidden md:flex items-center bg-slate-900/40 backdrop-blur-xl p-1 rounded-xl border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] gap-1">
        {roleConfigs.map((cfg) => {
          const isActive = currentRole === cfg.role;
          const matchingAccount = DEMO_ACCOUNTS.find((a) => a.role === cfg.role);

          return (
            <button
              key={cfg.role}
              type="button"
              title={cfg.label}
              onClick={() => {
                if (matchingAccount) {
                  switchAccount(matchingAccount);
                  setCurrentTab('dashboard');
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 relative ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{cfg.short}</span>
              {cfg.role === 'security' && activeSOSCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Action Badges & Simulators */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Active Emergency SOS Pill */}
        {activeSOSCount > 0 ? (
          <button
            type="button"
            onClick={() => {
              const secAccount = DEMO_ACCOUNTS.find((a) => a.role === 'security');
              if (secAccount) switchAccount(secAccount);
              setCurrentTab('sos-active');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-100 bg-rose-950/80 backdrop-blur-xl border border-rose-500/70 rounded-xl animate-pulse hover:bg-rose-900 transition-all shadow-[0_0_20px_rgba(244,63,94,0.35)]"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />
            <span>{activeSOSCount} SOS Active</span>
          </button>
        ) : (
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-emerald-300 font-mono bg-emerald-950/40 backdrop-blur-xl border border-emerald-500/40 px-2.5 py-1 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Campus Safe</span>
          </div>
        )}

        {/* Ring Simulator Quick Trigger */}
        <button
          type="button"
          onClick={() => setRingSimulatorOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-200 bg-slate-900/60 backdrop-blur-xl hover:bg-cyan-950/50 border border-cyan-500/40 hover:border-cyan-400 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.35)]"
          title="Simulate AURA Ring BLE tap"
        >
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="hidden sm:inline">Tap Ring</span>
        </button>

        {/* SOS Simulator Quick Trigger */}
        <button
          type="button"
          onClick={() => setSosModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-200 bg-slate-900/60 backdrop-blur-xl hover:bg-rose-950/60 border border-rose-500/40 hover:border-rose-400 rounded-xl transition-all shadow-[0_0_15px_rgba(244,63,94,0.15)] hover:shadow-[0_0_25px_rgba(244,63,94,0.35)]"
          title="Simulate SOS distress trigger"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">Trigger SOS</span>
        </button>

        {/* Presentation Guide */}
        <button
          type="button"
          onClick={() => setDemoGuideOpen(true)}
          className="p-2 text-slate-300 hover:text-cyan-300 bg-slate-900/50 hover:bg-white/10 backdrop-blur-xl rounded-xl transition-colors border border-white/10"
          title="Presentation Guide"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
        </button>
      </div>
    </header>
  );
};
