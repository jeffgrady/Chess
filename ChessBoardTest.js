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
    });
});
