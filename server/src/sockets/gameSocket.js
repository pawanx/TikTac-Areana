import generateRoomCode from "../utils/generateRoomCode.js";
const rooms = {};

const gameSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User Connected", socket.id);

    socket.on("create-room", ({ username }) => {
      const roomCode = generateRoomCode();

      rooms[roomCode] = {
        players: [
          {
            socketId: socket.id,
            username,
            symbol : "X"
          },
        ],
      };

      socket.join(roomCode);

      socket.emit("room-created", {
        roomCode,
      });

      console.log(`Room Created: ${roomCode}`);

      console.log(rooms);
    });

    socket.on("join-room", ({ roomCode, username }) => {
      const room = rooms[roomCode];

      if (!room) {
        socket.emit("room-error", {
          message: "Room not found.",
        });

        return;
      }

      if (room.players.length >= 2) {
        socket.emit("room-error", {
          message: "Room is Full.",
        });

        return;
      }

      room.players.push({
        socketId: socket.id,
        username,
        symbol:"0"
      });

      socket.join(roomCode);

      io.to(roomCode).emit("room-joined", {
        roomCode,
        players: room.players,
      });

      console.log(`Player joined ${roomCode}`);
    });

    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${socket.id}`);
    });
  });
};

export default gameSocket;
