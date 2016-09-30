import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './MoveHistoryTable.css';

import {Table} from 'react-bootstrap';

import {gameFromImmutable} from '../../store/model/gameState.js';
import MoveHistoryTableCell from '../MoveHistoryTableCell';
import PlayButtons from '../PlayButtons';

function MoveHistoryTable({ clientID, gameID, gameplay, dispatchMoveCursor}) {


  function clickFunction(moveNum) {
    return () => {
      dispatchMoveCursor(clientID, gameID, moveNum);
    }
  }


  const immutable = gameplay.getIn([clientID, 'games', gameID]);
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
                            clickFunction={clickFunction(i+1)}
      />
      <MoveHistoryTableCell side="black"
                            san={moveBlackSAN}
                            faint={(i+1)>= cursor}
                            hot={(i+1)===cursor-1}
                            clickFunction={history.length % 1 ? ()=>{} : clickFunction(i+2)}
      />
    </tr>);
  }

  return (
    <div className={s.outer}>
      <Table condensed bsClass={"table "+s.no_bottom_margin}>
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
    gameplay: PropTypes.object.isRequired,
    dispatchMoveCursor: PropTypes.func.isRequired
  };

export default withStyles(s)(MoveHistoryTable);
