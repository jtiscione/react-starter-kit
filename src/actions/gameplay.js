import { NEW_GAME, MAKE_MOVE } from '../constants';

export function createNewGameAction(username, side = 'white') {
  return {
    type: NEW_GAME,
    payload: {
      username,
      side,
    },
  };
}

export function createMakeMoveAction(username, move) {
  return {
    type: MAKE_MOVE,
    payload: {
      username,
      move,
    },
  };
}
