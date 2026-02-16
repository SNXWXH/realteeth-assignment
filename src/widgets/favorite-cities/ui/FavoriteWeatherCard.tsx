import { useNavigate } from 'react-router-dom';
import { FavoriteCityCard } from './FavoriteCityCard.tsx';
import { useWeatherQuery } from '@/features/weather-data';
import { getWeatherIcon, getWeatherConditionKorean } from '@/shared/lib';

type FavoriteData = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

type FavoriteWeatherCardProps = {
  favorite: FavoriteData;
  onDelete: () => void;
};

export function FavoriteWeatherCard({
  favorite,
  onDelete,
}: FavoriteWeatherCardProps) {
  const navigate = useNavigate();
  const { data: weather } = useWeatherQuery(
    favorite.latitude,
    favorite.longitude,
  );

  if (!weather) {
    return (
      <div className='py-3 px-4 bg-white rounded-lg text-center text-gray-400'>
        로딩 중...
      </div>
    );
  }

  return (
    <FavoriteCityCard
      city={favorite.name}
      temperature={Math.round(weather.current.temp)}
      high={Math.round(weather.daily[0].temp.max)}
      low={Math.round(weather.daily[0].temp.min)}
      icon={getWeatherIcon(weather.current.icon)}
      condition={getWeatherConditionKorean(weather.current.icon)}
      onClick={() => {
        navigate('/city/favorite', {
          state: {
            favoriteData: {
              id: favorite.id,
              name: favorite.name,
              latitude: favorite.latitude,
              longitude: favorite.longitude,
            },
          },
        });
      }}
      onDelete={onDelete}
    />
  );
}
