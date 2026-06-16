import {Server} from "socket.io"
import http from "http"
import express from "express";
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()

import ConnectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import  gameSocket from "./sockets/gameSocket.js";

ConnectDB()

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
app.use(express.json());

app.use(cors())

gameSocket(io)

app.use("/api/auth", authRoutes)

const PORT = process.env.PORT || 5000


server.listen(PORT, () => {
  console.log(
    `Server running on ${PORT}`
  );
});