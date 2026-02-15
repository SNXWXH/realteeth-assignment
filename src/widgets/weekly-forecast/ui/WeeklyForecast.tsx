import { Card } from '@/shared/ui';
import { getWeatherIcon } from '@/shared/lib';

type DailyWeatherData = {
  day: string;
  date: string;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
  high: number;
  low: number;
  precipitation?: number;
};

type WeeklyForecastProps = {
  data: DailyWeatherData[];
};

export const WeeklyForecast = ({ data }: WeeklyForecastProps) => {
  return (
    <Card>
      <h3 className='text-lg font-semibold text-gray-800 mb-4'>일별 예보</h3>
      <div className='space-y-3'>
        {data.map((day, index) => (
          <div
            key={index}
            className='flex items-center justify-between py-3 px-2 rounded-lg'
          >
            <div className='flex items-center gap-4 flex-1'>
              <p className='text-sm font-semibold text-gray-800 w-12'>
                {day.day}
              </p>
              <p className='text-xs text-gray-500 w-16'>{day.date}</p>
              <div className='flex items-center gap-2'>
                {getWeatherIcon({ condition: day.condition })}
                {day.precipitation !== undefined && day.precipitation > 0 && (
                  <span className='text-xs text-blue-500'>
                    {day.precipitation}%
                  </span>
                )}
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-900 font-semibold'>
                  {day.high}°
                </span>
                <span className='text-sm text-gray-500'>{day.low}°</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
