import { useEffect, useState } from 'react';
import {
  Search,
  RefreshCw,
  Plus,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react';
import { useProductsStore } from '../../store/productsStore';
import { useDebounce } from '../../hooks/useDebounce';
import { formatPrice } from '../../utils/format';
import { AddProductModal } from './AddProductModal';
import type { SortField } from '../../types';

export const ProductsPage: React.FC = () => {
  const {
    products,
    total,
    isLoading,
    page,
    limit,
    sortBy,
    sortOrder,
    selectedIds,
    fetchProducts,
    setPage,
    setSort,
    setSearch,
    toggleSelect,
    toggleSelectAll,
  } = useProductsStore();

  const [searchInput, setSearchInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  const totalPages = Math.ceil(total / limit);
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const renderSortIcon = (field: SortField) => {
    if (sortBy !== field) {
      return (
        <span className="inline-flex flex-col ml-1 opacity-30">
          <ChevronUp size={12} />
          <ChevronDown size={12} className="-mt-1" />
        </span>
      );
    }
    return sortOrder === 'asc' ? (
      <ChevronUp size={14} className="ml-1" />
    ) : (
      <ChevronDown size={14} className="ml-1" />
    );
  };

  const getPaginationPages = (): number[] => {
    const pages: number[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        for (let i = 1; i <= maxVisible; i++) pages.push(i);
      } else if (page >= totalPages - 2) {
        for (let i = totalPages - maxVisible + 1; i <= totalPages; i++)
          pages.push(i);
      } else {
        for (let i = page - 2; i <= page + 2; i++) pages.push(i);
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] border-l-[4px] border-l-primary">
      {/* Header — white top bar */}
      <div className="bg-white">
        <div className="max-w-[1440px] mx-auto px-8 py-5 flex items-center gap-8">
          <h1 className="text-[18px] font-bold text-gray-900 whitespace-nowrap">
            Товары
          </h1>
          <div className="flex-1 max-w-[600px]">
            <div className="relative">
              <Search
                size={16}
                strokeWidth={1.5}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Найти"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-[10px] text-sm outline-none focus:border-primary transition-colors bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1440px] mx-auto px-8 py-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[16px] font-semibold text-gray-900">
            Все позиции
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchProducts()}
              className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Обновить"
            >
              <RefreshCw size={16} strokeWidth={1.5} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-[13px] font-medium rounded-[10px] transition-colors"
            >
              <Plus size={15} strokeWidth={2} />
              Добавить
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {isLoading && (
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-primary rounded-full animate-progress" />
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-[12px] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="w-[52px] pl-5 pr-2 py-4">
                  <input
                    type="checkbox"
                    checked={
                      products.length > 0 &&
                      selectedIds.size === products.length
                    }
                    onChange={toggleSelectAll}
                    className="w-[18px] h-[18px] rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                  />
                </th>
                <th className="text-left px-3 py-4 text-[13px] font-medium text-gray-400 w-[300px]">
                  <button
                    onClick={() => setSort('title')}
                    className="inline-flex items-center hover:text-gray-600 transition-colors"
                  >
                    Наименование
                    {renderSortIcon('title')}
                  </button>
                </th>
                <th className="text-left px-3 py-4 text-[13px] font-medium text-gray-400">
                  Вендор
                </th>
                <th className="text-left px-3 py-4 text-[13px] font-medium text-gray-400">
                  Артикул
                </th>
                <th className="text-left px-3 py-4 text-[13px] font-medium text-gray-400">
                  <button
                    onClick={() => setSort('rating')}
                    className="inline-flex items-center hover:text-gray-600 transition-colors"
                  >
                    Оценка
                    {renderSortIcon('rating')}
                  </button>
                </th>
                <th className="text-right px-3 py-4 text-[13px] font-medium text-gray-400 pr-4">
                  <button
                    onClick={() => setSort('price')}
                    className="inline-flex items-center hover:text-gray-600 transition-colors"
                  >
                    Цена, ₽
                    {renderSortIcon('price')}
                  </button>
                </th>
                <th className="w-[100px]" />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const isSelected = selectedIds.has(product.id);
                return (
                  <tr
                    key={product.id}
                    className={`border-b border-gray-50 transition-colors ${
                      isSelected
                        ? 'bg-[#F8F9FF] border-l-[3px] border-l-primary'
                        : 'hover:bg-gray-50/50 border-l-[3px] border-l-transparent'
                    }`}
                  >
                    <td className="pl-5 pr-2 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(product.id)}
                        className={`w-[18px] h-[18px] rounded border-gray-300 focus:ring-primary focus:ring-offset-0 cursor-pointer ${
                          isSelected ? 'text-primary' : ''
                        }`}
                      />
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-[8px] flex-shrink-0 overflow-hidden">
                          {product.thumbnail ? (
                            <img
                              src={product.thumbnail}
                              alt={product.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-gray-900 truncate max-w-[220px]">
                            {product.title}
                          </p>
                          <p className="text-[12px] text-gray-400 truncate">
                            {product.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-[13px] font-semibold text-gray-900">
                      {product.brand || '—'}
                    </td>
                    <td className="px-3 py-4 text-[13px] text-gray-500">
                      {product.sku || '—'}
                    </td>
                    <td className="px-3 py-4 text-[13px]">
                      <span
                        className={
                          product.rating < 3
                            ? 'text-red-500 font-semibold'
                            : 'text-gray-900'
                        }
                      >
                        {product.rating}
                      </span>
                      <span className="text-gray-400">/5</span>
                    </td>
                    <td className="px-3 py-4 text-[13px] text-gray-900 text-right font-medium tabular-nums pr-4">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center justify-end gap-2 pr-2">
                        <button className="w-[30px] h-[30px] flex items-center justify-center bg-primary text-white rounded-full hover:bg-primary-hover transition-colors">
                          <Plus size={14} strokeWidth={2.5} />
                        </button>
                        <button className="w-[30px] h-[30px] flex items-center justify-center border border-gray-200 text-gray-400 rounded-full hover:bg-gray-50 transition-colors">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!isLoading && products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-gray-400 text-sm">
                    Товары не найдены
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 0 && (
          <div className="flex items-center justify-between mt-5 px-1">
            <p className="text-[13px] text-gray-500">
              Показано{' '}
              <span className="font-semibold text-gray-900">
                {startItem}-{endItem}
              </span>{' '}
              из{' '}
              <span className="font-semibold text-gray-900">{total}</span>
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="w-[32px] h-[32px] flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              {getPaginationPages().map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-[32px] h-[32px] flex items-center justify-center rounded-full text-[13px] font-medium transition-colors ${
                    page === p
                      ? 'bg-primary text-white'
                      : 'text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="w-[32px] h-[32px] flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && <AddProductModal onClose={() => setShowModal(false)} />}
    </div>
  );
};
