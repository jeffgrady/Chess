var ChessBoard = require('./ChessBoard');
var board = new ChessBoard();
board.print();

while (true) {
    var move = board.readConsoleMove();
    if ((move === null) || (move === "")) continue;
    var result = board.move(move);
    if (!result) {
	console.log("Invalid move.")
    }
    board.print(move);
}
