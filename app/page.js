import { GraphicsQualityProvider } from "@/components/providers/GraphicsQualityContext";
import CommandMenu from "@/components/ui/CommandMenu";
import Navigation from "@/components/ui/Navigation";
import WorldMap from "@/components/WorldMap";
import clientPromise from "@/lib/mongodb";

export default async function Home({ searchParams }) {
  const requestInfo = searchParams.requestID
    ? {
        country: searchParams.country,
        city: searchParams.city,
        region: searchParams.region,
        latitude: searchParams.latitude,
        longitude: searchParams.longitude,
        createdAt: new Date(),
        requestID: searchParams.requestID,
      }
    : null;

  const client = await clientPromise;
  const db = client.db("production");
  if (requestInfo) {
    const userLocation = await db
      .collection("locations")
      .insertOne({ ...requestInfo });
  }

  const geoData = await db
    .collection("locations")
    .aggregate([
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();

  const min = Math.min(...geoData.map((d) => d.count));
  const max = Math.max(...geoData.map((d) => d.count));

  return (
    <GraphicsQualityProvider>
      <WorldMap
        geoData={geoData}
        min={min}
        max={max}
        requestInfo={requestInfo}
        fetchURL={process.env.WORKER_URL}
      />
      <Navigation fetchURL={process.env.WORKER_URL} />
      <CommandMenu requestInfo={requestInfo} />
    </GraphicsQualityProvider>
  );
}
