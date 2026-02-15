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
      throw new Error(`HTTP error! status: ${response.status}`);
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
