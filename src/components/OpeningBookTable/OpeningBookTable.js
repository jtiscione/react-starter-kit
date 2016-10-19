import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OpeningBookTable.css';
import {gameFromImmutable} from '../../store/model/gameState.js';
import OpeningBookEntry from '../OpeningBookEntry';

import { Table } from 'react-bootstrap';

function OpeningBookTable({ clientID, gameID, gameplay, dispatchMakeMove}) {

  function clickFunction(game, san) {
    return () => {
      if (game.cursor === game.history.length) {
        dispatchMakeMove(clientID, gameID, san);
      }
    };
  }

  const gameData = gameplay.getIn([clientID, 'games', gameID]);

  if (gameData) {
    const game = gameFromImmutable(gameData);
    const bookMoves = (game.history.length === 0 ? game.initialBookMoves : game.history[game.cursor - 1].bookMoves);
    if (bookMoves !== null) {
      if (bookMoves.length === 0 ) {
        return <div className={s.outer}>OUT OF BOOK.</div>
      }
      const rows =
            bookMoves.map((e, i) => <OpeningBookEntry key = {i}
                                                 san = {e.san}
                                                 whiteWins = {e.whiteWins}
                                                 blackWins = {e.blackWins}
                                                 draws = {e.draws}
                                                 clickFunction = {clickFunction(game, e.san)} />);
      return (
        <div className={s.outer}>
             {rows}
        </div>
      );
    }
  }

  return <div className={s.outer}>OUT OF BOOK.</div>
}

OpeningBookTable.propTypes = {
  clientID: PropTypes.string.isRequired,
  gameID: PropTypes.string.isRequired,
  gameplay: PropTypes.object.isRequired,
  dispatchMakeMove: PropTypes.func.isRequired
};

export default withStyles(s)(OpeningBookTable);

