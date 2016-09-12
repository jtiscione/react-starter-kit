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
      let games = state.get('games');
      games = games.set(gameID, new GameState().toImmutable());
      return state.set('games', games);
    case MAKE_MOVE:
      gameID = action.payload.gameID;
      const move = action.payload.move;
      gameData = state.get('games').get(gameID);
      if (gameData) {
        const gameState = gameFromImmutable(gameData);
        const next = gameState.makeMove(move);
        return state.set('games', state.get('games').set(gameID, next.toImmutable()));
      }
      return state; // failure
    case MOVE_CURSOR:
      gameID = action.payload.gameID;
      gameData = state.get('games').get(gameID);
      if (gameData) {
        const gameState = gameFromImmutable(gameData);
        const next = gameState.moveCursor(action.payload.cursor);
        return state.set('games', state.get('games').set(gameID, next.toImmutable()));
      }
    default:
      return state;
  }
}
