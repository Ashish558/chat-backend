

const express = require('express')
const ChatRoom = require('../models/ChatRoom')

const router = express.Router()

const { createNewChatRoom, addNewMember, getChatRooms, getSearchedChatRooms } = require('../controllers/conversation')
const verifyToken = require('../utils/verifyToken')

//start new convo
router.post("/", verifyToken, createNewChatRoom)

//add new members to a chat room
router.post("/join", verifyToken, addNewMember)

//get convo
router.get("/", verifyToken, getChatRooms)

//get searched rooms
router.get("/search/:roomName", verifyToken, getSearchedChatRooms)

module.exports = router