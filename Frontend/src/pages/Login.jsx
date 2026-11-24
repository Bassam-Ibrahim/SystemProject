import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout, {
  TextField,
  PasswordField,
  RoleToggle,
  FormError,
  SubmitButton,
} from '../components/AuthLayout';

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

 
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const response = await fetch(
      'http://localhost:5000/api/auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          accountType: formData.role,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || 'Login failed');
      return;
    }

    // Save authentication token
    localStorage.setItem('token', data.token);

    // Save user information
    localStorage.setItem('user', JSON.stringify(data.user));

    alert('Login successful!');

    // Navigation can be added here after agreeing on the dashboard route.

  } catch (error) {
    setError('Cannot connect to server. Please try again.');
  }
};


  return (
    <AuthLayout>
      <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-[#0c3f4d]">
        Log in
      </h1>
      <p className="mt-1.5 text-[15px] text-slate-600">
        Use your university account to report or recover items.
      </p>

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
              <option value="staff">Staff</option>
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

        <PasswordField
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          autoComplete="current-password"
        />

        <FormError>{error}</FormError>

        <SubmitButton>Log in</SubmitButton>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        New here?{' '}
        <Link
          to="/register"
          className="font-semibold text-[#0f4c5c] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f4c5c]/40"
        >
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}