import React from 'react';
import PropTypes from 'prop-types';
import { Glyphicon } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './MoveHistoryTableCell.css';

function MoveHistoryTableCell({ side, san, clickFunction, faint, hot }) {
  if (!san) {
    return <td />;
  }
  let glyph = '';
  if (san.match(/^K/) || san.match(/^O-O/)) {
    glyph = <Glyphicon glyph="king" />;
  } else if (san.match(/^Q/)) {
    glyph = <Glyphicon glyph="queen" />;
  } else if (san.match(/^R/)) {
    glyph = <Glyphicon glyph="tower" />;
  } else if (san.match(/^B/)) {
    glyph = <Glyphicon glyph="bishop" />;
  } else if (san.match(/^N/)) {
    glyph = <Glyphicon glyph="knight" />;
  } else {
    glyph = <Glyphicon glyph="pawn" />;
  }

  let sideClassIcon;
  if (faint) {
    sideClassIcon = (side === 'white' ? s.faintwhite : s.faintblack);
  } else {
    sideClassIcon = (side === 'white' ? s.white : s.black);
  }

  const sideClassText = faint ? s.faintblack : s.black;

  const classes = cx(s.cell, sideClassIcon);
  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
  return (<td className={classes} onClick={clickFunction}>
    {glyph}
    <span className={hot ? cx(s.current, sideClassText) : sideClassText}>{san}</span>
  </td>);
}

MoveHistoryTableCell.propTypes = {
  side: PropTypes.string.isRequired,
  san: PropTypes.string.isRequired,
  clickFunction: PropTypes.func.isRequired,
  faint: PropTypes.bool,
  hot: PropTypes.bool,
};

MoveHistoryTableCell.defaultProps = {
  faint: false,
  hot: false,
};

export default withStyles(s)(MoveHistoryTableCell);
