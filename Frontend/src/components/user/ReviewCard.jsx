import { formatDate } from '../../data/constants';

export function Stars({ value, size = 18 }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={n <= Math.round(value) ? 'text-[#e8a23a]' : 'text-slate-300'}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z" />
        </svg>
      ))}
    </span>
  );
}

export default function ReviewCard({ review }) {
  const name = review.author?.fullName || 'Anonymous';

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e6f1f3] text-sm font-semibold text-[#0f4c5c]">
            {name.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="text-[15px] font-semibold text-[#0c3f4d]">{name}</p>
            <p className="text-[13px] text-slate-500">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <Stars value={review.rating} />
      </div>

      <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-slate-700">
        {review.comment}
      </p>
    </article>
  );
}