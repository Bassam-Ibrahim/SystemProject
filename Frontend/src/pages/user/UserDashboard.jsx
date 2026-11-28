import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useItems } from '../../context/ItemsContext';
import ItemCard from '../../components/user/ItemCard';

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

const byNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

function Stat({ label, value, accent }) {
  return (
    <div className={`rounded-xl border border-slate-200 border-l-4 bg-white p-4 ${accent}`}>
      <p className="text-2xl font-semibold text-[#0c3f4d]">{value}</p>
      <p className="mt-0.5 text-sm text-slate-500">{label}</p>
    </div>
  );
}

function Section({ title, viewAllTo, items, emptyText, gridClass }) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#0c3f4d]">{title}</h2>
        <Link
          to={viewAllTo}
          className="text-sm font-semibold text-[#0f4c5c] underline-offset-4 hover:underline"
        >
          View all
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500">
          {emptyText}
        </p>
      ) : (
        <ul className={`grid gap-5 ${gridClass}`}>
          {items.map((item) => (
            <li key={item.id} className="flex">
              <ItemCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const { items, isOwner } = useItems();
  const [term, setTerm] = useState('');

  const user = getUser();
  const firstName = user?.fullName?.split(' ')[0] || 'there';

  const stats = useMemo(
    () => ({
      missing: items.filter((i) => i.status === 'missing').length,
      found: items.filter((i) => i.status === 'found').length,
      returned: items.filter((i) => i.status === 'returned').length,
      mine: items.filter((i) => isOwner(i)).length,
    }),
    [items, isOwner]
  );

  const latest = useMemo(() => [...items].sort(byNewest).slice(0, 4), [items]);
  const lost = useMemo(() => items.filter((i) => i.type === 'lost').sort(byNewest).slice(0, 4), [items]);
  const found = useMemo(() => items.filter((i) => i.type === 'found').sort(byNewest).slice(0, 4), [items]);

  const handleSearch = (e) => {
    e.preventDefault();
    const value = term.trim();
    navigate(value ? `/items?search=${encodeURIComponent(value)}` : '/items');
  };

  return (
    <div className="space-y-10">
      <div className="rounded-2xl bg-[#0f4c5c] px-6 py-8 text-white sm:px-10 sm:py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Hello, {firstName}</h1>
        <p className="mt-2 max-w-xl text-white/75">
          Lost something or found something on campus? Search the items or report a new one.
        </p>

        <form onSubmit={handleSearch} className="mt-6 flex max-w-xl flex-col gap-2 sm:flex-row">
          <label htmlFor="dashboard-search" className="sr-only">
            Search items
          </label>
          <input
            id="dashboard-search"
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search by item name..."
            className="h-12 flex-1 rounded-lg border border-transparent bg-white px-4 text-[15px] text-[#12262c] outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#e8a23a]"
          />
          <button
            type="submit"
            className="h-12 rounded-lg bg-[#e8a23a] px-6 text-sm font-semibold text-[#2b1d03] transition-colors hover:bg-[#d8932a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            Search
          </button>
        </form>

        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <Link
            to="/items/new"
            className="rounded-lg border border-white/30 px-4 py-2 font-semibold transition-colors hover:bg-white/10"
          >
            Report an item
          </Link>
          <Link
            to="/items"
            className="rounded-lg border border-white/30 px-4 py-2 font-semibold transition-colors hover:bg-white/10"
          >
            Browse all items
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Missing items" value={stats.missing} accent="border-l-red-400" />
        <Stat label="Found items" value={stats.found} accent="border-l-emerald-500" />
        <Stat label="Returned" value={stats.returned} accent="border-l-sky-500" />
        <Stat label="My posts" value={stats.mine} accent="border-l-[#e8a23a]" />
      </div>

      <Section
        title="Latest items"
        viewAllTo="/items"
        items={latest}
        emptyText="No items yet."
        gridClass="sm:grid-cols-2 lg:grid-cols-4"
      />

      <div className="grid gap-10 xl:grid-cols-2">
        <Section
          title="Lost items"
          viewAllTo="/items?type=lost"
          items={lost}
          emptyText="No lost items reported."
          gridClass="sm:grid-cols-2"
        />
        <Section
          title="Found items"
          viewAllTo="/items?type=found"
          items={found}
          emptyText="No found items reported."
          gridClass="sm:grid-cols-2"
        />
      </div>
    </div>
  );
}