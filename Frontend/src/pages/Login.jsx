
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Login() {
  const [formData, setFormData] = useState({
    role: '',
    email: '',
    password: '',
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

    setError('Login is not connected to the server yet.');
  };

  return (
    <div className="flex justify-center items-center py-10 px-4">
      <div className="bg-surface w-full max-w-md p-8 rounded-2xl shadow-md border border-gray-100">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome
          </h1>

          <p className="text-textSub">
            Login to your Campus Lost & Found account
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="flex flex-col gap-1 mb-4 w-full">
            <label className="text-sm font-semibold text-textMain">
              Account Type
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="border border-gray-300 p-2.5 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
            >
            <option value="">Select Account Type</option>              <option value="student">Student</option>
              <option value="professor">Professor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

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

          {error && (
            <p className="text-danger text-sm mb-4">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full">
            Login
          </Button>

        </form>

        <p className="text-center text-sm text-textSub mt-6">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-primary font-semibold hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}
