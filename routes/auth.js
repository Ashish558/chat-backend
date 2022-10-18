
var express = require('express')
const { registerUser, loginUser } = require('../controllers/authController')

var router = express.Router()

//Post in signup
router.post('/register', registerUser)


//login
router.post('/login', loginUser)

module.exports = router