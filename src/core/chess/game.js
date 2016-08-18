import {List, Map} from 'immutable';

import Chess from './libs/chess.js';

const makeGame = Chess();

export const INITIAL_STATE = Map();


export function newGame(state, user, color) {
  const list = List();

  return {
    ...state,
    ["initialFEN"]: ['start'],
    ["moveList"] : list,
    ["fenList"]: list
  };

  return state;
}

export function makeMove(state, username, move) {

  let { initialFEN2, moveList2, fenList2 } = state;

  let initialFEN = state["initialFEN"];
  let moveList = state["moveList"];
  let fenList = state['fenList'];
  let game = makeGame(initialFEN);
  for (let move of moveList) {
    game.move(move);
  }
  game.move(action.algebraicMove);
  let newFEN = game.fen();
  return {
    ...state,
    ["moveList"]: moveList.concat(action.algebraicMove),
    ["fenList"]: fenList.concat(newFEN)
  };
}
