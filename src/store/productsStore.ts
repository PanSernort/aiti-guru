import { create } from 'zustand';
import { getProducts } from '../api/products';
import type { Product, SortField, SortOrder } from '../types';

interface ProductsState {
  products: Product[];
  total: number;
  isLoading: boolean;
  error: string | null;
  page: number;
  limit: number;
  sortBy: SortField | null;
  sortOrder: SortOrder;
  search: string;
  selectedIds: Set<number>;

  fetchProducts: () => Promise<void>;
  setPage: (page: number) => void;
  setSort: (field: SortField) => void;
  setSearch: (search: string) => void;
  toggleSelect: (id: number) => void;
  toggleSelectAll: () => void;
  addProductLocal: (product: Product) => void;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  total: 0,
  isLoading: false,
  error: null,
  page: 1,
  limit: 20,
  sortBy: null,
  sortOrder: 'asc',
  search: '',
  selectedIds: new Set(),

  fetchProducts: async () => {
    const { page, limit, sortBy, sortOrder, search } = get();
    set({ isLoading: true, error: null });

    try {
      const skip = (page - 1) * limit;
      const data = await getProducts({
        limit,
        skip,
        sortBy: sortBy ?? undefined,
        order: sortBy ? sortOrder : undefined,
        search: search || undefined,
      });

      set({
        products: data.products,
        total: data.total,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false, error: 'Ошибка загрузки товаров' });
    }
  },

  setPage: (page) => {
    set({ page });
    get().fetchProducts();
  },

  setSort: (field) => {
    const { sortBy, sortOrder } = get();
    const newOrder =
      sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    set({ sortBy: field, sortOrder: newOrder, page: 1 });
    get().fetchProducts();
  },

  setSearch: (search) => {
    set({ search, page: 1 });
    get().fetchProducts();
  },

  toggleSelect: (id) => {
    const { selectedIds } = get();
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    set({ selectedIds: newSet });
  },

  toggleSelectAll: () => {
    const { selectedIds, products } = get();
    if (selectedIds.size === products.length) {
      set({ selectedIds: new Set() });
    } else {
      set({ selectedIds: new Set(products.map((p) => p.id)) });
    }
  },

  addProductLocal: (product) => {
    set((state) => ({
      products: [product, ...state.products],
      total: state.total + 1,
    }));
  },
}));
