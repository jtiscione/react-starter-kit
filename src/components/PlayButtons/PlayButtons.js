import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PlayButtons.css';
import cx from 'classnames';

import {Button, ButtonGroup, Glyphicon} from 'react-bootstrap';

import {gameFromImmutable} from '../../store/model/gameState.js';


function PlayButtons({clientStoreID, gameID, gameplay, dispatchMoveCursor}) {

  function currentCursorValue() {
    return gameFromImmutable(gameplay.getIn([clientStoreID, 'games', gameID])).cursor;
  }

  function historyLength() {
    return gameFromImmutable(gameplay.getIn([clientStoreID, 'games', gameID])).history.length;
  }

  function stepBack() {
    dispatchMoveCursor(clientStoreID, gameID, currentCursorValue()-1);
  }

  function stepForward() {
    dispatchMoveCursor(clientStoreID, gameID, currentCursorValue()+1);
  }

  function moveToStart() {
    dispatchMoveCursor(clientStoreID, gameID, 0);
  }

  function moveToEnd() {
    dispatchMoveCursor(clientStoreID, gameID, historyLength());
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
  clientStoreID: PropTypes.string.isRequired,
  gameID: PropTypes.string.isRequired,
  gameplay: PropTypes.object.isRequired,
  dispatchMoveCursor: PropTypes.func.isRequired
};

export default withStyles(s)(PlayButtons);
