import { Card } from '@/shared/ui';
import { WiSunrise, WiSunset } from 'react-icons/wi';

type SunInfoProps = {
  sunrise: string;
  sunset: string;
  daylight?: string;
};

export const SunInfo = ({ sunrise, sunset, daylight }: SunInfoProps) => {
  return (
    <Card>
      <h3 className='text-lg font-semibold text-gray-800 mb-6'>일출/일몰</h3>
      <div className='flex justify-around items-center mb-6'>
        <div className='text-center'>
          <WiSunrise className='text-6xl text-orange-400 mx-auto mb-2' />
          <p className='text-xs text-gray-500 mb-2'>일출</p>
          <p className='text-xl font-semibold text-gray-900'>{sunrise}</p>
        </div>

        <div className='h-16 w-px bg-gray-200'></div>

        <div className='text-center'>
          <WiSunset className='text-6xl text-orange-600 mx-auto mb-2' />
          <p className='text-xs text-gray-500 mb-2'>일몰</p>
          <p className='text-xl font-semibold text-gray-900'>{sunset}</p>
        </div>
      </div>

      {daylight && (
        <div className='text-center pt-4 border-t border-gray-200'>
          <p className='text-sm text-gray-500 mb-1'>일조 시간</p>
          <p className='text-lg font-semibold text-gray-900'>{daylight}</p>
        </div>
      )}
    </Card>
  );
};
