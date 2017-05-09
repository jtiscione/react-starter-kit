import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Table } from 'react-bootstrap';
import { moveCursorAction } from '../../actions/gameplay';
import { gameFromImmutable } from '../../store/model/gameState';
import MoveHistoryTableCell from '../MoveHistoryTableCell';
import PlayButtons from '../PlayButtons';
import s from './MoveHistoryTable.css';

function MoveHistoryTable({ clientID, gameID, gameplay, dispatchMoveCursor }) {
  function clickFunction(moveNum) {
    return () => {
      dispatchMoveCursor(clientID, gameID, moveNum);
    };
  }

  const immutable = gameplay.getIn([clientID, 'games', gameID]);
  const gameState = gameFromImmutable(immutable);

  const history = gameState.history;
  while (history.length % 1 || history.length < 40) {
    history.push(null);
  }
  const cursor = gameState.cursor;

  const rows = [];

  for (let i = 0; i < history.length; i += 2) {
    const moveWhite = history[i];
    const moveBlack = history[i + 1];
    const moveWhiteSAN = moveWhite ? moveWhite.san : '';
    const moveBlackSAN = moveBlack ? moveBlack.san : '';
    const fullMoveNumber = 1 + (i / 2);
    if (fullMoveNumber > 1 && moveWhiteSAN === '' && moveBlackSAN === '') {
      break;
    }
    rows.push(<tr key={fullMoveNumber}>
      <td>{ fullMoveNumber }</td>
      <MoveHistoryTableCell
        side="white"
        san={moveWhiteSAN}
        faint={i >= cursor}
        hot={i === cursor - 1}
        clickFunction={clickFunction(i + 1)}
      />
      <MoveHistoryTableCell
        side="black"
        san={moveBlackSAN}
        faint={(i + 1) >= cursor}
        hot={(i + 1) === cursor - 1}
        clickFunction={history.length % 1 ? () => {} : clickFunction(i + 2)}
      />
    </tr>);
  }

  return (
    <div className={s.outer}>
      <Table condensed bsClass={`table ${s.no_bottom_margin}`}>
        <tbody>
          <tr>
            <td className={s.numbercolumn}>#</td>
            <td className={s.movecolumn}>White</td>
            <td className={s.movecolumn}>Black</td>
          </tr>
          {rows}
        </tbody>
      </Table>
      <PlayButtons
        clientID={clientID}
        gameID={gameID}
        gameplay={gameplay}
        dispatchMoveCursor={dispatchMoveCursor}
      />
    </div>
  );
}

MoveHistoryTable.propTypes = {
  clientID: PropTypes.string.isRequired,
  gameID: PropTypes.string.isRequired,
  gameplay: PropTypes.object.isRequired,    // eslint-disable-line react/forbid-prop-types
  dispatchMoveCursor: PropTypes.func.isRequired,
};


const mapStateToProps = state => ({ gameplay: state.get('gameplay') });

const mapDispatchToProps = dispatch => ({
  dispatchMoveCursor: (_clientID, _gameID, cursor) => {
    dispatch(moveCursorAction('server', _clientID, _gameID, cursor));
  },
});

const MoveHistoryTableContainer = withStyles(s)(
  connect(mapStateToProps, mapDispatchToProps)(MoveHistoryTable),
);
// eslint-disable-next-line import/prefer-default-export
export { MoveHistoryTableContainer };
