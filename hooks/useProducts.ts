import useSWR from 'swr';

const fetcher = async (url: string) => {
  console.log(`Fetching products from ${url}`);
  const response = await fetch(url);
  const data = await response.json();
  
  if (!response.ok) {
    console.error(`API error for ${url}: ${data.error || 'Unknown error'}`);
    throw new Error(data.error || 'Failed to fetch products');
  }
  
  console.log(`Fetched ${data.data?.length || 0} products successfully from ${url}`);
  return data.data || [];
};

interface UseProductsOptions {
  gender?: string;
  featured?: boolean;
  limit?: number;
  category?: string;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { gender, featured, limit, category } = options;
  
  const params = new URLSearchParams();
  if (gender) params.append('gender', gender);
  if (featured) params.append('featured', 'true');
  if (limit !== undefined) params.append('limit', limit.toString());
  if (category) params.append('category', category);

  const url = `/api/products?${params.toString()}`;
  console.log('[useProducts] Requesting URL:', url, 'with options:', options);
  
  const { data, error, isLoading } = useSWR(url, fetcher);

  if (error) {
    console.error(`[useProducts] SWR error for ${url}:`, error);
  }
  
  return {
    products: data || [],
    isLoading,
    isError: error,
  };
} 