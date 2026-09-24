import React, { useState } from 'react';
import { Settings, Save, Shield, Cpu, Bell, CheckCircle2, Server } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    institutionName: 'Apex Institute of Technology & Engineering',
    campusCode: 'AIT-CAMPUS-01',
    companyName: 'AUVEXZA PRIVATE LIMITED',
    hardwareModel: 'AURA Ring Gen-3 Enterprise (Titanium)',
    firmwareChannel: 'Stable (v2.4.1)',
    bleScanWindowMs: '3000',
    bleRssiThreshold: '-75',
    sosAutoEscalateSeconds: '90',
    securityHotline: '+91 94480 00111',
    dailyAttendanceCutoff: '17:30',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Institutional System Settings</h1>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              Platform Config
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Global AURA Ring AI parameters, hardware gateway thresholds, and campus security dispatch rules.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800 px-3 py-1.5 rounded-lg">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Enterprise Identity */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Server className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Institutional & Vendor Parameters</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Institution Name</label>
              <input
                type="text"
                value={settings.institutionName}
                onChange={(e) => setSettings({ ...settings, institutionName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Technology Vendor</label>
              <input
                type="text"
                value={settings.companyName}
                disabled
                className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-slate-400 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Hardware & BLE Gateway Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">AURA Ring BLE / NFC Telemetry Settings</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Active Firmware Release</label>
              <input
                type="text"
                value={settings.firmwareChannel}
                onChange={(e) => setSettings({ ...settings, firmwareChannel: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">BLE Scan Interval (ms)</label>
              <input
                type="text"
                value={settings.bleScanWindowMs}
                onChange={(e) => setSettings({ ...settings, bleScanWindowMs: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Proximity RSSI Threshold (dBm)</label>
              <input
                type="text"
                value={settings.bleRssiThreshold}
                onChange={(e) => setSettings({ ...settings, bleRssiThreshold: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Safety & SOS Emergency Dispatch Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Shield className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-semibold text-white">Emergency Distress & Security Dispatch</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                Unacknowledged SOS Auto-Escalate Timer (seconds)
              </label>
              <input
                type="text"
                value={settings.sosAutoEscalateSeconds}
                onChange={(e) => setSettings({ ...settings, sosAutoEscalateSeconds: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Security Control Room Hotline</label>
              <input
                type="text"
                value={settings.securityHotline}
                onChange={(e) => setSettings({ ...settings, securityHotline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-md shadow-cyan-500/20"
          >
            <Save className="w-4 h-4" />
            Save Institutional Settings
          </button>
        </div>
      </form>
    </div>
  );
};
