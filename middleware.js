import { NextResponse } from "next/server";

export const config = {
  matcher: "/",
};

export async function middleware(request) {
  const { nextUrl: url, geo } = request;

  url.searchParams.set("country", geo.country || "US" );
  url.searchParams.set("city", geo.city || "San Francisco");
  url.searchParams.set("region", geo.region || "CA");
  url.searchParams.set("latitude", geo.latitude || "37.7749");
  url.searchParams.set("longitude", geo.longitude || "-122.4194");

  return NextResponse.rewrite(url);
}
