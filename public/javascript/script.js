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
      square.classList.add(
        "square",
        (rowIndex + boxIndex) % 2 === 0 ? "light" : "dark"
      );
      if (box) {
        const piece = document.createElement("div");
        piece.classList.add("piece", box.color === "w" ? "white" : "black");
        piece.innerHTML='';
        piece.draggable=playerRole===box.color;//this need to be considered----------------#############################

        piece.addEventListener('dragstart',(e)=>{
          if(piece.draggable){
            draggedPiece=piece
            sourceSquare={row:rowIndex, col:boxIndex}
          }-
          e.dataTransfer.setData('text/plain','');
        })
        square.addEventListener('drop',(e)=>{
        e.preventDefault()
        draggedPiece=null;
        sourceSquare=null;
        });


        square.appendChild(piece)
      }

       boardElement.appendChild(square)
   
    });
  });
};

renderBoard();

const handleMove = () => {};

const getPieceUnicode = () => {};
