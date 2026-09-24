import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { Student } from '../../types';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Cpu,
  UserCheck,
  UserX,
  Phone,
  Mail,
  Calendar,
  Eye,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const StudentManagement: React.FC = () => {
  const {
    students,
    rings,
    currentUser,
    academicStructure,
    addStudent,
    updateStudent,
    deleteStudent,
    toggleStudentStatus,
    assignRingToStudent,
  } = useApp();

  const isFaculty = currentUser.role === 'faculty';
  const isHOD = currentUser.role === 'hod';

  const defaultDept = isHOD
    ? currentUser.department || 'Information Technology'
    : isFaculty
    ? 'Information Technology'
    : 'ALL';
  const defaultYear = isFaculty ? '2nd Year' : 'ALL';
  const defaultSection = isFaculty ? 'Section A' : 'ALL';

  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState(defaultDept);
  const [yearFilter, setYearFilter] = useState(defaultYear);
  const [sectionFilter, setSectionFilter] = useState(defaultSection);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [deleteConfirmStudent, setDeleteConfirmStudent] = useState<Student | null>(null);
  const [assignRingStudent, setAssignRingStudent] = useState<Student | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    registerNumber: '',
    rollNumber: '',
    fullName: '',
    email: '',
    phone: '',
    department: isHOD && currentUser.department ? currentUser.department : 'Information Technology',
    year: '2nd Year',
    section: 'Section A',
    dateOfBirth: '2005-01-01',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    ringUid: '',
    emergencyName: '',
    emergencyRelation: 'Parent',
    emergencyPhone: '',
    bloodGroup: 'O+',
  });

  const [selectedRingForAssignment, setSelectedRingForAssignment] = useState('');

  // Unassigned rings for selection
  const unassignedRings = rings.filter((r) => r.status === 'Unassigned');

  // Filter students with strict institutional hierarchy and role security
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // 1. Role boundaries
      if (isFaculty) {
        if (
          s.department !== 'Information Technology' ||
          s.year !== '2nd Year' ||
          s.section !== 'Section A'
        ) {
          return false;
        }
      } else if (isHOD) {
        if (currentUser.department && s.department !== currentUser.department) {
          return false;
        }
      }

      // 2. Dropdown hierarchy filters
      if (deptFilter !== 'ALL' && s.department !== deptFilter) return false;
      if (yearFilter !== 'ALL' && s.year !== yearFilter) return false;
      if (sectionFilter !== 'ALL' && s.section !== sectionFilter) return false;

      // 3. Search and status
      const matchesSearch =
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.registerNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.ringUid && s.ringUid.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    students,
    isFaculty,
    isHOD,
    currentUser,
    deptFilter,
    yearFilter,
    sectionFilter,
    searchQuery,
    statusFilter,
  ]);

  const handleOpenAdd = () => {
    setFormData({
      registerNumber: `REG-2024-IT-0${140 + students.length + 1}`,
      rollNumber: `22IT0${40 + students.length + 1}`,
      fullName: '',
      email: '',
      phone: '+91 9',
      department: 'Information Technology',
      year: '2nd Year',
      section: 'Section A',
      dateOfBirth: '2005-05-15',
      gender: 'Male',
      ringUid: unassignedRings[0]?.ringUid || '',
      emergencyName: '',
      emergencyRelation: 'Father',
      emergencyPhone: '+91 9',
      bloodGroup: 'B+',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      registerNumber: student.registerNumber,
      rollNumber: student.rollNumber,
      fullName: student.fullName,
      email: student.email,
      phone: student.phone,
      department: student.department,
      year: student.year,
      section: student.section,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      ringUid: student.ringUid || '',
      emergencyName: student.emergencyContact.name,
      emergencyRelation: student.emergencyContact.relation,
      emergencyPhone: student.emergencyContact.phone,
      bloodGroup: student.bloodGroup || 'O+',
    });
  };

  const submitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addStudent({
      registerNumber: formData.registerNumber,
      rollNumber: formData.rollNumber,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      year: formData.year,
      section: formData.section,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      status: 'Active',
      ringUid: formData.ringUid || undefined,
      bloodGroup: formData.bloodGroup,
      joinedDate: '2024-08-10',
      emergencyContact: {
        name: formData.emergencyName || 'Emergency Contact',
        relation: formData.emergencyRelation,
        phone: formData.emergencyPhone || '+91 90000 00000',
      },
    });
    setIsAddModalOpen(false);
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    updateStudent(editingStudent.id, {
      registerNumber: formData.registerNumber,
      rollNumber: formData.rollNumber,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      year: formData.year,
      section: formData.section,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      ringUid: formData.ringUid || undefined,
      bloodGroup: formData.bloodGroup,
      emergencyContact: {
        name: formData.emergencyName,
        relation: formData.emergencyRelation,
        phone: formData.emergencyPhone,
      },
    });
    setEditingStudent(null);
  };

  const confirmDelete = () => {
    if (deleteConfirmStudent) {
      deleteStudent(deleteConfirmStudent.id);
      setDeleteConfirmStudent(null);
    }
  };

  const handleAssignRingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (assignRingStudent && selectedRingForAssignment) {
      assignRingToStudent(selectedRingForAssignment, assignRingStudent.id);
      setAssignRingStudent(null);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Student Directory & Hardware Assignment
            </h1>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              {students.length} Total Enrolled
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {isFaculty
              ? 'Information Technology · 2nd Year (Section A) Roster'
              : isHOD
              ? 'Information Technology Department Students'
              : 'Campus-wide student directory & AURA Ring hardware'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Enroll Student
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex flex-col md:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, register number, roll number, or Ring UID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            disabled={isFaculty || isHOD}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 disabled:opacity-60"
          >
            {!isFaculty && !isHOD && <option value="ALL">All Departments</option>}
            <option value="Information Technology">Information Technology</option>
            <option value="Computer Science & Eng">Computer Science & Eng</option>
            <option value="Electronics & Comm">Electronics & Comm</option>
            <option value="Mechanical Eng">Mechanical Eng</option>
          </select>

          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            disabled={isFaculty}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 disabled:opacity-60"
          >
            {!isFaculty && <option value="ALL">All Years</option>}
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>

          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            disabled={isFaculty}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 disabled:opacity-60"
          >
            {!isFaculty && <option value="ALL">All Sections</option>}
            <option value="Section A">Section A</option>
            <option value="Section B">Section B</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Students Data Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Register Number</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4">Section</th>
                <th className="py-3 px-4">AURA Ring</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No students match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-cyan-400">
                      {st.registerNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {st.fullName}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {st.department}
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono">
                      {st.year}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {st.section}
                    </td>
                    <td className="py-3 px-4">
                      {st.ringUid ? (
                        <span className="font-mono text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
                          {st.ringUid}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setAssignRingStudent(st);
                            setSelectedRingForAssignment(unassignedRings[0]?.ringUid || '');
                          }}
                          className="text-xs text-amber-400 hover:text-amber-300 font-medium"
                        >
                          + Assign Ring
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => toggleStudentStatus(st.id)}
                        title="Click to toggle status"
                      >
                        <StatusBadge status={st.status} />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingStudent(st)}
                          className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                          title="View student profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(st)}
                          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                          title="Edit student"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmStudent(st)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                          title="Delete student safely"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: View Student Details */}
      <Modal
        isOpen={!!viewingStudent}
        onClose={() => setViewingStudent(null)}
        title="Student Details"
        subtitle={viewingStudent?.registerNumber}
        maxWidth="md"
      >
        {viewingStudent && (
          <div className="space-y-4 text-xs">
            {/* Basic Info */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">Basic Details</span>
                <StatusBadge status={viewingStudent.status} />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-slate-500 block text-[11px]">Full Name</span>
                  <span className="font-semibold text-white text-sm">{viewingStudent.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Register Number</span>
                  <span className="font-mono text-cyan-300 font-medium">{viewingStudent.registerNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Email</span>
                  <span className="text-slate-300">{viewingStudent.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Phone</span>
                  <span className="text-slate-300">{viewingStudent.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Date of Birth</span>
                  <span className="text-slate-300">{viewingStudent.dateOfBirth}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Gender</span>
                  <span className="text-slate-300">{viewingStudent.gender}</span>
                </div>
              </div>
            </div>

            {/* Academic Info */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold block">Academic Placement</span>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-slate-500 block text-[11px]">Department</span>
                  <span className="text-slate-200 font-medium">{viewingStudent.department}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Year & Section</span>
                  <span className="text-slate-200 font-medium">{viewingStudent.year} · {viewingStudent.section}</span>
                </div>
              </div>
            </div>

            {/* AURA Ring Info */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold block">AURA Ring Hardware</span>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-slate-500 block text-[11px]">Ring UID</span>
                  <span className="font-mono text-cyan-300 font-bold">
                    {viewingStudent.ringUid || 'None Assigned'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Ring Status</span>
                  <span className="text-emerald-400 font-medium">
                    {viewingStudent.ringUid ? 'Active & Paired' : 'Unassigned'}
                  </span>
                </div>
              </div>
            </div>

            {/* Safety & Emergency Contact */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold block">Safety & Emergency</span>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-slate-500 block text-[11px]">Emergency Contact</span>
                  <span className="text-slate-200 font-medium">
                    {viewingStudent.emergencyContact.name} ({viewingStudent.emergencyContact.relation})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Emergency Phone</span>
                  <span className="font-mono text-cyan-400">{viewingStudent.emergencyContact.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingStudent(null)}
                className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Add Student */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Enroll New Student"
        subtitle="Create institutional profile and assign initial AURA Ring hardware"
        maxWidth="xl"
      >
        <form onSubmit={submitAdd} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Register Number</label>
              <input
                type="text"
                value={formData.registerNumber}
                onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Roll Number</label>
              <input
                type="text"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                placeholder="e.g. Meera Krishnan"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                placeholder="student@apextech.edu"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Information Technology">Information Technology</option>
                <option value="Computer Science & Eng">Computer Science & Eng</option>
                <option value="Electronics & Comm">Electronics & Comm</option>
                <option value="Mechanical Eng">Mechanical Eng</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Year</label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Section</label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Section A">Section A</option>
                <option value="Section B">Section B</option>
                <option value="Section C">Section C</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' | 'Other' })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">AURA Ring UID (Optional)</label>
              <select
                value={formData.ringUid}
                onChange={(e) => setFormData({ ...formData, ringUid: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value="">-- Pair Later --</option>
                {unassignedRings.map((r) => (
                  <option key={r.ringUid} value={r.ringUid}>
                    {r.ringUid} (Unassigned)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3 space-y-2">
            <span className="font-semibold text-slate-300 block">Emergency Contact</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Contact Name"
                value={formData.emergencyName}
                onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                required
              />
              <input
                type="text"
                placeholder="Relation (e.g. Mother)"
                value={formData.emergencyRelation}
                onChange={(e) => setFormData({ ...formData, emergencyRelation: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
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
              Enroll Student
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Student */}
      <Modal
        isOpen={!!editingStudent}
        onClose={() => setEditingStudent(null)}
        title="Edit Student Record"
        subtitle={editingStudent?.registerNumber}
        maxWidth="xl"
      >
        <form onSubmit={submitEdit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Information Technology">Information Technology</option>
                <option value="Computer Science & Eng">Computer Science & Eng</option>
                <option value="Electronics & Comm">Electronics & Comm</option>
                <option value="Mechanical Eng">Mechanical Eng</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Year</label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Section</label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Section A">Section A</option>
                <option value="Section B">Section B</option>
                <option value="Section C">Section C</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditingStudent(null)}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Delete Confirmation */}
      <Modal
        isOpen={!!deleteConfirmStudent}
        onClose={() => setDeleteConfirmStudent(null)}
        title="Confirm Safe Deletion"
        subtitle="Permanent removal of student academic record"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-300 leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-white">{deleteConfirmStudent?.fullName}</span> ({deleteConfirmStudent?.registerNumber})?
          </p>
          {deleteConfirmStudent?.ringUid && (
            <p className="p-2.5 bg-amber-950/40 border border-amber-800/50 rounded-lg text-amber-300">
              Note: The linked AURA Ring <span className="font-mono font-bold">{deleteConfirmStudent.ringUid}</span> will be unassigned and returned to the available inventory.
            </p>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeleteConfirmStudent(null)}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="px-4 py-2 font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors"
            >
              Delete Record
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal: Quick Assign Ring */}
      <Modal
        isOpen={!!assignRingStudent}
        onClose={() => setAssignRingStudent(null)}
        title="Pair AURA Ring to Student"
        subtitle={`Student: ${assignRingStudent?.fullName} (${assignRingStudent?.registerNumber})`}
        maxWidth="sm"
      >
        <form onSubmit={handleAssignRingSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-medium">Select Available AURA Ring</label>
            <select
              value={selectedRingForAssignment}
              onChange={(e) => setSelectedRingForAssignment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              required
            >
              {unassignedRings.length === 0 ? (
                <option value="">No unassigned rings available in inventory</option>
              ) : (
                unassignedRings.map((r) => (
                  <option key={r.ringUid} value={r.ringUid}>
                    {r.ringUid} · Battery {r.batteryLevel}% · {r.firmwareVersion}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setAssignRingStudent(null)}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedRingForAssignment}
              className="px-4 py-2 font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 rounded-lg transition-colors"
            >
              Confirm Pairing
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
