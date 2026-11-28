import { useMemo } from 'react';
import { useItems } from '../../context/ItemsContext';
import ReviewCard, { Stars } from '../../components/user/ReviewCard';
import ReviewForm from '../../components/user/ReviewForm';

export default function ReviewsPage() {
  const { reviews, addReview } = useItems();

  const average = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  const sorted = useMemo(
    () => [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [reviews]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#0c3f4d]">Reviews</h1>
        <p className="mt-1 text-sm text-slate-600">
          What people think about Campus Lost &amp; Found.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr] lg:items-start">
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            {reviews.length === 0 ? (
              <p className="text-sm text-slate-500">No ratings yet.</p>
            ) : (
              <div className="flex items-center gap-4">
                <p className="text-4xl font-semibold text-[#0c3f4d]">{average.toFixed(1)}</p>
                <div>
                  <Stars value={average} size={20} />
                  <p className="mt-1 text-sm text-slate-500">
                    {reviews.length} review{reviews.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )}
          </div>

          <ReviewForm onSubmit={addReview} />
        </div>

        <div>
          {sorted.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center text-sm text-slate-500">
              No reviews yet. Be the first to write one.
            </p>
          ) : (
            <ul className="space-y-4">
              {sorted.map((review) => (
                <li key={review.id}>
                  <ReviewCard review={review} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}