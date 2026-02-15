import type { ReactNode } from 'react';
import { Card } from '@/shared/ui';
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from 'react-icons/io';

type FavoriteCityCardProps = {
  city: string;
  temperature: number;
  high: number;
  low: number;
  icon: ReactNode;
  onClick?: () => void;
};

export const FavoriteCityCard = ({
  city,
  temperature,
  high,
  low,
  icon,
  onClick,
}: FavoriteCityCardProps) => {
  return (
    <Card onClick={onClick} className='p-3 hover:shadow-lg'>
      <h3 className='text-sm font-semibold text-gray-700 mb-2'>{city}</h3>
      <div className='flex justify-center mb-2'>
        <div className='text-2xl text-blue-400'>{icon}</div>
      </div>
      <p className='text-xl font-semibold text-gray-900 text-center mb-1'>
        {temperature}
        <span className='text-sm align-text-top'>°</span>
      </p>
      <div className='flex justify-center gap-0.5 text-xs text-gray-400'>
        <IoIosArrowRoundDown className='text-blue-400 text-xl' />
        <span>{low}°</span>
        <IoIosArrowRoundUp className='text-orange-400 text-xl' />
        <span>{high}°</span>
      </div>
    </Card>
  );
};
