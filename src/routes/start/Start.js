import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Grid, Row, Col,
  Button, Jumbotron,
} from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from '../../components/Layout';
import history from '../../history';
import NewGameDialog from '../../components/NewGameDialog';
import { gameFromImmutable } from '../../store/model/gameState';
import { newGameAction } from '../../actions/gameplay';
import { setRuntimeVariable } from '../../actions/runtime';


import s from './Start.css';


function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

class Start extends Component {

  constructor(props) {
    super(props);
    this.handleNewGameClick = this.handleNewGameClick.bind(this);
    this.handleResumeGameClick = this.handleResumeGameClick.bind(this);
    this.handleDialogCloseClick = this.handleDialogCloseClick.bind(this);
    this.startNewGame = this.startNewGame.bind(this);
  }

  state = { showModal: false };

  componentDidMount() {
    if (!window.ChessBoard3.webGLEnabled()) {
      this.props.dispatchNo3D('no3D', true);
    }
  }

  handleNewGameClick(event) {
    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }
    if (event.defaultPrevented === true) {
      return;
    }
    event.preventDefault();
    this.setState({ showModal: true });
    // NewGameDialog will call this once dialog OK click comes thru
    // this.startNewGame(null);
  }

  /* eslint-disable class-methods-use-this */
  handleResumeGameClick(event) {
    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }
    if (event.defaultPrevented === true) {
      return;
    }
    event.preventDefault();
    history.push('/play');
  }
  /* eslint-enable class-methods-use-this */

  handleDialogCloseClick() {
    this.setState({ showModal: false });
  }

  startNewGame(level, side) {
    if (side === 'white' || Math.random() < 0.5) {
      this.props.dispatchNewGame(this.props.clientID, 'defaultGame', level, 'YOU', 'COMPUTER');
    } else {
      this.props.dispatchNewGame(this.props.clientID, 'defaultGame', level, 'COMPUTER', 'YOU');
    }
    history.push('/play');
  }

  render() {
    const clientID = this.props.clientID;
    const gameID = 'defaultGame';
    const gameplay = this.props.gameplay;
    const currentGame = gameplay.getIn([clientID, 'games', gameID]);

    // console.log("currentGame: " + currentGame);
    // console.log("JSON: " + JSON.stringify(currentGame));
    let btn = <Button href="/play" bsStyle="primary" onClick={this.handleNewGameClick}>New Game...</Button>;
    if (currentGame) {
      const gm = gameFromImmutable(currentGame);
      // See if existing game is blank
      if (gm.history.length > 0) {
        btn = (<div>
          {btn}
          <Button
            href="/play"
            bsStyle="primary"
            style={{ borderLeft: '10px' }}
            onClick={this.handleResumeGameClick}
          >
            Resume Game
          </Button>
        </div>);
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
            <NewGameDialog
              show={this.state.showModal}
              onHide={this.handleDialogCloseClick}
              onNewGame={this.startNewGame}
            />
          </Col>
          <Col md={8}>
            <img alt="" src="/redux_chess.jpg" className={s.splash} />
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
    dispatchNewGame: (clientID, gameID, level = 1, white, black) => {
      dispatch(newGameAction('server', clientID, gameID, level, white, black));
    },
  };
};

// eslint-disable-next-line import/prefer-default-export
export const StartContainer = withStyles(s)(connect(mapStateToProps, mapDispatchToProps)(Start));
