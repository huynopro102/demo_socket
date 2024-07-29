const express = require("express");
const moment = require("moment")
const myapi = require("./router/api")
const { createServer } = require("node:http");
const port = 4000;
const app = express();
const server = createServer(app);

// Crawl
const cheerio = require("cheerio")
const request = require("request-promise")

// static files
const path = require("path");
app.use("/public", express.static(path.join(__dirname, "public")));

// confige ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));


// router api
app.use("/api/v1/",myapi)


// socket.io
const { Server } = require("socket.io");

const io = new Server(server);

// listening to client
const arrayUsers = [];

io.on("connection", (socket) => {
  
  console.log("co nguoi ket noi ", socket.id);


  // lang nghe ten nguoi dung
  socket.on("client-send-username", (data) => {

    console.log("data user gui ", data, arrayUsers.includes(data));

    // neu da ton tai
    if (arrayUsers.includes(data) == true) {
      socket.emit("server-send-username", "");
      // neu khong co
    } else {
      arrayUsers.push(data);
      socket.username = data;
      socket.emit("server-send-username", data);
      io.sockets.emit("server-send-arrayUsers", arrayUsers);
    }
  });


  // join-room and name-room
  socket.on("join-room",(data)=>{
      socket.join("create-"+data)
      console.log("day la 1 socket ", socket.adapter.rooms);
      let mang = []
      for (const [room, connections] of socket.adapter.rooms) {
        mang.push(room)
      }
      socket.emit("server-all-rooms",mang) 

      const name_room = `create-${data}`
      socket.emit("server-name-room",name_room) 
  })

 
  

  // ngat ket noi
  socket.on("disconnect", () => {
    console.log("ngat ket noi ", socket.id);
    const index = arrayUsers.indexOf(socket.username);
    if (index !== -1) {
      arrayUsers.splice(index, 1);
      io.sockets.emit("server-send-arrayUsers", arrayUsers);
      socket.emit("server-send-arrayUser", arrayUsers);
      console.log(`Người dùng ${socket.username} đã ngắt kết nối`);
    }
  });


  // lang nghe nguoi dung out
  socket.on("client-send-out", () => {
    const index = arrayUsers.indexOf(socket.username);
    if (index !== -1) {
      arrayUsers.splice(index, 1);
      io.sockets.emit("server-send-arrayUsers", arrayUsers);
      socket.emit("server-send-arrayUser", arrayUsers);
      console.log(`Người dùng ${socket.username} đã ngắt kết nối`);
    }
  });

  // lang nghe nguoi dung message 
  socket.on("client-send-message",(data)=>{
    console.log("cline send data ",data)
      io.sockets.emit("server-send-messages",{
        un : socket.username , 
        ct : data
      })
  })
  
});


// router
app.get("/", (req, res) => {
  res.render("trangchu.ejs");
});

server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
