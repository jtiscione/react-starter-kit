import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OpeningBookEntry.css';

function OpeningBookEntry({ key, san, whiteWins, blackWins, draws, clickFunction}) {


  //<td>Move</td><td>Games</td><td>White/Draw/Black</td>

  const all = whiteWins + blackWins + draws;

  const whitePercentage = Math.round((whiteWins / all) * 100);
  const blackPercentage = Math.round((blackWins / all) * 100);
  const drawPercentage = 100 - whitePercentage - blackPercentage; // avoid roundoff errors

  //const percentages = whitePercentage + "/" + blackPercentage + "/" + drawPercentage;

  return(
    <div className={s.row}>
      <div className={s.san} onClick={clickFunction}><code>{san}</code></div>&nbsp;&nbsp;&nbsp;<div className={s.gameCount}>{all}</div>
      <div className={s.bar}>
        <div className={s.white} style={{width: whitePercentage + '%'}} onClick={clickFunction}>
          {(whitePercentage < 20 ? '' : whitePercentage + '%')}
        </div>
        <div className={s.gray} style={{width : drawPercentage + '%'}} onClick={clickFunction}>
          {(drawPercentage < 20 ? '' : drawPercentage + '%')}
        </div>
        <div className={s.black} style={{width: blackPercentage + '%'}} onClick={clickFunction}>
          {(blackPercentage < 20 ? '' : blackPercentage + '%')}
        </div>
      </div>
    </div>
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
