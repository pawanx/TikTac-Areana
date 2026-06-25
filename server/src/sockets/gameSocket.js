import User from "../models/User.js";
import generateRoomCode from "../utils/generateRoomCode.js";
import checkWinner from "../utils/checkWinner.js";
const rooms = {};

const gameSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User Connected", socket.id);

    socket.on("create-room", ({ userId, username }) => {
      console.log("ALL ROOMS AFTER CREATE");
      console.log(rooms);
      console.log("USER AFTER CREATE");
      console.log(userId);
      console.log(username);
      const roomCode = generateRoomCode();

      rooms[roomCode] = {
        roomCode,
        status: "waiting",
        players: [
          {
            socketId: socket.id,
            userId,
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

    socket.on("join-room", ({ roomCode, userId, username }) => {
      const room = rooms[roomCode];
      console.log("USER AAAAFTER JOIN")
      console.log(userId);
      console.log(username);

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
        userId,
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

    socket.on("make-move", async ({ roomCode, index, symbol }) => {
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

      console.log("Winner:", winner);
console.log("Current winner field:", room.gameState.winner);

      if (winner) {
        console.log("ENTERED WIN BLOCK");
        room.gameState.winner = winner;

        const winnerPlayer = room.players.find(
          (player) => player.symbol === winner,
        );

        const loserPlayer = room.players.find(
          (player) => player.symbol !== winner,
        );

        console.log("Winner Player:", winnerPlayer);
        console.log("Loser Player:", loserPlayer);

        console.log("Winner ID:", winnerPlayer.userId);
        console.log("Loser ID:", loserPlayer.userId);

        await User.findByIdAndUpdate(winnerPlayer.userId, {
          $inc: {
            wins: 1,
            gamesPlayed: 1,
          },
        });

        await User.findByIdAndUpdate(loserPlayer.userId, {
          $inc: {
            losses: 1,
            gamesPlayed: 1,
          },
        });
      } else if (board.every((cell) => cell !== "")) {
        room.gameState.winner = "DRAW";

        await User.findByIdAndUpdate(room.players[0].userId, {
          $inc: {
            draws: 1,
            gamesPlayed: 1,
          },
        });

        await User.findByIdAndUpdate(room.players[1].userId, {
          $inc: {
            draws: 1,
            gamesPlayed: 1,
          },
        });
        console.log("DB UPDATED");
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
      console.log("REMATCH");
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
