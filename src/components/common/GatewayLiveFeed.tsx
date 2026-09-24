import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Radio,
  Wifi,
  Activity,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Sparkles,
  RefreshCw,
  Sliders,
} from 'lucide-react';

interface GatewayLiveFeedProps {
  onTapSimulator?: () => void;
}

export const GatewayLiveFeed: React.FC<GatewayLiveFeedProps> = ({ onTapSimulator }) => {
  const {
    liveGatewayLogs,
    clearGatewayLogs,
    setRingSimulatorOpen,
    activeSession,
    setInspectingRecord,
    setProofModalOpen,
  } = useApp();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const acceptedCount = liveGatewayLogs.filter((l) => l.status === 'ACCEPTED').length;
  const rejectedCount = liveGatewayLogs.filter((l) => l.status !== 'ACCEPTED').length;

  return (
    <div className="rounded-2xl glass-panel border border-cyan-500/30 overflow-hidden shadow-2xl">
      {/* Header bar: Gateway Status & Controls */}
      <div className="p-4 sm:p-5 bg-slate-950/60 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Animated BLE Gateway Pulse Antenna */}
          <div className="relative w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-slate-950" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-1.5">
                Classroom BLE 5.2 Gateway
                <span className="text-[11px] font-mono text-cyan-300 font-bold bg-cyan-950/70 border border-cyan-500/40 px-2 py-0.2 rounded-md">
                  GATEWAY-IT-LH302
                </span>
              </h3>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 flex items-center gap-2 font-mono">
              <span className="text-emerald-400 flex items-center gap-1">
                <Wifi className="w-3 h-3" /> 2.402 GHz Mesh Active
              </span>
              <span>·</span>
              <span className="text-slate-400">Proximity Threshold: &le; 1.8m (-65 dBm)</span>
            </p>
          </div>
        </div>

        {/* Live Counters & Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10">
            <span className="text-emerald-400 font-bold">{acceptedCount} Verified</span>
            {rejectedCount > 0 && (
              <>
                <span className="text-slate-500">|</span>
                <span className="text-rose-400 font-bold">{rejectedCount} Blocked</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              if (onTapSimulator) onTapSimulator();
              else setRingSimulatorOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.35)]"
            title="Open interactive wearable ring simulator"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Test Tap at Reader</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-white/[0.04] border border-white/10 transition-colors"
            title={isExpanded ? 'Collapse Gateway Stream' : 'Expand Gateway Stream'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Live Telemetry Packet Stream */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-bold flex items-center gap-1.5 font-mono text-[11px]">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              REAL-TIME INCOMING BLE RING TELEMETRY STREAM
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Live packets decoded from wearable hardware beacons
            </span>
          </div>

          {/* Packet Cards Container */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {liveGatewayLogs.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-950/40 rounded-xl border border-white/10 font-mono">
                Listening for BLE advertising beacons from student AURA Rings...
              </div>
            ) : (
              liveGatewayLogs.slice(0, 8).map((packet) => {
                const isAccepted = packet.status === 'ACCEPTED';
                const isProxyRejection = packet.status === 'REJECTED_PROXY';

                return (
                  <div
                    key={packet.id}
                    className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                      isAccepted
                        ? 'bg-slate-950/70 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                        : isProxyRejection
                        ? 'bg-rose-950/60 border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                        : 'bg-amber-950/60 border-amber-500/50'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      {/* Status Icon */}
                      <div
                        className={`p-1.5 rounded-lg shrink-0 ${
                          isAccepted
                            ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-400'
                            : 'bg-rose-950 border border-rose-500/50 text-rose-400'
                        }`}
                      >
                        {isAccepted ? (
                          <ShieldCheck className="w-4 h-4" />
                        ) : (
                          <AlertTriangle className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-white">{packet.studentName}</span>
                          <span className="text-[10px] font-mono text-slate-400">({packet.registerNumber})</span>
                          <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-500/40">
                            {packet.ringUid}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-300 mt-0.5 flex flex-wrap items-center gap-2 font-mono">
                          <span className="text-cyan-400">RSSI: {packet.rssiDbm} dBm</span>
                          <span>·</span>
                          <span className={packet.skinContact ? 'text-emerald-300' : 'text-rose-400 font-bold'}>
                            Skin Contact: {packet.skinContact ? 'LOCKED (Worn)' : 'DISCONNECTED (Proxy Alert)'}
                          </span>
                          <span>·</span>
                          <span className="text-slate-400">{packet.latencyMs}ms</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span className="text-[10px] font-mono text-slate-400">{packet.timestamp}</span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                          isAccepted
                            ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40'
                            : 'bg-rose-900/80 text-rose-300 border border-rose-500/60'
                        }`}
                      >
                        {isAccepted ? 'PRESENT' : isProxyRejection ? 'REJECTED: PROXY' : 'CROSS-SECTION'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
