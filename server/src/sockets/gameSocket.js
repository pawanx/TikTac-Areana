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

    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${socket.id}`);
    });
  });
};

export default gameSocket;
