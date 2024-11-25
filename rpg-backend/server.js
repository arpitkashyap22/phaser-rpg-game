import express from "express";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());

const server = app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"],
  },
});

const players = {};
const colors = [
  "aqua", "black", "blue", "fuchsia", "gray", "green",
  "lime", "maroon", "navy", "olive", "orange", "purple",
  "red", "silver", "teal", "white", "yellow",
];

// On client connection
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Player joins the game
  socket.on("enterGame", ({ name }) => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const player = {
      id: socket.id,
      name,
      x: Math.random() * 800, // Spawn at random position
      y: Math.random() * 600,
      color,
    };

    players[socket.id] = player;

    // Notify the new player of the current players
    socket.emit("currentPlayers", Object.values(players));

    // Notify other players about the new player
    socket.broadcast.emit("playerJoined", player);
  });

  // Handle player movement
  socket.on("playerMovement", (movementData) => {
    if (players[socket.id]) {
      players[socket.id].x = movementData.x;
      players[socket.id].y = movementData.y;

      // Broadcast updated position to other players
      socket.broadcast.emit("playerMoved", players[socket.id]);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    const disconnectedPlayer = players[socket.id];
    delete players[socket.id];

    // Notify other players that the player left
    io.emit("playerLeft", disconnectedPlayer);
  });
});
