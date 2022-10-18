
var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors')
// const cookieParser = require("cookie-parser")

var app = express();
require("dotenv").config()
const port = process.env.PORT || 4000

const corsOptions = {
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token', 'Authorization', "auth-token"],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: process.env.FRONT_ORIGIN ,
  preflightContinue: false,
}

app.use(cors(corsOptions))
app.use(express.json())
// app.use(cookieParser())
app.use(express.static(__dirname + "/public"))

var server = require('http').createServer(app)


mongoose.connect(process.env.MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected to db"))
  .catch((err) => console.log(err))

mongoose.connection.on("connected", () => {
  console.log("connected successfully !!!")
})
mongoose.connection.on("error", () => {
  console.log("error")
})


//authentication route
var authRoute = require('./routes/auth')
app.use('/api/user', authRoute)

//chat room route
var chatRoomRoute = require('./routes/conversation')
app.use('/api/chatroom', chatRoomRoute)

//authentication route
var messageRoute = require('./routes/message')
app.use('/api/message', messageRoute)

// SOCKET 
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.FRONT_ORIGIN
  }
})
io.listen(5000)

let users = []

const addUser = (userId, socketId) => {
  if (!userId && !socketId) return
  if (users.find((user) => user.userId === userId)) return
  users.push({ userId, socketId })
  console.log('users len :' + users.length)
}

const removeUser = (socketId) => {
  users.filter(user => user.socketId !== socketId)
}

const getUser = (userId) => {
  return users.find(user => user.userId === userId)
}

io.on("connection", (socket) => {
  //when connect
  console.log("a user connected " + socket.id)

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  })

  //join a room
  socket.on("joinRoom", ({ roomId, roomName }) => {
    socket.join(roomId);
  })

  //send and get message
  socket.on("sendMessage", ({ sender, chatRoomId, text }) => {
    const user = getUser(sender._id)
    // console.log(sender, text)
    if (!user) return
    io.in(chatRoomId).emit("getMessage", {
      sender,
      chatRoomId,
      text
    });
  })

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });

});

console.log('socket runnin')


server.listen(port)
console.log('done')

