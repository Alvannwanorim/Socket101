const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();

// Serve static files
app.use(express.static(__dirname + "/public"));

// Start the HTTP server
const expressServer = app.listen(9001, () => {
  console.log("Server is running on http://localhost:9001");
});

// Set up Socket.IO with explicit CORS configuration
const io = new Server(expressServer, {
  cors: {
    origin: ["http://127.0.0.1:9001", "http://localhost:9001"], // Allow these origins
    methods: ["GET", "POST"], // Allowed methods
  },
});

// Handle WebSocket connections
io.of("/").on("connection", (socket) => {
  socket.join("chat");
  io.of("/").to("chat").emit("welcomeToChatRoom", "");

  console.log(`${socket.id} has connected`);

  socket.on("newMessageFromClient", (dataFromClient) => {
    console.log(dataFromClient);
    io.of("/").emit("newMessageToClient", { text: dataFromClient.text });
  });
});

io.of("/admin").on("connection", (socket) => {
  console.log(socket.id, " has joined admin");
  io.of("/admin").emit("messageToCLientsFromAdmin", {});
});
