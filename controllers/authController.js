

var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')

var User = require('../models/User')
const { registerValidation, loginValidation } = require("../utils/validation")

async function registerUser(req, res) {
    const { username, email, password } = req.body

    const { error } = registerValidation(req.body)
    //check errors 
    if (error) return res.status(400).json({ message: error.details[0].message })

    const emailExist = await User.findOne({ email })
    if (emailExist) return res.status(400).json({ message: "Email already exists" })

    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //save user in db
    var newUser = new User({
        username,
        password: hashedPassword,
        email,
        profileImageSrc: null
    })

    await newUser.save()
        .then(() => {
            return res.status(200).json("user created")
        })
        .catch(err => res.status(401).json({ message: "An error occured try again" }))
}

async function loginUser(req, res) {
    const { email, password } = req.body
    const { error } = loginValidation(req.body)
    //ceck input errors
    if (error) return res.status(400).json({ message: error.details[0].message })
    //check if user exists
    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: "Email does not exists" })

        //check pass
        const validPass = await bcrypt.compare(password, user.password)
        if (!validPass) return res.status(400).json({ message: "Wrong Password" })

        //set jwt
        const token = await jwt.sign({ _id: user._id }, process.env.SECRET)

        const data = {
            username: user.username,
            user_id: user._id,
            userImg: user.profileImageSrc,
            token: token
        }
        res.header("auth-token", token).json(data)
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ message: "Check internet" })
    }

}

module.exports = {
    registerUser,
    loginUser
}