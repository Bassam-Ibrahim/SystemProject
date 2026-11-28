import {
  CATEGORIES,
  DEFAULT_FILTERS,
  ITEM_TYPES,
  STATUSES,
  STATUS_BY_TYPE,
  STATUS_LABELS,
  TYPE_LABELS,
  hasActiveFilters,
} from '../../data/constants';

const fieldClass =
  'h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-[15px] text-[#12262c] outline-none transition-colors placeholder:text-slate-400 focus:border-[#0f4c5c] focus:ring-2 focus:ring-[#0f4c5c]/25';

const labelClass = 'mb-1 block text-xs font-medium text-slate-600';

export default function SearchBar({ filters, onChange }) {
  const active = hasActiveFilters(filters);
  const statusOptions = filters.type ? STATUS_BY_TYPE[filters.type] : STATUSES;

  const update = (name, value) => {
    const next = { ...filters, [name]: value };

    if (
      name === 'type' &&
      value &&
      next.status &&
      !STATUS_BY_TYPE[value].includes(next.status)
    ) {
      next.status = '';
    }

    onChange(next);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto] lg:items-end">
        <div className="sm:col-span-2 lg:col-span-1">
          <label htmlFor="search" className={labelClass}>
            Search by name
          </label>
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
              <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              id="search"
              type="search"
              value={filters.search}
              onChange={(e) => update('search', e.target.value)}
              placeholder="Wallet, keys, phone..."
              className={`${fieldClass} pl-10`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className={labelClass}>
            Category
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => update('category', e.target.value)}
            className={fieldClass}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="type" className={labelClass}>
            Type
          </label>
          <select
            id="type"
            value={filters.type}
            onChange={(e) => update('type', e.target.value)}
            className={fieldClass}
          >
            <option value="">Lost and found</option>
            {ITEM_TYPES.map((type) => (
              <option key={type} value={type}>
                {TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className={labelClass}>
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => update('status', e.target.value)}
            className={fieldClass}
          >
            <option value="">All statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => onChange({ ...DEFAULT_FILTERS })}
          disabled={!active}
          className="h-11 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-[#0f4c5c] hover:text-[#0f4c5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f4c5c]/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-300 disabled:hover:text-slate-700"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}