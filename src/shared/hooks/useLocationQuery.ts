import { useQuery } from '@tanstack/react-query';
import { getHybridLocation, type HybridLocationResult } from '@/shared/api';

export function useLocationQuery(enabled: boolean = true) {
  return useQuery<HybridLocationResult>({
    queryKey: ['location'],
    queryFn: getHybridLocation,
    enabled,
    staleTime: 60 * 60 * 1000, // 1시간
    gcTime: 2 * 60 * 60 * 1000, // 2시간
    retry: 1,
  });
}
