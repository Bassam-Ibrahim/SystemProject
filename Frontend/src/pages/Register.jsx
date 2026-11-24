
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

 
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  if (formData.password !== formData.confirmPassword) {
    setError('Passwords do not match');
    return;
  }

  try {
    const response = await fetch(
      'http://localhost:5000/api/auth/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          accountType: formData.role,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || 'Registration failed');
      return;
    }

    alert('Account created successfully!');

  } catch (error) {
    setError('Cannot connect to server');
  }
};


  return (
    <div className="flex justify-center items-center py-10 px-4">
      <div className="bg-surface w-full max-w-md p-8 rounded-2xl shadow-md border border-gray-100">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Create Account
          </h1>
          <p className="text-textSub">
            Join Campus Lost & Found
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

          <Button type="submit" className="w-full">
            Create Account
          </Button>

        </form>

        <p className="text-center text-sm text-textSub mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-primary font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
