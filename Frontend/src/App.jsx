import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import { ItemsProvider } from './context/ItemsContext';

import Register from './pages/Register';
import Login from './pages/Login';
import Homepage from './pages/Homepage';
import Profile from './pages/Profile';
import ItemsPage from './pages/user/ItemsPage';
import ItemDetails from './pages/user/ItemDetails';
import UserDashboard from './pages/user/UserDashboard';
import CreateItem from './pages/user/CreateItem';
import EditItem from './pages/user/EditItem';
import CartPage from './pages/user/CartPage';
import ReviewsPage from './pages/user/ReviewsPage';

function HomePageRoute() {
  const token = localStorage.getItem('token');

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    user = null;
  }

  if (token && user) {
    if (user.accountType === 'student' || user.accountType === 'staff') {
      return <UserDashboard />;
    }

    return <Homepage />;
  }

  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold text-primary">
        Welcome to Campus Lost & Found
      </h1>
    </div>
  );
}

function App() {
  return (
    <ItemsProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>

            {/* Home Page */}
            <Route path="/" element={<HomePageRoute />} />

            {/* Authentication */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Profile - Student, Staff and Admin */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={['student', 'staff', 'admin']}
                />
              }
            >
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* User pages - Student and Staff */}
            <Route element={<ProtectedRoute allowedRoles={['student', 'staff']} />}>
              <Route path="/items" element={<ItemsPage />} />
              <Route path="/items/new" element={<CreateItem />} />
              <Route path="/items/:id" element={<ItemDetails />} />
              <Route path="/items/:id/edit" element={<EditItem />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
            </Route>

            {/* Student Dashboard */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route
                path="/student/dashboard"
                element={<UserDashboard />}
              />
            </Route>

            {/* Staff Dashboard */}
            <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
              <Route
                path="/staff/dashboard"
                element={<UserDashboard />}
              />
            </Route>

            {/* Admin Dashboard */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route
                path="/admin/dashboard"
                element={<Homepage />}
              />
            </Route>

          </Route>
        </Routes>
      </BrowserRouter>
    </ItemsProvider>
  );
}

export default App;