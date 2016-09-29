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

export function createNewGameAction(clientStoreID, gameID) {
  return {
    type: NEW_GAME,
    clientStoreID,
    payload: {
      gameID,
    },
  };
}

export function createMakeMoveAction(clientStoreID, gameID, move) {
  return {
    type: MAKE_MOVE,
    clientStoreID,
    payload: {
      gameID,
      move,
    },
  };
}

export function createMoveCursorAction(clientStoreID, gameID, cursor) {
  return {
    type: MOVE_CURSOR,
    clientStoreID,
    payload: {
      gameID,
      cursor,
    },
  };
}
