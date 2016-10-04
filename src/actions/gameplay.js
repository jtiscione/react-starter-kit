import {
  NEW_GAME,
  MAKE_MOVE,
  MOVE_CURSOR,
  SET_GAME_EVALUATOR,
} from '../constants';

export function createNewGameAction(origin, clientID, gameID) {
  return {
    type: NEW_GAME,
    origin,
    clientID,
    payload: {
      gameID,
    },
  };
}

export function createMakeMoveAction(origin, clientID, gameID, move, evaluator) {
  return {
    type: MAKE_MOVE,
    origin,
    clientID,
    payload: {
      gameID,
      move,
      evaluator
    },
  };
}

export function createMoveCursorAction(origin, clientID, gameID, cursor) {
  return {
    type: MOVE_CURSOR,
    origin,
    clientID,
    payload: {
      gameID,
      cursor,
    },
  };
}

export function createSetGameEvaluatorAction(origin, clientID, gameID, evaluator) {
  return {
    type: SET_GAME_EVALUATOR,
    origin,
    clientID,
    payload: {
      gameID,
      evaluator
    }
  };
}
