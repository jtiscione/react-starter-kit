import {
  NEW_GAME,
  MAKE_MOVE,
  MOVE_CURSOR,
  SET_GAME_EVALUATOR,
  SET_INITIAL_BOOK_MOVES,
  SET_BOOK_MOVES,
  SET_SCORE_DATA,
  SET_HIGHLIGHT_SAN,
} from '../constants';

export function newGameAction(cc, clientID, gameID, level, white, black) {
  return {
    type: NEW_GAME,
    meta: {
      cc,
    },
    payload: {
      clientID,
      gameID,
      level,
      white,
      black,
    },
  };
}

export function makeMoveAction(cc, clientID, gameID, move, evaluator) {
  return {
    type: MAKE_MOVE,
    meta: {
      cc,
    },
    payload: {
      clientID,
      gameID,
      move,
      evaluator,
    },
  };
}

export function moveCursorAction(cc, clientID, gameID, cursor) {
  return {
    type: MOVE_CURSOR,
    meta: {
      cc,
    },
    payload: {
      clientID,
      gameID,
      cursor,
    },
  };
}

export function setGameEvaluatorAction(cc, clientID, gameID, evaluator) {
  return {
    type: SET_GAME_EVALUATOR,
    meta: {
      cc,
    },
    payload: {
      clientID,
      gameID,
      evaluator,
    },
  };
}

export function setInitialBookMovesAction(clientID, gameID, initialBookMoves) {
  return {
    type: SET_INITIAL_BOOK_MOVES,
    meta: {
      cc: 'client',
    },
    payload: {
      clientID, gameID, initialBookMoves,
    },
  };
}

export function setBookMovesAction(clientID, gameID, books) {
  return {
    type: SET_BOOK_MOVES,
    meta: {
      cc: 'client',
    },
    payload: {
      clientID, gameID, books,
    },
  };
}

export function setScoreDataAction(clientID, gameID, cursor, score, mate, pv, bestMove) {
  return {
    type: SET_SCORE_DATA,
    meta: {
      cc: 'server',
    },
    payload: {
      clientID, gameID, cursor, score, mate, pv, bestMove,
    },
  };
}

export function setHighlightSANAction(clientID, gameID, san) {
  return {
    type: SET_HIGHLIGHT_SAN,
    meta: {
      cc: 'none',
    },
    payload: {
      clientID, gameID, san,
    },
  };
}
