
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>

          <Route
            path="/"
            element={
              <div className="text-center py-20">
                <h1 className="text-3xl font-bold text-primary">
                  Welcome to Campus Lost & Found
                </h1>
              </div>
            }
          />

          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
