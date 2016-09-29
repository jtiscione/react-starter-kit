import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './MoveHistoryTable.css';

import {Table} from 'react-bootstrap';

import {gameFromImmutable} from '../../store/model/gameState.js';
import MoveHistoryTableCell from '../MoveHistoryTableCell';

class MoveHistoryTable extends Component {

  static propTypes = {
    clientStoreID: PropTypes.string.isRequired,
    gameID: PropTypes.string.isRequired,
    gameplay: PropTypes.object.isRequired,
    dispatchMoveCursor: PropTypes.func.isRequired
  };

  constructor(...args) {
    super(...args);
  }

  clickFunction(moveNum) {
    return () => {
      this.props.dispatchMoveCursor(this.props.clientStoreID, this.props.gameID, moveNum);
    }
  }

  render() {
    const immutable = this.props.gameplay.getIn([this.props.clientStoreID, 'games', this.props.gameID]);
    const gameState = gameFromImmutable(immutable);

    const history = gameState.history;
    while (history.length % 1 || history.length < 40) {
      history.push(null);
    }
    const cursor = gameState.cursor;

    const rows = [];

    for (let i = 0; i < history.length; i+=2) {
      const moveWhite = history[i], moveBlack = history[i+1];
      const moveWhiteSAN = moveWhite ? moveWhite.san : '';
      const moveBlackSAN = moveBlack ? moveBlack.san : '';
      const fullMoveNumber = 1 + i/2;
      rows.push(<tr key={fullMoveNumber}>
        <td>{fullMoveNumber}</td>
        <MoveHistoryTableCell side="white"
                              san={moveWhiteSAN}
                              faint={i>= cursor}
                              hot={i===cursor-1}
                              clickFunction={this.clickFunction(i+1).bind(this)}
        />
        <MoveHistoryTableCell side="black"
                              san={moveBlackSAN}
                              faint={(i+1)>= cursor}
                              hot={(i+1)===cursor-1}
                              clickFunction={history.length % 1 ? ()=>{} : this.clickFunction(i+2).bind(this)}
        />
      </tr>);
    }

    return (
      <div className={s.outer}>
        <Table condensed>
          <tbody>
            <tr>
              <td className={s.numbercolumn}>#</td>
              <td className={s.movecolumn}>White</td>
              <td className={s.movecolumn}>Black</td>
            </tr>
            {rows}
          </tbody>
        </Table>
      </div>
    );
  }

}

export default withStyles(s)(MoveHistoryTable);
