const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
// let PORT = process.env.PORT || 5000;
let URI = "mongodb+srv://Jagadeesh-Vadlamuri:GC8ccsnEL8YBRxjr@cluster0.7ikzs0i.mongodb.net/chatApp?retryWrites=true&w=majority";
mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log(err.message);
  });





// mongoose.connect(URI).then(() => {
//   try{
//       app.listen(process.env.PORT, () => {
//           console.log("Mongo DB Connected on"+" "+process.env.PORT)
//       })
//   } catch(err){
//       console.log(err)
//   }
// });

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {
  cors: {
    origin: "https://jags-chat-application.netlify.app",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
