import React from 'react';
import { Modal } from './Modal';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  LayoutDashboard,
  Users,
  Cpu,
  ClipboardCheck,
  ShieldAlert,
  GraduationCap,
  UserCheck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const DemoGuideModal: React.FC = () => {
  const { demoGuideOpen, setDemoGuideOpen, triggerDemoStep, currentRole } = useApp();

  const steps = [
    {
      step: 1,
      title: 'Admin Login & Institutional KPIs',
      role: 'Admin',
      icon: LayoutDashboard,
      desc: 'View executive metrics: Total Students, Active Students, Faculty count, Ring fleet deployment, and real-time attendance.',
    },
    {
      step: 2,
      title: 'Student Profile & Ring Linkage',
      role: 'Admin',
      icon: Users,
      desc: 'Open student records (e.g. Aditya Rao, REG-2024-IT-0142) and see hardware pairing with AURA Ring UID (AURA-R9-44B2).',
    },
    {
      step: 3,
      title: 'AURA Ring Fleet Management',
      role: 'Admin',
      icon: Cpu,
      desc: 'Inspect Ring UIDs, real-time battery levels, firmware versions, BLE signals, and perform assign/unassign/block/lost actions.',
    },
    {
      step: 4,
      title: 'Smart Ring Hardware Attendance Verification',
      role: 'Faculty',
      icon: ClipboardCheck,
      desc: 'Verify attendance strictly via physical AURA Ring BLE 5.2 proximity (-42 dBm) and capacitive skin sensor lock with tamper-proof cryptographic certificates.',
    },
    {
      step: 5,
      title: 'AURA Ring 3-Tap SOS: Dual Parent SMS & Police Station Dispatch',
      role: 'Security',
      icon: ShieldAlert,
      desc: 'The project crown-jewel: Triple-tapping the AURA Ring broadcasts encrypted distress coordinates simultaneously to Parents via automated SMS and the Nearest Police Station (1.4 km) while dispatching campus security.',
    },
    {
      step: 6,
      title: 'Faculty Portal & Assigned Sections',
      role: 'Faculty',
      icon: GraduationCap,
      desc: 'Dr. Sarah Jenkins view with assigned 2nd Year Section A students, session attendance, and ring verification logs.',
    },
    {
      step: 7,
      title: 'Student Personal Hub & Safety Ring',
      role: 'Student',
      icon: UserCheck,
      desc: 'Aditya Rao view: Personal attendance %, AURA Ring battery (91%), firmware status, emergency contacts, and one-tap SOS.',
    },
  ];

  return (
    <Modal
      isOpen={demoGuideOpen}
      onClose={() => setDemoGuideOpen(false)}
      title="Presentation Story & Demo Guide"
      subtitle="Follow the end-to-end 7-step narrative for investor & institutional presentations"
      maxWidth="xl"
    >
      <div className="space-y-4">
        <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl text-xs text-cyan-200 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p>
            Click <span className="font-semibold text-white">"Launch Step"</span> on any card to instantly switch demo accounts and navigate to that exact screen in the presentation flow.
          </p>
        </div>

        <div className="space-y-2.5">
          {steps.map((s) => (
            <div
              key={s.step}
              className="p-3.5 bg-slate-950 border border-slate-800/90 rounded-xl hover:border-slate-700 transition-colors flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 text-cyan-400">
                  <s.icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">Step {s.step}</span>
                    <span className="text-xs text-slate-500">·</span>
                    <span className="text-xs text-slate-400 font-medium">Role: {s.role}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100 mt-0.5">{s.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  triggerDemoStep(s.step);
                  setDemoGuideOpen(false);
                }}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 rounded-lg transition-all"
              >
                Launch
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => setDemoGuideOpen(false)}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </Modal>
  );
};
