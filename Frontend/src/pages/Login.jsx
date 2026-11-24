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

  const handleSubmit = (e) => {
    e.preventDefault();

    setError('Login is not connected to the server yet.');
  };

  return (
    <AuthLayout>
      <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-[#0c3f4d]">
        Log in
      </h1>
      <p className="mt-1.5 text-[15px] text-slate-600">
        Use your university account to report or recover items.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 [@media(max-height:720px)]:mt-4 [@media(max-height:720px)]:space-y-3">
        <RoleToggle value={formData.role} onChange={handleChange} />

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