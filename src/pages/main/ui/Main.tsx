import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
  IoSunnyOutline,
  IoPartlySunnyOutline,
  IoCloudyOutline,
  IoRainyOutline,
} from 'react-icons/io5';
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
  formatTime,
  formatDate,
  getDayName,
  formatSunTime,
  calculateDaylight,
  getAirQualityLevel,
} from '@/shared/lib';

const favoriteCities = [
  {
    id: 1,
    city: '부산',
    temperature: 25,
    condition: '구름 조금',
    high: 28,
    low: 20,
    icon: <IoPartlySunnyOutline />,
  },
  {
    id: 2,
    city: '대구',
    temperature: 27,
    condition: '맑음',
    high: 30,
    low: 22,
    icon: <IoSunnyOutline />,
  },
  {
    id: 3,
    city: '인천',
    temperature: 22,
    condition: '흐림',
    high: 24,
    low: 18,
    icon: <IoCloudyOutline />,
  },
  {
    id: 4,
    city: '광주',
    temperature: 24,
    condition: '비',
    high: 26,
    low: 19,
    icon: <IoRainyOutline />,
  },
  {
    id: 5,
    city: '대전',
    temperature: 23,
    condition: '맑음',
    high: 27,
    low: 19,
    icon: <IoSunnyOutline />,
  },
  {
    id: 6,
    city: '울산',
    temperature: 26,
    condition: '구름 조금',
    high: 29,
    low: 21,
    icon: <IoPartlySunnyOutline />,
  },
];

function Main() {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cityName, setCityName] = useState('서울');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const locationData = await getHybridLocation();
        const { latitude, longitude, city, district, state } = locationData;

        const addressParts = [state, district, city].filter(Boolean);
        const detailedAddress =
          addressParts.length > 0 ? addressParts.join(' ') : '서울';

        setCityName(detailedAddress);

        const [weather, air] = await Promise.all([
          getWeatherData(latitude, longitude),
          getAirQualityData(latitude, longitude),
        ]);

        setWeatherData(weather);
        setAirQuality(air);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
                  <FavoriteButton initialFavorite={false} />
                </div>
                <div className='space-y-4'>
                  <CurrentWeather {...currentWeatherData} />
                  <WeatherDetails {...weatherDetailsData} />
                </div>
              </div>

              <div>
                <h2 className='text-2xl font-bold text-gray-800 mb-6'>
                  즐겨찾기
                </h2>
                <div className='grid grid-cols-2 gap-2'>
                  {favoriteCities.map((city) => (
                    <FavoriteCityCard
                      key={city.id}
                      city={city.city}
                      temperature={city.temperature}
                      high={city.high}
                      low={city.low}
                      icon={city.icon}
                      condition={city.condition}
                      onClick={() => navigate(`/city/${city.id}`)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <HourlyForecast data={hourlyData} />

          <WeeklyForecast data={weeklyData} />

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <SunInfo {...sunData} />
            <AirQuality data={airQualityDisplayData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
