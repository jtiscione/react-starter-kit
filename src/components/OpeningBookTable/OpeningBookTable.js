import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OpeningBookTable.css';
import {gameFromImmutable} from '../../store/model/gameState.js';
import OpeningBookEntry from '../OpeningBookEntry';

function OpeningBookTable({ clientID, gameID, gameplay, dispatchMakeMove, dispatchSetHighlightSAN}) {

  function clickFunction(san) {
    return () => {
      dispatchMakeMove(clientID, gameID, san);
    }
  }

  function mouseEnterFunction(san) {
    return () => {
      dispatchSetHighlightSAN(clientID, gameID, san);
    }
  }

  function mouseLeaveFunction() {
    return () => {
      dispatchSetHighlightSAN(clientID, gameID, null);
    }
  }

  const gameData = gameplay.getIn([clientID, 'games', gameID]);

  if (gameData) {
    const game = gameFromImmutable(gameData);
    const bookMoves = (game.history.length === 0 ? game.initialBookMoves : game.history[game.cursor - 1].bookMoves);
    if (bookMoves !== null) {
      if (bookMoves.length === 0 ) {
        return <div className={s.outer}>
          <div className={s.message}>
            OUT OF BOOK.
          </div>
        </div>;
      }
      let totalGames = 0;
      bookMoves.forEach((e) => {
        totalGames += (e.whiteWins + e.blackWins + e.draws);
      });
      const rows =
            bookMoves.map((e, i) => <OpeningBookEntry key = {i}
                                                 san = {e.san}
                                                 whiteWins = {e.whiteWins}
                                                 blackWins = {e.blackWins}
                                                 draws = {e.draws}
                                                 totalGames = {totalGames}
                                                 clickFunction = {clickFunction(e.san)}
                                                 mouseEnterFunction={mouseEnterFunction(e.san)}
                                                 mouseLeaveFunction={mouseLeaveFunction()} />);
      return (
        <div className={s.outer}>
            {rows}
        </div>
      );
    }
  }

  return <div className={s.outer}>
            <div className={s.message}>
              OUT OF BOOK.
            </div>
          </div>

}

OpeningBookTable.propTypes = {
  clientID: PropTypes.string.isRequired,
  gameID: PropTypes.string.isRequired,
  gameplay: PropTypes.object.isRequired,
  dispatchMakeMove: PropTypes.func.isRequired,
  dispatchSetHighlightSAN: PropTypes.func.isRequired,
};

export default withStyles(s)(OpeningBookTable);

