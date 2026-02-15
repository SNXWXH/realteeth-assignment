import type { ReactNode } from 'react';
import { Card } from '@/shared/ui';
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from 'react-icons/io';

type FavoriteCityCardProps = {
  city: string;
  temperature: number;
  high: number;
  low: number;
  icon: ReactNode;
  condition: string;
  onClick?: () => void;
};

export const FavoriteCityCard = ({
  city,
  temperature,
  high,
  low,
  icon,
  condition,
  onClick,
}: FavoriteCityCardProps) => {
  return (
    <Card onClick={onClick} className='py-3 px-4 hover:shadow-lg'>
      <h3 className='text-sm font-semibold text-gray-700 mb-6'>{city}</h3>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='text-3xl text-blue-400'>{icon}</div>
          <p className='text-2xl font-semibold text-gray-900'>
            {temperature}
            <span className='text-lg align-text-top'>°</span>
          </p>
        </div>
        <div className='flex items-center gap-1 text-sm text-gray-600'>
          <IoIosArrowRoundUp className='text-orange-400 text-xl' />
          <span>{high}°</span>
          <IoIosArrowRoundDown className='text-blue-400 text-xl' />
          <span>{low}°</span>
        </div>
      </div>
      <p className='text-xs text-gray-400 mt-2'>{condition}</p>
    </Card>
  );
};
