import ItemCard from './ItemCard';

export default function ItemsList({ items, onClear }) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-[#0c3f4d]">No items found</h3>
        <p className="mt-1 text-sm text-slate-500">
          Try a different name or change the filters.
        </p>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="mt-5 rounded-lg bg-[#0f4c5c] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0c3f4d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f4c5c]/40"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <li key={item.id} className="flex">
          <ItemCard item={item} />
        </li>
      ))}
    </ul>
  );
}