import { useNavigate } from 'react-router-dom';
import { useItems } from '../../context/ItemsContext';
import ItemForm from '../../components/user/ItemForm';

export default function CreateItem() {
  const navigate = useNavigate();
  const { addItem } = useItems();

  const handleSubmit = (values) => {
    const created = addItem(values);
    navigate(`/items/${created.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight text-[#0c3f4d]">Report an item</h1>
      <p className="mt-1 text-sm text-slate-600">
        Tell us whether you lost something or found something on campus.
      </p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <ItemForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          submitLabel="Publish item"
        />
      </div>
    </div>
  );
}