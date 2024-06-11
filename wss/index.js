import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { createClient } from "redis";
import { Partitioners, Kafka } from "kafkajs";

import dotenv from "dotenv";
dotenv.config();

let kafka;

if (process.env.NODE_ENV !== "production") {
  kafka = new Kafka({
    clientId: "chat-app",
    brokers: ["localhost:9092"],
  });
} else {
  console.log("Connecting to Kafka broker:");
  kafka = new Kafka({
    clientId: "chat-app",
    brokers: [process.env.KAFKA_BROKER],
  });
}

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

await producer.connect();

const sendMessageKafka = async (roomId, message) => {
  await producer.send({
    topic: "chat-messages",
    messages: [{ key: roomId, value: message }],
  });
};

const publisher = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();
const subscriber = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

const publishMessage = (channel, message) => {
  publisher.publish(channel, message);
};

const io = new Server(8080, {
  cors: {
    origin: "*",
  },
});

const secretKey = process.env.JWT_SECRET || "secret"; // Same secret key as in the PBS
mongoose.connect("mongodb://localhost:27017/prim");

subscriber.pSubscribe("message:*", (message, channel) => {
  const [_, roomId] = channel.split(":");
  console.log(`Received message in room ${roomId}: ${message}`);
  io.to(roomId).emit("messagereceive", JSON.parse(message));
});

subscriber.pSubscribe("join:*", (message, channel) => {
  const [_, roomId] = channel.split(":");
  console.log(`User joined room ${roomId}: ${message}`);
  io.to(roomId).emit("newuserjoins", JSON.parse(message));
});

io.use((socket, next) => {
  const token = socket.handshake.query.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return next(new Error("Authentication error"));
    }
    socket.user = decoded;
    next();
  });
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.user.username);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.user.username);
  });

  socket.on("joinroom", (room) => {
    socket.join(room);

    console.log(`User ${socket.user.username} joined room ${room}`);

    // socket.to(room).emit("newuserjoins", {
    //   user: socket.user.username,
    // });

    publishMessage(
      `join:${room}`,
      JSON.stringify({
        user: socket.user.username,
      })
    );
  });

  socket.on("messagesend", async (data) => {
    const { roomId, text } = data;

    // const newMessage = new Message({
    //   roomId: roomId,
    //   text,
    //   user: socket.user.id,
    // });

    // const room = await Room.findById(roomId);
    // room.messages.push(newMessage._id);

    // await room.save();
    // await newMessage.save();

    const msgData = {
      roomId: roomId,
      text,
      user: socket.user.id,
    };

    sendMessageKafka(roomId, JSON.stringify(msgData));
    console.log(
      `User ${socket.user.username} sent message in room ${roomId} to Kafka`
    );

    // io.to(roomId).emit("messagereceive", {
    //   user: socket.user.username,
    //   text: text,
    // });

    publishMessage(
      `message:${roomId}`,
      JSON.stringify({
        user: socket.user.username,
        text: text,
      })
    );
  });
});

console.log("WebSocket server listening on port 8080");
