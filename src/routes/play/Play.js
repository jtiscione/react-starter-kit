/**
 * Created by Jason on 6/16/2016.
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import GameBoard from '../../components/GameBoard';
import MoveHistoryTable from '../../components/MoveHistoryTable';

import withStyles from 'isomorphic-style-loader/lib/withStyles';

import { createNewGameAction,
  createMakeMoveAction,
  createMoveCursorAction } from '../../actions/gameplay.js';

import {
  Grid, Row, Col,
  Tabs, Tab
} from 'react-bootstrap';
import s from './Play.css';

class Play extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      tabKey: 3
    }
  }

  handleTabSelect(tabKey) {
    this.setState({tabKey});
  }

  render() {
    if (process.env.BROWSER) {
      if (!window.ChessBoard3.webGLEnabled()) {
        setTimeout(() => {
          this.setState({
            tabKey: 2
          });
        }, 5000);
      }
    }
    const clientID = this.props.clientID;
    const gameID = 'defaultGame';
    if (!this.props.gameplay.getIn([clientID, 'games', gameID])) {
      this.props.dispatchNewGame(clientID, gameID);
    }

    return (
      <div className={s.root}>
        <Grid>
          <Row>
            <Col xsHidden smHidden md={2} >
              <MoveHistoryTable
                clientID={clientID}
                gameID={gameID}
                gameplay={this.props.gameplay}
                dispatchMoveCursor={this.props.dispatchMoveCursor}
              />
            </Col>
            <Col md={8} lg={8}>
              <Tabs defaultActiveKey={this.state.tabKey} onSelect={this.handleTabSelect.bind(this)} id="board-dimension">
                <Tab eventKey={2} title="2D">
                </Tab>
                <Tab eventKey={3} title="3D">
                </Tab>
              </Tabs>
              <GameBoard
                clientID={clientID}
                gameID={gameID}
                dimensions={this.state.tabKey}
                gameplay={this.props.gameplay}
                dispatchNewGame={this.props.dispatchNewGame}
                dispatchMakeMove={this.props.dispatchMakeMove}
              />
            </Col>
            <Col xsHidden smHidden md={2}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

Play.contextTypes = { setTitle: PropTypes.func.isRequired };

let clientID;

const mapStateToProps = (state) => {
  clientID = state.getIn(['runtime', 'clientID']);

  return {
    clientID,
    gameplay: state.get('gameplay')
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchNewGame: (clientID, gameID) => {
      dispatch(createNewGameAction(clientID, gameID));
    },
    dispatchMakeMove: (clientID, gameID, move) => {
      dispatch(createMakeMoveAction(clientID, gameID, move));
    },
    dispatchMoveCursor: (clientID, gameID, cursor) => {
      dispatch(createMoveCursorAction(clientID, gameID, cursor));
    }
  };
};

export const PlayContainer = withStyles(s)(connect(mapStateToProps, mapDispatchToProps)(Play));
