import { GameState, gameFromImmutable } from '../store/model/gameState.js';

import { createMakeMoveAction } from '../actions/gameplay.js';

export default (store, BOOK) => {
  return (() => {
    const state = store.getState();

    const gameplay = state.get('gameplay');

    for (let [clientID, value] of gameplay.entries()) {
      const games = value.get('games');
      for (let [gameID, immutableGame] of games.entries()) {
        const game = gameFromImmutable(immutableGame);
        if (game.imperative == 'book') {
          if (game.history.length === game.cursor) {
            const playerIsWhite = (game.white === 'YOU' && game.black === 'COMPUTER');
            const playerIsBlack = (game.white === 'COMPUTER' && game.black === 'YOU');
            const chessjs = game.toChessObject();
            if (!chessjs.game_over()) {
              if ((chessjs.turn == 'w' && playerIsBlack) || (chessjs.turn() == 'b' && playerIsWhite)) {
                // ok
                var book = BOOK;
                for (let move of game.history) {
                  if (book[move.san]) {
                    book = book[move.san];
                  } else {
                    book = null;
                    break;
                  }
                }
                if (book) {
                  // Tally up wins, losses, draws

                }
              }
            }
          }
        }
      }
    }

  });
}
