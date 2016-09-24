/**
 * Created by Jason on 6/16/2016.
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {GameBoardContainer} from '../../components/GameBoard';
import {MoveHistoryTableContainer} from '../../components/MoveHistoryTable';
import {PlayButtonsContainer} from '../../components/PlayButtons';

import withStyles from 'isomorphic-style-loader/lib/withStyles';

import { createNewGameAction } from '../../actions/gameplay.js';

import s from './Play.css';

class Play extends Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {

    const gameID = 'defaultGame';
    if (!this.props.gameplay.get('games') || !this.props.gameplay.get('games').get(gameID)) {
      this.props.dispatchNewGame(gameID);
    }

    return (
      <div className={s.root}>
        <div className={s.container}>
          <div className={s.box2}>
            <MoveHistoryTableContainer gameID={gameID}/>
            <PlayButtonsContainer gameID={gameID}/>
          </div>
          <div className={s.box1}>
            <GameBoardContainer gameID={gameID} dimensions={2}/>
          </div>
          <div className={s.box3}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </div>
        </div>
      </div>
    );
  }
}

Play.contextTypes = { setTitle: PropTypes.func.isRequired };


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
  };
};

export const PlayContainer = withStyles(s)(connect(mapStateToProps, mapDispatchToProps)(Play));
