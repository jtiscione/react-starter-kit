import Chess from '../../libs/chess.js';
import {List, Map, fromJS} from 'immutable';

export const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export class GameState {

  constructor(_initialFEN = DEFAULT_FEN, _initialBookMoves = null, _history = [], _cursor, white = 'YOU', black='COMPUTER', evaluator='player') {
    this.initialFEN = _initialFEN;
    this.initialBookMoves = _initialBookMoves; // the bookMoves[] array for the initial position, should always be the same
    this.history = _history;
    if (_cursor === undefined) {
      this.cursor = this.history.length;
    } else {
      this.cursor = _cursor;
    }
    this.white = white;
    this.black = black;
    this.evaluator = evaluator;
  }

  toImmutable() {
    let it = Map(this).set('history', fromJS(this.history));
    if (this.initialBookMoves !== null) {
      it = it.set('initialBookMoves', List(this.initialBookMoves));
    } else {
      it = it.set('initialBookMoves', null);
    }
    return it;
  }

  toChessObject() {
    const chess = new Chess(this.initialFEN);
    for (let c = 0; c < this.cursor; c++) {
      chess.move(this.history[c].san);
    }
    return chess;
  }

  legalMoves() {
    const chess = this.toChessObject();
    const sans = chess.moves();
    const moves = [];
    sans.forEach((san) => {
      const obj = chess.move(san);
      obj.fen = chess.fen();
      chess.undo();
      moves.push(obj);
    });
    return moves;
  }

  makeMove(move, evaluator) {
    const chess = this.toChessObject();
    let obj = null;
    if (typeof move === 'string') {
      obj = chess.move(move, { sloppy: true });
    } else {
      if (typeof move === 'object') {
        obj = chess.move(move);
      }
    }
    if (obj !== null) {
      obj.fen = chess.fen();
      obj.bookMoves = null;
      this.history = this.history.slice(0, this.cursor);
      this.history.push(obj);
      this.cursor++;
      this.evaluator = evaluator;
    }
  }

  currentMove() {
    if (this.cursor > 0) {
      return this.history[this.cursor - 1];
    }
    return null;
  }

  fen() {
    const lastMove = this.currentMove();
    return lastMove !== null ? lastMove.fen : this.initialFEN;
  }

  toPGN(includeFutureMoves = true) {
    if (includeFutureMoves) {
      return new GameState(this.initialFEN, this.history).toPGN(false);
    }
    return this.toChessObject().pgn();
  }

  moveCursor(_cursor) {
    this.cursor = _cursor;
  }

  setEvaluator(_evaluator) {
    this.evaluator = _evaluator;
  }

  setInitialBookMoves(_bookMoves) {
    this.initialBookMoves = _bookMoves;
  }

  setBookMoves(_books) {
    for (let i = 0; i < this.history.length; i++) {
      if (_books[i] !== null) {
        this.history[i].bookMoves = _books[i];
      }
    }
  }
}

export function gameFromImmutable(immutable) {
  // Check for allowed null case with initialBookMoves
  let initialBookMoves = immutable.get('initialBookMoves', null);
  initialBookMoves = ( initialBookMoves ? initialBookMoves.toJS() : null );
  const history = immutable.get('history');
  const it = new GameState(immutable.get('initialFEN'),
    initialBookMoves,
    history.toJS(),
    immutable.get('cursor'),
    immutable.get('white'),
    immutable.get('black'),
    immutable.get('evaluator'));
  return it;
}

export function fromPGN(pgn, initialFEN = DEFAULT_FEN) {
  let chess = new Chess(initialFEN);
  chess.load_pgn(pgn);
  const history = chess.history();
  chess = new Chess(initialFEN);
  const moves = [];
  history.forEach((san) => {
    const obj = chess.move(san);
    obj.fen = chess.fen();
    moves.push(obj);
  });
  return new GameState(initialFEN, moves);
}

// Given an arbitrary FEN and start square, return all legal target squares.
export function legalTargetSquares(fen, square) {
  const chess = new Chess(fen);
  const moves = chess.moves({
    square,
    verbose: true,
  });
  return moves.map((move) => {
    return move.to;
  });
}

export function generateInitialBookMoves(BOOK) {
  const bookMoves = [];
  for (let move in BOOK) {
    if (move == 's' || move == 'game') {
      continue;
    }
    let [whiteWins, blackWins, draws] = BOOK[move].s;
    bookMoves.push( {
      san: move,
      whiteWins,
      blackWins,
      draws
    });
  }
  return bookMoves;
}

// Does not alter its arguments. Returns an array of bookMoves[] arrays which will be converted to setBookMoves actions
export function generateBookMoves(BOOK, gameState) {

  const books = [];
  let node = BOOK;
  let outOfBook = false;
  for (let move of gameState.history) {
    if (move.bookMoves !== null) {
      // it's already there, just stick a null placeholder into the returned array
      // to indicate no update is required here
      if (!outOfBook) {
        books.push(null);
      } else {
        if (move.bookMoves.length > 0) {
          // we're out of book at this point; but entries are here they shouldn't be (prob. never happens)
          books.push([]);
        } else {
          books.push(null); // empty array already there
        }
      }
    } else {
      const bookMoves = [];
      if (node[move.san]) {
        node = node[move.san];
        for (let possibleMove in node) {
          if (possibleMove == 's' || possibleMove == 'game' || possibleMove == '*') {
            continue;
          }
          let [whiteWins, blackWins, draws] = node[possibleMove].s;
          bookMoves.push({
            san: possibleMove,
            whiteWins,
            blackWins,
            draws
          });
        }
      }
      if (bookMoves.length === 0) {
        outOfBook = true;
      }
      books.push(bookMoves);
    }
  }
  return books;

}
