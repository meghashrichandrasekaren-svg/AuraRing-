import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { AuraRing, RingStatus } from '../../types';
import {
  Cpu,
  Battery,
  BatteryCharging,
  Radio,
  Search,
  Filter,
  Plus,
  Link,
  Unlink,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Ban,
  Slash,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export const RingManagement: React.FC = () => {
  const {
    currentUser,
    rings,
    students,
    academicStructure,
    addRing,
    assignRingToStudent,
    unassignRing,
    updateRingStatus,
    setRingSimulatorOpen,
  } = useApp();

  // Role-based department restriction
  const isHOD = currentUser.role === 'hod';
  const isFaculty = currentUser.role === 'faculty';
  const defaultDept = isHOD ? currentUser.department || 'Information Technology' : 'ALL';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState(defaultDept);
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [assigningRing, setAssigningRing] = useState<AuraRing | null>(null);
  const [viewingRing, setViewingRing] = useState<AuraRing | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState('');

  // Form state for new ring
  const [newRingData, setNewRingData] = useState({
    ringUid: `AURA-R9-${Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase()}`,
    status: 'Unassigned' as RingStatus,
    batteryLevel: 100,
    firmwareVersion: 'v2.4.1-core',
    bleAddress: `C4:8B:2A:7E:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}`,
    hardwareBatch: 'BATCH-2024-Q4',
  });

  // Filter rings with hierarchy
  const filteredRings = useMemo(() => {
    return rings.filter((r) => {
      // Role lock
      if (isHOD && r.department && r.department !== currentUser.department) return false;
      if (isFaculty && r.assignedStudentId) {
        const student = students.find((s) => s.id === r.assignedStudentId);
        if (student && (student.department !== 'Information Technology' || student.section !== 'Section A')) {
          return false;
        }
      }

      // Dropdown filters
      if (selectedDept !== 'ALL' && r.department !== selectedDept && r.status !== 'Unassigned') return false;
      if (selectedYear !== 'ALL' && r.year !== selectedYear) return false;
      if (selectedSection !== 'ALL' && r.section !== selectedSection) return false;

      const matchesSearch =
        r.ringUid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.assignedStudentName && r.assignedStudentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.registerNumber && r.registerNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.department && r.department.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rings, students, isHOD, isFaculty, currentUser, selectedDept, selectedYear, selectedSection, searchQuery, statusFilter]);

  // Unpaired students for assignment
  const unassignedStudents = students.filter((s) => !s.ringUid);

  const handleOpenAssign = (ring: AuraRing) => {
    setAssigningRing(ring);
    setSelectedStudentId(unassignedStudents[0]?.id || students[0]?.id || '');
  };

  const submitAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (assigningRing && selectedStudentId) {
      assignRingToStudent(assigningRing.ringUid, selectedStudentId);
      setAssigningRing(null);
    }
  };

  const submitAddRing = (e: React.FormEvent) => {
    e.preventDefault();
    addRing(newRingData);
    setIsAddModalOpen(false);
    // Regenerate randomized UID for next time
    setNewRingData({
      ringUid: `AURA-R9-${Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase()}`,
      status: 'Unassigned',
      batteryLevel: 100,
      firmwareVersion: 'v2.4.1-core',
      bleAddress: `C4:8B:2A:7E:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}`,
      hardwareBatch: 'BATCH-2024-Q4',
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              AURA Ring Management
            </h1>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              {rings.length} Rings in Fleet
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage smart wearable inventory, student pairings, and hardware status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const firstUnassigned = rings.find((r) => r.status === 'Unassigned');
              if (firstUnassigned) handleOpenAssign(firstUnassigned);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-md shadow-cyan-500/20"
          >
            <Link className="w-3.5 h-3.5" />
            Assign Ring
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Register Ring
          </button>
        </div>
      </div>

      {/* Hierarchy Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Department Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              disabled={isHOD || isFaculty}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 disabled:opacity-60"
            >
              {!isHOD && !isFaculty && <option value="ALL">All Departments</option>}
              {academicStructure.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Academic Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              disabled={isFaculty}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 disabled:opacity-60"
            >
              <option value="ALL">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          {/* Section Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              disabled={isFaculty}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 disabled:opacity-60"
            >
              <option value="ALL">All Sections</option>
              <option value="Section A">Section A</option>
              <option value="Section B">Section B</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Ring Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Unassigned">Unassigned</option>
              <option value="Inactive">Inactive</option>
              <option value="Lost">Lost</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Ring UID, student name, or register number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>
      </div>

      {/* Ring Fleet Table: UID → Student → Register No → Dept → Year & Section → Status → Battery → Last Seen */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Ring UID</th>
                <th className="py-3 px-4">Assigned Student</th>
                <th className="py-3 px-4">Register No.</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Year & Section</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Battery</th>
                <th className="py-3 px-4">Last Seen</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredRings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No AURA Rings match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRings.map((ring) => (
                  <tr key={ring.ringUid} className="hover:bg-slate-800/40 transition-colors">
                    {/* Ring UID */}
                    <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                      {ring.ringUid}
                    </td>

                    {/* Student */}
                    <td className="py-3 px-4">
                      {ring.assignedStudentName ? (
                        <div className="font-semibold text-white">
                          {ring.assignedStudentName}
                        </div>
                      ) : (
                        <span className="text-slate-500 font-mono text-xs">
                          Unassigned
                        </span>
                      )}
                    </td>

                    {/* Register Number */}
                    <td className="py-3 px-4 font-mono text-cyan-400">
                      {ring.registerNumber || '—'}
                    </td>

                    {/* Department */}
                    <td className="py-3 px-4 text-slate-300">
                      {ring.department || '—'}
                    </td>

                    {/* Year & Section */}
                    <td className="py-3 px-4 text-slate-300">
                      {ring.year && ring.section ? (
                        <span className="font-medium text-slate-200">
                          {ring.year} · <span className="text-cyan-300 font-mono">{ring.section}</span>
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <StatusBadge status={ring.status} />
                    </td>

                    {/* Battery */}
                    <td className="py-3 px-4 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Battery
                          className={`w-4 h-4 ${
                            ring.batteryLevel > 40
                              ? 'text-emerald-400'
                              : ring.batteryLevel > 20
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        />
                        <span
                          className={`tabular-nums font-semibold ${
                            ring.batteryLevel > 40
                              ? 'text-emerald-300'
                              : ring.batteryLevel > 20
                              ? 'text-amber-300'
                              : 'text-rose-300'
                          }`}
                        >
                          {ring.batteryLevel}%
                        </span>
                      </div>
                    </td>

                    {/* Last Seen */}
                    <td className="py-3 px-4 text-slate-400">
                      {ring.lastSeen}
                    </td>

                    {/* Actions: View Details, Assign/Unassign */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingRing(ring)}
                          className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                          title="View Ring Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {ring.status === 'Unassigned' ? (
                          <button
                            type="button"
                            onClick={() => handleOpenAssign(ring)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors"
                          >
                            Assign
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => unassignRing(ring.ringUid)}
                            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
                            title="Unassign Ring"
                          >
                            <Unlink className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Register New Ring */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New AURA Ring to Fleet"
        subtitle="Hardware Provisioning & BLE MAC Address"
        maxWidth="md"
      >
        <form onSubmit={submitAddRing} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-medium">Hardware Ring UID</label>
            <input
              type="text"
              value={newRingData.ringUid}
              onChange={(e) => setNewRingData({ ...newRingData, ringUid: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">BLE MAC Address</label>
            <input
              type="text"
              value={newRingData.bleAddress}
              onChange={(e) => setNewRingData({ ...newRingData, bleAddress: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Firmware Version</label>
              <input
                type="text"
                value={newRingData.firmwareVersion}
                onChange={(e) => setNewRingData({ ...newRingData, firmwareVersion: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Manufacturing Batch</label>
              <input
                type="text"
                value={newRingData.hardwareBatch}
                onChange={(e) => setNewRingData({ ...newRingData, hardwareBatch: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
            >
              Register Ring
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Assign Ring to Student */}
      <Modal
        isOpen={!!assigningRing}
        onClose={() => setAssigningRing(null)}
        title="Pair AURA Ring with Student Identity"
        subtitle={`Ring Hardware: ${assigningRing?.ringUid}`}
        maxWidth="md"
      >
        <form onSubmit={submitAssign} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-medium">
              Select Student to Assign
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              required
            >
              {unassignedStudents.length > 0 && (
                <optgroup label="Students without AURA Ring">
                  {unassignedStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.registerNumber}) · {s.department} {s.section}
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label="All Students (Reassign)">
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.registerNumber}) — Current: {s.ringUid || 'None'}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded-lg text-slate-300">
            Once paired, all period attendance taps and emergency SOS signals from hardware UID{' '}
            <span className="font-mono text-cyan-400 font-bold">{assigningRing?.ringUid}</span> will be cryptographically attributed to this student.
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setAssigningRing(null)}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
            >
              Confirm Pairing
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: View Ring Details */}
      <Modal
        isOpen={!!viewingRing}
        onClose={() => setViewingRing(null)}
        title="AURA Ring Details"
        subtitle={`Hardware UID: ${viewingRing?.ringUid}`}
        maxWidth="md"
      >
        {viewingRing && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-cyan-300 text-sm">{viewingRing.ringUid}</span>
                <StatusBadge status={viewingRing.status} />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-slate-500 block text-[11px]">Assigned Student</span>
                  <span className="font-semibold text-white">
                    {viewingRing.assignedStudentName || 'None (Unassigned)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Register Number</span>
                  <span className="font-mono text-cyan-300">
                    {viewingRing.registerNumber || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Battery Level</span>
                  <span className="font-mono text-emerald-400 font-bold">{viewingRing.batteryLevel}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Last Seen</span>
                  <span className="text-slate-300">{viewingRing.lastSeen}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Firmware Version</span>
                  <span className="font-mono text-slate-300">{viewingRing.firmwareVersion}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">BLE MAC Address</span>
                  <span className="font-mono text-slate-300">{viewingRing.bleAddress}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingRing(null)}
                className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
