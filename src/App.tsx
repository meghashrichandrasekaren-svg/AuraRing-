import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { PrincipalDashboard } from './components/dashboards/PrincipalDashboard';
import { HODDashboard } from './components/dashboards/HODDashboard';
import { FacultyDashboard } from './components/dashboards/FacultyDashboard';
import { SecurityDashboard } from './components/dashboards/SecurityDashboard';
import { StudentDashboard } from './components/dashboards/StudentDashboard';
import { StudentManagement } from './components/modules/StudentManagement';
import { FacultyManagement } from './components/modules/FacultyManagement';
import { AcademicStructure } from './components/modules/AcademicStructure';
import { RingManagement } from './components/modules/RingManagement';
import { AttendanceManagement } from './components/modules/AttendanceManagement';
import { ReportsAndAnalytics } from './components/modules/ReportsAndAnalytics';
import { AuditLogsView } from './components/modules/AuditLogsView';
import { SettingsView } from './components/modules/SettingsView';
import { DemoGuideModal } from './components/common/DemoGuideModal';
import { RingTapSimulatorModal } from './components/common/RingTapSimulatorModal';
import { SOSTriggerModal } from './components/common/SOSTriggerModal';

const AppContent: React.FC = () => {
  const { currentRole, currentTab } = useApp();

  const renderContent = () => {
    // 1. Dashboard tab -> Render role-specific dashboard
    if (currentTab === 'dashboard') {
      switch (currentRole) {
        case 'admin':
          return <AdminDashboard />;
        case 'principal':
          return <PrincipalDashboard />;
        case 'hod':
          return <HODDashboard />;
        case 'faculty':
          return <FacultyDashboard />;
        case 'security':
          return <SecurityDashboard />;
        case 'student':
          return <StudentDashboard />;
        default:
          return <AdminDashboard />;
      }
    }

    // 2. Specific Module Tabs
    switch (currentTab) {
      case 'students':
        return <StudentManagement />;

      case 'faculty':
        return <FacultyManagement />;

      case 'departments':
      case 'years-sections':
        return <AcademicStructure />;

      case 'rings':
        return <RingManagement />;

      case 'attendance':
      case 'ring-verification':
        return <AttendanceManagement />;

      case 'sos-active':
      case 'sos-history':
      case 'emergency-contacts':
        return <SecurityDashboard />;

      case 'student-attendance':
      case 'student-ring':
      case 'student-contacts':
      case 'student-sos':
        return <StudentDashboard />;

      case 'reports':
        return <ReportsAndAnalytics />;

      case 'audit-logs':
        return <AuditLogsView />;

      case 'settings':
        return <SettingsView />;

      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070A13] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════════════
          LUMINESCENT AMBIENT ORBS (Visible behind Frosted Glass)
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-Right Cyan/Sky Orb */}
        <div className="ambient-orb-1 absolute -top-24 -right-24 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-cyan-500/20 via-sky-600/15 to-transparent blur-[120px]" />

        {/* Top-Left Indigo/Violet Orb */}
        <div className="ambient-orb-2 absolute top-1/4 -left-36 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-600/18 via-purple-600/12 to-transparent blur-[140px]" />

        {/* Bottom-Center Emerald Orb */}
        <div className="ambient-orb-3 absolute -bottom-36 left-1/3 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-emerald-500/14 via-teal-600/10 to-transparent blur-[150px]" />

        {/* Micro-dot constellation grid layer */}
        <div className="absolute inset-0 bg-grid-mesh opacity-30" />
      </div>

      {/* Main Glassmorphic Shell */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto min-h-[calc(100vh-4rem)]">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Global Interactive Simulation & Presentation Modals */}
      <DemoGuideModal />
      <RingTapSimulatorModal />
      <SOSTriggerModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
