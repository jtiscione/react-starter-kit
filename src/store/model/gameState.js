import { List, Map, fromJS } from 'immutable';
import Chess from '../../libs/chess';

export const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export class GameState {

  constructor(_initialFEN = DEFAULT_FEN,
    _initialBookMoves = null,
    _history = [],
    _cursor,
    _level = 1,
    _white = 'YOU',
    _black = 'COMPUTER',
    _highlightSAN = null,
    _evaluator = 'player') {
    this.initialFEN = _initialFEN;
    this.initialBookMoves = _initialBookMoves; // a bookMoves[] array for the initial position
    this.history = _history;
    if (_cursor === undefined) {
      this.cursor = this.history.length;
    } else {
      this.cursor = _cursor;
    }
    this.level = _level;
    this.white = _white;
    this.black = _black;
    this.highlightSAN = _highlightSAN;
    this.evaluator = _evaluator;
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
    for (let c = 0; c < this.cursor; c++) { // eslint-disable-line no-plusplus
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
    } else if (typeof move === 'object') {
      obj = chess.move(move);
    }
    if (obj !== null) {
      obj.fen = chess.fen();
      obj.bookMoves = null;
      this.history = this.history.slice(0, this.cursor);
      this.history.push(obj);
      this.cursor++; // eslint-disable-line no-plusplus
      this.highlightSAN = null;
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

  setLevel(_level) {
    this.level = _level;
  }

  setWhite(_white = 'YOU') {
    this.white = _white;
  }

  setBlack(_black = 'COMPUTER') {
    this.black = _black;
  }

  setEvaluator(_evaluator) {
    this.evaluator = _evaluator;
  }

  setInitialBookMoves(_bookMoves) {
    this.initialBookMoves = _bookMoves;
  }

  setBookMoves(_books) {
    for (let i = 0; i < this.history.length; i++) { // eslint-disable-line no-plusplus
      if (_books[i] !== null) {
        this.history[i].bookMoves = _books[i];
      }
    }
  }

  setScoreData(cursor, _fen, _score, _mate, _pv, _bestMove) {
    if (this.history.length > cursor && this.history[cursor].fen === _fen) {
      this.history[cursor].score = _score;
      this.history[cursor].mate = _mate;
      this.history[cursor].pv = _pv;
      this.history[cursor].bestMove = _bestMove;
    } else {
      console.error('_cursor', cursor);                    // eslint-disable-line no-console
      console.error('history.length', this.history.length); // eslint-disable-line no-console
    }
  }

  setHighlightSAN(_san = null) {
    this.highlightSAN = _san;
  }

}

export function gameFromImmutable(immutable) {
  // Check for allowed null case with initialBookMoves
  let initialBookMoves = immutable.get('initialBookMoves', null);
  initialBookMoves = (initialBookMoves ? initialBookMoves.toJS() : null);
  const history = immutable.get('history');
  const it = new GameState(immutable.get('initialFEN'),
    initialBookMoves,
    history.toJS(),
    immutable.get('cursor'),
    immutable.get('level'),
    immutable.get('white'),
    immutable.get('black'),
    immutable.get('highlightSAN'),
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
  return moves.map(move => move.to);
}

// Given an arbitrary FEN and a SAN move to highlight, return its target squares.
export function sanHighlightSquares(fen, san) {
  if (san === null) {
    return [];
  }
  const chess = new Chess(fen);
  const mv = chess.move(san);
  const { from, to } = mv;
  return [from, to];
}

export function generateInitialBookMoves(BOOK) {
  const bookMoves = [];
  for (const move in BOOK) {  // eslint-disable-line no-restricted-syntax
    if (move !== 's' && move !== 'game') {
      const [whiteWins, blackWins, draws] = BOOK[move].s;
      bookMoves.push({
        san: move,
        whiteWins,
        blackWins,
        draws,
      });
      bookMoves.sort((a, b) => {
        const aGames = a.whiteWins + a.blackWins + a.draws;
        const bGames = b.whiteWins + b.blackWins + b.draws;
        return (aGames < bGames ? 1 : -1);
      });
    }
  }
  return bookMoves;
}

// Does not alter its arguments.
// Returns an array of bookMoves[] arrays which will be converted to setBookMoves actions
export function generateBookMoves(BOOK, gameState) {
  const books = [];
  let node = BOOK;
  let outOfBook = false;
  for (const move of gameState.history) { // eslint-disable-line no-restricted-syntax
    if (node === null || node[move.san] === undefined) {
      books.push(null);
      node = null;
      continue; // eslint-disable-line no-continue
    }

    node = node[move.san];

    if (move.bookMoves !== null) {
      // it's already there, just stick a null placeholder into the returned array
      // to indicate no update is required here
      if (!outOfBook) {
        books.push(null);
      } else if (move.bookMoves.length > 0) {
        // out of book at this point; but entries are here they shouldn't be (prob. never happens)
        books.push([]);
      } else {
        books.push(null); // empty array already there
      }
      continue; // eslint-disable-line no-continue
    }

    const bookMoves = [];
    for (const possibleMove in node) { // eslint-disable-line no-restricted-syntax
      if (possibleMove === 's' || possibleMove === 'game' || possibleMove === '*') {
        continue; // eslint-disable-line no-continue
      }
      const [whiteWins, blackWins, draws] = node[possibleMove].s;
      const moveObj = {
        san: possibleMove,
        whiteWins,
        blackWins,
        draws,
      };
      if (node[possibleMove].game) {
        moveObj.game = node[possibleMove].game;
      }
      bookMoves.push(moveObj);
    }
    if (bookMoves.length === 0) {
      outOfBook = true;
    }
    bookMoves.sort((a, b) => {
      const aGames = a.whiteWins + a.blackWins + a.draws;
      const bGames = b.whiteWins + b.blackWins + b.draws;
      return (aGames < bGames ? 1 : -1);
    });
    books.push(bookMoves);
  }
  return books;
}
