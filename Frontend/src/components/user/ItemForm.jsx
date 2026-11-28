import { useState } from 'react';
import {
  CATEGORIES,
  ITEM_TYPES,
  STATUS_BY_TYPE,
  STATUS_LABELS,
  TYPE_LABELS,
  getInitialStatus,
} from '../../data/constants';
import ImageUpload from './ImageUpload';

const labelClass = 'mb-1.5 block text-[15px] font-medium text-slate-800';

const fieldClass = (hasError) =>
  `block w-full rounded-lg border bg-white px-3 text-[15px] text-[#12262c] outline-none transition-colors placeholder:text-slate-400 focus:ring-2 ${
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
      : 'border-slate-300 focus:border-[#0f4c5c] focus:ring-[#0f4c5c]/25'
  }`;

const today = () => new Date().toISOString().slice(0, 10);

const EMPTY = {
  type: '',
  title: '',
  description: '',
  category: '',
  location: '',
  date: '',
  imageUrl: '',
};

const validate = (v) => {
  const errors = {};

  if (!v.type) errors.type = 'Choose Lost or Found.';

  if (!v.title.trim()) errors.title = 'Enter a title.';
  else if (v.title.trim().length < 3) errors.title = 'The title must be at least 3 characters.';

  if (!v.description.trim()) errors.description = 'Enter a description.';
  else if (v.description.trim().length < 10)
    errors.description = 'The description must be at least 10 characters.';

  if (!v.category) errors.category = 'Choose a category.';

  if (!v.location.trim()) errors.location = 'Enter the location.';

  if (!v.date) errors.date = 'Choose the date.';
  else if (v.date > today()) errors.date = 'The date cannot be in the future.';

  return errors;
};

function FieldError({ id, children }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm text-red-700">
      {children}
    </p>
  );
}

export default function ItemForm({
  mode = 'create',
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
}) {
  const [values, setValues] = useState({ ...EMPTY, ...initialValues });
  const [errors, setErrors] = useState({});

  const isEdit = mode === 'edit';

  const set = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleChange = (e) => set(e.target.name, e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    const found = validate(values);
    const hasErrors = Object.values(found).some(Boolean);
    setErrors(found);
    if (hasErrors) return;

    onSubmit({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
      location: values.location.trim(),
    });
  };

  const statusOptions = values.type ? STATUS_BY_TYPE[values.type] : [];

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Type */}
      <fieldset>
        <legend className={labelClass}>Type</legend>

        {isEdit ? (
          <p className="text-[15px] font-medium text-[#0c3f4d]">{TYPE_LABELS[values.type]}</p>
        ) : (
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
            {ITEM_TYPES.map((type) => (
              <label key={type} className="relative block">
                <input
                  type="radio"
                  name="type"
                  value={type}
                  checked={values.type === type}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <span className="block cursor-pointer rounded-md py-2.5 text-center text-[15px] font-medium text-slate-600 transition-colors peer-checked:bg-white peer-checked:text-[#0f4c5c] peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-[#0f4c5c]/40">
                  {TYPE_LABELS[type]}
                </span>
              </label>
            ))}
          </div>
        )}

        {!isEdit && (
          <p className="mt-1.5 text-[13px] text-slate-500">
            Lost: you lost something. Found: you found something and want to return it.
          </p>
        )}
        <FieldError>{errors.type}</FieldError>
      </fieldset>

      {/* Status */}
      {values.type && (
        <div>
          <span className={labelClass}>Status</span>

          {isEdit && values.type === 'found' ? (
            <>
              <select
                name="status"
                value={values.status}
                onChange={handleChange}
                className={`${fieldClass(false)} h-11`}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-[13px] text-slate-500">
                Choose Returned when the item has been given back to its owner.
              </p>
            </>
          ) : (
            <p className="text-[15px] font-medium text-[#0c3f4d]">
              {STATUS_LABELS[isEdit ? values.status : getInitialStatus(values.type)]}
              <span className="ml-2 text-[13px] font-normal text-slate-500">
                (set automatically)
              </span>
            </p>
          )}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input
          id="title"
          name="title"
          value={values.title}
          onChange={handleChange}
          placeholder="Black leather wallet"
          maxLength={80}
          aria-invalid={Boolean(errors.title)}
          className={`${fieldClass(errors.title)} h-11`}
        />
        <FieldError>{errors.title}</FieldError>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={values.description}
          onChange={handleChange}
          rows={4}
          maxLength={500}
          placeholder="Color, brand, marks or anything that helps identify it"
          aria-invalid={Boolean(errors.description)}
          className={`${fieldClass(errors.description)} py-2.5`}
        />
        <FieldError>{errors.description}</FieldError>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className={labelClass}>
          Category
        </label>
        <select
          id="category"
          name="category"
          value={values.category}
          onChange={handleChange}
          aria-invalid={Boolean(errors.category)}
          className={`${fieldClass(errors.category)} h-11`}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <FieldError>{errors.category}</FieldError>
      </div>

      {/* Location + Date */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="location" className={labelClass}>
            Location
          </label>
          <input
            id="location"
            name="location"
            value={values.location}
            onChange={handleChange}
            placeholder="Library, ground floor"
            maxLength={100}
            aria-invalid={Boolean(errors.location)}
            className={`${fieldClass(errors.location)} h-11`}
          />
          <FieldError>{errors.location}</FieldError>
        </div>

        <div>
          <label htmlFor="date" className={labelClass}>
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            max={today()}
            value={values.date}
            onChange={handleChange}
            aria-invalid={Boolean(errors.date)}
            className={`${fieldClass(errors.date)} h-11`}
          />
          <FieldError>{errors.date}</FieldError>
        </div>
      </div>

      {/* Image */}
      <ImageUpload value={values.imageUrl} onChange={(url) => set('imageUrl', url)} />

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f4c5c]/40"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-[#0f4c5c] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0c3f4d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f4c5c] focus-visible:ring-offset-2"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}