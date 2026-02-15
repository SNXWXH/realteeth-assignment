// import { useParams, useNavigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { useState } from 'react';
import { CurrentWeather } from '@/widgets/current-weather';
import { WeatherDetails } from '@/widgets/weather-details';
import { HourlyForecast } from '@/widgets/hourly-forecast';
import { WeeklyForecast } from '@/widgets/weekly-forecast';
import { SunInfo } from '@/widgets/sun-info';
import { AirQuality } from '@/widgets/air-quality';
import { IoSunnyOutline, IoArrowBack } from 'react-icons/io5';
import { Button } from '@/shared/ui';
import { FavoriteButton } from '@/features/favorite';

const currentWeather = {
  city: '부산',
  temperature: 25,
  high: 28,
  low: 20,
  icon: <IoSunnyOutline className='text-yellow-400' />,
};

const weatherDetails = {
  feelsLike: 27,
  humidity: 70,
  windSpeed: 4.2,
};

const hourlyData = [
  { time: '지금', temperature: 25, condition: 'sunny' as const },
  {
    time: '14시',
    temperature: 26,
    condition: 'sunny' as const,
    percent: 0,
  },
  {
    time: '15시',
    temperature: 27,
    condition: 'sunny' as const,
    percent: 0,
  },
  {
    time: '16시',
    temperature: 28,
    condition: 'cloudy' as const,
    percent: 5,
  },
  {
    time: '17시',
    temperature: 27,
    condition: 'cloudy' as const,
    percent: 10,
  },
  {
    time: '18시',
    temperature: 26,
    condition: 'cloudy' as const,
    percent: 15,
  },
  {
    time: '19시',
    temperature: 24,
    condition: 'cloudy' as const,
    percent: 20,
  },
  {
    time: '20시',
    temperature: 23,
    condition: 'sunny' as const,
    percent: 10,
  },
  {
    time: '21시',
    temperature: 22,
    condition: 'sunny' as const,
    percent: 0,
  },
  {
    time: '22시',
    temperature: 21,
    condition: 'sunny' as const,
    percent: 0,
  },
  {
    time: '23시',
    temperature: 20,
    condition: 'sunny' as const,
    percent: 0,
  },
  {
    time: '00시',
    temperature: 19,
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
    low: 20,
    percent: 0,
  },
  {
    day: '월',
    date: '2/16',
    condition: 'sunny' as const,
    high: 27,
    low: 19,
    percent: 10,
  },
  {
    day: '화',
    date: '2/17',
    condition: 'cloudy' as const,
    high: 25,
    low: 18,
    percent: 30,
  },
  {
    day: '수',
    date: '2/18',
    condition: 'cloudy' as const,
    high: 24,
    low: 17,
    percent: 40,
  },
  {
    day: '목',
    date: '2/19',
    condition: 'sunny' as const,
    high: 26,
    low: 19,
    percent: 20,
  },
  {
    day: '금',
    date: '2/20',
    condition: 'sunny' as const,
    high: 28,
    low: 20,
    percent: 5,
  },
  {
    day: '토',
    date: '2/21',
    condition: 'sunny' as const,
    high: 29,
    low: 21,
    percent: 0,
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

function CityDetail() {
  // const { cityId } = useParams();
  const navigate = useNavigate();
  const [cityName, setCityName] = useState('부산');
  const [isEditingName, setIsEditingName] = useState(false);
  const [customName, setCustomName] = useState('');

  const handleNameEdit = () => {
    if (isEditingName && customName.trim()) setCityName(customName);
    setIsEditingName(!isEditingName);
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
                <button
                  onClick={handleNameEdit}
                  className='text-sm text-blue-600 hover:text-blue-800'
                >
                  {isEditingName ? '저장' : '수정'}
                </button>
              </div>
              <FavoriteButton initialFavorite={true} />
            </div>

            {/* 현재 날씨 */}
            <CurrentWeather {...currentWeather} city={cityName} />

            {/* 체감/습도/바람 */}
            <WeatherDetails {...weatherDetails} />
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
            <AirQuality data={airQualityData} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default CityDetail;
