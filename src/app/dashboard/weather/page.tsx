"use client";

import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning } from "lucide-react";

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  dt_txt: string;
}

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getWeather = async (position: GeolocationPosition) => {
      try {
        const response = await fetch(
          `/api/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}`
        );
        const data = await response.json();
        setWeatherData(data.list);
      } catch (err) {
        setError("天気データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    navigator.geolocation.getCurrentPosition(getWeather, () =>
      setError("位置情報の取得に失敗しました")
    );
  }, []);

  const getWeatherIcon = (weatherMain: string) => {
    switch (weatherMain.toLowerCase()) {
      case "clear":
        return <Sun className="w-8 h-8 text-yellow-400" />;
      case "rain":
        return <CloudRain className="w-8 h-8 text-blue-400" />;
      case "snow":
        return <CloudSnow className="w-8 h-8 text-blue-200" />;
      case "thunderstorm":
        return <CloudLightning className="w-8 h-8 text-purple-400" />;
      default:
        return <Cloud className="w-8 h-8 text-gray-400" />;
    }
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">天気予報</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {weatherData && weatherData.length > 0 ? (
          weatherData.slice(0, 6).map((weather, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-medium">
                  {new Date(weather.dt_txt).toLocaleDateString("ja-JP", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                  })}
                </div>
                {getWeatherIcon(weather.weather[0].main)}
              </div>
              <div className="text-2xl font-bold mb-2">
                {Math.round(weather.main.temp)}°C
              </div>
              <div className="text-gray-600">
                {weather.weather[0].description}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                体感温度: {Math.round(weather.main.feels_like)}°C
                <br />
                湿度: {weather.main.humidity}%
              </div>
            </div>
          ))
        ) : (
          <div>読み込み中...</div>
        )}
      </div>
    </div>
  );
}
