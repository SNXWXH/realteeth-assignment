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

type SearchLocation = {
  placeId: number;
  displayName: string;
  lat: number;
  lon: number;
  type: string;
};

function CityDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationData = location.state?.locationData as
    | SearchLocation
    | undefined;

  const [cityName, setCityName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [customName, setCustomName] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!locationData) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // displayName을 역순으로 변환함
        const reverseDisplayName = (name: string) => {
          const parts = name.split(',').map((part) => part.trim());
          const filtered = parts.filter(
            (part) => part !== '대한민국' && part !== 'South Korea',
          );
          return filtered.reverse().join(' ');
        };

        setCityName(reverseDisplayName(locationData.displayName));

        const [weather, air] = await Promise.all([
          getWeatherData(locationData.lat, locationData.lon),
          getAirQualityData(locationData.lat, locationData.lon),
        ]);

        setWeatherData(weather);
        setAirQuality(air);
      } catch (error) {
        console.error('날씨 데이터 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [locationData]);

  const handleNameEdit = () => {
    if (isEditingName && customName.trim()) setCityName(customName);
    setIsEditingName(!isEditingName);
  };

  if (loading || !weatherData || !airQuality) {
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

  const airQualityDisplayData = {
    aqi: Math.round(airQuality.khai),
    level: getAirQualityLevel(airQuality.grade),
    pm25: Math.round(airQuality.pm25),
    pm10: Math.round(airQuality.pm10),
    o3: Math.round(airQuality.o3),
    no2: Math.round(airQuality.no2),
  };

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
                    className='text-xl font-bold text-gray-800 border-b-2 border-blue-500 outline-none bg-transparent'
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
              {/* 검색으로 들어온 경우 즐겨찾기 false */}
              <FavoriteButton initialFavorite={!locationData} />
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
            <AirQuality data={airQualityDisplayData} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default CityDetail;
