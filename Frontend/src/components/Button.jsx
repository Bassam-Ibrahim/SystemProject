export default function Button({ children, onClick, type = "button", loading, variant = "primary", className = "" }) {
  const base = "px-4 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-sm",
    danger: "bg-danger text-white hover:opacity-90 shadow-sm",
    outline: "border-2 border-primary text-primary hover:bg-primary-light",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}