import { useState } from 'react';
import { Button } from '@/shared/ui';
import { CiStar } from 'react-icons/ci';
import { FaStar } from 'react-icons/fa';

type FavoriteButtonProps = {
  initialFavorite?: boolean;
};

export const FavoriteButton = ({
  initialFavorite = false,
}: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  const handleClick = () => {
    setIsFavorite((prev) => !prev);
  };

  return (
    <div className='items-center px-2 py-1 rounded-2xl bg-[#ECEEF2] text-gray-500 text-sm gap-1.5 hover:bg-gray-200'>
      <Button onClick={handleClick}>
        {isFavorite ? <FaStar /> : <CiStar />}
        <label>{isFavorite ? '즐겨찾기 해체' : '즐겨찾기'}</label>
      </Button>
    </div>
  );
};
