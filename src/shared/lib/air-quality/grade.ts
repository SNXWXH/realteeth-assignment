export type AirQualityLevel =
  | 'good'
  | 'moderate'
  | 'unhealthy'
  | 'veryUnhealthy'
  | 'hazardous';

export const getAirQualityLevel = (grade: string): AirQualityLevel => {
  if (grade === '1') return 'good';
  if (grade === '2') return 'moderate';
  if (grade === '3') return 'unhealthy';
  if (grade === '4') return 'veryUnhealthy';
  return 'hazardous';
};
