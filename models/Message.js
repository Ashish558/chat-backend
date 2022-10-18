const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
   {
      chatRoomId: {
         type: String,
      },
      sender: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
      },
      text: {
         type: String,
      },
   },
   { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);