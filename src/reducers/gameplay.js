import { Map } from 'immutable';
import { INITIALIZE_GAMES,
        NEW_GAME,
        MAKE_MOVE,
        MOVE_CURSOR,
        SET_GAME_EVALUATOR,
        SET_INITIAL_BOOK_MOVES,
        SET_BOOK_MOVES,
        SET_SCORE_DATA,
        SET_HIGHLIGHT_SAN,
      } from '../constants';
import {
  gameFromImmutable,
  GameState,
} from '../store/model/gameState';

export default function gameplay(state = Map(), action) {
  let gameID = null;
  let clientID = null;
  let gameData = null;
  let gameState = null;
  if (action.payload) {
    clientID = action.payload.clientID;
    gameID = action.payload.gameID;
    if (gameID && clientID) {
      gameData = state.getIn([clientID, 'games', gameID]);
      if (gameData) {
        gameState = gameFromImmutable(gameData);
      }
    }
  }

  switch (action.type) {
    case INITIALIZE_GAMES:
      return state.setIn([clientID, 'games'], Map());
    case NEW_GAME: // eslint-disable-line no-case-declarations
      if (!state.get(clientID)) {
        state = state.set(clientID, Map()); // eslint-disable-line no-param-reassign
      }
      if (!state.get(clientID).get('games')) {
        state = state.setIn([clientID, 'games'], Map()); // eslint-disable-line no-param-reassign
      }
      const newGameObject = new GameState();
      if (action.payload.level) {
        newGameObject.setLevel(action.payload.level);
      }
      if (action.payload.white) {
        newGameObject.setWhite(action.payload.white);
      }
      if (action.payload.black) {
        newGameObject.setBlack(action.payload.black);
      }
      if (newGameObject.black === 'YOU' && newGameObject.white === 'COMPUTER') {
        newGameObject.setEvaluator('book');
      }
      return state.setIn([clientID, 'games', gameID], newGameObject.toImmutable());
    case MAKE_MOVE:
      if (gameState) {
        gameState.makeMove(action.payload.move, action.payload.evaluator);
        // eslint-disable-next-line no-param-reassign
        state = state.setIn([clientID, 'games', gameID], gameState.toImmutable());
      }
      return state;
    case MOVE_CURSOR:
      if (gameState) {
        gameState.moveCursor(action.payload.cursor);
        return state.setIn([clientID, 'games', gameID], gameState.toImmutable());
      }
      return state;
    case SET_GAME_EVALUATOR:
      if (gameState) {
        gameState.setEvaluator(action.payload.evaluator);
        return state.setIn([clientID, 'games', gameID], gameState.toImmutable());
      }
      return state;
    case SET_INITIAL_BOOK_MOVES:
      if (gameState) {
        gameState.setInitialBookMoves(action.payload.initialBookMoves);
      }
      return state.setIn([clientID, 'games', gameID], gameState.toImmutable());
    case SET_BOOK_MOVES: {
      if (gameState) {
        gameState.setBookMoves(action.payload.books);
        return state.setIn([clientID, 'games', gameID], gameState.toImmutable());
      }
      return state;
    }
    case SET_SCORE_DATA:
      if (gameState) {
        gameState.setScoreData(action.payload.cursor,
                                action.payload.score,
                                action.payload.mate,
                                action.payload.pv,
                                action.payload.bestMove);
        return state.setIn([clientID, 'games', gameID], gameState.toImmutable());
      }
      return state;
    case SET_HIGHLIGHT_SAN: {
      if (gameState) {
        gameState.setHighlightSAN(action.payload.san);
        return state.setIn([clientID, 'games', gameID], gameState.toImmutable());
      }
      return state;
    }
    default:
      return state;
  }
}
