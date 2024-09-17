import Navigation from "@/components/Navigation";
import WorldMap from "@/components/WorldMap";
import clientPromise from "@/lib/mongodb";

export default async function Home({ searchParams }) {
  const requestInfo = {
    country: searchParams.country,
    city: searchParams.city,
    region: searchParams.region,
    latitude: searchParams.latitude,
    longitude: searchParams.longitude,
    createdAt: new Date(),
    requestID: crypto.randomUUID(),
  };

  const client = await clientPromise;
  const db = client.db("production");
  const userLocation = await db
    .collection("locations")
    .insertOne({ ...requestInfo });

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
    <>
      <WorldMap geoData={geoData} min={min} max={max} />
      <Navigation requestInfo={requestInfo} />
    </>
  );
}
