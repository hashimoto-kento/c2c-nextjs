import { NextResponse } from "next/server";

const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return new NextResponse("Missing coordinates", { status: 400 });
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=ja`
  );

  const data = await response.json();
  return NextResponse.json(data);
}
