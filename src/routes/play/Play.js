/**
 * Created by Jason on 6/16/2016.
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Layout from '../../components/Layout';
import GameBoard from '../../components/GameBoard';
import MoveHistoryTable from '../../components/MoveHistoryTable';
import { gameFromImmutable } from '../../store/model/gameState';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import { newGameAction,
  makeMoveAction,
  moveCursorAction } from '../../actions/gameplay.js';

import {
  Grid, Row, Col,
  Tabs, Tab
} from 'react-bootstrap';
import s from './Play.css';

class Play extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      tabKey: 3,
      renderCount: 0
    }
  }

  handleTabSelect(tabKey) {
    this.setState({tabKey});
  }

  makeUserMove(clientID, gameID, move) {
    const immGame = this.props.gameplay.getIn([clientID, 'games', gameID]);
    const game = gameFromImmutable(immGame);
    const turn = game.toChessObject().turn();
    if ((game.white == 'YOU' && turn == 'w') || (game.black == 'YOU' && turn == 'b')) {
      this.props.dispatchMakeMove(clientID, gameID, move);
    }
  }

  componentDidMount() {
    if (!window.ChessBoard3.webGLEnabled()) {
      requestAnimationFrame(() => {
        this.setState({ tabKey: 2 });
      });
    }
    const clientID = this.props.clientID;
    const gameID = 'defaultGame';
    if (!this.props.gameplay.getIn([clientID, 'games', gameID])) {
      this.props.dispatchNewGame(clientID, gameID);
    } else {
      // The user wasn't allowed to make this move, but chessboard.js is showing the bad position.
      // This should get it to re-render.
      this.setState({ renderCount: this.state.renderCount + 1 });
    }
  }

  render() {
    const clientID = this.props.clientID;
    const gameID = 'defaultGame';

    return (
      <Layout>
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
                  dispatchMakeMove={this.makeUserMove.bind(this)}
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
      </Layout>
    );
  }
}


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
      dispatch(newGameAction('browser', clientID, gameID));
    },
    dispatchMakeMove: (clientID, gameID, move) => {
      dispatch(makeMoveAction('browser', clientID, gameID, move, 'book'));
    },
    dispatchMoveCursor: (clientID, gameID, cursor) => {
      dispatch(moveCursorAction('browser', clientID, gameID, cursor));
    },
  };
};

export const PlayContainer = withStyles(s)(connect(mapStateToProps, mapDispatchToProps)(Play));
