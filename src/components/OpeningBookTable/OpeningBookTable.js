import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OpeningBookTable.css';
import { gameFromImmutable } from '../../store/model/gameState';
import OpeningBookEntry from '../OpeningBookEntry';

function OpeningBookTable(
  { clientID, gameID, gameplay, dispatchMakeMove, dispatchSetHighlightSAN },
  ) {
  function clickFunction(san) {
    return () => {
      dispatchMakeMove(clientID, gameID, san);
    };
  }

  function mouseEnterFunction(san) {
    return () => {
      dispatchSetHighlightSAN(clientID, gameID, san);
    };
  }

  function mouseLeaveFunction() {
    return () => {
      dispatchSetHighlightSAN(clientID, gameID, null);
    };
  }

  const gameData = gameplay.getIn([clientID, 'games', gameID]);

  if (gameData) {
    const game = gameFromImmutable(gameData);
    const bookMoves = (game.cursor === 0
      ? game.initialBookMoves
      : game.history[game.cursor - 1].bookMoves);
    if (bookMoves !== null) {
      if (bookMoves.length === 0) {
        return (<div className={s.outer}>
          <div className={s.message}>
            OUT OF BOOK.
          </div>
        </div>);
      }
      let totalGames = 0;
      bookMoves.forEach((e) => {
        let opening = '';
        totalGames += (e.whiteWins + e.blackWins + e.draws);
        if (e.game) {
          if (e.game.white) {
            opening = e.game.white;
          }
          if (e.game.black) {
            opening += ` / ${e.game.black}`;
          }
        }
        e.opening = opening; // eslint-disable-line no-param-reassign
      });
      const rows =
            bookMoves.map(e => <OpeningBookEntry
              key={e.san}
              san={e.san}
              whiteWins={e.whiteWins}
              blackWins={e.blackWins}
              draws={e.draws}
              totalGames={totalGames}
              opening={e.opening}
              clickFunction={clickFunction(e.san)}
              mouseEnterFunction={mouseEnterFunction(e.san)}
              mouseLeaveFunction={mouseLeaveFunction()}
            />);
      return <div className={s.outer}>{rows}</div>;
    }
  }

  return (
    <div className={s.outer}>
      <div className={s.message}>
        OUT OF BOOK.
      </div>
    </div>);
}

OpeningBookTable.propTypes = {
  clientID: PropTypes.string.isRequired,
  gameID: PropTypes.string.isRequired,
  gameplay: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  dispatchMakeMove: PropTypes.func.isRequired,
  dispatchSetHighlightSAN: PropTypes.func.isRequired,
};

export default withStyles(s)(OpeningBookTable);

