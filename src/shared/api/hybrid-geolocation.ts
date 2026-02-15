import axios from 'axios';

const API_KEY = import.meta.env.VITE_GEOLOCATION_API_KEY;
const BASE_URL = 'https://api.ipgeolocation.io';
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

type NominatimResult = {
  address: {
    road?: string;
    suburb?: string;
    city?: string;
    county?: string;
    state?: string;
    country?: string;
    country_code?: string;
    [key: string]: string | undefined;
  };
};

type GeolocationData = {
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

type BrowserGeolocationResult = {
  latitude: number;
  longitude: number;
  accuracy: number;
  source: 'browser';
};

type GeolocationError = {
  code: number;
  message: string;
};

export type HybridLocationResult = {
  latitude: number;
  longitude: number;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  source: 'browser' | 'ip';
  accuracy?: number;
  fullData?: GeolocationData | BrowserGeolocationResult;
};

async function getBrowserLocation(
  options?: PositionOptions,
): Promise<BrowserGeolocationResult> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('이 브라우저는 Geolocation을 지원하지 않습니다'));
      return;
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 27000,

      ...options,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          source: 'browser',
        });
      },
      (error) => {
        let message = '위치 정보를 가져오는데 실패했습니다';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = '사용자가 위치 정보 요청을 거부했습니다';
            break;
          case error.POSITION_UNAVAILABLE:
            message = '위치 정보를 사용할 수 없습니다';
            break;
          case error.TIMEOUT:
            message = '위치 정보 요청 시간이 초과되었습니다';
            break;
        }

        reject({
          code: error.code,
          message,
        } as GeolocationError);
      },
      defaultOptions,
    );
  });
}

async function getCurrentLocationByIP(): Promise<GeolocationData> {
  if (!API_KEY) {
    throw new Error(
      '.env 파일에 VITE_GEOLOCATION_API_KEY가 정의되지 않았습니다',
    );
  }

  try {
    const response = await axios.get<GeolocationData>(`${BASE_URL}/ipgeo`, {
      params: {
        apiKey: API_KEY,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `위치 정보를 가져오는데 실패했습니다: ${error.response?.data?.message || error.message}`,
      );
    }
    throw error;
  }
}

async function reverseGeocodeNominatim(
  lat: number,
  lon: number,
): Promise<NominatimResult | null> {
  try {
    const response = await axios.get<NominatimResult>(
      `${NOMINATIM_BASE_URL}/reverse`,
      {
        params: {
          lat,
          lon,
          format: 'json',
          addressdetails: 1,
          'accept-language': 'ko',
        },
        headers: {
          'User-Agent': 'WeatherApp/1.0',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Nominatim 역지오코딩 오류:', error);
    return null;
  }
}

export async function getHybridLocation(): Promise<HybridLocationResult> {
  try {
    const browserLocation = await getBrowserLocation();

    try {
      const nominatimResult = await reverseGeocodeNominatim(
        browserLocation.latitude,
        browserLocation.longitude,
      );

      if (nominatimResult?.address) {
        const addr = nominatimResult.address;

        return {
          latitude: browserLocation.latitude,
          longitude: browserLocation.longitude,
          city: addr.suburb,
          district: addr.city || addr.county,
          state: addr.state,
          country: addr.country,
          source: 'browser',
          accuracy: browserLocation.accuracy,
          fullData: browserLocation,
        };
      }
    } catch (geocodingError) {
      console.warn('역지오코딩 실패:', geocodingError);
    }

    return {
      latitude: browserLocation.latitude,
      longitude: browserLocation.longitude,
      source: 'browser',
      accuracy: browserLocation.accuracy,
      fullData: browserLocation,
    };
  } catch {
    try {
      const ipLocation = await getCurrentLocationByIP();

      return {
        latitude: parseFloat(ipLocation.latitude),
        longitude: parseFloat(ipLocation.longitude),
        city: ipLocation.city,
        district: ipLocation.district,
        state: ipLocation.state_prov,
        country: ipLocation.country_name,
        source: 'ip',
        fullData: ipLocation,
      };
    } catch {
      throw new Error(
        '브라우저 및 IP 기반 방식 모두 위치 정보를 가져오는데 실패했습니다',
      );
    }
  }
}

