import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './MoveHistoryTableCell.css';
import cx from 'classnames';

import {Glyphicon} from 'react-bootstrap';

function MoveHistoryTableCell({ side, san, clickFunction, faint, hot }) {

  if (!san) {
    return <td><span></span></td>;
  }
  let glyph = '';
  if (san.match(/^K/) || san.match(/^O-O/)) {
    glyph = <Glyphicon glyph="king"></Glyphicon>
  } else if (san.match(/^Q/)) {
    glyph = <Glyphicon glyph="queen"></Glyphicon>
  } else if (san.match(/^R/)) {
    glyph = <Glyphicon glyph="tower"></Glyphicon>
  } else if (san.match(/^B/)) {
    glyph = <Glyphicon glyph="bishop"></Glyphicon>
  } else if (san.match(/^N/)) {
    glyph = <Glyphicon glyph="knight"></Glyphicon>
  } else {
    glyph = <Glyphicon glyph="pawn"></Glyphicon>
  }

  const sideClassIcon = faint ? "faint"+side : side;
  const sideClassText = faint ? "faintblack" : "black";

  const classes = cx(s.cell, s[sideClassIcon]);
  return <td className={classes} onClick={clickFunction}>
    {glyph}
    <span className={hot ? cx(s.current, s[sideClassText]) : s[sideClassText]}>{san}</span>
  </td>;
}

MoveHistoryTableCell.propTypes = {
  side: PropTypes.string.isRequired,
  san: PropTypes.string.isRequired,
  clickFunction: PropTypes.func.isRequired,
  faint: PropTypes.bool,
  hot: PropTypes.bool
};

export default withStyles(s)(MoveHistoryTableCell);
