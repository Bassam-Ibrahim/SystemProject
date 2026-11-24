
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/users';
const SERVER_URL = 'http://localhost:5000';

const getSavedUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(getSavedUser);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    college: '',
    department: '',
    phone: '',
    profession: '',
  });

  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to load profile');
        }

        const profile = result.user;

        setUser(profile);

        setFormData({
          fullName: profile.fullName || '',
          college: profile.college || '',
          department: profile.department || '',
          phone: profile.phone || '',
          profession: profile.profession || '',
        });

        setImage(
          profile.profileImage
            ? `${SERVER_URL}${profile.profileImage}`
            : ''
        );

        // Keep local user information synchronized
        const savedUser = getSavedUser() || {};
        localStorage.setItem(
          'user',
          JSON.stringify({ ...savedUser, ...profile })
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const isStudent = user?.accountType === 'student';
  const isStaff = user?.accountType === 'staff';
  const isAdmin = user?.accountType === 'admin';

  const accountLabel = {
    student: 'Student',
    staff: 'University Staff',
    admin: 'System Administrator',
  }[user?.accountType] || 'User';

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess('');
    setError('');
  };

  // Upload image to backend
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please select a JPG, PNG, or WEBP image.');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must not exceed 5 MB.');
      e.target.value = '';
      return;
    }

    const token = localStorage.getItem('token');
    const imageData = new FormData();

    imageData.append('profileImage', file);

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/profile/image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: imageData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Image upload failed');
      }

      const imagePath = result.profileImage;
      const imageUrl = `${SERVER_URL}${imagePath}`;

      setImage(imageUrl);

      const updatedUser = {
        ...user,
        profileImage: imagePath,
      };

      setUser(updatedUser);

      const savedUser = getSavedUser() || {};
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...savedUser,
          profileImage: imagePath,
        })
      );

      setSuccess('Profile picture uploaded successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Save profile information to MongoDB
  const handleSave = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update profile');
      }

      const updatedUser = {
        ...user,
        ...result.user,
      };

      setUser(updatedUser);

      const savedUser = getSavedUser() || {};

      localStorage.setItem(
        'user',
        JSON.stringify({
          ...savedUser,
          ...result.user,
        })
      );

      setSuccess('Your profile has been updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Cancel unsaved changes
  const handleCancel = () => {
    setFormData({
      fullName: user.fullName || '',
      college: user.college || '',
      department: user.department || '',
      phone: user.phone || '',
      profession: user.profession || '',
    });

    setImage(
      user.profileImage
        ? `${SERVER_URL}${user.profileImage}`
        : ''
    );

    setError('');
    setSuccess('');
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#0f4c5c] focus:ring-2 focus:ring-[#0f4c5c]/10';

  const labelClass =
    'mb-2 block text-sm font-semibold text-slate-700';

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[#0c3f4d]">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-[#0c3f4d]">
          {error || 'Please log in to view your profile'}
        </h2>

        <button
          onClick={() => navigate('/login')}
          className="rounded-lg bg-[#0f4c5c] px-6 py-3 font-semibold text-white"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl py-6">

      {/* Page Header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0f7182]">
          Account Settings
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#0c3f4d]">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage your personal information and profile settings.
        </p>
      </div>

      {/* Profile Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Cover */}
        <div className="relative h-40 overflow-hidden bg-gradient-to-r from-[#0c3f4d] via-[#0f7182] to-[#56a5a8]">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10" />
          <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-white/5" />
        </div>

        <div className="px-6 pb-8 sm:px-10">

          {/* Avatar Section */}
          <div className="-mt-16 flex flex-col gap-5 sm:flex-row sm:items-end">

            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-[#e8f1f2] shadow-md">
              {image ? (
                <img
                  src={image}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-[#0f4c5c]">
                  {formData.fullName.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>

            <div className="flex-1 pb-1">
              <h2 className="text-2xl font-bold text-[#0c3f4d]">
                {formData.fullName || 'Your Name'}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {user.email}
              </p>

              <span className="mt-3 inline-flex rounded-full bg-[#e8f1f2] px-4 py-1 text-xs font-bold text-[#0f4c5c]">
                {accountLabel}
              </span>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="mb-1 rounded-xl border border-[#0f4c5c] px-5 py-2.5 text-sm font-semibold text-[#0f4c5c] transition hover:bg-[#0f4c5c] hover:text-white disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Change Photo'}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="mt-10">

            <div className="mb-6 border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-[#0c3f4d]">
                Personal Information
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Your personal and account information.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">

              {/* Full Name */}
              <div>
                <label className={labelClass}>
                  Full Name
                </label>

                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>
                  University Email
                </label>

                <input
                  value={user.email || ''}
                  disabled
                  className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-400`}
                />
              </div>

              {/* Student Fields */}
              {isStudent && (
                <>
                  <div>
                    <label className={labelClass}>
                      National ID
                    </label>

                    <input
                      value={user.nationalId || 'Not available'}
                      disabled
                      className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-400`}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      College
                    </label>

                    <input
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Enter your college"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Department
                    </label>

                    <input
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Enter your department"
                    />
                  </div>
                </>
              )}

              {/* Staff Fields */}
              {isStaff && (
                <>
                  <div>
                    <label className={labelClass}>
                      Profession
                    </label>

                    <input
                      name="profession"
                      value={formData.profession}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Enter your profession"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      College
                    </label>

                    <input
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Enter your college"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Department
                    </label>

                    <input
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Enter your department"
                    />
                  </div>
                </>
              )}

              {/* Shared Student / Staff Field */}
              {(isStudent || isStaff) && (
                <div>
                  <label className={labelClass}>
                    Phone Number
                  </label>

                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter your phone number"
                  />
                </div>
              )}

              {/* Admin Fields */}
              {isAdmin && (
                <>
                  <div>
                    <label className={labelClass}>
                      Account Type
                    </label>

                    <input
                      value="System Administrator"
                      disabled
                      className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-400`}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Account Status
                    </label>

                    <input
                      value={user.status || 'Approved'}
                      disabled
                      className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-400`}
                    />
                  </div>
                </>
              )}

            </div>

            {/* Admin Security Section */}
            {isAdmin && (
              <div className="mt-10 rounded-xl border border-[#0f4c5c]/10 bg-[#f4f8f8] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0f4c5c] text-white">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-6 w-6"
                    >
                      <path d="M12 3l8 4v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V7l8-4z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#0c3f4d]">
                      Account Security
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Your administrator account is protected.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Feedback */}
            {error && (
              <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-6">

              <button
                type="button"
                onClick={handleCancel}
                disabled={saving || uploading}
                className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving || uploading}
                className="rounded-xl bg-[#0f4c5c] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0c3f4d] disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>

            </div>
          </form>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        Profile changes are saved to your account.
      </p>

    </div>
  );
}
