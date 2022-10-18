
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    profileImageSrc: {
        type: String
    }
},
    { timestamps: true }
)


module.exports = mongoose.model("User", userSchema, "User");