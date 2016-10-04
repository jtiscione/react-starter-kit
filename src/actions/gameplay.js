import {
  NEW_GAME,
  MAKE_MOVE,
  MOVE_CURSOR,
  SET_GAME_EVALUATOR,
} from '../constants';

export function newGameAction(origin, clientID, gameID) {
  return {
    type: NEW_GAME,
    payload: {
      origin,
      clientID,
      gameID,
    },
  };
}

export function makeMoveAction(origin, clientID, gameID, move, evaluator) {
  return {
    type: MAKE_MOVE,
    payload: {
      origin,
      clientID,
      gameID,
      move,
      evaluator
    },
  };
}

export function moveCursorAction(origin, clientID, gameID, cursor) {
  return {
    type: MOVE_CURSOR,
    payload: {
      origin,
      clientID,
      gameID,
      cursor,
    },
  };
}

export function setGameEvaluatorAction(origin, clientID, gameID, evaluator) {
  return {
    type: SET_GAME_EVALUATOR,
    payload: {
      origin,
      clientID,
      gameID,
      evaluator
    }
  };
}
