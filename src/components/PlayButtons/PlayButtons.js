import React, { PropTypes } from 'react';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import { gameFromImmutable } from '../../store/model/gameState.js';
import s from './PlayButtons.css';

function PlayButtons({ clientID, gameID, gameplay, dispatchMoveCursor }) {
  function currentCursorValue() {
    return gameFromImmutable(gameplay.getIn([clientID, 'games', gameID])).cursor;
  }

  function historyLength() {
    return gameFromImmutable(gameplay.getIn([clientID, 'games', gameID])).history.length;
  }

  function stepBack() {
    dispatchMoveCursor(clientID, gameID, currentCursorValue() - 1);
  }

  function stepForward() {
    dispatchMoveCursor(clientID, gameID, currentCursorValue() + 1);
  }

  function moveToStart() {
    dispatchMoveCursor(clientID, gameID, 0);
  }

  function moveToEnd() {
    dispatchMoveCursor(clientID, gameID, historyLength());
  }

  const ccv = currentCursorValue();
  const histLength = historyLength();
  const cannotMoveBack = (ccv === 0);
  const cannotMoveForward = (ccv === histLength);
  return (
    <div className={cx(['panel-footer', 'clearfix', 'btn-block', s.nowrap])}>
      <ButtonGroup>
        <Button bsClass={cx('btn', 'btn-default', s.quarterwidth)} disabled={cannotMoveBack} onClick={moveToStart}>
          <Glyphicon glyph="fast-backward" />
        </Button>
        <Button bsClass={cx('btn', 'btn-default', s.quarterwidth)} disabled={cannotMoveBack} onClick={stepBack}>
          <Glyphicon glyph="step-backward" />
        </Button>
        <Button bsClass={cx('btn', 'btn-default', s.quarterwidth)} disabled={cannotMoveForward} onClick={stepForward}>
          <Glyphicon glyph="step-forward" />
        </Button>
        <Button bsClass={cx('btn', 'btn-default', s.quarterwidth)} disabled={cannotMoveForward} onClick={moveToEnd}>
          <Glyphicon glyph="fast-forward" />
        </Button>
      </ButtonGroup>
    </div>
  );
}

PlayButtons.propTypes = {
  clientID: PropTypes.string.isRequired,
  gameID: PropTypes.string.isRequired,
  gameplay: PropTypes.object.isRequired,  // eslint-disable-line react/forbid-prop-types
  dispatchMoveCursor: PropTypes.func.isRequired,
};

export default withStyles(s)(PlayButtons);
