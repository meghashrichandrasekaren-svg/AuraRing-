import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Building2, GitBranch, Users, GraduationCap, Plus, ChevronRight, UserCheck } from 'lucide-react';

export const AcademicStructure: React.FC = () => {
  const { academicStructure, facultyList } = useApp();
  const [selectedDeptId, setSelectedDeptId] = useState(academicStructure[0]?.id || 'dept-1');

  const selectedDept = academicStructure.find((d) => d.id === selectedDeptId) || academicStructure[0];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Academic Hierarchy: Department → Year → Section
            </h1>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              No Subject System
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Section-oriented organizational architecture. Attendance is linked directly to Section and Period, not subjects.
          </p>
        </div>
      </div>

      {/* Department Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {academicStructure.map((dept) => (
          <button
            key={dept.id}
            type="button"
            onClick={() => setSelectedDeptId(dept.id)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
              selectedDeptId === dept.id
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{dept.name}</span>
            <span className="font-mono text-[10px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
              {dept.code}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Department Overview */}
      {selectedDept && (
        <div className="space-y-6">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{selectedDept.name} ({selectedDept.code})</h2>
                <span className="text-xs text-slate-400 font-mono">ID: {selectedDept.id}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Head of Department (HOD): <span className="text-cyan-300 font-semibold">{selectedDept.hodName}</span>
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="text-right">
                <span className="text-slate-400 block">Total Students</span>
                <span className="text-base font-bold text-white">{selectedDept.totalStudents}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block">Faculty Members</span>
                <span className="text-base font-bold text-indigo-400">{selectedDept.totalFaculty}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block">AURA Rings</span>
                <span className="text-base font-bold text-cyan-400">{selectedDept.totalRingsAssigned}</span>
              </div>
            </div>
          </div>

          {/* Academic Years & Sections Grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Academic Progression (Years 1 to 4)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedDept.years.map((yearObj) => (
                <div
                  key={yearObj.year}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-bold text-white">{yearObj.year}</span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      {yearObj.sections.length} Active Sections
                    </span>
                  </div>

                  <div className="space-y-2">
                    {yearObj.sections.map((sec) => (
                      <div
                        key={sec.section}
                        className="p-3 bg-slate-950 rounded-lg border border-slate-800/90 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-white flex items-center gap-2">
                            <span>{sec.section}</span>
                            <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-800/40">
                              {sec.studentCount} Enrolled Scholars
                            </span>
                          </div>
                          <div className="text-slate-400 text-[11px] mt-1 flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                            <span>Section Advisor: </span>
                            <span className="text-slate-200 font-medium">{sec.advisor}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                            Ring Verified Roster
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
