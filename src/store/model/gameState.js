import Chess from '../../libs/chess.js';

export const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export class GameState {
  constructor(_initialFEN = DEFAULT_FEN, _history = [], _cursor) {
    this.initialFEN = _initialFEN;
    this.history = JSON.parse(JSON.stringify(_history));
    if (_cursor === undefined) {
      this.cursor = this.history.length;
    } else {
      this.cursor = _cursor;
    }
  }

  toDynamicState() {
    const chess = new Chess(this.initialFEN);
    for (let c = 0; c < this.cursor; c++) {
      chess.move(this.history[c].san);
    }
    return chess;
  }

  legalMoves() {
    const chess = this.toDynamicState();
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

  makeMove(move) {
    const chess = this.toDynamicState();
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
      return new GameState(this.initialFEN, truncHistory, this.cursor + 1);
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
    return this.toDynamicState().pgn();
  }

  back() {
    if (this.cursor === 0) {
      return null;
    }
    return new GameState(this.initialFEN, this.history, this.cursor - 1);
  }

  forward() {
    if (this.cursor >= this.history.length) {
      return null;
    }
    return new GameState(this.initialFEN, this.history, this.cursor + 1);
  }

  toStart() {
    return new GameState(this.initialFEN, this.history, 0);
  }

  toEnd() {
    return new GameState(this.initialFEN, this.history);
  }
}

export function createGameState({ initialFEN, history, cursor }) {
  return new GameState(initialFEN, history, cursor);
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
