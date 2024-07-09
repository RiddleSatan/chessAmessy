const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const getPieceUnicode = (piece) => {
  //piece will contain multiple field thats why we used piece.type to get he type
  unicode = {
    p: "♙",
    n: "♞",
    b: "♝",
    q: "♛",
    r: "♜",
    k: "♚",
    P: "♙",
    R: "♖",
    N: "♘",
    B: "♗",
    Q: "♕",
    K: "♔",
  };
  return unicode[piece.type] || "";
};

const renderBoard = () => {
  //a fucntion that renders the board
  const board = chess.board(); //hold all the data about the board like the coordinates and the pieces along with there colors
  console.log(board);
  boardElement.innerHTML = "";
  board.forEach((row, rowIndex) => {
    row.forEach((box, boxIndex) => {
      //box contains the piece or null along with there color
      const square = document.createElement("div");
      square.classList.add(
        "square",
        (rowIndex + boxIndex) % 2 === 0 ? "light" : "dark"
      );
      if (box) {
        const piece = document.createElement("div");
        piece.classList.add("piece", box.color === "w" ? "white" : "black");
        piece.innerText = getPieceUnicode(box);
        piece.draggable = playerRole === box.color; //this need to be considered----------------#############################

        piece.addEventListener("dragstart", (e) => {
          if (piece.draggable) {
            draggedPiece = piece;
            sourceSquare = { row: rowIndex, col: boxIndex };
          }
          e.dataTransfer.setData("text/plain", "");
        });
        square.addEventListener("drop", (e) => {
          e.preventDefault();
          draggedPiece = null;
          sourceSquare = null;
        });

        square.appendChild(piece);
      }
      square.addEventListener("dragover", function (e) {
        e.preventDefault();
      });
      square.addEventListener("drop", (e) => {
        e.preventDefault();
        if (draggedPiece) {
          const targetSource = {
            row: parseInt(square.dataset.row),
            col: parseInt(square.dataset.col),
          };
          handleMove(sourceSquare, targetSource);
        }
      });
      boardElement.appendChild(square);
    });
  });
};

renderBoard();

const handleMove = (source, target) => {
  const move = {
    from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
    to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
    promotion: "q",
  };
  socket.emit("move", move);
};
