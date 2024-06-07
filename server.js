const express = require("express");
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


// Crawl data with pagination
app.use("/api/v1", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const size = parseInt(req.query.size) || 4; 

    const html = await request('https://123job.vn/tuyen-dung');
    const $ = cheerio.load(html);
    const jobList = [];

    $(".job__list-item").each((index, element) => {
      const job = $(element).find(".job__list-item-content .job__list-item-title").text().trim();
      const company = $(element).find(".job__list-item-content .job__list-item-company").text().trim();
      const address = $(element).find(".job__list-item-content .job__list-item-info .address").text().trim();
      const salary = $(element).find('.job__list-item-info').find('.salary').text().trim();

      jobList.push({
        job: job,
        company: company,
        address: address,
        salary: salary
      });
    });
  

        const totalItems = jobList.length;
        const totalPages = Math.ceil(totalItems / size);
        const startIndex = (page - 1) * size;
        const endIndex = Math.min(startIndex + size, totalItems);
    
        const paginatedJobs = jobList.slice(startIndex, endIndex);
    
        res.status(200).json({
          page: page,
          size: size,
          totalItems: totalItems,
          totalPages: totalPages,
          jobs: paginatedJobs
        });
      } catch (error) {
        res.status(500).json("server invalid");
      }
    });



// socket.io
const { Server } = require("socket.io");
const { match } = require("node:assert");
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
