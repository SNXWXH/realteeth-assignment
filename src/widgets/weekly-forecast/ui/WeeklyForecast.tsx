import { Card } from '@/shared/ui';
import { getWeatherIconByCondition } from '@/shared/lib';

type DailyWeatherData = {
  day: string;
  date: string;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
  high: number;
  low: number;
  percent?: number;
};

type WeeklyForecastProps = {
  data: DailyWeatherData[];
};

export const WeeklyForecast = ({ data }: WeeklyForecastProps) => {
  return (
    <Card className='overflow-hidden'>
      <h3 className='text-lg font-semibold text-gray-800 mb-4'>일별 예보</h3>
      <div className='flex justify-between overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
        {data.map((day, index) => (
          <div
            key={index}
            className='flex flex-col items-center py-3 flex-1 rounded-lg'
          >
            <p className='text-sm font-semibold text-gray-800 mb-1'>
              {day.day}
            </p>
            <p className='text-xs text-gray-500 mb-2'>{day.date}</p>
            <div className='mb-2'>
              {getWeatherIconByCondition({ condition: day.condition })}
            </div>
            <p className='text-xs text-blue-500 mb-2 h-4'>
              {day.percent !== undefined && day.percent > 0
                ? `${day.percent}%`
                : ''}
            </p>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-900 font-semibold'>
                {day.high}°
              </span>
              <span className='text-sm text-gray-500'>{day.low}°</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
