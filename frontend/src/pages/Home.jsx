import { Navigate } from 'react-router-dom';

/**
 * Home component — Redirects to / (AddEmployeePage)
 */
export default function Home() {
  return <Navigate to="/" replace />;
}
