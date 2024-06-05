import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  roomId: String,
  user: String,
  text: String,
  timestamp: Date,
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
