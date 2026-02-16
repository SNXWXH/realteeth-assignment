import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { CurrentWeather } from '@/widgets/current-weather';
import { WeatherDetails } from '@/widgets/weather-details';
import { HourlyForecast } from '@/widgets/hourly-forecast';
import { WeeklyForecast } from '@/widgets/weekly-forecast';
import { SunInfo } from '@/widgets/sun-info';
import { AirQuality } from '@/widgets/air-quality';
import { IoArrowBack } from 'react-icons/io5';
import { Button } from '@/shared/ui';
import { FavoriteButton } from '@/features/favorite';
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
  useWeatherQuery,
  useAirQualityQuery,
} from '@/shared/hooks';

type SearchLocation = {
  placeId: number;
  displayName: string;
  lat: number;
  lon: number;
  type: string;
};

type FavoriteLocationData = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

function CityDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationData = location.state?.locationData as
    | SearchLocation
    | undefined;
  const favoriteData = location.state?.favoriteData as
    | FavoriteLocationData
    | undefined;

  const {
    addFavorite,
    removeFavorite,
    isFavorite: checkIsFavorite,
    getFavoriteByCoordinates,
    canAddMore,
    updateFavoriteName,
  } = useFavorites();

  const [isEditingName, setIsEditingName] = useState(false);
  const [customName, setCustomName] = useState('');

  // 좌표 계산
  const coords = favoriteData
    ? { latitude: favoriteData.latitude, longitude: favoriteData.longitude }
    : locationData
      ? { latitude: locationData.lat, longitude: locationData.lon }
      : null;

  // 날씨 데이터 조회
  const { data: weatherData, isLoading: isWeatherLoading } = useWeatherQuery(
    coords?.latitude,
    coords?.longitude,
  );

  // 대기질 데이터 조회
  const { data: airQuality, error: airQualityError } = useAirQualityQuery(
    coords?.latitude,
    coords?.longitude,
  );

  // 도시 이름 계산
  const getCityName = () => {
    if (favoriteData) return favoriteData.name;
    if (!locationData) return '';

    const reverseDisplayName = (name: string) => {
      const parts = name.split(',').map((part) => part.trim());
      const filtered = parts.filter(
        (part) => part !== '대한민국' && part !== 'South Korea',
      );
      return filtered.reverse().join(' ');
    };

    return reverseDisplayName(locationData.displayName);
  };

  const [cityName, setCityName] = useState(getCityName());

  const handleNameEdit = () => {
    if (isEditingName && customName.trim()) {
      setCityName(customName);
      // 즐겨찾기로 들어온 경우 localStorage 업데이트
      if (favoriteData) updateFavoriteName(favoriteData.id, customName);
    }
    setIsEditingName(!isEditingName);
  };

  if (isWeatherLoading) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-gray-600'>날씨 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-gray-600 text-lg'>
            해당 장소의 정보가 제공되지 않습니다.
          </p>
          <Button
            onClick={() => navigate('/')}
            className='mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
          >
            메인으로 돌아가기
          </Button>
        </div>
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
    <div className='flex flex-col lg:flex-row min-h-screen'>
      {/* 왼쪽 사이드바 */}
      <aside className='w-full lg:w-[30%] bg-white lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto'>
        <div className='p-6 space-y-6'>
          {/* 뒤로가기 버튼 */}
          <Button
            onClick={() => navigate('/')}
            className='p-2 hover:bg-gray-100 rounded-full transition-colors w-fit'
          >
            <IoArrowBack className='text-2xl text-gray-700' />
          </Button>

          {/* 도시명 및 즐겨찾기 */}
          <div>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-2'>
                {isEditingName ? (
                  <input
                    type='text'
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder={cityName}
                    className='text-xl font-bold text-gray-800 border-b-2 border-gray-500 outline-none bg-transparent'
                    autoFocus
                  />
                ) : (
                  <h2 className='text-xl font-semibold text-gray-800'>
                    {cityName}
                  </h2>
                )}
                {/* 검색으로 들어온 경우 수정 버튼 숨기기 */}
                {!locationData && (
                  <button
                    onClick={handleNameEdit}
                    className='text-sm text-blue-600 hover:text-blue-800'
                  >
                    {isEditingName ? '저장' : '수정'}
                  </button>
                )}
              </div>
              <FavoriteButton
                isFavorite={
                  coords
                    ? checkIsFavorite(coords.latitude, coords.longitude)
                    : false
                }
                onToggle={() => {
                  if (!coords) return;

                  const existingFavorite = getFavoriteByCoordinates(
                    coords.latitude,
                    coords.longitude,
                  );

                  if (existingFavorite) {
                    removeFavorite(existingFavorite.id);
                  } else {
                    if (!canAddMore) {
                      alert('최대 6개까지만 즐겨찾기에 추가할 수 있습니다.');
                      return;
                    }
                    try {
                      addFavorite({
                        name: cityName,
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                      });
                    } catch (error) {
                      if (error instanceof Error) {
                        alert(error.message);
                      }
                    }
                  }
                }}
                disabled={!coords}
              />
            </div>

            {/* 현재 날씨 */}
            <CurrentWeather {...currentWeatherData} city={cityName} />

            {/* 체감/습도/바람 */}
            <WeatherDetails {...weatherDetailsData} />
          </div>
        </div>
      </aside>

      {/* 오른쪽 메인 콘텐츠 */}
      <main className='w-full lg:w-[70%] bg-background p-6'>
        <div className='max-w-5xl mx-auto space-y-6'>
          {/* 시간대별 날씨 */}
          <HourlyForecast data={hourlyData} />

          {/* 일별 예보 */}
          <WeeklyForecast data={weeklyData} />

          {/* 일출/일몰 & 대기질 */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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
      </main>
    </div>
  );
}

export default CityDetail;
