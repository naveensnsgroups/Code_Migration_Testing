import { NavLink } from 'react-router-dom';
import { Building2, UserPlus, Users } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-black flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              HR Management System
            </h1>
            <p className="text-xs text-gray-400" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Personal Details Portal
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 text-xs font-semibold border transition-colors ${
                isActive
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`
            }
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add Employee
          </NavLink>

          <NavLink
            to="/records"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 text-xs font-semibold border transition-colors ${
                isActive
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`
            }
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            <Users className="w-3.5 h-3.5" />
            Employee Records
          </NavLink>
        </nav>

      </div>
    </header>
  );
}
