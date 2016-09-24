import { INITIALIZE_GAMES,
        NEW_GAME,
        MAKE_MOVE,
        MOVE_CURSOR
      } from '../constants';

import {Map} from 'immutable';

import {
  gameFromImmutable,
  GameState,
} from '../store/model/gameState.js';

export default function gameplay(state = Map(), action) {
  let gameID = null;
  let gameData = null;
  switch (action.type) {
    case INITIALIZE_GAMES:
      return state.set('games', Map());
    case NEW_GAME:
      gameID = action.payload.gameID;
      return state.setIn(['games', gameID], new GameState().toImmutable());
    case MAKE_MOVE:
      gameID = action.payload.gameID;
      const move = action.payload.move;
      gameData = state.getIn(['games', gameID]);
      if (gameData) {
        const next = gameFromImmutable(gameData).makeMove(move);
        return state.setIn(['games', gameID], next.toImmutable());
      }
      return state; // failure
    case MOVE_CURSOR:
      gameID = action.payload.gameID;
      gameData = state.getIn(['games', gameID]);
      if (gameData) {
        const gameState = gameFromImmutable(gameData);
        const next = gameState.moveCursor(action.payload.cursor);
        return state.setIn(['games', gameID], next.toImmutable());
      }
    default:
      return state;
  }
}
