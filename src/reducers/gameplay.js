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
  let clientID = action.clientID;

  switch (action.type) {
    case INITIALIZE_GAMES:
      return state.setIn([clientID, 'games'], Map());
    case NEW_GAME:
      gameID = action.payload.gameID;
      if (!state.get(clientID)) {
        state = state.set(clientID, Map());
      }
      if (!state.get(clientID).get('games')) {
        state = state.setIn([clientID, 'games'], Map());
      }
      return state.setIn([clientID, 'games', gameID], new GameState().toImmutable());
    case MAKE_MOVE:
      gameID = action.payload.gameID;
      const move = action.payload.move;
      const imperative = action.payload.imperative;
      gameData = state.getIn([clientID, 'games', gameID]);
      if (gameData) {
        let next = gameFromImmutable(gameData).makeMove(move, imperative);
        state = state.setIn([clientID, 'games', gameID], next.toImmutable());
      }
      return state; // failure
    case MOVE_CURSOR:
      gameID = action.payload.gameID;
      gameData = state.getIn([clientID, 'games', gameID]);
      if (gameData) {
        const gameState = gameFromImmutable(gameData);
        const next = gameState.moveCursor(action.payload.cursor);
        return state.setIn([clientID, 'games', gameID], next.toImmutable());
      }
    default:
      return state;
  }
}
