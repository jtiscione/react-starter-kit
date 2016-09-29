import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './GameBoard.css';

const uuid = require ('uuid');

import {
  gameFromImmutable,
  legalTargetSquares,
} from '../../store/model/gameState.js';

import Board from '../Board';

const $ = require('jquery');

export class GameBoard extends Component {

  static propTypes = {
    clientStoreID: PropTypes.string.isRequired,
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
    this.props.dispatchMakeMove(this.props.clientStoreID, this.props.gameID, { from, to });
  }

  targetSquares(sq) {
    const gameData = this.props.gameplay.getIn([this.props.clientStoreID, 'games', this.props.gameID]);
    const game = gameFromImmutable(gameData);
    return legalTargetSquares(game.fen(), sq);
  }

  render() {
    let fen = null;

    if (this.state.appIsMounted) {
      let game = null;
      let gameData = null;
      if (this.props.gameplay) {
        gameData = this.props.gameplay.getIn([this.props.clientStoreID, 'games', this.props.gameID]);
        game = gameFromImmutable(gameData);
        fen = game.fen();
      }
    }

    /*
    if (this.props.dimensions === 3) {
      // window function set by chessboard3.js
      if (window && !window.ChessBoard3.webGLEnabled()) {
        return (
          <div className={s.outer}>
            <div className={s.cs_loader}>
              <div className={s.cs_loader_inner}>
                This browser does not support webGL.
              </div>
            </div>
         </div>
        );
      }
    }
    */

    if (fen) {
      if (this.props.dimensions === 3) {
        return (
          <div className={s.outer}>
            <Board
              fen={fen}
              divID={uuid.v1()}
              dimensions={this.props.dimensions}
              allowMoves={true}
              targetSquares={this.targetSquares.bind(this)}
              makeMove={this.makeMove.bind(this)}
            />
          </div>
        );
      } else {
        return (
          <div className={s.outer}>
            <div className={s.inner}>
              <Board
                fen={fen}
                divID={uuid.v1()}
                dimensions={this.props.dimensions}
                allowMoves={true}
                targetSquares={this.targetSquares.bind(this)}
                makeMove={this.makeMove.bind(this)}
              />
            </div>
        </div>);
      }
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

export default withStyles(s)(GameBoard);
