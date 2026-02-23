import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProductsStore } from '../../store/productsStore';
import type { Product } from '../../types';

interface AddProductModalProps {
  onClose: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ onClose }) => {
  const addProductLocal = useProductsStore((s) => s.addProductLocal);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [sku, setSku] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Укажите наименование';
    if (!price.trim()) {
      newErrors.price = 'Укажите цену';
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'Цена должна быть положительным числом';
    }
    if (!brand.trim()) newErrors.brand = 'Укажите вендора';
    if (!sku.trim()) newErrors.sku = 'Укажите артикул';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newProduct: Product = {
      id: Date.now(),
      title: title.trim(),
      price: Number(price),
      brand: brand.trim(),
      sku: sku.trim(),
      description: '',
      category: 'Новый товар',
      discountPercentage: 0,
      rating: 5,
      stock: 0,
      tags: [],
      weight: 0,
      dimensions: { width: 0, height: 0, depth: 0 },
      warrantyInformation: '',
      shippingInformation: '',
      availabilityStatus: '',
      reviews: [],
      returnPolicy: '',
      minimumOrderQuantity: 1,
      meta: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        barcode: '',
        qrCode: '',
      },
      images: [],
      thumbnail: '',
    };

    addProductLocal(newProduct);
    toast.success('Товар успешно добавлен');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Добавить товар
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Наименование
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-colors ${
                  errors.title ? 'border-red-400' : 'border-gray-200 focus:border-primary'
                }`}
                placeholder="Название товара"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Цена
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-colors ${
                  errors.price ? 'border-red-400' : 'border-gray-200 focus:border-primary'
                }`}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Вендор
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-colors ${
                  errors.brand ? 'border-red-400' : 'border-gray-200 focus:border-primary'
                }`}
                placeholder="Производитель"
              />
              {errors.brand && (
                <p className="text-red-500 text-xs mt-1">{errors.brand}</p>
              )}
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Артикул
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-colors ${
                  errors.sku ? 'border-red-400' : 'border-gray-200 focus:border-primary'
                }`}
                placeholder="SKU-XXX"
              />
              {errors.sku && (
                <p className="text-red-500 text-xs mt-1">{errors.sku}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-xl transition-colors"
            >
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
