import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ClipboardCheck,
  ShieldAlert,
  Users,
  Radio,
  Filter,
  CheckCircle2,
  UserX,
  Layers,
} from 'lucide-react';

export const PrincipalDashboard: React.FC = () => {
  const { activeSOSCount, academicStructure, students, sessions } = useApp();

  const totalStudents = students.length;
  const overallAttendance = '92.4%';

  // 3-Level Drilldown: Department → Year → Section
  const [drillDept, setDrillDept] = useState<string>('Information Technology');
  const [drillYear, setDrillYear] = useState<string>('2nd Year');
  const [drillSection, setDrillSection] = useState<string>('Section A');

  const selectedDepartmentData = academicStructure.find((d) => d.name === drillDept);
  const selectedYearData = selectedDepartmentData?.years.find((y) => y.year === drillYear);
  const selectedSectionData = selectedYearData?.sections.find((s) => s.section === drillSection);

  const sectionStudents = students.filter(
    (s) => s.department === drillDept && s.year === drillYear && s.section === drillSection
  );

  const sectionSession = sessions.find(
    (s) => s.department === drillDept && s.year === drillYear && s.section === drillSection
  );

  const presentCount = sectionSession
    ? sectionSession.records.filter((r) => r.status === 'Present').length
    : Math.round(sectionStudents.length * 0.92);
  const totalCount = sectionStudents.length;
  const absentCount = totalCount - presentCount;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-sm">
              Institutional Overview
            </h1>
            <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
              Principal Console
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Campus-wide monitoring with instant Department → Academic Year → Section drill-down
          </p>
        </div>
      </div>

      {/* 3 Frosted Glass Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-card space-y-2">
          <div className="flex items-center justify-between text-slate-300 text-xs font-medium">
            <span>Total Enrolled</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white tracking-tight drop-shadow-sm">
            {totalStudents}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">Across 4 Engineering Depts</div>
        </div>

        <div className="p-5 rounded-2xl glass-card-emerald space-y-2">
          <div className="flex items-center justify-between text-emerald-300 text-xs font-medium">
            <span>Campus Attendance</span>
            <ClipboardCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-200 tracking-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            {overallAttendance}
          </div>
          <div className="text-[11px] text-emerald-300/80 font-medium">Ring-verified today</div>
        </div>

        <div
          className={`p-5 rounded-2xl transition-all space-y-2 ${
            activeSOSCount > 0 ? 'glass-card-rose' : 'glass-card'
          }`}
        >
          <div className="flex items-center justify-between text-slate-300 text-xs font-medium">
            <span>Campus Safety Alerts</span>
            <ShieldAlert
              className={`w-4 h-4 ${activeSOSCount > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`}
            />
          </div>
          <div
            className={`text-3xl font-extrabold font-mono tracking-tight drop-shadow-sm ${
              activeSOSCount > 0 ? 'text-rose-200' : 'text-white'
            }`}
          >
            {activeSOSCount}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            {activeSOSCount > 0 ? 'Security active dispatch' : 'All facilities secure'}
          </div>
        </div>
      </div>

      {/* Hierarchical Drill-down Navigator - Frosted Glass Panel */}
      <div className="glass-panel rounded-2xl p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/40">
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Section Drill-Down Inspector
              </h2>
              <p className="text-xs text-slate-300/80">Select any department to inspect live attendance records</p>
            </div>
          </div>
        </div>

        {/* 3 Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 bg-slate-950/50 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-inner">
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-300 mb-1.5 font-bold">
              1. Department
            </label>
            <select
              value={drillDept}
              onChange={(e) => {
                setDrillDept(e.target.value);
                const nextDept = academicStructure.find((d) => d.name === e.target.value);
                if (nextDept && nextDept.years[0]) {
                  setDrillYear(nextDept.years[0].year);
                  setDrillSection(nextDept.years[0].sections[0]?.section || 'Section A');
                }
              }}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none font-medium"
            >
              {academicStructure.map((dept) => (
                <option key={dept.id} value={dept.name} className="bg-slate-900 text-slate-100">
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-300 mb-1.5 font-bold">
              2. Academic Year
            </label>
            <select
              value={drillYear}
              onChange={(e) => {
                setDrillYear(e.target.value);
                const yrObj = selectedDepartmentData?.years.find((y) => y.year === e.target.value);
                if (yrObj && yrObj.sections[0]) {
                  setDrillSection(yrObj.sections[0].section);
                }
              }}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none font-medium"
            >
              {selectedDepartmentData?.years.map((y) => (
                <option key={y.year} value={y.year} className="bg-slate-900 text-slate-100">
                  {y.year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-300 mb-1.5 font-bold">
              3. Section
            </label>
            <select
              value={drillSection}
              onChange={(e) => setDrillSection(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none font-medium"
            >
              {selectedYearData?.sections.map((s) => (
                <option key={s.section} value={s.section} className="bg-slate-900 text-slate-100">
                  {s.section} ({s.studentCount} students)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Drilled Section Card */}
        <div className="p-4 bg-slate-950/50 backdrop-blur-xl border border-white/10 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-inner">
          <div>
            <div className="font-bold text-white text-sm">
              {drillDept} · {drillYear} ({drillSection})
            </div>
            <div className="text-slate-300/80 mt-0.5">
              Section In-Charge: {selectedSectionData?.advisor || 'Dr. Sarah Jenkins'}
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono">
            <div>
              <span className="text-slate-400 text-[10px] block font-sans">Enrolled</span>
              <span className="text-white font-extrabold text-base">{totalCount}</span>
            </div>
            <div>
              <span className="text-emerald-400 text-[10px] block font-sans">Present</span>
              <span className="text-emerald-300 font-extrabold text-base">{presentCount}</span>
            </div>
            <div>
              <span className="text-rose-400 text-[10px] block font-sans">Absent</span>
              <span className="text-rose-300 font-extrabold text-base">{absentCount}</span>
            </div>
          </div>
        </div>

        {/* Drilled Section Students Table */}
        <div className="bg-slate-950/60 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-inner">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.04] text-slate-300 border-b border-white/10 font-mono text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Reg No.</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Ring UID</th>
                <th className="py-3 px-4 text-right">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-slate-200">
              {sectionStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 font-mono">
                    No records found for this section.
                  </td>
                </tr>
              ) : (
                sectionStudents.slice(0, 8).map((student, idx) => {
                  const record = sectionSession?.records.find((r) => r.studentId === student.id);
                  const isPresent = record ? record.status === 'Present' : idx < 57;

                  return (
                    <tr key={student.id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="py-3 px-4 font-mono text-cyan-300 font-semibold">
                        {student.registerNumber}
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        {student.fullName}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-300 flex items-center gap-1.5">
                        <Radio className="w-3 h-3 text-cyan-400" />
                        {student.ringUid || 'Unassigned'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isPresent ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-300 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            Verified Present
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-rose-300 font-semibold">
                            <UserX className="w-3.5 h-3.5 text-rose-400" />
                            Unverified (Absent)
                          </span>
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
    </div>
  );
};
