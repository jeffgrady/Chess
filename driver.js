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
    if (board.PAWN_PROMOTION) {
	var piece = board.readConsolePawnPromotion();
	board.resolvePawnPromotion(piece);
	board.print();
    }
}
