const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = () => {
  const board = chess.board();
  console.log(board);
  boardElement.innerHTML = "";
  board.forEach((row, rowIndex) => {
    row.forEach((box, boxIndex) => {
      const square = document.createElement("div");
      square.classList(
        "square",
        (rowIndex + boxIndex) % 2 === 0 ? "light" : "dark"
      );
      if (box) {
        const piece = document.createElement("div");
        piece.classList("piece", box.color === "w" ? "white" : "black");
        piece.innerHTML='';
        piece.draggable='';
      }
    });
  });
};

renderBoard();

const handleMove = () => {};

const getPieceUnicode = () => {};
