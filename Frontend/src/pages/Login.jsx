import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function Login() {
  const [formData, setFormData] = useState({
    role: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError('Login is not connected to the server yet.');
  };

  const inputWrap =
    'flex items-center border border-gray-300 rounded-xl bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#0f5a66]/40';
  const inputBase =
    'flex-1 min-w-0 bg-transparent px-3 py-3 outline-none text-gray-800 placeholder-gray-400';

  return (
    <div className="bg-[#0f5a66] flex justify-center">
      <div
        className="relative w-full max-w-[896px] min-h-screen md:min-h-0 md:aspect-[896/1200] flex items-center justify-center p-4 md:p-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/login-bg.jpg')" }}
      >
        {/* Login card */}
        <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl md:absolute md:left-[22.8%] md:top-[19%] md:w-[54.4%] md:max-w-none">
          <div className="text-center mb-5">
            <div className="text-4xl mb-1">🎓📍</div>
            <p className="text-xl font-bold text-[#0f4c5c] leading-tight">
              Campus
              <br />
              Lost &amp; Found
            </p>

            <h1 className="text-3xl font-bold text-[#0c3f4d] mt-4 mb-1">
              Welcome Back
            </h1>

            <p className="text-gray-600 text-sm">
              Sign in to report or recover campus items
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Account type */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Select Account Type
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="border border-gray-300 p-3 rounded-xl w-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0f5a66]/40"
              >
                <option value="">Select Account Type</option>
                <option value="student">Student</option>
                <option value="professor">Professor</option>
              </select>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                University Email
              </label>

              <div className={inputWrap}>
                <span className="pl-3 text-gray-500">✉️</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="University Email"
                  className={inputBase}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Password
              </label>

              <div className={inputWrap}>
                <span className="pl-3 text-gray-500">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={inputBase}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-4 py-3 bg-gray-100 text-sm font-medium text-gray-700 border-l border-gray-200 hover:bg-gray-200"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-danger text-sm mb-4">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full !rounded-full !py-3 !bg-[#0f4c5c] hover:!bg-[#0c3f4d]"
            >
              Login
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-5">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-[#0f4c5c] font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}