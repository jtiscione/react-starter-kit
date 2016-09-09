import { INITIALIZE_GAMES, NEW_GAME, MAKE_MOVE } from '../constants';

import {fromJS, Map} from 'immutable';

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
      //return fromJS(Object.assign({}, state, { games }));
      //gameID = action.payload.gameID;
      return Object.assign({}, state, {games});
      //return state.set('games', state.get('games').set(gameID, fromJS(new GameState())));
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
      // gameID = action.payload.gameID;
      // const move = action.payload.move;
      // const gameData = state.get('games').get(gameID);
      // if (gameData) {
      //   const gameDataJS = gameData.toJS();
      //   const gameState = new GameState(
      //     gameDataJS.initialFEN,
      //     gameDataJS.history,
      //     gameDataJS.cursor,
      //   )
      //   const next = game.makeMove(move);
      //   return state.set('games', state.get('games').set(gameID, fromJS(next)));
      // }
      return state; // failure
    default:
      return state;
  }
}
