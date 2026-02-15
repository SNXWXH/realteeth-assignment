import { useQuery } from '@tanstack/react-query';
import { getAirQualityData, type AirQualityData } from '@/shared/api';

export function useAirQualityQuery(
  latitude: number | null | undefined,
  longitude: number | null | undefined,
  enabled: boolean = true,
) {
  return useQuery<AirQualityData>({
    queryKey: ['airQuality', latitude, longitude],
    queryFn: () => {
      if (
        latitude === null ||
        latitude === undefined ||
        longitude === null ||
        longitude === undefined
      )
        throw new Error('위도와 경도가 필요합니다');

      return getAirQualityData(latitude, longitude);
    },
    enabled:
      enabled &&
      latitude !== null &&
      latitude !== undefined &&
      longitude !== null &&
      longitude !== undefined,
    staleTime: 30 * 60 * 1000, // 30분
    gcTime: 60 * 60 * 1000, // 1시간
    retry: 1,
  });
}
