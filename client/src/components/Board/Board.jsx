import "./Board.css";

const Board = ({ board, onCellClick }) => {
  return (
    <div className="board">
      {board.map((cell, index) => (
        <button
          key={index}
          className="cell"
          onClick={() => onCellClick(index)}
        >
          {cell}
        </button>
      ))}
    </div>
    
  );
};

export default Board;