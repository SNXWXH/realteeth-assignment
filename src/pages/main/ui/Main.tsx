import { useMemo } from 'react';
import { SearchInput } from '@/features/search';
import { FavoriteButton } from '@/features/favorite';
import { CurrentWeather } from '@/widgets/current-weather';
import { WeatherDetails } from '@/widgets/weather-details';
import { HourlyForecast } from '@/widgets/hourly-forecast';
import { WeeklyForecast } from '@/widgets/weekly-forecast';
import { FavoriteWeatherCard } from '@/widgets/favorite-cities';
import { SunInfo } from '@/widgets/sun-info';
import { AirQuality } from '@/widgets/air-quality';
import {
  getWeatherIcon,
  iconCodeToCondition,
  formatTime,
  formatDate,
  getDayName,
  formatSunTime,
  calculateDaylight,
  getAirQualityLevel,
} from '@/shared/lib';
import {
  useFavorites,
  useLocationQuery,
  useWeatherQuery,
  useAirQualityQuery,
} from '@/shared/hooks';

function Main() {
  const {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoriteByCoordinates,
    canAddMore,
  } = useFavorites();

  // 위치 정보 조회
  const { data: locationData, isLoading: isLocationLoading } =
    useLocationQuery();

  // 날씨 데이터 조회
  const { data: weatherData, isLoading: isWeatherLoading } = useWeatherQuery(
    locationData?.latitude,
    locationData?.longitude,
  );

  // 대기질 데이터 조회
  const { data: airQuality, error: airQualityError } = useAirQualityQuery(
    locationData?.latitude,
    locationData?.longitude,
  );

  // 도시 이름 계산
  const cityName = useMemo(() => {
    if (!locationData) return '서울';
    const { city, district, state } = locationData;
    const addressParts = [state, district, city].filter(Boolean);
    return addressParts.length > 0 ? addressParts.join(' ') : '서울';
  }, [locationData]);

  const isLoading = isLocationLoading || isWeatherLoading;

  if (isLoading || !weatherData) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-gray-600'>날씨 정보를 불러오는 중...</div>
      </div>
    );
  }

  const currentWeatherData = {
    city: cityName,
    temperature: Math.round(weatherData.current.temp),
    high: Math.round(weatherData.daily[0].temp.max),
    low: Math.round(weatherData.daily[0].temp.min),
    icon: getWeatherIcon(weatherData.current.icon),
  };

  const weatherDetailsData = {
    feelsLike: Math.round(weatherData.current.feels_like),
    humidity: weatherData.current.humidity,
    windSpeed: weatherData.wind.speed,
  };

  const hourlyData = weatherData.hourly.map((item, index) => ({
    time: index === 0 ? '지금' : formatTime(item.dt),
    temperature: Math.round(item.temp),
    condition: iconCodeToCondition(item.icon),
    percent: Math.round(item.pop * 100),
  }));

  const weeklyData = weatherData.daily.map((item, index) => ({
    day: getDayName(item.dt, index),
    date: formatDate(item.dt),
    condition: iconCodeToCondition(item.icon),
    high: Math.round(item.temp.max),
    low: Math.round(item.temp.min),
    percent: Math.round(item.pop * 100),
  }));

  const sunData = {
    sunrise: formatSunTime(weatherData.sun.sunrise),
    sunset: formatSunTime(weatherData.sun.sunset),
    daylight: calculateDaylight(
      weatherData.sun.sunrise,
      weatherData.sun.sunset,
    ),
  };

  const airQualityDisplayData = airQuality
    ? {
        aqi: Math.round(airQuality.khai),
        level: getAirQualityLevel(airQuality.grade),
        pm25: Math.round(airQuality.pm25),
        pm10: Math.round(airQuality.pm10),
        o3: Math.round(airQuality.o3),
        no2: Math.round(airQuality.no2),
      }
    : null;

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-6 py-8 max-w-7xl'>
        <div className='space-y-8'>
          <div>
            <SearchInput placeholder='동/읍/면을 입력하세요' />
          </div>

          <div className='rounded-lg p-6'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              <div>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-2xl font-bold text-gray-800'>
                    현재 위치
                  </h2>
                  <FavoriteButton
                    isFavorite={
                      locationData
                        ? isFavorite(
                            locationData.latitude,
                            locationData.longitude,
                          )
                        : false
                    }
                    onToggle={() => {
                      if (!locationData) return;

                      const existingFavorite = getFavoriteByCoordinates(
                        locationData.latitude,
                        locationData.longitude,
                      );

                      if (existingFavorite) {
                        removeFavorite(existingFavorite.id);
                      } else {
                        if (!canAddMore) {
                          alert(
                            '최대 6개까지만 즐겨찾기에 추가할 수 있습니다.',
                          );
                          return;
                        }
                        try {
                          addFavorite({
                            name: cityName,
                            latitude: locationData.latitude,
                            longitude: locationData.longitude,
                            city: locationData.city,
                            district: locationData.district,
                            state: locationData.state,
                          });
                        } catch (error) {
                          if (error instanceof Error) {
                            alert(error.message);
                          }
                        }
                      }
                    }}
                    disabled={!locationData}
                  />
                </div>
                <div className='space-y-4'>
                  <CurrentWeather {...currentWeatherData} />
                  <WeatherDetails {...weatherDetailsData} />
                </div>
              </div>

              <div>
                <h2 className='text-2xl font-bold text-gray-800 mb-6'>
                  즐겨찾기 ({favorites.length}/6)
                </h2>
                {favorites.length === 0 ? (
                  <div className='text-center py-12 text-gray-400'>
                    <p>즐겨찾기에 추가된 장소가 없습니다.</p>
                    <p className='text-sm mt-2'>
                      현재 위치 또는 검색한 장소를 즐겨찾기에 추가해보세요.
                    </p>
                  </div>
                ) : (
                  <div className='grid grid-cols-2 gap-2'>
                    {favorites.map((favorite) => (
                      <FavoriteWeatherCard
                        key={favorite.id}
                        favorite={favorite}
                        onDelete={() => {
                          if (
                            window.confirm(
                              `${favorite.name}을(를) 즐겨찾기에서 삭제하시겠습니까?`,
                            )
                          ) {
                            removeFavorite(favorite.id);
                          }
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <HourlyForecast data={hourlyData} />

          <WeeklyForecast data={weeklyData} />

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <SunInfo {...sunData} />
            {airQualityDisplayData ? (
              <AirQuality data={airQualityDisplayData} />
            ) : (
              <div className='bg-white rounded-lg p-6 shadow-sm'>
                <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                  대기질 정보
                </h3>
                <div className='flex items-center justify-center py-12'>
                  <p className='text-gray-500 text-center'>
                    {airQualityError?.message ||
                      '대기질 정보를 불러올 수 없습니다.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
