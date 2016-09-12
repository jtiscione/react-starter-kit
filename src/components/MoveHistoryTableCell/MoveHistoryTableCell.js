import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './MoveHistoryTableCell.css';
import cx from 'classnames';

import {Glyphicon} from 'react-bootstrap';

class MoveHistoryTableCell extends Component {

  static propTypes = {
    side: PropTypes.string.isRequired,
    san: PropTypes.string.isRequired,
    clickFunction: PropTypes.func.isRequired,
    faint: PropTypes.bool,
    hot: PropTypes.bool
  };

  render() {
    const san = this.props.san;
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

    const side = this.props.side;
    const sideClassIcon = this.props.faint ? "faint"+side : side;
    const sideClassText = this.props.faint ? "faintblack" : "black";

    const classes = cx(s.cell, s[sideClassIcon]);
    return <td className={classes} onClick={this.props.clickFunction}>
      {glyph}
      <span className={this.props.hot ? cx(s.current, s[sideClassText]) : s[sideClassText]}>{san}</span>
    </td>;
  }
}

export default withStyles(s)(MoveHistoryTableCell);
