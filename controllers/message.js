const Message = require("../models/Message")

const saveMessage = async (req, res) => {

   const { chatRoomId, text } = req.body
   const sender = req.user._id
   try {
      const newMessage = new Message({
         chatRoomId, text, sender
      })
      const savedMessage = await newMessage.save()
      return res.status(200).json(savedMessage)
   }
   catch (err) {
      return res.status(400).json(err)
   }

}

const getMessages = async (req, res) => {

   const roomId = req.params.roomId

   if (!roomId) return res.status(400).json({ message: 'No room id' })

   try {
      Message.find({ chatRoomId: roomId })
         .populate('sender', '_id username')
         .exec((err, data) => {
            if (err) return res.json(err)
           return res.status(200).json(data)
         })
   }
   catch (err) {
      return res.status(400).json(err)
   }

}




module.exports = {
   saveMessage,
   getMessages
}