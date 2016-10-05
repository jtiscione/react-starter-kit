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
    payload: {
      origin,
      clientID,
      gameID,
    },
  };
}

export function makeMoveAction(origin, clientID, gameID, move, evaluator) {
  return {
    type: MAKE_MOVE,
    payload: {
      origin,
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
    payload: {
      origin,
      clientID,
      gameID,
      cursor,
    },
  };
}

export function setGameEvaluatorAction(origin, clientID, gameID, evaluator) {
  return {
    type: SET_GAME_EVALUATOR,
    payload: {
      origin,
      clientID,
      gameID,
      evaluator
    }
  };
}

export function requestBookMoves(clientID, gameID) {
  return {
    type: REQUEST_BOOK_MOVES,
    payload: {
      origin: 'client'
    }
  }
}

export function setBookMoves(origin, clientID, gameID) {
  return {
    type: SET_BOOK_MOVES,
    payload: {
      origin: 'server'
    }
  }

}
