import useSWR from 'swr';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch products');
  }
  
  return data.data || [];
};

interface UseProductsOptions {
  gender?: string;
  featured?: boolean;
  limit?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { gender, featured, limit } = options;
  
  const params = new URLSearchParams();
  if (gender) params.append('gender', gender);
  if (featured) params.append('featured', 'true');
  if (limit) params.append('limit', limit.toString());

  const { data, error, isLoading } = useSWR(
    `/api/products?${params.toString()}`,
    fetcher
  );

  return {
    products: data || [],
    isLoading,
    isError: error,
  };
} 