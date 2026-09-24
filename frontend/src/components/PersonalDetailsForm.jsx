import { useState } from 'react';
import { UserPlus, Loader2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { createEmployee } from '../services/api';
import { validateWithZod } from '../utils/employeeSchema';

const DEPARTMENTS = ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales', 'Admin', 'Other'];
const GENDERS     = ['Male', 'Female', 'Other'];

const initialState = {
  fullName: '', employeeId: '', email: '', phone: '',
  dateOfBirth: '', gender: '', address: '',
  department: '', position: '', joinDate: '',
};

const inputCls = (hasError) =>
  `w-full border ${hasError ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'} px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black transition-colors font-sans`;

export default function PersonalDetailsForm({ onEmployeeAdded }) {
  const [formData, setFormData] = useState(initialState);
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'fullName') {
      // 1. Only letters and single spaces (no numbers, symbols, or consecutive spaces)
      formattedValue = value.replace(/[^A-Za-z\s]/g, '').replace(/\s{2,}/g, ' ');
    } else if (name === 'employeeId') {
      // 2. Auto-uppercase Employee ID, alphanumeric only
      formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    } else if (name === 'phone') {
      // 3. Only digits allowed, strictly maximum 10 digits
      formattedValue = value.replace(/[^\d]/g, '').slice(0, 10);
    } else if (name === 'email') {
      // 4. Auto-lowercase email, remove spaces
      formattedValue = value.toLowerCase().replace(/\s/g, '');
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleReset = () => { setFormData(initialState); setErrors({}); };

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
      await createEmployee(sanitizedData);
      toast.success('Employee added successfully!');
      handleReset();
      onEmployeeAdded();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-gray-50">
        <UserPlus className="w-4 h-4 text-gray-600" />
        <div>
          <h2 className="text-sm font-bold text-gray-900">Add New Employee</h2>
          <p className="text-xs text-gray-400">Fields marked * are required</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. John Doe (letters only)"
              aria-invalid={!!errors.fullName}
              className={inputCls(!!errors.fullName)}
            />
            {errors.fullName && (
              <p role="alert" className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Employee ID */}
          <div>
            <label htmlFor="employeeId" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Employee ID <span className="text-red-500">*</span>
            </label>
            <input
              id="employeeId"
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="e.g. EMP001 (auto-caps)"
              aria-invalid={!!errors.employeeId}
              className={inputCls(!!errors.employeeId)}
            />
            {errors.employeeId && (
              <p role="alert" className="text-red-500 text-xs mt-1">{errors.employeeId}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@snsgroups.com"
              aria-invalid={!!errors.email}
              className={inputCls(!!errors.email)}
            />
            {errors.email && (
              <p role="alert" className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone Number with Country Flag Badge */}
          <div>
            <label htmlFor="phone" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-0 top-0 bottom-0 px-3 bg-gray-100 border-r border-gray-300 flex items-center gap-1.5 text-xs font-semibold text-gray-600 select-none">
                <span className="text-sm">🇮🇳</span>
                <span>+91</span>
              </div>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210 (10 digits only)"
                maxLength={10}
                aria-invalid={!!errors.phone}
                className={`${inputCls(!!errors.phone)} pl-20`}
              />
            </div>
            {errors.phone && (
              <p role="alert" className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dateOfBirth" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Date of Birth
            </label>
            <input
              id="dateOfBirth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={inputCls(false)}
            />
          </div>

          {/* Position */}
          <div>
            <label htmlFor="position" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Position / Job Title
            </label>
            <input
              id="position"
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="e.g. Software Engineer"
              className={inputCls(false)}
            />
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Gender</label>
            <div className="relative">
              <select
                id="gender" name="gender" value={formData.gender} onChange={handleChange}
                className="w-full border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 appearance-none focus:outline-none focus:border-black transition-colors pr-8 font-sans"
              >
                <option value="">Select gender</option>
                {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Department */}
          <div>
            <label htmlFor="department" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Department</label>
            <div className="relative">
              <select
                id="department" name="department" value={formData.department} onChange={handleChange}
                className="w-full border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 appearance-none focus:outline-none focus:border-black transition-colors pr-8 font-sans"
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Join Date */}
          <div>
            <label htmlFor="joinDate" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Join Date
            </label>
            <input
              id="joinDate"
              type="date"
              name="joinDate"
              value={formData.joinDate}
              onChange={handleChange}
              className={inputCls(false)}
            />
          </div>

          {/* Address */}
          <div className="sm:col-span-2 lg:col-span-3">
            <label htmlFor="address" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Address</label>
            <textarea
              id="address" name="address" value={formData.address} onChange={handleChange}
              placeholder="Enter full residential address..." rows={2}
              className="w-full border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black resize-none transition-colors font-sans"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end mt-5 pt-4 border-t border-gray-200 gap-3">
          <button
            type="button" onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button
            type="submit" disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-semibold hover:bg-gray-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            {loading ? 'Saving...' : 'Add Employee'}
          </button>
        </div>
      </form>
    </div>
  );
}
