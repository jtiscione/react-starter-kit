import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PlayButtons.css';
import cx from 'classnames';

import {Button, ButtonGroup, Glyphicon} from 'react-bootstrap';

import {gameFromImmutable} from '../../store/model/gameState.js';


function PlayButtons({clientID, gameID, gameplay, dispatchMoveCursor}) {

  function currentCursorValue() {
    return gameFromImmutable(gameplay.getIn([clientID, 'games', gameID])).cursor;
  }

  function historyLength() {
    return gameFromImmutable(gameplay.getIn([clientID, 'games', gameID])).history.length;
  }

  function stepBack() {
    dispatchMoveCursor(clientID, gameID, currentCursorValue()-1);
  }

  function stepForward() {
    dispatchMoveCursor(clientID, gameID, currentCursorValue()+1);
  }

  function moveToStart() {
    dispatchMoveCursor(clientID, gameID, 0);
  }

  function moveToEnd() {
    dispatchMoveCursor(clientID, gameID, historyLength());
  }

  const ccv = currentCursorValue(), histLength = historyLength();
  const cannotMoveBack = (ccv === 0);
  const cannotMoveForward = (ccv === histLength);
  return(
    <div className={cx(["panel-footer","clearfix", "btn-block", s.nowrap, s.borderbox])}>
      <ButtonGroup justified>
        <Button bsClass={cannotMoveBack ? cx(s.fatbutton, s.disabledbutton) : s.fatbutton} onClick={moveToStart}>
          <Glyphicon glyph="fast-backward" />
        </Button>
        <Button bsClass={cannotMoveBack ? cx(s.fatbutton, s.disabledbutton) : s.fatbutton} onClick={stepBack}>
          <Glyphicon glyph="step-backward" />
        </Button>
        <Button  bsClass={cannotMoveForward ? cx(s.fatbutton, s.disabledbutton) : s.fatbutton} onClick={stepForward}>
          <Glyphicon glyph="step-forward" />
        </Button>
        <Button  bsClass={cannotMoveForward ? cx(s.fatbutton, s.disabledbutton) : s.fatbutton} onClick={moveToEnd}>
          <Glyphicon glyph="fast-forward" />
        </Button>
      </ButtonGroup>
    </div>
  );
}

PlayButtons.propTypes = {
  clientID: PropTypes.string.isRequired,
  gameID: PropTypes.string.isRequired,
  gameplay: PropTypes.object.isRequired,
  dispatchMoveCursor: PropTypes.func.isRequired
};

export default withStyles(s)(PlayButtons);
