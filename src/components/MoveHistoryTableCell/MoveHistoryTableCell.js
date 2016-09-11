import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './MoveHistoryTableCell.css';
import cx from 'classnames';


import {Table, Button, Glyphicon} from 'react-bootstrap';

class MoveHistoryTableCell extends Component {

  static propTypes = {
    side: PropTypes.string.isRequired,
    san: PropTypes.string.isRequired,
    faint: PropTypes.bool,
    hot: PropTypes.bool
  };

  doNothing() {
    console.log("Do nothing");
  }

  render() {
    console.log("MoveHistoryTableCell.render()");
    const san = this.props.san;
    if (!san) {
      return <span></span>;
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
    const sideClass = this.props.faint ? "faint"+side : side;

    const classes = cx(s.cell, s[sideClass]);
    return <td className={classes} onClick={this.doNothing}>
      {glyph}
      <span className={this.props.hot ? s.red : s.black}>{san}</span>
    </td>;
  }
}

export default withStyles(s)(MoveHistoryTableCell);
