import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddEmployeePage from './pages/AddEmployeePage';
import EmployeeRecordsPage from './pages/EmployeeRecordsPage';

/**
 * App.jsx — Multi-page client-side router
 * - /         : Add New Employee Form Page
 * - /records  : Employee Records List Page
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AddEmployeePage />} />
        <Route path="/records" element={<EmployeeRecordsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
