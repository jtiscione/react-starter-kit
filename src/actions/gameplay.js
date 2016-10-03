import {INITIALIZE_GAMES,
  NEW_GAME,
  MAKE_MOVE,
  MOVE_CURSOR} from '../constants';

export function createInitializeGamesAction() {
  return {
    type: INITIALIZE_GAMES,
    payload: {},
  };
}

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

export function createMakeMoveAction(origin, clientID, gameID, move, imperative) {
  return {
    type: MAKE_MOVE,
    origin,
    clientID,
    payload: {
      gameID,
      move,
      imperative
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
