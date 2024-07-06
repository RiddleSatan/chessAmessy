import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { Chess } from "chess.js";

const PORT = 3000;
const app = express();
const __dirname = path.resolve();
const server = http.createServer(app);

const io = new Server(server);
const chess = new Chess();
let players = {};
let currentPlayer = "w";

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("a new user has connected", socket.id);

  //check for player availability and assing the Role accordingly
  if (!players.white) {
    players.white = socket.id;
    socket.emit("playerRole", "w");
  } else if (!players.black) {
    players.black = socket.id;
    socket.emit("playerRole", "black");
  } else {
    socket.emit("spectatorRole");
  }

  socket.on("disconnect", () => {
    if (socket.id === players.white) {
      delete players.white;
    } else if (socket.id == players.black) {
      delete players.black;
    }
  });

  //validation of correct turn the other person can still move its pieces but he cant play his turn only the player who has his turn can play the turn

  socket.on("move", (move) => {
    try {
      //validates if the use who has played the move has his turn or not or check of the correct user turn
      if (chess.turn == "w" && socket.id !== players.white) return;
      if (chess.turn == "b" && socket.id !== players.black) return;

      const valid = chess.move(move); //this checks of the move that has been played by the player is valid or not
      if (valid) {
        currentPlayer = chess.turn(); //if valid is truthy then the chess.turn() method will tell which players turn is now and we will update the currentPlayer value with the right turn which we will recived from chess.turn)
        socket.emit("move", move); //send the the correct move to both the client or all the client including the spectator who is watching the game
        socket.emit("boardState", chess.fen)(); //tell the correct state of the board like the positions of the pieces ..FEN is basically a equation the gives us all the info about state of the board. We are sending those state of the board to every player that is connected including the spectator
      } else {
        console.log("Invalid move:", move);
        socket.emit("invalidMove", move);
      }
    } catch (error) {
      console.log(error);
      socket.emit('invalidMove',move)
    }
  });
});

app.get("/", (req, res) => {
  res.render("index", { title: "chess game" });
});

server.listen(PORT, () => 
  console.log(`The server is running on PORT: ${PORT}`)
);
