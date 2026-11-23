export default function ItemCard({ item }) {
  return (
    <div className="bg-surface rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <img
        src={item.image || 'https://via.placeholder.com/300x200?text=No+Image'}
        alt={item.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          {/* استخدام خلفيات فاتحة مع النص الغامق للـ Tags */}
          <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${item.type === 'lost' ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
            {item.type.toUpperCase()}
          </span>
          <span className="text-xs text-textSub">{item.category}</span>
        </div>
        <h3 className="text-lg font-bold text-textMain mb-1">{item.title}</h3>
        <p className="text-sm text-textSub line-clamp-2">{item.description}</p>
      </div>
    </div>
  );
}