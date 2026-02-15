import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchInput } from '@/features/search';
import { FavoriteButton } from '@/features/favorite';
import { CurrentWeather } from '@/widgets/current-weather';
import { WeatherDetails } from '@/widgets/weather-details';
import { HourlyForecast } from '@/widgets/hourly-forecast';
import { WeeklyForecast } from '@/widgets/weekly-forecast';
import { FavoriteCityCard } from '@/widgets/favorite-cities';
import { SunInfo } from '@/widgets/sun-info';
import { AirQuality } from '@/widgets/air-quality';
import {
  getHybridLocation,
  getWeatherData,
  getAirQualityData,
  type WeatherData,
  type AirQualityData,
} from '@/shared/api';
import {
  getWeatherIcon,
  iconCodeToCondition,
  getWeatherConditionKorean,
  formatTime,
  formatDate,
  getDayName,
  formatSunTime,
  calculateDaylight,
  getAirQualityLevel,
} from '@/shared/lib';
import { useFavorites } from '@/shared/hooks';

function Main() {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cityName, setCityName] = useState('서울');
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    city?: string;
    district?: string;
    state?: string;
  } | null>(null);

  const {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoriteByCoordinates,
    canAddMore,
  } = useFavorites();

  const [favoriteWeatherData, setFavoriteWeatherData] = useState<
    Map<string, WeatherData>
  >(new Map());
  const [airQualityError, setAirQualityError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setAirQualityError(null);
        const locationData = await getHybridLocation();
        const { latitude, longitude, city, district, state } = locationData;

        setCurrentLocation(locationData);

        const addressParts = [state, district, city].filter(Boolean);
        const detailedAddress =
          addressParts.length > 0 ? addressParts.join(' ') : '서울';

        setCityName(detailedAddress);

        const weather = await getWeatherData(latitude, longitude);
        setWeatherData(weather);

        try {
          const air = await getAirQualityData(latitude, longitude);
          setAirQuality(air);
        } catch (airError) {
          if (airError instanceof Error) {
            setAirQualityError(airError.message);
          }
          console.error('대기질 데이터 조회 실패:', airError);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchFavoriteWeather = async () => {
      const newWeatherData = new Map<string, WeatherData>();

      for (const favorite of favorites) {
        try {
          const weather = await getWeatherData(
            favorite.latitude,
            favorite.longitude,
          );
          newWeatherData.set(favorite.id, weather);
        } catch (error) {
          console.error(`Failed to fetch weather for ${favorite.name}:`, error);
        }
      }

      setFavoriteWeatherData(newWeatherData);
    };

    if (favorites.length > 0) fetchFavoriteWeather();
  }, [favorites]);

  if (loading || !weatherData) {
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
                      currentLocation
                        ? isFavorite(
                            currentLocation.latitude,
                            currentLocation.longitude,
                          )
                        : false
                    }
                    onToggle={() => {
                      if (!currentLocation) return;

                      const existingFavorite = getFavoriteByCoordinates(
                        currentLocation.latitude,
                        currentLocation.longitude,
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
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude,
                            city: currentLocation.city,
                            district: currentLocation.district,
                            state: currentLocation.state,
                          });
                        } catch (error) {
                          if (error instanceof Error) {
                            alert(error.message);
                          }
                        }
                      }
                    }}
                    disabled={!currentLocation}
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
                    {favorites.map((favorite) => {
                      const weather = favoriteWeatherData.get(favorite.id);
                      if (!weather) {
                        return (
                          <div
                            key={favorite.id}
                            className='py-3 px-4 bg-white rounded-lg text-center text-gray-400'
                          >
                            로딩 중...
                          </div>
                        );
                      }

                      return (
                        <FavoriteCityCard
                          key={favorite.id}
                          city={favorite.name}
                          temperature={Math.round(weather.current.temp)}
                          high={Math.round(weather.daily[0].temp.max)}
                          low={Math.round(weather.daily[0].temp.min)}
                          icon={getWeatherIcon(weather.current.icon)}
                          condition={getWeatherConditionKorean(
                            weather.current.icon,
                          )}
                          onClick={() => {
                            navigate('/city/favorite', {
                              state: {
                                favoriteData: {
                                  id: favorite.id,
                                  name: favorite.name,
                                  latitude: favorite.latitude,
                                  longitude: favorite.longitude,
                                },
                              },
                            });
                          }}
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
                      );
                    })}
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
                    {airQualityError ||
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
