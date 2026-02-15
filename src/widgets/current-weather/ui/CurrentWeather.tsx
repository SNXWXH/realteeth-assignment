import type { ReactNode } from 'react';
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from 'react-icons/io';

type CurrentWeatherProps = {
  city: string;
  temperature: number;
  high: number;
  low: number;
  icon: ReactNode;
};

export const CurrentWeather = ({
  city,
  temperature,
  high,
  low,
  icon,
}: CurrentWeatherProps) => {
  return (
    <div>
      <div className='text-center py-4'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-4'>{city}</h2>
        <div className='flex justify-center text-5xl mb-4'>{icon}</div>
        <div className='text-7xl font-semibold text-gray-900 mb-4'>
          {temperature}
          <span className='text-3xl align-text-top'>°</span>
        </div>
        <div className='flex justify-center gap-6 text-sm text-gray-600'>
          <div className='flex items-center gap-1'>
            <IoIosArrowRoundDown className='text-blue-500 text-xl' />
            <span className='text-xs text-gray-400'>최저</span>
            <span className='font-semibold'>{low}°</span>
          </div>
          <div className='flex items-center gap-1'>
            <IoIosArrowRoundUp className='text-orange-600 text-xl' />
            <span className='text-xs text-gray-400'>최고</span>
            <span className='font-semibold'>{high}°</span>
          </div>
        </div>
      </div>
    </div>
  );
};
