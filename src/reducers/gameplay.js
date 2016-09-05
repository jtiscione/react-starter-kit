import { INITIALIZE_GAMES, NEW_GAME, MAKE_MOVE } from '../constants';

import {
  GameState,
} from '../store/model/gameState.js';

export default function gameplay(state = {}, action) {
  let gameID = null;
  switch (action.type) {
    case INITIALIZE_GAMES:
      return {
        ...state,
        games: {},
      };
    case NEW_GAME:
      gameID = action.payload.gameID;
      const games = Object.assign({}, state.games);
      games[gameID] = new GameState();
      return Object.assign({}, state, { games });
    case MAKE_MOVE:
      gameID = action.payload.gameID;
      const move = action.payload.move;
      const gameData = state.games[gameID];
      if (gameData) {
        const game = new GameState(
          gameData.initialFEN,
          gameData.history,
          gameData.cursor);
        const next = game.makeMove(move);
        const pair = {};
        pair[gameID] = next;
        const newGames = Object.assign({}, state.games, pair);
        return {
          ...state,
          games: newGames,
        };
      }
      return state; // failure
    default:
      return state;
  }
}
