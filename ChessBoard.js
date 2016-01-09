var readlineSync = require('readline-sync');

var ChessBoard = function() {
    this.EMPTY_SPACE = 0;
    this.PAWN_BLACK = 1;
    this.KNIGHT_BLACK = 2;
    this.BISHOP_BLACK = 3;
    this.ROOK_BLACK = 4;
    this.QUEEN_BLACK = 5;
    this.KING_BLACK = 6;
    this.PAWN_WHITE = 7;
    this.KNIGHT_WHITE = 8;
    this.BISHOP_WHITE = 9;
    this.ROOK_WHITE = 10;
    this.QUEEN_WHITE = 11;
    this.KING_WHITE = 12;

    this.BLACK = 0;
    this.WHITE = 1;
    this.TURN = this.WHITE;
    this.error_message = "";

    this.pieces = [ '   ', '*P*', '*N*', '*B*', '*R*', '*Q*', '*K*',
		    ' P ', ' N ', ' B ', ' R ', ' Q ', ' K ' ];
    this.board = [];
    this.board.push([this.ROOK_BLACK, this.KNIGHT_BLACK, this.BISHOP_BLACK,
		     this.QUEEN_BLACK, this.KING_BLACK, this.BISHOP_BLACK,
		     this.KNIGHT_BLACK, this.ROOK_BLACK]);
    this.board.push([this.PAWN_BLACK, this.PAWN_BLACK, this.PAWN_BLACK,
		     this.PAWN_BLACK, this.PAWN_BLACK, this.PAWN_BLACK,
		     this.PAWN_BLACK, this.PAWN_BLACK]);
    for (var j = 0; j < 4; j += 1) {
	this.board.push([this.EMPTY_SPACE, this.EMPTY_SPACE, this.EMPTY_SPACE,
			 this.EMPTY_SPACE, this.EMPTY_SPACE, this.EMPTY_SPACE,
			 this.EMPTY_SPACE, this.EMPTY_SPACE]);
    }
    this.board.push([this.PAWN_WHITE, this.PAWN_WHITE, this.PAWN_WHITE,
		     this.PAWN_WHITE, this.PAWN_WHITE, this.PAWN_WHITE,
		     this.PAWN_WHITE, this.PAWN_WHITE]);
    this.board.push([this.ROOK_WHITE, this.KNIGHT_WHITE, this.BISHOP_WHITE,
		     this.QUEEN_WHITE, this.KING_WHITE, this.BISHOP_WHITE,
		     this.KNIGHT_WHITE, this.ROOK_WHITE]);
};

ChessBoard.prototype.print = function() {
    console.log(this.board);    
    console.log("    a   b   c   d   e   f   g   h");
    console.log("  +---+---+---+---+---+---+---+---+");
    for (var i = 0; i < 8; i += 1) {
	str = (8-i) + " |";
	for (var j = 0; j < 8; j += 1) {
	    str += this.pieces[this.board[i][j]] + "|"
	}
	console.log(str);
	console.log("  +---+---+---+---+---+---+---+---+");
    }
};

