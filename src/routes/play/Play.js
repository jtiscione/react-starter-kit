/**
 * Created by Jason on 6/16/2016.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Grid, Row, Col,
  Tabs, Tab,
} from 'react-bootstrap';
import Layout from '../../components/Layout';
import GameBoard from '../../components/GameBoard';
import MoveHistoryTable from '../../components/MoveHistoryTable';
import CollapsibleArea from '../../components/CollapsibleArea';
import OpeningBookTable from '../../components/OpeningBookTable';
import ScoreGauge from '../../components/ScoreGauge';
import { gameFromImmutable } from '../../store/model/gameState';
import { newGameAction,
  makeMoveAction,
  moveCursorAction,
  setHighlightSANAction } from '../../actions/gameplay';
import s from './Play.css';

class Play extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      tabKey: 3,
      renderCount: 0,
    };
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
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ renderCount: this.state.renderCount + 1 });
    }
  }

  setHighlightSAN(clientID, gameID, san) {
    this.props.dispatchSetHighlightSAN(clientID, gameID, san);
  }

  makeUserMove(clientID, gameID, move) {
    const immGame = this.props.gameplay.getIn([clientID, 'games', gameID]);
    const game = gameFromImmutable(immGame);
    const turn = game.toChessObject().turn();
    if ((game.white === 'YOU' && turn === 'w') || (game.black === 'YOU' && turn === 'b')) {
      this.props.dispatchMakeMove(clientID, gameID, move);
    }
  }

  handleTabSelect(tabKey) {
    this.setState({ tabKey });
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
                <Tabs defaultActiveKey={this.state.tabKey} onSelect={(...args) => this.handleTabSelect(...args)} id="board-dimension">
                  <Tab eventKey={2} title="2D" />
                  <Tab eventKey={3} title="3D" />
                </Tabs>
                <GameBoard
                  clientID={clientID}
                  gameID={gameID}
                  dimensions={this.state.tabKey}
                  gameplay={this.props.gameplay}
                  dispatchNewGame={this.props.dispatchNewGame}
                  dispatchMakeMove={(...args) => this.makeUserMove(...args)}
                />
              </Col>
              <Col xsHidden smHidden md={2}>
                <CollapsibleArea>
                  <OpeningBookTable
                    label="OPENINGS"
                    clientID={clientID}
                    gameID={gameID}
                    gameplay={this.props.gameplay}
                    dispatchMakeMove={(...args) => this.makeUserMove(...args)}
                    dispatchSetHighlightSAN={(...args) => this.setHighlightSAN(...args)}
                  />
                  <ScoreGauge
                    label="SCORE"
                    clientID={clientID}
                    gameID={gameID}
                    gameplay={this.props.gameplay}
                  />
                </CollapsibleArea>
              </Col>
            </Row>
          </Grid>
        </div>
      </Layout>
    );
  }
}

Play.propTypes = {
  clientID: PropTypes.string.isRequired,
  gameplay: PropTypes.object.isRequired,   // eslint-disable-line react/forbid-prop-types
  dispatchNewGame: PropTypes.func.isRequired,
  dispatchMakeMove: PropTypes.func.isRequired,
  dispatchSetHighlightSAN: PropTypes.func.isRequired,
  dispatchMoveCursor: PropTypes.func.isRequired,
};

Play.defaultProps = {};

let clientID;

const mapStateToProps = (state) => {
  clientID = state.getIn(['runtime', 'clientID']);

  return {
    clientID,
    gameplay: state.get('gameplay'),
  };
};

// eslint-disable-next-line arrow-body-style
const mapDispatchToProps = (dispatch) => {
  return {
    dispatchNewGame: (_clientID, _gameID) => {
      dispatch(newGameAction('server', _clientID, _gameID));
    },
    dispatchMakeMove: (_clientID, _gameID, move) => {
      dispatch(makeMoveAction('server', _clientID, _gameID, move, 'book'));
    },
    dispatchMoveCursor: (_clientID, _gameID, cursor) => {
      dispatch(moveCursorAction('server', _clientID, _gameID, cursor));
    },
    dispatchSetHighlightSAN: (_clientID, _gameID, san) => {
      dispatch(setHighlightSANAction(_clientID, _gameID, san));
    },
  };
};

// eslint-disable-next-line import/prefer-default-export
export const PlayContainer = withStyles(s)(connect(mapStateToProps, mapDispatchToProps)(Play));
