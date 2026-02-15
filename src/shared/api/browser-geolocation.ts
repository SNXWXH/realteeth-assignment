export type BrowserGeolocationResult = {
  latitude: number;
  longitude: number;
  accuracy: number;
  source: 'browser';
};

export type GeolocationError = {
  code: number;
  message: string;
};

export async function getBrowserLocation(
  options?: PositionOptions,
): Promise<BrowserGeolocationResult> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('해당 브라우저는 Geolocation을 지원하지 않습니다'));
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
