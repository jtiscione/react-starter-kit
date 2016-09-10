import { INITIALIZE_GAMES, NEW_GAME, MAKE_MOVE } from '../constants';

import {Map} from 'immutable';

import {
  gameFromImmutable,
  GameState,
} from '../store/model/gameState.js';

export default function gameplay(state = Map(), action) {
  let gameID = null;
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
      const gameData = state.get('games').get(gameID);
      if (gameData) {
        const gameState = gameFromImmutable(gameData);
        const next = gameState.makeMove(move);
        return state.set('games', state.get('games').set(gameID, next.toImmutable()));
      }
      return state; // failure
    default:
      return state;
  }
}
