const express = require("express");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuisV4 } = require("uuid");

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${uuisV4()}`);
});

app.get("/:room", (req, res) => {
  console.log(" req.params.room", req.params.room);
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (soscket) => {
  soscket.on("join-room", (roomId, userId) => {
    console.log("here", roomId, userId);
    soscket.join(roomId);
    soscket.to(roomId).broadcast.emit("user-connected", userId);

    soscket.on("disconnect", () => {
      soscket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
  });
});

server.listen(3300);
