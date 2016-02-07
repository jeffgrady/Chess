var readlineSync;
if (typeof require != 'undefined') {
    readlineSync = require('readline-sync');
}

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
    this.CHECK = false;
    this.error_message = "";
    this.BOARD_SIZE = 8;

    // FIXME:  don't forget to search move history for a draw!
    this.move_history = [];
    this.move_history_index = this.move_history.length;

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
    for (var i = 0; i < this.BOARD_SIZE; i += 1) {
	str = (this.BOARD_SIZE-i) + " |";
	for (var j = 0; j < this.BOARD_SIZE; j += 1) {
	    str += this.pieces[this.board[i][j]] + "|"
	}
	console.log(str);
	console.log("  +---+---+---+---+---+---+---+---+");
    }
};

ChessBoard.prototype.pieceAsHtml = function(piece) {
    switch (piece) {
    case this.EMPTY_SPACE:
	return '&nbsp;';
    case this.PAWN_BLACK:
	return '&#9823;';
    case this.KNIGHT_BLACK:
	return '&#9822;';
    case this.BISHOP_BLACK:
	return '&#9821;';
    case this.ROOK_BLACK:
	return '&#9820;';
    case this.QUEEN_BLACK:
	return '&#9819;';
    case this.KING_BLACK:
	return '&#9818;';
    case this.PAWN_WHITE:
	return '&#9817;';
    case this.KNIGHT_WHITE:
	return '&#9816;';
    case this.BISHOP_WHITE:
	return '&#9815;';
    case this.ROOK_WHITE:
	return '&#9814;';
    case this.QUEEN_WHITE:
	return '&#9813;';
    case this.KING_WHITE:
	return '&#9812;';
    }
    // FIXME:  error!
    return '&nbsp;'
};

ChessBoard.prototype.render = function(elt) {
    var html = "<table height=\"9\" width=\"9\"> \
      <thead> \
          <td></td> \
	  <td>a</td><td>b</td><td>c</td><td>d</td><td>e</td><td>f</td> \
	  <td>g</td><td>h</td> \
      </thead> \
<tbody>";

    var color;
    var light_color = '#EEEEEE';
    var dark_color = '#656565';
    for (var i = 0; i < this.BOARD_SIZE; i += 1) {
	html += "<tr><td>" + String(this.BOARD_SIZE-i) + "</td>";
	for (var j = 0; j < this.BOARD_SIZE; j += 1) {
	    if (((i % 2) == 0) && (j % 2) != 0) {
		color = dark_color;
	    } else {
		if (((i % 2) != 0) && (j % 2) == 0) {
		    color = dark_color;
		} else {
		    color = light_color;
		}
	    }
	    html += "<td style=\"background: " + color + "\">" +
		this.pieceAsHtml(this.board[i][j]) + "</td>";
	}
	html += "</tr>";
    }
    
    html += "</tbody></table>";
    console.log(html);
    elt.html(html);
};

ChessBoard.prototype.clearBoard = function() {
    for (var i = 0; i < this.BOARD_SIZE; i += 1) {
	for (var j = 0; j < this.BOARD_SIZE; j += 1) {
	    this.board[i][j] = this.EMPTY_SPACE;
	}
    }
};

