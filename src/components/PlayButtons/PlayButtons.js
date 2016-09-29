import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PlayButtons.css';
import cx from 'classnames';

import {Button, ButtonGroup, Glyphicon} from 'react-bootstrap';

import {gameFromImmutable} from '../../store/model/gameState.js';

class PlayButtons extends Component {

  static propTypes = {
    clientStoreID: PropTypes.string.isRequired,
    gameID: PropTypes.string.isRequired,
    gameplay: PropTypes.object.isRequired,
    dispatchMoveCursor: PropTypes.func.isRequired
  };

  currentCursorValue() {
    return gameFromImmutable(this.props.gameplay.getIn([this.props.clientStoreID, 'games', this.props.gameID])).cursor;
  }

  historyLength() {
    return gameFromImmutable(this.props.gameplay.getIn([this.props.clientStoreID, 'games', this.props.gameID])).history.length;
  }

  stepBack() {
    this.props.dispatchMoveCursor(this.props.clientStoreID, this.props.gameID, this.currentCursorValue()-1);
  }

  stepForward() {
    this.props.dispatchMoveCursor(this.props.clientStoreID, this.props.gameID, this.currentCursorValue()+1);
  }

  moveToStart() {
    this.props.dispatchMoveCursor(this.props.clientStoreID, this.props.gameID, 0);
  }

  moveToEnd() {
    this.props.dispatchMoveCursor(this.props.clientStoreID, this.props.gameID, this.historyLength());
  }

  render() {
    const ccv = this.currentCursorValue(), histLength = this.historyLength();
    const cannotMoveBack = (ccv === 0);
    const cannotMoveForward = (ccv === histLength);
    return(
      <div className={cx(["panel-footer","clearfix", "btn-block", s.nowrap, s.borderbox])}>
        <ButtonGroup justified>
          <Button bsClass={cannotMoveBack ? cx(s.fatbutton, s.disabledbutton) : s.fatbutton} onClick={this.moveToStart.bind(this)}>
            <Glyphicon glyph="fast-backward" />
          </Button>
          <Button bsClass={cannotMoveBack ? cx(s.fatbutton, s.disabledbutton) : s.fatbutton} onClick={this.stepBack.bind(this)}>
            <Glyphicon glyph="step-backward" />
          </Button>
          <Button  bsClass={cannotMoveForward ? cx(s.fatbutton, s.disabledbutton) : s.fatbutton} onClick={this.stepForward.bind(this)}>
            <Glyphicon glyph="step-forward" />
          </Button>
          <Button  bsClass={cannotMoveForward ? cx(s.fatbutton, s.disabledbutton) : s.fatbutton} onClick={this.moveToEnd.bind(this)}>
            <Glyphicon glyph="fast-forward" />
          </Button>
        </ButtonGroup>
      </div>
    );
  }
}

export default withStyles(s)(PlayButtons);
