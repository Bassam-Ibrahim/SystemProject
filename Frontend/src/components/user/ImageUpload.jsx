import { useRef, useState } from 'react';
import { uploadImage } from '../../data/uploadImage';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

export default function ImageUpload({ value, onChange }) {
  const inputRef = useRef(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!ACCEPTED.includes(file.type)) {
      setError('Only JPG, PNG or WEBP images are allowed.');
      return;
    }

    if (file.size > MAX_SIZE) {
      setError('The image must be 5 MB or smaller.');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch {
      setError('Could not upload the image. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const openPicker = () => inputRef.current?.click();

  return (
    <div>
      <span className="mb-1.5 block text-[15px] font-medium text-slate-800">
        Image <span className="font-normal text-slate-500">(optional)</span>
      </span>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        className="sr-only"
        tabIndex={-1}
      />

      {value ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <img src={value} alt="Selected item preview" className="aspect-[4/3] w-full object-cover" />
          <div className="flex gap-2 border-t border-slate-200 p-3">
            <button
              type="button"
              onClick={openPicker}
              disabled={uploading}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f4c5c]/40 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Change image'}
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              disabled={uploading}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          disabled={uploading}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-10 text-center transition-colors hover:border-[#0f4c5c] hover:bg-[#f4f8f8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f4c5c]/40 disabled:opacity-60"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-[#0f4c5c]" aria-hidden="true">
            <path d="M12 16V5m0 0l-4 4m4-4l4 4M5 19h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-sm font-semibold text-[#0c3f4d]">
            {uploading ? 'Uploading...' : 'Choose an image from your device'}
          </span>
          <span className="text-xs text-slate-500">JPG, PNG or WEBP, up to 5 MB</span>
        </button>
      )}

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}