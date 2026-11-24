import { useEffect, useLayoutEffect, useState } from 'react';

const FONT =
  "'Public Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

export function Logo({ light = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          light ? 'bg-white text-[#0f4c5c]' : 'bg-[#0f4c5c] text-white'
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0C18.5 15.4 12 21 12 21Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="10" r="2.5" fill="currentColor" />
        </svg>
      </span>
      <span
        className={`text-[15px] font-semibold leading-tight ${
          light ? 'text-white' : 'text-[#0c3f4d]'
        }`}
      >
        Campus Lost &amp; Found
      </span>
    </div>
  );
}

export default function AuthLayout({ children }) {
  const [top, setTop] = useState(0);

  useLayoutEffect(() => {
    const nav = document.querySelector('[data-app-navbar], header, nav');
    if (!nav) return undefined;

    const measure = () => setTop(Math.max(0, Math.round(nav.getBoundingClientRect().bottom)));
    window.scrollTo(0, 0);
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(nav);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  useEffect(() => {
    const body = document.body.style.overflow;
    const html = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = body;
      document.documentElement.style.overflow = html;
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex flex-col bg-white text-[#12262c] lg:grid lg:grid-cols-2"
      style={{ fontFamily: FONT, top }}
    >
      <aside className="hidden flex-col justify-between bg-[#0f4c5c] p-12 text-white lg:flex">
        <Logo light />

        <div className="max-w-lg">
          <h2 className="text-5xl font-semibold leading-[1.15] tracking-tight [@media(max-height:700px)]:text-4xl">
            Find what you lost.
            <br />
            Return what you found.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/75">
            Report a missing item or check what has been handed in around campus.
          </p>
        </div>

        <p className="text-sm text-white/60">
          For students and professors with a university email.
        </p>
      </aside>

      <main className="flex flex-1 overflow-y-auto px-6 py-6 sm:px-12">
        <div className="m-auto w-full max-w-lg">
          <div className="mb-6 lg:hidden">
            <Logo />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

const inputClass =
  'block h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-base text-[#12262c] placeholder:text-slate-400 outline-none transition-colors focus:border-[#0f4c5c] focus:ring-2 focus:ring-[#0f4c5c]/25';

export function TextField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  hint,
  required = true,
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-[15px] font-medium text-slate-800">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className={inputClass}
      />
      {hint && <p className="mt-1.5 text-[13px] text-slate-500">{hint}</p>}
    </div>
  );
}

export function PasswordField({
  label,
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
  hint,
}) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-[15px] font-medium text-slate-800">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className={`${inputClass} pr-12`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          aria-pressed={show}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-lg text-slate-500 hover:text-[#0f4c5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f4c5c]/40"
        >
          {show ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 3l18 18M10.6 6.1A9.8 9.8 0 0 1 12 6c5 0 8.5 4 9.5 6-.4.8-1.2 2-2.4 3.1M6.6 6.7C4.4 8.1 3 10.3 2.5 12c1 2 4.5 6 9.5 6 1.5 0 2.8-.4 4-.9M9.9 9.9a3 3 0 0 0 4.2 4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M2.5 12C3.5 10 7 6 12 6s8.5 4 9.5 6c-1 2-4.5 6-9.5 6s-8.5-4-9.5-6Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
            </svg>
          )}
        </button>
      </div>
      {hint && <p className="mt-1.5 text-[13px] text-slate-500">{hint}</p>}
    </div>
  );
}

export function RoleToggle({ value, onChange }) {
  const options = [
    { value: 'student', label: 'Student' },
    { value: 'professor', label: 'Professor' },
  ];

  return (
    <fieldset>
      <legend className="mb-1.5 text-[15px] font-medium text-slate-800">Account type</legend>
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
        {options.map((o) => (
          <label key={o.value} className="relative block">
            <input
              type="radio"
              name="role"
              value={o.value}
              checked={value === o.value}
              onChange={onChange}
              required
              className="peer sr-only"
            />
            <span className="block cursor-pointer rounded-md py-2.5 text-center text-[15px] font-medium text-slate-600 transition-colors peer-checked:bg-white peer-checked:text-[#0f4c5c] peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-[#0f4c5c]/40">
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function FormError({ children }) {
  if (!children) return null;
  return (
    <p
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800"
    >
      {children}
    </p>
  );
}

export function SubmitButton({ children }) {
  return (
    <button
      type="submit"
      className="h-12 w-full rounded-lg bg-[#0f4c5c] text-base font-semibold text-white transition-colors hover:bg-[#0c3f4d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f4c5c] focus-visible:ring-offset-2"
    >
      {children}
    </button>
  );
}