import type { ReactNode } from 'react';
import { Card } from '@/shared/ui';
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from 'react-icons/io';
import { FaStar } from 'react-icons/fa';

type FavoriteCityCardProps = {
  city: string;
  temperature: number;
  high: number;
  low: number;
  icon: ReactNode;
  condition: string;
  onClick?: () => void;
  onEdit?: (newName: string) => void;
  onDelete?: () => void;
};

export const FavoriteCityCard = ({
  city,
  temperature,
  high,
  low,
  icon,
  condition,
  onClick,
  onDelete,
}: FavoriteCityCardProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <Card onClick={onClick} className='py-3 px-4 hover:shadow-lg relative'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-sm font-semibold text-gray-700'>{city}</h3>
        {onDelete && (
          <button
            onClick={handleDelete}
            className='text-gray-500 hover:text-gray-600 p-1'
            title='즐겨찾기 해제'
          >
            <FaStar size={16} />
          </button>
        )}
      </div>
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
