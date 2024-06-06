const { Kafka } = require("kafkajs");
const mongoose = require("mongoose");
const Message = require("./models/Message.js");
const Room = require("./models/Room.js");

const kafka = new Kafka({
  clientId: "chat-app",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "chat-group" });

const processMessage = async (data) => {
  const jsondata = JSON.parse(data);
  const { roomId, text } = jsondata;

  const newMessage = new Message({
    roomId: roomId,
    text,
    user: socket.user.id,
  });

  const room = await Room.findById(roomId);
  room.messages.push(newMessage._id);

  await room.save();
  await newMessage.save();
};

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "chat-messages", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const roomId = message.key.toString();
      const chatMessage = message.value.toString();
      console.log(`Room: ${roomId}, Message: ${chatMessage}`);
    },
  });
};

run().catch(console.error);
