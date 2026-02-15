import {
  IoSunnyOutline,
  IoCloudyOutline,
  IoRainyOutline,
  IoSnowOutline,
} from 'react-icons/io5';

type GetWeatherIconOptions = {
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
};

export const getWeatherIconByCondition = ({
  condition,
}: GetWeatherIconOptions) => {
  switch (condition) {
    case 'sunny':
      return <IoSunnyOutline className={` text-4xl text-yellow-300`} />;
    case 'cloudy':
      return <IoCloudyOutline className={` text-4xl text-gray-300`} />;
    case 'rainy':
      return <IoRainyOutline className={` text-4xl text-blue-400`} />;
    case 'snowy':
      return <IoSnowOutline className={` text-4xl text-blue-300`} />;
    default:
      return <IoSunnyOutline className={` text-4xl text-yellow-300`} />;
  }
};
