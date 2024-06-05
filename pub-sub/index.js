import { createClient } from "redis";

const publisher = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();
const subscriber = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

const publishMessage = (channel, message) => {
  publisher.publish(channel, message);
};

subscriber.pSubscribe("ws-message:*", (message, channel) => {
  console.log("Received message", channel, message);
  const [_, roomId] = channel.split(":");
  console.log(`Received message in room ${roomId}: ${message}`);
  publishMessage(`ps-message:${roomId}`, message);
});

subscriber.pSubscribe("ws-join:*", (message, channel) => {
  const [_, roomId] = channel.split(":");
  console.log(`User joined room ${roomId}: ${message}`);
  publishMessage(`ps-join:${roomId}`, message);
});
