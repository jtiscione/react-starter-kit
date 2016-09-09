import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './GameBoard.css';

const uuid = require ('uuid');

import { createNewGameAction, createMakeMoveAction } from '../../actions/gameplay.js';

import {
  GameState,
  legalTargetSquares,
} from '../../store/model/gameState.js';

import Board from '../Board';

const $ = require('jquery');

export class GameBoard extends Component {

  static propTypes = {
    gameID: PropTypes.string.isRequired,
    dimensions: PropTypes.number.isRequired,
    gridCols: PropTypes.number.isRequired,
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
    let divClass = null;
    switch(this.props.gridCols) {
      case 8:
        divClass = (this.props.dimensions===3 ? s.box8_43 : s.box8_sq);
        break;
      default:
    }
    //console.log("fen is "+fen);
    //console.log("divClass is "+divClass);
    //console.log("dimensions "+this.props.dimensions);
    if (fen) {
      return (
        <Board
          fen={fen}
          divID={uuid.v4()}
          divClass = {divClass}
          dimensions = {this.props.dimensions}
          allowMoves={true}
          targetSquares={this.targetSquares.bind(this)}
          makeMove={this.makeMove.bind(this)}
        />
      );
    }
    return (
      <div className={divClass}>
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

export const GameBoardContainer = withStyles(s)(connect(mapStateToProps, mapDispatchToProps)(GameBoard));


/*
 const voided = function(){

 connect( (state) => {
 return {
 name: 'Jason Tiscione',
 phone: '408-916-6477',
 email: 'tiscione@gmail.com',
 location: 'Salt Lake City, UT',
 status: 'available',
 ...state
 };
 }, (dispatch) => {
 return {
 reply: (interested) => {
 if (interested)
 dispatch(takeActions.acceptJob({time: Date.now()}));
 }
 };
 }
 );

 };
 */
