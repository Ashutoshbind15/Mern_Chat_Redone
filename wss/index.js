import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
// import Message from "./models/Message.js";

const io = new Server(8080, {
  cors: {
    origin: "*",
  },
});

const secretKey = process.env.JWT_SECRET || "secret"; // Same secret key as in the PBS
mongoose.connect("mongodb://localhost:27017/prim");

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

    socket.to(room).emit("newuserjoins", {
      user: socket.user.username,
    });
  });
});

console.log("WebSocket server listening on port 8080");
