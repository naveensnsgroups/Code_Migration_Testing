import { useState, useEffect, useCallback } from 'react';
import { X, Save, Loader2, Pencil, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateEmployee } from '../services/api';
import { validateWithZod } from '../utils/employeeSchema';

const DEPARTMENTS = ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales', 'Admin', 'Other'];
const GENDERS     = ['Male', 'Female', 'Other'];

const formatDateForInput = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toISOString().split('T')[0];
};

const inputCls = (hasError) =>
  `w-full border ${hasError ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'} px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black transition-colors font-sans`;

export default function EditModal({ employee, onClose, onUpdated }) {
  const [formData, setFormData] = useState({});
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState({});

  useEffect(() => {
    if (employee) {
      setFormData({
        fullName:    employee.fullName    || '',
        employeeId:  employee.employeeId  || '',
        email:       employee.email       || '',
        phone:       employee.phone       || '',
        dateOfBirth: formatDateForInput(employee.dateOfBirth),
        gender:      employee.gender      || '',
        address:     employee.address     || '',
        department:  employee.department  || '',
        position:    employee.position    || '',
        joinDate:    formatDateForInput(employee.joinDate),
      });
      setErrors({});
    }
  }, [employee]);

  const handleKeyDown = useCallback((e) => { if (e.key === 'Escape') onClose(); }, [onClose]);
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'fullName') {
      // Letters and single spaces only
      formattedValue = value.replace(/[^A-Za-z\s]/g, '').replace(/\s{2,}/g, ' ');
    } else if (name === 'employeeId') {
      // Auto-uppercase Employee ID, alphanumeric
      formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    } else if (name === 'phone') {
      // Digits only, max 10
      formattedValue = value.replace(/[^\d]/g, '').slice(0, 10);
    } else if (name === 'email') {
      // Lowercase, no spaces
      formattedValue = value.toLowerCase().replace(/\s/g, '');
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Zod Schema Validation
    const validation = validateWithZod(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      const sanitizedData = {
        ...formData,
        fullName:   validation.data.fullName.trim(),
        employeeId: validation.data.employeeId.trim(),
        email:      validation.data.email.trim().toLowerCase(),
        phone:      validation.data.phone.trim(),
        position:   validation.data.position ? validation.data.position.trim() : '',
        address:    validation.data.address  ? validation.data.address.trim()  : '',
      };
      await updateEmployee(employee._id, sanitizedData);
      toast.success('Employee updated successfully!');
      onUpdated();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to update employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      role="dialog" aria-modal="true" aria-labelledby="edit-modal-title"
    >
      <div className="modal-enter bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-300 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <Pencil className="w-4 h-4 text-gray-600" />
            <div>
              <h3 id="edit-modal-title" className="text-sm font-bold text-gray-900">Edit Employee</h3>
              <p className="text-xs text-gray-400">{employee?.fullName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">

            {/* Full Name */}
            <div>
              <label htmlFor="edit-fullName" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-fullName"
                type="text"
                name="fullName"
                value={formData.fullName || ''}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className={inputCls(!!errors.fullName)}
              />
              {errors.fullName && (
                <p role="alert" className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Employee ID */}
            <div>
              <label htmlFor="edit-employeeId" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Employee ID <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-employeeId"
                type="text"
                name="employeeId"
                value={formData.employeeId || ''}
                onChange={handleChange}
                placeholder="e.g. EMP001"
                className={inputCls(!!errors.employeeId)}
              />
              {errors.employeeId && (
                <p role="alert" className="text-red-500 text-xs mt-1">{errors.employeeId}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="edit-email" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-email"
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                placeholder="name@snsgroups.com"
                className={inputCls(!!errors.email)}
              />
              {errors.email && (
                <p role="alert" className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone Number with Country Flag Badge */}
            <div>
              <label htmlFor="edit-phone" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-0 top-0 bottom-0 px-3 bg-gray-100 border-r border-gray-300 flex items-center gap-1.5 text-xs font-semibold text-gray-600 select-none">
                  <span className="text-sm">🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  id="edit-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  placeholder="9876543210 (10 digits)"
                  maxLength={10}
                  className={`${inputCls(!!errors.phone)} pl-20`}
                />
              </div>
              {errors.phone && (
                <p role="alert" className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="edit-dateOfBirth" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Date of Birth
              </label>
              <input
                id="edit-dateOfBirth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth || ''}
                onChange={handleChange}
                className={inputCls(false)}
              />
            </div>

            {/* Position */}
            <div>
              <label htmlFor="edit-position" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Position / Job Title
              </label>
              <input
                id="edit-position"
                type="text"
                name="position"
                value={formData.position || ''}
                onChange={handleChange}
                placeholder="Software Engineer"
                className={inputCls(false)}
              />
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="edit-gender" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Gender</label>
              <div className="relative">
                <select id="edit-gender" name="gender" value={formData.gender || ''} onChange={handleChange}
                  className="w-full border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 appearance-none focus:outline-none focus:border-black pr-8 font-sans">
                  <option value="">Select gender</option>
                  {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Department */}
            <div>
              <label htmlFor="edit-department" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Department</label>
              <div className="relative">
                <select id="edit-department" name="department" value={formData.department || ''} onChange={handleChange}
                  className="w-full border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 appearance-none focus:outline-none focus:border-black pr-8 font-sans">
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Join Date */}
            <div>
              <label htmlFor="edit-joinDate" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Join Date
              </label>
              <input
                id="edit-joinDate"
                type="date"
                name="joinDate"
                value={formData.joinDate || ''}
                onChange={handleChange}
                className={inputCls(false)}
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label htmlFor="edit-address" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Address</label>
              <textarea id="edit-address" name="address" value={formData.address || ''} onChange={handleChange}
                rows={2} placeholder="Enter full address..."
                className="w-full border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black resize-none font-sans" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-semibold hover:bg-gray-900 transition-colors disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
