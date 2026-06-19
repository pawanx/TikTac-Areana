import generateRoomCode from "../utils/generateRoomCode.js";
import checkWinner from "../utils/checkWinner.js";
const rooms = {};

const gameSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User Connected", socket.id);

    socket.on("create-room", ({ username }) => {
      console.log("ALL ROOMS AFTER CREATE");
      console.log(rooms);
      const roomCode = generateRoomCode();

      rooms[roomCode] = {
        roomCode,
        status: "waiting",
        players: [
          {
            socketId: socket.id,
            username,
            symbol: "X",
          },
        ],

        gameState: {
          board: ["", "", "", "", "", "", "", "", ""],
          currentPlayer: "X",
          winner: null,
        },
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
        symbol: "O",
      });

      if (room.players.length === 2) {
        room.status = "playing";
      }

      socket.join(roomCode);

      io.to(roomCode).emit("room-joined", {
        room: rooms[roomCode],
      });

      console.log(`Player joined ${roomCode}`);
    });

    socket.on("make-move", ({ roomCode, index, symbol }) => {
      console.log("MOVE RECEIVED");
      console.log("ALL ROOMS DURING MOVE");
      console.log(rooms);

      const room = rooms[roomCode];

      if (!room) {
        console.log("ROOM NOT FOUND");
        return;
      }

      if (room.gameState.winner) {
        console.log("GAME OVER");
        return;
      }

      const board = room.gameState.board;

      if (board[index]) {
        console.log("CELL ALREADY FILLED");
        return;
      }

      if (room.gameState.currentPlayer !== symbol) {
        console.log("WRONG TURN");
        console.log("Current:", room.gameState.currentPlayer);
        console.log("Player:", symbol);
        return;
      }

      console.log("PASSING VALIDATION");

      board[index] = symbol;

      const winner = checkWinner(board);

      if (winner) {
        room.gameState.winner = winner;
      } else if (board.every((cell) => cell !== "")) {
        room.gameState.winner = "DRAW";
      } else {
        room.gameState.currentPlayer = symbol === "X" ? "O" : "X";
      }

      console.log("EMITTING UPDATE");
      console.log(room.gameState.board);

      io.to(roomCode).emit("game-updated", {
        room,
      });
    });

    socket.on("get-room", ({ roomCode }) => {
      console.log("GET ROOM:", roomCode);
      const room = rooms[roomCode];

      if (!room) {
        socket.emit("room-data", {
          room: null,
        });

        return;
      }

      socket.join(roomCode);

      socket.emit("room-data", {
        room,
      });

      console.log(`${socket.id} rejoined ${roomCode}`);
    });

    socket.on("rematch", ({ roomCode }) => {
      const room = rooms[roomCode];

      if (!room) return;

      room.gameState = {
        board: ["", "", "", "", "", "", "", "", ""],

        currentPlayer: "X",

        winner: null,
      };

      io.to(roomCode).emit("game-updated", {
        room,
      });
    });

    socket.on("leave-room", ({ roomCode, username }) => {
      const room = rooms[roomCode];

      if (!room) return;

      socket.leave(roomCode);

      room.players = room.players.filter(
        (player) => player.username !== username,
      );

      if (room.players.length === 0) {
        delete rooms[roomCode];

        console.log(`Deleted room ${roomCode}`);
      } else {
        room.status = "waiting";
      }
    });

    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${socket.id}`);
    });
  });
};

export default gameSocket;
