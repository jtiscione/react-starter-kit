import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './GameBoard.css';

const uuid = require ('uuid');

import { createNewGameAction, createMakeMoveAction } from '../../actions/gameplay.js';

import {
  gameFromImmutable,
  legalTargetSquares,
} from '../../store/model/gameState.js';

import Board from '../Board';

const $ = require('jquery');

export class GameBoard extends Component {

  static propTypes = {
    gameID: PropTypes.string.isRequired,
    dimensions: PropTypes.number.isRequired,
    gameplay: PropTypes.object,
    dispatchNewGame: PropTypes.func,
    dispatchMakeMove: PropTypes.func,
  };

  constructor(...args) {
    super(...args);
    this.state = { appIsMounted: false };
  }

  componentDidMount() {
    // Re-render for isomorphic purposes
    requestAnimationFrame(() => {
      this.setState({ appIsMounted: true });
    });
  }

  makeMove(from, to) {
    this.props.dispatchMakeMove(this.props.gameID, { from, to });
  }

  targetSquares(sq) {
    const gameData = this.props.gameplay.get('games').get(this.props.gameID);
    const game = gameFromImmutable(gameData);
    return legalTargetSquares(game.fen(), sq);
  }

  render() {
    const gameID = this.props.gameID;

    let fen = null;

    if (this.state.appIsMounted) {
      let game = null;
      let gameData = null;
      if (this.props.gameplay) {
        gameData = this.props.gameplay.get('games').get(gameID);
        game = gameFromImmutable(gameData);
        fen = game.fen();
      }
    }
    if (fen) {
      return (
        <div className={s.outer}>
          <Board
            fen={fen}
            divID={uuid.v4()}
            dimensions = {this.props.dimensions}
            allowMoves={true}
            targetSquares={this.targetSquares.bind(this)}
            makeMove={this.makeMove.bind(this)}
          />
        </div>
      );
    }
    return (
      <div className={s.outer}>
        <div className={s.cs_loader}>
          <div className={s.cs_loader_inner}>
            <label>	●</label>
            <label>	●</label>
            <label>	●</label>
            <label>	●</label>
            <label>	●</label>
            <label>	●</label>
          </div>
        </div>
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
    dispatchNewGame: (gameID) => {
      dispatch(createNewGameAction(gameID));
    },
    dispatchMakeMove: (gameID, move) => {
      dispatch(createMakeMoveAction(gameID, move));
    },
  };
};

export const GameBoardContainer = withStyles(s)(connect(mapStateToProps, mapDispatchToProps)(GameBoard));
