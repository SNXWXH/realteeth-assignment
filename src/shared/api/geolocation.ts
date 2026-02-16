import axios from 'axios';

const API_KEY = import.meta.env.VITE_GEOLOCATION_API_KEY;
const BASE_URL = 'https://api.ipgeolocation.io';

export type GeolocationData = {
  ip: string;
  continent_code: string;
  continent_name: string;
  country_code2: string;
  country_code3: string;
  country_name: string;
  country_capital: string;
  state_prov: string;
  district: string;
  city: string;
  zipcode: string;
  latitude: string;
  longitude: string;
  is_eu: boolean;
  calling_code: string;
  country_tld: string;
  languages: string;
  country_flag: string;
  geoname_id: string;
  isp: string;
  connection_type: string;
  organization: string;
  currency: {
    code: string;
    name: string;
    symbol: string;
  };
  time_zone: {
    name: string;
    offset: number;
    current_time: string;
    current_time_unix: number;
    is_dst: boolean;
    dst_savings: number;
  };
};

export async function getCurrentLocation(): Promise<GeolocationData> {
  if (!API_KEY)
    throw new Error(
      '.env 파일에 VITE_GEOLOCATION_API_KEY가 정의되지 않았습니다',
    );

  try {
    const response = await axios.get<GeolocationData>(`${BASE_URL}/ipgeo`, {
      params: {
        apiKey: API_KEY,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 429)
        throw new Error('API 호출이 너무 많습니다. 잠시 후 다시 시도해주세요.');
      if (status && status >= 500)
        throw new Error(
          '위치 서비스가 일시적으로 불안정합니다. 잠시 후 다시 시도해주세요.',
        );

      throw new Error(
        `위치 정보를 가져오는데 실패했습니다: ${error.response?.data?.message || error.message}`,
      );
    }

    throw error;
  }
}

export async function getLocationByIP(ip: string): Promise<GeolocationData> {
  if (!API_KEY) {
    throw new Error(
      '.env 파일에 VITE_GEOLOCATION_API_KEY가 정의되지 않았습니다',
    );
  }

  try {
    const response = await axios.get<GeolocationData>(`${BASE_URL}/ipgeo`, {
      params: {
        apiKey: API_KEY,
        ip,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 429) {
        throw new Error('API 호출이 너무 많습니다. 잠시 후 다시 시도해주세요.');
      }
      if (status === 401 || status === 403) {
        throw new Error('API 키가 유효하지 않습니다. 관리자에게 문의하세요.');
      }
      if (status && status >= 500) {
        throw new Error(
          '위치 서비스가 일시적으로 불안정합니다. 잠시 후 다시 시도해주세요.',
        );
      }
      throw new Error(
        `IP ${ip}의 위치 정보를 가져오는데 실패했습니다: ${error.response?.data?.message || error.message}`,
      );
    }

    throw error;
  }
}
