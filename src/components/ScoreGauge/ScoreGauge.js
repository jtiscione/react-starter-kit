import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import { gameFromImmutable } from '../../store/model/gameState';

import s from './ScoreGauge.css';

function calcScoreAndAngle(props) {
  const gameState = gameFromImmutable(props.gameplay.getIn([props.clientID, 'games', props.gameID]));
  let score = 0;
  const currMove = gameState.history[gameState.cursor - 1];
  if (currMove) {
    if (currMove.score === undefined) {
      return null;
    }
    score = currMove.score;
  }
  let rotationAngle = (90 * score) / 2500;
  if (rotationAngle > 90) {
    rotationAngle = 90;
  }
  if (rotationAngle < -90) {
    rotationAngle = -90;
  }
  return { score, rotationAngle };
}

class ScoreGauge extends React.Component {

  static PropTypes = {
    clientID: PropTypes.string.isRequired,
    gameID: PropTypes.string.isRequired,
    gameplay: PropTypes.object.isRequired,  // eslint-disable-line react/forbid-prop-types
  };

  state = {
    score: 0,
    rotationAngle: 0,
  };


  componentWillReceiveProps(nextProps) {
    const scoreAndAngle = calcScoreAndAngle(nextProps);
    if (scoreAndAngle) {
      this.setState(scoreAndAngle);
    }
    return true;
  }

  render() {
    return (
      <div className={s.outer}>
        <svg width="150" height="120">
          <defs>
            <linearGradient id="grad" x1="0" x2="1" y1="0" y2="0" >
              <stop offset="0%" stopColor="black" />
              <stop offset="100%" stopColor="white" />
            </linearGradient>
          </defs>
          <text
            style={{ fontFamily: 'Lucidia Sans, Geneva, Verdana, sans-serif',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
            x="75"
            y="5"
            fill="black"
            textAnchor="middle"
            alignmentBaseline="central"
          >
              WHITE&apos;S ADVANTAGE
          </text>
          <path id="arc" stroke="black" strokeWidth="1" d="M 140 90 A 60 60 0 0 0 10 90 L 30 90 A 45 45 0 0 1 120 90 L 140 90" fill="url(#grad)" />
          <path id="needle" stroke="#A00000" strokeWidth="1" d="M 72 55 L 75 15 L 77 55 Z" fill="red" transform={`rotate(${this.state.rotationAngle}, 75, 90)`} />
          <text
            style={{
              fontFamily: 'Lucidia Sans, Geneva, Verdana, sans-serif',
              fontSize: '18px',
              fontWeight: 'bold',
            }}
            x="75" y="80" fill="black" textAnchor="middle" alignmentBaseline="central"
          >{this.state.score}</text>
          <text
            style={{ fontFamily: 'Lucidia Sans, Geneva, Verdana, sans-serif',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
            x="75"
            y="100"
            fill="black"
            textAnchor="middle"
            alignmentBaseline="central"
          >
            CENTIPAWNS
          </text>
        </svg>
      </div>
    );
  }

}

export default withStyles(s)(ScoreGauge);
