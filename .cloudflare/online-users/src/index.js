import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "hono/adapter";

const app = new Hono();

app.use(
  "*",
  cors(
    cors({
      origin: "https://maps.raulcarini.dev",
      allowMethods: ["GET", "POST"],
      allowHeaders: ["Content-Type"],
    })
  )
);

app.get("/", (c) => c.text("Simple API build with Hono"));

app.get("/online-count", async (c) => {
  let time = performance.now();
  const { KV } = env(c);
  const { keys: onlineUsers } = await KV.list({ prefix: "@live-map:online:" });
  return c.json({
    count: onlineUsers.length,
    performance: performance.now() - time,
  });
});

app.get("/online-locations", async (c) => {
  let time = performance.now();
  const { KV } = env(c);
  const { keys: onlineUsers } = await KV.list({ prefix: "@live-map:online:" });

  // Fetch locations for each online user
  const locations = await Promise.all(
    onlineUsers.map(async (user) => {
      const location = await KV.get(user.name);
      if (!location) return null;
      return JSON.parse(location);
    })
  );

  const uniqueLocations = locations.reduce(
    (unique, item) => (unique.includes(item) ? unique : [...unique, item]),
    []
  );
  
  return c.json({
    performance: performance.now() - time,
    count: uniqueLocations.length,
    locations: uniqueLocations,
  });
});

app.post("/add-location", async (c) => {
  let time = performance.now();
  const { KV } = env(c);
  const { requestID, location } = await c.req.json();

  // Store the user's location in the KV store
  await KV.put(`@live-map:online:${requestID}`, JSON.stringify(location), {
    expirationTtl: 60,
  });

  return c.json({
    message: "User added successfully",
    performance: performance.now() - time,
    requestID: { requestID },
  });
});

export default {
  fetch: app.fetch,
};
