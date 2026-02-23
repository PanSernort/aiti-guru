import api from './axios';
import type { ProductsResponse, SortField, SortOrder } from '../types';

interface GetProductsParams {
  limit?: number;
  skip?: number;
  sortBy?: SortField;
  order?: SortOrder;
  search?: string;
}

export const getProducts = async (
  params: GetProductsParams = {}
): Promise<ProductsResponse> => {
  const { limit = 20, skip = 0, sortBy, order, search } = params;

  if (search) {
    const response = await api.get<ProductsResponse>('/products/search', {
      params: { q: search, limit, skip, sortBy, order },
    });
    return response.data;
  }

  const response = await api.get<ProductsResponse>('/products', {
    params: { limit, skip, sortBy, order },
  });
  return response.data;
};
