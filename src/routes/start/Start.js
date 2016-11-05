/**
 * Created by jason on 10/4/16.
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Layout from '../../components/Layout';
import history from '../../core/history';

import { gameFromImmutable } from '../../store/model/gameState';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import { newGameAction } from '../../actions/gameplay.js';
import { setRuntimeVariable } from '../../actions/runtime.js';

import {
  Grid, Row, Col,
  Button, Jumbotron
} from 'react-bootstrap';
import s from './Start.css';

class Start extends Component {

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    if (!window.ChessBoard3.webGLEnabled()) {
      this.props.dispatchNo3D('no3D', true);
    }
  }

  handleNewGameClick = (event) => {
    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }
    if (event.defaultPrevented === true) {
      return;
    }
    event.preventDefault();
    this.props.dispatchNewGame(this.props.clientID, 'defaultGame');
    history.push('/play');
  };

  handleResumeGameClick = (event) => {
    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }
    if (event.defaultPrevented === true) {
      return;
    }
    event.preventDefault();
    history.push('/play');
  };

  render() {
    const clientID = this.props.clientID;
    const gameID = 'defaultGame';
    const gameplay = this.props.gameplay;
    const currentGame = gameplay.getIn([clientID, 'games', gameID]);
    console.log("currentGame: " + currentGame);
    console.log("JSON: " + JSON.stringify(currentGame));
    let btn = '';
    if (currentGame) {
      const gm = gameFromImmutable(currentGame);
      // See if existing game is blank
      if (gm.history.length > 0) {
        btn = <Button href="/play" bsStyle="primary" onClick={this.handleResumeGameClick.bind(this)}>Resume Game</Button>;
      }
    }

    return <Layout>
        <Grid>
          <Row>
            <Col md={4}>
              <Jumbotron>
                <h1>
                  Redux Chess
                </h1>
                <p>
                  <Button href='/play'
                          bsStyle="primary"
                          onClick={this.handleNewGameClick.bind(this)}>New Game...</Button>
                  {btn}
                </p>
              </Jumbotron>
            </Col>
            <Col md={8}>
              <img src="/redux_chess.jpg"></img>
            </Col>
          </Row>
        </Grid>
      </Layout>;
  }
}
const mapStateToProps = (state) => {

  const clientID = state.getIn(['runtime', 'clientID']);

  return {
    clientID,
    gameplay: state.get('gameplay')
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchNo3D: () => {
      dispatch(setRuntimeVariable('no3D', true));
    },
    dispatchNewGame: (clientID, gameID) => {
      dispatch(newGameAction('server', clientID, gameID));
    }
  }
};

export const StartContainer = withStyles(s)(connect(mapStateToProps, mapDispatchToProps)(Start));
