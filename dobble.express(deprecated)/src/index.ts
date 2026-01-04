import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "./gateways/index.ts";
import { RoomService } from "./services/room.service.ts";
import {
  registerHealthController,
  registerRoomController,
} from "./controllers/index.ts";
import { registerGameGateway } from "./gateways/index.ts";

const PORT = process.env.PORT || 3001;

const roomService = new RoomService();

const app = express();
app.use(cors());

registerHealthController(app);
registerRoomController(app, roomService);

const httpServer = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`Connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`Disconnected: ${socket.id}`);
  });

  registerGameGateway(io, socket, roomService);
});

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
