import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  Cpu,
  ClipboardCheck,
  ShieldAlert,
  BarChart3,
  ScrollText,
  Clock,
  User,
  HeartPulse,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentRole, currentTab, setCurrentTab, activeSOSCount, currentUser } = useApp();

  interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeColor?: string;
  }

  const getNavItems = (): NavItem[] => {
    switch (currentRole) {
      case 'faculty':
        return [
          { id: 'dashboard', label: 'Section Workspace', icon: LayoutDashboard },
          { id: 'attendance', label: 'Live Attendance', icon: ClipboardCheck },
          { id: 'students', label: 'Student Roster', icon: Users },
          { id: 'reports', label: 'Attendance Reports', icon: BarChart3 },
        ];

      case 'hod':
        return [
          { id: 'dashboard', label: 'IT Dept Overview', icon: LayoutDashboard },
          { id: 'attendance', label: 'Section Sessions', icon: ClipboardCheck },
          { id: 'students', label: 'All IT Students', icon: Users },
          { id: 'faculty', label: 'Faculty Advisors', icon: GraduationCap },
          { id: 'reports', label: 'Department Analytics', icon: BarChart3 },
        ];

      case 'principal':
        return [
          { id: 'dashboard', label: 'Campus Overview', icon: LayoutDashboard },
          { id: 'departments', label: 'Department Hierarchy', icon: Building2 },
          { id: 'attendance', label: 'Campus Attendance', icon: ClipboardCheck },
          { id: 'reports', label: 'Analytics & Trends', icon: BarChart3 },
        ];

      case 'security':
        return [
          {
            id: 'dashboard',
            label: 'Emergency Console',
            icon: ShieldAlert,
            badge: activeSOSCount > 0 ? `${activeSOSCount} SOS` : undefined,
            badgeColor: 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/50',
          },
          { id: 'sos-history', label: 'Incident History', icon: Clock },
        ];

      case 'student':
        return [
          { id: 'dashboard', label: 'My Status', icon: User },
          { id: 'student-attendance', label: 'Attendance History', icon: ClipboardCheck },
          { id: 'student-ring', label: 'AURA Ring Health', icon: HeartPulse },
        ];

      case 'admin':
      default:
        return [
          { id: 'dashboard', label: 'System Overview', icon: LayoutDashboard },
          { id: 'students', label: 'Students', icon: Users },
          { id: 'faculty', label: 'Faculty & Advisors', icon: GraduationCap },
          { id: 'departments', label: 'Departments & Sections', icon: Building2 },
          { id: 'rings', label: 'AURA Ring Fleet', icon: Cpu },
          { id: 'attendance', label: 'Attendance Sessions', icon: ClipboardCheck },
          {
            id: 'sos-active',
            label: 'Emergency SOS',
            icon: ShieldAlert,
            badge: activeSOSCount > 0 ? activeSOSCount : undefined,
            badgeColor: 'bg-rose-600 text-white',
          },
          { id: 'audit-logs', label: 'System Audit Logs', icon: ScrollText },
        ];
    }
  };

  const navItems = getNavItems();

  // Role avatar initials
  const initials = currentUser.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  return (
    <aside className="w-60 border-r border-white/10 bg-slate-950/40 backdrop-blur-2xl flex flex-col shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none shadow-[4px_0_30px_rgba(0,0,0,0.3)]">
      {/* Current Active Persona Card - Frosted Acrylic Tile */}
      <div className="p-4 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/30 to-blue-600/30 border border-cyan-400/50 flex items-center justify-center text-xs font-mono font-bold text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              {currentRole.toUpperCase()} VIEW
            </div>
            <div className="font-bold text-xs text-white truncate leading-tight mt-0.5">
              {currentUser.name}
            </div>
            <div className="text-[11px] text-slate-300/80 truncate">
              {currentUser.designation}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-200 font-bold border border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.2),inset_0_1px_0_0_rgba(255,255,255,0.2)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shrink-0 ${
                    item.badgeColor || 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Gateway Telemetry Footer */}
      <div className="p-3.5 border-t border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between text-[11px] text-slate-300/80">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
            </span>
            <span className="font-medium">Classroom BLE</span>
          </div>
          <span className="font-mono text-emerald-400 font-bold">2.4 GHz Active</span>
        </div>
      </div>
    </aside>
  );
};
