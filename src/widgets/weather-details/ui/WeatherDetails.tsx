type WeatherDetailsProps = {
  feelsLike: number;
  humidity: number;
  windSpeed: number;
};

export const WeatherDetails = ({
  feelsLike,
  humidity,
  windSpeed,
}: WeatherDetailsProps) => {
  return (
    <div>
      <div className='grid grid-cols-3 gap-4'>
        <div className='text-center'>
          <p className='text-xs text-gray-500 mb-1'>체감</p>
          <p className='text-lg font-semibold text-gray-900'>{feelsLike}°</p>
        </div>

        <div className='text-center border-x border-gray-200'>
          <p className='text-xs text-gray-500 mb-1'>습도</p>
          <p className='text-lg font-semibold text-gray-900'>{humidity}%</p>
        </div>

        <div className='text-center'>
          <p className='text-xs text-gray-500 mb-1'>바람</p>
          <p className='text-lg font-semibold text-gray-900'>{windSpeed}m/s</p>
        </div>
      </div>
    </div>
  );
};
