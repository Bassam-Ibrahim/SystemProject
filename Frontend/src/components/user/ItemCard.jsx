import { useState } from 'react';
import { Link } from 'react-router-dom';
import { STATUS_LABELS, TYPE_LABELS, formatDate } from '../../data/constants';

const TYPE_STYLES = {
  lost: 'bg-amber-50 text-amber-800 ring-amber-200',
  found: 'bg-[#e6f1f3] text-[#0f4c5c] ring-[#0f4c5c]/20',
};

const STATUS_STYLES = {
  missing: 'bg-red-50 text-red-700 ring-red-200',
  found: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  returned: 'bg-sky-50 text-sky-700 ring-sky-200',
};

const badgeBase =
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset';

export function TypeBadge({ type, className = '' }) {
  return (
    <span className={`${badgeBase} ${TYPE_STYLES[type]} ${className}`}>
      {TYPE_LABELS[type]}
    </span>
  );
}

export function StatusBadge({ status, className = '' }) {
  return (
    <span className={`${badgeBase} ${STATUS_STYLES[status]} ${className}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export function ItemImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 text-slate-300 ${className}`}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="9" cy="10" r="1.8" stroke="currentColor" strokeWidth="1.6" />
          <path d="M4 17l5-4.5 4 3.5 3-2.5 4 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}

export default function ItemCard({ item }) {
  return (
    <Link
      to={`/items/${item.id}`}
      className="group flex w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:border-[#0f4c5c]/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f4c5c]/40"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <ItemImage
          src={item.imageUrl}
          alt={item.title}
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
        />
        <TypeBadge type={item.type} className="absolute left-3 top-3 shadow-sm" />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-[#0c3f4d]">
            {item.title}
          </h3>
        </div>

        <p className="text-[13px] text-slate-500">{item.category}</p>

        <div>
          <StatusBadge status={item.status} />
        </div>

        <div className="mt-auto space-y-1 pt-2 text-[13px] text-slate-600">
          <p className="flex items-center gap-1.5">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="shrink-0 text-slate-400" aria-hidden="true">
              <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0C18.5 15.4 12 21 12 21Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <circle cx="12" cy="10" r="2.3" fill="currentColor" />
            </svg>
            <span className="truncate">{item.location}</span>
          </p>
          <p className="flex items-center gap-1.5">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="shrink-0 text-slate-400" aria-hidden="true">
              <rect x="3.5" y="5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span>{formatDate(item.date)}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}