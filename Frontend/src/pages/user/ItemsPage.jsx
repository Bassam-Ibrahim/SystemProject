import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useItems } from '../../context/ItemsContext';
import {
  DEFAULT_FILTERS,
  ITEM_TYPES,
  filterItems,
  hasActiveFilters,
} from '../../data/constants';
import SearchBar from '../../components/user/SearchBar';
import ItemsList from '../../components/user/ItemsList';

export default function ItemsPage() {
  const { items } = useItems();
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState(() => {
    const type = searchParams.get('type');

    return {
      ...DEFAULT_FILTERS,
      search: searchParams.get('search') || '',
      type: ITEM_TYPES.includes(type) ? type : '',
    };
  });

  const filtered = useMemo(() => filterItems(items, filters), [items, filters]);

  const countText = hasActiveFilters(filters)
    ? `${filtered.length} of ${items.length} items`
    : `${items.length} items`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#0c3f4d]">
            Browse items
          </h1>
          <p className="mt-1 text-sm text-slate-600">{countText}</p>
        </div>

        <Link
          to="/items/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e8a23a] px-4 py-2.5 text-sm font-semibold text-[#2b1d03] transition-colors hover:bg-[#d8932a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a23a]/60"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          Report an item
        </Link>
      </div>

      <SearchBar filters={filters} onChange={setFilters} />

      <ItemsList items={filtered} onClear={() => setFilters(DEFAULT_FILTERS)} />
    </div>
  );
}