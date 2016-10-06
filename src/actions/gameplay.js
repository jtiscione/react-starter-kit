import {
  NEW_GAME,
  MAKE_MOVE,
  MOVE_CURSOR,
  SET_GAME_EVALUATOR,
  SET_INITIAL_BOOK_MOVES,
  SET_BOOK_MOVES
} from '../constants';

export function newGameAction(origin, clientID, gameID) {
  return {
    type: NEW_GAME,
    meta: {
      origin,
    },
    payload: {
      clientID,
      gameID,
    },
  };
}

export function makeMoveAction(origin, clientID, gameID, move, evaluator) {
  return {
    type: MAKE_MOVE,
    meta: {
      origin,
    },
    payload: {
      clientID,
      gameID,
      move,
      evaluator
    },
  };
}

export function moveCursorAction(origin, clientID, gameID, cursor) {
  return {
    type: MOVE_CURSOR,
    meta: {
      origin,
    },
    payload: {
      clientID,
      gameID,
      cursor,
    },
  };
}

export function setGameEvaluatorAction(origin, clientID, gameID, evaluator) {
  return {
    type: SET_GAME_EVALUATOR,
    meta: {
      origin,
    },
    payload: {
      clientID,
      gameID,
      evaluator
    }
  };
}

export function setInitialBookMovesAction(clientID, gameID, initialBookMoves) {
  return {
    type: SET_INITIAL_BOOK_MOVES,
    meta: {
      origin: 'server',
    },
    payload: {
      clientID, gameID, initialBookMoves
    }
  };
}

export function setBookMovesAction(clientID, gameID, books) {
  return {
    type: SET_BOOK_MOVES,
    meta: {
      origin: 'server',
    },
    payload: {
      clientID, gameID, cursor, books
    }
  };
}
