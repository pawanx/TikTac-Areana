import { useLocation } from "react-router-dom";
import Board from "../../components/Board/Board";

const GameRoom = () => {
  const location = useLocation();

  const room = location.state;

  if (!room) {
    return <h2>Room not found</h2>;
  }

  const handleCellClick = (index) => {
    console.log("Clicked", index);
  };

  return (
    <div>
      <h1>Room: {room.roomCode}</h1>

      <h2>Status: {room.status}</h2>

      <div>
        {room.players.map((player) => (
          <div key={player.socketId}>
            {player.username} ({player.symbol})
          </div>
        ))}
      </div>

      <Board board={room.gameState.board} onCellClick={handleCellClick} />
    </div>
  );
};

export default GameRoom;
