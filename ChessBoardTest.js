var assert = require('chai').assert;
var ChessBoard = require('./ChessBoard');

describe('ChessBoard', function() {
    var board;

    beforeEach(function() {
	board = new ChessBoard();
    });

    describe('ChessBoard Tests:  Pawn', function() {
	it('should move white and black pawns', function() {
	    assert.ok(board.move('e2e4'));
	    assert.ok(board.move('e7e5'));
	});
    });

    describe('ChessBoard Tests:  Knight', function() {
	it('should move white and black knights', function() {
	    assert.ok(board.move('g1f3'));
	    assert.ok(board.move('b8c6'));
	});
    });

    describe('ChessBoard Tests:  Bishop', function() {
	it('should move white and black bishops', function() {
	    assert.ok(board.move('e2e4'));
	    assert.ok(board.move('e7e5'));
	    assert.ok(board.move('f1a6'));
	    assert.ok(board.move('f8a3'));
	});
    });

    describe('ChessBoard Tests:  Rook', function() {
	it('should move white and black rooks', function() {
	    assert.ok(board.move('a2a4'));
	    assert.ok(board.move('a7a5'));
	    assert.ok(board.move('a1a3'));
	    assert.ok(board.move('a8a6'));
	    assert.ok(board.move('a3h3'));
	    assert.ok(board.move('a6h6'));
	});
    });

    describe('ChessBoard Tests:  Queen', function() {
	it('should move white and black queens', function() {
	    assert.ok(board.move('e2e4'));
	    assert.ok(board.move('e7e5'));
	    assert.ok(board.move('d1h5'));
	    assert.ok(board.move('d8h4'));
	});
    });

    describe('ChessBoard Tests:  King', function() {
	it('should move white and black kings', function() {
	    assert.ok(board.move('e2e4'));
	    assert.ok(board.move('e7e5'));
	    assert.ok(board.move('e1e2'));
	    assert.ok(board.move('e8e7'));
	});
	it('should put the white king in check', function() {
	    assert.ok(board.move('f2f4'));
	    assert.ok(board.move('e7e5'));
	    assert.ok(board.move('b2b4'));
	    assert.ok(board.move('d8h4'));
	    // Queen puts king in check
	    assert.ok(board.CHECK);
	    // Can't move when king is in check
	    assert.notOk(board.move('a2a4'));
	    // Block queen
	    assert.ok(board.move('g2g3'));
	    // Should no longer be in check
	    assert.notOk(board.CHECK);
	    assert.ok(board.move('a7a5'));
	    // Can't move to put the king in check
	    assert.notOk(board.move('g2g3'));
	});
	it('should castle king side', function() {
	    assert.ok(board.move('e2e4'));
	    assert.ok(board.move('e7e5'));
	    assert.ok(board.move('g1f3'));
	    assert.ok(board.move('g8f6'));
	    assert.ok(board.move('f1d3'));
	    assert.ok(board.move('f8d6'));
	    assert.ok(board.move('e1g1'));
	    assert.ok(board.move('e8g8'));
	    // try one extra move
	    assert.ok(board.move('g1h1'));
	    assert.ok(board.move('g8h8'));
	});
	it('should castle queen side', function() {
	    assert.ok(board.move('d2d4'));
	    assert.ok(board.move('d7d5'));
	    assert.ok(board.move('b1c3'));
	    assert.ok(board.move('b8c6'));
	    assert.ok(board.move('c1e3'));
	    assert.ok(board.move('c8e6'));
	    // these should fail because the queen is in the way
	    assert.notOk(board.move('e1c1'));
	    assert.notOk(board.move('e8c8'));
	    assert.ok(board.move('d1d2'));
	    assert.ok(board.move('d8d7'));
	    assert.ok(board.move('e1c1'));
	    assert.ok(board.move('e8c8'));
	    // try one extra move
	    assert.ok(board.move('c1b1'));
	    assert.ok(board.move('c8b8'));
	});
	it('should prevent castling out of or through check', function() {
	    assert.ok(board.move('e2e4'));
	    assert.ok(board.move('e7e5'));
	    assert.ok(board.move('f1d3'));
	    assert.ok(board.move('g8h6'));
	    assert.ok(board.move('f2f4'));
	    assert.ok(board.move('f8c5'));
	    assert.ok(board.move('g1h3'));
	    assert.ok(board.move('f7f5'));
	    // can't castle to end up in check
	    assert.notOk(board.move('e1g1'));
	    assert.ok(board.move('d1h5'));
	    assert.ok(board.CHECK);
	    // can't castle out of check
	    assert.notOk(board.move('e8g8'));
	    assert.ok(board.move('g7g6'));
	    assert.ok(board.move('h5h6'));
	    // can't castle through check
	    assert.notOk(board.move('e8g8'));
	    assert.ok(board.move('c5b4'));
	    assert.ok(board.move('e1g1'));
	    // can't castle through check
	    assert.notOk(board.move('e8g8'));
	    // can't move into check
	    assert.notOk(board.move('e8f8'));
	});
    });
    
    describe('ChessBoard Tests:  undo/redo', function() {
	it('should undo and redo moves', function() {
	    assert.ok(board.move('e2e4'));
	    assert.ok(board.move('e7e5'));
	    assert.ok(board.undo());
	    assert.ok(board.undo());
	    assert.notOk(board.undo());
	    assert.ok(board.redo());
	    assert.ok(board.redo());
	    assert.notOk(board.redo());
	});
	it('castle king side undo/redo', function() {
	    assert.ok(board.move('e2e4'));
	    assert.ok(board.move('e7e5'));
	    assert.ok(board.move('g1f3'));
	    assert.ok(board.move('g8f6'));
	    assert.ok(board.move('f1d3'));
	    assert.ok(board.move('f8d6'));
	    assert.ok(board.move('e1g1'));
	    assert.ok(board.move('e8g8'));
	    // try one extra move
	    assert.ok(board.move('g1h1'));
	    assert.ok(board.move('g8h8'));
	    for (var i = 0; i < 4; i += 1) {
		assert.ok(board.undo());
	    }
	    assert.ok(board.board[0][4] == board.KING_BLACK);
	    assert.ok(board.board[7][4] == board.KING_WHITE);
	    for (var i = 0; i < 4; i += 1) {
		assert.ok(board.redo());
	    }
	    assert.ok(board.board[0][7] == board.KING_BLACK);
	    assert.ok(board.board[7][7] == board.KING_WHITE);
	});
	it('castle queen side undo/redo', function() {
	    assert.ok(board.move('d2d4'));
	    assert.ok(board.move('d7d5'));
	    assert.ok(board.move('b1c3'));
	    assert.ok(board.move('b8c6'));
	    assert.ok(board.move('c1e3'));
	    assert.ok(board.move('c8e6'));
	    // these should fail because the queen is in the way
	    assert.notOk(board.move('e1c1'));
	    assert.notOk(board.move('e8c8'));
	    assert.ok(board.move('d1d2'));
	    assert.ok(board.move('d8d7'));
	    assert.ok(board.move('e1c1'));
	    assert.ok(board.move('e8c8'));
	    // try one extra move
	    assert.ok(board.move('c1b1'));
	    assert.ok(board.move('c8b8'));
	    for (var i = 0; i < 4; i += 1) {
		assert.ok(board.undo());
	    }
	    assert.ok(board.board[0][4] == board.KING_BLACK);
	    assert.ok(board.board[7][4] == board.KING_WHITE);
	    for (var i = 0; i < 4; i += 1) {
		assert.ok(board.redo());
	    }
	    assert.ok(board.board[0][1] == board.KING_BLACK);
	    assert.ok(board.board[7][1] == board.KING_WHITE);
	});
    });
});
