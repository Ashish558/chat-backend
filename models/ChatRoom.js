
var mongoose = require('mongoose');

var ChatRoomSchema = new mongoose.Schema(
   {
      admin: String,
      members: {
         type: Array,
      },
      name: {
         type: String,
         required: true
      }
   },
   { timestamps: true }
)


module.exports = mongoose.model("ChatRoom", ChatRoomSchema, "ChatRoom");