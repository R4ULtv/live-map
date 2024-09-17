import WorldMap from "@/components/WorldMap";
import { kv } from "@vercel/kv";

export default async function Home() {
  // Fetch all keys matching the "geo:*" pattern
  const [newCursor, keys] = await kv.scan(0, { match: "*" });

  // Fetch data for all keys
  const geoDataPromises = keys.map((key) => kv.get(key));
  const geoData = await Promise.all(geoDataPromises);

  return <WorldMap geoData={geoData} />;
}
