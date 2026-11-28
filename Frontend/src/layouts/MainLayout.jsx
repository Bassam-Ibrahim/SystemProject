import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../components/AuthLayout';
import ThemeToggle from '../components/ThemeToggle';
import { useItems } from '../context/ItemsContext';
import { initTheme } from '../utils/theme';
import '../darkMode.css';

initTheme();

const FONT =
  "'Public Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

const desktopLink = ({ isActive }) =>
  `relative flex h-full items-center gap-1.5 text-[15px] font-medium transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 ${
    isActive
      ? 'text-[#0f4c5c] after:bg-[#0f4c5c]'
      : 'text-slate-600 after:bg-transparent hover:text-[#0f4c5c]'
  }`;

const mobileLink = ({ isActive }) =>
  `flex items-center justify-between rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors ${
    isActive ? 'bg-slate-100 text-[#0f4c5c]' : 'text-slate-700 hover:bg-slate-50'
  }`;

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f4c5c]/40';

const DASHBOARD_PATHS = {
  student: '/student/dashboard',
  staff: '/staff/dashboard',
};

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

function Badge({ count }) {
  if (!count) return null;
  return (
    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e8a23a] px-1.5 text-xs font-semibold text-[#2b1d03]">
      {count}
    </span>
  );
}

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedIds } = useItems();
  const token = localStorage.getItem('token');
  const user = getUser();
  const dashboardPath = DASHBOARD_PATHS[user?.accountType];
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: FONT }}>
      <nav
        data-app-navbar
        className="sticky top-0 z-50 border-b border-slate-200 bg-white"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className={`rounded-lg ${focusRing}`} aria-label="Campus Lost & Found, home">
            <Logo />
          </Link>

          {/* Desktop */}
          <div className="hidden h-full items-center gap-5 md:flex">
            <NavLink to="/" end className={desktopLink}>
              Home
            </NavLink>

            {token ? (
              <>
                {dashboardPath && (
                  <>
                    <NavLink to={dashboardPath} className={desktopLink}>
                      Dashboard
                    </NavLink>
                    <NavLink to="/items" end className={desktopLink}>
                      Items
                    </NavLink>
                    <NavLink to="/cart" className={desktopLink}>
                      Selected
                      <Badge count={selectedIds.length} />
                    </NavLink>
                    <NavLink to="/reviews" className={desktopLink}>
                      Reviews
                    </NavLink>
                  </>
                )}
                <NavLink to="/profile" className={desktopLink}>
                  Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className={`rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700 ${focusRing}`}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={desktopLink}>
                  Log in
                </NavLink>
                <Link
                  to="/register"
                  className={`rounded-lg bg-[#0f4c5c] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0c3f4d] ${focusRing}`}
                >
                  Register
                </Link>
              </>
            )}

            <ThemeToggle />
          </div>

          {/* Mobile: theme toggle + menu toggle */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 ${focusRing}`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                {menuOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div id="mobile-menu" className="border-t border-slate-200 px-4 py-3 md:hidden">
            <NavLink to="/" end className={mobileLink}>
              Home
            </NavLink>

            {token ? (
              <>
                {dashboardPath && (
                  <>
                    <NavLink to={dashboardPath} className={mobileLink}>
                      Dashboard
                    </NavLink>
                    <NavLink to="/items" end className={mobileLink}>
                      Items
                    </NavLink>
                    <NavLink to="/cart" className={mobileLink}>
                      Selected
                      <Badge count={selectedIds.length} />
                    </NavLink>
                    <NavLink to="/reviews" className={mobileLink}>
                      Reviews
                    </NavLink>
                  </>
                )}
                <NavLink to="/profile" className={mobileLink}>
                  Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="mt-1 block w-full rounded-lg px-3 py-2.5 text-left text-[15px] font-medium text-red-700 hover:bg-red-50"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={mobileLink}>
                  Log in
                </NavLink>
                <Link
                  to="/register"
                  className="mt-2 block rounded-lg bg-[#0f4c5c] px-3 py-2.5 text-center text-[15px] font-semibold text-white hover:bg-[#0c3f4d]"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}