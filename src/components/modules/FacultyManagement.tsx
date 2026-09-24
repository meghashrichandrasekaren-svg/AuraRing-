import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { Faculty } from '../../types';
import {
  GraduationCap,
  Plus,
  Search,
  Edit2,
  Mail,
  Phone,
  Building2,
  GitBranch,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export const FacultyManagement: React.FC = () => {
  const { facultyList, addFaculty, updateFaculty, toggleFacultyStatus } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [viewingFaculty, setViewingFaculty] = useState<Faculty | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    employeeId: `FAC-IT-0${10 + facultyList.length + 1}`,
    name: '',
    email: '',
    phone: '+91 9',
    department: 'Information Technology',
    designation: 'Assistant Professor',
    assignedSectionsInput: '2nd Year (Sec A)',
    qualification: 'Ph.D. in Information Technology',
  });

  const filteredFaculty = useMemo(() => {
    return facultyList.filter((f) => {
      const matchesSearch =
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = deptFilter === 'ALL' || f.department === deptFilter;
      return matchesSearch && matchesDept;
    });
  }, [facultyList, searchQuery, deptFilter]);

  const handleOpenAdd = () => {
    setFormData({
      employeeId: `FAC-IT-0${10 + facultyList.length + 1}`,
      name: '',
      email: '',
      phone: '+91 9',
      department: 'Information Technology',
      designation: 'Assistant Professor',
      assignedSectionsInput: '2nd Year (Sec A)',
      qualification: 'M.Tech, Ph.D.',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (f: Faculty) => {
    setEditingFaculty(f);
    setFormData({
      employeeId: f.employeeId,
      name: f.name,
      email: f.email,
      phone: f.phone,
      department: f.department,
      designation: f.designation,
      assignedSectionsInput: f.assignedSections.map((s) => `${s.year} (${s.section})`).join(', '),
      qualification: f.qualification || '',
    });
  };

  const parseSectionsInput = (input: string, dept: string) => {
    return input
      .split(',')
      .map((str) => {
        const trimmed = str.trim();
        return {
          department: dept,
          year: trimmed.includes('1st')
            ? '1st Year'
            : trimmed.includes('3rd')
            ? '3rd Year'
            : trimmed.includes('4th')
            ? '4th Year'
            : '2nd Year',
          section: trimmed.includes('B')
            ? 'Section B'
            : trimmed.includes('C')
            ? 'Section C'
            : 'Section A',
        };
      })
      .filter(Boolean);
  };

  const submitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const sections = parseSectionsInput(formData.assignedSectionsInput, formData.department);

    addFaculty({
      employeeId: formData.employeeId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      designation: formData.designation,
      assignedSections: sections,
      status: 'Active',
      qualification: formData.qualification,
      joinedDate: '2024-07-01',
    });
    setIsAddModalOpen(false);
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaculty) return;
    const sections = parseSectionsInput(formData.assignedSectionsInput, formData.department);

    updateFaculty(editingFaculty.id, {
      employeeId: formData.employeeId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      designation: formData.designation,
      assignedSections: sections,
      qualification: formData.qualification,
    });
    setEditingFaculty(null);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Faculty Directory & Academic Section Advising
            </h1>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              {facultyList.length} Faculty Members
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Assign academic section oversight, manage attendance taking rights, and audit teaching workloads.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-md shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          Add Faculty Member
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search faculty by name, employee ID, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">All Departments</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Computer Science & Eng">Computer Science & Eng</option>
          <option value="Electronics & Comm">Electronics & Comm</option>
          <option value="Mechanical Eng">Mechanical Eng</option>
        </select>
      </div>

      {/* Faculty Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Faculty Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4">Assigned Sections</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredFaculty.map((fac) => (
                <tr key={fac.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-cyan-400">
                    {fac.employeeId}
                  </td>
                  <td className="py-3 px-4 font-semibold text-white">
                    {fac.name}
                  </td>
                  <td className="py-3 px-4 text-slate-300">{fac.department}</td>
                  <td className="py-3 px-4 text-slate-300">{fac.designation}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {fac.assignedSections.map((sec, i) => (
                        <span
                          key={`${sec.department}-${sec.year}-${sec.section}-${i}`}
                          className="px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/50"
                        >
                          {sec.year} ({sec.section})
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => toggleFacultyStatus(fac.id)}
                      title="Click to toggle status"
                    >
                      <StatusBadge status={fac.status} />
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setViewingFaculty(fac)}
                        className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                        title="View faculty profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(fac)}
                        className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                        title="Edit faculty"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: View Faculty */}
      <Modal
        isOpen={!!viewingFaculty}
        onClose={() => setViewingFaculty(null)}
        title="Faculty Profile & Teaching Assignments"
        subtitle={viewingFaculty?.employeeId}
        maxWidth="md"
      >
        {viewingFaculty && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{viewingFaculty.name}</h3>
                <p className="text-cyan-400 font-medium">{viewingFaculty.designation}</p>
                <p className="text-slate-400 text-xs mt-1">{viewingFaculty.qualification}</p>
              </div>
              <StatusBadge status={viewingFaculty.status} />
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-500">Contact & Department</span>
              <p className="text-slate-300">Department: {viewingFaculty.department}</p>
              <p className="text-slate-300">Email: {viewingFaculty.email}</p>
              <p className="text-slate-300">Phone: {viewingFaculty.phone}</p>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-500">Assigned Sections & Period Rights</span>
              <div className="flex flex-wrap gap-1.5">
                {viewingFaculty.assignedSections.map((sec, i) => (
                  <span
                    key={`${sec.department}-${sec.year}-${sec.section}-${i}`}
                    className="px-2.5 py-1 text-xs font-mono text-cyan-300 bg-cyan-950/70 border border-cyan-800 rounded"
                  >
                    {sec.department} · {sec.year} ({sec.section})
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingFaculty(null)}
                className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700"
              >
                Close Profile
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Add Faculty */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Faculty Member"
        subtitle="Institutional teaching staff and section advisor assignment"
        maxWidth="lg"
      >
        <form onSubmit={submitAdd} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Employee ID</label>
              <input
                type="text"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                placeholder="e.g. Dr. Ramesh Gupta"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                placeholder="faculty@apextech.edu"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
              <label className="block text-slate-300 mb-1 font-medium">Designation</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                placeholder="e.g. Associate Professor"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">
              Assigned Sections (comma separated)
            </label>
            <input
              type="text"
              value={formData.assignedSectionsInput}
              onChange={(e) => setFormData({ ...formData, assignedSectionsInput: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              placeholder="e.g. 2nd Year (Sec A), 3rd Year (Sec B)"
              required
            />
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
              Add Faculty
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Faculty */}
      <Modal
        isOpen={!!editingFaculty}
        onClose={() => setEditingFaculty(null)}
        title="Edit Faculty Record"
        subtitle={editingFaculty?.employeeId}
        maxWidth="lg"
      >
        <form onSubmit={submitEdit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

          <div className="grid grid-cols-2 gap-3">
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
              <label className="block text-slate-300 mb-1 font-medium">Designation</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">
              Assigned Sections (comma separated)
            </label>
            <input
              type="text"
              value={formData.assignedSectionsInput}
              onChange={(e) => setFormData({ ...formData, assignedSectionsInput: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditingFaculty(null)}
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
    </div>
  );
};