ChessBoard.prototype.getPos = function(x, y) {
    if (['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].indexOf(x) == -1) {
	this.error_message = "Invalid move: " + x;
	return [];
    }
    if ((y < 1) || (y > this.BOARD_SIZE)) {
	this.error_message = "Invalid move: " + y;
	return [];
    }
    var y_index = this.BOARD_SIZE - y;
    var x_index = x.charCodeAt(0) - 'a'.charCodeAt(0);
    return [y_index, x_index];
};

ChessBoard.prototype.readConsoleMove = function() {
    var move = readlineSync.question('move: ').trim();
    // FIXME:  we'll support Qg5 someday...  This will need to be fixed.
    if (move.length != 4) {
	this.error_message = "Invalid move: " + move;
	return null;
    }
    if (move === 'undo') {
	return this.undo();
    } else if (move === 'redo') {
	return this.redo();
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

ChessBoard.prototype.isRook = function(pos) {
    if ((this.board[pos[0]][pos[1]] == this.ROOK_BLACK) ||
	(this.board[pos[0]][pos[1]] == this.ROOK_WHITE)) {
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

ChessBoard.prototype.isEmptySpace = function(pos) {
    if (this.board[pos[0]][pos[1]] == this.EMPTY_SPACE) {
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

ChessBoard.prototype.getOppositeColor = function() {
    if (this.TURN == this.WHITE) {
	return this.BLACK;
    } else {
	return this.WHITE;
    }
    return -1
};

ChessBoard.prototype.pieceHasMoved = function(from) {
    for (var i = 0; i < this.move_history.length; i += 1) {
	if ((this.move_history[i]['from'][0] == from[0]) &&
	    (this.move_history[i]['from'][1] == from[1])) {
	    return true;
	}
    }
    return false;
};

ChessBoard.prototype.getValidMoves = function(from, invalidMoves) {
    var validMoves = [];
    if (this.isPawn(from)) {
	validMoves = this.getValidPawnMoves(from);
    } else if (this.isKnight(from)) {
	validMoves = this.getValidKnightMoves(from);
    } else if (this.isBishop(from)) {
	validMoves = this.getValidBishopMoves(from);
    } else if (this.isRook(from)) {
	validMoves = this.getValidRookMoves(from);
    } else if (this.isQueen(from)) {
	validMoves = this.getValidQueenMoves(from);
    } else if (this.isKing(from)) {
	validMoves = this.getValidKingMoves(from, invalidMoves);
    }
    return validMoves;
};

ChessBoard.prototype.move = function(move) {
    var from = this.getPos(move[0], move[1]);
    var to = this.getPos(move[2], move[3]);
    if (this.PAWN_PROMOTION) {
	this.error_message = 'Please resolve your pawn promotion before ' +
	    'continuing';
	console.log(this.error_message);
	return false;
    }
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
    var invalidMoves = this.getAllValidMoves(this.getOppositeColor());
    var validMoves = this.getValidMoves(from, invalidMoves);
    if (validMoves == null) {
	this.error_message = "Unknown piece.";
	console.log(this.error_message);
	return false;
    }
    console.log(validMoves);
    var result = this.isMoveInList(validMoves, to);
    console.log(result);
    if (result) {
	var piece = this.board[from[0]][from[1]];
	this.board[from[0]][from[1]] = this.EMPTY_SPACE;
	var dest_space = this.board[to[0]][to[1]];
	this.board[to[0]][to[1]] = piece;
	if (this.kingIsInCheck(this.TURN)) {
	    this.error_message = "King is in check.";
	    this.board[to[0]][to[1]] = dest_space;
	    this.board[from[0]][from[1]] = piece;
	    console.log(this.error_message);
	    return false;
	} else if (this.kingIsInCheck(this.getOppositeColor())) {
	    console.log("CHECK!!!");
	    this.CHECK = true;
	} else {
	    console.log("Out of check");
	    this.CHECK = false;
	}
	// if we castled, move the rook
	var castling = this.castlingRookFixup(from, to);
	var pawn = this.testPawnPromotion(to);
	this.nextTurn();
	this.move_history[this.move_history_index] = {
	    from: from,
	    to: to,
	    piece: piece,
	    dest_space: dest_space,
	    castle: castling,
	    promotion: pawn,
	    promotion_piece: null
	};
	this.move_history_index += 1;
	// ensures we remove stale history if we called undo() a few times etc.
	this.move_history =
	    this.move_history.slice(0, this.move_history_index);
	console.log(this.move_history);
	console.log(this.move_history_index);
	return true;
    }

    return false;
};

ChessBoard.prototype.testPawnPromotion = function(to) {
    if (this.isPawn(to)) {
	if ((to[0] == 0) ||
	    (to[0] == (this.BOARD_SIZE - 1))){
	    this.PAWN_PROMOTION = true;
	    return to;
	}
    }
    return null;
};

ChessBoard.prototype.resolvePawnPromotion = function(piece) {
    var move = this.move_history[this.move_history_index - 1];
    if (typeof piece == 'undefined') {
	this.error_message = "You must choose a piece.";
	console.log(this.error_message);
	return null;
    }
    if (move['promotion'] == null) {
	this.error_message = "BUG:  error resolving pawn promotion.";
	console.log(this.error_message);
	return null;
    }
    if (this.isBlack(move['to']) &&
	((piece <= this.PAWN_BLACK) ||
	 (piece >= this.KING_BLACK))) {
	this.error_message =
	    "Please choose a black knight, bishop, rook, or queen.";
	console.log(this.error_message);
	return null;
    }
    if (this.isWhite(move['to']) &&
	((piece <= this.PAWN_WHITE) ||
	 (piece >= this.KING_WHITE))) {
	this.error_message =
	    "Please choose a white knight, bishop, rook, or queen.";
	console.log(this.error_message);
	return null;
    }
    // FIXME:  consider replacing [''] with move.promotion_piece
    //         for better type checking
    move.promotion_piece = piece;
    // FIXME:  error checking on it being a valid piece
    this.board[move['to'][0]][move['to'][1]] = piece;
    this.PAWN_PROMOTION = false;
    return piece;
};

ChessBoard.prototype.readConsolePawnPromotion = function() {
    var piece = readlineSync.question('choose your piece: ').trim();
    console.log('piece is: ');
    console.log(piece);
    // FIXME:  we'll support Qg5 someday...  This will need to be fixed.
    return Number(piece);
};

ChessBoard.prototype.undo = function() {
    if ((this.move_history_index <= 0) || (this.move_history.length <= 0)) {
	this.error_message = "End of undo history.";
	return false;
    }
    var move = this.move_history[this.move_history_index - 1];
    this.board[move['to'][0]][move['to'][1]] = move['dest_space'];
    this.board[move['from'][0]][move['from'][1]] = move['piece'];
    this.nextTurn();
    // FIXME:  promotion
    if (move['castle'] != null) {
	// FIXME:  hard-coded, but always the same?
	if (move['castle'][1] == 3) {
	    // castled queen side, move back to file 0
	    if (move['piece'] == this.KING_WHITE) {
		this.board[move['castle'][0]][0] = this.ROOK_WHITE;
	    } else {
		this.board[move['castle'][0]][0] = this.ROOK_BLACK;
	    }
	    this.board[move['castle'][0]][3] = this.EMPTY_SPACE;
	} else if (move['castle'][1] == 5) {
	    // castled king side, move back to file 0
	    if (move['piece'] == this.KING_WHITE) {
		this.board[move['castle'][0]][this.BOARD_SIZE-1] =
		    this.ROOK_WHITE;
	    } else {
		this.board[move['castle'][0]][this.BOARD_SIZE-1] =
		    this.ROOK_BLACK;
	    }
	    this.board[move['castle'][0]][5] = this.EMPTY_SPACE;
	}
    }
    this.move_history_index -= 1;
    return true;
};

ChessBoard.prototype.redo = function() {
    if ((this.move_history_index < 0) ||
	(this.move_history.length <= 0) ||
	(this.move_history_index === this.move_history.length)) {
	this.error_message = "End of redo history.";
	return false;
    }
    var move = this.move_history[this.move_history_index];
    var piece = this.board[move['from'][0]][move['from'][1]];
    this.board[move['from'][0]][move['from'][1]] = this.EMPTY_SPACE;
    var dest_space = this.board[move['to'][0]][move['to'][1]];
    this.board[move['to'][0]][move['to'][1]] = piece;
    // FIXME:  promotion
    if (move['castle'] != null) {
	// FIXME:  hard-coded, but always the same?
	if (move['castle'][1] == 3) {
	    // castled queen side, move back to file 0
	    if (move['piece'] == this.KING_WHITE) {
		this.board[move['castle'][0]][3] = this.ROOK_WHITE;
	    } else {
		this.board[move['castle'][0]][3] = this.ROOK_BLACK;
	    }
	    this.board[move['castle'][0]][0] = this.EMPTY_SPACE;
	} else if (move['castle'][1] == 5) {
	    // castled king side, move back to file 0
	    if (move['piece'] == this.KING_WHITE) {
		this.board[move['castle'][0]][5] =
		    this.ROOK_WHITE;
	    } else {
		this.board[move['castle'][0]][5] =
		    this.ROOK_BLACK;
	    }
	    this.board[move['castle'][0]][this.BOARD_SIZE-1] =
		this.EMPTY_SPACE;
	}
    }
    this.move_history_index += 1;
    return true;
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
    if ((pos[0] >= 0) && (pos[0] < this.BOARD_SIZE) &&
	(pos[1] >= 0) && (pos[1] < this.BOARD_SIZE)) {
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

ChessBoard.prototype.getAllValidMoves = function(color) {
    var validMoves = [];
    for (var i = 0; i < this.BOARD_SIZE; i += 1) {
	for (var j = 0; j < this.BOARD_SIZE; j += 1) {
	    if (this.getColor([i, j]) == color) {
		if (this.isKing([i, j])) {
		    validMoves = 
			validMoves.concat(this.getValidKingMoves([i, j], []));
		} else {
		    validMoves = 
			validMoves.concat(this.getValidMoves([i, j]));
		}
	    }
	}
    }
    return validMoves;
};

ChessBoard.prototype.castling = function(kingFrom, kingTo) {
    if ((kingFrom[1] === kingTo[1] - 2) ||
	(kingFrom[1] === kingTo[1] + 2)) {
	return true;
    }
    return false;
};

ChessBoard.prototype.castlingRookFixup = function(kingFrom, kingTo) {
    if (this.castling(kingFrom, kingTo)) {
	var rookPos;
	var rookTo;
	// king side
	if (kingFrom[1] < kingTo[1]) {
	    rookPos = [kingTo[0], kingTo[1] + 1];
	    rookTo = [rookPos[0], rookPos[1] - 2];
	} else {
	    // queen side
	    rookPos = [kingTo[0], kingTo[1] - 2];
	    rookTo = [rookPos[0], rookPos[1] + 3];
	}
	if (!this.isOnBoard(rookPos) ||
	    !this.isOnBoard(rookTo) ||
	    !this.isRook(rookPos) ||
	    !this.isEmptySpace(rookTo)) {
	    this.error_message = "BUG:  something went wrong castling.";
	    console.log(this.error_message);
	    return null;
	}
	var piece = this.board[rookPos[0]][rookPos[1]];
	this.board[rookPos[0]][rookPos[1]] = this.EMPTY_SPACE;
	var dest_space = this.board[rookTo[0]][rookTo[1]];
	this.board[rookTo[0]][rookTo[1]] = piece;
	// FIXME:  need to handle undo...
	// FIXME:  is this the right thing to return?  does it matter?
	return rookTo;
    }
    return null;
};

ChessBoard.prototype.castlingHelper = function(kingPos,
					       rookPos,
					       invalidMoves) {
    // castling
    /*
      1.  The king and the chosen rook are on the player's first rank.
          (i.e., 1 or 8)

      2.  Neither the king nor the chosen rook has previously moved.
      
      3.  There are no pieces between the king and the chosen rook.

      4.  The king is not currently in check.

      5.  The king does not pass through a square that is attacked by an
          enemy piece.

      6.  The king does not end up in check. (True of any legal move.)
    */
    var validMoves = [];
    var emptySpace1;
    var emptySpace2;
    var emptySpace3;
    // castling king side
    if (kingPos[1] < rookPos[1]) {
	emptySpace1 = [kingPos[0], kingPos[1] + 1];
	emptySpace2 = [kingPos[0], kingPos[1] + 2];
	// make this the same for king side, since we don't have
	// 3 empty spaces
	emptySpace3 = [kingPos[0], kingPos[1] + 2];
    } else  {
	// castling queen side
	emptySpace1 = [kingPos[0], kingPos[1] - 1];
	emptySpace2 = [kingPos[0], kingPos[1] - 2];
	emptySpace3 = [kingPos[0], kingPos[1] - 3];
    }
    if (this.isKing(kingPos) &&
	this.isRook(rookPos) &&
	this.isOnBoard(emptySpace1) &&
	this.isOnBoard(emptySpace2) &&
	this.isOnBoard(emptySpace3) &&
	!this.pieceHasMoved(kingPos) &&
	!this.pieceHasMoved(rookPos) &&
	this.isEmptySpace(emptySpace1) &&
	this.isEmptySpace(emptySpace2) &&
	this.isEmptySpace(emptySpace3) &&
	!this.isMoveInList(invalidMoves, emptySpace1) &&
	!this.isMoveInList(invalidMoves, emptySpace2) &&
       	!this.isMoveInList(invalidMoves, emptySpace3)) {
	validMoves.push(emptySpace2.slice());
    }
    return validMoves;
};

ChessBoard.prototype.getValidKingMoves = function(from,
						  invalidMoves) {
    var validMoves = [];
    var candidates = [[from[0] - 1, from[1] - 1],
		      [from[0] - 1, from[1]    ],
		      [from[0] - 1, from[1] + 1],
		      [from[0]    , from[1] + 1],
		      [from[0] + 1, from[1] + 1],
		      [from[0] + 1, from[1]    ],
		      [from[0] + 1, from[1] - 1],
		      [from[0]    , from[1] - 1]];
    for (var i = 0; i < candidates.length; i += 1) {
	if (this.isOnBoard(candidates[i]) &&
	    !this.isOccupiedSameColor(from, candidates[i]) &&
	    !this.isMoveInList(invalidMoves, candidates[i])) {
	    validMoves.push(candidates[i]);
	}
    }
    // castling
    if (!this.CHECK) {
	var fromKing;
	var fromRook;
	var fromRookQueenside;
	if (this.isWhite(from)) {
	    fromKing = this.getPos('e', '1');
	    fromRook = this.getPos('h', '1');
	    fromRookQueenside = this.getPos('a', '1');
	} else if (this.isBlack(from)) {
	    fromKing = this.getPos('e', '8');
	    fromRook = this.getPos('h', '8');
	    fromRookQueenside = this.getPos('a', '8');
	}
	validMoves =
	    validMoves.concat(this.castlingHelper(fromKing,
						  fromRook,
						  invalidMoves));
	validMoves =
	    validMoves.concat(this.castlingHelper(fromKing,
						  fromRookQueenside,
						  invalidMoves));
    }
    return validMoves;
};

ChessBoard.prototype.kingIsInCheck = function(color) {
    var pos = this.findKing(color);
    var opposite_color = this.WHITE;
    if (color == this.WHITE) {
	opposite_color = this.BLACK;
    }
    var validMoves = this.getAllValidMoves(opposite_color);
    return this.isMoveInList(validMoves, pos);
};

ChessBoard.prototype.findKing = function(color) {
    for (var i = 0; i < this.BOARD_SIZE; i += 1) {
	for (var j = 0; j < this.BOARD_SIZE; j += 1) {
	    if (this.isKing([i, j]) &&
		(this.getColor([i, j]) == color)) {
		return [i, j];
	    }
	}
    }
    return [];
};

ChessBoard.prototype.getValidBishopMoves = function(from) {
    var validMoves = [];
    var candidate = [from[0], from[1]].slice();
    // up and to the right
    for (var i = 1; i < this.BOARD_SIZE; i += 1) {
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
    for (var i = 1; i < this.BOARD_SIZE; i += 1) {
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
    for (var i = 1; i < this.BOARD_SIZE; i += 1) {
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
    for (var i = 1; i < this.BOARD_SIZE; i += 1) {
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

ChessBoard.prototype.getValidRookMoves = function(from) {
    var validMoves = [];
    var candidate = [from[0], from[1]].slice();
    // up
    for (var i = 1; i < this.BOARD_SIZE; i += 1) {
	candidate[0] -= 1;
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
    // down
    for (var i = 1; i < this.BOARD_SIZE; i += 1) {
	candidate[0] += 1;
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
    // left
    for (var i = 1; i < this.BOARD_SIZE; i += 1) {
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
    candidate = [from[0], from[1]];
    // right
    for (var i = 1; i < this.BOARD_SIZE; i += 1) {
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
    return validMoves;
}

ChessBoard.prototype.getValidQueenMoves = function(from) {
    var validMoves = this.getValidBishopMoves(from);
    var rookMoves = this.getValidRookMoves(from);
    validMoves = validMoves.concat(rookMoves);
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
    return validMoves;
};

if (typeof module != 'undefined') {
    module.exports = ChessBoard;
}
