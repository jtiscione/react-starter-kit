import { GameState, gameFromImmutable } from '../model/gameState.js';

import {createMakeMoveAction} from '../../actions/gameplay.js';

export function connectStore(store) {

  const engine = new Worker("chess/engines/lozza_patches.js");

  engine.postMessage("uci");
  engine.postMessage("ucinewgame");

  store.subscribe(() => {
    const state = store.getState();
    console.log("state: "+state);
    // Check store to see if we need to fire the chess engine
    const games = state.getIn(['gameplay', 'games']);
    for (let gameID of games.keys()) {
      const gameImmutable = games.get(gameID);
      const game = gameFromImmutable(gameImmutable);
      if (game.history.length === game.cursor) {
        const playerIsWhite = (game.white === 'YOU' && game.black === 'COMPUTER');
        const playerIsBlack = (game.white === 'COMPUTER' && game.black === 'YOU');
        const chessjs = game.toChessObject();
        if (!chessjs.game_over()) {
          if ((chessjs.turn == 'w' && playerIsBlack) || (chessjs.turn() == 'b' && playerIsWhite)) {
            engine.postMessage('position fen '+chessjs.fen());
            engine.postMessage('go movetime 1');
            engine.onmessage = (event) => {
              const line = event.data;
              const best = parseBestMove(line);
              if (best !== undefined) {
                const move = chessjs.move(best);
                store.dispatch(createMakeMoveAction(gameID, move));
              }
            };
          }
        }
      }
    }
  });
};


function parseBestMove(line) {
  var match = line.match(/bestmove\s([a-h][1-8][a-h][1-8])(n|N|b|B|r|R|q|Q)?/);
  if (match) {
    var bestMove = match[1];
    var promotion = match[2];
    return {
      from: bestMove.substring(0, 2),
      to: bestMove.substring(2, 4),
      promotion: promotion
    }
  }
}


function parseScore(line) {
  var match = line.match(/score\scp\s(-?\d+)/);
  if (match) {
    return match[1];
  } else {
    if (line.match(/mate\s-?\d/)) {
      return 2500;
    }
  }
}
