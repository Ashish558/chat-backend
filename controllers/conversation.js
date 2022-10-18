

const ChatRoom = require('../models/ChatRoom')

//start new convo
const createNewChatRoom = async (req, res) => {
   const { name } = req.body
   const creator = req.user._id
   const newChatRoom = new ChatRoom({
      admin: creator,
      members: [creator],
      name: name
   })
   try {
      const savedChatRoom = await newChatRoom.save()
      return res.status(200).json(savedChatRoom)
   }
   catch (err) {
      return res.status(400).json(err)
   }
}

const addNewMember = async (req, res) => {
   const memberId = req.user._id
   // console.log(memberId)
   // console.log(req.body.chatRoomId)
   await ChatRoom.findById(req.body.chatRoomId)
      .then(chatRoom => {
         if (chatRoom.members.includes(memberId)) return res.json('Already added')
         chatRoom.members.push(memberId)
         chatRoom.save()
            .then(docs => res.status(200).json(docs))
            .catch(err => res.status(401).json("Error :" + err))
      })

      .catch(err => {
         console.log(err)
         res.status(401).json("Server error")
      })
}

const getChatRooms = async (req, res) => {
   try {
      const chatRoom = await ChatRoom.find({
         members: { $in: [req.user._id] }
      })
      return res.status(200).json(chatRoom)
   }
   catch (err) {
      return res.status(400).json(err)
   }
}

const getSearchedChatRooms = async (req, res) => {
   // try { 
   //    const chatRoom = await ChatRoom.find({
   //       name: ''
   //    })
   //    return res.status(200).json(chatRoom)
   // }
   // catch (err) {
   //    return res.status(400).json(err)
   // }
   var regex = new RegExp(req.params.roomName)
   ChatRoom.aggregate([
      {
         $match: {
            name: { $regex: regex, $options: 'i' }
         }
      },
      {
         $project: {
            admin: 1, members: 1, name: 1
         }
      },
   ]).exec(function (e, d) {
      if(e) return console.log(e)
      return res.status(200).json(d)
   })

}

module.exports = {
   createNewChatRoom,
   addNewMember,
   getChatRooms,
   getSearchedChatRooms
}