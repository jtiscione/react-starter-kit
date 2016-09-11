import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './MoveHistoryTable.css';

import {Table, Button, Glyphicon} from 'react-bootstrap';

import {gameFromImmutable} from '../../store/model/gameState.js';
import MoveHistoryTableCell from '../MoveHistoryTableCell';

class MoveHistoryTable extends Component {

  static propTypes = {
    gameID: PropTypes.string.isRequired
  };

  constructor(...args) {
    super(...args);
    console.log("MHTC: "+MoveHistoryTableCell);
  }


  moveToJSX(sideToMove, san) {

    console.log(san);
    // Figure out what the piece code is
  }

  render() {

    const gameState = gameFromImmutable(this.props.games.get(this.props.gameID));

    const history = gameState.history;
    if (history.length % 1) {
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
        <MoveHistoryTableCell side="white" san={moveWhiteSAN} faint={i >= cursor} hot={i===cursor-1}/>
        <MoveHistoryTableCell side="black" san={moveBlackSAN} faint={(i+1) > cursor} hot={(i+1)===cursor-1}/>
      </tr>);
    }

    return (
      <div className={s.outer}>
        <Table bordered condensed>
          <tbody>
            <tr>
              <td>#</td>
              <td className="width-forty">White</td>
              <td className="width-forty">Black</td>
            </tr>
            {rows}
          </tbody>
        </Table>
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    games: state.get('gameplay').get('games')
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchMakeMove: (gameID, move) => {
      //dispatch(createMakeMoveAction(gameID, move));
    },
  };
};

export const MoveHistoryTableContainer = withStyles(s)(connect(mapStateToProps, mapDispatchToProps)(MoveHistoryTable));
