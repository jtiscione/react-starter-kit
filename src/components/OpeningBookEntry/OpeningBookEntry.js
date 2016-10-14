import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OpeningBookEntry.css';

function OpeningBookEntry({ key, san, whiteWins, blackWins, draws, clickFunction}) {


  //<td>Move</td><td>Games</td><td>White/Draw/Black</td>

  const all = whiteWins + blackWins + draws;

  const whitePercentage = (0.1 * Math.round((whiteWins / all) * 1000)) + '%';
  const blackPercentage = (0.1 * Math.round((blackWins / all) * 1000)) + '%';
  const drawPercentage = (0.1 * Math.round((draws / all) * 1000)) + '%';

  //const percentages = whitePercentage + "/" + blackPercentage + "/" + drawPercentage;

  return(
    <tr className={s.row} onClick={clickFunction}>
      <td>{san}</td>
      <td>{all}</td>
      <td>
        <div className={s.bar}>
          <span className="white" style={{width: whitePercentage }}>{whitePercentage}</span>
          <span className="draws" style={{width : drawPercentage }}>&nbsp;</span>
          <span className="black" style={{width: blackPercentage }}>{blackPercentage}</span>
        </div>
      </td>
    </tr>
  );
}

OpeningBookEntry.propTypes = {
  key: PropTypes.number,
  san: PropTypes.string.isRequired,
  whiteWins: PropTypes.number.isRequired,
  blackWins: PropTypes.number.isRequired,
  draws: PropTypes.number.isRequired,
  clickFunction: PropTypes.func.isRequired
};

export default withStyles(s)(OpeningBookEntry);
