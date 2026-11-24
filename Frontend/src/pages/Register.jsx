import { useState } from 'react';
import { Link } from 'react-router-dom';

import AuthLayout, {
  TextField,
  PasswordField,
  RoleToggle,
  FormError,
  SubmitButton,
} from '../components/AuthLayout';

export default function Register() {
  const [formData, setFormData] = useState({
    role: '',
    fullName: '',
    email: '',
    nationalId: '',
    profession: '',
    college: '',
    department: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.role) {
      setError('Please select your account type.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Check both fields and try again.');
      return;
    }

    if (formData.role === 'student' && !/^\d{14}$/.test(formData.nationalId)) {
      setError('National ID must contain exactly 14 digits.');
      return;
    }

    setError('Registration is not connected to the server yet.');
  };

  return (
    <AuthLayout>
      <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-[#0c3f4d]">
        Create your account
      </h1>

      <p className="mt-1.5 text-[15px] text-slate-600">
        Sign up with your university email to get started.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 [@media(max-height:720px)]:mt-4 [@media(max-height:720px)]:space-y-3"
      >
        <RoleToggle value={formData.role} onChange={handleChange} />

        <TextField
          label="Full name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Your full name"
          autoComplete="name"
        />

        <TextField
          label="University email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={
            formData.role === 'student'
              ? 'name@std.cu.edu.eg'
              : 'name@cu.edu.eg'
          }
          autoComplete="email"
        />

        {formData.role === 'student' && (
          <TextField
            label="National ID"
            name="nationalId"
            value={formData.nationalId}
            onChange={handleChange}
            placeholder="Enter your 14-digit national ID"
            hint="Enter 14 digits."
          />
        )}

        {formData.role === 'staff' && (
          <TextField
            label="Profession"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            placeholder="e.g. Professor, Teaching Assistant"
          />
        )}

        <TextField
          label="College"
          name="college"
          value={formData.college}
          onChange={handleChange}
          placeholder="Enter your college"
        />

        <TextField
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          placeholder="Enter your department"
        />

        <TextField
          label="Mobile number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="01xxxxxxxxx"
          autoComplete="tel"
        />

        <PasswordField
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
          autoComplete="new-password"
        />

        <PasswordField
          label="Confirm password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your password"
          autoComplete="new-password"
        />

        <FormError>{error}</FormError>

        <SubmitButton>Create account</SubmitButton>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-[#0f4c5c] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f4c5c]/40"
        >
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}