import {List, Map} from 'immutable';
import {expect} from 'chai';

const cjs = require('chess.js');

import {newGame} from './game.js';

describe('application logic', () => {
  it('sets an initial FEN', () => {
    console.log("HERE:");
    const state = Map();
    const chess = new cjs.Chess();
    console.log("chess: "+chess);
    expect(chess.fen()).to.equal('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  })
});
