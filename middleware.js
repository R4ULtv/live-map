import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const config = {
  matcher: "/",
};

export async function middleware(request) {
  const geo = request.geo;
  const requestId = crypto.randomUUID();

  if (geo) {
    const geoData = {
      city: geo.city,
      country: geo.country,
      region: geo.region,
      latitude: geo.latitude,
      longitude: geo.longitude,
      timestamp: new Date().toISOString(),
    };

    try {
      await kv.set(`geo:${requestId}`, JSON.stringify(geoData));
    } catch (error) {
      console.error(`Failed to store geolocation data: ${error}`);
    }
  }

  return NextResponse.next();
}