ChessBoard.prototype.getPos = function(x, y) {
    if (['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].indexOf(x) == -1) {
	this.error_message = "Invalid move: " + x;
	return [];
    }
    if ((y < 1) || (y > 8)) {
	this.error_message = "Invalid move: " + y;
	return [];
    }
    var y_index = 8 - y;
    var x_index = x.charCodeAt(0) - 'a'.charCodeAt(0);
    console.log(y_index);
    console.log(x_index);
    return [y_index, x_index];
};

ChessBoard.prototype.readConsoleMove = function() {
    var move = readlineSync.question('move: ').trim();
    // FIXME:  we'll support Qg5 someday...  This will need to be fixed.
    if (move.length != 4) {
	this.error_message = "Invalid move: " + move;
	return null;
    }
    return move.split('');
};

ChessBoard.prototype.isWhite = function(pos) {
    var piece = this.board[pos[0]][pos[1]];
    if ((piece >= this.PAWN_WHITE) && (piece <= this.KING_WHITE)) {
	return true;
    }
    return false;
};

ChessBoard.prototype.isBlack = function(pos) {
    var piece = this.board[pos[0]][pos[1]];
    if ((piece >= this.PAWN_BLACK) && (piece <= this.KING_BLACK)) {
	return true;
    }
    return false;
};

ChessBoard.prototype.getColor = function(pos) {
    if (this.isBlack(pos)) {
	return this.BLACK;
    }
    if (this.isWhite(pos)) {
	return this.WHITE;
    }
    return -1;
};

ChessBoard.prototype.isPawn = function(pos) {
    if ((this.board[pos[0]][pos[1]] == this.PAWN_BLACK) ||
	(this.board[pos[0]][pos[1]] == this.PAWN_WHITE)) {
	return true;
    }
    return false;
};

ChessBoard.prototype.isKnight = function(pos) {
    if ((this.board[pos[0]][pos[1]] == this.KNIGHT_BLACK) ||
	(this.board[pos[0]][pos[1]] == this.KNIGHT_WHITE)) {
	return true;
    }
    return false;
};

ChessBoard.prototype.isBishop = function(pos) {
    if ((this.board[pos[0]][pos[1]] == this.BISHOP_BLACK) ||
	(this.board[pos[0]][pos[1]] == this.BISHOP_WHITE)) {
	return true;
    }
    return false;
};

ChessBoard.prototype.isQueen = function(pos) {
    if ((this.board[pos[0]][pos[1]] == this.QUEEN_BLACK) ||
	(this.board[pos[0]][pos[1]] == this.QUEEN_WHITE)) {
	return true;
    }
    return false;
};

ChessBoard.prototype.isKing = function(pos) {
    if ((this.board[pos[0]][pos[1]] == this.KING_BLACK) ||
	(this.board[pos[0]][pos[1]] == this.KING_WHITE)) {
	return true;
    }
    return false;
};

ChessBoard.prototype.isMoveInList = function(validMoves, move) {
    for (var i = 0; i < validMoves.length; i += 1) {
	if ((validMoves[i][0] == move[0]) &&
	    (validMoves[i][1] == move[1])) {
	    return true;
	}
    }
    return false;
};

ChessBoard.prototype.nextTurn = function() {
    if (this.TURN == this.WHITE) {
	this.TURN = this.BLACK;
    } else {
	this.TURN = this.WHITE;
    }
    return this.TURN;
};

ChessBoard.prototype.move = function(move) {
    /*
    this.BLACK = 0;
    this.WHITE = 1;
    this.TURN = this.WHITE;
    */
    var from = this.getPos(move[0], move[1]);
    var to = this.getPos(move[2], move[3]);
    // Filter out where they put the piece back
    if ((from[0] == to[0]) && (from[1] == to[1])) {
	return false;
    }
    if ((from.length == 0) || (to.length == 0)) {
	return false;
    }
    if ((this.isWhite(from)) && (this.TURN != this.WHITE)) {
	this.error_message = "It's not white's turn.";
	return false;
    }
    if (this.isBlack(from) && (this.TURN != this.BLACK)) {
	this.error_message = "It's not black's turn.";
	return false;
    }
    var validMoves = [];
    if (this.isPawn(from)) {
	console.log("is pawn");
	validMoves = this.getValidPawnMoves(from);
    } else if (this.isKnight(from)) {
	console.log("is knight");
	validMoves = this.getValidKnightMoves(from);
    } else if (this.isBishop(from)) {
	console.log("is bishop");
	validMoves = this.getValidBishopMoves(from);
    }
    console.log(validMoves);
    var result = this.isMoveInList(validMoves, to);
    console.log(result);
    if (result) {
	var piece = this.board[from[0]][from[1]];
	// FIXME: save piece that is captured
	this.board[from[0]][from[1]] = this.EMPTY_SPACE;
	this.board[to[0]][to[1]] = piece;
	this.nextTurn();
	return true;
    }

    return false;
};

ChessBoard.prototype.isOccupiedSameColor = function(from, candidate) {
    if ((this.getColor(from) == this.getColor(candidate)) &&
	this.isOccupied(from) && this.isOccupied(candidate)) {
	return true;
    }
    return false;
};

ChessBoard.prototype.isOccupiedDifferentColor = function(from, candidate) {
    if ((this.getColor(from) != this.getColor(candidate)) &&
	this.isOccupied(from) && this.isOccupied(candidate)) {
	return true;
    }
    return false;
};

ChessBoard.prototype.isOccupied = function(pos) {
    if (this.board[pos[0]][pos[1]] == this.EMPTY_SPACE) {
	return false;
    }
    return true;
};

ChessBoard.prototype.isOnBoard = function(pos) {
    if ((pos[0] >= 0) && (pos[0] <= 7) &&
	(pos[1] >= 0) && (pos[1] <= 7)) {
	return true;
    }
    return false;
};

ChessBoard.prototype.getValidKnightMoves = function(from) {
    var validMoves = [];
    var candidates = [[from[0] - 2, from[1] + 1],
		      [from[0] - 2, from[1] - 1],
		      [from[0] - 1, from[1] + 2],
		      [from[0] + 1, from[1] + 2],
		      [from[0] + 2, from[1] + 1],
		      [from[0] + 2, from[1] - 1],
		      [from[0] - 1, from[1] - 2],
		      [from[0] + 1, from[1] - 2]];
    for (var i = 0; i < candidates.length; i += 1) {
	if (this.isOnBoard(candidates[i]) &&
	    !this.isOccupiedSameColor(from, candidates[i])) {
	    validMoves.push(candidates[i]);
	}
    }
    return validMoves;
};

ChessBoard.prototype.getValidBishopMoves = function(from) {
    var validMoves = [];
    var candidate = [from[0], from[1]].slice();
    // up and to the right
    for (var i = 1; i < 8; i += 1) {
	candidate[0] -= 1;
	candidate[1] += 1;
	if (this.isOnBoard(candidate)) {
	    if (!this.isOccupied(candidate)) {
		validMoves.push(candidate.slice());
		continue;
	    } else if (this.isOccupiedDifferentColor(from, candidate)) {
		validMoves.push(candidate.slice());
		break;
	    } else {
		break;
	    }
	} else {
	    break;
	}
    }
    candidate = [from[0], from[1]].slice();
    // up and to the left
    for (var i = 1; i < 8; i += 1) {
	candidate[0] -= 1;
	candidate[1] -= 1;
	if (this.isOnBoard(candidate)) {
	    if (!this.isOccupied(candidate)) {
		validMoves.push(candidate.slice());
		continue;
	    } else if (this.isOccupiedDifferentColor(from, candidate)) {
		validMoves.push(candidate.slice());
		break;
	    } else {
		break;
	    }
	} else {
	    break;
	}
    }
    candidate = [from[0], from[1]].slice();
    // down and to the right
    for (var i = 1; i < 8; i += 1) {
	candidate[0] += 1;
	candidate[1] += 1;
	if (this.isOnBoard(candidate)) {
	    if (!this.isOccupied(candidate)) {
		validMoves.push(candidate.slice());
		continue;
	    } else if (this.isOccupiedDifferentColor(from, candidate)) {
		validMoves.push(candidate.slice());
		break;
	    } else {
		break;
	    }
	} else {
	    break;
	}
    }
    candidate = [from[0], from[1]];
    // down and to the left
    for (var i = 1; i < 8; i += 1) {
	candidate[0] += 1;
	candidate[1] -= 1;
	if (this.isOnBoard(candidate)) {
	    if (!this.isOccupied(candidate)) {
		validMoves.push(candidate.slice());
		continue;
	    } else if (this.isOccupiedDifferentColor(from, candidate)) {
		validMoves.push(candidate.slice());
		break;
	    } else {
		break;
	    }
	} else {
	    break;
	}
    }
    return validMoves;
}

ChessBoard.prototype.getValidPawnMoves = function(from) {
    var validMoves = [];
    if (this.isWhite(from)) {
	var candidate = [from[0] - 1, from[1]];
	if (this.isOnBoard(candidate) && !this.isOccupied(candidate)) {
	    validMoves.push(candidate);
	    candidate = [from[0] - 2, from[1]];
	    if (this.isOnBoard(candidate) && !this.isOccupied(candidate) &&
		// FIMXE:  hard-coded, but... never changes?
		(from[0] == 6)) {
		validMoves.push(candidate);
	    }
	}
	candidate = [from[0] - 1, from[1] - 1];
	if (this.isOnBoard(candidate) && 
	    this.isOccupiedDifferentColor(from, candidate)) {
	    validMoves.push(candidate);
	}
	candidate = [from[0] - 1, from[1] + 1];
	if (this.isOnBoard(candidate) && 
	    this.isOccupiedDifferentColor(from, candidate)) {
	    validMoves.push(candidate);
	}
    } else if (this.isBlack(from)) {
	var candidate = [from[0] + 1, from[1]];
	if (this.isOnBoard(candidate) && !this.isOccupied(candidate)) {
	    validMoves.push(candidate);
	    candidate = [from[0] + 2, from[1]];
	    if (this.isOnBoard(candidate) && !this.isOccupied(candidate) &&
		// FIMXE:  hard-coded, but... never changes?
		(from[0] == 1)) {
		validMoves.push(candidate);
	    }
	}
	candidate = [from[0] + 1, from[1] + 1];
	if (this.isOnBoard(candidate) && 
	    this.isOccupiedDifferentColor(from, candidate)) {
	    validMoves.push(candidate);
	}
	candidate = [from[0] + 1, from[1] - 1];
	if (this.isOnBoard(candidate) && 
	    this.isOccupiedDifferentColor(from, candidate)) {
	    validMoves.push(candidate);
	}
    }
    // FIXME:  en passent
    // FIXME:  promotion
    return validMoves;
};

module.exports = ChessBoard;

var board = new ChessBoard();
board.print();
var foo = board.getPos('a', 1);
console.log(foo);

while (true) {
    var move = board.readConsoleMove();
    if ((move === null) || (move === "")) continue;
    var result = board.move(move);
    if (!result) {
	console.log("Invalid move.")
    }
    board.print(move);
}
