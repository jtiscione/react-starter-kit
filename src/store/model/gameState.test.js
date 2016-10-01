import {
  DEFAULT_FEN,
  GameState,
  fromPGN,
  legalTargetSquares,
} from './gameState.js';

import { assert, expect } from 'chai';

describe('game logic', () => {
  const ADVANCED_FEN = 'kq6/8/8/8/8/8/8/6QK w - - 0 1';
  const E4_FEN = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
  const NF6_FEN = 'rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2';
  it('Creates a correct default argument', function() {
    const start = new GameState();
    expect(start.initialFEN).equal(DEFAULT_FEN);
    expect(start.history.length).equal(0);
    expect(start.cursor).equal(0);
  });
  it('sets an initial FEN to either an argument or default starting position', () => {
    const start = new GameState();
    const advanced = new GameState(ADVANCED_FEN);
    const posStart = start.fen();
    const posAdvanced = advanced.fen();
    expect(posStart).equal(DEFAULT_FEN);
    expect(posAdvanced).equal(ADVANCED_FEN);
  });

  it('Handles makeMove() and currentMove() correctly', () => {
    const start = new GameState();
    expect(start.makeMove('epic fail')).to.be.null;
    const e4 = start.makeMove('e4');
    const moveObject = e4.currentMove();
    expect(moveObject.san).to.equal('e4');
    const FIRST_MOVE_OBJECT = {
        san: 'e4',
        fen: E4_FEN,
        color: 'w',
        from: 'e2',
        to: 'e4',
        flags: 'b',
        piece: 'p',
    }, SECOND_MOVE_OBJECT = {
      san: 'Nf6',
      fen: NF6_FEN,
      color: 'b',
      from: 'g8',
      to: 'f6',
      flags: 'n',
      piece: 'n',
    };
    expect(e4).eql({
      white: 'YOU',
      black: 'COMPUTER',
      history: [FIRST_MOVE_OBJECT],
      initialFEN: DEFAULT_FEN,
      cursor: 1,
    });
    let Nf6 = e4.makeMove('Nf6');
    expect(Nf6).eql({
      white: 'YOU',
      black: 'COMPUTER',
      history: [FIRST_MOVE_OBJECT, SECOND_MOVE_OBJECT],
      initialFEN: DEFAULT_FEN,
      cursor: 2,
    });
    expect(Nf6.currentMove()).eql(SECOND_MOVE_OBJECT);
  });
  it('handles toPGN and fromPGN', () => {
    const start = new GameState();
    const e4 = start.makeMove('e4');
    const Nf6 = e4.makeMove('Nf6');
    const pgn = Nf6.toPGN();
    const reconstituted = fromPGN(pgn);
    expect(reconstituted).eql(Nf6);
  });

  it('generates legal moves correctly',() => {
    const start = new GameState();
    const startMoves = start.legalMoves();
    expect(startMoves.length).equal(20);
    const e4 = start.makeMove('e4');
    const e4moves = e4.legalMoves();
    expect(e4moves.length).equal(20);
  });

  it ('Finds target squares correctly', () => {
    const targetSquares = legalTargetSquares(DEFAULT_FEN, 'e2');
    assert(targetSquares.includes('e3'));
    assert(targetSquares.includes('e4'));
    expect(targetSquares.length).to.equal(2);
  });
});
