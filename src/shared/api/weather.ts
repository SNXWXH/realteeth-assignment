const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export type CurrentWeather = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  description: string;
  icon: string;
};

export type Wind = {
  speed: number;
  deg: number;
};

export type HourlyWeather = {
  dt: number;
  temp: number;
  description: string;
  icon: string;
  pop: number;
};

export type DailyWeather = {
  dt: number;
  temp: {
    min: number;
    max: number;
  };
  description: string;
  icon: string;
  pop: number;
};

export type SunTime = {
  sunrise: number;
  sunset: number;
};

export type WeatherData = {
  current: CurrentWeather;
  wind: Wind;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
  sun: SunTime;
};

type OpenWeatherCurrentResponse = {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
};

type OpenWeatherForecastResponse = {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
    pop: number;
  }>;
};

export async function getWeatherData(
  lat: number,
  lon: number,
): Promise<WeatherData> {
  const [currentRes, forecastRes] = await Promise.all([
    fetch(
      `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=kr`,
    ),
    fetch(
      `${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=kr`,
    ),
  ]);

  if (!currentRes.ok || !forecastRes.ok)
    throw new Error('Failed to fetch weather data');

  const currentData: OpenWeatherCurrentResponse = await currentRes.json();
  const forecastData: OpenWeatherForecastResponse = await forecastRes.json();

  const hourly: HourlyWeather[] = forecastData.list
    .slice(0, 24)
    .map((item) => ({
      dt: item.dt,
      temp: item.main.temp,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      pop: item.pop,
    }));

  const dailyMap = new Map<string, (typeof forecastData.list)[0][]>();
  forecastData.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dailyMap.has(date)) dailyMap.set(date, []);

    dailyMap.get(date)!.push(item);
  });

  const daily: DailyWeather[] = Array.from(dailyMap.entries())
    .slice(0, 7)
    .map(([, items]) => {
      const temps = items.map((item) => item.main.temp);
      const firstItem = items[0];
      return {
        dt: firstItem.dt,
        temp: {
          min: Math.min(...temps),
          max: Math.max(...temps),
        },
        description: firstItem.weather[0].description,
        icon: firstItem.weather[0].icon,
        pop: Math.max(...items.map((item) => item.pop)),
      };
    });

  return {
    current: {
      temp: currentData.main.temp,
      feels_like: currentData.main.feels_like,
      temp_min: currentData.main.temp_min,
      temp_max: currentData.main.temp_max,
      humidity: currentData.main.humidity,
      description: currentData.weather[0].description,
      icon: currentData.weather[0].icon,
    },
    wind: {
      speed: currentData.wind.speed,
      deg: currentData.wind.deg,
    },
    hourly,
    daily,
    sun: {
      sunrise: currentData.sys.sunrise,
      sunset: currentData.sys.sunset,
    },
  };
}
