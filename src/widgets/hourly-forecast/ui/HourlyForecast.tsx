import { Card } from '@/shared/ui';
import {
  IoSunnyOutline,
  IoCloudyOutline,
  IoRainyOutline,
  IoSnowOutline,
} from 'react-icons/io5';

type HourlyWeatherData = {
  time: string;
  temperature: number;
  // 임시로 해둔거임
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
  percent?: number;
};

type HourlyForecastProps = {
  data: HourlyWeatherData[];
};

const getWeatherIcon = (condition: string) => {
  const iconClass = 'text-4xl';
  switch (condition) {
    case 'sunny':
      return <IoSunnyOutline className={`${iconClass} text-yellow-300`} />;
    case 'cloudy':
      return <IoCloudyOutline className={`${iconClass} text-gray-300`} />;
    case 'rainy':
      return <IoRainyOutline className={`${iconClass} text-blue-400`} />;
    case 'snowy':
      return <IoSnowOutline className={`${iconClass} text-blue-300`} />;
    default:
      return <IoSunnyOutline className={`${iconClass} text-yellow-300`} />;
  }
};

export const HourlyForecast = ({ data }: HourlyForecastProps) => {
  return (
    <Card className='overflow-hidden'>
      <h3 className='text-lg font-semibold text-gray-800 mb-4'>
        시간대별 날씨
      </h3>
      <div className='flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
        {data.map((hour, index) => (
          <div
            key={index}
            className='flex flex-col items-center py-2 px-3 rounded-lg  transition-colors'
          >
            <p className='text-sm text-gray-600 mb-2 font-medium'>
              {hour.time}
            </p>
            <div className='mb-2 text-blue-400'>
              {getWeatherIcon(hour.condition)}
            </div>
            <p className='text-lg font-bold text-gray-900 mb-1'>
              {hour.temperature}
              <span className='text-xs align-text-top'>°</span>
            </p>
            {hour.percent !== undefined && hour.percent > 0 && (
              <p className='text-xs text-blue-500'>{hour.percent}%</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
