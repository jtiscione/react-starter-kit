import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Board.css';

class MoveHistoryTable extends Component {

  static propTypes = {
    gameID: PropTypes.string.isRequired
  };

  constructor(...args) {
    super(...args);
  }

  mapStateToProps = (state) => {
    return {
      games: state.gameplay.games,
    };
  };

  mapDispatchToProps = (dispatch) => {
    return {
      dispatchNewGame: (gameID) => {
        dispatch(createNewGameAction(gameID));
      },
      dispatchMakeMove: (gameID, move) => {
        dispatch(createMakeMoveAction(gameID, move));
      },
    };
  };

}
export const MoveHistoryTableContainer = withStyles(s)(connect(mapStateToProps, mapDispatchToProps)(MoveHistoryTable));
