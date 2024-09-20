import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const config = {
  matcher: "/",
};

export async function middleware(request) {
  const { nextUrl: url, geo } = request;

  const session = request.cookies.get("session")?.value;

  const user = {
    country: geo.country || "US",
    city: geo.city || "San Francisco",
    region: geo.region || "CA",
    latitude: geo.latitude || "37.7749",
    longitude: geo.longitude || "-122.4194",
    requestID: session || crypto.randomUUID(),
  };

  url.searchParams.set("country", user.country);
  url.searchParams.set("city", user.city);
  url.searchParams.set("region", user.region);
  url.searchParams.set("latitude", user.latitude);
  url.searchParams.set("longitude", user.longitude);
  url.searchParams.set("requestID", user.requestID);

  await kv.set(
    `@live-map:online:${user.requestID}`,
    {
      country: user.country,
      city: user.city,
      region: user.region,
      latitude: user.latitude,
      longitude: user.longitude,
    },
    { ex: 60 }
  );

  if (!session) {
    const response = NextResponse.next();
    response.cookies.set("session", user.requestID, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  }

  return NextResponse.rewrite(url);
}
