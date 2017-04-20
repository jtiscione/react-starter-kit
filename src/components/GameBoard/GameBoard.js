import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './GameBoard.css';

import {
  gameFromImmutable,
  legalTargetSquares,
  sanHighlightSquares,
} from '../../store/model/gameState.js';

import Board from '../Board';

const uuid = require('uuid');

class GameBoard extends Component {

  static propTypes = {
    clientID: PropTypes.string.isRequired,
    gameID: PropTypes.string.isRequired,
    dimensions: PropTypes.number.isRequired,
    gameplay: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    dispatchMakeMove: PropTypes.func.isRequired,
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
    this.props.dispatchMakeMove(this.props.clientID, this.props.gameID, { from, to });
  }

  targetSquares(mouseoverSq) {
    const gameData = this.props.gameplay.getIn([this.props.clientID, 'games', this.props.gameID]);
    const game = gameFromImmutable(gameData);
    return legalTargetSquares(game.fen(), mouseoverSq);
  }

  sanSquares() {
    const gameData = this.props.gameplay.getIn([this.props.clientID, 'games', this.props.gameID]);
    const game = gameFromImmutable(gameData);
    return sanHighlightSquares(game.fen(), game.highlightSAN);
  }

  render() {
    let fen = null;
    let orientation = null;

    if (this.state.appIsMounted) {
      let game = null;
      let gameData = null;
      if (this.props.gameplay) {
        gameData = this.props.gameplay.getIn([this.props.clientID, 'games', this.props.gameID]);
        game = gameFromImmutable(gameData);
        fen = game.fen();
        orientation = (game.white === 'YOU' ? 'white' : 'black');
      }
    }

    if (process.env.BROWSER) {
      if (this.props.dimensions === 3) {
        if (!window.ChessBoard3.webGLEnabled()) {
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
    }

    if (fen) {
      if (this.props.dimensions === 3) {
        return (
          <div className={s.outer}>
            <Board
              fen={fen}
              orientation={orientation}
              divID={uuid.v1()}
              dimensions={this.props.dimensions}
              allowMoves
              targetSquares={(...args) => this.targetSquares(...args)}
              sanSquares={(...args) => this.sanSquares(...args)}
              makeMove={(...args) => this.makeMove(...args)}
            />
          </div>
        );
      }
      return (
        <div className={s.outer}>
          <div className={s.inner}>
            <Board
              fen={fen}
              orientation={orientation}
              divID={uuid.v1()}
              dimensions={this.props.dimensions}
              allowMoves
              targetSquares={(...args) => this.targetSquares(...args)}
              sanSquares={(...args) => this.sanSquares(...args)}
              makeMove={(...args) => this.makeMove(...args)}
            />
          </div>
        </div>);
    }
    /* eslint-disable */
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
    /* eslint-enable */
  }
}

export default withStyles(s)(GameBoard);
