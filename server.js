const express = require("express");
const moment = require("moment");
const myapi = require("./router/api");
const { createServer } = require("node:http");
const port = 4000;
const app = express();
const server = createServer(app);

// Middleware để xử lý file upload
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });

const cheerio = require("cheerio");
const request = require("request-promise");

const path = require("path");
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));

app.use("/api/v1/", myapi);

const { Server } = require("socket.io");
const io = new Server(server);

const arrayUsers = [];
const messages = [];

io.on("connection", (socket) => {
    console.log("co nguoi ket noi ", socket.id);

    // Gửi toàn bộ lịch sử tin nhắn (bao gồm cả hình ảnh) khi có người mới kết nối
    socket.emit("server-send-messages-history", messages);

    socket.on("client-send-username", (data) => {
        if (arrayUsers.includes(data)) {
            socket.emit("server-send-username", "");
        } else {
            arrayUsers.push(data);
            socket.username = data;
            socket.emit("server-send-username", data);
            io.sockets.emit("server-send-arrayUsers", arrayUsers);
        }
    });

    socket.on("disconnect", () => {
        console.log(`Nguoi dung ${socket.username} da thoat`)
        const index = arrayUsers.indexOf(socket.username);
        if (index !== -1) {
            arrayUsers.splice(index, 1);
            io.sockets.emit("server-send-arrayUsers", arrayUsers);
            socket.emit("server-send-arrayUser", arrayUsers);
        }
    });

    socket.on("client-send-out", () => {
        const index = arrayUsers.indexOf(socket.username);
        if (index !== -1) {
            arrayUsers.splice(index, 1);
            io.sockets.emit("server-send-arrayUsers", arrayUsers);
            socket.emit("server-send-arrayUser", arrayUsers);
        }
    });

    socket.on("client-send-message", (data) => {
        const message = { un: socket.username, ct: data };
        messages.push(message);
        io.sockets.emit("server-send-messages", message);
    });

    socket.on("client-send-image", (data) => {
        const image = { un: socket.username, img: data };
        messages.push(image); // Đảm bảo hình ảnh được lưu trữ đúng cách
        io.sockets.emit("server-send-image", image);
    });
});


app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    io.sockets.emit("server-send-image", { un: req.body.username, img: imageUrl });
    res.status(200).send('File uploaded successfully ');
});

app.get("/", (req, res) => {
    res.render("trangchu.ejs");
});

server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
});
