import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  roomId: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  text: String,
  timestamp: Date,
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
