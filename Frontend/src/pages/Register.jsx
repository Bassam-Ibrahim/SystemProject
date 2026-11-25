
import { useState } from 'react';
import { Link } from 'react-router-dom';

import AuthLayout, {
  TextField,
  PasswordField,
  RoleToggle,
  FormError,
  SubmitButton,
} from '../components/AuthLayout';

const API_URL = 'http://localhost:5000/api/auth';

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
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

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

    if (formData.role === 'student' && !formData.email.toLowerCase().endsWith('@std.cu.edu.eg')) {
      setError('Students must use their university student email.');
      return;
    }

    if (formData.role === 'staff' && !formData.email.toLowerCase().endsWith('@cu.edu.eg')) {
      setError('Staff members must use their university email.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const registrationData = {
  fullName: formData.fullName.trim(),
  email: formData.email.trim().toLowerCase(),
  password: formData.password,
  confirmPassword: formData.confirmPassword,
  accountType: formData.role,
  college: formData.college.trim(),
  department: formData.department.trim(),
  phone: formData.phone.trim(),
};

      if (formData.role === 'student') {
        registrationData.nationalId = formData.nationalId.trim();
      }

      if (formData.role === 'staff') {
        registrationData.profession = formData.profession.trim();
      }

      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed.');
      }

      setSuccess(
        result.message || 'Your account has been created successfully. Please wait for account approval.'
      );

      setFormData({
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

    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Cannot connect to the server. Please make sure the backend is running.'
          : err.message
      );
    } finally {
      setIsSubmitting(false);
    }
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

        {success && (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <SubmitButton>
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </SubmitButton>
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
