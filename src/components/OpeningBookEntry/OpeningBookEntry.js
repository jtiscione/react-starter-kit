import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OpeningBookEntry.css';

function OpeningBookEntry({ key, san, whiteWins, blackWins, draws, clickFunction}) {
  return(
    <div className={s.outer} onClick={clickFunction}>
      { `${san} : ${whiteWins} / ${blackWins} / ${draws}` }
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
