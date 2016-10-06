import { GameState, gameFromImmutable, generateInitialBookMoves, generateBookMoves } from '../store/model/gameState.js';

import { makeMoveAction, setGameEvaluatorAction, setBookMovesAction ,setInitialBookMovesAction } from '../actions/gameplay.js';

export default (store, BOOK) => {
  return (() => {
    const state = store.getState();

    const gameplay = state.get('gameplay');

    // Look for games flagged to have their next move searched for in the book
    for (let [clientID, value] of gameplay.entries()) {
      const games = value.get('games');
      for (let [gameID, immutableGame] of games.entries()) {
        const gameState = gameFromImmutable(immutableGame);
        const playerIsWhite = (gameState.white === 'YOU' && gameState.black === 'COMPUTER');
        const playerIsBlack = (gameState.white === 'COMPUTER' && gameState.black === 'YOU');
        const chessjs = gameState.toChessObject();
        if (gameState.evaluator == 'book') {
          if (gameState.history.length === gameState.cursor) {
            if (!chessjs.game_over()) {
              if ((chessjs.turn == 'w' && playerIsBlack) || (chessjs.turn() == 'b' && playerIsWhite)) {
                // ok
                var book = BOOK;
                for (let move of gameState.history) {
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
                    for (let i = 0; i < (2 * wins + draws); i++) {
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
                  store.dispatch(setGameEvaluatorAction('server', clientID, gameID, 'engine'));
                } else {
                  // Found a book move
                  console.log("Found book move: " + bookMove);
                  store.dispatch(makeMoveAction('server', clientID, gameID, bookMove, 'player'));
                }
              }
            }
          }
        } else {
          // still have gameID, gameState, gameState, chessjs
          if (gameState.initialBookMoves === null) {
            store.dispatch(setInitialBookMovesAction(clientID, gameID, _initalBookMoves, generateInitialBookMoves(BOOK)));
          }
          const books = generateBookMoves(BOOK, gameState)
          store.dispatch(setBookMovesAction(clientID, gameID, books));
        }
      }
    }
  });
}
