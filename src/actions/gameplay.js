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

export function createNewGameAction(gameID) {
  return {
    type: NEW_GAME,
    payload: {
      gameID,
    },
  };
}

export function createMakeMoveAction(gameID, move) {
  return {
    type: MAKE_MOVE,
    payload: {
      gameID,
      move,
    },
  };
}

export function createMoveCursorAction(gameID, cursor) {
  return {
    type: MOVE_CURSOR,
    payload: {
      gameID,
      cursor,
    },
  };
}
