import { useQuery } from '@tanstack/react-query';
import { getWeatherData, type WeatherData } from '@/shared/api';

export function useWeatherQuery(
  latitude: number | null | undefined,
  longitude: number | null | undefined,
  enabled: boolean = true,
) {
  return useQuery<WeatherData>({
    queryKey: ['weather', latitude, longitude],
    queryFn: () => {
      if (
        latitude === null ||
        latitude === undefined ||
        longitude === null ||
        longitude === undefined
      )
        throw new Error('위도와 경도가 필요합니다');

      return getWeatherData(latitude, longitude);
    },
    enabled:
      enabled &&
      latitude !== null &&
      latitude !== undefined &&
      longitude !== null &&
      longitude !== undefined,
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 30 * 60 * 1000, // 30분
  });
}
