export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return `${date.getHours()}시`;
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

export const getDayName = (timestamp: number, index: number): string => {
  if (index === 0) return '오늘';
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const date = new Date(timestamp * 1000);
  return days[date.getDay()];
};

export const formatSunTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

export const calculateDaylight = (sunrise: number, sunset: number): string => {
  const diff = sunset - sunrise;
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  return `${hours}시간 ${minutes}분`;
};
