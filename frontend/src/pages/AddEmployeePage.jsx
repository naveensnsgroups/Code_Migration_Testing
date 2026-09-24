import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PersonalDetailsForm from '../components/PersonalDetailsForm';

export default function AddEmployeePage() {
  const navigate = useNavigate();

  const handleEmployeeAdded = () => {
    // Navigate to employee records page after adding
    navigate('/records');
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Heading */}
        <div className="mb-8 pb-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Add Employee
            </h2>
            <p className="text-sm text-gray-500 mt-0.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Fill in the personal details form to register a new employee.
            </p>
          </div>
          <button
            onClick={() => navigate('/records')}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            View All Records &rarr;
          </button>
        </div>

        {/* Add Employee Form */}
        <PersonalDetailsForm onEmployeeAdded={handleEmployeeAdded} />
      </main>

      <footer className="text-center py-6 text-xs text-gray-400 border-t border-gray-200 mt-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
       HR Personal Details System &middot; SNS IHUB
      </footer>
    </div>
  );
}
