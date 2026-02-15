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
  IoSunnyOutline,
  IoPartlySunnyOutline,
  IoCloudyOutline,
  IoRainyOutline,
} from 'react-icons/io5';

const currentWeather = {
  city: '서울',
  temperature: 23,
  high: 28,
  low: 18,
  icon: <IoSunnyOutline className='text-yellow-400' />,
};

const weatherDetails = {
  feelsLike: 25,
  humidity: 65,
  windSpeed: 3.5,
};

const hourlyData = [
  { time: '지금', temperature: 23, condition: 'sunny' as const },
  {
    time: '14시',
    temperature: 25,
    condition: 'sunny' as const,
    percent: 0,
  },
  {
    time: '15시',
    temperature: 26,
    condition: 'snowy' as const,
    percent: 0,
  },
  {
    time: '16시',
    temperature: 27,
    condition: 'cloudy' as const,
    percent: 10,
  },
  {
    time: '17시',
    temperature: 26,
    condition: 'cloudy' as const,
    percent: 20,
  },
  {
    time: '18시',
    temperature: 24,
    condition: 'rainy' as const,
    percent: 60,
  },
  {
    time: '19시',
    temperature: 22,
    condition: 'rainy' as const,
    percent: 80,
  },
  {
    time: '20시',
    temperature: 21,
    condition: 'rainy' as const,
    percent: 70,
  },
  {
    time: '21시',
    temperature: 20,
    condition: 'cloudy' as const,
    percent: 30,
  },
  {
    time: '22시',
    temperature: 19,
    condition: 'cloudy' as const,
    percent: 10,
  },
  {
    time: '23시',
    temperature: 18,
    condition: 'sunny' as const,
    percent: 0,
  },
  {
    time: '00시',
    temperature: 17,
    condition: 'sunny' as const,
    percent: 0,
  },
  {
    time: '18시',
    temperature: 24,
    condition: 'rainy' as const,
    percent: 60,
  },
  {
    time: '19시',
    temperature: 22,
    condition: 'rainy' as const,
    percent: 80,
  },
  {
    time: '20시',
    temperature: 21,
    condition: 'rainy' as const,
    percent: 70,
  },
  {
    time: '21시',
    temperature: 20,
    condition: 'cloudy' as const,
    percent: 30,
  },
  {
    time: '22시',
    temperature: 19,
    condition: 'cloudy' as const,
    percent: 10,
  },
  {
    time: '23시',
    temperature: 18,
    condition: 'sunny' as const,
    percent: 0,
  },
  {
    time: '00시',
    temperature: 17,
    condition: 'sunny' as const,
    percent: 0,
  },
];

const weeklyData = [
  {
    day: '오늘',
    date: '2/15',
    condition: 'sunny' as const,
    high: 28,
    low: 18,
    percent: 0,
  },
  {
    day: '월',
    date: '2/16',
    condition: 'cloudy' as const,
    high: 26,
    low: 17,
    percent: 20,
  },
  {
    day: '화',
    date: '2/17',
    condition: 'rainy' as const,
    high: 22,
    low: 16,
    percent: 80,
  },
  {
    day: '수',
    date: '2/18',
    condition: 'rainy' as const,
    high: 20,
    low: 15,
    percent: 90,
  },
  {
    day: '목',
    date: '2/19',
    condition: 'cloudy' as const,
    high: 23,
    low: 16,
    percent: 30,
  },
  {
    day: '금',
    date: '2/20',
    condition: 'sunny' as const,
    high: 25,
    low: 17,
    percent: 10,
  },
  {
    day: '토',
    date: '2/21',
    condition: 'sunny' as const,
    high: 27,
    low: 18,
    percent: 0,
  },
];

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

const sunData = {
  sunrise: '07:05',
  sunset: '18:40',
  daylight: '11시간 35분',
};

const airQualityData = {
  aqi: 38,
  level: 'good' as const,
  pm25: 10,
  pm10: 25,
  o3: 42,
  no2: 15,
};

function Main() {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-6 py-8 max-w-7xl'>
        <div className='space-y-8'>
          {/* 검색 섹션 */}
          <div>
            <SearchInput placeholder='동/읍/면을 입력하세요' />
          </div>

          {/* 현재 위치 날씨 및 즐겨찾기 */}
          <div className='rounded-lg p-6'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {/* 왼쪽 */}
              <div>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-2xl font-bold text-gray-800'>
                    현재 위치
                  </h2>
                  <FavoriteButton initialFavorite={false} />
                </div>
                <div className='space-y-4'>
                  <CurrentWeather {...currentWeather} />
                  <WeatherDetails {...weatherDetails} />
                </div>
              </div>

              {/* 오른쪽 */}
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

          {/* 시간대별 날씨 */}
          <HourlyForecast data={hourlyData} />

          {/* 일별 예보 */}
          <WeeklyForecast data={weeklyData} />

          {/* 일출/일몰 및 대기질 */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <SunInfo {...sunData} />
            <AirQuality data={airQualityData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
