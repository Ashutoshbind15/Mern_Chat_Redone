import redis from "redis";

const publisher = redis.createClient();
const subscriber = redis.createClient();

const publishMessage = (channel, message) => {
  publisher.publish(channel, message, (err, reply) => {
    if (err) {
      console.error("Error publishing message:", err);
    } else {
      console.log(`Message published to channel ${channel}: ${message}`);
    }
  });
};

const listener = (channel, message) => {
  console.log(`Received message: ${message}`);
};

subscriber.pSubscribe("ws-message:*", (channel, message) => {
  const [_, roomId] = channel.split(":");
  console.log(`Received message in room ${roomId}: ${message}`);
  publishMessage(`ps-message:${roomId}`, message);
});

subscriber.pSubscribe("ws-join:*", (channel, message) => {
  const [_, roomId] = channel.split(":");
  console.log(`User joined room ${roomId}: ${message}`);
  publishMessage(`ps-join:${roomId}`, `User joined room ${roomId}: ${message}`);
});
