
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthLayout, {
  TextField,
  PasswordField,
  FormError,
  SubmitButton,
} from '../components/AuthLayout';

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);

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
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed. Please try again.');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      const dashboardRoutes = {
        student: '/student/dashboard',
        staff: '/staff/dashboard',
        admin: '/admin/dashboard',
      };

      const dashboard = dashboardRoutes[data.user.accountType];

      if (!dashboard) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setError('Unknown account type.');
        return;
      }

      navigate(dashboard, { replace: true });

    } catch (err) {
      console.error('Login error:', err);

      setError(
        'Cannot connect to the server. Make sure the backend is running.'
      );
    } finally {
      setLoading(false);
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

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 [@media(max-height:720px)]:mt-4 [@media(max-height:720px)]:space-y-3"
      >
        <TextField
          label="University email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="name@university.edu"
          autoComplete="email"
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

        <SubmitButton>
          {loading ? 'Logging in...' : 'Log in'}
        </SubmitButton>
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
