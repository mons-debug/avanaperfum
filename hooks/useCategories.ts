import useSWR from 'swr';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch categories');
  }
  
  return data.data || [];
};

interface UseCategoriesOptions {
  featured?: boolean;
}

export function useCategories(options: UseCategoriesOptions = {}) {
  const { featured } = options;
  
  const params = new URLSearchParams();
  if (featured) params.append('featured', 'true');

  const { data, error, isLoading } = useSWR(
    `/api/categories?${params.toString()}`,
    fetcher
  );

  return {
    categories: data || [],
    isLoading,
    isError: error,
  };
} 