import Chess from '../../libs/chess.js';
import {List, Map} from 'immutable';

export const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export class GameState {

  constructor(_initialFEN = DEFAULT_FEN, _history = [], _cursor, white = 'YOU', black='COMPUTER', imperative='') {
    this.initialFEN = _initialFEN;
    this.history = _history;
    if (_cursor === undefined) {
      this.cursor = this.history.length;
    } else {
      this.cursor = _cursor;
    }
    this.white = white;
    this.black = black;
    this.imperative = imperative;
  }

  toImmutable() {
    return Map(this).set('history', List(this.history));
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

  makeMove(move, imperative='') {
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
      const truncHistory = this.history.slice(0, this.cursor);
      truncHistory.push(obj);
      return new GameState(this.initialFEN, truncHistory, this.cursor + 1, this.white, this.black, imperative);
    }
    // illegal move
    return null;
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
    return new GameState(this.initialFEN, this.history, _cursor, this.white, this.black, this.imperative);
  }

  setimperative(_imperative) {
    return new GameState(this.initialFEN, this.history, this.cursor, this.white, this.black, _imperative);
  }
}

export function gameFromImmutable(immutable) {
  return new GameState(immutable.get('initialFEN'),
                      immutable.get('history').toJS(),
                      immutable.get('cursor'),
                      immutable.get('white'),
                      immutable.get('black'),
                      immutable.get('imperative'));
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
