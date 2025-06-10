// import mongoose from 'mongoose';

// const chatSchema = new mongoose.Schema({
//   userId: { type: String, required: true },
//   messages: { type: Array, default: [] },
//   createdAt: { type: Date, default: Date.now }
// });

// const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);

// export default Chat;

import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    default: "New Chat"
  },
  messages: [{
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

chatSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Chat || mongoose.model("Chat", chatSchema);