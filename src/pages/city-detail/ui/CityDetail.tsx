import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
  getWeatherData,
  getAirQualityData,
  type WeatherData,
  type AirQualityData,
} from '@/shared/api';
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
import { useFavorites } from '@/shared/hooks';

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
  } = useFavorites();

  const [cityName, setCityName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [customName, setCustomName] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentCoords, setCurrentCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [airQualityError, setAirQualityError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (favoriteData) {
        try {
          setLoading(true);
          setAirQualityError(null);
          setCityName(favoriteData.name);
          setCurrentCoords({
            latitude: favoriteData.latitude,
            longitude: favoriteData.longitude,
          });

          const weather = await getWeatherData(
            favoriteData.latitude,
            favoriteData.longitude,
          );
          setWeatherData(weather);

          try {
            const air = await getAirQualityData(
              favoriteData.latitude,
              favoriteData.longitude,
            );
            setAirQuality(air);
          } catch (airError) {
            if (airError instanceof Error) {
              setAirQualityError(airError.message);
            }
            console.error('대기질 데이터 조회 실패:', airError);
          }
        } catch (error) {
          console.error('날씨 데이터 조회 실패:', error);
        } finally {
          setLoading(false);
        }
        return;
      }

      if (!locationData) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setAirQualityError(null);

        // displayName을 역순으로 변환함
        const reverseDisplayName = (name: string) => {
          const parts = name.split(',').map((part) => part.trim());
          const filtered = parts.filter(
            (part) => part !== '대한민국' && part !== 'South Korea',
          );
          return filtered.reverse().join(' ');
        };

        setCityName(reverseDisplayName(locationData.displayName));
        setCurrentCoords({
          latitude: locationData.lat,
          longitude: locationData.lon,
        });

        const weather = await getWeatherData(
          locationData.lat,
          locationData.lon,
        );
        setWeatherData(weather);

        try {
          const air = await getAirQualityData(
            locationData.lat,
            locationData.lon,
          );
          setAirQuality(air);
        } catch (airError) {
          if (airError instanceof Error) {
            setAirQualityError(airError.message);
          }
          console.error('대기질 데이터 조회 실패:', airError);
        }
      } catch (error) {
        console.error('날씨 데이터 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [locationData, favoriteData]);

  const handleNameEdit = () => {
    if (isEditingName && customName.trim()) setCityName(customName);
    setIsEditingName(!isEditingName);
  };

  if (loading) {
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
                  currentCoords
                    ? checkIsFavorite(
                        currentCoords.latitude,
                        currentCoords.longitude,
                      )
                    : false
                }
                onToggle={() => {
                  if (!currentCoords) return;

                  const existingFavorite = getFavoriteByCoordinates(
                    currentCoords.latitude,
                    currentCoords.longitude,
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
                        latitude: currentCoords.latitude,
                        longitude: currentCoords.longitude,
                      });
                    } catch (error) {
                      if (error instanceof Error) {
                        alert(error.message);
                      }
                    }
                  }
                }}
                disabled={!currentCoords}
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
                    {airQualityError || '대기질 정보를 불러올 수 없습니다.'}
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
