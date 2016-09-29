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
    console.log("handleTableSelect: "+this.state.tabKey);
    console.log("tabKey argument: "+tabKey);
    this.setState({tabKey});
    console.log(JSON.stringify(this.state));
  }

  render() {
    const gameID = 'defaultGame';
    if (!this.props.gameplay.get('games') || !this.props.gameplay.get('games').get(gameID)) {
      this.props.dispatchNewGame(gameID);
    }

    return (
      <div className={s.root}>
        <Grid>
          <Row>
            <Col xsHidden smHidden md={2} >
              <MoveHistoryTableContainer gameID={gameID}/>
              <PlayButtonsContainer gameID={gameID}/>
            </Col>
            <Col md={8} lg={8}>
              <Tabs defaultActiveKey={this.state.tabKey} onSelect={this.handleTabSelect.bind(this)} id="board-dimension">
                <Tab eventKey={2} title="2D">
                </Tab>
                <Tab eventKey={3} title="3D">
                </Tab>
              </Tabs>
              <GameBoardContainer gameID={gameID} dimensions={this.state.tabKey}/>
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
