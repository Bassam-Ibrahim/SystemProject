export const ITEM_TYPES = ['lost', 'found'];

export const TYPE_LABELS = { lost: 'Lost', found: 'Found' };

export const CATEGORIES = [
  'Electronics',
  'Accessories',
  'Documents & IDs',
  'Bags',
  'Clothing',
  'Books & Stationery',
  'Keys',
  'Other',
];

export const STATUSES = ['missing', 'found', 'returned'];

export const STATUS_LABELS = {
  missing: 'Missing',
  found: 'Found',
  returned: 'Returned',
};

export const STATUS_BY_TYPE = {
  lost: ['missing'],
  found: ['found', 'returned'],
};

export const getInitialStatus = (type) => (type === 'lost' ? 'missing' : 'found');

export const DEFAULT_FILTERS = { search: '', category: '', type: '', status: '' };

export const hasActiveFilters = (filters) =>
  Object.values(filters).some((value) => value !== '');

export const filterItems = (items, filters) => {
  const term = filters.search.trim().toLowerCase();

  return items
    .filter((item) => {
      if (term && !item.title.toLowerCase().includes(term)) return false;
      if (filters.category && item.category !== filters.category) return false;
      if (filters.type && item.type !== filters.type) return false;
      if (filters.status && item.status !== filters.status) return false;
      return true;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};