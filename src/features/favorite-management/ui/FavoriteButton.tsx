import { Button } from '@/shared/ui';
import { CiStar } from 'react-icons/ci';
import { FaStar } from 'react-icons/fa';

type FavoriteButtonProps = {
  isFavorite: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

export const FavoriteButton = ({
  isFavorite,
  onToggle,
  disabled = false,
}: FavoriteButtonProps) => {
  return (
    <div className='items-center px-2 py-1 rounded-2xl bg-[#ECEEF2] text-gray-500 text-sm gap-1.5 hover:bg-gray-200'>
      <Button onClick={onToggle} disabled={disabled}>
        {isFavorite ? <FaStar /> : <CiStar />}
        <label>{isFavorite ? '즐겨찾기 해제' : '즐겨찾기'}</label>
      </Button>
    </div>
  );
};
