import { useState, useEffect, useCallback, useRef } from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { deleteEmployee } from '../services/api';

export default function ConfirmDeleteModal({ employee, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const cancelBtnRef = useRef(null);

  useEffect(() => { cancelBtnRef.current?.focus(); }, []);

  const handleKeyDown = useCallback((e) => { if (e.key === 'Escape') onClose(); }, [onClose]);
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteEmployee(employee._id);
      toast.success('Employee deleted successfully!');
      onDeleted();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to delete employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      role="dialog" aria-modal="true" aria-labelledby="delete-modal-title"
    >
      <div className="modal-enter bg-white w-full max-w-md border border-gray-300 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h3 id="delete-modal-title" className="text-sm font-bold text-gray-900">Confirm Delete</h3>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-sm text-gray-700 leading-relaxed">
            Are you sure you want to delete{' '}
            <span className="font-bold text-gray-900">{employee?.fullName}</span>
            {' '}({employee?.employeeId})?
          </p>
          <p className="text-xs text-gray-400 mt-1">This action cannot be undone.</p>

          {/* Mini info */}
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-black text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                {employee?.fullName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{employee?.fullName}</p>
                <p className="text-xs text-gray-500">{employee?.department || 'No Dept'} &middot; {employee?.email}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-5">
            <button
              ref={cancelBtnRef}
              onClick={onClose}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {loading ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
