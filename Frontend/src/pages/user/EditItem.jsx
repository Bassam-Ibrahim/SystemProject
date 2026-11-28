import { Link, useNavigate, useParams } from 'react-router-dom';
import { useItems } from '../../context/ItemsContext';
import ItemForm from '../../components/user/ItemForm';

function Message({ title, text }) {
  return (
    <div className="mx-auto max-w-md rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <h1 className="text-lg font-semibold text-[#0c3f4d]">{title}</h1>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
      <Link
        to="/items"
        className="mt-5 inline-block rounded-lg bg-[#0f4c5c] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0c3f4d]"
      >
        Back to items
      </Link>
    </div>
  );
}

export default function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getItem, isOwner, updateItem } = useItems();

  const item = getItem(id);

  if (!item) {
    return <Message title="Item not found" text="This item may have been deleted." />;
  }

  if (!isOwner(item)) {
    return <Message title="You can't edit this item" text="Only the person who posted it can edit it." />;
  }

  const handleSubmit = (values) => {
    const { type, ...changes } = values;
    updateItem(item.id, changes);
    navigate(`/items/${item.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight text-[#0c3f4d]">Edit item</h1>
      <p className="mt-1 text-sm text-slate-600">Update the details and save your changes.</p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <ItemForm
          key={item.id}
          mode="edit"
          initialValues={{
            type: item.type,
            status: item.status,
            title: item.title,
            description: item.description,
            category: item.category,
            location: item.location,
            date: item.date,
            imageUrl: item.imageUrl,
          }}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/items/${item.id}`)}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}