import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function MainLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-extrabold text-primary tracking-tight">
            Campus Lost & Found
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-textMain hover:text-primary transition-colors font-medium">Home</Link>
            {token ? (
              <>
                <Link to="/profile" className="text-textMain hover:text-primary transition-colors font-medium">Profile</Link>
                <button onClick={handleLogout} className="text-danger font-medium hover:underline">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-textMain hover:text-primary transition-colors font-medium">Login</Link>
                <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}