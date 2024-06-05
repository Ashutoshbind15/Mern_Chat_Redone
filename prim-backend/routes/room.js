import express from "express";
import Room from "../models/Room.js";
import User from "../models/User.js";
import Message from "../models/Message.js";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).send(room);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find().populate({
      path: "users",
      model: User,
      select: "username",
    });
    res.send(rooms);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate({
      path: "messages",
      model: Message,
      populate: {
        path: "user",
        model: User,
        select: "username",
      },
    });
    if (!room) {
      return res.status(404).send("Room not found");
    }

    res.send({
      ...room._doc,
      messages: room.messages.map((msg) => ({
        ...msg._doc,
        user: msg.user.username,
      })),
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate({
      path: "messages",
      model: Message,
    });
    res.send(room);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
