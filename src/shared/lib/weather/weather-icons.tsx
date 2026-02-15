import {
  IoSunnyOutline,
  IoPartlySunnyOutline,
  IoCloudyOutline,
  IoRainyOutline,
} from 'react-icons/io5';

type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy';

export const getWeatherIcon = (iconCode: string) => {
  if (!iconCode) {
    return <IoCloudyOutline className='text-gray-400' />;
  }
  if (iconCode.startsWith('01'))
    return <IoSunnyOutline className='text-yellow-400' />;
  if (iconCode.startsWith('02') || iconCode.startsWith('03'))
    return <IoPartlySunnyOutline className='text-gray-400' />;
  if (iconCode.startsWith('04'))
    return <IoCloudyOutline className='text-gray-500' />;
  if (iconCode.startsWith('09') || iconCode.startsWith('10'))
    return <IoRainyOutline className='text-blue-500' />;
  return <IoCloudyOutline className='text-gray-400' />;
};

export const iconCodeToCondition = (iconCode: string): WeatherCondition => {
  if (!iconCode) {
    return 'cloudy';
  }
  if (iconCode.startsWith('01')) return 'sunny';
  if (iconCode.startsWith('02') || iconCode.startsWith('03')) return 'sunny';
  if (iconCode.startsWith('04')) return 'cloudy';
  if (
    iconCode.startsWith('09') ||
    iconCode.startsWith('10') ||
    iconCode.startsWith('11')
  )
    return 'rainy';
  if (iconCode.startsWith('13')) return 'snowy';
  return 'cloudy';
};
