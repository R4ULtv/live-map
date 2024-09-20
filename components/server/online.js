"use server";

import { kv } from "@vercel/kv";

export async function getOnlineCount() {
  const onlineUsers = await kv.keys("@live-map:online:*");
  return onlineUsers.length;
}
