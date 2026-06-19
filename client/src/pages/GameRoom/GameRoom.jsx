import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { socket } from "../../socket/socket";
import Confetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import Board from "../../components/Board/Board";
import "../GameRoom/GameRoom.css";
import winner_sound from "../../assets/sounds/winner_sound.mp3";

const GameRoom = () => {
  const winnerAudio = new Audio(winner_sound);
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const { user } = useAuth();
  const location = useLocation();
  const { roomCode } = useParams();

  const [room, setRoom] = useState(location.state || null);

  //   if (!room) {
  //     return <h2>Room not found</h2>;
  //   }

  const handleCellClick = (index) => {
    console.log("Cell clicked:", index);

    const currentPlayer = room.players.find(
      (player) => player.username === user.username,
    );

    if (!currentPlayer) return;

    console.log("Current player:", currentPlayer);

    if (room.gameState.currentPlayer !== currentPlayer.symbol) {
      alert("Not your turn");
      return;
    }

    if (room.gameState.winner) {
      alert("Game Over");
      return;
    }

    socket.emit("make-move", {
      roomCode: room.roomCode,
      index,
      symbol: currentPlayer.symbol,
    });
  };

  const handleRematch = () => {
    socket.emit("rematch", {
      roomCode: room.roomCode,
    });
  };

  const handleLeaveRoom = () => {
    socket.emit("leave-room", {
      roomCode: room.roomCode,
      username: user.username,
    });

    navigate("/dashboard");
  };

  useEffect(() => {
    if (!room) {
      socket.emit("get-room", {
        roomCode,
      });
    }

    socket.on("room-data", ({ room }) => {
      console.log("ROOM DATA RECEIVED");
      console.log(room);
      setRoom(room);
    });

    socket.on("game-updated", ({ room }) => {
      console.log("GAME UPDATED RECEIVED");
      console.log(room);

      if (room.gameState.winner && room.gameState.winner !== "DRAW") {
        winnerAudio.play();
      }

      setRoom(room);
    });

    return () => {
      socket.off("game-updated");
      socket.off("room-data");
    };
  }, []);

  if (!room) {
    return <h2>Loading room...</h2>;
  }

  console.log("RENDERING ROOM");
  console.log(room);

  const showConfetti =
    room.gameState.winner && room.gameState.winner !== "DRAW";

  return (
    <>
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={300}
        />
      )}
      <div className="game-room">
        <div className="room-header">
          <div>
            <h1>Tic Tac Arena</h1>
            <p>Room Code: {room.roomCode}</p>
          </div>

          <div className="room-status">Status: {room.status}</div>
        </div>

        <div className="players-section">
          {room.players.map((player) => (
            <div
              key={player.socketId}
              className={`player-card ${
                room.gameState.currentPlayer === player.symbol
                  ? "active-player"
                  : ""
              }`}
            >
              <h3>{player.username}</h3>
              <span>{player.symbol}</span>
            </div>
          ))}
        </div>

        <div className="game-info">
          {room.gameState.winner === "DRAW" ? (
            <h2>🤝 Match Draw</h2>
          ) : room.gameState.winner ? (
            <div className="winner-banner">
              🎉 Winner: {room.gameState.winner}
            </div>
          ) : (
            <h2>Turn : {room.gameState.currentPlayer}</h2>
          )}
        </div>

        <div className="board-container">
          <Board board={room.gameState.board} onCellClick={handleCellClick} />
        </div>

        {room.gameState.winner && (
          <div className="game-actions">
            <button className="rematch-btn" onClick={handleRematch}>
              🔄 Play Again
            </button>

            <button className="leave-btn" onClick={handleLeaveRoom}>
              🚪 Leave Room
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default GameRoom;
