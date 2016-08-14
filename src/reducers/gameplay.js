import { NEW_GAME, MAKE_MOVE } from '../constants';

import {newGame, makeMove} from '../core/chess/game.js';

export default function gameplay(state = {}, action) {
  switch (action.type) {

    case NEW_GAME:
      return newGame(state, action.payload.username);
    case MAKE_MOVE:
      return state.update('makeMove',
        gameState => makeMove(gameState,
          action.payload.username,
          action.payload.move)
      );
      // or
      return makeMove(state, username, move);

    default:
      return state;
  }
}
