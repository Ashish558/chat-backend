
var express = require('express')
const { getMessages, saveMessage } = require('../controllers/message')
const verifyToken = require('../utils/verifyToken')

var router = express.Router()

//save message
router.post('/', verifyToken, saveMessage)

//get messages
router.get('/:roomId', verifyToken, getMessages)

module.exports = router