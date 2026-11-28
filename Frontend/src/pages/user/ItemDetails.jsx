import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useItems } from '../../context/ItemsContext';
import { formatDate } from '../../data/constants';
import { ItemImage, StatusBadge, TypeBadge } from '../../components/user/ItemCard';
import ConfirmDelete from '../../components/user/ConfirmDelete';

function InfoRow({ label, children }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-slate-100 py-3 last:border-b-0 sm:flex-row sm:gap-4">
      <dt className="w-32 shrink-0 text-sm text-slate-500">{label}</dt>
      <dd className="text-[15px] font-medium text-[#12262c]">{children}</dd>
    </div>
  );
}

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getItem, isOwner, deleteItem, toggleSelected, selectedIds } = useItems();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const item = getItem(id);

  if (!item) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <h1 className="text-lg font-semibold text-[#0c3f4d]">Item not found</h1>
        <p className="mt-1 text-sm text-slate-500">
          This item may have been deleted or the link is wrong.
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

  const owner = isOwner(item);
  const isSelected = selectedIds.includes(item.id);
  const canSelect = !owner && item.type === 'found' && item.status === 'found';

  const handleDelete = () => {
    deleteItem(item.id);
    navigate('/items');
  };

  return (
    <div className="space-y-6">
      <Link
        to="/items"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-[#0f4c5c]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to items
      </Link>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <ItemImage
            src={item.imageUrl}
            alt={item.title}
            className="aspect-[4/3] w-full"
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-center gap-2">
            <TypeBadge type={item.type} />
            <StatusBadge status={item.status} />
          </div>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#0c3f4d]">
            {item.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{item.category}</p>

          <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-slate-700">
            {item.description}
          </p>

          <dl className="mt-5 rounded-lg border border-slate-200 px-4">
            <InfoRow label="Location">{item.location}</InfoRow>
            <InfoRow label="Date">{formatDate(item.date)}</InfoRow>
            <InfoRow label="Posted by">{item.owner?.fullName || 'Unknown'}</InfoRow>
            {item.owner?.email && <InfoRow label="Contact">{item.owner.email}</InfoRow>}
          </dl>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            {canSelect && (
              <button
                type="button"
                onClick={() => toggleSelected(item.id)}
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f4c5c]/40 ${
                  isSelected
                    ? 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                    : 'bg-[#e8a23a] text-[#2b1d03] hover:bg-[#d8932a]'
                }`}
              >
                {isSelected ? 'Remove from selected items' : 'This might be mine'}
              </button>
            )}

            {owner && (
              <>
                <Link
                  to={`/items/${item.id}/edit`}
                  className="rounded-lg bg-[#0f4c5c] px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#0c3f4d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f4c5c]/40"
                >
                  Edit item
                </Link>
                <button
                  type="button"
                  onClick={() => setConfirmOpen(true)}
                  className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
                >
                  Delete
                </button>
              </>
            )}
          </div>

          {!owner && !canSelect && (
            <p className="mt-6 text-sm text-slate-500">
              {item.type === 'lost'
                ? 'If you have seen this item, contact the owner using the email above.'
                : 'This item is no longer waiting for an owner.'}
            </p>
          )}
        </div>
      </div>

      <ConfirmDelete
        open={confirmOpen}
        title={item.title}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}