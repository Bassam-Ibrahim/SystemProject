import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { mockItems, mockReviews } from '../data/mockItems';
import { STATUS_BY_TYPE, getInitialStatus } from '../data/constants';

const ItemsContext = createContext(null);

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

export function ItemsProvider({ children }) {
  const [items, setItems] = useState(mockItems);
  const [selectedIds, setSelectedIds] = useState([]);
  const [reviews, setReviews] = useState(mockReviews);

  const getItem = useCallback((id) => items.find((item) => item.id === id), [items]);

  const addItem = useCallback((data) => {
    const user = getCurrentUser();

    const newItem = {
      ...data,
      id: `item-${Date.now()}`,
      status: getInitialStatus(data.type),
      owner: {
        id: user?.id || 'unknown',
        fullName: user?.fullName || 'Unknown',
        email: user?.email || '',
      },
      createdAt: new Date().toISOString(),
    };

    setItems((prev) => [newItem, ...prev]);
    return newItem;
  }, []);

  const updateItem = useCallback((id, data) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const next = { ...item, ...data };

        if (!STATUS_BY_TYPE[next.type].includes(next.status)) {
          next.status = getInitialStatus(next.type);
        }

        return next;
      })
    );
  }, []);

  const deleteItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
  }, []);

  const toggleSelected = useCallback((id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  }, []);

  const removeSelected = useCallback((id) => {
    setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
  }, []);

  const clearSelected = useCallback(() => setSelectedIds([]), []);

  const addReview = useCallback(({ rating, comment }) => {
    const user = getCurrentUser();

    setReviews((prev) => [
      {
        id: `review-${Date.now()}`,
        rating,
        comment,
        author: { fullName: user?.fullName || 'Anonymous' },
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, []);

  const isOwner = useCallback((item) => {
    const user = getCurrentUser();
    return Boolean(user && item?.owner && item.owner.id === user.id);
  }, []);

  const value = useMemo(
    () => ({
      items,
      reviews,
      selectedIds,
      getItem,
      addItem,
      updateItem,
      deleteItem,
      toggleSelected,
      removeSelected,
      clearSelected,
      addReview,
      isOwner,
    }),
    [
      items,
      reviews,
      selectedIds,
      getItem,
      addItem,
      updateItem,
      deleteItem,
      toggleSelected,
      removeSelected,
      clearSelected,
      addReview,
      isOwner,
    ]
  );

  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>;
}

export function useItems() {
  const context = useContext(ItemsContext);

  if (!context) {
    throw new Error('useItems must be used inside ItemsProvider');
  }

  return context;
}