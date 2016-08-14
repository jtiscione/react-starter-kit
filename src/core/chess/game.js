import {List, Map} from 'immutable';

//import {Chess} from 'chess.js';

//import {jquery} from 'jquery';

//const chjs = require("chess.js");
//const jquery = require("jquery");

//console.log("chjs:"+JSON.stringify(chjs));
//console.log("jquery:"+JSON.stringify(jquery));
/*
const req = require('chess.js');
const Chess = req.Chess;
try {
  const game = Chess();
}
catch(e) {
  console.log(e);
  console.log("Chess is: "+Chess);
}
*/
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
  let initialFEN = state["initialFEN"];
  let moveList = state["moveList"];
  let fenList = state['fenList'];
  game.reset();
  game.position(initialFEN);
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
