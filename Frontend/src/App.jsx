import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// الصفحات دي الشخص 3 و 5 هما اللي هيعملوها، إحنا بس بنجهز مكانها
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Profile from './pages/Profile';
// import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          
          {/* Public Routes */}
          <Route path="/" element={<div className="text-center py-20"><h1 className="text-3xl font-bold text-primary">Welcome to Campus Lost & Found</h1></div>} />
          
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/register" element={<Register />} /> */}

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            {/* <Route path="/profile" element={<Profile />} /> */}
          </Route>
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;