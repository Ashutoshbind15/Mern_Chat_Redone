const { Kafka } = require("kafkajs");
const mongoose = require("mongoose");
const Message = require("./models/Message.js");
const Room = require("./models/Room.js");
const dotenv = require("dotenv");

dotenv.config();

let kafka;

if (process.env.NODE_ENV !== "production") {
  kafka = new Kafka({
    clientId: "chat-app",
    brokers: ["localhost:9092"],
  });
} else {
  kafka = new Kafka({
    clientId: "chat-app",
    brokers: [process.env.KAFKA_BROKER],
  });
}

const consumer = kafka.consumer({ groupId: "chat-group" });

mongoose.connect("mongodb://localhost:27017/prim");

const processMessage = async (data) => {
  const jsondata = JSON.parse(data);
  const newMessage = new Message(jsondata);
  const { roomId } = jsondata;

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
      const key = message.key.toString("utf-8");
      const value = message.value.toString("utf-8");

      processMessage(value);
    },
  });
};

run().catch(console.error);
