import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { SOSAlert } from '../../types';
import {
  ShieldAlert,
  Clock,
  MapPin,
  CheckCircle2,
  Radio,
  Send,
  PhoneCall,
  History,
  AlertTriangle,
  MessageSquare,
  Building2,
  Smartphone,
  ShieldCheck,
  ExternalLink,
  Share2,
} from 'lucide-react';

export const SecurityDashboard: React.FC = () => {
  const {
    currentUser,
    sosAlerts,
    activeSOSCount,
    acknowledgeSOS,
    respondSOS,
    resolveSOS,
    setSosModalOpen,
  } = useApp();

  const [selectedAlert, setSelectedAlert] = useState<SOSAlert | null>(null);
  const [modalType, setModalType] = useState<'respond' | 'resolve' | null>(null);

  // Form states
  const [responderTeam, setResponderTeam] = useState('Campus Quick Response Unit 1 (QRU-1)');
  const [etaMinutes, setEtaMinutes] = useState('2 minutes');
  const [resolutionNotes, setResolutionNotes] = useState(
    'Patrol arrived on scene. Student evaluated, confirmed safe, and escorted.'
  );
  const [confirmSafe, setConfirmSafe] = useState(true);

  // Filter alerts
  const activeAlerts = sosAlerts.filter(
    (a) => a.status === 'Triggered' || a.status === 'Acknowledged' || a.status === 'Responding'
  );
  const resolvedAlerts = sosAlerts.filter(
    (a) => a.status === 'Resolved' || a.status === 'Cancelled'
  );

  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const handleAcknowledge = (alert: SOSAlert) => {
    acknowledgeSOS(alert.id, currentUser.name);
  };

  const handleOpenRespond = (alert: SOSAlert) => {
    setSelectedAlert(alert);
    setModalType('respond');
  };

  const handleOpenResolve = (alert: SOSAlert) => {
    setSelectedAlert(alert);
    setModalType('resolve');
  };

  const submitRespond = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlert) return;
    respondSOS(selectedAlert.id, responderTeam, etaMinutes);
    setModalType(null);
    setSelectedAlert(null);
  };

  const submitResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlert) return;
    resolveSOS(selectedAlert.id, resolutionNotes, confirmSafe);
    setModalType(null);
    setSelectedAlert(null);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header & Active Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-sm">
              Emergency SOS Response Center
            </h1>
            <span
              className={`text-xs font-mono px-3 py-1 rounded-xl font-bold backdrop-blur-md shadow-lg ${
                activeSOSCount > 0
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse'
                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              }`}
            >
              {activeSOSCount > 0 ? `${activeSOSCount} Active Distress` : 'All Clear · Safe'}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Life-safety distress alerts received from student AURA Rings across campus.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSosModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-200 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/50 rounded-xl transition-all shadow-[0_0_15px_rgba(244,63,94,0.2)] self-start sm:self-auto"
        >
          <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          Test SOS Alert
        </button>
      </div>

      {/* Tabs: Active Alerts vs History */}
      <div className="flex items-center bg-slate-900/40 backdrop-blur-xl p-1 rounded-xl border border-white/10 shadow-inner w-fit gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'active'
              ? 'bg-rose-500/25 text-rose-200 border border-rose-400/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Active SOS Alerts ({activeAlerts.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <History className="w-4 h-4 text-cyan-400" />
          <span>Resolved History ({resolvedAlerts.length})</span>
        </button>
      </div>

      {/* ACTIVE ALERTS LIST */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {activeAlerts.length === 0 ? (
            <div className="p-12 text-center glass-panel rounded-2xl shadow-2xl">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
              <h3 className="text-base font-bold text-white">No Active Emergency Alerts</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                All campus zones and student wearables are operating normally. Any AURA Ring distress trigger will appear here immediately.
              </p>
            </div>
          ) : (
            activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-6 rounded-2xl glass-card-rose shadow-2xl space-y-4"
              >
                {/* Alert Header: Student, Time, Location, Status */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg font-bold text-white">{alert.studentName}</span>
                      <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 px-2 py-0.5 rounded-lg">
                        {alert.registerNumber}
                      </span>
                      <StatusBadge status={alert.status} />
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      {alert.department} · {alert.year} ({alert.section}) · Ring UID: {alert.ringUid}
                    </div>
                  </div>

                  <div className="text-right sm:text-right">
                    <div className="flex items-center sm:justify-end gap-1.5 text-xs text-rose-200 font-mono font-bold">
                      <Clock className="w-3.5 h-3.5 text-rose-400" />
                      <span>{alert.time}</span>
                    </div>
                    <div className="flex items-center sm:justify-end gap-1.5 text-xs text-slate-300 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>{alert.location}</span>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact availability */}
                <div className="p-3.5 bg-slate-950/60 backdrop-blur-xl rounded-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-inner">
                  <div className="text-slate-300">
                    Emergency Guardian: <strong className="text-white">{alert.emergencyContact.name}</strong> ({alert.emergencyContact.relation})
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-cyan-300 font-bold">
                    <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{alert.emergencyContact.phone}</span>
                  </div>
                </div>

                {/* DUAL EMERGENCY BROADCAST DISPATCH: PARENT SMS & POLICE OUTPOST */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  {/* Parent SMS Dispatch Box */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-emerald-500/30 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
                        <span className="flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5" />
                          Parent SMS Broadcast
                        </span>
                        <span className="text-[10px] bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-500/40 text-emerald-300">
                          {alert.parentNotification?.deliveryStatus || 'DELIVERED'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300">
                        To: {alert.parentNotification?.recipientName || alert.emergencyContact.name} ({alert.parentNotification?.recipientNumber || alert.emergencyContact.phone})
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 line-clamp-2 italic font-sans bg-black/40 p-1.5 rounded">
                        "{alert.parentNotification?.smsBody || `[AURA RING EMERGENCY SOS]: Urgent distress alert from ${alert.studentName}. Triple-tapped ring at ${alert.location}.`}"
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end">
                      <a
                        href={`https://wa.me/${(alert.parentNotification?.recipientNumber || alert.emergencyContact.phone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(alert.parentNotification?.smsBody || `[AURA RING EMERGENCY SOS]: Distress from ${alert.studentName}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>Live Parent WhatsApp</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>

                  {/* Nearby Police Station Dispatch Box */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-500/30 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-cyan-400 font-bold mb-1">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" />
                          Nearby Police Station
                        </span>
                        <span className="text-[10px] bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-500/40 text-cyan-300">
                          {alert.policeStationDispatch?.dispatchStatus || 'NOTIFIED'}
                        </span>
                      </div>
                      <div className="text-[11px] text-cyan-200 font-bold truncate">
                        {alert.policeStationDispatch?.stationName || 'T-1 Guindy Police Station (Law & Order)'}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                        <span>Dist: {alert.policeStationDispatch?.distanceKm || 1.4} km</span>
                        <span className="text-amber-300 font-bold">Hotline: {alert.policeStationDispatch?.emergencyHotline || '112'}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end">
                      <a
                        href={alert.googleMapsUrl || (() => {
                          const match = alert.policeStationDispatch?.gpsCoordinates?.match(/([0-9.]+)[^0-9]+([0-9.]+)/);
                          if (match) {
                            return `https://www.google.com/maps/search/?api=1&query=${match[1]},${match[2]}`;
                          }
                          return "https://www.google.com/maps/search/?api=1&query=11.2741,77.6256";
                        })()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-cyan-300 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 transition-all"
                      >
                        <MapPin className="w-3 h-3 text-rose-400" />
                        <span>View Live GPS Pinpoint</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Workflow Action Buttons: Acknowledge -> Respond -> Resolve */}
                <div className="pt-2 flex flex-wrap items-center justify-end gap-3 border-t border-white/10">
                  {alert.status === 'Triggered' && (
                    <button
                      type="button"
                      onClick={() => handleAcknowledge(alert)}
                      className="px-5 py-2 text-xs font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-[0_0_20px_rgba(251,191,36,0.35)]"
                    >
                      1. Acknowledge Distress Alert
                    </button>
                  )}

                  {alert.status === 'Acknowledged' && (
                    <button
                      type="button"
                      onClick={() => handleOpenRespond(alert)}
                      className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.35)] flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      2. Dispatch Response Unit
                    </button>
                  )}

                  {alert.status === 'Responding' && (
                    <button
                      type="button"
                      onClick={() => handleOpenResolve(alert)}
                      className="px-5 py-2 text-xs font-extrabold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      3. Resolve & Confirm Student Safe
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* RESOLVED HISTORY LIST */}
      {activeTab === 'history' && (
        <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.04] text-slate-300 border-b border-white/10 uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Resolution Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-slate-200">
              {resolvedAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-white/[0.04] transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-300">{alert.time}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{alert.studentName}</div>
                    <div className="text-[11px] text-cyan-300 font-mono">{alert.registerNumber}</div>
                  </td>
                  <td className="py-3 px-4">{alert.location}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={alert.status} />
                  </td>
                  <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                    {alert.resolutionNotes || 'Resolved safely by security patrol.'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Dispatch Team */}
      <Modal
        isOpen={modalType === 'respond'}
        onClose={() => setModalType(null)}
        title="Dispatch Campus Response Unit"
        subtitle={`Incident for ${selectedAlert?.studentName} at ${selectedAlert?.location}`}
        maxWidth="md"
      >
        <form onSubmit={submitRespond} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-medium">Assigned Patrol Unit</label>
            <input
              type="text"
              value={responderTeam}
              onChange={(e) => setResponderTeam(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Estimated Arrival Time</label>
            <input
              type="text"
              value={etaMinutes}
              onChange={(e) => setEtaMinutes(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalType(null)}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-lg shadow-indigo-600/30"
            >
              Confirm Dispatch
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Resolve Alert */}
      <Modal
        isOpen={modalType === 'resolve'}
        onClose={() => setModalType(null)}
        title="Resolve Incident & Audit Closure"
        subtitle={`Student: ${selectedAlert?.studentName}`}
        maxWidth="md"
      >
        <form onSubmit={submitResolve} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-medium">Incident Resolution Notes</label>
            <textarea
              rows={3}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
              required
            />
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer p-3.5 bg-slate-950/60 rounded-xl border border-white/10">
            <input
              type="checkbox"
              checked={confirmSafe}
              onChange={(e) => setConfirmSafe(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-white/20 focus:ring-0"
            />
            <span className="text-slate-200 font-medium">
              I certify that the student has been contacted in person and confirmed safe.
            </span>
          </label>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalType(null)}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-extrabold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)]"
            >
              Seal & Resolve Incident
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
