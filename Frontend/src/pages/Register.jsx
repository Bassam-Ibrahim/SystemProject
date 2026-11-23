import { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Register() {
  const [formData, setFormData] = useState({
    role: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('Registration is not connected to the server yet.');
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center py-10 px-4 overflow-hidden bg-gradient-to-br from-[#0c3f4d] via-[#0f5a66] to-[#177480]">
      {/* Decorative background shapes */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -top-10 -left-10 w-56 h-56 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 w-[28rem] h-[28rem] rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -bottom-20 left-[30%] w-72 h-72 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white/5" />

      {/* Register card */}
      <div className="relative bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl">

        <div className="text-center mb-6">
          <div className="text-4xl mb-1">🎓📍</div>
          <p className="text-lg font-bold text-[#0f4c5c] leading-tight">
            Campus Lost &amp; Found
          </p>

          <h1 className="text-3xl font-bold text-[#0c3f4d] mt-4 mb-1">
            Create Account
          </h1>
          <p className="text-gray-600 text-sm">
            Join Campus Lost &amp; Found
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="flex flex-col gap-1 mb-4 w-full">
            <label className="text-sm font-semibold text-gray-800">
              Account Type
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

          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
          />

          <Input
            label="University Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your university email"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
          />

          {error && (
            <p className="text-danger text-sm mb-4">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full !rounded-full !py-3 !bg-[#0f4c5c] hover:!bg-[#0c3f4d]"
          >
            Create Account
          </Button>

        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-[#0f4c5c] font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}