import { useState } from 'react';

export default function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const found = {};
    if (!rating) found.rating = 'Choose a rating from 1 to 5 stars.';
    if (!comment.trim()) found.comment = 'Write a comment.';
    else if (comment.trim().length < 5) found.comment = 'The comment must be at least 5 characters.';

    setErrors(found);
    if (Object.keys(found).length) return;

    onSubmit({ rating, comment: comment.trim() });
    setRating(0);
    setHover(0);
    setComment('');
    setSent(true);
  };

  const shown = hover || rating;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-[#0c3f4d]">Write a review</h2>

      <fieldset>
        <legend className="mb-1.5 text-[15px] font-medium text-slate-800">Your rating</legend>
        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                setRating(n);
                setErrors((prev) => ({ ...prev, rating: undefined }));
                setSent(false);
              }}
              onMouseEnter={() => setHover(n)}
              aria-label={`${n} star${n > 1 ? 's' : ''}`}
              aria-pressed={rating === n}
              className="rounded p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f4c5c]/40"
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={n <= shown ? 'text-[#e8a23a]' : 'text-slate-300'}
                aria-hidden="true"
              >
                <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z" />
              </svg>
            </button>
          ))}
        </div>
        {errors.rating && (
          <p role="alert" className="mt-1.5 text-sm text-red-700">
            {errors.rating}
          </p>
        )}
      </fieldset>

      <div>
        <label htmlFor="review-comment" className="mb-1.5 block text-[15px] font-medium text-slate-800">
          Comment
        </label>
        <textarea
          id="review-comment"
          rows={4}
          maxLength={500}
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            setErrors((prev) => ({ ...prev, comment: undefined }));
            setSent(false);
          }}
          placeholder="Share your experience"
          className={`block w-full rounded-lg border bg-white px-3 py-2.5 text-[15px] text-[#12262c] outline-none placeholder:text-slate-400 focus:ring-2 ${
            errors.comment
              ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
              : 'border-slate-300 focus:border-[#0f4c5c] focus:ring-[#0f4c5c]/25'
          }`}
        />
        <div className="mt-1 flex justify-between text-[13px]">
          <span className="text-red-700">{errors.comment}</span>
          <span className="text-slate-500">{comment.length}/500</span>
        </div>
      </div>

      {sent && (
        <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800">
          Thanks, your review was added.
        </p>
      )}

      <button
        type="submit"
        className="h-11 w-full rounded-lg bg-[#0f4c5c] text-[15px] font-semibold text-white transition-colors hover:bg-[#0c3f4d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f4c5c] focus-visible:ring-offset-2"
      >
        Submit review
      </button>
    </form>
  );
}