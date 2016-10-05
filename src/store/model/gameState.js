import Chess from '../../libs/chess.js';
import {List, Map, fromJS} from 'immutable';

export const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export class GameState {

  constructor(_initialFEN = DEFAULT_FEN, _history = [], _cursor, white = 'YOU', black='COMPUTER', evaluator='player', request = '', bookMoves = {}) {
    this.initialFEN = _initialFEN;
    this.history = _history;
    if (_cursor === undefined) {
      this.cursor = this.history.length;
    } else {
      this.cursor = _cursor;
    }
    this.white = white;
    this.black = black;
    this.evaluator = evaluator;
    this.request = request;
    this.bookMoves = bookMoves;
  }

  toImmutable() {
    return Map(this).set('history', List(this.history)).set('bookMoves', fromJS(this.bookMoves));
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

  setRequest(_request) {
    this.request = _request;
  }

  setBookMoves(_bookMoves) {
    this.bookMoves = _bookMoves;
  }
}

export function gameFromImmutable(immutable) {
  return new GameState(immutable.get('initialFEN'),
                      immutable.get('history').toJS(),
                      immutable.get('cursor'),
                      immutable.get('white'),
                      immutable.get('black'),
                      immutable.get('evaluator'),
                      immutable.get('request'),
                      immutable.get('bookMoves').toJS());
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
