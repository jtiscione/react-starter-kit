/**
 * Created by Jason on 6/16/2016.
 */
import React, { PropTypes } from 'react';

import {
  Grid,
  Row,
  Col,
} from 'react-bootstrap';

import {GameBoardContainer} from '../../components/GameBoard';
import {MoveHistoryTableContainer} from '../../components/MoveHistoryTable';
import {PlayButtonsContainer} from '../../components/PlayButtons';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Play.css';

function Play(props, context) {
  return (
    <div className={s.root}>
      <div className={s.content}>
        <Grid>
          <Row className="show-grid">
            <Col xs={12} sm={12} md={8} lg={8}>
              <GameBoardContainer gameID="defaultGame" dimensions={3} gridCols={8}/>
            </Col>
            <Col xs={6} sm={6} md={2} lg={2}>
              <MoveHistoryTableContainer gameID="defaultGame"/>
              <PlayButtonsContainer gameID="defaultGame"/>
            </Col>
            <Col xs={6} sm={6} md={2} lg={2}>
              <GameBoardContainer gameID="defaultGame" dimensions={2} gridCols={2}/>
            </Col>
          </Row>
        </Grid>
      </div>
    </div>
  );
}

Play.contextTypes = { setTitle: PropTypes.func.isRequired };
export default withStyles(s)(Play);
