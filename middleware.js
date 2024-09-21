import { NextResponse } from "next/server";

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
  };
  const requestID = session || crypto.randomUUID();

  url.searchParams.set("country", user.country);
  url.searchParams.set("city", user.city);
  url.searchParams.set("region", user.region);
  url.searchParams.set("latitude", user.latitude);
  url.searchParams.set("longitude", user.longitude);
  url.searchParams.set("requestID", requestID);

  try {
    await fetch(process.env.WORKER_URL + "/add-location", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requestID, location: user }),
    });
  } catch (error) {
    console.error(error);
  }

  if (!session) {
    const response = NextResponse.next();
    response.cookies.set("session", requestID, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  }

  return NextResponse.rewrite(url);
}
