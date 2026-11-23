export default function Input({ label, type = "text", name, value, onChange, error, placeholder }) {
  return (
    <div className="flex flex-col gap-1 mb-4 w-full">
      {label && <label className="text-sm font-semibold text-textMain">{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`border p-2.5 rounded-lg focus:outline-none focus:ring-2 w-full transition-all ${
          error ? 'border-danger focus:ring-danger/50' : 'border-gray-300 focus:ring-primary/50'
        }`}
      />
      {error && <span className="text-danger text-xs font-medium mt-1">{error}</span>}
    </div>
  );
}