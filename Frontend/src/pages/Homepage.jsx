
import { Link } from 'react-router-dom';

export default function Homepage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f4f8f8] flex items-center justify-center px-6 py-12">

      {/* Background Decorations */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#0f4c5c]/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#0f4c5c]/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-3xl text-center">

        {/* Logo */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#0f4c5c] shadow-xl shadow-[#0f4c5c]/20 rotate-[-6deg]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.6"
            className="h-10 w-10"
          >
            <path d="M20 7h-9" />
            <path d="M14 3l-4 4 4 4" />
            <path d="M4 17h9" />
            <path d="M10 13l4 4-4 4" />
          </svg>
        </div>

        {/* Project Name */}
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#0f4c5c]">
          Campus Lost & Found
        </p>

        {/* Main Heading */}
        <h1 className="text-5xl font-extrabold tracking-tight text-[#0c3f4d] sm:text-7xl">
          To Be
          <span className="mt-2 block text-[#0f7182]">
            Continued<span className="text-[#f0a34a]">...</span>
          </span>
        </h1>

        <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
          Something meaningful is on its way.
          We're working on making your campus experience
          better and helping lost belongings find their way home.
        </p>

        {/* Status */}
        <div className="mx-auto mt-10 inline-flex items-center gap-3 rounded-full border border-[#0f4c5c]/10 bg-white px-6 py-3 shadow-sm">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
          </span>
          <span className="text-sm font-semibold text-[#0c3f4d]">
            Currently Under Development
          </span>
        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-[#0f4c5c]/10 pt-6">
          <p className="text-sm text-slate-500">
            Bringing lost items back to their owners.
          </p>
          <p className="mt-2 text-xs font-medium tracking-wide text-[#0f4c5c]/60">
            © 2026 Campus Lost & Found
          </p>
        </div>

      </div>
    </div>
  );
}
