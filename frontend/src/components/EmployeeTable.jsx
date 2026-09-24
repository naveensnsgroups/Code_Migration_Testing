import { Pencil, Trash2, Users, Loader2 } from 'lucide-react';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function EmployeeTable({ employees, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 p-20 flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        <p className="text-sm text-gray-400">Loading records...</p>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="bg-white border border-gray-200 p-20 flex flex-col items-center gap-4">
        <Users className="w-10 h-10 text-gray-300" />
        <div className="text-center">
          <p className="text-gray-700 font-semibold">No employees yet</p>
          <p className="text-gray-400 text-sm">Add your first employee using the form above</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200">
      {/* Table Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-bold text-gray-900">Employee Records</span>
          <span className="text-xs text-gray-400 ml-1">
            ({employees.length} record{employees.length !== 1 ? 's' : ''})
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full" aria-label="Employee records table">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['#','Employee','Emp ID','Email','Phone','Department','Position','Gender','Join Date','Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {employees.map((emp, index) => (
              <tr key={emp._id} className="hover:bg-gray-50 transition-colors">
                {/* Index */}
                <td className="px-4 py-3.5 text-sm text-gray-400">{index + 1}</td>

                {/* Name */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-black text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {emp.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">{emp.fullName}</span>
                  </div>
                </td>

                {/* Emp ID */}
                <td className="px-4 py-3.5">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-mono font-semibold border border-gray-200">
                    {emp.employeeId}
                  </span>
                </td>

                {/* Email */}
                <td className="px-4 py-3.5 text-sm text-gray-500">{emp.email}</td>

                {/* Phone */}
                <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{emp.phone}</td>

                {/* Department */}
                <td className="px-4 py-3.5">
                  {emp.department
                    ? <span className="px-2 py-1 bg-black text-white text-xs font-semibold">{emp.department}</span>
                    : <span className="text-gray-300">—</span>}
                </td>

                {/* Position */}
                <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">
                  {emp.position || <span className="text-gray-300">—</span>}
                </td>

                {/* Gender */}
                <td className="px-4 py-3.5 text-sm text-gray-600">
                  {emp.gender || <span className="text-gray-300">—</span>}
                </td>

                {/* Join Date */}
                <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">{formatDate(emp.joinDate)}</td>

                {/* Actions */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(emp)}
                      aria-label={`Edit ${emp.fullName}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors"
                    >
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(emp)}
                      aria-label={`Delete ${emp.fullName}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
