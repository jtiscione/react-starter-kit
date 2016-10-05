/**
 * Created by jason on 10/4/16.
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Layout from '../../components/Layout';


import { gameFromImmutable } from '../../store/model/gameState';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import { newGameAction } from '../../actions/gameplay.js';
import { setRuntimeVariable } from '../../actions/runtime.js';

import {
  Grid, Row, Col,
  Tabs, Tab
} from 'react-bootstrap';
import s from './Start.css';

class Start extends Component {

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    if (!window.ChessBoard3.webGLEnabled()) {
      this.props.dispatchSetRuntimeVariable('no3D', true);
    }
  }

  render() {
    const clientID = this.props.clientID;
    const gameID = 'defaultGame';
    return 'placeholder';
  }
}
const mapStateToProps = (state) => {

  clientID = state.getIn(['runtime', 'clientID']);

  return {
    clientID,
    gameplay: state.get('gameplay')
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchSetRuntimeVariable(name, value) {
      dispatch(setRuntimeVariable('no3D', true));
    },
    dispatchNewGame: (clientID, gameID) => {
      dispatch(newGameAction('browser', clientID, gameID));
    }
  }
};

export const StartContainer = withStyles(s)(connect(mapStateToProps, mapDispatchToProps)(Start));
