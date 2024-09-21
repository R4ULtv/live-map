import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use('*', cors()); // Enable CORS for all routes

app.get("/", (c) => c.text("Simple API build with Hono"));

app.get("/online-count", async (c) => {
  const kv = c.env.KV;
  const { keys: onlineUsers } = await kv.list({ prefix: "@live-map:online:" });
  return c.json({ count: onlineUsers.length });
});

app.get("/online-locations", async (c) => {
  const kv = c.env.KV;
  const { keys: onlineUsers } = await kv.list({ prefix: "@live-map:online:" });

  // Fetch locations for each online user
  const locations = await Promise.all(
    onlineUsers.map(async (user) => {
      const location = await kv.get(user.name);
      return location ? JSON.parse(location) : null;
    })
  );

  const uniqueLocations = locations.reduce(
    (unique, item) => (unique.includes(item) ? unique : [...unique, item]),
    []
  );
  return c.json(uniqueLocations);
});

app.post("/add-location", async (c) => {
  const kv = c.env.KV;
  const { requestID, location } = await c.req.json();

  // Store the user's location in the KV store
  await kv.put(`@live-map:online:${requestID}`, JSON.stringify(location), {
    expirationTtl: 60,
  });

  return c.json({
    message: "User added successfully",
    requestID: { requestID },
  });
});

export default {
  fetch: app.fetch,
};
