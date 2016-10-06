import {
  NEW_GAME,
  MAKE_MOVE,
  MOVE_CURSOR,
  SET_GAME_EVALUATOR,
  REQUEST_BOOK_MOVES,
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

export function requestBookMovesAction(origin, clientID, gameID) {
  return {
    type: REQUEST_BOOK_MOVES,
    meta: {
      origin,
    },
    payload: {
      clientID, gameID,
    }
  };
}

export function setBookMovesAction(clientID, gameID, bookMoves) {
  return {
    type: SET_BOOK_MOVES,
    meta: {
      origin: 'server',
    },
    payload: {
      clientID, gameID, bookMoves,
    }
  };
}
