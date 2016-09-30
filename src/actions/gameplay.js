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

export function createNewGameAction(clientID, gameID) {
  return {
    type: NEW_GAME,
    clientID,
    payload: {
      gameID,
    },
  };
}

export function createMakeMoveAction(clientID, gameID, move) {
  return {
    type: MAKE_MOVE,
    clientID,
    payload: {
      gameID,
      move,
    },
  };
}

export function createMoveCursorAction(clientID, gameID, cursor) {
  return {
    type: MOVE_CURSOR,
    clientID,
    payload: {
      gameID,
      cursor,
    },
  };
}
