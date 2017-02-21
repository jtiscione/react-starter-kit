import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Grid, Row, Col,
  Button, ButtonGroup, Jumbotron,
} from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from '../../components/Layout';
import history from '../../core/history';
import { gameFromImmutable } from '../../store/model/gameState';
import { newGameAction } from '../../actions/gameplay.js';
import { setRuntimeVariable } from '../../actions/runtime.js';

import s from './Start.css';


function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

class Start extends Component {

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
    // console.log("currentGame: " + currentGame);
    // console.log("JSON: " + JSON.stringify(currentGame));
    let btn = <Button href="/play" bsStyle="primary" onClick={(...args) => this.handleNewGameClick(...args)}>New Game...</Button>;
    if (currentGame) {
      const gm = gameFromImmutable(currentGame);
      // See if existing game is blank
      if (gm.history.length > 0) {
        btn = (<ButtonGroup>
          {btn}
          <Button href="/play" bsStyle="primary" onClick={(...args) => this.handleResumeGameClick(...args)}>Resume Game</Button>
        </ButtonGroup>);
      }
    }

    return (<Layout>
      <Grid>
        <Row>
          <Col md={4}>
            <Jumbotron>
              <h1>
                Redux Chess
              </h1>
              <p>
                {btn}
              </p>
            </Jumbotron>
          </Col>
          <Col md={8}>
            <img alt="" src="/redux_chess.jpg" />
          </Col>
        </Row>
      </Grid>
    </Layout>);
  }
}

Start.propTypes = {
  dispatchNo3D: PropTypes.func.isRequired,
  dispatchNewGame: PropTypes.func.isRequired,
  clientID: PropTypes.string.isRequired,
  gameplay: PropTypes.object.isRequired, //eslint-disable-line react/forbid-prop-types
};

const mapStateToProps = (state) => {
  const clientID = state.getIn(['runtime', 'clientID']);
  return {
    clientID,
    gameplay: state.get('gameplay'),
  };
};

// eslint-disable-next-line arrow-body-style
const mapDispatchToProps = (dispatch) => {
  return {
    dispatchNo3D: () => {
      dispatch(setRuntimeVariable('no3D', true));
    },
    dispatchNewGame: (clientID, gameID) => {
      dispatch(newGameAction('server', clientID, gameID));
    },
  };
};

// eslint-disable-next-line import/prefer-default-export
export const StartContainer = withStyles(s)(connect(mapStateToProps, mapDispatchToProps)(Start));
