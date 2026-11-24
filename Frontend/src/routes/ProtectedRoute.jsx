
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.accountType)) {
    const dashboardRoutes = {
      student: '/student/dashboard',
      staff: '/staff/dashboard',
      admin: '/admin/dashboard',
    };

    return (
      <Navigate
        to={dashboardRoutes[user.accountType] || '/login'}
        replace
      />
    );
  }

  return <Outlet />;
}
