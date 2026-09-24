import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Users, Briefcase, Code2, LayoutGrid, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

import Navbar from '../components/Navbar';
import EmployeeTable from '../components/EmployeeTable';
import EditModal from '../components/EditModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { getAllEmployees } from '../services/api';

export default function EmployeeRecordsPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllEmployees();
      setEmployees(res.data.data);
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to fetch employee records';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const stats = [
    { label: 'Total Employees', value: employees.length, icon: Users },
    { label: 'IT Department', value: employees.filter((e) => e.department === 'IT').length, icon: Code2 },
    { label: 'HR Department', value: employees.filter((e) => e.department === 'HR').length, icon: Briefcase },
    { label: 'Other Depts', value: employees.filter((e) => !['IT', 'HR'].includes(e.department)).length, icon: LayoutGrid },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page heading & actions */}
        <div className="mb-8 pb-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Employee Records
            </h2>
            <p className="text-sm text-gray-500 mt-0.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
              View, edit, or delete registered employee personal details.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchEmployees}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-semibold hover:bg-gray-900 transition-colors"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <UserPlus className="w-3.5 h-3.5" />
              + Add New
            </button>
          </div>
        </div>

        {/* Clean Stat Cards — No harsh black border box lines */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-gray-50 border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-xs font-bold text-gray-900 uppercase tracking-wider"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {stat.label}
                  </span>
                  <Icon className="w-4 h-4 text-gray-600" />
                </div>
                <p
                  className="text-3xl font-extrabold text-gray-900"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Records Table */}
        <EmployeeTable
          employees={employees}
          loading={loading}
          onEdit={(emp) => setEmployeeToEdit(emp)}
          onDelete={(emp) => setEmployeeToDelete(emp)}
        />
      </main>

      <footer className="text-center py-6 text-xs text-gray-400 border-t border-gray-200 mt-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
        HR Personal Details System &middot; SNS IHUB
      </footer>

      {/* Modals */}
      {employeeToEdit && (
        <EditModal
          employee={employeeToEdit}
          onClose={() => setEmployeeToEdit(null)}
          onUpdated={fetchEmployees}
        />
      )}
      {employeeToDelete && (
        <ConfirmDeleteModal
          employee={employeeToDelete}
          onClose={() => setEmployeeToDelete(null)}
          onDeleted={fetchEmployees}
        />
      )}
    </div>
  );
}
