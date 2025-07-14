import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import cors from 'cors';

const app = express();

// create server
const server = new createServer(app);

//create instance
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});


// middleware for auth
const user = true;
io.use((socket, next) => {
  if(user) next()
  // user false hoile nicher code gual r run korbe na  
})

io.on("connection", (socket) => {
  console.log("user is connected ", socket.id);

  // //individual socket id k ei msg ta dekhabe. sobar jonno.
  // socket.emit("welcome", `Hello you are wellcome`)

  // // individula id chara baki sobar kache jabe msg.
  // // kew join hoile se bad e baki sobar kache msg jabe j ei public join hoiche. jamon ta group e join korle hoy
  // socket.broadcast.emit("welcome", ` ${socket.id} has joind`)

  // socket.on('disconnect', () => {
  //   console.log("user disconnected")
  // })

  socket.on("message", ({room, message}) => {
    // console.log(msg);
    // front end  theke emit kora msg ei khane pailam.
    // akhon ei msg ta sobai k broadcast kore dibo
    // tai io.emit use korbo
    // io.emit("sent_msg", msg); // akhon msg ta sob user er kache chole jabe

    // socket.broadcast.emit("sent_msg", msg);

    io.to(room).emit("sent_msg", message) // specific kono person k msg pathabo
  })

  socket.on("roomName", (room) => {
    console.log("roomName = ", room);
    socket.join(room);
  })
  
});

server.listen(5000, () => {
  console.log("server running at http://localhost:5000");
});
