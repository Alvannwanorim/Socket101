const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const namespaces = require("./data/namespaces");
const Room = require("./classes/Room");
const app = express();

// Serve static files
app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(9000, () => {
  console.log("Server is running on http://localhost:9000");
});

const io = new Server(expressServer, {
  cors: {
    origin: ["http://127.0.0.1:9000", "http://localhost:9000"],
    methods: ["GET", "POST"], // Allowed methods
  },
});

//IO middleware
io.use((socket, next) => {
  const jwt = socket.handshake.auth.jwt;
  if (jwt) {
    console.log(jwt);
    next();
  } else {
    console.log("Goodbye");
    socket.disconnect();
  }
});
app.get("/change-ns", (req, res) => {
  namespaces[0].addRoom(new Room(0, "Deleted Articles ", 0));
  io.of(namespaces[0].endpoint).emit("nsChange", namespaces[0]);
  res.json(namespaces[0]);
});

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("============");
  // console.log(socket.handshake);
  console.log(`${socket.id} has connected`);
  socket.emit("welcome", "Welcome to the server");

  socket.on("clientConnect", (data) => {
    console.log("client connect event");
  });

  socket.emit("nsList", namespaces);
});

namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on("connection", (socket) => {
    console.log(socket.id, " has connected to", namespace.name);
    socket.on("joinRoom", async (roomObj, askCallback) => {
      // get all rooms in the namespace

      const thisNs = namespaces[roomObj.nsId];
      const thisRoomObj = thisNs.rooms.find(
        (room) => room.roomTitle === roomObj.roomTitle
      );
      const roomHistory = thisRoomObj.history;

      let count = 0;
      const rooms = socket.rooms;

      // leave from every other room except for the default room
      rooms.forEach((room) => {
        if (count !== 0) {
          socket.leave(room);
        }
        count++;
      });

      // join room
      socket.join(roomObj.roomTitle);
      const socketCount = await io
        .of(namespace.endpoint)
        .in(roomObj.roomTitle)
        .fetchSockets();
      askCallback({
        numUser: socketCount.length,
        history: roomHistory,
      });
    });

    socket.on("newMessageToRoom", (obj) => {
      // console.log(obj);
      const rooms = socket.rooms;
      const currentRoom = [...rooms][1];
      io.of(namespace.endpoint).in(currentRoom).emit("messageToRoom", obj);
      const thisNs = namespaces[obj.selectedNsId];
      const thisRoom = thisNs.rooms.find(
        (room) => room.roomTitle === currentRoom
      );
      // console.log(thisNs, thisRoom);
      thisRoom.addMessage(obj);
    });
  });
});
