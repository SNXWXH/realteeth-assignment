import { Card } from '@/shared/ui';

type AirQualityLevel =
  | 'good'
  | 'moderate'
  | 'unhealthy'
  | 'veryUnhealthy'
  | 'hazardous';

type AirQualityData = {
  aqi: number;
  level: AirQualityLevel;
  pm25: number;
  pm10: number;
  o3?: number;
  no2?: number;
};

type AirQualityProps = {
  data: AirQualityData;
};

const getAirQualityInfo = (level: AirQualityLevel) => {
  switch (level) {
    case 'good':
      return {
        label: '좋음',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
      };
    case 'moderate':
      return {
        label: '보통',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
      };
    case 'unhealthy':
      return {
        label: '나쁨',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
      };
    case 'veryUnhealthy':
      return {
        label: '매우 나쁨',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
      };
    case 'hazardous':
      return {
        label: '위험',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
      };
    default:
      return {
        label: '알 수 없음',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
      };
  }
};

export const AirQuality = ({ data }: AirQualityProps) => {
  const qualityInfo = getAirQualityInfo(data.level);

  return (
    <Card>
      <h3 className='text-lg font-semibold text-gray-800 mb-4'>대기질 정보</h3>

      <div
        className={`${qualityInfo.bgColor} ${qualityInfo.borderColor} border rounded-lg p-4 mb-4`}
      >
        <div className='flex items-center justify-between mb-2'>
          <p className='text-sm text-gray-600'>대기질 지수</p>
          <span className={`text-sm font-semibold ${qualityInfo.color}`}>
            {qualityInfo.label}
          </span>
        </div>
        <p className={`text-4xl font-bold ${qualityInfo.color}`}>{data.aqi}</p>
      </div>

      <div className='space-y-3'>
        <div className='flex items-center justify-between py-2 border-b border-gray-100'>
          <div>
            <p className='text-sm text-gray-600'>미세먼지 (PM2.5)</p>
            <p className='text-xs text-gray-400 mt-0.5'>초미세먼지</p>
          </div>
          <p className='text-lg font-semibold text-gray-900'>
            {data.pm25} <span className='text-sm text-gray-500'>μg/m³</span>
          </p>
        </div>

        <div className='flex items-center justify-between py-2 border-b border-gray-100'>
          <div>
            <p className='text-sm text-gray-600'>미세먼지 (PM10)</p>
            <p className='text-xs text-gray-400 mt-0.5'>먼지</p>
          </div>
          <p className='text-lg font-semibold text-gray-900'>
            {data.pm10} <span className='text-sm text-gray-500'>μg/m³</span>
          </p>
        </div>
      </div>
    </Card>
  );
};
