import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PlayButtons.css';
import cx from 'classnames';

import {createMoveCursorAction} from '../../actions/gameplay.js';

import {Button, ButtonGroup, Glyphicon} from 'react-bootstrap';

import {gameFromImmutable, GameState} from '../../store/model/gameState.js';

class PlayButtons extends Component {

  static propTypes = {
    gameID: PropTypes.string.isRequired
  };

  currentCursorValue() {
    return gameFromImmutable(this.props.gameplay.get('games').get(this.props.gameID)).cursor;
  }

  historyLength() {
    return gameFromImmutable(this.props.gameplay.get('games').get(this.props.gameID)).history.length;
  }

  stepBack() {
    this.props.dispatchMoveCursorAction(this.props.gameID, this.currentCursorValue()-1);
  }

  stepForward() {
    this.props.dispatchMoveCursorAction(this.props.gameID, this.currentCursorValue()+1);
  }

  moveToStart() {
    this.props.dispatchMoveCursorAction(this.props.gameID, 0);
  }

  moveToEnd() {
    this.props.dispatchMoveCursorAction(this.props.gameID, this.historyLength());
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

const mapStateToProps = (state) => {
  return {
    gameplay: state.get('gameplay')
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchMoveCursorAction: (gameID, cursor) => {
      dispatch(createMoveCursorAction(gameID, cursor));
    },
  };
};

export const PlayButtonsContainer = withStyles(s)(connect(mapStateToProps, mapDispatchToProps)(PlayButtons));
