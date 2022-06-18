const express = require("express");
const app = express();
const http = require("http");

//バックエンドのサーバー
const server = http.createServer(app);
//ソケット通信のサーバー
const { Server } = require("socket.io");
const PORT = 5000;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
  methods: ["GET", "POST"],
});

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  //ルームに入る時のソケット設定
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  //ライブチャット専用ソケット設定
  socket.on("send_message", (data) => {
    // console.log(data);

    //クライアントに返すソケット通信(roomが同じ人だけ)
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
