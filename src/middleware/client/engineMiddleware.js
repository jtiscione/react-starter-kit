import { gameFromImmutable } from '../../store/model/gameState';
import { makeMoveAction, setScoreDataAction, setGameEvaluatorAction } from '../../actions/gameplay';
import { MAKE_MOVE, SET_GAME_EVALUATOR } from '../../constants';

export default function createEngineMiddleware(enginePath) {
  const parseBestMove = (line) => {
    const match = line.match(/bestmove\s([a-h][1-8][a-h][1-8])(n|N|b|B|r|R|q|Q)?/);
    if (match) {
      const bestMove = match[1];
      const promotion = match[2];
      return {
        from: bestMove.substring(0, 2),
        to: bestMove.substring(2, 4),
        promotion,
      };
    }
    return null;
  };

  const parseScoreData = (line) => {
    const data = {
      score: null,
      mate: null,
      pv: null,
    };
    let match = line.match(/score\scp\s(-?\d+)/);
    if (match) {
      data.score = parseInt(match[1], 10);
    }

    match = line.match(/score\smate\s(\d)/);
    if (match) {
      data.mate = match[1];
    }

    match = line.match(/\spv\s(.+)\$/);
    if (match) {
      data.pv = match[1].trim();
    }
    if (data.score === null && data.mate === null && data.pv === null) {
      return null;
    }
    return data;
  };

  const doScoring = (store, clientID, gameID, game, move) => {
    const cursor = game.cursor;
    const chessjs = game.toChessObject();
    if (!chessjs.game_over()) {
      chessjs.move(move);
      const fen = chessjs.fen();
      const playingWhite = (chessjs.turn() === 'w');
      const engine = new Worker(enginePath);
      engine.postMessage('uci');
      engine.postMessage('ucinewgame');
      engine.postMessage(`position fen ${fen}`);
      engine.postMessage(`go movetime ${game.level * 500}`);
      let scoreData = null;
      engine.onmessage = (event) => { // eslint-disable-line no-param-reassign
        // Check to see if state is in sync
        const currentGame = gameFromImmutable(store.getState().getIn(['gameplay', clientID, 'games', gameID]));
        currentGame.cursor = cursor;
        if (currentGame.fen() === game.fen()) {
          const data = parseScoreData(event.data);
          if (data) {
            scoreData = data;
          }
          const best = parseBestMove(event.data);
          if (best) {
            engine.onmessage = null;
            if (scoreData !== null) {
              if (!playingWhite) {
                scoreData.score = -scoreData.score;
              }
            }
            store.dispatch(setScoreDataAction(clientID,
              gameID,
              cursor,
              fen,
              scoreData.score,
              scoreData.mate,
              scoreData.pv,
              best));
          }
        }
      };
    }
  };

  return store => next => (action) => {
    if (action.type === MAKE_MOVE) {
      const { clientID, gameID, move } = action.payload;
      const state = store.getState();
      const gameImmutable = state.getIn(['gameplay', clientID, 'games', gameID]);
      const game = gameFromImmutable(gameImmutable);
      doScoring(store, clientID, gameID, game, move);
    } else if (action.type === SET_GAME_EVALUATOR && action.payload.evaluator === 'engine') {
      const { clientID, gameID } = action.payload;
      const state = store.getState();
      const gameImmutable = state.getIn(['gameplay', clientID, 'games', gameID]);
      const game = gameFromImmutable(gameImmutable);
      const lastMove = game.history[game.cursor - 1];
      if (lastMove && lastMove.bestMove) {
        store.dispatch(makeMoveAction('server', clientID, gameID, lastMove.bestMove, 'player'));
      } else {
        setTimeout(() => {
          store.dispatch(setGameEvaluatorAction('none', clientID, gameID, 'engine'));
        }, 1000);
      }
    }
    next(action);
  };
}
