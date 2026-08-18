import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import {
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: 'patient',
    },
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const user = await registerUser(data);

      const redirectPath =
        user.role === 'patient'
          ? '/patient'
          : user.role === 'doctor'
          ? '/doctor'
          : '/admin';

      navigate(redirectPath, { replace: true });
    } catch (error) {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-xl border bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 ${
      errors[field]
        ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
        : 'border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100'
    }`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-4 py-10">

      {/* Background decorations */}
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-xl">

        {/* Brand */}
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/30">

            <svg
              className="h-9 w-9 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>

          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            E-Hospitality
          </h1>

          <p className="mt-2 text-sm text-slate-300">
            Your healthcare journey starts here
          </p>
        </div>

        {/* Glass container */}
        <div className="rounded-3xl border border-white/10 bg-white/10 p-1 shadow-2xl shadow-black/30 backdrop-blur-xl">

          <div className="rounded-[22px] bg-white p-6 sm:p-8">

            {/* Header */}
            <div className="mb-7">
              <div className="mb-2 flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  Create Account
                </h2>

                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
                  Free
                </span>
              </div>

              <p className="text-sm text-gray-500">
                Create your account to access E-Hospitality services.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >

              {/* First + Last Name */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                {/* First Name */}
                <div>
                  <label
                    htmlFor="first_name"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    First Name
                  </label>

                  <div className="relative">

                    <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      id="first_name"
                      type="text"
                      autoComplete="given-name"
                      {...register('first_name', {
                        required: 'First name is required',
                      })}
                      className={inputClass('first_name')}
                      placeholder="John"
                    />

                  </div>

                  {errors.first_name && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="last_name"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Last Name
                  </label>

                  <div className="relative">

                    <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      id="last_name"
                      type="text"
                      autoComplete="family-name"
                      {...register('last_name', {
                        required: 'Last name is required',
                      })}
                      className={inputClass('last_name')}
                      placeholder="Doe"
                    />

                  </div>

                  {errors.last_name && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.last_name.message}
                    </p>
                  )}
                </div>

              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email Address
                </label>

                <div className="relative">

                  <EnvelopeIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value:
                          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    className={inputClass('email')}
                    placeholder="john@example.com"
                  />

                </div>

                {errors.email && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Phone Number
                </label>

                <div className="relative">

                  <PhoneIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    {...register('phone', {
                      required: 'Phone number is required',
                      minLength: {
                        value: 10,
                        message: 'Enter a valid phone number',
                      },
                    })}
                    className={inputClass('phone')}
                    placeholder="+91 9876543210"
                  />

                </div>

                {errors.phone && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Account Type
                </label>

                <div className="relative">

                  <BriefcaseIcon className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <select
                    id="role"
                    {...register('role', {
                      required: 'Role is required',
                    })}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-10 text-sm font-medium text-gray-700 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="patient">
                      Patient
                    </option>
                    <option value="doctor">
                      Doctor
                    </option>
                  </select>

                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 9l6 6 6-6"
                      />
                    </svg>
                  </div>

                </div>

                {errors.role && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>

                <div className="relative">

                  <LockClosedIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message:
                          'Password must be at least 8 characters',
                      },
                    })}
                    className={`${inputClass('password')} pr-12`}
                    placeholder="••••••••"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>

                </div>

                {errors.password && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.password.message}
                  </p>
                )}

                <p className="mt-1.5 text-xs text-gray-400">
                  Use at least 8 characters.
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="password_confirm"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Confirm Password
                </label>

                <div className="relative">

                  <LockClosedIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    id="password_confirm"
                    type={
                      showConfirmPassword
                        ? 'text'
                        : 'password'
                    }
                    autoComplete="new-password"
                    {...register('password_confirm', {
                      required:
                        'Please confirm your password',
                      validate: (value) =>
                        value === password ||
                        'Passwords do not match',
                    })}
                    className={`${inputClass(
                      'password_confirm'
                    )} pr-12`}
                    placeholder="••••••••"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                    aria-label={
                      showConfirmPassword
                        ? 'Hide confirm password'
                        : 'Show confirm password'
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>

                </div>

                {errors.password_confirm && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.password_confirm.message}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3.5">

                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />

                <label
                  htmlFor="terms"
                  className="text-xs leading-5 text-gray-500"
                >
                  I agree to the{' '}
                  <button
                    type="button"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </button>
                  .
                </label>

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative mt-2 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">

                  {loading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </>
                  )}

                </span>
              </button>

            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />

              <span className="text-xs font-medium text-gray-400">
                ALREADY REGISTERED?
              </span>

              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Login */}
            <Link
              to="/login"
              className="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
            >
              Sign In Instead
            </Link>

          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} E-Hospitality. All rights reserved.
        </p>

      </div>
    </div>
  );
};

export default Register;