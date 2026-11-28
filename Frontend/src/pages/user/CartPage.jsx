import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useItems } from '../../context/ItemsContext';
import { formatDate } from '../../data/constants';
import { ItemImage, StatusBadge, TypeBadge } from '../../components/user/ItemCard';

export default function CartPage() {
  const { selectedIds, getItem, removeSelected, clearSelected } = useItems();
  const [note, setNote] = useState('');
  const [submittedCount, setSubmittedCount] = useState(0);

  const selected = selectedIds.map((id) => getItem(id)).filter(Boolean);

  const handleSubmit = () => {
    // TODO: send the claim to the backend when the endpoint is ready:
    // { itemIds: selected.map((i) => i.id), note }
    setSubmittedCount(selected.length);
    clearSelected();
    setNote('');
  };

  if (submittedCount > 0 && selected.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-14 text-center">
        <h1 className="text-lg font-semibold text-emerald-900">Claim submitted</h1>
        <p className="mt-1 text-sm text-emerald-800">
          We received your claim for {submittedCount} item{submittedCount > 1 ? 's' : ''}. You will be
          contacted after it is reviewed.
        </p>
        <Link
          to="/items"
          className="mt-5 inline-block rounded-lg bg-[#0f4c5c] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0c3f4d]"
        >
          Back to items
        </Link>
      </div>
    );
  }

  if (selected.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <h1 className="text-lg font-semibold text-[#0c3f4d]">No selected items</h1>
        <p className="mt-1 text-sm text-slate-500">
          Open a found item and choose "This might be mine" to add it here.
        </p>
        <Link
          to="/items"
          className="mt-5 inline-block rounded-lg bg-[#0f4c5c] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0c3f4d]"
        >
          Browse items
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#0c3f4d]">Selected items</h1>
          <p className="mt-1 text-sm text-slate-600">
            Review the items you think are yours before sending your claim.
          </p>
        </div>
        <button
          type="button"
          onClick={clearSelected}
          className="self-start rounded-lg px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 sm:self-auto"
        >
          Remove all
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <ul className="space-y-3">
          {selected.map((item) => (
            <li
              key={item.id}
              className="flex gap-4 rounded-xl border border-slate-200 bg-white p-3 sm:p-4"
            >
              <Link
                to={`/items/${item.id}`}
                className="h-24 w-24 shrink-0 overflow-hidden rounded-lg sm:h-28 sm:w-28"
              >
                <ItemImage src={item.imageUrl} alt={item.title} className="h-full w-full" />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <TypeBadge type={item.type} />
                  <StatusBadge status={item.status} />
                </div>
                <Link
                  to={`/items/${item.id}`}
                  className="mt-1.5 truncate text-[15px] font-semibold text-[#0c3f4d] hover:underline"
                >
                  {item.title}
                </Link>
                <p className="text-[13px] text-slate-500">{item.category}</p>
                <p className="mt-auto truncate text-[13px] text-slate-600">
                  {item.location} · {formatDate(item.date)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeSelected(item.id)}
                aria-label={`Remove ${item.title}`}
                className="self-start rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          ))}
        </ul>

        <aside className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-[#0c3f4d]">Your claim</h2>
          <p className="text-sm text-slate-600">
            {selected.length} item{selected.length > 1 ? 's' : ''} selected
          </p>

          <div>
            <label htmlFor="claim-note" className="mb-1.5 block text-[15px] font-medium text-slate-800">
              Note <span className="font-normal text-slate-500">(optional)</span>
            </label>
            <textarea
              id="claim-note"
              rows={4}
              maxLength={300}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe something only the owner would know"
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-[15px] text-[#12262c] outline-none placeholder:text-slate-400 focus:border-[#0f4c5c] focus:ring-2 focus:ring-[#0f4c5c]/25"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="h-11 w-full rounded-lg bg-[#e8a23a] text-[15px] font-semibold text-[#2b1d03] transition-colors hover:bg-[#d8932a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a23a]/60"
          >
            Submit claim
          </button>
        </aside>
      </div>
    </div>
  );
}