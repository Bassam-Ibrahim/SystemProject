
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';

import Register from './pages/Register';
import Login from './pages/Login';
import Homepage from './pages/Homepage';

function HomePageRoute() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (token && user) {
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
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>

          {/* Home Page */}
          <Route path="/" element={<HomePageRoute />} />

          {/* Authentication */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Student */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route
              path="/student/dashboard"
              element={<Homepage />}
            />
          </Route>

          {/* Staff */}
          <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
            <Route
              path="/staff/dashboard"
              element={<Homepage />}
            />
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route
              path="/admin/dashboard"
              element={<Homepage />}
            />
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
