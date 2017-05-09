import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OpeningBookTable.css';
import { makeMoveAction, setHighlightSANAction } from '../../actions/gameplay';
import { gameFromImmutable } from '../../store/model/gameState';
import OpeningBookEntry from '../OpeningBookEntry';

class OpeningBookTable extends React.Component {

  render() {
    const { clientID, gameID, gameplay, dispatchMakeMove, dispatchSetHighlightSAN } = this.props;

    function clickFunction(san) {
      return () => {
        const immGame = gameplay.getIn([clientID, 'games', gameID]);
        const game = gameFromImmutable(immGame);
        const turn = game.toChessObject().turn();
        if ((game.white === 'YOU' && turn === 'w') || (game.black === 'YOU' && turn === 'b')) {
          dispatchMakeMove(clientID, gameID, san);
        }
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
}

OpeningBookTable.propTypes = {
  clientID: PropTypes.string.isRequired,
  gameID: PropTypes.string.isRequired,
  gameplay: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  dispatchMakeMove: PropTypes.func.isRequired,
  dispatchSetHighlightSAN: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ gameplay: state.get('gameplay') });

const mapDispatchToProps = dispatch => ({
  dispatchMakeMove: (_clientID, _gameID, move) => {
    dispatch(makeMoveAction('server', _clientID, _gameID, move, 'book'));
  },
  dispatchSetHighlightSAN: (_clientID, _gameID, san) => {
    dispatch(setHighlightSANAction(_clientID, _gameID, san));
  },
});

const OpeningBookTableContainer = withStyles(s)(
  connect(mapStateToProps, mapDispatchToProps)(OpeningBookTable),
);
// eslint-disable-next-line import/prefer-default-export
export { OpeningBookTableContainer };
