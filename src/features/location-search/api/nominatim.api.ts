const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

type NominatimResponse = {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon?: string;
};

type SearchLocation = {
  placeId: number;
  displayName: string;
  lat: number;
  lon: number;
  type: string;
};

export const searchLocation = async (
  query: string,
): Promise<SearchLocation[]> => {
  if (!query.trim()) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      addressdetails: '1',
      limit: '10',
      'accept-language': 'ko',
    });

    const response = await fetch(`${NOMINATIM_BASE_URL}/search?${params}`, {
      headers: {
        'User-Agent': 'RealTeeth Assignment App',
      },
    });

    if (!response.ok) {
      if (response.status === 429)
        throw new Error('API 호출이 너무 많습니다. 잠시 후 다시 시도해주세요.');
      if (response.status >= 500)
        throw new Error(
          '위치 검색 서비스가 일시적으로 불안정합니다. 잠시 후 다시 시도해주세요.',
        );

      throw new Error(`위치 검색에 실패했습니다 (상태: ${response.status})`);
    }

    const data: NominatimResponse[] = await response.json();

    return data.map((item) => ({
      placeId: item.place_id,
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      type: item.type,
    }));
  } catch (error) {
    console.error('Nominatim API error:', error);
    return [];
  }
};
