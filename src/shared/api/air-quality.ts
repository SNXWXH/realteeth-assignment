const AIR_KOREA_API_KEY = import.meta.env.VITE_AIR_KOREA_API_KEY;
const AIR_KOREA_BASE_URL =
  'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc';

export type AirQualityData = {
  grade: string;
  khai: number;
  pm10: number;
  pm25: number;
  o3: number;
  no2: number;
  co: number;
  so2: number;
};

type AirKoreaResponse = {
  response: {
    body: {
      items: Array<{
        khaiGrade: string;
        khaiValue: string;
        pm10Value: string;
        pm10Grade: string;
        pm25Value?: string;
        pm25Grade?: string;
        o3Value: string;
        no2Value: string;
        coValue: string;
        so2Value: string;
      }>;
    };
  };
};

function getStationName(lat: number, lon: number): string {
  const stations = [
    { name: '종로구', lat: 37.572, lon: 126.9794 },
    { name: '중구', lat: 37.5641, lon: 126.9979 },
    { name: '용산구', lat: 37.5384, lon: 126.9654 },
    { name: '성동구', lat: 37.5506, lon: 127.0409 },
    { name: '광진구', lat: 37.5481, lon: 127.0857 },
    { name: '동대문구', lat: 37.5838, lon: 127.0507 },
    { name: '중랑구', lat: 37.5952, lon: 127.093 },
    { name: '성북구', lat: 37.6023, lon: 127.0177 },
    { name: '강북구', lat: 37.6469, lon: 127.0147 },
    { name: '도봉구', lat: 37.6688, lon: 127.0471 },
    { name: '노원구', lat: 37.6541, lon: 127.0746 },
    { name: '은평구', lat: 37.6176, lon: 126.9227 },
    { name: '서대문구', lat: 37.5791, lon: 126.9368 },
    { name: '마포구', lat: 37.5622, lon: 126.9086 },
    { name: '양천구', lat: 37.527, lon: 126.8561 },
    { name: '강서구', lat: 37.5657, lon: 126.8227 },
    { name: '구로구', lat: 37.4954, lon: 126.8574 },
    { name: '금천구', lat: 37.46, lon: 126.9006 },
    { name: '영등포구', lat: 37.5264, lon: 126.8963 },
    { name: '동작구', lat: 37.5, lon: 126.9535 },
    { name: '관악구', lat: 37.4653, lon: 126.944 },
    { name: '서초구', lat: 37.4769, lon: 127.0317 },
    { name: '강남구', lat: 37.4979, lon: 127.0276 },
    { name: '송파구', lat: 37.5048, lon: 127.0927 },
    { name: '강동구', lat: 37.5502, lon: 127.1462 },
  ];

  let nearest = stations[0];
  let minDistance = Number.MAX_VALUE;

  for (const station of stations) {
    const distance = Math.sqrt(
      Math.pow(lat - station.lat, 2) + Math.pow(lon - station.lon, 2),
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearest = station;
    }
  }

  return nearest.name;
}

export async function getAirQualityData(
  lat: number,
  lon: number,
): Promise<AirQualityData> {
  const stationName = getStationName(lat, lon);

  const url = `${AIR_KOREA_BASE_URL}/getMsrstnAcctoRltmMesureDnsty?stationName=${encodeURIComponent(
    stationName,
  )}&dataTerm=DAILY&pageNo=1&numOfRows=1&returnType=json&serviceKey=${AIR_KOREA_API_KEY}`;

  const res = await fetch(url);

  if (!res.ok) throw new Error('대기질 데이터를 패치하는데 실패했습니다');

  const data: AirKoreaResponse = await res.json();

  const item = data.response.body.items[0];

  const pm25 = item.pm25Value
    ? parseFloat(item.pm25Value)
    : parseFloat(item.pm10Value) * 0.6;

  return {
    grade: item.khaiGrade || '알 수 없음',
    khai: parseFloat(item.khaiValue) || 0,
    pm10: parseFloat(item.pm10Value) || 0,
    pm25: pm25 || 0,
    o3: parseFloat(item.o3Value) || 0,
    no2: parseFloat(item.no2Value) || 0,
    co: parseFloat(item.coValue) || 0,
    so2: parseFloat(item.so2Value) || 0,
  };
}
