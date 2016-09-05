import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  ButtonGroup,
  Glyphicon,
} from 'react-bootstrap';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Game.css';

import { createNewGameAction, createMakeMoveAction } from '../../actions/gameplay.js';

import {
  GameState,
  legalTargetSquares,
} from '../../store/model/gameState.js';

import Board from '../Board';

export class Game extends Component {

  static propTypes = {
    gameID: PropTypes.string.isRequired,
    games: PropTypes.object,
    dispatchNewGame: PropTypes.func,
    dispatchMakeMove: PropTypes.func,
  };

  constructor(...args) {
    super(...args);
    this.state = { appIsMounted: false };
  }

  componentWillMount() {
    if (!this.props.games || !this.props.games[this.props.gameID]) {
      this.props.dispatchNewGame(this.props.gameID);
    }
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
    const gameData = this.props.games[this.props.gameID];
    const game = new GameState(gameData.initialFEN, gameData.history, gameData.cursor);
    return legalTargetSquares(game.fen(), sq);
  }

  render() {
    const gameID = this.props.gameID;
    const divID = `div_${gameID}`;

    let fen = null;

    if (this.state.appIsMounted) {
      let game = null;
      let gameData = null;
      if (this.props.games) {
        gameData = this.props.games[gameID];
        game = new GameState(gameData.initialFEN,
          gameData.history,
          gameData.cursor);
        fen = game.fen();
      }
    }
    let fenLabel = '';
    if (fen) {
      fenLabel = fen;
    }

    return (
      <div className="panel panel-primary">
        <div className="panel-header">
          {fenLabel}
        </div>
        <div className="panel-body">
          {fen ?
            <Board
              fen={fen}
              divID={divID}
              allowMoves={true}
              targetSquares={this.targetSquares.bind(this)}
              makeMove={this.makeMove.bind(this)}
            />
            :
            'LOADING...'
          }
        </div>
        <div className="panel-footer clearfix btn-block">
          <ButtonGroup justified>
            <Button bsClass={s.fatbutton}>
              <Glyphicon glyph="fast-backward" />
            </Button>
            <Button bsClass={s.fatbutton}>
              <Glyphicon glyph="step-backward" />
            </Button>
            <Button bsClass={s.fatbutton}>
              <Glyphicon glyph="step-forward" />
            </Button>
            <Button bsClass={s.fatbutton}>
              <Glyphicon glyph="fast-forward" />
            </Button>
          </ButtonGroup>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    games: state.gameplay.games,
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

export const GameContainer = withStyles(s)(connect(mapStateToProps, mapDispatchToProps)(Game));
