import { gameFromImmutable } from '../../store/model/gameState.js';
import { makeMoveAction } from '../../actions/gameplay.js';
import { SET_GAME_EVALUATOR } from '../../constants';

export default function createEngineMiddleware(engine) {
  const parseBestMove = (line) => {
    // See if the game is in the same state as before
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

  // eslint-disable-next-line no-unused-vars
  const parseScore = (line) => {
    const match = line.match(/score\scp\s(-?\d+)/);
    if (match) {
      return match[1];
    }
    if (line.match(/mate\s-?\d/)) {
      return 2500;
    }
    return null;
  };

  return store => next => (action) => {
    if (action.type === SET_GAME_EVALUATOR && action.payload.evaluator === 'engine') {
      const { clientID, gameID } = action.payload;
      const state = store.getState();
      const gameImmutable = state.getIn(['gameplay', clientID, 'games', gameID]);
      const game = gameFromImmutable(gameImmutable);
      const playerIsWhite = (game.white === 'YOU' && game.black === 'COMPUTER');
      const chessjs = game.toChessObject();
      if (!chessjs.game_over()) {
        if ((chessjs.turn() === 'w' && !playerIsWhite) || (chessjs.turn() === 'b' && playerIsWhite)) {
          engine.postMessage('uci');
          engine.postMessage('ucinewgame');
          engine.postMessage(`position fen ${chessjs.fen()}`);
          engine.postMessage(`go movetime ${game.level * 500}`);
          engine.onmessage = (event) => { // eslint-disable-line no-param-reassign
            console.log(`event.data: ${event.data}`); // eslint-disable-line no-console
            // Check to see if state is in sync
            const currentGame = gameFromImmutable(store.getState().getIn(['gameplay', clientID, 'games', gameID]));
            if (currentGame.fen() === game.fen()) {
              const best = parseBestMove(event.data);
              if (best) {
                const move = chessjs.move(best);
                if (move) {
                  store.dispatch(makeMoveAction('server', clientID, gameID, move, 'player'));
                }
              }
            }
          };
        }
      }
    }
    next(action);
  };
}
