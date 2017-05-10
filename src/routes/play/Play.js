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
import { GameBoardContainer } from '../../components/GameBoard';
import { MoveHistoryTableContainer } from '../../components/MoveHistoryTable';
import CollapsibleArea from '../../components/CollapsibleArea';
import { OpeningBookTableContainer } from '../../components/OpeningBookTable';
import ScoreGauge from '../../components/ScoreGauge';
import { newGameAction } from '../../actions/gameplay';
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
                <MoveHistoryTableContainer
                  clientID={clientID}
                  gameID={gameID}
                />
              </Col>
              <Col md={8} lg={8}>
                <Tabs defaultActiveKey={this.state.tabKey} onSelect={(...args) => this.handleTabSelect(...args)} id="board-dimension">
                  <Tab eventKey={2} title="2D" />
                  <Tab eventKey={3} title="3D" />
                </Tabs>
                <GameBoardContainer
                  clientID={clientID}
                  gameID={gameID}
                  dimensions={this.state.tabKey}
                />
              </Col>
              <Col xsHidden smHidden md={2}>
                <div className={s.rightPane}>
                  <CollapsibleArea>
                    <ScoreGauge
                      label="SCORE"
                      clientID={clientID}
                      gameID={gameID}
                      gameplay={this.props.gameplay}
                    />
                    <OpeningBookTableContainer
                      label="OPENINGS"
                      clientID={clientID}
                      gameID={gameID}
                    />
                  </CollapsibleArea>
                </div>
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
  };
};

// eslint-disable-next-line import/prefer-default-export
export const PlayContainer = withStyles(s)(connect(mapStateToProps, mapDispatchToProps)(Play));
