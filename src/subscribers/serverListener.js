import { GameState, gameFromImmutable } from '../store/model/gameState.js';

import { createMakeMoveAction, createSetGameEvaluatorAction } from '../actions/gameplay.js';

export default (store, BOOK) => {
  return (() => {
    const state = store.getState();

    const gameplay = state.get('gameplay');

    for (let [clientID, value] of gameplay.entries()) {
      const games = value.get('games');
      for (let [gameID, immutableGame] of games.entries()) {
        const game = gameFromImmutable(immutableGame);
        if (game.evaluator == 'book') {
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
                let bookMove = null;
                if (book) {
                  // Tally up wins, losses, draws
                  const slotArray = [];
                  for (let possibleMove in book) {
                    if (possibleMove == 's' || possibleMove == 'game') {
                      continue;
                    }
                    const [whiteWins, blackWins, draws] = book[possibleMove].s;
                    let wins = (chessjs.turn == 'w' ? whiteWins : blackWins);
                    for (let i=0; i < (2 * wins + draws); i++) {
                      slotArray.push(possibleMove);
                    }
                  }
                  if (slotArray.length > 0) {
                    // pick a random element from slotArray
                    const i = Math.floor(slotArray.length * Math.random());
                    bookMove = slotArray[i];
                  }
                }
                if (bookMove === null) {
                  // Mark the game as awaiting a move from the engine
                  console.log("Out of book.");
                  store.dispatch(createSetGameEvaluatorAction('server', clientID, gameID, 'engine'));
                } else {
                  // Found a book move
                  console.log("Found book move: " + bookMove);
                  store.dispatch(createMakeMoveAction('server', clientID, gameID, bookMove, 'player'));
                }
              }
            }
          }
        }
      }
    }

  });
}
