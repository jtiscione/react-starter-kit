import { GameState, gameFromImmutable, generateInitialBookMoves, generateBookMoves } from '../store/model/gameState.js';

import { makeMoveAction, setGameEvaluatorAction, setBookMovesAction ,setInitialBookMovesAction } from '../actions/gameplay.js';

export default (store, BOOK) => {
  return (() => {
    const state = store.getState();

    const gameplay = state.get('gameplay');

    for (let [clientID, value] of gameplay.entries()) {
      const games = value.get('games');
      for (let [gameID, immutableGame] of games.entries()) {
        // Look for games flagged to have their next move searched for in the book
        const gameState = gameFromImmutable(immutableGame);
        const playerIsWhite = (gameState.white === 'YOU' && gameState.black === 'COMPUTER');
        const playerIsBlack = (gameState.white === 'COMPUTER' && gameState.black === 'YOU');
        const chessjs = gameState.toChessObject();
        if (gameState.evaluator == 'book') {
          if (gameState.history.length === gameState.cursor) {
            if (!chessjs.game_over()) {
              if ((chessjs.turn == 'w' && playerIsBlack) || (chessjs.turn() == 'b' && playerIsWhite)) {
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
                  // Choose a random move weighted by 2 * wins + draws
                  const moveArray = [];
                  const positionArray = [];
                  let slider = 0;
                  for (let possibleMove in book) {
                    if (possibleMove == 's' || possibleMove == 'game' || possibleMove == '*') {
                      continue;
                    }
                    const [whiteWins, blackWins, draws] = book[possibleMove].s;
                    let wins = (chessjs.turn == 'w' ? whiteWins : blackWins);
                    slider += 2 * wins + draws;
                    moveArray.push(possibleMove);
                    positionArray.push(slider);
                  }
                  if (moveArray.length > 0) {
                    const randomIndex = Math.floor(slider * Math.random());
                    for (let i = 0; i < moveArray.length; i++) {
                      if (randomIndex < positionArray[i]) {
                        bookMove = moveArray[i];
                        break;
                      }
                    }
                  }
                }
                if (bookMove === null) {
                  // Mark the game as awaiting a move from the engine
                  store.dispatch(setGameEvaluatorAction('client', clientID, gameID, 'engine'));
                } else {
                  // Found a book move
                  store.dispatch(makeMoveAction('client', clientID, gameID, bookMove, 'player'));
                }
              }
            }
          }
        } else {
          // Look for games with moves having null (i.e. uncalculated) "bookMoves" fields
          // still have gameID, gameState, gameState, chessjs
          if (gameState.initialBookMoves === null) {
            store.dispatch(setInitialBookMovesAction(clientID, gameID, generateInitialBookMoves(BOOK)));
          }
          const books = generateBookMoves(BOOK, gameState);
          let foundSomething = false;
          for (let i = 0; i < books.length; i++) {
            if (books[i] !== null) {
              foundSomething = true;
            }
          }
          if (foundSomething) {
            store.dispatch(setBookMovesAction(clientID, gameID, books));
          }
        }
      }
    }
  });
}
